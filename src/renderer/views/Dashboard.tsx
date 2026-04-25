import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../api.js';
import type { AppState, AppAction } from '../state.js';
import type { RankedJob, JobAnalysis, JobKanbanColumn, CompanySource, FeedbackTag } from '../../types.js';
import { FEEDBACK_TAGS } from '../../types.js';
import { QuickStats } from '../components/QuickStats.js';
import { JobCard } from '../components/JobCard.js';
import { NearMissGroup } from '../components/NearMissGroup.js';
import { FeedbackInsights } from '../components/FeedbackInsights.js';
import styles from './Dashboard.module.css';

interface DashboardProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

interface DashboardEntry {
  ranked: RankedJob;
  analyses: JobAnalysis[];
}

interface FeedbackSummary {
  totalRejected: number;
  totalNotApplying: number;
  tagCounts: Record<string, number>;
  recentNotes: string[];
}

const TOP_PICK_THRESHOLD = 75;

export function Dashboard({ state, dispatch }: DashboardProps) {
  const api = useApi();
  const [entries, setEntries] = useState<DashboardEntry[]>([]);
  const [companies, setCompanies] = useState<CompanySource[]>([]);
  const [feedbackSummary, setFeedbackSummary] = useState<FeedbackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState<{ jobId: string; column: JobKanbanColumn } | null>(null);
  const [feedbackTags, setFeedbackTags] = useState<FeedbackTag[]>([]);
  const [feedbackNotes, setFeedbackNotes] = useState('');

  const companyFilter = state.dashboardFilter.companyIds;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobData, fbData, companyList] = await Promise.all([
        api.results.getAllJobs(companyFilter.length > 0 ? companyFilter : undefined),
        api.dashboard.feedbackSummary(companyFilter.length > 0 ? companyFilter : undefined),
        api.companies.list(),
      ]);
      setEntries(jobData);
      setFeedbackSummary(fbData);
      setCompanies(companyList);
    } catch {
      // API may not be available yet
    } finally {
      setLoading(false);
    }
  }, [api, companyFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const allJobs = entries.map((e) => e.ranked);
  const allAnalyses = entries.flatMap((e) => e.analyses);
  const topPicks = allJobs.filter((j) => j.overallScore >= TOP_PICK_THRESHOLD);

  const handleAction = useCallback(async (jobId: string, column: JobKanbanColumn) => {
    if (column === 'rejected' || column === 'not-applying') {
      setFeedbackModal({ jobId, column });
      setFeedbackTags([]);
      setFeedbackNotes('');
      return;
    }

    const companyId = state.pipelineCompanyId ?? companies[0]?.id;
    if (!companyId) return;

    try {
      await api.kanban.move(jobId, companyId, column);
      await loadData();
    } catch {
      // ignore move errors
    }
  }, [api, companies, state.pipelineCompanyId, loadData]);

  const handleFeedbackSubmit = useCallback(async () => {
    if (!feedbackModal) return;
    const companyId = state.pipelineCompanyId ?? companies[0]?.id;
    if (!companyId) return;
    try {
      await api.kanban.move(feedbackModal.jobId, companyId, feedbackModal.column, {
        tags: feedbackTags,
        notes: feedbackNotes || undefined,
      });
      setFeedbackModal(null);
      await loadData();
    } catch { /* ignore */ }
  }, [api, feedbackModal, feedbackTags, feedbackNotes, companies, state.pipelineCompanyId, loadData]);

  const handleOpenDetail = useCallback((jobId: string) => {
    const entry = entries.find((e) => e.ranked.job.id === jobId);
    if (entry) {
      dispatch({ type: 'detail:open', ranked: entry.ranked, analyses: entry.analyses });
    }
  }, [dispatch, entries]);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch({ type: 'dashboard:set-filter', companyIds: value === 'all' ? [] : [value] });
  }, [dispatch]);

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Loading dashboard...</div></div>;
  }

  if (entries.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div>No job data yet.</div>
          <div>Run a pipeline to populate the dashboard.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>Dashboard</span>
        <div className={styles.filterBar}>
          <select
            className={styles.companyFilter}
            value={companyFilter.length === 0 ? 'all' : companyFilter[0]}
            onChange={handleFilterChange}
          >
            <option value="all">All Companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${state.dashboardTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => dispatch({ type: 'dashboard:set-tab', tab: 'overview' })}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${state.dashboardTab === 'triage' ? styles.tabActive : ''}`}
          onClick={() => dispatch({ type: 'dashboard:set-tab', tab: 'triage' })}
        >
          Triage
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.main}>
          {/* Overview Tab */}
          {state.dashboardTab === 'overview' && (
            <>
              <QuickStats jobs={allJobs} analyses={allAnalyses} />
              <FeedbackInsights summary={feedbackSummary} />

              <div className={styles.sectionTitle}>Top Picks</div>
              {topPicks.length === 0 ? (
                <div className={styles.sectionEmpty}>No strong matches yet.</div>
              ) : (
                topPicks.map((ranked) => {
                  const entry = entries.find((e) => e.ranked.job.id === ranked.job.id);
                  return (
                    <JobCard
                      key={ranked.job.id}
                      ranked={ranked}
                      analyses={entry?.analyses}
                      onAction={handleAction}
                      onOpenDetail={handleOpenDetail}
                    />
                  );
                })
              )}

              <NearMissGroup
                jobs={allJobs}
                analyses={allAnalyses}
                onAction={handleAction}
                onOpenDetail={handleOpenDetail}
              />
            </>
          )}

          {/* Triage Tab */}
          {state.dashboardTab === 'triage' && (
            <>
              <div className={styles.triageHeader}>
                <span className={styles.triageCount}>
                  {allJobs.length} job{allJobs.length !== 1 ? 's' : ''} to review
                </span>
              </div>
              {allJobs.map((ranked) => {
                const entry = entries.find((e) => e.ranked.job.id === ranked.job.id);
                return (
                  <JobCard
                    key={ranked.job.id}
                    ranked={ranked}
                    analyses={entry?.analyses}
                    onAction={handleAction}
                    onOpenDetail={handleOpenDetail}
                  />
                );
              })}
            </>
          )}
        </div>

      </div>

      {feedbackModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>
              {feedbackModal.column === 'rejected' ? 'Reject' : 'Not Applying'} — Why?
            </div>
            <div className={styles.tagGrid}>
              {FEEDBACK_TAGS.map((t) => (
                <button
                  key={t.tag}
                  className={`${styles.feedbackTag} ${feedbackTags.includes(t.tag) ? styles.feedbackTagActive : ''}`}
                  onClick={() => setFeedbackTags((prev) =>
                    prev.includes(t.tag) ? prev.filter((x) => x !== t.tag) : [...prev, t.tag]
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <textarea
              className={styles.feedbackNotes}
              placeholder="Optional notes..."
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              rows={3}
            />
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setFeedbackModal(null)}>Cancel</button>
              <button className={styles.modalConfirm} onClick={handleFeedbackSubmit}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
