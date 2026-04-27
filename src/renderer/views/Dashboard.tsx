import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useApi } from '../api.js';
import type { AppState, AppAction } from '../state.js';
import type { RankedJob, JobAnalysis, JobKanbanColumn, CompanySource, FeedbackTag } from '../../types.js';
import { FEEDBACK_TAGS } from '../../types.js';
import { QuickStats } from '../components/QuickStats.js';
import { JobCard } from '../components/JobCard.js';
import { NearMissGroup } from '../components/NearMissGroup.js';
import { FeedbackInsights } from '../components/FeedbackInsights.js';
import { PipelineHealthBar } from '../components/PipelineHealthBar.js';
import { DashboardFilters } from '../components/DashboardFilters.js';
import type { SortBy } from '../components/DashboardFilters.js';
import { ActivityLog } from '../components/ActivityLog.js';
import { RunSummary } from '../components/RunSummary.js';
import styles from './Dashboard.module.css';

interface DashboardProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

interface DashboardEntry {
  ranked: RankedJob;
  analyses: JobAnalysis[];
  kanbanColumn?: JobKanbanColumn;
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
  const [stageCounts, setStageCounts] = useState<Record<JobKanbanColumn, number> | null>(null);
  const [recentActivity, setRecentActivity] = useState<{ reviewed: number; applied: number; rejected: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState<{ jobId: string; column: JobKanbanColumn } | null>(null);
  const [feedbackTags, setFeedbackTags] = useState<FeedbackTag[]>([]);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [keyword, setKeyword] = useState('');
  const [scoreMin, setScoreMin] = useState(0);
  const [scoreMax, setScoreMax] = useState(100);
  const [visibleColumns, setVisibleColumns] = useState<Set<JobKanbanColumn>>(
    new Set(['new', 'looking-at', 'applying'])
  );
  const [sortBy, setSortBy] = useState<SortBy>('score');

  const companyFilter = state.dashboardFilter.companyIds;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filterArg = companyFilter.length > 0 ? companyFilter : undefined;
      const [jobData, fbData, companyList, stageData, activityData] = await Promise.all([
        api.results.getAllJobs(filterArg),
        api.dashboard.feedbackSummary(filterArg),
        api.companies.list(),
        api.dashboard.stageCounts(filterArg),
        api.dashboard.recentActivity(),
      ]);
      setEntries(jobData);
      setFeedbackSummary(fbData);
      setCompanies(companyList);
      setStageCounts(stageData);
      setRecentActivity(activityData);

      // Fetch latest run summary if not already present
      try {
        const summary = await api.results.getLatestSummary();
        if (summary) dispatch({ type: 'summary:received', summary });
      } catch {
        // summary fetch is non-critical
      }
    } catch {
      // API may not be available yet
    } finally {
      setLoading(false);
    }
  }, [api, companyFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const getTopTag = (summary: FeedbackSummary | null): { tag: string; count: number } | null => {
    if (!summary) return null;
    let topTag: string | null = null;
    let topCount = 0;
    for (const [tag, count] of Object.entries(summary.tagCounts)) {
      if (count > topCount) {
        topTag = tag;
        topCount = count;
      }
    }
    return topTag && topCount >= 2 ? { tag: topTag, count: topCount } : null;
  };

  const allJobs = entries.map((e) => e.ranked);
  const allAnalyses = entries.flatMap((e) => e.analyses);
  const kanbanColumns = new Map(entries.filter((e) => e.kanbanColumn).map((e) => [e.ranked.job.id, e.kanbanColumn!]));

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const { ranked, kanbanColumn } = e;
      if (keyword && !ranked.job.title.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (ranked.overallScore < scoreMin || ranked.overallScore > scoreMax) return false;
      if (kanbanColumn && !visibleColumns.has(kanbanColumn)) return false;
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'score': return b.ranked.overallScore - a.ranked.overallScore;
        case 'company': return a.ranked.job.company.localeCompare(b.ranked.job.company);
        case 'salary': return (b.ranked.scores.salary ?? 0) - (a.ranked.scores.salary ?? 0);
        default: return 0;
      }
    });
  }, [entries, keyword, scoreMin, scoreMax, visibleColumns, sortBy]);

  const filteredJobs = filteredEntries.map((e) => e.ranked);
  const topPicks = filteredJobs.filter((j) => j.overallScore >= TOP_PICK_THRESHOLD);
  const filteredKanbanColumns = new Map(filteredEntries.filter((e) => e.kanbanColumn).map((e) => [e.ranked.job.id, e.kanbanColumn!]));
  const filteredAnalyses = filteredEntries.flatMap((e) => e.analyses);

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
        <button
          className={`${styles.tab} ${state.dashboardTab === 'activity' ? styles.tabActive : ''}`}
          onClick={() => dispatch({ type: 'dashboard:set-tab', tab: 'activity' })}
        >
          Activity
        </button>
      </div>

      {/* Filter bar */}
      <DashboardFilters
        companies={companies}
        selectedCompanyIds={companyFilter}
        onCompanyChange={(ids) => dispatch({ type: 'dashboard:set-filter', companyIds: ids })}
        scoreMin={scoreMin}
        scoreMax={scoreMax}
        onScoreChange={(min, max) => { setScoreMin(min); setScoreMax(max); }}
        keyword={keyword}
        onKeywordChange={setKeyword}
        visibleColumns={visibleColumns}
        onColumnToggle={(col) => setVisibleColumns((prev) => {
          const next = new Set(prev);
          if (next.has(col)) next.delete(col); else next.add(col);
          return next;
        })}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className={styles.body}>
        <div className={styles.main}>
          {/* Overview Tab */}
          {state.dashboardTab === 'overview' && (
            <>
              {state.runSummary && (
                <RunSummary
                  summary={state.runSummary}
                  onDismiss={() => dispatch({ type: 'summary:dismiss' })}
                />
              )}
              {stageCounts && recentActivity && (
                <PipelineHealthBar
                  stageCounts={stageCounts}
                  recentActivity={recentActivity}
                  topRejectionTag={getTopTag(feedbackSummary)}
                  jobs={allJobs}
                />
              )}
              <QuickStats jobs={allJobs} analyses={allAnalyses} />
              <FeedbackInsights summary={feedbackSummary} />

              <div className={styles.sectionTitle}>Top Picks</div>
              {topPicks.length === 0 ? (
                <div className={styles.sectionEmpty}>No strong matches yet.</div>
              ) : (
                topPicks.map((ranked) => {
                  const entry = filteredEntries.find((e) => e.ranked.job.id === ranked.job.id);
                  return (
                    <JobCard
                      key={ranked.job.id}
                      ranked={ranked}
                      analyses={entry?.analyses}
                      kanbanColumn={entry?.kanbanColumn}
                      onAction={handleAction}
                      onOpenDetail={handleOpenDetail}
                    />
                  );
                })
              )}

              <NearMissGroup
                jobs={filteredJobs}
                analyses={filteredAnalyses}
                kanbanColumns={filteredKanbanColumns}
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
                  {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} to review
                </span>
              </div>
              {filteredJobs.map((ranked) => {
                const entry = filteredEntries.find((e) => e.ranked.job.id === ranked.job.id);
                return (
                  <JobCard
                    key={ranked.job.id}
                    ranked={ranked}
                    analyses={entry?.analyses}
                    kanbanColumn={entry?.kanbanColumn}
                    onAction={handleAction}
                    onOpenDetail={handleOpenDetail}
                  />
                );
              })}
            </>
          )}

          {/* Activity Tab */}
          {state.dashboardTab === 'activity' && (
            <ActivityLog
              onOpenDetail={(jobId) => {
                const entry = entries.find((e) => e.ranked.job.id === jobId);
                if (entry) {
                  dispatch({ type: 'detail:open', ranked: entry.ranked, analyses: entry.analyses });
                }
              }}
            />
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
