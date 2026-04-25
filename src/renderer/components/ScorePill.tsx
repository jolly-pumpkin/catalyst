import React from 'react';
import styles from './ScorePill.module.css';

interface ScorePillProps {
  label: string;
  score: number;
}

export function ScorePill({ label, score }: ScorePillProps) {
  const level = score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low';
  return (
    <span className={`${styles.pill} ${styles[level]}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.score}>{score}</span>
    </span>
  );
}
