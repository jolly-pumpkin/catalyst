import type Database from 'better-sqlite3';
import type { Plugin } from 'rhodium-core';
import type { JobKanbanColumn, FeedbackTag, JobFeedback, RankedJob } from '../types.js';

export interface KanbanStoreCapability {
  /** Get the kanban column for a job (null = not tracked yet). */
  getJobColumn(jobId: string): JobKanbanColumn | null;

  /** Move a job to a column. If moving to rejected/not-applying, optionally attach feedback. */
  moveJob(
    jobId: string,
    companySourceId: string,
    toColumn: JobKanbanColumn,
    feedback?: { tags: FeedbackTag[]; notes?: string },
  ): void;

  /** Get all jobs in a given column for a company. */
  getColumnJobs(companySourceId: string, column: JobKanbanColumn): { jobId: string; title: string; company: string; score: number }[];

  /** Get all feedback entries for a company. */
  getAllFeedback(companySourceId?: string): JobFeedback[];

  /** Get feedback for a specific job. */
  getFeedback(jobId: string): JobFeedback | null;

  /** Ensure all jobs from a pipeline run are tracked (as "new" if not already present). */
  ensureTracked(companySourceId: string, jobs: RankedJob[]): void;

  /** Get a summary of rejection reasons for a company (used by reflection agent). */
  getFeedbackSummary(companySourceId?: string): {
    totalRejected: number;
    totalNotApplying: number;
    tagCounts: Record<FeedbackTag, number>;
    recentNotes: string[];
  };

  /** Get job counts grouped by kanban column. */
  getStageCounts(companySourceId?: string): Record<JobKanbanColumn, number>;

  /** Get recent activity counts (reviewed, applied, rejected) within the last N days. */
  getRecentActivityCount(sinceDays?: number): { reviewed: number; applied: number; rejected: number };

  /** Get recent kanban moves (excluding 'new' column), ordered by most recent. */
  getRecentMoves(limit?: number): {
    jobId: string;
    title: string;
    company: string;
    column: JobKanbanColumn;
    tags: FeedbackTag[];
    notes?: string;
    updatedAt: string;
  }[];
}

export function kanbanStorePlugin(): Plugin {
  return {
    key: 'kanban-store',
    version: '1.0.0',
    manifest: {
      name: 'Kanban Store',
      description: 'Tracks job application status and feedback per company',
      provides: [{ capability: 'kanban.store' }],
      needs: [{ capability: 'catalog.db' }],
      tags: ['kanban'],
    },
    activate(ctx) {
      const db = ctx.resolve<Database.Database>('catalog.db');

      db.exec(`CREATE TABLE IF NOT EXISTS job_kanban (
        job_id TEXT PRIMARY KEY,
        company_source_id TEXT NOT NULL,
        column_name TEXT NOT NULL DEFAULT 'new',
        tags TEXT,
        notes TEXT,
        job_title TEXT,
        job_company TEXT,
        job_url TEXT,
        overall_score INTEGER,
        job_json TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`);

      db.exec(`CREATE INDEX IF NOT EXISTS idx_kanban_company ON job_kanban(company_source_id)`);
      db.exec(`CREATE INDEX IF NOT EXISTS idx_kanban_column ON job_kanban(column_name)`);

      const getColumn = db.prepare('SELECT column_name FROM job_kanban WHERE job_id = ?');
      const upsert = db.prepare(
        `INSERT INTO job_kanban (job_id, company_source_id, column_name, tags, notes, job_title, job_company, job_url, overall_score, job_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(job_id) DO UPDATE SET
           column_name = excluded.column_name,
           tags = excluded.tags,
           notes = excluded.notes,
           updated_at = excluded.updated_at`
      );
      const ensureRow = db.prepare(
        `INSERT OR IGNORE INTO job_kanban (job_id, company_source_id, column_name, tags, notes, job_title, job_company, job_url, overall_score, job_json, created_at, updated_at)
         VALUES (?, ?, 'new', NULL, NULL, ?, ?, ?, ?, ?, ?, ?)`
      );

      ctx.provide('kanban.store', {
        getJobColumn(jobId: string): JobKanbanColumn | null {
          const row = getColumn.get(jobId) as { column_name: string } | null;
          return (row?.column_name as JobKanbanColumn) ?? null;
        },

        moveJob(
          jobId: string,
          companySourceId: string,
          toColumn: JobKanbanColumn,
          feedback?: { tags: FeedbackTag[]; notes?: string },
        ): void {
          const now = new Date().toISOString();
          const tags = feedback?.tags ? JSON.stringify(feedback.tags) : null;
          const notes = feedback?.notes ?? null;
          // Just update column + feedback (preserve existing job metadata)
          db.prepare(
            `UPDATE job_kanban SET column_name = ?, tags = ?, notes = ?, updated_at = ? WHERE job_id = ?`,
          ).run(toColumn, tags, notes, now, jobId);
        },

        getColumnJobs(companySourceId: string, column: JobKanbanColumn) {
          const rows = db.prepare(
            `SELECT job_id, job_title, job_company, overall_score FROM job_kanban WHERE company_source_id = ? AND column_name = ?`
          ).all(companySourceId, column) as { job_id: string; job_title: string; job_company: string; overall_score: number }[];
          return rows.map((r) => ({
            jobId: r.job_id,
            title: r.job_title ?? r.job_id.slice(0, 20),
            company: r.job_company ?? '',
            score: r.overall_score ?? 0,
          }));
        },

        getAllFeedback(companySourceId?: string): JobFeedback[] {
          const sql = companySourceId
            ? `SELECT * FROM job_kanban WHERE company_source_id = ? AND (column_name = 'rejected' OR column_name = 'not-applying')`
            : `SELECT * FROM job_kanban WHERE column_name = 'rejected' OR column_name = 'not-applying'`;
          const rows = companySourceId
            ? db.prepare(sql).all(companySourceId) as any[]
            : db.prepare(sql).all() as any[];
          return rows.map(rowToFeedback);
        },

        getFeedback(jobId: string): JobFeedback | null {
          const row = db.prepare(
            `SELECT * FROM job_kanban WHERE job_id = ? AND (column_name = 'rejected' OR column_name = 'not-applying')`
          ).get(jobId) as any;
          return row ? rowToFeedback(row) : null;
        },

        ensureTracked(companySourceId: string, jobs: RankedJob[]): void {
          const now = new Date().toISOString();
          for (const ranked of jobs) {
            ensureRow.run(
              ranked.job.id,
              companySourceId,
              ranked.job.title,
              ranked.job.company,
              ranked.job.url,
              ranked.overallScore,
              JSON.stringify(ranked),
              now,
              now,
            );
          }
        },

        getFeedbackSummary(companySourceId?: string) {
          const feedback = this.getAllFeedback(companySourceId);
          const tagCounts = {} as Record<FeedbackTag, number>;
          let totalRejected = 0;
          let totalNotApplying = 0;
          const recentNotes: string[] = [];

          for (const fb of feedback) {
            if (fb.column === 'rejected') totalRejected++;
            if (fb.column === 'not-applying') totalNotApplying++;
            for (const tag of fb.tags) {
              tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
            }
            if (fb.notes) recentNotes.push(fb.notes);
          }

          return { totalRejected, totalNotApplying, tagCounts, recentNotes: recentNotes.slice(-10) };
        },

        getStageCounts(companySourceId?: string): Record<JobKanbanColumn, number> {
          const where = companySourceId ? 'WHERE company_source_id = ?' : '';
          const params = companySourceId ? [companySourceId] : [];
          const rows = db.prepare(
            `SELECT column_name, COUNT(*) as cnt FROM job_kanban ${where} GROUP BY column_name`
          ).all(...params) as { column_name: string; cnt: number }[];
          const counts: Record<string, number> = {
            new: 0, 'looking-at': 0, applying: 0, rejected: 0, 'not-applying': 0,
          };
          for (const row of rows) counts[row.column_name] = row.cnt;
          return counts as Record<JobKanbanColumn, number>;
        },

        getRecentActivityCount(sinceDays: number = 7): { reviewed: number; applied: number; rejected: number } {
          const since = new Date(Date.now() - sinceDays * 86400000).toISOString();
          const rows = db.prepare(
            `SELECT column_name, COUNT(*) as cnt FROM job_kanban WHERE updated_at >= ? AND column_name != 'new' GROUP BY column_name`
          ).all(since) as { column_name: string; cnt: number }[];
          let reviewed = 0, applied = 0, rejected = 0;
          for (const row of rows) {
            if (row.column_name === 'applying') applied = row.cnt;
            else if (row.column_name === 'rejected' || row.column_name === 'not-applying') rejected += row.cnt;
            reviewed += row.cnt;
          }
          return { reviewed, applied, rejected };
        },
        getRecentMoves(limit: number = 50) {
          const rows = db.prepare(
            `SELECT job_id, job_title, job_company, column_name, tags, notes, updated_at
             FROM job_kanban
             WHERE column_name != 'new'
             ORDER BY updated_at DESC
             LIMIT ?`
          ).all(limit) as any[];
          return rows.map((r) => ({
            jobId: r.job_id,
            title: r.job_title ?? 'Untitled',
            company: r.job_company ?? '',
            column: r.column_name as JobKanbanColumn,
            tags: r.tags ? JSON.parse(r.tags) : [],
            notes: r.notes || undefined,
            updatedAt: r.updated_at,
          }));
        },
      } satisfies KanbanStoreCapability);
    },
  };
}

function rowToFeedback(row: any): JobFeedback {
  return {
    id: row.job_id,
    jobId: row.job_id,
    companySourceId: row.company_source_id,
    column: row.column_name as JobKanbanColumn,
    tags: row.tags ? JSON.parse(row.tags) : [],
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
