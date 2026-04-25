import React from 'react';
import { useApi } from '../api.js';
import type { RankedJob, JobAnalysis, JobKanbanColumn } from '../../types.js';
import { ScoreBar } from './ScoreBar.js';
import styles from './DetailPanel.module.css';

interface DetailPanelProps {
  ranked: RankedJob;
  analyses: JobAnalysis[];
  onClose: () => void;
  onAction?: (jobId: string, column: JobKanbanColumn) => void;
}

export function DetailPanel({ ranked, analyses, onClose, onAction }: DetailPanelProps) {
  const api = useApi();
  const { job } = ranked;
  const skillAnalysis = analyses.find((a) => a.variant === 'skill');

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={() => onAction?.(job.id, 'looking-at')}>Looking At</button>
        <button className={`${styles.actionBtn} ${styles.applyBtn}`} onClick={() => onAction?.(job.id, 'applying')}>Applying</button>
        <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => onAction?.(job.id, 'rejected')}>Reject</button>
        <button className={styles.actionBtn} onClick={() => onAction?.(job.id, 'not-applying')}>Skip</button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.title}>{job.title}</div>
        <div className={styles.company}>
          {job.company} &middot; {job.location}
          {job.remote && <span className={styles.remote}>remote</span>}
        </div>

        {job.url && (
          <button className={styles.openBtn} onClick={() => api.openUrl(job.url)}>
            Open URL
          </button>
        )}

        <div className={styles.section}>
          <ScoreBar score={ranked.overallScore} label="Overall" />
          <div className={styles.scoreGrid}>
            <ScoreBar score={ranked.scores.skill} label="Skill" />
            <ScoreBar score={ranked.scores.culture} label="Culture" />
            <ScoreBar score={ranked.scores.salary} label="Salary" />
          </div>
        </div>

        {skillAnalysis?.matchPercent != null && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Skill Gap</div>
            <div className={styles.gapInfo}>
              <span className={styles.matchPercent}>{skillAnalysis.matchPercent}% match</span>
              <span className={styles.gapSeverity}>{skillAnalysis.gapSeverity}</span>
            </div>
            {skillAnalysis.matchedSkills && skillAnalysis.matchedSkills.length > 0 && (
              <div className={styles.skillList}>
                <span className={styles.skillLabel}>Matched:</span>
                {skillAnalysis.matchedSkills.map((s) => (
                  <span key={s} className={styles.matchedTag}>{s}</span>
                ))}
              </div>
            )}
            {skillAnalysis.missingSkills && skillAnalysis.missingSkills.length > 0 && (
              <div className={styles.skillList}>
                <span className={styles.skillLabel}>Missing:</span>
                {skillAnalysis.missingSkills.map((s) => (
                  <span key={s} className={styles.missingTag}>{s}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {analyses.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Analysis</div>
            {analyses.map((a) => (
              <div key={a.variant} className={styles.analysisBlock}>
                <div className={styles.analysisHeader}>
                  <span className={styles.variant}>{a.variant}</span>
                  <span className={styles.analysisScore}>{a.score}</span>
                </div>
                <div className={styles.reasoning}>{a.reasoning}</div>
                {a.signals.length > 0 && (
                  <div className={styles.signalList}>
                    {a.signals.map((s, i) => (
                      <span key={i} className={styles.signal}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {ranked.redFlags.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Red Flags</div>
            {ranked.redFlags.map((f, i) => (
              <div key={i} className={styles.redFlag}>{f}</div>
            ))}
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Description</div>
          <div className={styles.description}>{job.description}</div>
        </div>
      </div>
    </div>
  );
}
