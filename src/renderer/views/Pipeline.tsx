import React from 'react';
import type { AppState, AppAction } from '../state.js';
import { StageRow } from '../components/StageRow.js';
import styles from './Pipeline.module.css';

interface PipelineProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export function Pipeline({ state, dispatch }: PipelineProps) {
  const hasStages = state.stages.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Pipeline</span>
        <span className={styles.iterBadge}>
          iteration {state.iteration}/{state.maxIterations} {state.done ? '\u2713' : ''}
        </span>
      </div>

      {(state.resumeName || state.model) && (
        <div className={styles.meta}>
          {state.resumeName && <>resume: {state.resumeName}</>}
          {state.resumeName && state.model && <> &nbsp;&middot;&nbsp; </>}
          {state.model && <>model: {state.model}</>}
        </div>
      )}

      {!hasStages && !state.error && (
        <div className={styles.emptyState}>
          <div>No pipeline running.</div>
          <div>Select a company and resume to start.</div>
        </div>
      )}

      {hasStages && (
        <div className={styles.stages}>
          {state.stages.map((s) => (
            <StageRow key={s.id} stage={s} />
          ))}
        </div>
      )}

      {state.error && (
        <div className={styles.error}>Error: {state.error}</div>
      )}

      {state.profile && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Profile</div>
          <div className={styles.profileGrid}>
            <span className={styles.profileLabel}>Name</span>
            <span className={styles.profileValue}>{state.profile.name}</span>
            <span className={styles.profileLabel}>Titles</span>
            <span className={styles.profileValue}>{state.profile.titles.join(', ')}</span>
            <span className={styles.profileLabel}>Skills</span>
            <span className={styles.profileValue}>{(() => { const all = Object.values(state.profile.skills).flat(); return all.slice(0, 8).join(', ') + (all.length > 8 ? ' ...' : ''); })()}</span>
            <span className={styles.profileLabel}>Remote</span>
            <span className={styles.profileValue}>{state.profile.remotePreference}</span>
          </div>
        </div>
      )}

      {state.normalizedJobs && (
        <div className={styles.jobCount}>
          Found {state.normalizedJobs.length} jobs
        </div>
      )}

      {state.reflectRationale && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Reflection</div>
          <div className={styles.reflection}>{state.reflectRationale}</div>
          {state.confidence != null && (
            <div className={styles.confidence}>
              Confidence: {(state.confidence * 100).toFixed(0)}%
            </div>
          )}
        </div>
      )}

      {state.done && !state.error && (
        <div className={styles.doneMessage}>
          Pipeline complete
          <span
            className={styles.doneLink}
            onClick={() => dispatch({ type: 'view:change', view: 'results' })}
          >
            View Results
          </span>
        </div>
      )}
    </div>
  );
}
