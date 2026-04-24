import { openDatabase } from '../platform.js';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Plugin } from 'rhodium-core';
import { getCatalystContext } from '../context.js';

export interface CatalogDbOptions {
  dbPath?: string;
}

export function catalogDbPlugin(options: CatalogDbOptions = {}): Plugin {
  return {
    key: 'catalog-db',
    version: '1.0.0',
    manifest: {
      name: 'Catalog Database',
      description: 'Shared SQLite database for company sources and indexed jobs',
      provides: [{ capability: 'catalog.db' }],
      needs: [],
      tags: ['indexer'],
    },
    activate(ctx) {
      const dbPath = options.dbPath ?? getCatalystContext().dbPaths.catalog;
      if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true });
      const db = openDatabase(dbPath);

      db.exec('PRAGMA foreign_keys = ON');

      db.exec(`CREATE TABLE IF NOT EXISTS company_sources (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        ats_type TEXT NOT NULL,
        slug TEXT NOT NULL,
        added_at TEXT NOT NULL,
        last_indexed_at TEXT,
        job_count INTEGER NOT NULL DEFAULT 0,
        enabled INTEGER NOT NULL DEFAULT 1
      )`);

      db.exec(`CREATE TABLE IF NOT EXISTS indexed_jobs (
        id TEXT NOT NULL,
        company_source_id TEXT NOT NULL,
        source TEXT NOT NULL,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        url TEXT NOT NULL,
        posted_at TEXT NOT NULL,
        first_seen_at TEXT NOT NULL,
        last_seen_at TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        ats_type TEXT NOT NULL,
        PRIMARY KEY (id, company_source_id),
        FOREIGN KEY (company_source_id) REFERENCES company_sources(id) ON DELETE CASCADE
      )`);

      db.exec(`CREATE INDEX IF NOT EXISTS idx_indexed_jobs_active
              ON indexed_jobs(is_active)`);
      db.exec(`CREATE INDEX IF NOT EXISTS idx_indexed_jobs_company
              ON indexed_jobs(company_source_id)`);

      // Migrations -- add columns if missing
      const hasFilters = db.prepare(
        "SELECT COUNT(*) as c FROM pragma_table_info('company_sources') WHERE name = 'filters'"
      ).get() as { c: number };
      if (!hasFilters.c) {
        db.exec("ALTER TABLE company_sources ADD COLUMN filters TEXT NOT NULL DEFAULT '{}'");
      }

      const hasDept = db.prepare(
        "SELECT COUNT(*) as c FROM pragma_table_info('indexed_jobs') WHERE name = 'department'"
      ).get() as { c: number };
      if (!hasDept.c) {
        db.exec("ALTER TABLE indexed_jobs ADD COLUMN department TEXT");
      }

      ctx.provide('catalog.db', db);
    },
  };
}
