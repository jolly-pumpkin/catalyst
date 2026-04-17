import React from 'react';
import styles from './KanbanCard.module.css';

export interface KanbanCardData {
  jobId: string;
  title: string;
  company: string;
  score: number;
  tags?: string[];
}

interface KanbanCardProps {
  data: KanbanCardData;
  selected?: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onClick?: () => void;
}

export function KanbanCard({ data, selected, onDragStart, onDragEnd, onClick }: KanbanCardProps) {
  const tier = data.score >= 80 ? 'High' : data.score >= 60 ? 'Mid' : 'Low';
  const tierCls = tier === 'High' ? styles.scoreHigh : tier === 'Mid' ? styles.scoreMid : styles.scoreLow;

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <div className={styles.title}>{data.title}</div>
      <div className={styles.company}>{data.company}</div>
      <div className={styles.meta}>
        {data.score > 0 && (
          <span className={`${styles.scoreBadge} ${tierCls}`}>{data.score}</span>
        )}
      </div>
      {data.tags && data.tags.length > 0 && (
        <div className={styles.tags}>
          {data.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
