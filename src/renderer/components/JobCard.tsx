import React, { useState } from 'react';
import type { RankedJob, JobAnalysis, JobKanbanColumn } from '../../types.js';
import { ScoreBar } from './ScoreBar.js';
import styles from './JobCard.module.css';

interface JobCardProps {
  ranked: RankedJob;
  analyses?: JobAnalysis[];
  onAction?: (jobId: string, column: JobKanbanColumn) => void;
  onOpenDetail?: (jobId: string) => void;
}

export function JobCard({ ranked, analyses, onAction, onOpenDetail }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { job } = ranked;
  const skillAnalysis = analyses?.find((a) => a.variant === 'skill');
  const topSignals = analyses?.flatMap((a) => a.signals).slice(0, 3) ?? [];

  return (
    <div className={styles.card}>
      {/* Level 1: Collapsed */}
      <div className={styles.header} onClick={() => setExpanded(!expanded)}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{job.title}</span>
          <span className={styles.company}>{job.company}</span>
        </div>
        <span className={styles.chevron}>{expanded ? '\u25BC' : '\u25B6'}</span>
      </div>
      <div className={styles.scoreRow}>
        <ScoreBar score={ranked.overallScore} label="Overall" />
      </div>
      <div className={styles.summaryRow}>{ranked.summary}</div>
      <div className={styles.metaRow}>
        <span className={styles.sourceBadge}>{job.source}</span>
      </div>

      {/* Level 2: Expanded */}
      {expanded && (
        <div className={styles.expanded}>
          <div className={styles.miniScores}>
            <ScoreBar score={ranked.scores.skill} label="Skill" />
            <ScoreBar score={ranked.scores.culture} label="Culture" />
            <ScoreBar score={ranked.scores.salary} label="Salary" />
          </div>

          {topSignals.length > 0 && (
            <div className={styles.signals}>
              {topSignals.map((s, i) => (
                <span key={i} className={styles.signalTag}>{s}</span>
              ))}
            </div>
          )}

          {ranked.redFlags.length > 0 && (
            <div className={styles.redFlags}>
              {ranked.redFlags.map((f, i) => (
                <span key={i} className={styles.redFlagTag}>{f}</span>
              ))}
            </div>
          )}

          {skillAnalysis?.matchPercent != null && (
            <div className={styles.gapRow}>
              <span className={styles.matchPercent}>{skillAnalysis.matchPercent}% match</span>
              {skillAnalysis.missingSkills && skillAnalysis.missingSkills.length > 0 && (
                <span className={styles.missingSkills}>
                  missing: {skillAnalysis.missingSkills.join(', ')}
                </span>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => onAction?.(job.id, 'looking-at')}>Looking At</button>
            <button className={`${styles.actionBtn} ${styles.applyBtn}`} onClick={() => onAction?.(job.id, 'applying')}>Applying</button>
            <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => onAction?.(job.id, 'rejected')}>Reject</button>
            <button className={styles.actionBtn} onClick={() => onAction?.(job.id, 'not-applying')}>Skip</button>
            <button className={styles.detailBtn} onClick={() => onOpenDetail?.(job.id)}>Details</button>
          </div>
        </div>
      )}
    </div>
  );
}
