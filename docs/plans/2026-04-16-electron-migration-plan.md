# Electron Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the Ink TUI with an Electron desktop app using Vite + React + CSS modules, with background job indexing and native notifications.

**Architecture:** Rhodium broker runs in Electron's main process (Node.js). React renderer communicates via typed IPC bridge. Bun-specific APIs in Catalyst plugins are swapped for Node equivalents. Rhodium packages are untouched.

**Tech Stack:** Electron Forge, Vite, React 18, better-sqlite3, CSS modules, TypeScript

---

## Phase 1: Project Scaffolding

### Task 1: Install Electron Forge + Vite dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Electron Forge with Vite plugin**

```bash
npm install --save-dev @electron-forge/cli @electron-forge/maker-zip @electron-forge/plugin-vite electron
npm install --save-dev @types/node
```

**Step 2: Install better-sqlite3 and its types**

```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

**Step 3: Install dotenv for env loading**

```bash
npm install dotenv
```

**Step 4: Remove TUI-only dependencies**

```bash
npm uninstall ink ink-text-input chalk
npm uninstall @types/bun
```

**Step 5: Verify package.json looks correct**

Run: `cat package.json`

**Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: swap TUI deps for Electron + better-sqlite3"
```

---

### Task 2: Create Vite + Forge configuration files

**Files:**
- Create: `forge.config.ts`
- Create: `vite.main.config.ts`
- Create: `vite.renderer.config.ts`
- Create: `vite.preload.config.ts`

**Step 1: Write forge.config.ts**

```typescript
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerZIP } from '@electron-forge/maker-zip';
import { VitePlugin } from '@electron-forge/plugin-vite';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
  },
  makers: [new MakerZIP({})],
  plugins: [
    new VitePlugin({
      build: [
        { entry: 'electron/main.ts', config: 'vite.main.config.ts', target: 'main' },
        { entry: 'electron/preload.ts', config: 'vite.preload.config.ts', target: 'preload' },
      ],
      renderer: [
        { name: 'main_window', config: 'vite.renderer.config.ts' },
      ],
    }),
  ],
};

export default config;
```

**Step 2: Write vite.main.config.ts**

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['better-sqlite3', 'electron'],
    },
  },
});
```

**Step 3: Write vite.renderer.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
```

Note: Also `npm install --save-dev @vitejs/plugin-react`.

**Step 4: Write vite.preload.config.ts**

```typescript
import { defineConfig } from 'vite';

export default defineConfig({});
```

**Step 5: Create renderer HTML entry point**

Create `index.html` at project root:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'" />
    <title>Catalyst</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/renderer/main.tsx"></script>
  </body>
</html>
```

**Step 6: Update tsconfig.json for DOM types**

Add `"DOM"` to the `lib` array so renderer code can use browser APIs:

```json
{
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    ...
  }
}
```

**Step 7: Add Forge scripts to package.json**

Add to `"scripts"`:

```json
{
  "scripts": {
    "start": "electron-forge start",
    "build": "electron-forge make",
    "package": "electron-forge package"
  }
}
```

**Step 8: Commit**

```bash
git add forge.config.ts vite.*.config.ts index.html tsconfig.json package.json
git commit -m "chore: add Electron Forge + Vite config files"
```

---

## Phase 2: Node Compatibility Layer

### Task 3: Create platform.ts — Database wrapper and file utilities

**Files:**
- Create: `src/platform.ts`

The critical API difference: `bun:sqlite` has `db.run(sql, params)` and `db.query(sql).all(params)`. `better-sqlite3` uses `db.prepare(sql).run(params)` and `db.prepare(sql).all(params)`. Also `db.exec(sql)` for DDL.

Rather than wrapping, we swap call sites directly since `better-sqlite3`'s API is clean. But we do need a re-export so all plugins import from one place.

**Step 1: Write src/platform.ts**

```typescript
import Database from 'better-sqlite3';
import { readFile, writeFile, access } from 'node:fs/promises';

export { Database };
export type { Database as DatabaseType } from 'better-sqlite3';

export function openDatabase(path: string): Database.Database {
  return new Database(path);
}

export async function readFileText(path: string): Promise<string> {
  return readFile(path, 'utf-8');
}

export async function readFileBuffer(path: string): Promise<Buffer> {
  return readFile(path);
}

export async function writeFileText(path: string, content: string): Promise<void> {
  await writeFile(path, content, 'utf-8');
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
```

Note: URL opening uses `shell.openExternal()` from Electron (see Task 12, IPC handler for `open-url`), not a platform utility.

**Step 2: Commit**

```bash
git add src/platform.ts
git commit -m "feat: add platform.ts with Node replacements for Bun APIs"
```

---

### Task 4: Migrate catalog-db.ts from bun:sqlite to better-sqlite3

**Files:**
- Modify: `src/plugins/catalog-db.ts`

**Step 1: Read the current file to confirm exact content**

**Step 2: Update imports and DB calls**

Replace line 1:
```typescript
// OLD: import { Database } from 'bun:sqlite';
// NEW:
import { openDatabase } from '../platform.js';
```

Replace line 25:
```typescript
// OLD: const db = new Database(dbPath);
// NEW:
const db = openDatabase(dbPath);
```

Replace all `db.run(...)` calls (lines 27-62) with `db.exec(...)` for DDL statements (CREATE TABLE, CREATE INDEX). For DDL with no params, `db.exec()` is the `better-sqlite3` equivalent.

Specifically, the DDL blocks become:
```typescript
db.exec('PRAGMA foreign_keys = ON');

db.exec(`CREATE TABLE IF NOT EXISTS company_sources (...)`);
db.exec(`CREATE TABLE IF NOT EXISTS indexed_jobs (...)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_indexed_jobs_active ON indexed_jobs(is_active)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_indexed_jobs_company ON indexed_jobs(company_source_id)`);
```

Line 64 — `ctx.provide('catalog.db', db)` stays the same (the db object is the `better-sqlite3` instance).

**Step 3: Run tests**

```bash
npx vitest run src/plugins/catalog-db
```

(Note: tests may need their own migration from `bun:test` — see Task 10.)

**Step 4: Commit**

```bash
git add src/plugins/catalog-db.ts
git commit -m "refactor: migrate catalog-db from bun:sqlite to better-sqlite3"
```

---

### Task 5: Migrate user-manager.ts

**Files:**
- Modify: `src/plugins/user-manager.ts`

**Step 1: Update imports**

Replace line 1:
```typescript
import { openDatabase } from '../platform.js';
import type Database from 'better-sqlite3';
```

**Step 2: Update Database instantiation**

Line 40:
```typescript
const db = openDatabase(dbPath);
```

**Step 3: Convert db.run() calls to db.exec() or db.prepare().run()**

- Lines 41-52 (CREATE TABLE): use `db.exec(sql)`
- Lines 73-76 (`INSERT OR REPLACE` with params): use `db.prepare(sql).run(...params)`
- Line 111-114: use `db.prepare(sql).run(...params)`
- Lines 134-137: use `db.prepare(sql).run(...params)`

**Step 4: Convert db.query().get() and db.query().all() to db.prepare().get() and db.prepare().all()**

- Line 57: `db.query('SELECT COUNT(*)...').get()` → `db.prepare('SELECT COUNT(*)...').get()`
- Lines 81-84: `db.query(sql).all()` → `db.prepare(sql).all()`
- Lines 92-95: `db.query(sql).get(id)` → `db.prepare(sql).get(id)`
- Lines 99-102: `db.query(sql).get(name)` → `db.prepare(sql).get(name)`
- Line 106: `db.query(sql).get()` → `db.prepare(sql).get()`
- Line 125: `db.query(sql).get(sanitized)` → `db.prepare(sql).get(sanitized)`

**Step 5: Update createUserInternal function signature**

Line 121: Change `Database` type to the `better-sqlite3` Database type:
```typescript
function createUserInternal(db: Database.Database, usersDir: string, name: string): UserRecord {
```

**Step 6: Commit**

```bash
git add src/plugins/user-manager.ts
git commit -m "refactor: migrate user-manager from bun:sqlite to better-sqlite3"
```

---

### Task 6: Migrate results-store.ts

**Files:**
- Modify: `src/plugins/results-store.ts`

**Step 1: Update import**

Line 1: `import { openDatabase } from '../platform.js';`

**Step 2: Replace Database instantiation**

Line 28: `const db = openDatabase(dbPath);`

**Step 3: Convert DDL db.run() to db.exec()**

Lines 30-67: All `CREATE TABLE` and `ALTER TABLE` statements → `db.exec(sql)`

**Step 4: Convert PRAGMA calls**

Line 40: `db.query('PRAGMA table_info(runs)').all()` → `db.pragma('table_info(runs)')` (better-sqlite3 has a dedicated `.pragma()` method).

**Step 5: Convert parameterized db.run() to db.prepare().run()**

- Lines 75-78 (INSERT INTO runs): `db.prepare(sql).run(...params)`
- Lines 81-86 (INSERT INTO ranked_jobs): `db.prepare(sql).run(...params)`
- Lines 97-108 (UPDATE runs): `db.prepare(sql).run(...params)`

**Step 6: Convert db.query().all() and db.query().get() to db.prepare()**

- Line 114: `db.query(sql).all()` → `db.prepare(sql).all()`
- Lines 121-123: `db.query(sql).all(runId)` → `db.prepare(sql).all(runId)`
- Lines 127-136: `db.query(sql).get(runId)` → `db.prepare(sql).get(runId)`
- Lines 138-140: `db.query(sql).all(runId)` → `db.prepare(sql).all(runId)`
- Lines 153-155: `db.query(sql).get()` → `db.prepare(sql).get()`

**Step 7: Commit**

```bash
git add src/plugins/results-store.ts
git commit -m "refactor: migrate results-store from bun:sqlite to better-sqlite3"
```

---

### Task 7: Migrate trace-store.ts

**Files:**
- Modify: `src/plugins/trace-store.ts`

Same pattern as above:

**Step 1:** Replace import line 1 with `import { openDatabase } from '../platform.js';`

**Step 2:** Line 28: `const db = openDatabase(dbPath);`

**Step 3:** Lines 30-74: All DDL `db.run()` → `db.exec()`

**Step 4:** Lines 77-103: All `db.prepare()` calls stay the same — `better-sqlite3` has the same `.prepare()` API.

**Step 5:** Lines 143-178: All `db.query(sql).all()` and `db.query(sql).get()` → `db.prepare(sql).all()` and `db.prepare(sql).get()`

**Step 6: Commit**

```bash
git add src/plugins/trace-store.ts
git commit -m "refactor: migrate trace-store from bun:sqlite to better-sqlite3"
```

---

### Task 8: Migrate company-store.ts, job-index-store.ts, kanban-store.ts

These three plugins import `Database` as a **type only** from `bun:sqlite` (they receive the db instance from the broker via `ctx.resolve('catalog.db')`).

**Files:**
- Modify: `src/plugins/company-store.ts`
- Modify: `src/plugins/job-index-store.ts`
- Modify: `src/plugins/kanban-store.ts`

**Step 1: Update type imports in all three files**

Replace line 1 in each:
```typescript
// OLD: import type { Database } from 'bun:sqlite';
// NEW:
import type Database from 'better-sqlite3';
```

**Step 2: Convert company-store.ts db.query() calls**

- Line 25: `db.query(sql).get(url)` → `db.prepare(sql).get(url)`
- Lines 48-53: `db.run(sql, [...params])` → `db.prepare(sql).run(...params)`
- Line 60: `db.run(sql, [id])` → `db.prepare(sql).run(id)`
- Line 64: `db.query(sql).all()` → `db.prepare(sql).all()`
- Line 69: `db.query(sql).get(id)` → `db.prepare(sql).get(id)`
- Line 74: `db.run(sql, [...])` → `db.prepare(sql).run(...params)`
- Lines 78-80: `db.run(sql, [...])` → `db.prepare(sql).run(...params)`

**Step 3: Convert job-index-store.ts**

The `db.prepare()` calls (lines 23-37) stay as-is.
- Line 42: `db.transaction(fn)` stays as-is (same API).
- Lines 57-58: `db.run(sql, [params])` → `db.prepare(sql).run(...params)`
- Lines 65-66: `db.run(sql, [params])` → `db.prepare(sql).run(...params)`
- Line 105: `db.query(sql).all(...params)` → `db.prepare(sql).all(...params)`
- Lines 110-112: `db.query(sql).get()` → `db.prepare(sql).get()`

**Step 4: Convert kanban-store.ts**

DDL statements (lines 52-68): `db.run()` → `db.exec()`
- Lines 70-83: `db.prepare()` calls stay as-is.
- Line 101-103: `db.run(sql, [...])` → `db.prepare(sql).run(...params)`
- Lines 108-110: `db.query(sql).all(...)` → `db.prepare(sql).all(...)`
- Lines 121-125: `db.query(sql).all(...)` → `db.prepare(sql).all(...)`
- Lines 130-132: `db.query(sql).get(...)` → `db.prepare(sql).get(...)`

**Step 5: Commit**

```bash
git add src/plugins/company-store.ts src/plugins/job-index-store.ts src/plugins/kanban-store.ts
git commit -m "refactor: migrate remaining store plugins from bun:sqlite to better-sqlite3"
```

---

### Task 9: Migrate input.ts from Bun.file/Bun.write to Node fs

**Files:**
- Modify: `src/input.ts`

**Step 1: Update imports and replace Bun API calls**

Replace `Bun.file()`, `Bun.write()`, and their chained methods:

```typescript
import { readFileText, readFileBuffer, writeFileText, fileExists } from './platform.js';
```

- Line 15-17: `Bun.file(configPath)` + `.exists()` → `fileExists(configPath)`
- Line 25: `Bun.write(configPath, ...)` → `writeFileText(configPath, ...)`
- Line 28: `configFile.text()` → `readFileText(configPath)`
- Line 37-38: `Bun.file(resolved)` + `.exists()` → `fileExists(resolved)`
- Line 43: `file.text()` → `readFileText(resolved)`
- Line 48: `file.arrayBuffer()` → `readFileBuffer(resolved)` (returns Buffer directly)
- Line 55: `file.arrayBuffer()` → `readFileBuffer(resolved)`

**Step 2: Commit**

```bash
git add src/input.ts
git commit -m "refactor: migrate input.ts from Bun.file/Bun.write to Node fs"
```

---

### Task 10: Migrate test files from bun:test to vitest

**Files:**
- Modify: all 12 `*.test.ts` files
- Modify: `package.json` (add vitest dep)

**Step 1: Install vitest**

```bash
npm install --save-dev vitest
```

Add to package.json scripts: `"test": "vitest run"`

**Step 2: Update imports in all test files**

In each test file, replace:
```typescript
// OLD: import { describe, it, expect, beforeEach, mock } from 'bun:test';
// NEW:
import { describe, it, expect, beforeEach, vi } from 'vitest';
```

Note: `bun:test`'s `mock()` → vitest's `vi.fn()` / `vi.mock()`. Check each test file for mock usage and update accordingly.

**Step 3: Replace Bun.write in input.test.ts**

Lines 6, 12, 18: `Bun.write(path, content)` → `writeFileSync(path, content)` from `node:fs`.

**Step 4: Run tests**

```bash
npm test
```

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: migrate tests from bun:test to vitest"
```

---

## Phase 3: Electron Main Process

### Task 11: Create electron/main.ts — app entry point

**Files:**
- Create: `electron/main.ts`

**Step 1: Write the main process entry**

```typescript
import { app, BrowserWindow } from 'electron';
import { join } from 'node:path';
import { createBroker } from 'rhodium-core';
import { createPipelineRunnerPlugin } from 'rhodium-pipeline-runner';
import { loadConfig } from '../src/input.js';
import { setCatalystContext, buildUserContext } from '../src/context.js';
import { registerAllIpc } from './ipc/index.js';
import { startScheduler, stopScheduler } from './scheduler.js';

// Plugin imports (same as old index.ts lines 8-26)
import { ollamaProviderPlugin } from '../src/plugins/ollama-provider.js';
import { resultsStorePlugin } from '../src/plugins/results-store.js';
import { traceStorePlugin } from '../src/plugins/trace-store.js';
import { catalogDbPlugin } from '../src/plugins/catalog-db.js';
import { atsDetectorPlugin } from '../src/plugins/ats-detector.js';
import { companyStorePlugin } from '../src/plugins/company-store.js';
import { jobIndexStorePlugin } from '../src/plugins/job-index-store.js';
import { jobIndexerPlugin } from '../src/plugins/job-indexer.js';
import { indexFetcherPlugin } from '../src/plugins/index-fetcher.js';
import { remotiveFetcherPlugin } from '../src/plugins/remotive-fetcher.js';
import { profileParserPlugin } from '../src/plugins/profile-parser.js';
import { jobNormalizerPlugin } from '../src/plugins/job-normalizer.js';
import { skillMatcherPlugin } from '../src/plugins/skill-matcher.js';
import { cultureFitAnalyzerPlugin } from '../src/plugins/culture-fit-analyzer.js';
import { salaryEstimatorPlugin } from '../src/plugins/salary-estimator.js';
import { synthesizerPlugin } from '../src/plugins/synthesizer.js';
import { reflectionAgentPlugin } from '../src/plugins/reflection-agent.js';
import { userManagerPlugin } from '../src/plugins/user-manager.js';
import { kanbanStorePlugin } from '../src/plugins/kanban-store.js';

let mainWindow: BrowserWindow | null = null;
let broker: ReturnType<typeof createBroker> | null = null;
let userBroker: ReturnType<typeof createBroker> | null = null;

export async function createUserBroker() {
  userBroker = createBroker({});
  userBroker.register(userManagerPlugin());
  await userBroker.activate();
  return userBroker;
}

export async function createAppBroker(config: Awaited<ReturnType<typeof loadConfig>>, model: string) {
  broker = createBroker({});
  // Register all plugins (same order as old index.ts)
  broker.register(ollamaProviderPlugin({ model, baseUrl: config.ollamaUrl }));
  broker.register(resultsStorePlugin());
  broker.register(traceStorePlugin());
  broker.register(createPipelineRunnerPlugin());
  broker.register(catalogDbPlugin());
  broker.register(atsDetectorPlugin());
  broker.register(companyStorePlugin());
  broker.register(jobIndexStorePlugin());
  broker.register(jobIndexerPlugin({ intervalHours: config.indexIntervalHours, autoStart: false }));
  broker.register(kanbanStorePlugin());
  broker.register(indexFetcherPlugin());
  broker.register(remotiveFetcherPlugin());
  broker.register(profileParserPlugin());
  broker.register(jobNormalizerPlugin());
  broker.register(skillMatcherPlugin());
  broker.register(cultureFitAnalyzerPlugin());
  broker.register(salaryEstimatorPlugin());
  broker.register(synthesizerPlugin());
  broker.register(reflectionAgentPlugin());
  await broker.activate();
  return broker;
}

export function getBroker() { return broker; }
export function getUserBroker() { return userBroker; }
export function getMainWindow() { return mainWindow; }

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Vite dev server URL injected by Electron Forge
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

// Vite env declarations
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

app.whenReady().then(async () => {
  const config = await loadConfig();

  await createUserBroker();
  registerAllIpc(config);
  createWindow();
});

app.on('window-all-closed', async () => {
  stopScheduler();
  if (broker) await broker.deactivate();
  if (userBroker) await userBroker.deactivate();
  app.quit();
});
```

**Step 2: Commit**

```bash
git add electron/main.ts
git commit -m "feat: add Electron main process entry point"
```

---

### Task 12: Create electron/preload.ts — typed IPC bridge

**Files:**
- Create: `electron/preload.ts`
- Create: `src/shared/ipc-channels.ts` (channel name constants)

**Step 1: Write IPC channel constants**

```typescript
// src/shared/ipc-channels.ts
export const IPC = {
  // Renderer -> Main (invoke)
  USERS_LIST: 'users:list',
  USERS_CREATE: 'users:create',
  USERS_SELECT: 'users:select',
  PIPELINE_RUN: 'pipeline:run',
  PIPELINE_RUN_COMPANY: 'pipeline:run-company',
  COMPANIES_LIST: 'companies:list',
  COMPANIES_ADD: 'companies:add',
  COMPANIES_REMOVE: 'companies:remove',
  COMPANIES_TOGGLE: 'companies:toggle',
  INDEX_RUN: 'index:run',
  INDEX_COMPANY: 'index:company',
  KANBAN_COLUMNS: 'kanban:columns',
  KANBAN_MOVE: 'kanban:move',
  RESULTS_LIST_RUNS: 'results:list-runs',
  RESULTS_GET_RUN: 'results:get-run',
  RESULTS_GET_JOBS: 'results:get-jobs',
  DOCS_LIST: 'docs:list',
  DOCS_READ: 'docs:read',
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
  OPEN_URL: 'open-url',

  // Main -> Renderer (push)
  PIPELINE_STAGE_UPDATE: 'pipeline:stage-update',
  PIPELINE_PROVIDER_UPDATE: 'pipeline:provider-update',
  PIPELINE_ENRICHMENT: 'pipeline:enrichment',
  PIPELINE_DONE: 'pipeline:done',
  PIPELINE_ERROR: 'pipeline:error',
  INDEX_NEW_JOBS: 'index:new-jobs',
} as const;
```

**Step 2: Write preload.ts**

```typescript
import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from '../src/shared/ipc-channels.js';

const api = {
  users: {
    list: () => ipcRenderer.invoke(IPC.USERS_LIST),
    create: (name: string) => ipcRenderer.invoke(IPC.USERS_CREATE, name),
    select: (id: string) => ipcRenderer.invoke(IPC.USERS_SELECT, id),
  },
  pipeline: {
    run: (resumeText: string, resumeName: string) =>
      ipcRenderer.invoke(IPC.PIPELINE_RUN, resumeText, resumeName),
    runCompany: (resumeText: string, resumeName: string, companyId: string) =>
      ipcRenderer.invoke(IPC.PIPELINE_RUN_COMPANY, resumeText, resumeName, companyId),
  },
  companies: {
    list: () => ipcRenderer.invoke(IPC.COMPANIES_LIST),
    add: (url: string) => ipcRenderer.invoke(IPC.COMPANIES_ADD, url),
    remove: (id: string) => ipcRenderer.invoke(IPC.COMPANIES_REMOVE, id),
    toggle: (id: string, enabled: boolean) => ipcRenderer.invoke(IPC.COMPANIES_TOGGLE, id, enabled),
  },
  index: {
    run: () => ipcRenderer.invoke(IPC.INDEX_RUN),
    company: (id: string) => ipcRenderer.invoke(IPC.INDEX_COMPANY, id),
  },
  kanban: {
    columns: (companyId: string, column: string) =>
      ipcRenderer.invoke(IPC.KANBAN_COLUMNS, companyId, column),
    move: (jobId: string, companyId: string, column: string, feedback?: { tags: string[]; notes?: string }) =>
      ipcRenderer.invoke(IPC.KANBAN_MOVE, jobId, companyId, column, feedback),
  },
  results: {
    listRuns: () => ipcRenderer.invoke(IPC.RESULTS_LIST_RUNS),
    getRun: (id: string) => ipcRenderer.invoke(IPC.RESULTS_GET_RUN, id),
    getJobs: (id: string) => ipcRenderer.invoke(IPC.RESULTS_GET_JOBS, id),
  },
  docs: {
    list: () => ipcRenderer.invoke(IPC.DOCS_LIST),
    read: (path: string) => ipcRenderer.invoke(IPC.DOCS_READ, path),
  },
  settings: {
    get: () => ipcRenderer.invoke(IPC.SETTINGS_GET),
    set: (key: string, value: unknown) => ipcRenderer.invoke(IPC.SETTINGS_SET, key, value),
  },
  openUrl: (url: string) => ipcRenderer.invoke(IPC.OPEN_URL, url),

  // Main -> Renderer event listeners
  on: {
    stageUpdate: (cb: (data: any) => void) => {
      const handler = (_: any, data: any) => cb(data);
      ipcRenderer.on(IPC.PIPELINE_STAGE_UPDATE, handler);
      return () => ipcRenderer.removeListener(IPC.PIPELINE_STAGE_UPDATE, handler);
    },
    providerUpdate: (cb: (data: any) => void) => {
      const handler = (_: any, data: any) => cb(data);
      ipcRenderer.on(IPC.PIPELINE_PROVIDER_UPDATE, handler);
      return () => ipcRenderer.removeListener(IPC.PIPELINE_PROVIDER_UPDATE, handler);
    },
    enrichment: (cb: (data: any) => void) => {
      const handler = (_: any, data: any) => cb(data);
      ipcRenderer.on(IPC.PIPELINE_ENRICHMENT, handler);
      return () => ipcRenderer.removeListener(IPC.PIPELINE_ENRICHMENT, handler);
    },
    pipelineDone: (cb: (data: any) => void) => {
      const handler = (_: any, data: any) => cb(data);
      ipcRenderer.on(IPC.PIPELINE_DONE, handler);
      return () => ipcRenderer.removeListener(IPC.PIPELINE_DONE, handler);
    },
    pipelineError: (cb: (data: any) => void) => {
      const handler = (_: any, data: any) => cb(data);
      ipcRenderer.on(IPC.PIPELINE_ERROR, handler);
      return () => ipcRenderer.removeListener(IPC.PIPELINE_ERROR, handler);
    },
    newJobs: (cb: (data: any) => void) => {
      const handler = (_: any, data: any) => cb(data);
      ipcRenderer.on(IPC.INDEX_NEW_JOBS, handler);
      return () => ipcRenderer.removeListener(IPC.INDEX_NEW_JOBS, handler);
    },
  },
};

export type CatalystAPI = typeof api;

contextBridge.exposeInMainWorld('catalyst', api);
```

**Step 3: Create type declaration for window.catalyst**

Create `src/shared/window.d.ts`:
```typescript
import type { CatalystAPI } from '../../electron/preload.js';

declare global {
  interface Window {
    catalyst: CatalystAPI;
  }
}
```

**Step 4: Commit**

```bash
git add electron/preload.ts src/shared/ipc-channels.ts src/shared/window.d.ts
git commit -m "feat: add preload script with typed IPC bridge"
```

---

### Task 13: Create IPC handlers

**Files:**
- Create: `electron/ipc/index.ts`
- Create: `electron/ipc/users.ts`
- Create: `electron/ipc/pipeline.ts`
- Create: `electron/ipc/companies.ts`
- Create: `electron/ipc/kanban.ts`
- Create: `electron/ipc/results.ts`
- Create: `electron/ipc/docs.ts`

Each IPC handler file follows the same pattern: import `ipcMain` from `electron`, import `getBroker`/`getUserBroker`/`getMainWindow` from `main.ts`, register `ipcMain.handle()` calls.

**Step 1: Write electron/ipc/index.ts**

This aggregates all handler registrations:
```typescript
import { registerUserHandlers } from './users.js';
import { registerPipelineHandlers } from './pipeline.js';
import { registerCompanyHandlers } from './companies.js';
import { registerKanbanHandlers } from './kanban.js';
import { registerResultsHandlers } from './results.js';
import { registerDocsHandlers } from './docs.js';
import type { CatalystConfig } from '../../src/input.js';

export function registerAllIpc(config: CatalystConfig) {
  registerUserHandlers(config);
  registerPipelineHandlers(config);
  registerCompanyHandlers();
  registerKanbanHandlers();
  registerResultsHandlers();
  registerDocsHandlers();
}
```

**Step 2: Write electron/ipc/users.ts**

Key handler — `users:select` must tear down old broker, set context, create new broker, start scheduler:

```typescript
import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getUserBroker, createAppBroker, getBroker, getMainWindow } from '../main.js';
import { setCatalystContext, buildUserContext } from '../../src/context.js';
import { wireBrokerEvents } from '../events.js';
import { startScheduler } from '../scheduler.js';
import type { UserManagerCapability } from '../../src/plugins/user-manager.js';
import type { CatalystConfig } from '../../src/input.js';

export function registerUserHandlers(config: CatalystConfig) {
  ipcMain.handle(IPC.USERS_LIST, () => {
    const um = getUserBroker()!.resolve<UserManagerCapability>('user.manager');
    return um.list();
  });

  ipcMain.handle(IPC.USERS_CREATE, (_, name: string) => {
    const um = getUserBroker()!.resolve<UserManagerCapability>('user.manager');
    return um.create(name);
  });

  ipcMain.handle(IPC.USERS_SELECT, async (_, id: string) => {
    const um = getUserBroker()!.resolve<UserManagerCapability>('user.manager');
    const user = um.get(id);
    if (!user) throw new Error(`User not found: ${id}`);

    // Tear down previous broker
    const oldBroker = getBroker();
    if (oldBroker) await oldBroker.deactivate();

    // Set user context
    setCatalystContext(buildUserContext(user.name));
    um.setCurrentId(id);

    // Create per-user broker
    const broker = await createAppBroker(config, config.ollamaModel);

    // Wire broker events to renderer
    const win = getMainWindow();
    if (win) wireBrokerEvents(broker, win);

    // Start background indexer
    startScheduler(broker, config);

    return user;
  });
}
```

**Step 3: Write electron/ipc/pipeline.ts**

```typescript
import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getBroker, getMainWindow } from '../main.js';
import { jobSeekerSpec } from '../../src/spec.js';
import type { PipelineRunner } from 'rhodium-pipeline-runner';
import type { RankedJob, CandidateProfile, NormalizedJob, JobAnalysis, ReflectOutput } from '../../src/types.js';
import type { KanbanStoreCapability } from '../../src/plugins/kanban-store.js';
import type { CatalystConfig } from '../../src/input.js';

export function registerPipelineHandlers(config: CatalystConfig) {
  ipcMain.handle(IPC.PIPELINE_RUN, async (_, resumeText: string, resumeName: string) => {
    return runPipeline(resumeText, resumeName, config);
  });

  ipcMain.handle(IPC.PIPELINE_RUN_COMPANY, async (_, resumeText: string, resumeName: string, companyId: string) => {
    return runPipeline(resumeText, resumeName, config, companyId);
  });

  // URL opening uses Electron's shell API (safe, no command injection)
  ipcMain.handle(IPC.OPEN_URL, async (_, url: string) => {
    const { shell } = await import('electron');
    await shell.openExternal(url);
  });
}

async function runPipeline(resumeText: string, resumeName: string, config: CatalystConfig, companySourceId?: string) {
  const broker = getBroker();
  const win = getMainWindow();
  if (!broker || !win) throw new Error('No user selected');

  const runner = broker.resolve<PipelineRunner>('pipeline-runner');
  const runId = crypto.randomUUID();
  const start = Date.now();

  try {
    const result = await runner.run(jobSeekerSpec, { resumeText, resumeName });
    const jobs = (result.stageOutputs.get('synthesize') ?? []) as RankedJob[];
    const durationMs = Date.now() - start;

    // Save results
    const store = broker.resolve<{
      save(runId: string, resumeName: string, model: string,
           iteration: number, durationMs: number, jobs: RankedJob[],
           companySourceId?: string): Promise<void>;
      saveEnrichment(runId: string, data: {
        profile?: CandidateProfile; normalizedJobs?: NormalizedJob[];
        analyses?: JobAnalysis[]; reflectRationale?: string; confidence?: number;
      }): void;
    }>('results.store');
    await store.save(runId, resumeName, config.ollamaModel, result.iteration, durationMs, jobs, companySourceId);

    const profile = result.stageOutputs.get('parse-profile') as CandidateProfile | undefined;
    const normalizedJobs = result.stageOutputs.get('normalize-jobs') as NormalizedJob[] | undefined;
    const analyses = (result.stageOutputs.get('analyze-jobs') as JobAnalysis[][] | undefined)?.flat();
    const reflectOutput = result.stageOutputs.get('reflect') as ReflectOutput | undefined;

    store.saveEnrichment(runId, {
      profile, normalizedJobs, analyses,
      reflectRationale: reflectOutput?.rationale,
      confidence: reflectOutput?.confidence,
    });

    // Push enrichment + done to renderer
    win.webContents.send(IPC.PIPELINE_ENRICHMENT, {
      profile, normalizedJobs, analyses,
      reflectRationale: reflectOutput?.rationale,
      confidence: reflectOutput?.confidence,
    });
    win.webContents.send(IPC.PIPELINE_DONE, {
      results: jobs, iteration: result.iteration, durationMs,
    });

    // Auto-track in kanban
    if (companySourceId && jobs.length > 0) {
      try {
        const kanban = broker.resolve<KanbanStoreCapability>('kanban.store');
        kanban.ensureTracked(companySourceId, jobs);
      } catch { /* kanban may not be available */ }
    }

    return { runId, jobs, iteration: result.iteration, durationMs };
  } catch (err) {
    win.webContents.send(IPC.PIPELINE_ERROR, { error: String(err) });
    throw err;
  }
}
```

**Step 4: Write electron/ipc/companies.ts**

```typescript
import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getBroker } from '../main.js';
import type { CompanySource } from '../../src/types.js';

export function registerCompanyHandlers() {
  ipcMain.handle(IPC.COMPANIES_LIST, async () => {
    const broker = getBroker();
    if (!broker) return [];
    return broker.resolve<{ list(): Promise<CompanySource[]> }>('company.store').list();
  });

  ipcMain.handle(IPC.COMPANIES_ADD, async (_, url: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    return broker.resolve<{ add(url: string): Promise<CompanySource> }>('company.store').add(url);
  });

  ipcMain.handle(IPC.COMPANIES_REMOVE, async (_, id: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    return broker.resolve<{ remove(id: string): Promise<void> }>('company.store').remove(id);
  });

  ipcMain.handle(IPC.COMPANIES_TOGGLE, async (_, id: string, enabled: boolean) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    return broker.resolve<{ setEnabled(id: string, enabled: boolean): Promise<void> }>('company.store').setEnabled(id, enabled);
  });

  ipcMain.handle(IPC.INDEX_RUN, async () => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    return broker.resolve<{ indexNow(): Promise<void> }>('indexer.run').indexNow();
  });

  ipcMain.handle(IPC.INDEX_COMPANY, async (_, id: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    return broker.resolve<{ indexCompany(id: string): Promise<void> }>('indexer.run').indexCompany(id);
  });
}
```

**Step 5: Write remaining handlers** (kanban.ts, results.ts, docs.ts) following the same pattern — resolve capability, call method, return result.

**Step 6: Commit**

```bash
git add electron/ipc/
git commit -m "feat: add IPC handlers for all capability methods"
```

---

### Task 14: Create electron/events.ts — broker event to renderer bridge

**Files:**
- Create: `electron/events.ts`

**Step 1: Write events.ts**

This is a direct port of `wireBrokerEvents()` from `index.ts:431-524`, but instead of dispatching TUI actions, it calls `mainWindow.webContents.send()`:

```typescript
import type { BrowserWindow } from 'electron';
import { PIPELINE_EVENTS, STAGE_EVENTS, PROVIDER_EVENTS } from 'rhodium-pipeline-runner';
import { IPC } from '../src/shared/ipc-channels.js';

export function wireBrokerEvents(broker: any, win: BrowserWindow) {
  const on = (event: string, handler: (payload: any) => void) => {
    broker.on(event, (wrapped: any) => {
      handler('detail' in wrapped ? wrapped.detail : wrapped);
    });
  };

  // Stage events to renderer
  on(STAGE_EVENTS.STARTED, (p) =>
    win.webContents.send(IPC.PIPELINE_STAGE_UPDATE, { type: 'start', ...p }));
  on(STAGE_EVENTS.COMPLETE, (p) =>
    win.webContents.send(IPC.PIPELINE_STAGE_UPDATE, { type: 'done', ...p }));
  on(STAGE_EVENTS.DEGRADED, (p) =>
    win.webContents.send(IPC.PIPELINE_STAGE_UPDATE, { type: 'degraded', ...p }));
  on(STAGE_EVENTS.SKIPPED, (p) =>
    win.webContents.send(IPC.PIPELINE_STAGE_UPDATE, { type: 'skipped', ...p }));

  // Provider events to renderer
  on(PROVIDER_EVENTS.SELECTED, (p) =>
    win.webContents.send(IPC.PIPELINE_PROVIDER_UPDATE, { type: 'start', ...p }));
  on(PROVIDER_EVENTS.FAILED, (p) =>
    win.webContents.send(IPC.PIPELINE_PROVIDER_UPDATE, { type: 'fail', ...p }));

  // Trace store wiring (port from index.ts:459-523)
  let currentRunId: string | null = null;
  const trace = broker.resolve<{
    startRun(runId: string, specName: string, model: string, resumeName: string): void;
    completeRun(runId: string, durationMs: number, iteration: number): void;
    failRun(runId: string, error: string): void;
    recordEvent(runId: string, event: string, payload: Record<string, unknown>): void;
    startLLMCall(runId: string, callId: string, pluginKey: string, model: string, prompt: string, temperature: number): void;
    completeLLMCall(callId: string, response: string, durationMs: number, tokens?: { prompt: number; response: number }): void;
    failLLMCall(callId: string, error: string, durationMs: number): void;
  }>('trace.store');

  on(PIPELINE_EVENTS.STARTED, (payload: any) => {
    currentRunId = payload.runId;
    trace.startRun(payload.runId, payload.specName, '', '');
    trace.recordEvent(payload.runId, PIPELINE_EVENTS.STARTED, payload);
  });

  on(PIPELINE_EVENTS.COMPLETE, (payload: any) => {
    trace.recordEvent(payload.runId, PIPELINE_EVENTS.COMPLETE, payload);
    trace.completeRun(payload.runId, payload.durationMs, payload.stageCount);
    currentRunId = null;
  });

  on(PIPELINE_EVENTS.FAILED, (payload: any) => {
    trace.recordEvent(payload.runId, PIPELINE_EVENTS.FAILED, payload);
    trace.failRun(payload.runId, payload.error);
    currentRunId = null;
  });

  on(PIPELINE_EVENTS.HALTED_ITERATION_LIMIT, (payload: any) => {
    trace.recordEvent(payload.runId, PIPELINE_EVENTS.HALTED_ITERATION_LIMIT, payload);
  });

  on(PIPELINE_EVENTS.ITERATION_STARTED, (payload: any) => {
    trace.recordEvent(payload.runId, PIPELINE_EVENTS.ITERATION_STARTED, payload);
  });

  for (const event of [
    STAGE_EVENTS.STARTED, STAGE_EVENTS.COMPLETE,
    STAGE_EVENTS.SKIPPED, STAGE_EVENTS.DEGRADED,
    PROVIDER_EVENTS.SELECTED, PROVIDER_EVENTS.COMPLETE,
    PROVIDER_EVENTS.FAILED, PROVIDER_EVENTS.FANOUT_STARTED,
    PROVIDER_EVENTS.FANOUT_COMPLETE,
  ]) {
    on(event, (payload: any) => {
      trace.recordEvent(payload.runId, event, payload);
    });
  }

  on('llm:call-start', (payload: any) => {
    if (currentRunId) {
      trace.startLLMCall(currentRunId, payload.callId, payload.caller, payload.model, payload.prompt, payload.temperature);
    }
  });

  on('llm:call-complete', (payload: any) => {
    trace.completeLLMCall(
      payload.callId, payload.response, payload.durationMs,
      payload.promptTokens != null ? { prompt: payload.promptTokens, response: payload.responseTokens } : undefined,
    );
  });

  on('llm:call-failed', (payload: any) => {
    trace.failLLMCall(payload.callId, payload.error, payload.durationMs);
  });
}
```

**Step 2: Commit**

```bash
git add electron/events.ts
git commit -m "feat: add broker event to renderer bridge"
```

---

### Task 15: Create electron/scheduler.ts — background indexer + notifications

**Files:**
- Create: `electron/scheduler.ts`

**Step 1: Write scheduler.ts**

```typescript
import { Notification } from 'electron';
import { IPC } from '../src/shared/ipc-channels.js';
import { getMainWindow } from './main.js';
import type { CatalystConfig } from '../src/input.js';

let intervalId: ReturnType<typeof setInterval> | null = null;

export function startScheduler(broker: any, config: CatalystConfig) {
  stopScheduler();

  const intervalMs = (config.indexIntervalHours ?? 1) * 60 * 60 * 1000;

  intervalId = setInterval(async () => {
    try {
      const indexer = broker.resolve<{ indexNow(): Promise<void> }>('indexer.run');
      const jobIndex = broker.resolve<{ stats(): Promise<{ activeJobs: number }> }>('job.index');

      const beforeStats = await jobIndex.stats();
      await indexer.indexNow();
      const afterStats = await jobIndex.stats();

      const newCount = afterStats.activeJobs - beforeStats.activeJobs;
      if (newCount > 0) {
        // Native notification
        new Notification({
          title: 'Catalyst',
          body: `${newCount} new job${newCount > 1 ? 's' : ''} found`,
        }).show();

        // Push to renderer
        const win = getMainWindow();
        if (win) win.webContents.send(IPC.INDEX_NEW_JOBS, { newCount });
      }
    } catch (err) {
      console.error('Scheduler index error:', err);
    }
  }, intervalMs);
}

export function stopScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
```

**Step 2: Commit**

```bash
git add electron/scheduler.ts
git commit -m "feat: add background index scheduler with native notifications"
```

---

## Phase 4: Renderer

### Task 16: Create renderer entry + App shell

**Files:**
- Create: `src/renderer/main.tsx`
- Create: `src/renderer/App.tsx`
- Create: `src/renderer/api.ts` (React context for window.catalyst)
- Create: `src/renderer/styles/global.css`
- Create: `src/renderer/styles/App.module.css`

**Step 1: Install react-dom**

```bash
npm install react-dom
npm install --save-dev @types/react-dom
```

**Step 2: Write src/renderer/main.tsx**

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(<App />);
```

**Step 3: Write src/renderer/api.ts**

```tsx
import React, { createContext, useContext } from 'react';

const ApiContext = createContext<Window['catalyst']>(window.catalyst);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  return <ApiContext.Provider value={window.catalyst}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
```

**Step 4: Write src/renderer/App.tsx — layout shell**

```tsx
import React, { useReducer, useEffect } from 'react';
import { ApiProvider } from './api.js';
import { appReducer, initialState } from './state.js';
import { NavRail } from './components/NavRail.js';
import { Toolbar } from './components/Toolbar.js';
import { StatusBar } from './components/StatusBar.js';
import styles from './styles/App.module.css';

function AppContent() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Wire IPC events to dispatch
  useEffect(() => {
    const unsubs = [
      window.catalyst.on.stageUpdate((data) => dispatch({ type: 'stage-update', ...data })),
      window.catalyst.on.providerUpdate((data) => dispatch({ type: 'provider-update', ...data })),
      window.catalyst.on.enrichment((data) => dispatch({ type: 'enrichment', ...data })),
      window.catalyst.on.pipelineDone((data) => dispatch({ type: 'pipeline-done', ...data })),
      window.catalyst.on.pipelineError((data) => dispatch({ type: 'pipeline-error', ...data })),
      window.catalyst.on.newJobs((data) => dispatch({ type: 'new-jobs', ...data })),
    ];
    return () => unsubs.forEach((fn) => fn());
  }, []);

  return (
    <div className={styles.layout}>
      <Toolbar state={state} dispatch={dispatch} />
      <div className={styles.body}>
        <NavRail active={state.view} dispatch={dispatch} />
        <main className={styles.content}>
          {/* Render active view based on state.view */}
        </main>
      </div>
      <StatusBar state={state} />
    </div>
  );
}

export function App() {
  return (
    <ApiProvider>
      <AppContent />
    </ApiProvider>
  );
}
```

**Step 5: Write styles**

```css
/* src/renderer/styles/global.css */
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  background: #1a1a2e;
  color: #e0e0e0;
}

/* src/renderer/styles/App.module.css */
.layout { display: flex; flex-direction: column; height: 100vh; }
.body { display: flex; flex: 1; overflow: hidden; }
.content { flex: 1; overflow-y: auto; padding: 16px; }
```

**Step 6: Commit**

```bash
git add src/renderer/
git commit -m "feat: add renderer entry, App shell, API context, and base styles"
```

---

### Task 17: Create renderer state management

**Files:**
- Create: `src/renderer/state.ts`

**Step 1: Port and adapt the TUI reducer**

This is mostly a copy of `src/tui/state.ts` with:
- Rename `TuiState` to `AppState`, `TuiAction` to `AppAction`, `tuiReducer` to `appReducer`
- Add `'settings'` to ViewName
- Action types may change slightly to match IPC event shapes from preload
- Initial view is `'companies'` instead of `'user-selection'` (user selection is now in toolbar)

The state shape, action types, and reducer logic remain nearly identical. The reducer is purely state transformation with no side effects, so it ports directly.

**Step 2: Commit**

```bash
git add src/renderer/state.ts
git commit -m "feat: add renderer state management (ported from TUI reducer)"
```

---

### Task 18: Create shared UI components

**Files:**
- Create: `src/renderer/components/NavRail.tsx` + `NavRail.module.css`
- Create: `src/renderer/components/Toolbar.tsx` + `Toolbar.module.css`
- Create: `src/renderer/components/StatusBar.tsx` + `StatusBar.module.css`
- Create: `src/renderer/components/ScoreBar.tsx` + `ScoreBar.module.css`
- Create: `src/renderer/components/StageRow.tsx` + `StageRow.module.css`

**Step 1: NavRail** — vertical nav with labeled icons for each view (Companies, Pipeline, Results, History, Profile, Resume Manager). Maps to the keyboard shortcuts from old TUI but as clickable items. Highlights active view.

**Step 2: Toolbar** — top bar with user switcher dropdown (loads users via `useApi().users.list()`), "New Run" button, settings gear icon.

**Step 3: StatusBar** — bottom bar showing indexer status ("Last indexed: 2h ago"), current model name, Ollama connection status.

**Step 4: ScoreBar** — HTML/CSS version of the TUI ScoreBar. 10 segments as divs, filled/unfilled based on score. Color tiers: green >= 80, yellow >= 60, red < 60.

**Step 5: StageRow** — pipeline stage display with status icon, stage name, duration. Expandable to show provider sub-rows with their status.

**Step 6: Commit**

```bash
git add src/renderer/components/
git commit -m "feat: add shared UI components (NavRail, Toolbar, StatusBar, ScoreBar, StageRow)"
```

---

### Task 19: Port Companies view

**Files:**
- Create: `src/renderer/views/Companies.tsx` + `Companies.module.css`

Port from `src/tui/CompaniesView.tsx` (193 lines). Key changes:
- Replace `props.companyStore.list()` with `useApi().companies.list()`
- Replace keyboard-driven navigation with clickable table rows
- Add "Add Company" button that shows a URL input field
- Inline toggle switch for enable/disable
- "Index" and "Index All" buttons
- Click company row to run pipeline or view kanban (buttons per row)
- `useEffect` to load companies on mount, `useState` for local UI state

**Commit after implementation.**

---

### Task 20: Port Kanban view with drag-and-drop

**Files:**
- Create: `src/renderer/views/Kanban.tsx` + `Kanban.module.css`
- Create: `src/renderer/components/KanbanCard.tsx` + `KanbanCard.module.css`

Port from `src/tui/KanbanView.tsx` (293 lines). Key changes:
- 5 columns rendered as flex containers with `min-height` and `drop-target` styling
- Use HTML5 Drag and Drop API: `draggable`, `onDragStart`, `onDragOver`, `onDrop` on cards and columns
- KanbanCard shows: job title (bold), company name, score badge with color, tags if present
- Keyboard shortcuts preserved: arrow keys navigate, `m`/`M` move, `r` reject, `x` skip
- Feedback modal (dialog element or overlay div) when moving to Rejected/Not Applying: checkboxes for tags, textarea for notes, confirm/cancel buttons
- Load data via `useApi().kanban.columns(companyId, column)` for each column

**Commit after implementation.**

---

### Task 21: Port Pipeline view

**Files:**
- Create: `src/renderer/views/Pipeline.tsx` + `Pipeline.module.css`

Port from `src/tui/PipelineView.tsx` (56 lines). Key changes:
- Use StageRow components with CSS animations for running state
- Show iteration counter, resume name, model
- ProfileSummary section when profile is parsed
- Reflection rationale + confidence when available
- Completion message with link to results

**Commit after implementation.**

---

### Task 22: Port Results view

**Files:**
- Create: `src/renderer/views/Results.tsx` + `Results.module.css`

Port from `src/tui/ResultsView.tsx` (81 lines). Key changes:
- Scrollable list (no pagination needed — browser handles scroll)
- Each job row: title, company, ScoreBar, skill/culture/salary breakdown, summary, red flags
- Click row to open JobDetail
- Optional: sortable by overall score, skill, culture, salary columns

**Commit after implementation.**

---

### Task 23: Port JobDetail view

**Files:**
- Create: `src/renderer/views/JobDetail.tsx` + `JobDetail.module.css`

Port from `src/tui/JobDetailView.tsx` (111 lines). Key changes:
- Side panel or modal overlay
- Full job description (scrollable, rendered as HTML if available)
- Score breakdown with ScoreBar components
- "Open URL" button using `useApi().openUrl()`
- Red flags section
- Analysis reasoning per variant
- Back button

**Commit after implementation.**

---

### Task 24: Port remaining views (Profile, History, ResumeManager, Settings)

**Files:**
- Create: `src/renderer/views/Profile.tsx` + `Profile.module.css`
- Create: `src/renderer/views/History.tsx` + `History.module.css`
- Create: `src/renderer/views/ResumeManager.tsx` + `ResumeManager.module.css`
- Create: `src/renderer/views/Settings.tsx` + `Settings.module.css`

**Profile:** Port from `src/tui/ProfileView.tsx` (73 lines). Show parsed candidate profile: name, experience, titles, skills, preferences. Toggle raw resume text.

**History:** Port from `src/tui/HistoryView.tsx` (52 lines). Table of past runs. Click to load run detail (restores results view with that run's data).

**ResumeManager:** Port from `src/tui/ResumeManagerView.tsx` (118 lines). List of resume files. Click to select. Drag-and-drop file upload using `Electron.dialog.showOpenDialog()` via IPC. Show current resume name.

**Settings:** New view (no TUI equivalent). Form fields for:
- Ollama model name
- Ollama URL
- Index interval (hours)
- Uses `useApi().settings.get()` and `useApi().settings.set()`

**Commit after each view or as a batch.**

---

## Phase 5: Cleanup

### Task 25: Remove TUI code and old entry point

**Files:**
- Delete: `src/tui/` (entire directory)
- Delete: `src/index.ts` (old CLI entry point)

**Step 1: Delete TUI directory**

```bash
rm -rf src/tui/
```

**Step 2: Delete old entry point**

```bash
rm src/index.ts
```

**Step 3: Update package.json**

Remove `"module": "src/index.ts"` field.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove TUI code and old CLI entry point"
```

---

### Task 26: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

Update to reflect the new Electron architecture: project structure, how to run (`npm start`), build commands, new directory layout. Remove references to Ink, TUI, CLI subcommands.

**Commit after update.**

---

### Task 27: End-to-end smoke test

**Step 1: Start the app**

```bash
npm start
```

**Step 2: Verify**

- Window opens with layout (nav rail, toolbar, status bar)
- User selection works (create/switch)
- Companies view loads
- Can add a company URL
- Can trigger manual index
- Pipeline runs and shows progress
- Results display with scores
- Kanban board works with drag-and-drop
- Background indexer fires on schedule
- Native notification appears when new jobs found

**Step 3: Fix any issues found**

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup after Electron migration"
```
