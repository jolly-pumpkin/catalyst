import React from 'react';
import { FEEDBACK_TAGS } from '../../types.js';
import styles from './FeedbackInsights.module.css';

interface FeedbackSummary {
  totalRejected: number;
  totalNotApplying: number;
  tagCounts: Record<string, number>;
  recentNotes: string[];
}

interface FeedbackInsightsProps {
  summary: FeedbackSummary | null;
}

export function FeedbackInsights({ summary }: FeedbackInsightsProps) {
  if (!summary || (summary.totalRejected === 0 && summary.totalNotApplying === 0)) {
    return null;
  }

  const total = summary.totalRejected + summary.totalNotApplying;
  const sortedTags = Object.entries(summary.tagCounts)
    .sort(([, a], [, b]) => b - a);

  const topTag = sortedTags[0];
  const tagLabel = topTag
    ? FEEDBACK_TAGS.find((t) => t.tag === topTag[0])?.label ?? topTag[0]
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Feedback Patterns</div>
      <div className={styles.summary}>
        You&apos;ve passed on {total} job{total !== 1 ? 's' : ''}:
        {sortedTags.map(([tag, count]) => {
          const label = FEEDBACK_TAGS.find((t) => t.tag === tag)?.label ?? tag;
          return (
            <span key={tag} className={styles.tagCount}> {count} {label.toLowerCase()}</span>
          );
        })}
      </div>
      {topTag && topTag[1] >= 3 && (
        <div className={styles.nudge}>
          Most common reason: <strong>{tagLabel}</strong> ({topTag[1]} times).
          Consider adjusting your search criteria.
        </div>
      )}
    </div>
  );
}
