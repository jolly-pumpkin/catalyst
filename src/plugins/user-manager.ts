import { openDatabase } from '../platform.js';
import type Database from 'better-sqlite3';
import { mkdirSync, existsSync, cpSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import type { Plugin } from 'rhodium-core';

export interface UserRecord {
  id: string;
  name: string;
  createdAt: string;
  dataDir: string;
}

export interface UserManagerCapability {
  list(): UserRecord[];
  create(name: string): UserRecord;
  get(id: string): UserRecord | null;
  getByName(name: string): UserRecord | null;
  getCurrentId(): string | null;
  setCurrentId(id: string): void;
}

export function userManagerPlugin(): Plugin {
  return {
    key: 'user-manager',
    version: '1.0.0',
    manifest: {
      name: 'User Manager',
      description: 'Manages user profiles with isolated data directories',
      provides: [{ capability: 'user.manager' }],
      needs: [],
    },
    activate(ctx) {
      const catalystDir = join(homedir(), '.catalyst');
      const usersDir = join(catalystDir, 'users');
      const dbPath = join(catalystDir, 'users-index.db');

      mkdirSync(usersDir, { recursive: true });

      const db = openDatabase(dbPath);
      db.exec(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        data_dir TEXT NOT NULL
      )`);
      db.exec(`CREATE TABLE IF NOT EXISTS current_user (
        singleton INTEGER PRIMARY KEY DEFAULT 1 CHECK (singleton = 1),
        user_id TEXT NOT NULL,
        switched_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`);

      // Migrate legacy data: if ~/.catalyst/catalyst.db exists (old layout) and no users yet,
      // create a "default" user and move old files into their directory.
      const legacyCatalog = join(catalystDir, 'catalyst.db');
      const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
      if (userCount === 0 && existsSync(legacyCatalog)) {
        const defaultUser = createUserInternal(db, usersDir, 'default');
        // Move legacy DBs
        for (const file of ['catalyst.db', 'results.db', 'traces.db']) {
          const src = join(catalystDir, file);
          if (existsSync(src)) {
            renameSync(src, join(defaultUser.dataDir, file));
          }
        }
        // Copy legacy docs
        const legacyDocs = join(catalystDir, 'docs');
        if (existsSync(legacyDocs)) {
          cpSync(legacyDocs, join(defaultUser.dataDir, 'docs'), { recursive: true });
        }
        // Set as current
        db.prepare(
          `INSERT OR REPLACE INTO current_user (singleton, user_id, switched_at) VALUES (1, ?, ?)`,
        ).run(defaultUser.id, new Date().toISOString());
      }

      ctx.provide('user.manager', {
        list(): UserRecord[] {
          return (db.prepare(
            `SELECT id, name, created_at as createdAt, data_dir as dataDir
             FROM users ORDER BY created_at ASC`
          ).all() as UserRecord[]);
        },

        create(name: string): UserRecord {
          return createUserInternal(db, usersDir, name);
        },

        get(id: string): UserRecord | null {
          return (db.prepare(
            `SELECT id, name, created_at as createdAt, data_dir as dataDir
             FROM users WHERE id = ?`
          ).get(id) as UserRecord) ?? null;
        },

        getByName(name: string): UserRecord | null {
          return (db.prepare(
            `SELECT id, name, created_at as createdAt, data_dir as dataDir
             FROM users WHERE name = ?`
          ).get(name) as UserRecord) ?? null;
        },

        getCurrentId(): string | null {
          const row = db.prepare('SELECT user_id FROM current_user WHERE singleton = 1').get() as { user_id: string } | null;
          return row?.user_id ?? null;
        },

        setCurrentId(id: string): void {
          db.prepare(
            `INSERT OR REPLACE INTO current_user (singleton, user_id, switched_at) VALUES (1, ?, ?)`,
          ).run(id, new Date().toISOString());
        },
      } satisfies UserManagerCapability);
    },
  };
}

function createUserInternal(db: Database.Database, usersDir: string, name: string): UserRecord {
  const sanitized = name.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
  if (!sanitized) throw new Error('Invalid user name');

  const existing = db.prepare('SELECT id FROM users WHERE name = ?').get(sanitized) as { id: string } | null;
  if (existing) throw new Error(`User "${sanitized}" already exists`);

  const id = crypto.randomUUID();
  const dataDir = join(usersDir, sanitized);
  const createdAt = new Date().toISOString();

  mkdirSync(join(dataDir, 'docs'), { recursive: true });

  db.prepare(
    `INSERT INTO users (id, name, created_at, data_dir) VALUES (?, ?, ?, ?)`,
  ).run(id, sanitized, createdAt, dataDir);

  return { id, name: sanitized, createdAt, dataDir };
}
