import React, { useState } from 'react';
import type { RankedJob, JobAnalysis, JobKanbanColumn } from '../../types.js';
import { JobCard } from './JobCard.js';
import styles from './NearMissGroup.module.css';

interface NearMissGroupProps {
  jobs: RankedJob[];
  analyses: JobAnalysis[];
  kanbanColumns?: Map<string, JobKanbanColumn>;
  nearMissMinMatch?: number;
  nearMissMaxScore?: number;
  onAction?: (jobId: string, column: JobKanbanColumn) => void;
  onOpenDetail?: (jobId: string) => void;
}

export interface SkillGapGroup {
  skill: string;
  count: number;
  jobs: { ranked: RankedJob; analyses: JobAnalysis[] }[];
}

export function computeSkillGapGroups(
  jobs: RankedJob[],
  analyses: JobAnalysis[],
  nearMissMinMatch = 60,
  nearMissMaxScore = 70,
): SkillGapGroup[] {
  const skillAnalyses = analyses.filter(
    (a) => a.variant === 'skill' && a.matchPercent != null && (a.matchPercent ?? 0) >= nearMissMinMatch,
  );

  const nearMissJobIds = new Set(
    skillAnalyses
      .filter((a) => {
        const ranked = jobs.find((j) => j.job.id === a.jobId);
        return ranked && ranked.overallScore < nearMissMaxScore;
      })
      .map((a) => a.jobId),
  );

  const groupMap = new Map<string, Set<string>>();
  for (const a of skillAnalyses) {
    if (!nearMissJobIds.has(a.jobId)) continue;
    for (const skill of a.missingSkills ?? []) {
      if (!groupMap.has(skill)) groupMap.set(skill, new Set());
      groupMap.get(skill)!.add(a.jobId);
    }
  }

  return Array.from(groupMap.entries())
    .map(([skill, jobIds]) => ({
      skill,
      count: jobIds.size,
      jobs: Array.from(jobIds).map((id) => ({
        ranked: jobs.find((j) => j.job.id === id)!,
        analyses: analyses.filter((a) => a.jobId === id),
      })).filter((e) => e.ranked),
    }))
    .sort((a, b) => b.count - a.count);
}

export function NearMissGroup({
  jobs,
  analyses,
  kanbanColumns,
  nearMissMinMatch = 60,
  nearMissMaxScore = 70,
  onAction,
  onOpenDetail,
}: NearMissGroupProps) {
  const groups = computeSkillGapGroups(jobs, analyses, nearMissMinMatch, nearMissMaxScore);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  if (groups.length === 0) {
    return <div className={styles.empty}>No near misses found.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Near Misses</div>
      {groups.map((group) => (
        <div key={group.skill} className={styles.group}>
          <button
            className={styles.groupHeader}
            onClick={() => setExpandedSkill(expandedSkill === group.skill ? null : group.skill)}
          >
            <span className={styles.skill}>Learn {group.skill}</span>
            <span className={styles.arrow}>{expandedSkill === group.skill ? '\u25BC' : '\u25B6'}</span>
            <span className={styles.count}>unlocks {group.count} job{group.count !== 1 ? 's' : ''}</span>
          </button>
          {expandedSkill === group.skill && (
            <div className={styles.jobList}>
              {group.jobs.map((entry) => (
                <JobCard
                  key={entry.ranked.job.id}
                  ranked={entry.ranked}
                  analyses={entry.analyses}
                  kanbanColumn={kanbanColumns?.get(entry.ranked.job.id)}
                  onAction={onAction}
                  onOpenDetail={onOpenDetail}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
