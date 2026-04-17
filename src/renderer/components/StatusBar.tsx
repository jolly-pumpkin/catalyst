import React from 'react';
import type { AppState } from '../state.js';
import styles from './StatusBar.module.css';

interface StatusBarProps {
  state: AppState;
}

export function StatusBar({ state }: StatusBarProps) {
  const lastRunStatus = state.error
    ? `Error: ${state.error}`
    : state.done
    ? `Done — ${state.results.length} jobs ranked`
    : state.stages.length > 0
    ? 'Running...'
    : 'Idle';

  return (
    <footer className={styles.bar}>
      <span className={styles.item}>
        Model: {state.model || 'not set'}
      </span>
      <span className={styles.item}>
        {lastRunStatus}
      </span>
      <span className={styles.item}>
        Indexer: idle
      </span>
    </footer>
  );
}
