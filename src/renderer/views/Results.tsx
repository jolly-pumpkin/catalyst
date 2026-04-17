import React from 'react';
import type { AppState, AppAction } from '../state.js';
import { ScoreBar } from '../components/ScoreBar.js';
import styles from './Results.module.css';

interface ResultsProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export function Results({ state, dispatch }: ResultsProps) {
  const total = state.results.length;

  function handleClick(index: number) {
    dispatch({ type: 'results:navigate', index });
    dispatch({ type: 'view:change', view: 'job-detail' });
  }

  if (total === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>Results</span>
        </div>
        <div className={styles.emptyState}>
          <div>No results yet.</div>
          <div>Run a pipeline first.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Results</span>
        <span className={styles.meta}>
          {total} jobs &middot; {state.iteration} iteration{state.iteration > 1 ? 's' : ''}
        </span>
      </div>
      <div className={styles.list}>
        {state.results.map((r, i) => (
          <div key={r.job.id} className={styles.card} onClick={() => handleClick(i)}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.cardTitle}>{r.job.title}</span>
                <span className={styles.cardCompany}> &middot; {r.job.company}</span>
              </div>
            </div>
            <div className={styles.scoreSection}>
              <ScoreBar score={r.overallScore} label="Overall" />
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownItem}>skill {r.scores.skill}</span>
              <span className={styles.breakdownItem}>culture {r.scores.culture}</span>
              <span className={styles.breakdownItem}>salary {r.scores.salary}</span>
              <span className={styles.breakdownItem}>[{r.job.source}]</span>
            </div>
            <div className={styles.summary}>{r.summary}</div>
            {r.redFlags.length > 0 && (
              <div className={styles.redFlags}>
                {r.redFlags.join(' \u00B7 ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
