import React from 'react';
import { useApi } from '../api.js';
import type { AppState, AppAction } from '../state.js';
import { ScoreBar } from '../components/ScoreBar.js';
import styles from './JobDetail.module.css';

interface JobDetailProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export function JobDetail({ state, dispatch }: JobDetailProps) {
  const api = useApi();
  const job = state.results[state.selectedJobIndex];

  if (!job) {
    return (
      <div className={styles.container}>
        <div className={styles.backRow}>
          <button className={styles.backBtn} onClick={() => dispatch({ type: 'view:change', view: 'results' })}>
            Back
          </button>
        </div>
        <div className={styles.empty}>No job selected.</div>
      </div>
    );
  }

  const analyses = (state.analyses ?? []).filter((a) => a.jobId === job.job.id);

  return (
    <div className={styles.container}>
      <div className={styles.backRow}>
        <button className={styles.backBtn} onClick={() => dispatch({ type: 'view:change', view: 'results' })}>
          Back to Results
        </button>
      </div>

      {/* Header */}
      <div className={styles.title}>{job.job.title}</div>
      <div className={styles.companyRow}>
        {job.job.company} &middot; {job.job.location}
        {job.job.remote && <span className={styles.remote}>remote</span>}
      </div>

      {job.job.url && (
        <div className={styles.urlRow}>
          <button className={styles.openBtn} onClick={() => api.openUrl(job.job.url)}>
            Open URL
          </button>
        </div>
      )}

      {/* Scores */}
      <div className={styles.scores}>
        <div className={styles.overallRow}>
          <ScoreBar score={job.overallScore} label="Overall" />
        </div>
        <div className={styles.breakdownGrid}>
          <ScoreBar score={job.scores.skill} label="Skill" />
          <ScoreBar score={job.scores.culture} label="Culture" />
          <ScoreBar score={job.scores.salary} label="Salary" />
        </div>
      </div>

      {/* Summary */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Summary</div>
        <div className={styles.summaryText}>{job.summary}</div>
      </div>

      {/* Red Flags */}
      {job.redFlags.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Red Flags</div>
          {job.redFlags.map((flag, i) => (
            <div key={i} className={styles.redFlag}>{flag}</div>
          ))}
        </div>
      )}

      {/* Analysis */}
      {analyses.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Analysis</div>
          {analyses.map((a) => (
            <div key={a.variant} className={styles.analysisCard}>
              <span className={styles.analysisVariant}>{a.variant}</span>
              <span className={styles.analysisScore}>({a.score})</span>
              <div className={styles.analysisReasoning}>{a.reasoning}</div>
              {a.signals.length > 0 && (
                <div className={styles.analysisSignals}>Signals: {a.signals.join(', ')}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Description</div>
      </div>
      <div className={styles.description}>{job.job.description}</div>
    </div>
  );
}
