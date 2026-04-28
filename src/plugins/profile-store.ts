import { openDatabase } from '../platform.js';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Plugin } from 'rhodium-core';
import type { CandidateProfile } from '../types.js';
import { getCatalystContext } from '../context.js';

export interface ProfileStoreOptions {
  dbPath?: string;
}

/** Migrate old flat skills array to categorized Record format. */
function migrateProfile(raw: Record<string, unknown>): CandidateProfile {
  const profile = raw as CandidateProfile;
  if (Array.isArray(profile.skills)) {
    profile.skills = { General: profile.skills as unknown as string[] };
  }
  return profile;
}

export function profileStorePlugin(options: ProfileStoreOptions = {}): Plugin {
  return {
    key: 'profile-store',
    version: '1.0.0',
    manifest: {
      name: 'Profile Store',
      description: 'Persists the parsed candidate profile to SQLite',
      provides: [{ capability: 'profile.store' }],
      needs: [],
    },
    activate(ctx) {
      const dbPath = options.dbPath ?? getCatalystContext().dbPaths.results;
      if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true });
      const db = openDatabase(dbPath);

      db.exec(`CREATE TABLE IF NOT EXISTS stored_profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        profile_json TEXT NOT NULL,
        source_resume TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`);

      ctx.provide('profile.store', {
        get(): CandidateProfile | null {
          const row = db.prepare(
            `SELECT profile_json FROM stored_profile WHERE id = 1`,
          ).get() as { profile_json: string } | undefined;
          return row ? migrateProfile(JSON.parse(row.profile_json)) : null;
        },

        getWithMeta(): { profile: CandidateProfile; sourceResume: string; updatedAt: string } | null {
          const row = db.prepare(
            `SELECT profile_json, source_resume, updated_at FROM stored_profile WHERE id = 1`,
          ).get() as { profile_json: string; source_resume: string; updated_at: string } | undefined;
          if (!row) return null;
          return {
            profile: migrateProfile(JSON.parse(row.profile_json)),
            sourceResume: row.source_resume,
            updatedAt: row.updated_at,
          };
        },

        save(profile: CandidateProfile, sourceResume: string): void {
          db.prepare(
            `INSERT OR REPLACE INTO stored_profile (id, profile_json, source_resume, updated_at)
             VALUES (1, ?, ?, ?)`,
          ).run(JSON.stringify(profile), sourceResume, new Date().toISOString());
        },
      });
    },
  };
}
