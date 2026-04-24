import type Database from 'better-sqlite3';
import type { Plugin } from 'rhodium-core';
import type { ATSType, IndexedJob, RawJob } from '../types.js';

function escapeLike(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

export function jobIndexStorePlugin(): Plugin {
  return {
    key: 'job-index-store',
    version: '1.0.0',
    manifest: {
      name: 'Job Index Store',
      description: 'SQLite storage for indexed job listings',
      provides: [{ capability: 'job.index' }],
      needs: [{ capability: 'catalog.db' }],
      tags: ['indexer'],
    },
    activate(ctx) {
      const db = ctx.resolve<Database.Database>('catalog.db');

      const upsertStmt = db.prepare(`
        INSERT INTO indexed_jobs (id, company_source_id, source, title, company, location,
                                  description, url, posted_at, first_seen_at, last_seen_at,
                                  is_active, ats_type, department)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        ON CONFLICT(id, company_source_id) DO UPDATE SET
          title = excluded.title,
          company = excluded.company,
          location = excluded.location,
          description = excluded.description,
          url = excluded.url,
          posted_at = excluded.posted_at,
          last_seen_at = excluded.last_seen_at,
          is_active = 1,
          department = excluded.department
      `);

      ctx.provide('job.index', {
        async upsertJobs(companySourceId: string, jobs: RawJob[], atsType: ATSType): Promise<number> {
          const now = new Date().toISOString();
          const tx = db.transaction(() => {
            for (const job of jobs) {
              upsertStmt.run(
                job.id, companySourceId, job.source, job.title, job.company,
                job.location, job.description, job.url, job.postedAt,
                now, now, atsType, job.department ?? null,
              );
            }
          });
          tx();
          return jobs.length;
        },

        async markInactive(companySourceId: string, activeIds: string[]): Promise<number> {
          if (activeIds.length === 0) {
            const result = db.prepare(
              'UPDATE indexed_jobs SET is_active = 0 WHERE company_source_id = ? AND is_active = 1',
            ).run(companySourceId);
            return result.changes;
          }

          const placeholders = activeIds.map(() => '?').join(',');
          const result = db.prepare(
            `UPDATE indexed_jobs SET is_active = 0
             WHERE company_source_id = ? AND is_active = 1
             AND id NOT IN (${placeholders})`,
          ).run(companySourceId, ...activeIds);
          return result.changes;
        },

        async query(filter?: {
          titleKeywords?: string[];
          locations?: string[];
          departments?: string[];
          postedWithinDays?: number;
          companyIds?: string[];
        }): Promise<IndexedJob[]> {
          let sql = 'SELECT * FROM indexed_jobs WHERE is_active = 1';
          const params: (string | number)[] = [];

          if (filter?.companyIds?.length) {
            const placeholders = filter.companyIds.map(() => '?').join(',');
            sql += ` AND company_source_id IN (${placeholders})`;
            params.push(...filter.companyIds);
          }

          if (filter?.titleKeywords?.length) {
            const conditions = filter.titleKeywords.map(() =>
              "LOWER(title) LIKE ? ESCAPE '\\'",
            );
            sql += ` AND (${conditions.join(' OR ')})`;
            for (const kw of filter.titleKeywords) {
              params.push(`%${escapeLike(kw.toLowerCase())}%`);
            }
          }

          if (filter?.locations?.length) {
            const conditions = filter.locations.map(() =>
              "LOWER(location) LIKE ? ESCAPE '\\'",
            );
            sql += ` AND (${conditions.join(' OR ')})`;
            for (const loc of filter.locations) {
              params.push(`%${escapeLike(loc.toLowerCase())}%`);
            }
          }

          if (filter?.departments?.length) {
            const conditions = filter.departments.map(() =>
              "LOWER(department) LIKE ? ESCAPE '\\'",
            );
            sql += ` AND (${conditions.join(' OR ')})`;
            for (const dept of filter.departments) {
              params.push(`%${escapeLike(dept.toLowerCase())}%`);
            }
          }

          if (filter?.postedWithinDays) {
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - filter.postedWithinDays);
            sql += ' AND posted_at >= ?';
            params.push(cutoff.toISOString());
          }

          sql += ' ORDER BY posted_at DESC LIMIT 500';

          const rows = db.prepare(sql).all(...params) as any[];
          return rows.map(rowToIndexedJob);
        },

        async stats(): Promise<{ totalJobs: number; activeJobs: number; companies: number }> {
          const total = db.prepare('SELECT COUNT(*) as c FROM indexed_jobs').get() as any;
          const active = db.prepare('SELECT COUNT(*) as c FROM indexed_jobs WHERE is_active = 1').get() as any;
          const companies = db.prepare('SELECT COUNT(DISTINCT company_source_id) as c FROM indexed_jobs').get() as any;
          return {
            totalJobs: total.c,
            activeJobs: active.c,
            companies: companies.c,
          };
        },
      });
    },
  };
}

function rowToIndexedJob(row: any): IndexedJob {
  return {
    id: row.id,
    source: row.source,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    url: row.url,
    postedAt: row.posted_at,
    companySourceId: row.company_source_id,
    firstSeenAt: row.first_seen_at,
    lastSeenAt: row.last_seen_at,
    isActive: !!row.is_active,
    atsType: row.ats_type as ATSType,
    department: row.department ?? undefined,
  };
}
