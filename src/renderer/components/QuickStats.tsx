import React from 'react';
import type { RankedJob, JobAnalysis } from '../../types.js';
import styles from './QuickStats.module.css';

interface QuickStatsProps {
  jobs: RankedJob[];
  analyses: JobAnalysis[];
  topPickThreshold?: number;
  nearMissMinMatch?: number;
  nearMissMaxScore?: number;
}

export function QuickStats({
  jobs,
  analyses,
  topPickThreshold = 75,
  nearMissMinMatch = 60,
  nearMissMaxScore = 70,
}: QuickStatsProps) {
  const total = jobs.length;
  const avgScore = total > 0 ? Math.round(jobs.reduce((s, j) => s + j.overallScore, 0) / total) : 0;
  const topPicks = jobs.filter((j) => j.overallScore >= topPickThreshold).length;

  const skillAnalyses = analyses.filter((a) => a.variant === 'skill' && a.matchPercent != null);
  const nearMisses = skillAnalyses.filter(
    (a) => (a.matchPercent ?? 0) >= nearMissMinMatch && (jobs.find((j) => j.job.id === a.jobId)?.overallScore ?? 100) < nearMissMaxScore,
  ).length;

  return (
    <div className={styles.bar}>
      <div className={styles.stat}>
        <span className={styles.value}>{total}</span>
        <span className={styles.label}>Jobs Analyzed</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{avgScore}</span>
        <span className={styles.label}>Avg Match</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{topPicks}</span>
        <span className={styles.label}>Top Picks</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{nearMisses}</span>
        <span className={styles.label}>Near Misses</span>
      </div>
    </div>
  );
}
