import React from 'react';
import styles from './ScoreBar.module.css';

interface ScoreBarProps {
  score: number;
  label?: string;
}

export function ScoreBar({ score, label }: ScoreBarProps) {
  const filled = Math.round(score / 10);
  const tier = score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low';

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.bar}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`${styles.segment} ${i < filled ? styles[tier] : styles.empty}`}
          />
        ))}
      </div>
      <span className={styles.value}>{score}</span>
    </div>
  );
}
