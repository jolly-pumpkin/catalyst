# Information-Dense Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Dashboard the information-dense hub — richer cards, stats bar, filters, persistent detail panel, post-run AI summary, and activity log tab.

**Architecture:** All 6 features are mostly renderer-side. The detail panel lift touches App.tsx and state. The stats bar and activity tab need new IPC queries from kanban-store/results-store. The post-run summary adds a pipeline summary stage and new DB column. Everything else is client-side filtering and new UI components.

**Tech Stack:** React 18 + TypeScript, CSS Modules, Vitest, Rhodium broker, better-sqlite3, Ollama LLM

---

### Task 1: Lift Detail Panel to Shell (Foundation)

Move DetailPanel rendering from Dashboard.tsx into App.tsx Shell so any view can open it. This is foundational — Tasks 2-6 assume the panel is app-wide.

**Files:**
- Modify: `src/renderer/state.ts` (lines 78, 82-112, 131-281)
- Modify: `src/renderer/App.tsx` (lines 30-158)
- Modify: `src/renderer/views/Dashboard.tsx` (lines 1-272)
- Modify: `src/renderer/views/Results.tsx` (lines 1-71)
- Modify: `src/renderer/views/History.tsx` (lines 1-71)
- Modify: `src/renderer/views/Kanban.tsx` (lines 1-291)
- Modify: `src/renderer/styles/App.module.css`

**Step 1: Update AppState and reducer to store full detail data**

In `src/renderer/state.ts`:

Replace `detailPanelJobId: string | null` (line 78) with:

```typescript
detailPanel: { ranked: RankedJob; analyses: JobAnalysis[] } | null;
```

Replace actions `dashboard:open-detail` and `dashboard:close-detail` with:

```typescript
| { type: 'detail:open'; ranked: RankedJob; analyses: JobAnalysis[] }
| { type: 'detail:close' }
```

Update `initialState` — replace `detailPanelJobId: null` with `detailPanel: null`.

In the reducer, replace the two `dashboard:open-detail` / `dashboard:close-detail` cases with:

```typescript
case 'detail:open':
  return { ...state, detailPanel: { ranked: action.ranked, analyses: action.analyses } };
case 'detail:close':
  return { ...state, detailPanel: null };
```

Also add `detailPanel: null` to the `view:change` case so navigating away closes the panel:

```typescript
case 'view:change':
  return { ...state, view: action.view, detailPanel: null };
```

**Step 2: Move DetailPanel rendering from Dashboard to Shell**

In `src/renderer/App.tsx`, inside Shell's render (around line 120), after the `<main>` content area and before `<StatusBar>`, add the detail panel:

```tsx
import { DetailPanel } from './components/DetailPanel.js';
```

Wrap the content area and panel in a flex container. Replace the current `.content` div structure:

```tsx
<div className={appStyles.contentArea}>
  <main className={appStyles.content}>
    {/* existing view switch */}
  </main>
  {state.detailPanel && (
    <DetailPanel
      ranked={state.detailPanel.ranked}
      analyses={state.detailPanel.analyses}
      onClose={() => dispatch({ type: 'detail:close' })}
      onAction={(jobId, column) => {
        // Delegate to the active view's action handler via a shared handler
      }}
    />
  )}
</div>
```

In `src/renderer/styles/App.module.css`, add:

```css
.contentArea {
  display: flex;
  flex: 1;
  overflow: hidden;
}
```

And update `.content` to be `flex: 1; overflow-y: auto;` (it likely already is).

**Step 3: Update Dashboard to use new detail actions**

In `src/renderer/views/Dashboard.tsx`:

- Remove the `DetailPanel` import and rendering (lines 226-233)
- Remove `detailJobId` / `detailEntry` derived state (lines 43, 68)
- Remove `handleOpenDetail` and `handleCloseDetail` (lines 103-109)
- Remove the `.mainWithPanel` class usage — always use `.main`
- Update `JobCard` `onOpenDetail` callbacks to dispatch the new action:

```tsx
onOpenDetail={(jobId) => {
  const entry = entries.find((e) => e.ranked.job.id === jobId);
  if (entry) dispatch({ type: 'detail:open', ranked: entry.ranked, analyses: entry.analyses });
}}
```

Do the same for `NearMissGroup`'s `onOpenDetail`.

**Step 4: Update Results view to open detail panel**

In `src/renderer/views/Results.tsx`:

Instead of navigating to `job-detail` view on card click, dispatch `detail:open`. This requires the Results view to have access to analyses data.

Update `handleClick` to dispatch detail:open instead of navigating:

```tsx
const handleClick = (index: number) => {
  const ranked = state.results[index];
  const analyses = (state.analyses ?? []).filter((a) => a.jobId === ranked.job.id);
  dispatch({ type: 'detail:open', ranked, analyses });
};
```

Remove the `results:navigate` dispatch and `view:change` to 'job-detail'.

**Step 5: Update History view to support detail panel**

In `src/renderer/views/History.tsx`:

When loading a run's results, also load analyses from `getRunDetail`. Update `handleSelect`:

```tsx
const handleSelect = async (runId: string) => {
  const detail = await api.results.getRun(runId);
  if (!detail) return;
  dispatch({ type: 'pipeline:done', results: detail.jobs });
  if (detail.analyses) dispatch({ type: 'pipeline:enrich', analyses: detail.analyses });
  dispatch({ type: 'view:change', view: 'results' });
};
```

This ensures `state.analyses` is populated when viewing historical runs, so the detail panel works from Results.

**Step 6: Update Kanban view to open detail panel**

In `src/renderer/views/Kanban.tsx`:

The kanban cards currently don't have full RankedJob data — they only store `{ jobId, title, company, score }`. To open the detail panel, we'd need the full data. For now, skip this — Kanban detail panel support can be added later when we add a `getJobDetail` IPC endpoint. Add a TODO comment.

**Step 7: Update DetailPanel component — pin actions at top**

In `src/renderer/components/DetailPanel.tsx`:

Move the actions button row (lines 104-109) above the scroll container so they're always visible:

```tsx
<div className={styles.panel}>
  <div className={styles.header}>
    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
  </div>
  <div className={styles.actions}>
    {/* action buttons here, above scroll */}
  </div>
  <div className={styles.scroll}>
    {/* rest of content */}
  </div>
</div>
```

In `DetailPanel.module.css`, update `.actions` to not scroll with content:

```css
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid var(--border);
}
```

Also change `.panel` from `position: fixed` to just being a flex child:

```css
.panel {
  width: 40%;
  min-width: 320px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  border-left: 1px solid var(--border);
  height: 100%;
}
```

**Step 8: Run tests and verify**

Run: `bun test`
Expected: All existing tests pass (no plugin tests touch the renderer).

**Step 9: Commit**

```
git add src/renderer/state.ts src/renderer/App.tsx src/renderer/views/Dashboard.tsx \
  src/renderer/views/Results.tsx src/renderer/views/History.tsx src/renderer/views/Kanban.tsx \
  src/renderer/components/DetailPanel.tsx src/renderer/components/DetailPanel.module.css \
  src/renderer/styles/App.module.css
git commit -m "refactor: lift DetailPanel to Shell for app-wide access"
```

---

### Task 2: Richer Job Cards

Add inline score pills, skill tags, salary estimate, and kanban status to collapsed job cards.

**Files:**
- Modify: `src/renderer/components/JobCard.tsx` (lines 1-85)
- Modify: `src/renderer/components/JobCard.module.css` (lines 1-167)
- Modify: `src/renderer/views/Dashboard.tsx` — pass kanban data to cards
- Create: `src/renderer/components/ScorePill.tsx`
- Create: `src/renderer/components/ScorePill.module.css`

**Step 1: Create ScorePill component**

Create `src/renderer/components/ScorePill.tsx`:

```tsx
import React from 'react';
import styles from './ScorePill.module.css';

interface ScorePillProps {
  label: string;
  score: number;
}

export function ScorePill({ label, score }: ScorePillProps) {
  const level = score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low';
  return (
    <span className={`${styles.pill} ${styles[level]}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.score}>{score}</span>
    </span>
  );
}
```

Create `src/renderer/components/ScorePill.module.css`:

```css
.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.label {
  color: var(--text-secondary);
  text-transform: uppercase;
  font-size: 0.6rem;
}

.score {
  font-weight: 600;
}

.high { color: var(--success); border-color: var(--success); }
.mid { color: var(--warning); border-color: var(--warning); }
.low { color: var(--danger); border-color: var(--danger); }
```

**Step 2: Update JobCard props to accept kanban status and salary**

In `src/renderer/components/JobCard.tsx`, update the props interface:

```typescript
interface JobCardProps {
  ranked: RankedJob;
  analyses?: JobAnalysis[];
  kanbanColumn?: JobKanbanColumn;
  onAction?: (jobId: string, column: JobKanbanColumn) => void;
  onOpenDetail?: (jobId: string) => void;
}
```

**Step 3: Add inline info to collapsed card**

In `JobCard.tsx`, add to the collapsed section (between the existing header and summary):

```tsx
import { ScorePill } from './ScorePill.js';

// After the score row, before summary:
<div className={styles.infoRow}>
  <ScorePill label="Skill" score={ranked.scores.skill} />
  <ScorePill label="Culture" score={ranked.scores.culture} />
  <ScorePill label="Salary" score={ranked.scores.salary} />
</div>

{/* Skill tags */}
{skillAnalysis && (
  <div className={styles.skillTags}>
    {(skillAnalysis.matchedSkills ?? []).slice(0, 3).map((s) => (
      <span key={s} className={styles.matchTag}>{s}</span>
    ))}
    {(skillAnalysis.missingSkills ?? []).slice(0, 2).map((s) => (
      <span key={s} className={styles.gapTag}>{s}</span>
    ))}
  </div>
)}

{/* Bottom meta row: location + remote + kanban status + source */}
<div className={styles.metaRow}>
  {job.location && <span className={styles.location}>{job.location}</span>}
  {job.remote && <span className={styles.remoteBadge}>Remote</span>}
  {kanbanColumn && kanbanColumn !== 'new' && (
    <span className={styles.kanbanBadge}>{kanbanColumn.replace('-', ' ')}</span>
  )}
  <span className={styles.sourceBadge}>{job.source}</span>
</div>
```

**Step 4: Add CSS for new card elements**

In `JobCard.module.css`, add:

```css
.infoRow {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.3rem;
}

.skillTags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.3rem;
}

.matchTag {
  font-size: 0.7rem;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  background: rgba(74, 222, 128, 0.1);
  color: var(--success);
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.gapTag {
  font-size: 0.7rem;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.location {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.remoteBadge {
  font-size: 0.65rem;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  background: rgba(78, 168, 222, 0.15);
  color: var(--accent);
}

.kanbanBadge {
  font-size: 0.65rem;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  text-transform: capitalize;
}
```

**Step 5: Pass kanban column data from Dashboard**

In `src/renderer/views/Dashboard.tsx`, we need to know each job's kanban column. The `DashboardEntry` type doesn't include this. We have two options:

Option A: Fetch kanban status per-job on Dashboard load. This would require a new bulk query.
Option B: Add `kanbanColumn` to the `DashboardEntry` type returned by `results.getAllJobs()`.

Go with Option B — modify the `getAllJobs` IPC handler to join kanban data.

In `electron/ipc/results.ts`, update the `getAllJobs` handler to also fetch kanban column for each job:

```typescript
// After fetching entries, resolve kanban store and enrich
const kanban = broker.resolve<KanbanStoreCapability>('kanban.store');
const enriched = entries.map((entry) => ({
  ...entry,
  kanbanColumn: kanban.getJobColumn(entry.ranked.job.id) ?? 'new',
}));
return enriched;
```

Update the `DashboardEntry` type in `Dashboard.tsx` to include `kanbanColumn`:

```typescript
interface DashboardEntry {
  ranked: RankedJob;
  analyses: JobAnalysis[];
  kanbanColumn?: JobKanbanColumn;
}
```

Pass it to JobCard:

```tsx
<JobCard ranked={entry.ranked} analyses={entry.analyses} kanbanColumn={entry.kanbanColumn} ... />
```

**Step 6: Run tests and verify**

Run: `bun test`
Expected: All existing tests pass.

**Step 7: Commit**

```
git add src/renderer/components/JobCard.tsx src/renderer/components/JobCard.module.css \
  src/renderer/components/ScorePill.tsx src/renderer/components/ScorePill.module.css \
  src/renderer/views/Dashboard.tsx electron/ipc/results.ts
git commit -m "feat: richer job cards with inline scores, skills, and kanban status"
```

---

### Task 3: Pipeline Health Stats Bar

New component showing jobs-by-stage, score distribution, weekly activity, and top rejection reason.

**Files:**
- Create: `src/renderer/components/PipelineHealthBar.tsx`
- Create: `src/renderer/components/PipelineHealthBar.module.css`
- Modify: `src/renderer/views/Dashboard.tsx`
- Modify: `src/plugins/kanban-store.ts` — add `getStageCounts` method
- Modify: `src/capabilities.ts` — update KanbanStoreCapability type
- Modify: `electron/ipc/kanban.ts` — add IPC handler
- Modify: `electron/preload.ts` — expose new method
- Modify: `src/shared/ipc-channels.ts` — add channel constant

**Step 1: Add getStageCounts to kanban-store**

In `src/plugins/kanban-store.ts`, add a new method to the capability object:

```typescript
getStageCounts(companySourceId?: string): Record<JobKanbanColumn, number> {
  const where = companySourceId
    ? 'WHERE company_source_id = ?'
    : '';
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
```

Update the capability type in `src/capabilities.ts` to include these methods.

**Step 2: Add IPC channel and handler**

In `src/shared/ipc-channels.ts`, add:

```typescript
KANBAN_STAGE_COUNTS: 'kanban:stage-counts',
KANBAN_RECENT_ACTIVITY: 'kanban:recent-activity',
```

In `electron/ipc/kanban.ts`, add handlers:

```typescript
ipcMain.handle(IPC.KANBAN_STAGE_COUNTS, async (_e, companyIds?: string[]) => {
  const kanban = getBroker().resolve<KanbanStoreCapability>('kanban.store');
  return kanban.getStageCounts(companyIds?.[0]);
});

ipcMain.handle(IPC.KANBAN_RECENT_ACTIVITY, async () => {
  const kanban = getBroker().resolve<KanbanStoreCapability>('kanban.store');
  return kanban.getRecentActivityCount(7);
});
```

In `electron/preload.ts`, add to the `dashboard` namespace:

```typescript
dashboard: {
  feedbackSummary: (companyIds?: string[]) => ipcRenderer.invoke(IPC.KANBAN_FEEDBACK_SUMMARY, companyIds),
  stageCounts: (companyIds?: string[]) => ipcRenderer.invoke(IPC.KANBAN_STAGE_COUNTS, companyIds),
  recentActivity: () => ipcRenderer.invoke(IPC.KANBAN_RECENT_ACTIVITY),
},
```

**Step 3: Create PipelineHealthBar component**

Create `src/renderer/components/PipelineHealthBar.tsx`:

```tsx
import React from 'react';
import type { RankedJob, JobKanbanColumn } from '../../types.js';
import styles from './PipelineHealthBar.module.css';

interface PipelineHealthBarProps {
  stageCounts: Record<JobKanbanColumn, number>;
  recentActivity: { reviewed: number; applied: number; rejected: number };
  topRejectionTag: { tag: string; count: number } | null;
  jobs: RankedJob[];
}

export function PipelineHealthBar({ stageCounts, recentActivity, topRejectionTag, jobs }: PipelineHealthBarProps) {
  const total = Object.values(stageCounts).reduce((s, n) => s + n, 0);

  // Score distribution buckets
  const buckets = [0, 0, 0, 0, 0]; // 0-20, 20-40, 40-60, 60-80, 80-100
  for (const j of jobs) {
    const idx = Math.min(Math.floor(j.overallScore / 20), 4);
    buckets[idx]++;
  }
  const maxBucket = Math.max(...buckets, 1);

  return (
    <div className={styles.bar}>
      {/* Jobs by stage */}
      <div className={styles.stat}>
        <div className={styles.label}>Pipeline</div>
        <div className={styles.stageBar}>
          {total > 0 && (
            <>
              {stageCounts.new > 0 && (
                <div className={`${styles.segment} ${styles.segNew}`}
                     style={{ flex: stageCounts.new }}
                     title={`New: ${stageCounts.new}`} />
              )}
              {stageCounts['looking-at'] > 0 && (
                <div className={`${styles.segment} ${styles.segLooking}`}
                     style={{ flex: stageCounts['looking-at'] }}
                     title={`Looking At: ${stageCounts['looking-at']}`} />
              )}
              {stageCounts.applying > 0 && (
                <div className={`${styles.segment} ${styles.segApplying}`}
                     style={{ flex: stageCounts.applying }}
                     title={`Applying: ${stageCounts.applying}`} />
              )}
              {(stageCounts.rejected + stageCounts['not-applying']) > 0 && (
                <div className={`${styles.segment} ${styles.segRejected}`}
                     style={{ flex: stageCounts.rejected + stageCounts['not-applying'] }}
                     title={`Passed: ${stageCounts.rejected + stageCounts['not-applying']}`} />
              )}
            </>
          )}
        </div>
        <div className={styles.stageLegend}>
          <span className={styles.legendDot} style={{ background: 'var(--accent)' }} /> {stageCounts.new} new
          <span className={styles.legendDot} style={{ background: 'var(--warning)' }} /> {stageCounts['looking-at']} looking
          <span className={styles.legendDot} style={{ background: 'var(--success)' }} /> {stageCounts.applying} applying
        </div>
      </div>

      {/* Score distribution mini-chart */}
      <div className={styles.stat}>
        <div className={styles.label}>Scores</div>
        <div className={styles.miniChart}>
          {buckets.map((count, i) => (
            <div key={i} className={styles.chartBar}
                 style={{ height: `${(count / maxBucket) * 100}%` }}
                 title={`${i * 20}-${(i + 1) * 20}: ${count} jobs`} />
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className={styles.stat}>
        <div className={styles.label}>This week</div>
        <div className={styles.activityText}>
          {recentActivity.reviewed} reviewed, {recentActivity.applied} applied, {recentActivity.rejected} passed
        </div>
      </div>

      {/* Top rejection reason */}
      {topRejectionTag && topRejectionTag.count >= 2 && (
        <div className={styles.stat}>
          <div className={styles.label}>Top reason</div>
          <div className={styles.rejectionText}>
            {topRejectionTag.tag} ({topRejectionTag.count}x)
          </div>
        </div>
      )}
    </div>
  );
}
```

Create `src/renderer/components/PipelineHealthBar.module.css`:

```css
.bar {
  display: flex;
  gap: 1.5rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  align-items: flex-start;
}

.stat {
  flex: 1;
  min-width: 0;
}

.label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin-bottom: 0.3rem;
}

.stageBar {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  gap: 1px;
}

.segment {
  min-width: 4px;
  border-radius: 2px;
}

.segNew { background: var(--accent); }
.segLooking { background: var(--warning); }
.segApplying { background: var(--success); }
.segRejected { background: var(--text-secondary); opacity: 0.4; }

.stageLegend {
  display: flex;
  gap: 0.5rem;
  font-size: 0.65rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  align-items: center;
}

.legendDot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-left: 0.3rem;
}

.miniChart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 28px;
}

.chartBar {
  flex: 1;
  background: var(--accent);
  border-radius: 2px 2px 0 0;
  min-height: 2px;
  opacity: 0.7;
}

.activityText {
  font-size: 0.8rem;
  color: var(--text-primary);
}

.rejectionText {
  font-size: 0.8rem;
  color: var(--warning);
}
```

**Step 4: Integrate PipelineHealthBar into Dashboard**

In `src/renderer/views/Dashboard.tsx`:

Add state for stats bar data:

```typescript
const [stageCounts, setStageCounts] = useState<Record<JobKanbanColumn, number> | null>(null);
const [recentActivity, setRecentActivity] = useState<{ reviewed: number; applied: number; rejected: number } | null>(null);
```

In `loadData`, add:

```typescript
const [entries, feedback, companies, counts, activity] = await Promise.all([
  api.results.getAllJobs(companyFilter.length > 0 ? companyFilter : undefined),
  api.dashboard.feedbackSummary(companyFilter.length > 0 ? companyFilter : undefined),
  api.companies.list(),
  api.dashboard.stageCounts(companyFilter.length > 0 ? companyFilter : undefined),
  api.dashboard.recentActivity(),
]);
setStageCounts(counts);
setRecentActivity(activity);
```

In the Overview tab JSX, add above QuickStats:

```tsx
import { PipelineHealthBar } from '../components/PipelineHealthBar.js';

{stageCounts && recentActivity && (
  <PipelineHealthBar
    stageCounts={stageCounts}
    recentActivity={recentActivity}
    topRejectionTag={feedbackSummary ? getTopTag(feedbackSummary) : null}
    jobs={allJobs}
  />
)}
```

Add helper function:

```typescript
function getTopTag(summary: FeedbackSummary): { tag: string; count: number } | null {
  const entries = Object.entries(summary.tagCounts);
  if (entries.length === 0) return null;
  entries.sort(([, a], [, b]) => b - a);
  const [tag, count] = entries[0];
  const label = FEEDBACK_TAGS.find((t) => t.tag === tag)?.label ?? tag;
  return { tag: label, count };
}
```

**Step 5: Run tests and verify**

Run: `bun test`
Expected: All existing tests pass.

**Step 6: Commit**

```
git add src/renderer/components/PipelineHealthBar.tsx src/renderer/components/PipelineHealthBar.module.css \
  src/renderer/views/Dashboard.tsx src/plugins/kanban-store.ts src/capabilities.ts \
  electron/ipc/kanban.ts electron/preload.ts src/shared/ipc-channels.ts
git commit -m "feat: add pipeline health stats bar to Dashboard"
```

---

### Task 4: Dashboard Filters

Horizontal filter bar with score range, keyword search, kanban status filter, and sort.

**Files:**
- Create: `src/renderer/components/DashboardFilters.tsx`
- Create: `src/renderer/components/DashboardFilters.module.css`
- Modify: `src/renderer/views/Dashboard.tsx`

**Step 1: Create DashboardFilters component**

Create `src/renderer/components/DashboardFilters.tsx`:

```tsx
import React from 'react';
import type { CompanySource, JobKanbanColumn } from '../../types.js';
import styles from './DashboardFilters.module.css';

export type SortBy = 'score' | 'company' | 'salary' | 'date';

interface DashboardFiltersProps {
  companies: CompanySource[];
  selectedCompanyIds: string[];
  onCompanyChange: (ids: string[]) => void;
  scoreMin: number;
  scoreMax: number;
  onScoreChange: (min: number, max: number) => void;
  keyword: string;
  onKeywordChange: (kw: string) => void;
  visibleColumns: Set<JobKanbanColumn>;
  onColumnToggle: (col: JobKanbanColumn) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
}

const COLUMN_OPTIONS: { key: JobKanbanColumn; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'looking-at', label: 'Looking At' },
  { key: 'applying', label: 'Applying' },
];

export function DashboardFilters(props: DashboardFiltersProps) {
  return (
    <div className={styles.bar}>
      {/* Company filter */}
      <select
        className={styles.select}
        value={props.selectedCompanyIds[0] ?? ''}
        onChange={(e) => props.onCompanyChange(e.target.value ? [e.target.value] : [])}
      >
        <option value="">All companies</option>
        {props.companies.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Keyword search */}
      <input
        className={styles.input}
        type="text"
        placeholder="Search titles..."
        value={props.keyword}
        onChange={(e) => props.onKeywordChange(e.target.value)}
      />

      {/* Score range */}
      <div className={styles.scoreRange}>
        <input
          className={styles.scoreInput}
          type="number"
          min={0}
          max={100}
          value={props.scoreMin}
          onChange={(e) => props.onScoreChange(Number(e.target.value), props.scoreMax)}
          title="Min score"
        />
        <span className={styles.rangeSep}>-</span>
        <input
          className={styles.scoreInput}
          type="number"
          min={0}
          max={100}
          value={props.scoreMax}
          onChange={(e) => props.onScoreChange(props.scoreMin, Number(e.target.value))}
          title="Max score"
        />
      </div>

      {/* Kanban status toggles */}
      <div className={styles.toggles}>
        {COLUMN_OPTIONS.map((col) => (
          <button
            key={col.key}
            className={`${styles.toggle} ${props.visibleColumns.has(col.key) ? styles.toggleActive : ''}`}
            onClick={() => props.onColumnToggle(col.key)}
          >
            {col.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        className={styles.select}
        value={props.sortBy}
        onChange={(e) => props.onSortChange(e.target.value as SortBy)}
      >
        <option value="score">Sort: Score</option>
        <option value="company">Sort: Company</option>
        <option value="salary">Sort: Salary</option>
      </select>
    </div>
  );
}
```

Create `src/renderer/components/DashboardFilters.module.css`:

```css
.bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.select {
  font-size: 0.8rem;
  padding: 0.3rem 0.5rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 4px;
}

.input {
  font-size: 0.8rem;
  padding: 0.3rem 0.5rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 4px;
  min-width: 140px;
}

.input::placeholder {
  color: var(--text-secondary);
}

.scoreRange {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.scoreInput {
  width: 48px;
  font-size: 0.8rem;
  padding: 0.3rem 0.3rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 4px;
  text-align: center;
}

.rangeSep {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.toggles {
  display: flex;
  gap: 0.25rem;
}

.toggle {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
}

.toggle:hover {
  border-color: var(--accent);
}

.toggleActive {
  color: var(--accent);
  border-color: var(--accent);
  background: rgba(78, 168, 222, 0.1);
}
```

**Step 2: Integrate filters into Dashboard with client-side filtering**

In `src/renderer/views/Dashboard.tsx`, add filter state:

```typescript
import { DashboardFilters, type SortBy } from '../components/DashboardFilters.js';

const [keyword, setKeyword] = useState('');
const [scoreMin, setScoreMin] = useState(0);
const [scoreMax, setScoreMax] = useState(100);
const [visibleColumns, setVisibleColumns] = useState<Set<JobKanbanColumn>>(
  new Set(['new', 'looking-at', 'applying'])
);
const [sortBy, setSortBy] = useState<SortBy>('score');
```

Add a `filteredEntries` computation:

```typescript
const filteredEntries = entries.filter((e) => {
  const { ranked, kanbanColumn } = e;
  if (keyword && !ranked.job.title.toLowerCase().includes(keyword.toLowerCase())) return false;
  if (ranked.overallScore < scoreMin || ranked.overallScore > scoreMax) return false;
  if (kanbanColumn && !visibleColumns.has(kanbanColumn)) return false;
  return true;
}).sort((a, b) => {
  switch (sortBy) {
    case 'score': return b.ranked.overallScore - a.ranked.overallScore;
    case 'company': return a.ranked.job.company.localeCompare(b.ranked.job.company);
    case 'salary': return (b.ranked.scores.salary ?? 0) - (a.ranked.scores.salary ?? 0);
    default: return 0;
  }
});
```

Replace all uses of `entries` in the JSX (for card lists) with `filteredEntries`. Keep `entries` for stats (QuickStats, PipelineHealthBar) so they reflect the full dataset.

Render the filter bar below the tabs, above the body:

```tsx
<DashboardFilters
  companies={companies}
  selectedCompanyIds={companyFilter}
  onCompanyChange={(ids) => dispatch({ type: 'dashboard:set-filter', companyIds: ids })}
  scoreMin={scoreMin}
  scoreMax={scoreMax}
  onScoreChange={(min, max) => { setScoreMin(min); setScoreMax(max); }}
  keyword={keyword}
  onKeywordChange={setKeyword}
  visibleColumns={visibleColumns}
  onColumnToggle={(col) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      next.has(col) ? next.delete(col) : next.add(col);
      return next;
    });
  }}
  sortBy={sortBy}
  onSortChange={setSortBy}
/>
```

Remove the old standalone company filter `<select>` from the header since it's now in the filter bar.

**Step 3: Run tests and verify**

Run: `bun test`
Expected: All existing tests pass.

**Step 4: Commit**

```
git add src/renderer/components/DashboardFilters.tsx src/renderer/components/DashboardFilters.module.css \
  src/renderer/views/Dashboard.tsx
git commit -m "feat: add Dashboard filter bar with search, score range, kanban status, and sort"
```

---

### Task 5: Activity Tab in Dashboard

Third tab showing chronological action log.

**Files:**
- Create: `src/renderer/components/ActivityLog.tsx`
- Create: `src/renderer/components/ActivityLog.module.css`
- Modify: `src/renderer/views/Dashboard.tsx` — add Activity tab
- Modify: `src/renderer/state.ts` — extend `dashboardTab` union
- Modify: `src/plugins/kanban-store.ts` — add `getRecentMoves` method
- Modify: `src/capabilities.ts` — update type
- Modify: `electron/ipc/kanban.ts` — add handler
- Modify: `electron/preload.ts` — expose method
- Modify: `src/shared/ipc-channels.ts` — add channel

**Step 1: Add getRecentMoves to kanban-store**

In `src/plugins/kanban-store.ts`, add:

```typescript
getRecentMoves(limit: number = 50): {
  jobId: string;
  title: string;
  company: string;
  column: JobKanbanColumn;
  tags: FeedbackTag[];
  notes?: string;
  updatedAt: string;
}[] {
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
```

Update capability type in `src/capabilities.ts`.

**Step 2: Wire IPC**

In `src/shared/ipc-channels.ts`, add:

```typescript
KANBAN_RECENT_MOVES: 'kanban:recent-moves',
```

In `electron/ipc/kanban.ts`:

```typescript
ipcMain.handle(IPC.KANBAN_RECENT_MOVES, async () => {
  const kanban = getBroker().resolve<KanbanStoreCapability>('kanban.store');
  return kanban.getRecentMoves(50);
});
```

In `electron/preload.ts`, add to dashboard namespace:

```typescript
recentMoves: () => ipcRenderer.invoke(IPC.KANBAN_RECENT_MOVES),
```

**Step 3: Extend dashboard tab state**

In `src/renderer/state.ts`, update the `dashboardTab` type:

```typescript
dashboardTab: 'overview' | 'triage' | 'activity';
```

**Step 4: Create ActivityLog component**

Create `src/renderer/components/ActivityLog.tsx`:

```tsx
import React, { useEffect, useState } from 'react';
import { useApi } from '../api.js';
import type { JobKanbanColumn, FeedbackTag } from '../../types.js';
import { FEEDBACK_TAGS } from '../../types.js';
import styles from './ActivityLog.module.css';

interface ActivityEntry {
  jobId: string;
  title: string;
  company: string;
  column: JobKanbanColumn;
  tags: FeedbackTag[];
  notes?: string;
  updatedAt: string;
}

interface ActivityLogProps {
  onOpenDetail?: (jobId: string) => void;
}

const COLUMN_LABELS: Record<string, string> = {
  'looking-at': 'Started looking at',
  applying: 'Applying to',
  rejected: 'Rejected',
  'not-applying': 'Skipped',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityLog({ onOpenDetail }: ActivityLogProps) {
  const api = useApi();
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    let cancelled = false;
    api.dashboard.recentMoves().then((moves: ActivityEntry[]) => {
      if (!cancelled) setEntries(moves);
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = filter === 'all'
    ? entries
    : entries.filter((e) => e.column === filter);

  return (
    <div className={styles.container}>
      <div className={styles.filterRow}>
        {['all', 'looking-at', 'applying', 'rejected', 'not-applying'].map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : COLUMN_LABELS[f]}
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className={styles.empty}>No activity yet.</div>
      )}
      {filtered.map((entry, i) => (
        <div key={`${entry.jobId}-${i}`} className={styles.entry} onClick={() => onOpenDetail?.(entry.jobId)}>
          <div className={styles.entryHeader}>
            <span className={styles.action}>{COLUMN_LABELS[entry.column] ?? entry.column}</span>
            <span className={styles.time}>{timeAgo(entry.updatedAt)}</span>
          </div>
          <div className={styles.jobInfo}>
            <span className={styles.jobTitle}>{entry.title}</span>
            <span className={styles.jobCompany}>{entry.company}</span>
          </div>
          {entry.tags.length > 0 && (
            <div className={styles.tags}>
              {entry.tags.map((t) => (
                <span key={t} className={styles.tag}>
                  {FEEDBACK_TAGS.find((ft) => ft.tag === t)?.label ?? t}
                </span>
              ))}
            </div>
          )}
          {entry.notes && <div className={styles.notes}>{entry.notes}</div>}
        </div>
      ))}
    </div>
  );
}
```

Create `src/renderer/components/ActivityLog.module.css`:

```css
.container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filterRow {
  display: flex;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
}

.filterBtn {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
}

.filterBtn:hover {
  border-color: var(--accent);
}

.filterActive {
  color: var(--accent);
  border-color: var(--accent);
  background: rgba(78, 168, 222, 0.1);
}

.empty {
  font-size: 0.85rem;
  color: var(--text-secondary);
  padding: 2rem 0;
  text-align: center;
}

.entry {
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
}

.entry:hover {
  border-color: var(--accent);
}

.entryHeader {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.2rem;
}

.action {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.time {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.jobInfo {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.jobTitle {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.jobCompany {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.tags {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.tag {
  font-size: 0.65rem;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.notes {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-top: 0.2rem;
}
```

**Step 5: Add Activity tab to Dashboard**

In `src/renderer/views/Dashboard.tsx`, add the third tab button:

```tsx
<button
  className={`${styles.tab} ${state.dashboardTab === 'activity' ? styles.tabActive : ''}`}
  onClick={() => dispatch({ type: 'dashboard:set-tab', tab: 'activity' })}
>
  Activity
</button>
```

And the tab content:

```tsx
import { ActivityLog } from '../components/ActivityLog.js';

{state.dashboardTab === 'activity' && (
  <ActivityLog onOpenDetail={(jobId) => {
    const entry = entries.find((e) => e.ranked.job.id === jobId);
    if (entry) dispatch({ type: 'detail:open', ranked: entry.ranked, analyses: entry.analyses });
  }} />
)}
```

**Step 6: Run tests and verify**

Run: `bun test`
Expected: All existing tests pass.

**Step 7: Commit**

```
git add src/renderer/components/ActivityLog.tsx src/renderer/components/ActivityLog.module.css \
  src/renderer/views/Dashboard.tsx src/renderer/state.ts \
  src/plugins/kanban-store.ts src/capabilities.ts \
  electron/ipc/kanban.ts electron/preload.ts src/shared/ipc-channels.ts
git commit -m "feat: add Activity tab to Dashboard with chronological action log"
```

---

### Task 6: Post-Run AI Summary

Add a pipeline-level summary generated by LLM after scoring completes, displayed at the top of Dashboard.

**Files:**
- Create: `src/prompts/run-summary.ts`
- Modify: `src/plugins/results-store.ts` — add `summary` column to `runs` table
- Modify: `electron/ipc/pipeline.ts` — generate summary after pipeline completes
- Modify: `electron/ipc/results.ts` — expose summary in responses
- Modify: `electron/preload.ts` — expose summary
- Modify: `src/shared/ipc-channels.ts` — add channels
- Modify: `src/renderer/state.ts` — add `runSummary` to state
- Modify: `src/renderer/App.tsx` — wire summary event
- Create: `src/renderer/components/RunSummary.tsx`
- Create: `src/renderer/components/RunSummary.module.css`
- Modify: `src/renderer/views/Dashboard.tsx` — display summary

**Step 1: Create the run summary prompt**

Create `src/prompts/run-summary.ts`:

```typescript
import type { RankedJob, CandidateProfile } from '../types.js';

export function runSummaryPrompt(
  jobs: RankedJob[],
  profile: CandidateProfile,
): string {
  const topJobs = jobs.filter((j) => j.overallScore >= 75);
  const companies = [...new Set(jobs.map((j) => j.job.company))];
  const avgScore = jobs.length > 0
    ? Math.round(jobs.reduce((s, j) => s + j.overallScore, 0) / jobs.length)
    : 0;

  const allRedFlags = jobs.flatMap((j) => j.redFlags);
  const redFlagCounts: Record<string, number> = {};
  for (const rf of allRedFlags) {
    redFlagCounts[rf] = (redFlagCounts[rf] || 0) + 1;
  }

  return `You are a career search analyst. Write a concise 3-4 sentence summary of this pipeline run for ${profile.name}.

Data:
- ${jobs.length} jobs scored across ${companies.length} companies
- ${topJobs.length} strong matches (score 75+)
- Average score: ${avgScore}
- Companies with most results: ${companies.slice(0, 5).join(', ')}
- Top red flags: ${Object.entries(redFlagCounts).sort(([,a],[,b]) => b - a).slice(0, 3).map(([rf, n]) => `${rf} (${n}x)`).join(', ') || 'none'}
- Candidate skills: ${Object.values(profile.skills).flat().slice(0, 10).join(', ')}

Write a brief, actionable summary. Mention:
1. How many strong matches and which companies look promising
2. Any patterns in red flags or skill gaps
3. One specific actionable suggestion

Respond with ONLY the summary text, no JSON, no markdown.`;
}
```

**Step 2: Add summary column to results-store**

In `src/plugins/results-store.ts`, add a migration after the existing ones:

```typescript
try { db.exec('ALTER TABLE runs ADD COLUMN summary TEXT'); } catch {}
```

Add a `saveSummary` method to the `results.store` capability:

```typescript
saveSummary(runId: string, summary: string): void {
  db.prepare('UPDATE runs SET summary = ? WHERE id = ?').run(summary, runId);
},
```

Update the `results.query` capability to include `summary` in `listRuns` and `getRunDetail` responses.

**Step 3: Generate summary after pipeline completes**

In `electron/ipc/pipeline.ts`, after the pipeline run completes and results are saved, add summary generation:

```typescript
// Generate run summary (non-critical, wrapped in try/catch)
try {
  const llm = broker.resolve<LLMGenerate>('llm.generate');
  const profileStore = broker.resolve<ProfileStoreCapability>('profile.store');
  const profileData = profileStore.get();
  if (profileData && results.length > 0) {
    const { runSummaryPrompt } = await import('../src/prompts/run-summary.js');
    const summaryText = await llm.generate(
      runSummaryPrompt(results, profileData),
      { temperature: 0.3 }
    );
    const resultsStore = broker.resolve<ResultsStore>('results.store');
    resultsStore.saveSummary(runId, summaryText);
    win?.webContents.send(IPC.PIPELINE_RUN_SUMMARY, { runId, summary: summaryText });
  }
} catch (err) {
  console.warn('Failed to generate run summary:', err);
}
```

**Step 4: Add IPC channel and event for summary**

In `src/shared/ipc-channels.ts`, add:

```typescript
PIPELINE_RUN_SUMMARY: 'pipeline:run-summary',
RESULTS_GET_LATEST_SUMMARY: 'results:latest-summary',
```

In `electron/preload.ts`, add to `results` namespace:

```typescript
getLatestSummary: () => ipcRenderer.invoke(IPC.RESULTS_GET_LATEST_SUMMARY),
```

Add to `on` namespace:

```typescript
runSummary: (cb: (payload: { runId: string; summary: string }) => void) => {
  const handler = (_e: any, payload: any) => cb(payload);
  ipcRenderer.on(IPC.PIPELINE_RUN_SUMMARY, handler);
  return () => ipcRenderer.removeListener(IPC.PIPELINE_RUN_SUMMARY, handler);
},
```

In `electron/ipc/results.ts`, add handler:

```typescript
ipcMain.handle(IPC.RESULTS_GET_LATEST_SUMMARY, async () => {
  const query = getBroker().resolve<ResultsQuery>('results.query');
  const runId = await query.getLatestRunId();
  if (!runId) return null;
  const detail = await query.getRunDetail(runId);
  return detail?.summary ?? null;
});
```

**Step 5: Add runSummary to AppState and wire event**

In `src/renderer/state.ts`:

Add to AppState:

```typescript
runSummary: string | null;
```

Add actions:

```typescript
| { type: 'summary:received'; summary: string }
| { type: 'summary:dismiss' }
```

Add to initialState: `runSummary: null`

Add reducer cases:

```typescript
case 'summary:received':
  return { ...state, runSummary: action.summary };
case 'summary:dismiss':
  return { ...state, runSummary: null };
```

In `src/renderer/App.tsx`, wire the event in the Shell effect:

```typescript
const unsubSummary = api.on.runSummary((payload) => {
  dispatch({ type: 'summary:received', summary: payload.summary });
});
// Add to cleanup: unsubSummary();
```

**Step 6: Create RunSummary component**

Create `src/renderer/components/RunSummary.tsx`:

```tsx
import React from 'react';
import styles from './RunSummary.module.css';

interface RunSummaryProps {
  summary: string;
  onDismiss: () => void;
}

export function RunSummary({ summary, onDismiss }: RunSummaryProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Run Summary</span>
        <button className={styles.dismiss} onClick={onDismiss}>&times;</button>
      </div>
      <p className={styles.text}>{summary}</p>
    </div>
  );
}
```

Create `src/renderer/components/RunSummary.module.css`:

```css
.card {
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--accent);
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent);
  font-weight: 600;
}

.dismiss {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  padding: 0 0.25rem;
}

.dismiss:hover {
  color: var(--text-primary);
}

.text {
  font-size: 0.85rem;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
}
```

**Step 7: Display RunSummary in Dashboard**

In `src/renderer/views/Dashboard.tsx`:

At the top of the Overview tab content, before PipelineHealthBar:

```tsx
import { RunSummary } from '../components/RunSummary.js';

{state.runSummary && (
  <RunSummary
    summary={state.runSummary}
    onDismiss={() => dispatch({ type: 'summary:dismiss' })}
  />
)}
```

Also load the latest summary on Dashboard mount:

```typescript
// In loadData:
const summary = await api.results.getLatestSummary();
if (summary) dispatch({ type: 'summary:received', summary });
```

**Step 8: Run tests and verify**

Run: `bun test`
Expected: All existing tests pass.

**Step 9: Commit**

```
git add src/prompts/run-summary.ts src/plugins/results-store.ts \
  src/renderer/state.ts src/renderer/App.tsx \
  src/renderer/components/RunSummary.tsx src/renderer/components/RunSummary.module.css \
  src/renderer/views/Dashboard.tsx \
  electron/ipc/pipeline.ts electron/ipc/results.ts electron/preload.ts \
  src/shared/ipc-channels.ts
git commit -m "feat: add post-run AI summary to Dashboard"
```

---

### Task 7: Final Integration Test and Polish

**Files:**
- Modify: various — minor adjustments from integration testing

**Step 1: Start the app and test the full flow**

Run: `npm start`

Test checklist:
1. Dashboard loads with PipelineHealthBar + QuickStats
2. Job cards show inline score pills, skill tags, kanban status
3. Filter bar filters cards by keyword, score range, kanban status
4. Sort dropdown changes card order
5. Activity tab shows recent moves
6. Clicking a job opens the detail panel (from Dashboard, Results, History)
7. Detail panel actions are pinned at top
8. Run a pipeline — verify post-run summary appears
9. Dismiss summary — verify it goes away
10. Navigate between views — verify detail panel closes

**Step 2: Fix any issues found during testing**

Address visual alignment, data loading, or state management issues.

**Step 3: Final commit**

```
git add -u
git commit -m "fix: polish information-dense dashboard integration"
```
