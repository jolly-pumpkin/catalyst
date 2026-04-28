# User-Driven Index Filters Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let users configure per-company filters (title keywords, locations, departments, posted date range) that apply at both index time and pipeline fetch time, replacing the automatic profile-based keyword filtering.

**Architecture:** Add a `filters` JSON column to `company_sources` and a `department` column to `indexed_jobs`. ATS fetchers extract department data. The job-indexer applies filters before upserting. The index-fetcher reads company filters instead of deriving them from the candidate profile. A filter editor panel in the Companies view lets users configure and save filters per company.

**Tech Stack:** SQLite (better-sqlite3), TypeScript, React, Electron IPC

---

### Task 1: Add CompanyFilters type and extend data types

**Files:**
- Modify: `src/types.ts`

**Step 1: Add the CompanyFilters interface and extend existing types**

Add after the `CompanySource` interface (around line 93):

```ts
export interface CompanyFilters {
  titleKeywords?: string[];
  locations?: string[];
  departments?: string[];
  postedWithinDays?: number;
}
```

Add `filters?: CompanyFilters` to `CompanySource` (after `enabled: boolean`).

Add `department?: string` to `RawJob` (after `postedAt: string`).

Add `department?: string` to `IndexedJob` -- it extends `RawJob` so it inherits automatically.

**Step 2: Commit**

```
git add src/types.ts
git commit -m "feat: add CompanyFilters type, department field to RawJob"
```

---

### Task 2: Migrate SQLite schema

**Files:**
- Modify: `src/plugins/catalog-db.ts`

**Step 1: Add ALTER TABLE migrations after the CREATE TABLE statements**

After the existing `CREATE INDEX` statements (after line 62 in `catalog-db.ts`), add:

```ts
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
```

**Step 2: Commit**

```
git add src/plugins/catalog-db.ts
git commit -m "feat: add filters and department columns to catalog schema"
```

---

### Task 3: Extract department from ATS fetchers

**Files:**
- Modify: `src/plugins/job-indexer.ts`

**Step 1: Update each ATS fetcher to include department in the returned RawJob**

In `fetchGreenhouseJobs` (line 19 map), add:
```ts
department: j.departments?.[0]?.name,
```

In `fetchLeverJobs` (line 36 map), add:
```ts
department: j.categories?.department ?? j.categories?.team,
```

In `fetchAshbyJobs` (line 53 map), add:
```ts
department: j.department,
```

In `fetchWorkableJobs` (line 70 map), add:
```ts
department: j.department,
```

**Step 2: Commit**

```
git add src/plugins/job-indexer.ts
git commit -m "feat: extract department field from ATS API responses"
```

---

### Task 4: Update job-index-store to persist department and accept CompanyFilters

**Files:**
- Modify: `src/plugins/job-index-store.ts`

**Step 1: Add department to the upsert statement**

Update the `upsertStmt` SQL (line 23) to include `department` in the INSERT column list and VALUES, and in the ON CONFLICT UPDATE:

```ts
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
```

Update the `upsertStmt.run` call (line 44) to pass `job.department ?? null` as the last parameter.

**Step 2: Replace the query method's filter interface with CompanyFilters**

Replace the `query` method (lines 72-105) with:

```ts
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
      "LOWER(title) LIKE ? ESCAPE '\\'"
    );
    sql += ` AND (${conditions.join(' OR ')})`;
    for (const kw of filter.titleKeywords) {
      params.push(`%${escapeLike(kw.toLowerCase())}%`);
    }
  }

  if (filter?.locations?.length) {
    const conditions = filter.locations.map(() =>
      "LOWER(location) LIKE ? ESCAPE '\\'"
    );
    sql += ` AND (${conditions.join(' OR ')})`;
    for (const loc of filter.locations) {
      params.push(`%${escapeLike(loc.toLowerCase())}%`);
    }
  }

  if (filter?.departments?.length) {
    const conditions = filter.departments.map(() =>
      "LOWER(department) LIKE ? ESCAPE '\\'"
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
```

**Step 3: Update `rowToIndexedJob` to include department**

Add to the return object:
```ts
department: row.department ?? undefined,
```

**Step 4: Commit**

```
git add src/plugins/job-index-store.ts
git commit -m "feat: persist department, accept CompanyFilters in query"
```

---

### Task 5: Apply filters at index time in job-indexer

**Files:**
- Modify: `src/plugins/job-indexer.ts`

**Step 1: Import CompanyFilters type**

Update the import at line 2:
```ts
import type { ATSType, CompanyFilters, CompanySource, RawJob } from '../types.js';
```

**Step 2: Add a filter function**

Add after the `ATS_FETCHERS` constant (after line 87):

```ts
function applyFilters(jobs: RawJob[], filters: CompanyFilters): RawJob[] {
  return jobs.filter((job) => {
    if (filters.titleKeywords?.length) {
      const titleLower = job.title.toLowerCase();
      if (!filters.titleKeywords.some((kw) => titleLower.includes(kw.toLowerCase()))) {
        return false;
      }
    }
    if (filters.locations?.length) {
      const locLower = job.location.toLowerCase();
      if (!filters.locations.some((loc) => locLower.includes(loc.toLowerCase()))) {
        return false;
      }
    }
    if (filters.departments?.length && job.department) {
      const deptLower = job.department.toLowerCase();
      if (!filters.departments.some((d) => deptLower.includes(d.toLowerCase()))) {
        return false;
      }
    }
    if (filters.postedWithinDays) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - filters.postedWithinDays);
      if (new Date(job.postedAt) < cutoff) {
        return false;
      }
    }
    return true;
  });
}
```

**Step 3: Update `indexCompany` to apply filters**

In the `indexCompany` function (line 135), after `const jobs = await fetcher(...)`, add filtering:

```ts
async function indexCompany(company: CompanySource): Promise<number> {
  const fetcher = ATS_FETCHERS[company.atsType];
  if (!fetcher) throw new Error(`Unknown ATS type: ${company.atsType}`);

  let jobs = await fetcher(company.slug, company.name);

  // Apply user-configured filters
  const filters = company.filters;
  if (filters && Object.keys(filters).length > 0) {
    jobs = applyFilters(jobs, filters);
  }

  await jobIndex.upsertJobs(company.id, jobs, company.atsType);
  await jobIndex.markInactive(company.id, jobs.map((j) => j.id));
  await companyStore.updateIndexed(company.id, jobs.length);

  ctx.emit('indexer:company-done', {
    companyId: company.id,
    companyName: company.name,
    jobCount: jobs.length,
  });

  return jobs.length;
}
```

**Step 4: Commit**

```
git add src/plugins/job-indexer.ts
git commit -m "feat: apply company filters at index time"
```

---

### Task 6: Update company-store to read/write filters

**Files:**
- Modify: `src/plugins/company-store.ts`

**Step 1: Import CompanyFilters**

Update the import:
```ts
import type { ATSType, CompanyFilters, CompanySource } from '../types.js';
```

**Step 2: Add `setFilters` method to the provided capability**

Add after the `updateIndexed` method:

```ts
async setFilters(id: string, filters: CompanyFilters): Promise<void> {
  db.prepare(
    'UPDATE company_sources SET filters = ? WHERE id = ?',
  ).run(JSON.stringify(filters), id);
},
```

**Step 3: Update `rowToCompanySource` to parse the filters JSON**

```ts
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
```

**Step 4: Commit**

```
git add src/plugins/company-store.ts
git commit -m "feat: company-store reads/writes filters JSON"
```

---

### Task 7: Update index-fetcher to use company filters instead of profile keywords

**Files:**
- Modify: `src/plugins/index-fetcher.ts`

**Step 1: Rewrite the index-fetcher to use company filters**

```ts
import type { Plugin } from 'rhodium-core';
import type { CandidateProfile, CompanyFilters, IndexedJob, ReflectOutput } from '../types.js';
import { getPipelineCompanyId } from '../context.js';

export function indexFetcherPlugin(): Plugin {
  return {
    key: 'index-fetcher',
    version: '1.0.0',
    manifest: {
      name: 'Index Fetcher',
      description: 'Provides jobs from the local index for pipeline consumption',
      provides: [{ capability: 'jobs.fetch', priority: 90 }],
      needs: [{ capability: 'job.index' }, { capability: 'company.store' }],
      tags: ['job-source', 'local-index'],
    },
    activate(ctx) {
      const jobIndex = ctx.resolve<{
        query(filter?: {
          titleKeywords?: string[];
          locations?: string[];
          departments?: string[];
          postedWithinDays?: number;
          companyIds?: string[];
        }): Promise<IndexedJob[]>;
      }>('job.index');

      const companyStore = ctx.resolve<{
        get(id: string): Promise<{ filters?: CompanyFilters } | null>;
      }>('company.store');

      ctx.provide('jobs.fetch', async (input: {
        'parse-profile': CandidateProfile;
        refinements?: ReflectOutput['searchRefinements'];
      }): Promise<IndexedJob[]> => {
        const companySourceId = getPipelineCompanyId();
        const companyIds = companySourceId ? [companySourceId] : undefined;

        // Use company filters if running for a specific company
        let filters: CompanyFilters = {};
        if (companySourceId) {
          const company = await companyStore.get(companySourceId);
          if (company?.filters) {
            filters = company.filters;
          }
        }

        // Fall back to profile-based filtering if no company filters set
        if (!companySourceId || Object.keys(filters).length === 0) {
          const profile = input['parse-profile'];
          const refinements = input.refinements;
          filters = {
            titleKeywords: [
              ...profile.titles,
              ...(refinements?.additionalKeywords ?? []),
            ],
          };
        }

        return jobIndex.query({ ...filters, companyIds });
      });
    },
  };
}
```

**Step 2: Commit**

```
git add src/plugins/index-fetcher.ts
git commit -m "feat: index-fetcher uses company filters instead of profile keywords"
```

---

### Task 8: Write tests for filter logic

**Files:**
- Modify: `src/plugins/fetchers.test.ts`

**Step 1: Add imports and mock ATS detector**

Add to existing imports:
```ts
import type { Plugin } from 'rhodium-core';
import { companyStorePlugin } from './company-store.js';
```

Add a mock ATS detector plugin before the tests:
```ts
function mockAtsDetectorPlugin(): Plugin {
  return {
    key: 'mock-ats-detector',
    version: '1.0.0',
    manifest: {
      name: 'Mock ATS Detector',
      provides: [{ capability: 'ats.detect' }],
      needs: [],
    },
    activate(ctx) {
      ctx.provide('ats.detect', { detect: async () => null });
    },
  };
}
```

**Step 2: Update the existing index-fetcher test**

Register `mockAtsDetectorPlugin()` and `companyStorePlugin()` in the existing test's broker setup (the test at line 19), so the index-fetcher can resolve `company.store`.

**Step 3: Add new tests for company-filter-based fetching**

```ts
it('returns all jobs when company has no filters', async () => {
  const { broker } = createTestBroker();
  broker.register(catalogDbPlugin({ dbPath: ':memory:' }));
  broker.register(jobIndexStorePlugin());
  broker.register(mockAtsDetectorPlugin());
  broker.register(companyStorePlugin());
  broker.register(indexFetcherPlugin());
  await broker.activate();

  const db = broker.resolve<import('better-sqlite3').Database>('catalog.db');
  db.prepare(
    `INSERT INTO company_sources (id, name, url, ats_type, slug, added_at, job_count, enabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run('co-1', 'TestCo', 'https://example.com', 'greenhouse', 'test',
     new Date().toISOString(), 0, 1);

  const jobIndex = broker.resolve<{
    upsertJobs(companySourceId: string, jobs: RawJob[], atsType: string): Promise<number>;
  }>('job.index');

  await jobIndex.upsertJobs('co-1', [
    {
      id: 'j1', source: 'greenhouse:test', title: 'Engineer',
      company: 'TestCo', location: 'Remote', description: 'Build stuff',
      url: 'https://example.com/1', postedAt: new Date().toISOString(),
    },
    {
      id: 'j2', source: 'greenhouse:test', title: 'Designer',
      company: 'TestCo', location: 'NYC', description: 'Design stuff',
      url: 'https://example.com/2', postedAt: new Date().toISOString(),
    },
  ], 'greenhouse');

  const { setPipelineCompanyId } = await import('../context.js');
  setPipelineCompanyId('co-1');

  const fetch = broker.resolve<(input: any) => Promise<RawJob[]>>('jobs.fetch');
  const jobs = await fetch({ 'parse-profile': mockProfile });

  // No company filters -- falls back to profile titles
  expect(jobs.length).toBeGreaterThanOrEqual(1);

  setPipelineCompanyId(undefined);
});

it('filters jobs by company titleKeywords filter', async () => {
  const { broker } = createTestBroker();
  broker.register(catalogDbPlugin({ dbPath: ':memory:' }));
  broker.register(jobIndexStorePlugin());
  broker.register(mockAtsDetectorPlugin());
  broker.register(companyStorePlugin());
  broker.register(indexFetcherPlugin());
  await broker.activate();

  const db = broker.resolve<import('better-sqlite3').Database>('catalog.db');
  db.prepare(
    `INSERT INTO company_sources (id, name, url, ats_type, slug, added_at, job_count, enabled, filters)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run('co-2', 'TestCo', 'https://example.com', 'greenhouse', 'test',
     new Date().toISOString(), 0, 1, JSON.stringify({ titleKeywords: ['Engineer'] }));

  const jobIndex = broker.resolve<{
    upsertJobs(companySourceId: string, jobs: RawJob[], atsType: string): Promise<number>;
  }>('job.index');

  await jobIndex.upsertJobs('co-2', [
    {
      id: 'j1', source: 'greenhouse:test', title: 'Software Engineer',
      company: 'TestCo', location: 'Remote', description: 'Build stuff',
      url: 'https://example.com/1', postedAt: new Date().toISOString(),
    },
    {
      id: 'j2', source: 'greenhouse:test', title: 'Marketing Manager',
      company: 'TestCo', location: 'NYC', description: 'Market stuff',
      url: 'https://example.com/2', postedAt: new Date().toISOString(),
    },
  ], 'greenhouse');

  const { setPipelineCompanyId } = await import('../context.js');
  setPipelineCompanyId('co-2');

  const fetch = broker.resolve<(input: any) => Promise<RawJob[]>>('jobs.fetch');
  const jobs = await fetch({ 'parse-profile': mockProfile });

  expect(jobs.length).toBe(1);
  expect(jobs[0].title).toBe('Software Engineer');

  setPipelineCompanyId(undefined);
});
```

**Step 4: Run the tests**

Run: `bun test src/plugins/fetchers.test.ts`
Expected: PASS

**Step 5: Commit**

```
git add src/plugins/fetchers.test.ts
git commit -m "test: add filter-based index-fetcher tests"
```

---

### Task 9: Add IPC channel and handler for setFilters

**Files:**
- Modify: `src/shared/ipc-channels.ts`
- Modify: `electron/ipc/companies.ts`

**Step 1: Add the IPC channel constant**

In `src/shared/ipc-channels.ts`, add after `COMPANIES_TOGGLE` (line 12):
```ts
COMPANIES_SET_FILTERS: 'companies:set-filters',
```

**Step 2: Add the IPC handler**

In `electron/ipc/companies.ts`, add after the `COMPANIES_TOGGLE` handler:

```ts
ipcMain.handle(IPC.COMPANIES_SET_FILTERS, async (_event, id: string, filters: unknown) => {
  const broker = getBroker();
  if (!broker) throw new Error('No user selected');
  const store = broker.resolve<{
    setFilters(id: string, filters: unknown): Promise<void>;
  }>('company.store');
  return store.setFilters(id, filters as any);
});
```

**Step 3: Commit**

```
git add src/shared/ipc-channels.ts electron/ipc/companies.ts
git commit -m "feat: add IPC channel for company filter updates"
```

---

### Task 10: Expose setFilters in preload bridge

**Files:**
- Modify: `electron/preload.ts`

**Step 1: Add setFilters to the companies API**

In the `companies` object (after `toggle` on line 24), add:

```ts
setFilters: (id: string, filters: unknown) =>
  ipcRenderer.invoke(IPC.COMPANIES_SET_FILTERS, id, filters),
```

**Step 2: Commit**

```
git add electron/preload.ts
git commit -m "feat: expose setFilters in preload bridge"
```

---

### Task 11: Add filter editor UI to Companies view

**Files:**
- Modify: `src/renderer/views/Companies.tsx`
- Modify: `src/renderer/views/Companies.module.css`

**Step 1: Add CompanyFilters import**

```ts
import type { CompanyFilters, CompanySource } from '../../types.js';
```

**Step 2: Add filter editor state**

```ts
const [editingFilters, setEditingFilters] = useState<string | null>(null);
const [filterDraft, setFilterDraft] = useState<CompanyFilters>({});
```

**Step 3: Add handler functions**

```ts
function openFilterEditor(company: CompanySource) {
  setEditingFilters(company.id);
  setFilterDraft(company.filters ?? {});
}

async function saveFilters(companyId: string) {
  try {
    await api.companies.setFilters(companyId, filterDraft);
    setStatus('Filters saved');
    setEditingFilters(null);
    await refresh();
  } catch (err) {
    setStatus(`Error saving filters: ${err}`);
  }
}

function updateFilterDraft(key: keyof CompanyFilters, value: string) {
  setFilterDraft((prev) => {
    if (key === 'postedWithinDays') {
      const num = parseInt(value, 10);
      return { ...prev, [key]: isNaN(num) ? undefined : num };
    }
    const arr = value.split(',').map((s) => s.trim()).filter(Boolean);
    return { ...prev, [key]: arr.length > 0 ? arr : undefined };
  });
}
```

**Step 4: Add "Filters" button in row actions**

After the "Index" button in the rowActions div:
```tsx
<button className={styles.rowBtn} onClick={() => openFilterEditor(c)}>Filters</button>
```

**Step 5: Add filter editor panel**

After each `<tr>` row for a company, conditionally render a filter editor row:
```tsx
{editingFilters === c.id && (
  <tr key={`${c.id}-filters`}>
    <td colSpan={6}>
      <div className={styles.filterPanel}>
        <div className={styles.filterRow}>
          <label className={styles.filterLabel}>Title keywords</label>
          <input
            className={styles.filterInput}
            value={(filterDraft.titleKeywords ?? []).join(', ')}
            onChange={(e) => updateFilterDraft('titleKeywords', e.target.value)}
            placeholder="Engineer, Developer, SRE"
          />
        </div>
        <div className={styles.filterRow}>
          <label className={styles.filterLabel}>Locations</label>
          <input
            className={styles.filterInput}
            value={(filterDraft.locations ?? []).join(', ')}
            onChange={(e) => updateFilterDraft('locations', e.target.value)}
            placeholder="Remote, San Francisco, NYC"
          />
        </div>
        <div className={styles.filterRow}>
          <label className={styles.filterLabel}>Departments</label>
          <input
            className={styles.filterInput}
            value={(filterDraft.departments ?? []).join(', ')}
            onChange={(e) => updateFilterDraft('departments', e.target.value)}
            placeholder="Engineering, Product, Design"
          />
        </div>
        <div className={styles.filterRow}>
          <label className={styles.filterLabel}>Posted within (days)</label>
          <input
            className={styles.filterInput}
            type="number"
            value={filterDraft.postedWithinDays ?? ''}
            onChange={(e) => updateFilterDraft('postedWithinDays', e.target.value)}
            placeholder="30"
          />
        </div>
        <div className={styles.filterActions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => saveFilters(c.id)}>
            Save Filters
          </button>
          <button className={styles.btn} onClick={() => setEditingFilters(null)}>Cancel</button>
        </div>
      </div>
    </td>
  </tr>
)}
```

**Step 6: Add filter panel styles to Companies.module.css**

Append to the file:

```css
.filterPanel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 4px;
  margin: 0.25rem 0;
}

.filterRow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filterLabel {
  min-width: 140px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.filterInput {
  flex: 1;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-size: 0.85rem;
}

.filterInput:focus {
  outline: none;
  border-color: var(--accent);
}

.filterActions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
```

**Step 7: Commit**

```
git add src/renderer/views/Companies.tsx src/renderer/views/Companies.module.css
git commit -m "feat: add per-company filter editor UI"
```

---

### Task 12: Final verification

**Step 1: Run full test suite**

Run: `bun test`
Expected: All tests pass

**Step 2: Run the app in dev mode**

Run: `npm start`

Verify:
1. Companies view loads
2. Each company row has a "Filters" button
3. Clicking "Filters" shows the inline filter editor
4. Entering filters and clicking "Save Filters" persists them
5. Running Index for a company with filters only stores matching jobs
6. Running the pipeline for a company with filters uses those filters
