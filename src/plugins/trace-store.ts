import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Plugin } from 'rhodium-core';
import type { TraceRun, TraceEvent, TraceLLMCall } from '../types.js';
import { getCatalystContext } from '../context.js';

export interface TraceStoreOptions {
  dbPath?: string;
}

export function traceStorePlugin(options: TraceStoreOptions = {}): Plugin {
  return {
    key: 'trace-store',
    version: '1.0.0',
    manifest: {
      name: 'Trace Store',
      description: 'Persists pipeline traces to SQLite for post-run review',
      provides: [
        { capability: 'trace.store' },
        { capability: 'trace.query' },
      ],
      needs: [],
    },
    activate(ctx) {
      const dbPath = options.dbPath ?? getCatalystContext().dbPaths.traces;
      if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true });
      const db = new Database(dbPath);

      db.run(`CREATE TABLE IF NOT EXISTS trace_runs (
        run_id       TEXT PRIMARY KEY,
        spec_name    TEXT NOT NULL,
        model        TEXT NOT NULL,
        resume_name  TEXT NOT NULL,
        started_at   TEXT NOT NULL,
        completed_at TEXT,
        duration_ms  INTEGER,
        iteration    INTEGER,
        status       TEXT NOT NULL DEFAULT 'running'
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS trace_events (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id    TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        event     TEXT NOT NULL,
        stage_id  TEXT,
        plugin_id TEXT,
        duration_ms INTEGER,
        data_json TEXT,
        FOREIGN KEY (run_id) REFERENCES trace_runs(run_id)
      )`);

      db.run(`CREATE INDEX IF NOT EXISTS idx_trace_events_run ON trace_events(run_id)`);

      db.run(`CREATE TABLE IF NOT EXISTS trace_llm_calls (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id          TEXT NOT NULL,
        call_id         TEXT NOT NULL UNIQUE,
        plugin_key      TEXT NOT NULL,
        model           TEXT NOT NULL,
        prompt          TEXT NOT NULL,
        response        TEXT,
        temperature     REAL,
        started_at      TEXT NOT NULL,
        completed_at    TEXT,
        duration_ms     INTEGER,
        prompt_tokens   INTEGER,
        response_tokens INTEGER,
        error           TEXT,
        FOREIGN KEY (run_id) REFERENCES trace_runs(run_id)
      )`);

      db.run(`CREATE INDEX IF NOT EXISTS idx_trace_llm_run ON trace_llm_calls(run_id)`);

      // --- Prepared statements ---
      const insertRun = db.prepare(
        `INSERT INTO trace_runs (run_id, spec_name, model, resume_name, started_at, status)
         VALUES (?, ?, ?, ?, ?, 'running')`
      );
      const completeRun = db.prepare(
        `UPDATE trace_runs SET completed_at = ?, duration_ms = ?, iteration = ?, status = 'complete'
         WHERE run_id = ?`
      );
      const failRun = db.prepare(
        `UPDATE trace_runs SET completed_at = ?, status = 'failed' WHERE run_id = ?`
      );
      const insertEvent = db.prepare(
        `INSERT INTO trace_events (run_id, timestamp, event, stage_id, plugin_id, duration_ms, data_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      );
      const insertLLMCall = db.prepare(
        `INSERT INTO trace_llm_calls (run_id, call_id, plugin_key, model, prompt, temperature, started_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      );
      const completeLLMCall = db.prepare(
        `UPDATE trace_llm_calls
         SET response = ?, completed_at = ?, duration_ms = ?, prompt_tokens = ?, response_tokens = ?
         WHERE call_id = ?`
      );
      const failLLMCall = db.prepare(
        `UPDATE trace_llm_calls SET error = ?, completed_at = ?, duration_ms = ? WHERE call_id = ?`
      );

      ctx.provide('trace.store', {
        startRun(runId: string, specName: string, model: string, resumeName: string) {
          insertRun.run(runId, specName, model, resumeName, new Date().toISOString());
        },
        completeRun(runId: string, durationMs: number, iteration: number) {
          completeRun.run(new Date().toISOString(), durationMs, iteration, runId);
        },
        failRun(runId: string, _error: string) {
          failRun.run(new Date().toISOString(), runId);
        },
        recordEvent(runId: string, event: string, payload: Record<string, unknown>) {
          insertEvent.run(
            runId,
            new Date().toISOString(),
            event,
            (payload.stageId as string) ?? null,
            (payload.providerId as string) ?? null,
            (payload.durationMs as number) ?? null,
            JSON.stringify(payload),
          );
        },
        startLLMCall(runId: string, callId: string, pluginKey: string, model: string, prompt: string, temperature: number) {
          insertLLMCall.run(runId, callId, pluginKey, model, prompt, temperature, new Date().toISOString());
        },
        completeLLMCall(callId: string, response: string, durationMs: number, tokens?: { prompt: number; response: number }) {
          completeLLMCall.run(
            response, new Date().toISOString(), durationMs,
            tokens?.prompt ?? null, tokens?.response ?? null,
            callId,
          );
        },
        failLLMCall(callId: string, error: string, durationMs: number) {
          failLLMCall.run(error, new Date().toISOString(), durationMs, callId);
        },
      });

      ctx.provide('trace.query', {
        listRuns(): TraceRun[] {
          return db.query(
            `SELECT run_id as runId, spec_name as specName, model, resume_name as resumeName,
                    started_at as startedAt, completed_at as completedAt,
                    duration_ms as durationMs, iteration, status
             FROM trace_runs ORDER BY started_at DESC`
          ).all() as TraceRun[];
        },
        getRun(runId: string): TraceRun | null {
          return (db.query(
            `SELECT run_id as runId, spec_name as specName, model, resume_name as resumeName,
                    started_at as startedAt, completed_at as completedAt,
                    duration_ms as durationMs, iteration, status
             FROM trace_runs WHERE run_id = ?`
          ).get(runId) as TraceRun) ?? null;
        },
        getEvents(runId: string): TraceEvent[] {
          const rows = db.query(
            `SELECT id, run_id as runId, timestamp, event, stage_id as stageId,
                    plugin_id as pluginId, duration_ms as durationMs, data_json
             FROM trace_events WHERE run_id = ? ORDER BY id`
          ).all(runId) as (Omit<TraceEvent, 'data'> & { data_json: string | null })[];
          return rows.map((r) => ({
            ...r,
            data: r.data_json ? JSON.parse(r.data_json) : undefined,
            data_json: undefined,
          })) as unknown as TraceEvent[];
        },
        getLLMCalls(runId: string): TraceLLMCall[] {
          return db.query(
            `SELECT id, run_id as runId, call_id as callId, plugin_key as pluginKey,
                    model, prompt, response, temperature,
                    started_at as startedAt, completed_at as completedAt,
                    duration_ms as durationMs, prompt_tokens as promptTokens,
                    response_tokens as responseTokens, error
             FROM trace_llm_calls WHERE run_id = ? ORDER BY id`
          ).all(runId) as TraceLLMCall[];
        },
        getLLMCall(callId: string): TraceLLMCall | null {
          return (db.query(
            `SELECT id, run_id as runId, call_id as callId, plugin_key as pluginKey,
                    model, prompt, response, temperature,
                    started_at as startedAt, completed_at as completedAt,
                    duration_ms as durationMs, prompt_tokens as promptTokens,
                    response_tokens as responseTokens, error
             FROM trace_llm_calls WHERE call_id = ?`
          ).get(callId) as TraceLLMCall) ?? null;
        },
      });
    },
  };
}
