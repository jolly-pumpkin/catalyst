import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Plugin } from 'rhodium-core';
import type { RankedJob, RunRecord, CandidateProfile, NormalizedJob, JobAnalysis } from '../types.js';
import { getCatalystContext } from '../context.js';

export interface ResultsStoreOptions {
  dbPath?: string;
}

export function resultsStorePlugin(options: ResultsStoreOptions = {}): Plugin {
  return {
    key: 'results-store',
    version: '1.0.0',
    manifest: {
      name: 'Results Store',
      description: 'Persists pipeline results to SQLite',
      provides: [
        { capability: 'results.store' },
        { capability: 'results.query' },
      ],
      needs: [],
    },
    activate(ctx) {
      const dbPath = options.dbPath ?? getCatalystContext().dbPaths.results;
      if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true });
      const db = new Database(dbPath);

      db.run(`CREATE TABLE IF NOT EXISTS runs (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        resume_name TEXT NOT NULL,
        iteration INTEGER NOT NULL,
        duration_ms INTEGER NOT NULL,
        model TEXT NOT NULL
      )`);

      // Migrate: add enrichment columns if missing
      const cols = db.query(`PRAGMA table_info(runs)`).all() as { name: string }[];
      const colNames = new Set(cols.map((c) => c.name));
      if (!colNames.has('profile_json')) {
        db.run(`ALTER TABLE runs ADD COLUMN profile_json TEXT`);
        db.run(`ALTER TABLE runs ADD COLUMN normalized_jobs_json TEXT`);
        db.run(`ALTER TABLE runs ADD COLUMN analyses_json TEXT`);
        db.run(`ALTER TABLE runs ADD COLUMN reflect_rationale TEXT`);
        db.run(`ALTER TABLE runs ADD COLUMN confidence REAL`);
      }
      if (!colNames.has('company_source_id')) {
        db.run(`ALTER TABLE runs ADD COLUMN company_source_id TEXT`);
      }

      db.run(`CREATE TABLE IF NOT EXISTS ranked_jobs (
        run_id TEXT NOT NULL,
        rank INTEGER NOT NULL,
        job_id TEXT NOT NULL,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        url TEXT NOT NULL,
        score INTEGER NOT NULL,
        skill INTEGER NOT NULL,
        culture INTEGER NOT NULL,
        salary INTEGER NOT NULL,
        summary TEXT NOT NULL,
        source TEXT NOT NULL,
        job_json TEXT NOT NULL
      )`);

      ctx.provide('results.store', {
        async save(
          runId: string, resumeName: string, model: string,
          iteration: number, durationMs: number, jobs: RankedJob[],
          companySourceId?: string,
        ) {
          db.run(
            `INSERT INTO runs (id, created_at, resume_name, iteration, duration_ms, model, company_source_id)
             VALUES (?,?,?,?,?,?,?)`,
            [runId, new Date().toISOString(), resumeName, iteration, durationMs, model, companySourceId ?? null],
          );
          for (const [i, ranked] of jobs.entries()) {
            db.run(
              `INSERT INTO ranked_jobs VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
              [runId, i + 1, ranked.job.id, ranked.job.title, ranked.job.company,
               ranked.job.url, ranked.overallScore,
               ranked.scores.skill, ranked.scores.culture, ranked.scores.salary,
               ranked.summary, ranked.job.source, JSON.stringify(ranked)],
            );
          }
        },
        saveEnrichment(runId: string, data: {
          profile?: CandidateProfile;
          normalizedJobs?: NormalizedJob[];
          analyses?: JobAnalysis[];
          reflectRationale?: string;
          confidence?: number;
        }) {
          db.run(
            `UPDATE runs SET profile_json = ?, normalized_jobs_json = ?, analyses_json = ?,
             reflect_rationale = ?, confidence = ? WHERE id = ?`,
            [
              data.profile ? JSON.stringify(data.profile) : null,
              data.normalizedJobs ? JSON.stringify(data.normalizedJobs) : null,
              data.analyses ? JSON.stringify(data.analyses) : null,
              data.reflectRationale ?? null,
              data.confidence ?? null,
              runId,
            ],
          );
        },
      });

      ctx.provide('results.query', {
        async listRuns(): Promise<RunRecord[]> {
          return db.query(
            `SELECT id, created_at as createdAt, resume_name as resumeName,
                    iteration, duration_ms as durationMs, model
             FROM runs ORDER BY created_at DESC`
          ).all() as RunRecord[];
        },
        async getJobs(runId: string): Promise<RankedJob[]> {
          const rows = db.query(
            `SELECT job_json FROM ranked_jobs WHERE run_id = ? ORDER BY rank`
          ).all(runId) as { job_json: string }[];
          return rows.map((r) => JSON.parse(r.job_json));
        },
        async getRunDetail(runId: string) {
          const run = db.query(
            `SELECT id, created_at as createdAt, resume_name as resumeName,
                    iteration, duration_ms as durationMs, model,
                    profile_json, normalized_jobs_json, analyses_json,
                    reflect_rationale, confidence
             FROM runs WHERE id = ?`
          ).get(runId) as (RunRecord & {
            profile_json?: string; normalized_jobs_json?: string;
            analyses_json?: string; reflect_rationale?: string; confidence?: number;
          }) | null;
          if (!run) return null;
          const jobRows = db.query(
            `SELECT job_json FROM ranked_jobs WHERE run_id = ? ORDER BY rank`
          ).all(runId) as { job_json: string }[];
          return {
            run: { id: run.id, createdAt: run.createdAt, resumeName: run.resumeName,
                   iteration: run.iteration, durationMs: run.durationMs, model: run.model } as RunRecord,
            jobs: jobRows.map((r) => JSON.parse(r.job_json)) as RankedJob[],
            profile: run.profile_json ? JSON.parse(run.profile_json) as CandidateProfile : undefined,
            normalizedJobs: run.normalized_jobs_json ? JSON.parse(run.normalized_jobs_json) as NormalizedJob[] : undefined,
            analyses: run.analyses_json ? JSON.parse(run.analyses_json) as JobAnalysis[] : undefined,
            reflectRationale: run.reflect_rationale ?? undefined,
            confidence: run.confidence ?? undefined,
          };
        },
        async getLatestRunId(): Promise<string | null> {
          const row = db.query(
            `SELECT id FROM runs ORDER BY created_at DESC LIMIT 1`
          ).get() as { id: string } | null;
          return row?.id ?? null;
        },
      });
    },
  };
}
