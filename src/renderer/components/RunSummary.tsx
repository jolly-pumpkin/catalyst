import React from 'react';
import styles from './RunSummary.module.css';

interface RunSummaryProps {
  summary: string;
  onDismiss: () => void;
}

export function RunSummary({ summary, onDismiss }: RunSummaryProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Run Summary</span>
        <button className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss summary">
          ×
        </button>
      </div>
      <div className={styles.text}>{summary}</div>
    </div>
  );
}
