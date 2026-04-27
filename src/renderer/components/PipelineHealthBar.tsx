import React from 'react';
import type { RankedJob, JobKanbanColumn } from '../../types.js';
import styles from './PipelineHealthBar.module.css';

interface PipelineHealthBarProps {
  stageCounts: Record<JobKanbanColumn, number>;
  recentActivity: { reviewed: number; applied: number; rejected: number };
  topRejectionTag: { tag: string; count: number } | null;
  jobs: RankedJob[];
}

const STAGE_COLORS: { key: JobKanbanColumn; label: string; className: string }[] = [
  { key: 'new', label: 'New', className: styles.stageNew },
  { key: 'looking-at', label: 'Looking At', className: styles.stageLooking },
  { key: 'applying', label: 'Applying', className: styles.stageApplying },
  { key: 'rejected', label: 'Rejected', className: styles.stageRejected },
  { key: 'not-applying', label: 'Not Applying', className: styles.stageRejected },
];

function getScoreBuckets(jobs: RankedJob[]): number[] {
  const buckets = [0, 0, 0, 0, 0]; // 0-19, 20-39, 40-59, 60-79, 80-100
  for (const j of jobs) {
    const idx = Math.min(Math.floor(j.overallScore / 20), 4);
    buckets[idx]++;
  }
  return buckets;
}

export function PipelineHealthBar({ stageCounts, recentActivity, topRejectionTag, jobs }: PipelineHealthBarProps) {
  const total = Object.values(stageCounts).reduce((s, n) => s + n, 0);
  const buckets = getScoreBuckets(jobs);
  const maxBucket = Math.max(...buckets, 1);

  return (
    <div className={styles.healthBar}>
      {/* Pipeline stage distribution */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Pipeline</div>
        {total === 0 ? (
          <div className={styles.noData}>No jobs tracked</div>
        ) : (
          <>
            <div className={styles.stageBar}>
              {STAGE_COLORS.map(({ key, className }) => {
                const count = stageCounts[key] ?? 0;
                if (count === 0) return null;
                return (
                  <div
                    key={key}
                    className={`${styles.stageSegment} ${className}`}
                    style={{ width: `${(count / total) * 100}%` }}
                    title={`${key}: ${count}`}
                  />
                );
              })}
            </div>
            <div className={styles.legend}>
              {STAGE_COLORS.filter(({ key }) => (stageCounts[key] ?? 0) > 0).map(({ key, label, className }) => (
                <span key={key} className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${className}`} />
                  {label} {stageCounts[key]}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Score distribution */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Scores</div>
        {jobs.length === 0 ? (
          <div className={styles.noData}>No scores</div>
        ) : (
          <>
            <div className={styles.scoreBuckets}>
              {buckets.map((count, i) => (
                <div
                  key={i}
                  className={styles.scoreBucket}
                  style={{ height: `${(count / maxBucket) * 100}%` }}
                  title={`${i * 20}-${i * 20 + 19}: ${count} jobs`}
                />
              ))}
            </div>
            <div className={styles.scoreLabels}>
              <span>0</span>
              <span>40</span>
              <span>80+</span>
            </div>
          </>
        )}
      </div>

      {/* Weekly activity */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>This Week</div>
        <div className={styles.activityRow}>
          <span className={styles.activityValue}>{recentActivity.reviewed}</span>{' '}
          <span className={styles.activityLabel}>reviewed</span>
        </div>
        <div className={styles.activityRow}>
          <span className={styles.activityValue}>{recentActivity.applied}</span>{' '}
          <span className={styles.activityLabel}>applied</span>
        </div>
        <div className={styles.activityRow}>
          <span className={styles.activityValue}>{recentActivity.rejected}</span>{' '}
          <span className={styles.activityLabel}>passed</span>
        </div>
      </div>

      {/* Top rejection reason */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Top Reason</div>
        {topRejectionTag ? (
          <div>
            <span className={styles.topTag}>{topRejectionTag.tag}</span>
            <span className={styles.topTagCount}>({topRejectionTag.count}x)</span>
          </div>
        ) : (
          <div className={styles.noData}>No patterns yet</div>
        )}
      </div>
    </div>
  );
}
