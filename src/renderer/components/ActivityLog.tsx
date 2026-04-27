import React, { useEffect, useState, useMemo } from 'react';
import { useApi } from '../api.js';
import type { JobKanbanColumn, FeedbackTag } from '../../types.js';
import { FEEDBACK_TAGS } from '../../types.js';
import styles from './ActivityLog.module.css';

interface MoveEntry {
  jobId: string;
  title: string;
  company: string;
  column: JobKanbanColumn;
  tags: FeedbackTag[];
  notes?: string;
  updatedAt: string;
}

interface ActivityLogProps {
  onOpenDetail?: (jobId: string) => void;
}

type FilterKey = 'all' | 'looking-at' | 'applying' | 'rejected' | 'not-applying';

const COLUMN_LABELS: Record<string, string> = {
  'looking-at': 'Started looking at',
  'applying': 'Applying to',
  'rejected': 'Rejected',
  'not-applying': 'Skipped',
};

const FILTER_BUTTONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'looking-at', label: 'Started looking at' },
  { key: 'applying', label: 'Applying to' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'not-applying', label: 'Skipped' },
];

const TAG_LABEL_MAP = new Map(FEEDBACK_TAGS.map((t) => [t.tag, t.label]));

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityLog({ onOpenDetail }: ActivityLogProps) {
  const api = useApi();
  const [moves, setMoves] = useState<MoveEntry[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');

  useEffect(() => {
    api.dashboard.recentMoves().then(setMoves).catch(() => {});
  }, [api]);

  const filtered = useMemo(() => {
    if (filter === 'all') return moves;
    return moves.filter((m) => m.column === filter);
  }, [moves, filter]);

  return (
    <div className={styles.container}>
      <div className={styles.filterRow}>
        {FILTER_BUTTONS.map((fb) => (
          <button
            key={fb.key}
            className={`${styles.filterBtn} ${filter === fb.key ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter(fb.key)}
          >
            {fb.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>No activity yet.</div>
      ) : (
        filtered.map((entry, i) => (
          <div
            key={`${entry.jobId}-${i}`}
            className={styles.entry}
            onClick={() => onOpenDetail?.(entry.jobId)}
          >
            <div className={styles.entryHeader}>
              <span className={styles.actionLabel}>
                {COLUMN_LABELS[entry.column] ?? entry.column}
              </span>
              <span className={styles.timeAgo}>{timeAgo(entry.updatedAt)}</span>
            </div>
            <span className={styles.jobTitle}>{entry.title}</span>
            {entry.company && <span className={styles.company}>{entry.company}</span>}
            {entry.tags.length > 0 && (
              <div className={styles.tagsRow}>
                {entry.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {TAG_LABEL_MAP.get(tag) ?? tag}
                  </span>
                ))}
              </div>
            )}
            {entry.notes && <div className={styles.notes}>{entry.notes}</div>}
          </div>
        ))
      )}
    </div>
  );
}
