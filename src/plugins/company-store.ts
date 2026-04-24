import type Database from 'better-sqlite3';
import type { Plugin } from 'rhodium-core';
import type { ATSType, CompanyFilters, CompanySource } from '../types.js';

export function companyStorePlugin(): Plugin {
  return {
    key: 'company-store',
    version: '1.0.0',
    manifest: {
      name: 'Company Store',
      description: 'Persists watched company sources to SQLite',
      provides: [{ capability: 'company.store' }],
      needs: [{ capability: 'catalog.db' }, { capability: 'ats.detect' }],
      tags: ['indexer'],
    },
    activate(ctx) {
      const db = ctx.resolve<Database.Database>('catalog.db');

      const atsDetect = ctx.resolve<{
        detect(url: string): Promise<{ atsType: ATSType; slug: string; name: string } | null>;
      }>('ats.detect');

      ctx.provide('company.store', {
        async add(url: string): Promise<CompanySource> {
          const existing = db.prepare('SELECT * FROM company_sources WHERE url = ?').get(url) as any;
          if (existing) {
            return rowToCompanySource(existing);
          }

          const detection = await atsDetect.detect(url);
          if (!detection) {
            throw new Error(
              `Could not detect ATS for ${url}. Supported: Greenhouse, Lever, Ashby, Workable.`,
            );
          }

          const source: CompanySource = {
            id: crypto.randomUUID(),
            name: detection.name,
            url,
            atsType: detection.atsType,
            slug: detection.slug,
            addedAt: new Date().toISOString(),
            jobCount: 0,
            enabled: true,
          };

          db.prepare(
            `INSERT INTO company_sources (id, name, url, ats_type, slug, added_at, job_count, enabled)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          ).run(source.id, source.name, source.url, source.atsType, source.slug,
             source.addedAt, source.jobCount, source.enabled ? 1 : 0);

          return source;
        },

        async remove(id: string): Promise<void> {
          // ON DELETE CASCADE in indexed_jobs FK handles cleanup
          db.prepare('DELETE FROM company_sources WHERE id = ?').run(id);
        },

        async list(): Promise<CompanySource[]> {
          const rows = db.prepare('SELECT * FROM company_sources ORDER BY added_at DESC').all() as any[];
          return rows.map(rowToCompanySource);
        },

        async get(id: string): Promise<CompanySource | null> {
          const row = db.prepare('SELECT * FROM company_sources WHERE id = ?').get(id) as any;
          return row ? rowToCompanySource(row) : null;
        },

        async setEnabled(id: string, enabled: boolean): Promise<void> {
          db.prepare('UPDATE company_sources SET enabled = ? WHERE id = ?').run(enabled ? 1 : 0, id);
        },

        async updateIndexed(id: string, jobCount: number): Promise<void> {
          db.prepare(
            'UPDATE company_sources SET last_indexed_at = ?, job_count = ? WHERE id = ?',
          ).run(new Date().toISOString(), jobCount, id);
        },

        async setFilters(id: string, filters: CompanyFilters): Promise<void> {
          db.prepare(
            'UPDATE company_sources SET filters = ? WHERE id = ?',
          ).run(JSON.stringify(filters), id);
        },
      });
    },
  };
}

function rowToCompanySource(row: any): CompanySource {
  let filters: CompanyFilters | undefined;
  try {
    const parsed = JSON.parse(row.filters || '{}');
    if (Object.keys(parsed).length > 0) filters = parsed;
  } catch { /* ignore bad JSON */ }

  return {
    id: row.id,
    name: row.name,
    url: row.url,
    atsType: row.ats_type as ATSType,
    slug: row.slug,
    addedAt: row.added_at,
    lastIndexedAt: row.last_indexed_at ?? undefined,
    jobCount: row.job_count,
    enabled: !!row.enabled,
    filters,
  };
}
