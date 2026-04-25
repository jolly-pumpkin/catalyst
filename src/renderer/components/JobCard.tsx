import React, { useState } from 'react';
import type { RankedJob, JobAnalysis, JobKanbanColumn } from '../../types.js';
import { ScoreBar } from './ScoreBar.js';
import { ScorePill } from './ScorePill.js';
import styles from './JobCard.module.css';

interface JobCardProps {
  ranked: RankedJob;
  analyses?: JobAnalysis[];
  kanbanColumn?: JobKanbanColumn;
  onAction?: (jobId: string, column: JobKanbanColumn) => void;
  onOpenDetail?: (jobId: string) => void;
}

export function JobCard({ ranked, analyses, kanbanColumn, onAction, onOpenDetail }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { job } = ranked;
  const skillAnalysis = analyses?.find((a) => a.variant === 'skill');
  const topSignals = analyses?.flatMap((a) => a.signals).slice(0, 3) ?? [];

  const matchedSkills = (skillAnalysis?.matchedSkills ?? []).slice(0, 3);
  const missingSkills = (skillAnalysis?.missingSkills ?? []).slice(0, 2);

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
      <div className={styles.infoRow}>
        <ScorePill label="Skill" score={ranked.scores.skill} />
        <ScorePill label="Culture" score={ranked.scores.culture} />
        <ScorePill label="Salary" score={ranked.scores.salary} />
      </div>
      {(matchedSkills.length > 0 || missingSkills.length > 0) && (
        <div className={styles.skillTags}>
          {matchedSkills.map((s) => (
            <span key={s} className={styles.matchTag}>{s}</span>
          ))}
          {missingSkills.map((s) => (
            <span key={s} className={styles.gapTag}>{s}</span>
          ))}
        </div>
      )}
      <div className={styles.summaryRow}>{ranked.summary}</div>
      <div className={styles.metaRow}>
        {job.location && <span className={styles.location}>{job.location}</span>}
        {job.remote && <span className={styles.remoteBadge}>Remote</span>}
        {kanbanColumn && kanbanColumn !== 'new' && (
          <span className={styles.kanbanBadge}>{kanbanColumn.replace('-', ' ')}</span>
        )}
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
