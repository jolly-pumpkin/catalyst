# Dashboard UX Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a new Dashboard view with overview, triage mode, and detail panel to help users understand job fit, take action, and identify skill gaps.

**Architecture:** New `dashboard` view in NavRail. Backend adds two new IPC endpoints (`results:get-all-jobs`, `kanban:feedback-summary`). Skill-matcher prompt is extended to return structured gap data (`matchedSkills`, `missingSkills`, `matchPercent`, `gapSeverity`). Frontend computes near-miss rollups client-side from the gap data. Existing kanban move API handles triage actions.

**Tech Stack:** React (renderer), TypeScript, CSS Modules, better-sqlite3 (main process), Rhodium broker (capability resolution), Electron IPC.

---

### Task 1: Extend JobAnalysis type with skill gap fields

**Files:**
- Modify: `src/types.ts:39-45`

**Step 1: Add optional gap fields to JobAnalysis**

```typescript
export interface JobAnalysis {
  jobId: string;
  variant: 'skill' | 'culture' | 'salary';
  score: number;
  reasoning: string;
  signals: string[];
  // Skill gap data (only present for variant === 'skill')
  matchedSkills?: string[];
  missingSkills?: string[];
  matchPercent?: number;
  gapSeverity?: 'minor' | 'moderate' | 'major';
}
```

**Step 2: Run tests to confirm no regressions**

Run: `bun test`
Expected: All existing tests pass (gap fields are optional, so no breakage).

**Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat(types): add optional skill gap fields to JobAnalysis"
```

---

### Task 2: Update skill-matcher prompt to return gap data

**Files:**
- Modify: `src/prompts/skill-matcher.ts`
- Modify: `src/plugins/skill-matcher.ts:60-64`

**Step 1: Update the prompt template**

In `src/prompts/skill-matcher.ts`, replace the entire function:

```typescript
import type { CandidateProfile, NormalizedJob } from '../types.js';

export function skillMatcherPrompt(job: NormalizedJob, profile: CandidateProfile): string {
  const candidateSkills = Object.values(profile.skills).flat();
  return `You are a technical skill matcher. Score this job's skill fit for the candidate.

Candidate skills: ${candidateSkills.join(', ')}
Candidate experience: ${profile.yearsExperience} years as ${profile.titles[0] ?? 'professional'}

Return a score 0-100 for technical skill overlap.
Also return:
- matchedSkills: candidate skills that match this job's requirements
- missingSkills: skills the job requires that the candidate lacks
- matchPercent: percentage of required skills the candidate has (0-100)
- gapSeverity: "minor" if matchPercent >= 80, "moderate" if >= 60, "major" if < 60

Return ONLY a JSON object — no markdown, no explanation:
{ "jobId": "${job.id}", "variant": "skill", "score": number, "reasoning": "1 sentence", "signals": ["key signal"], "matchedSkills": ["skill"], "missingSkills": ["skill"], "matchPercent": number, "gapSeverity": "minor"|"moderate"|"major" }

JOB:
${JSON.stringify({ id: job.id, title: job.title, skills: job.skills }, null, 2)}`;
}
```

**Step 2: Run the skill-matcher test to check it still passes**

Run: `bun test src/plugins/scoring.test.ts`
Expected: PASS. The test mocks LLM output, so it needs to be checked — if it validates specific fields, the mock may need updating. Check first.

**Step 3: Update the scoring test mock if needed**

Read `src/plugins/scoring.test.ts` to see if the mock LLM response needs the new fields. If the mock returns a `JobAnalysis` and the test only checks `score`/`reasoning`/`signals`, no change needed. If it strictly validates the shape, add the new optional fields to the mock response.

**Step 4: Run all tests**

Run: `bun test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/prompts/skill-matcher.ts src/plugins/skill-matcher.ts
git commit -m "feat(skill-matcher): return structured skill gap data from LLM"
```

---

### Task 3: Add new IPC endpoints for dashboard data

**Files:**
- Modify: `src/shared/ipc-channels.ts` — add two new channel constants
- Modify: `electron/preload.ts` — expose new API methods
- Create: `electron/ipc/dashboard.ts` — new IPC handlers
- Modify: `electron/ipc/index.ts` — register new handlers

**Step 1: Add IPC channel constants**

In `src/shared/ipc-channels.ts`, add before the `// Main -> Renderer` comment:

```typescript
  RESULTS_GET_ALL_JOBS: 'results:get-all-jobs',
  KANBAN_FEEDBACK_SUMMARY: 'kanban:feedback-summary',
```

**Step 2: Create the IPC handler file**

Create `electron/ipc/dashboard.ts`:

```typescript
import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getBroker } from '../main.js';
import type { RankedJob, JobAnalysis } from '../../src/types.js';
import type { KanbanStoreCapability } from '../../src/plugins/kanban-store.js';

export function registerDashboardHandlers(): void {
  ipcMain.handle(IPC.RESULTS_GET_ALL_JOBS, async (_event, companyIds?: string[]) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');

    const query = broker.resolve<{
      listRuns(): Promise<{ id: string; company_source_id?: string }[]>;
      getJobs(runId: string): Promise<RankedJob[]>;
      getRunDetail(runId: string): Promise<{ analyses?: JobAnalysis[] } | null>;
    }>('results.query');

    const runs = await query.listRuns();
    const jobMap = new Map<string, { ranked: RankedJob; analyses: JobAnalysis[] }>();

    for (const run of runs) {
      // Filter by company if specified
      if (companyIds && companyIds.length > 0) {
        const detail = await query.getRunDetail(run.id);
        // Check if run has a company_source_id that matches — runs table has it
        // For now, get all jobs and filter by checking kanban or just include all
      }

      const jobs = await query.getJobs(run.id);
      const detail = await query.getRunDetail(run.id);
      const analyses = detail?.analyses ?? [];

      for (const ranked of jobs) {
        // Deduplicate: keep the latest version of each job
        if (!jobMap.has(ranked.job.id)) {
          const jobAnalyses = analyses.filter((a) => a.jobId === ranked.job.id);
          jobMap.set(ranked.job.id, { ranked, analyses: jobAnalyses });
        }
      }
    }

    const entries = Array.from(jobMap.values());

    // Filter by company if requested
    if (companyIds && companyIds.length > 0) {
      // Use kanban store to check company association
      try {
        const kanban = broker.resolve<KanbanStoreCapability>('kanban.store');
        return entries.filter((e) => {
          // Check if this job is tracked for any of the requested companies
          return companyIds.some((cid) => {
            const cols = ['new', 'looking-at', 'applying', 'rejected', 'not-applying'] as const;
            return cols.some((col) => {
              const jobs = kanban.getColumnJobs(cid, col);
              return jobs.some((j) => j.jobId === e.ranked.job.id);
            });
          });
        });
      } catch {
        return entries;
      }
    }

    return entries;
  });

  ipcMain.handle(IPC.KANBAN_FEEDBACK_SUMMARY, async (_event, companyIds?: string[]) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');

    const kanban = broker.resolve<KanbanStoreCapability>('kanban.store');

    if (!companyIds || companyIds.length === 0) {
      return kanban.getFeedbackSummary();
    }

    // Aggregate feedback across requested companies
    const combined = {
      totalRejected: 0,
      totalNotApplying: 0,
      tagCounts: {} as Record<string, number>,
      recentNotes: [] as string[],
    };

    for (const cid of companyIds) {
      const summary = kanban.getFeedbackSummary(cid);
      combined.totalRejected += summary.totalRejected;
      combined.totalNotApplying += summary.totalNotApplying;
      for (const [tag, count] of Object.entries(summary.tagCounts)) {
        combined.tagCounts[tag] = (combined.tagCounts[tag] ?? 0) + count;
      }
      combined.recentNotes.push(...summary.recentNotes);
    }

    combined.recentNotes = combined.recentNotes.slice(-10);
    return combined;
  });
}
```

**Step 3: Expose the new API methods in preload**

In `electron/preload.ts`, add inside the `results` object after `getJobs`:

```typescript
    getAllJobs: (companyIds?: string[]) =>
      ipcRenderer.invoke(IPC.RESULTS_GET_ALL_JOBS, companyIds),
```

Add a new `dashboard` namespace after the `results` object:

```typescript
  dashboard: {
    feedbackSummary: (companyIds?: string[]) =>
      ipcRenderer.invoke(IPC.KANBAN_FEEDBACK_SUMMARY, companyIds),
  },
```

**Step 4: Register the handlers**

Read `electron/ipc/index.ts` to see the pattern, then add:

```typescript
import { registerDashboardHandlers } from './dashboard.js';
```

And call `registerDashboardHandlers()` inside the registration function.

**Step 5: Run the app to verify no import errors**

Run: `npm start`
Expected: App starts without errors. Close it after verifying.

**Step 6: Commit**

```bash
git add src/shared/ipc-channels.ts electron/preload.ts electron/ipc/dashboard.ts electron/ipc/index.ts
git commit -m "feat(ipc): add dashboard endpoints for aggregated jobs and feedback summary"
```

---

### Task 4: Add dashboard state to AppState and reducer

**Files:**
- Modify: `src/renderer/state.ts`

**Step 1: Add `'dashboard'` to ViewName union**

At `src/renderer/state.ts:32-44`, add `'dashboard'` to the `ViewName` type:

```typescript
export type ViewName =
  | 'user-selection'
  | 'input'
  | 'dashboard'
  | 'pipeline'
  | 'results'
  | 'job-detail'
  | 'profile'
  | 'history'
  | 'companies'
  | 'kanban'
  | 'resume-manager'
  | 'settings'
  | 'traces';
```

**Step 2: Add dashboard fields to AppState**

Add after the `pipelineCompanyName` field:

```typescript
  // Dashboard
  dashboardTab: 'overview' | 'triage';
  dashboardFilter: { companyIds: string[] };
  detailPanelJobId: string | null;
  triageProgress: { triaged: number; total: number };
```

**Step 3: Update initialState**

Add to the `initialState` object:

```typescript
  dashboardTab: 'overview',
  dashboardFilter: { companyIds: [] },
  detailPanelJobId: null,
  triageProgress: { triaged: 0, total: 0 },
```

**Step 4: Add dashboard actions to AppAction union**

Add these action types:

```typescript
  | { type: 'dashboard:set-tab'; tab: 'overview' | 'triage' }
  | { type: 'dashboard:set-filter'; companyIds: string[] }
  | { type: 'dashboard:open-detail'; jobId: string }
  | { type: 'dashboard:close-detail' }
  | { type: 'dashboard:update-triage'; triaged: number; total: number }
```

**Step 5: Add reducer cases**

Add before the `default:` case in `appReducer`:

```typescript
    case 'dashboard:set-tab':
      return { ...state, dashboardTab: action.tab };

    case 'dashboard:set-filter':
      return { ...state, dashboardFilter: { companyIds: action.companyIds } };

    case 'dashboard:open-detail':
      return { ...state, detailPanelJobId: action.jobId };

    case 'dashboard:close-detail':
      return { ...state, detailPanelJobId: null };

    case 'dashboard:update-triage':
      return { ...state, triageProgress: { triaged: action.triaged, total: action.total } };
```

**Step 6: Change `pipeline:done` to navigate to dashboard instead of results**

In the `pipeline:done` case, change `view: 'results'` to `view: 'dashboard'`:

```typescript
    case 'pipeline:done':
      return { ...state, view: 'dashboard', results: action.results, iteration: action.iteration, selectedJobIndex: 0, done: true };
```

**Step 7: Run tests**

Run: `bun test`
Expected: PASS

**Step 8: Commit**

```bash
git add src/renderer/state.ts
git commit -m "feat(state): add dashboard view state, actions, and reducer cases"
```

---

### Task 5: Add Dashboard to NavRail and App router

**Files:**
- Modify: `src/renderer/components/NavRail.tsx:11-19`
- Modify: `src/renderer/App.tsx`

**Step 1: Add Dashboard to NavRail items**

In `src/renderer/components/NavRail.tsx`, add Dashboard as the first item in `NAV_ITEMS`:

```typescript
const NAV_ITEMS: NavItem[] = [
  { view: 'dashboard',      label: 'Dashboard', icon: '\u{1F4CB}' },
  { view: 'companies',      label: 'Companies', icon: '\u{1F3E2}' },
  { view: 'pipeline',       label: 'Pipeline',  icon: '\u{2699}'  },
  { view: 'results',        label: 'Results',   icon: '\u{1F4CA}' },
  { view: 'history',        label: 'History',   icon: '\u{1F4C5}' },
  { view: 'profile',        label: 'Profile',   icon: '\u{1F464}' },
  { view: 'resume-manager', label: 'Resume',    icon: '\u{1F4C4}' },
  { view: 'traces',         label: 'Traces',   icon: '\u{1F50D}' },
];
```

**Step 2: Add Dashboard import and route in App.tsx**

Add import at top of `src/renderer/App.tsx`:

```typescript
import { Dashboard } from './views/Dashboard.js';
```

Add the route in the main content area (inside `<main>`), before the companies route:

```typescript
{state.view === 'dashboard' && <Dashboard state={state} dispatch={dispatch} />}
```

**Step 3: Create a placeholder Dashboard view so the app compiles**

Create `src/renderer/views/Dashboard.tsx`:

```typescript
import React from 'react';
import type { AppState, AppAction } from '../state.js';

interface DashboardProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export function Dashboard({ state, dispatch }: DashboardProps) {
  return <div style={{ padding: '1rem' }}>Dashboard — coming soon</div>;
}
```

**Step 4: Run the app to verify navigation works**

Run: `npm start`
Expected: Dashboard appears in NavRail, clicking it shows placeholder. Pipeline completion navigates to Dashboard.

**Step 5: Commit**

```bash
git add src/renderer/components/NavRail.tsx src/renderer/App.tsx src/renderer/views/Dashboard.tsx
git commit -m "feat(nav): add Dashboard to NavRail and app router"
```

---

### Task 6: Build QuickStats component

**Files:**
- Create: `src/renderer/components/QuickStats.tsx`
- Create: `src/renderer/components/QuickStats.module.css`

**Step 1: Create QuickStats component**

```typescript
import React from 'react';
import type { RankedJob, JobAnalysis } from '../../types.js';
import styles from './QuickStats.module.css';

interface QuickStatsProps {
  jobs: RankedJob[];
  analyses: JobAnalysis[];
  topPickThreshold?: number;
  nearMissMinMatch?: number;
  nearMissMaxScore?: number;
}

export function QuickStats({
  jobs,
  analyses,
  topPickThreshold = 75,
  nearMissMinMatch = 60,
  nearMissMaxScore = 70,
}: QuickStatsProps) {
  const total = jobs.length;
  const avgScore = total > 0 ? Math.round(jobs.reduce((s, j) => s + j.overallScore, 0) / total) : 0;
  const topPicks = jobs.filter((j) => j.overallScore >= topPickThreshold).length;

  const skillAnalyses = analyses.filter((a) => a.variant === 'skill' && a.matchPercent != null);
  const nearMisses = skillAnalyses.filter(
    (a) => (a.matchPercent ?? 0) >= nearMissMinMatch && (jobs.find((j) => j.job.id === a.jobId)?.overallScore ?? 100) < nearMissMaxScore,
  ).length;

  return (
    <div className={styles.bar}>
      <div className={styles.stat}>
        <span className={styles.value}>{total}</span>
        <span className={styles.label}>Jobs Analyzed</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{avgScore}</span>
        <span className={styles.label}>Avg Match</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{topPicks}</span>
        <span className={styles.label}>Top Picks</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{nearMisses}</span>
        <span className={styles.label}>Near Misses</span>
      </div>
    </div>
  );
}
```

**Step 2: Create CSS module**

```css
.bar {
  display: flex;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
}

.label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Step 3: Commit**

```bash
git add src/renderer/components/QuickStats.tsx src/renderer/components/QuickStats.module.css
git commit -m "feat(ui): add QuickStats component for dashboard summary bar"
```

---

### Task 7: Build JobCard component with progressive disclosure

**Files:**
- Create: `src/renderer/components/JobCard.tsx`
- Create: `src/renderer/components/JobCard.module.css`

**Step 1: Create JobCard component**

```typescript
import React, { useState } from 'react';
import type { RankedJob, JobAnalysis, JobKanbanColumn } from '../../types.js';
import { ScoreBar } from './ScoreBar.js';
import styles from './JobCard.module.css';

interface JobCardProps {
  ranked: RankedJob;
  analyses?: JobAnalysis[];
  onAction?: (jobId: string, column: JobKanbanColumn) => void;
  onOpenDetail?: (jobId: string) => void;
}

export function JobCard({ ranked, analyses, onAction, onOpenDetail }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { job } = ranked;
  const skillAnalysis = analyses?.find((a) => a.variant === 'skill');
  const topSignals = analyses?.flatMap((a) => a.signals).slice(0, 3) ?? [];

  return (
    <div className={styles.card}>
      {/* Level 1: Collapsed */}
      <div className={styles.header} onClick={() => setExpanded(!expanded)}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{job.title}</span>
          <span className={styles.company}>{job.company}</span>
        </div>
        <span className={styles.chevron}>{expanded ? '\u25BC' : '\u25B6'}</span>
      </div>
      <div className={styles.scoreRow}>
        <ScoreBar score={ranked.overallScore} label="Overall" />
      </div>
      <div className={styles.summaryRow}>{ranked.summary}</div>
      <div className={styles.metaRow}>
        <span className={styles.sourceBadge}>{job.source}</span>
      </div>

      {/* Level 2: Expanded */}
      {expanded && (
        <div className={styles.expanded}>
          <div className={styles.miniScores}>
            <ScoreBar score={ranked.scores.skill} label="Skill" />
            <ScoreBar score={ranked.scores.culture} label="Culture" />
            <ScoreBar score={ranked.scores.salary} label="Salary" />
          </div>

          {topSignals.length > 0 && (
            <div className={styles.signals}>
              {topSignals.map((s, i) => (
                <span key={i} className={styles.signalTag}>{s}</span>
              ))}
            </div>
          )}

          {ranked.redFlags.length > 0 && (
            <div className={styles.redFlags}>
              {ranked.redFlags.map((f, i) => (
                <span key={i} className={styles.redFlagTag}>{f}</span>
              ))}
            </div>
          )}

          {skillAnalysis?.matchPercent != null && (
            <div className={styles.gapRow}>
              <span className={styles.matchPercent}>{skillAnalysis.matchPercent}% match</span>
              {skillAnalysis.missingSkills && skillAnalysis.missingSkills.length > 0 && (
                <span className={styles.missingSkills}>
                  missing: {skillAnalysis.missingSkills.join(', ')}
                </span>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => onAction?.(job.id, 'looking-at')}>Looking At</button>
            <button className={`${styles.actionBtn} ${styles.applyBtn}`} onClick={() => onAction?.(job.id, 'applying')}>Applying</button>
            <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => onAction?.(job.id, 'rejected')}>Reject</button>
            <button className={styles.actionBtn} onClick={() => onAction?.(job.id, 'not-applying')}>Skip</button>
            <button className={styles.detailBtn} onClick={() => onOpenDetail?.(job.id)}>Details</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Create CSS module**

```css
.card {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-secondary);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 0.4rem;
}

.titleRow {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.title {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.company {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.chevron {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.scoreRow {
  margin-bottom: 0.3rem;
}

.summaryRow {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 0.3rem;
}

.metaRow {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.sourceBadge {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.expanded {
  border-top: 1px solid var(--border);
  padding-top: 0.5rem;
  margin-top: 0.4rem;
}

.miniScores {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.signals {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.4rem;
}

.signalTag {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  background: var(--bg-tertiary);
  color: var(--accent);
}

.redFlags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.4rem;
}

.redFlagTag {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  background: rgba(248, 113, 113, 0.15);
  color: var(--danger);
}

.gapRow {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.matchPercent {
  color: var(--warning);
  font-weight: 600;
  margin-right: 0.5rem;
}

.missingSkills {
  color: var(--text-secondary);
}

.actions {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.actionBtn {
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
}

.actionBtn:hover {
  border-color: var(--accent);
}

.applyBtn {
  border-color: var(--success);
  color: var(--success);
}

.rejectBtn {
  border-color: var(--danger);
  color: var(--danger);
}

.detailBtn {
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--accent);
  border-radius: 4px;
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  margin-left: auto;
}

.detailBtn:hover {
  background: rgba(78, 168, 222, 0.1);
}
```

**Step 3: Commit**

```bash
git add src/renderer/components/JobCard.tsx src/renderer/components/JobCard.module.css
git commit -m "feat(ui): add JobCard component with progressive disclosure"
```

---

### Task 8: Build NearMissGroup component

**Files:**
- Create: `src/renderer/components/NearMissGroup.tsx`
- Create: `src/renderer/components/NearMissGroup.module.css`

**Step 1: Create NearMissGroup component**

This computes the "Learn X → unlocks N jobs" rollup from skill gap data.

```typescript
import React, { useState } from 'react';
import type { RankedJob, JobAnalysis } from '../../types.js';
import { JobCard } from './JobCard.js';
import type { JobKanbanColumn } from '../../types.js';
import styles from './NearMissGroup.module.css';

interface NearMissGroupProps {
  jobs: RankedJob[];
  analyses: JobAnalysis[];
  nearMissMinMatch?: number;
  nearMissMaxScore?: number;
  onAction?: (jobId: string, column: JobKanbanColumn) => void;
  onOpenDetail?: (jobId: string) => void;
}

export interface SkillGapGroup {
  skill: string;
  count: number;
  jobs: { ranked: RankedJob; analyses: JobAnalysis[] }[];
}

export function computeSkillGapGroups(
  jobs: RankedJob[],
  analyses: JobAnalysis[],
  nearMissMinMatch = 60,
  nearMissMaxScore = 70,
): SkillGapGroup[] {
  const skillAnalyses = analyses.filter(
    (a) => a.variant === 'skill' && a.matchPercent != null && (a.matchPercent ?? 0) >= nearMissMinMatch,
  );

  const nearMissJobIds = new Set(
    skillAnalyses
      .filter((a) => {
        const ranked = jobs.find((j) => j.job.id === a.jobId);
        return ranked && ranked.overallScore < nearMissMaxScore;
      })
      .map((a) => a.jobId),
  );

  const groupMap = new Map<string, Set<string>>();
  for (const a of skillAnalyses) {
    if (!nearMissJobIds.has(a.jobId)) continue;
    for (const skill of a.missingSkills ?? []) {
      if (!groupMap.has(skill)) groupMap.set(skill, new Set());
      groupMap.get(skill)!.add(a.jobId);
    }
  }

  return Array.from(groupMap.entries())
    .map(([skill, jobIds]) => ({
      skill,
      count: jobIds.size,
      jobs: Array.from(jobIds).map((id) => ({
        ranked: jobs.find((j) => j.job.id === id)!,
        analyses: analyses.filter((a) => a.jobId === id),
      })).filter((e) => e.ranked),
    }))
    .sort((a, b) => b.count - a.count);
}

export function NearMissGroup({
  jobs,
  analyses,
  nearMissMinMatch = 60,
  nearMissMaxScore = 70,
  onAction,
  onOpenDetail,
}: NearMissGroupProps) {
  const groups = computeSkillGapGroups(jobs, analyses, nearMissMinMatch, nearMissMaxScore);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  if (groups.length === 0) {
    return <div className={styles.empty}>No near misses found.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Near Misses</div>
      {groups.map((group) => (
        <div key={group.skill} className={styles.group}>
          <button
            className={styles.groupHeader}
            onClick={() => setExpandedSkill(expandedSkill === group.skill ? null : group.skill)}
          >
            <span className={styles.skill}>Learn {group.skill}</span>
            <span className={styles.arrow}>{expandedSkill === group.skill ? '\u25BC' : '\u25B6'}</span>
            <span className={styles.count}>unlocks {group.count} job{group.count !== 1 ? 's' : ''}</span>
          </button>
          {expandedSkill === group.skill && (
            <div className={styles.jobList}>
              {group.jobs.map((entry) => (
                <JobCard
                  key={entry.ranked.job.id}
                  ranked={entry.ranked}
                  analyses={entry.analyses}
                  onAction={onAction}
                  onOpenDetail={onOpenDetail}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Create CSS module**

```css
.container {
  margin-bottom: 1rem;
}

.heading {
  font-size: 1rem;
  font-weight: 600;
  color: var(--warning);
  margin-bottom: 0.5rem;
}

.empty {
  color: var(--text-secondary);
  font-size: 0.85rem;
  padding: 0.5rem 0;
}

.group {
  margin-bottom: 0.25rem;
}

.groupHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.85rem;
  text-align: left;
}

.groupHeader:hover {
  border-color: var(--warning);
}

.skill {
  font-weight: 600;
  color: var(--warning);
}

.arrow {
  font-size: 0.65rem;
  color: var(--text-secondary);
}

.count {
  color: var(--text-secondary);
  margin-left: auto;
}

.jobList {
  padding: 0.5rem 0 0.5rem 1rem;
}
```

**Step 3: Commit**

```bash
git add src/renderer/components/NearMissGroup.tsx src/renderer/components/NearMissGroup.module.css
git commit -m "feat(ui): add NearMissGroup component with skill gap rollup"
```

---

### Task 9: Build FeedbackInsights component

**Files:**
- Create: `src/renderer/components/FeedbackInsights.tsx`
- Create: `src/renderer/components/FeedbackInsights.module.css`

**Step 1: Create FeedbackInsights component**

```typescript
import React from 'react';
import { FEEDBACK_TAGS } from '../../types.js';
import styles from './FeedbackInsights.module.css';

interface FeedbackSummary {
  totalRejected: number;
  totalNotApplying: number;
  tagCounts: Record<string, number>;
  recentNotes: string[];
}

interface FeedbackInsightsProps {
  summary: FeedbackSummary | null;
}

export function FeedbackInsights({ summary }: FeedbackInsightsProps) {
  if (!summary || (summary.totalRejected === 0 && summary.totalNotApplying === 0)) {
    return null;
  }

  const total = summary.totalRejected + summary.totalNotApplying;
  const sortedTags = Object.entries(summary.tagCounts)
    .sort(([, a], [, b]) => b - a);

  const topTag = sortedTags[0];
  const tagLabel = topTag
    ? FEEDBACK_TAGS.find((t) => t.tag === topTag[0])?.label ?? topTag[0]
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Feedback Patterns</div>
      <div className={styles.summary}>
        You&apos;ve passed on {total} job{total !== 1 ? 's' : ''}:
        {sortedTags.map(([tag, count]) => {
          const label = FEEDBACK_TAGS.find((t) => t.tag === tag)?.label ?? tag;
          return (
            <span key={tag} className={styles.tagCount}> {count} {label.toLowerCase()}</span>
          );
        })}
      </div>
      {topTag && topTag[1] >= 3 && (
        <div className={styles.nudge}>
          Most common reason: <strong>{tagLabel}</strong> ({topTag[1]} times).
          Consider adjusting your search criteria.
        </div>
      )}
    </div>
  );
}
```

**Step 2: Create CSS module**

```css
.container {
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 1rem;
}

.heading {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.4rem;
}

.summary {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.tagCount {
  display: inline;
}

.tagCount::before {
  content: ' \00B7 ';
}

.tagCount:first-of-type::before {
  content: ' ';
}

.nudge {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: var(--warning);
  line-height: 1.4;
}
```

**Step 3: Commit**

```bash
git add src/renderer/components/FeedbackInsights.tsx src/renderer/components/FeedbackInsights.module.css
git commit -m "feat(ui): add FeedbackInsights component for rejection pattern display"
```

---

### Task 10: Build DetailPanel component

**Files:**
- Create: `src/renderer/components/DetailPanel.tsx`
- Create: `src/renderer/components/DetailPanel.module.css`

**Step 1: Create DetailPanel component**

```typescript
import React from 'react';
import { useApi } from '../api.js';
import type { RankedJob, JobAnalysis, JobKanbanColumn } from '../../types.js';
import { ScoreBar } from './ScoreBar.js';
import styles from './DetailPanel.module.css';

interface DetailPanelProps {
  ranked: RankedJob;
  analyses: JobAnalysis[];
  onClose: () => void;
  onAction?: (jobId: string, column: JobKanbanColumn) => void;
}

export function DetailPanel({ ranked, analyses, onClose, onAction }: DetailPanelProps) {
  const api = useApi();
  const { job } = ranked;
  const skillAnalysis = analyses.find((a) => a.variant === 'skill');

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.title}>{job.title}</div>
        <div className={styles.company}>
          {job.company} &middot; {job.location}
          {job.remote && <span className={styles.remote}>remote</span>}
        </div>

        {job.url && (
          <button className={styles.openBtn} onClick={() => api.openUrl(job.url)}>
            Open URL
          </button>
        )}

        {/* Scores */}
        <div className={styles.section}>
          <ScoreBar score={ranked.overallScore} label="Overall" />
          <div className={styles.scoreGrid}>
            <ScoreBar score={ranked.scores.skill} label="Skill" />
            <ScoreBar score={ranked.scores.culture} label="Culture" />
            <ScoreBar score={ranked.scores.salary} label="Salary" />
          </div>
        </div>

        {/* Skill Gap */}
        {skillAnalysis?.matchPercent != null && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Skill Gap</div>
            <div className={styles.gapInfo}>
              <span className={styles.matchPercent}>{skillAnalysis.matchPercent}% match</span>
              <span className={styles.gapSeverity}>{skillAnalysis.gapSeverity}</span>
            </div>
            {skillAnalysis.matchedSkills && skillAnalysis.matchedSkills.length > 0 && (
              <div className={styles.skillList}>
                <span className={styles.skillLabel}>Matched:</span>
                {skillAnalysis.matchedSkills.map((s) => (
                  <span key={s} className={styles.matchedTag}>{s}</span>
                ))}
              </div>
            )}
            {skillAnalysis.missingSkills && skillAnalysis.missingSkills.length > 0 && (
              <div className={styles.skillList}>
                <span className={styles.skillLabel}>Missing:</span>
                {skillAnalysis.missingSkills.map((s) => (
                  <span key={s} className={styles.missingTag}>{s}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analysis reasoning */}
        {analyses.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Analysis</div>
            {analyses.map((a) => (
              <div key={a.variant} className={styles.analysisBlock}>
                <div className={styles.analysisHeader}>
                  <span className={styles.variant}>{a.variant}</span>
                  <span className={styles.analysisScore}>{a.score}</span>
                </div>
                <div className={styles.reasoning}>{a.reasoning}</div>
                {a.signals.length > 0 && (
                  <div className={styles.signalList}>
                    {a.signals.map((s, i) => (
                      <span key={i} className={styles.signal}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Red flags */}
        {ranked.redFlags.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Red Flags</div>
            {ranked.redFlags.map((f, i) => (
              <div key={i} className={styles.redFlag}>{f}</div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => onAction?.(job.id, 'looking-at')}>Looking At</button>
          <button className={`${styles.actionBtn} ${styles.applyBtn}`} onClick={() => onAction?.(job.id, 'applying')}>Applying</button>
          <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => onAction?.(job.id, 'rejected')}>Reject</button>
          <button className={styles.actionBtn} onClick={() => onAction?.(job.id, 'not-applying')}>Skip</button>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Description</div>
          <div className={styles.description}>{job.description}</div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create CSS module**

```css
.panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 40%;
  height: 100vh;
  background: var(--bg-primary);
  border-left: 1px solid var(--border);
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.closeBtn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.closeBtn:hover {
  color: var(--text-primary);
}

.scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.company {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.remote {
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  background: rgba(78, 168, 222, 0.15);
  color: var(--accent);
}

.openBtn {
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--accent);
  border-radius: 4px;
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  margin-bottom: 0.75rem;
}

.openBtn:hover {
  background: rgba(78, 168, 222, 0.1);
}

.section {
  margin-bottom: 1rem;
}

.sectionTitle {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.4rem;
}

.scoreGrid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.gapInfo {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.4rem;
}

.matchPercent {
  font-weight: 600;
  color: var(--warning);
}

.gapSeverity {
  font-size: 0.75rem;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.skillList {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  align-items: center;
  margin-bottom: 0.3rem;
}

.skillLabel {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-right: 0.25rem;
}

.matchedTag {
  font-size: 0.75rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  background: rgba(74, 222, 128, 0.15);
  color: var(--success);
}

.missingTag {
  font-size: 0.75rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  background: rgba(248, 113, 113, 0.15);
  color: var(--danger);
}

.analysisBlock {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-bottom: 0.4rem;
  background: var(--bg-secondary);
}

.analysisHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.variant {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-primary);
  text-transform: capitalize;
}

.analysisScore {
  font-size: 0.8rem;
  color: var(--accent);
}

.reasoning {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.signalList {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.3rem;
}

.signal {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  background: var(--bg-tertiary);
  color: var(--accent);
}

.redFlag {
  font-size: 0.8rem;
  color: var(--danger);
  line-height: 1.4;
  margin-bottom: 0.2rem;
}

.actions {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.actionBtn {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
}

.actionBtn:hover {
  border-color: var(--accent);
}

.applyBtn {
  border-color: var(--success);
  color: var(--success);
}

.rejectBtn {
  border-color: var(--danger);
  color: var(--danger);
}

.description {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.5;
  white-space: pre-wrap;
}
```

**Step 3: Commit**

```bash
git add src/renderer/components/DetailPanel.tsx src/renderer/components/DetailPanel.module.css
git commit -m "feat(ui): add DetailPanel slide-out component for full job detail"
```

---

### Task 11: Build the full Dashboard view

**Files:**
- Modify: `src/renderer/views/Dashboard.tsx` (replace placeholder)
- Create: `src/renderer/views/Dashboard.module.css`

**Step 1: Implement Dashboard view**

Replace the placeholder `src/renderer/views/Dashboard.tsx`:

```typescript
import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../api.js';
import type { AppState, AppAction } from '../state.js';
import type { RankedJob, JobAnalysis, JobKanbanColumn, CompanySource } from '../../types.js';
import { QuickStats } from '../components/QuickStats.js';
import { JobCard } from '../components/JobCard.js';
import { NearMissGroup } from '../components/NearMissGroup.js';
import { FeedbackInsights } from '../components/FeedbackInsights.js';
import { DetailPanel } from '../components/DetailPanel.js';
import styles from './Dashboard.module.css';

interface DashboardProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

interface DashboardEntry {
  ranked: RankedJob;
  analyses: JobAnalysis[];
}

interface FeedbackSummary {
  totalRejected: number;
  totalNotApplying: number;
  tagCounts: Record<string, number>;
  recentNotes: string[];
}

const TOP_PICK_THRESHOLD = 75;

export function Dashboard({ state, dispatch }: DashboardProps) {
  const api = useApi();
  const [entries, setEntries] = useState<DashboardEntry[]>([]);
  const [companies, setCompanies] = useState<CompanySource[]>([]);
  const [feedbackSummary, setFeedbackSummary] = useState<FeedbackSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const companyFilter = state.dashboardFilter.companyIds;
  const detailJobId = state.detailPanelJobId;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobData, fbData, companyList] = await Promise.all([
        api.results.getAllJobs(companyFilter.length > 0 ? companyFilter : undefined),
        api.dashboard.feedbackSummary(companyFilter.length > 0 ? companyFilter : undefined),
        api.companies.list(),
      ]);
      setEntries(jobData);
      setFeedbackSummary(fbData);
      setCompanies(companyList);
    } catch {
      // API may not be available yet
    } finally {
      setLoading(false);
    }
  }, [api, companyFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const allJobs = entries.map((e) => e.ranked);
  const allAnalyses = entries.flatMap((e) => e.analyses);
  const topPicks = allJobs.filter((j) => j.overallScore >= TOP_PICK_THRESHOLD);
  const detailEntry = detailJobId ? entries.find((e) => e.ranked.job.id === detailJobId) : null;

  const handleAction = useCallback(async (jobId: string, column: JobKanbanColumn) => {
    // Find the job's company to route to kanban
    const entry = entries.find((e) => e.ranked.job.id === jobId);
    if (!entry) return;

    if (column === 'rejected' || column === 'not-applying') {
      // For reject/skip, open kanban for full feedback flow
      // For now, do a simple move — feedback modal can be added later
      // TODO: inline feedback modal
    }

    // Find company ID — check if job is tracked in any company
    // For jobs from company-scoped runs, use the company source
    // Fallback: use first company or skip
    const companyId = state.pipelineCompanyId ?? companies[0]?.id;
    if (!companyId) return;

    try {
      await api.kanban.move(jobId, companyId, column);
      await loadData();
    } catch {
      // ignore move errors
    }
  }, [api, entries, companies, state.pipelineCompanyId, loadData]);

  const handleOpenDetail = useCallback((jobId: string) => {
    dispatch({ type: 'dashboard:open-detail', jobId });
  }, [dispatch]);

  const handleCloseDetail = useCallback(() => {
    dispatch({ type: 'dashboard:close-detail' });
  }, [dispatch]);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    dispatch({ type: 'dashboard:set-filter', companyIds: selected.includes('all') ? [] : selected });
  }, [dispatch]);

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Loading dashboard...</div></div>;
  }

  if (entries.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div>No job data yet.</div>
          <div>Run a pipeline to populate the dashboard.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>Dashboard</span>
        <div className={styles.filterBar}>
          <select
            className={styles.companyFilter}
            value={companyFilter.length === 0 ? 'all' : companyFilter[0]}
            onChange={handleFilterChange}
          >
            <option value="all">All Companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${state.dashboardTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => dispatch({ type: 'dashboard:set-tab', tab: 'overview' })}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${state.dashboardTab === 'triage' ? styles.tabActive : ''}`}
          onClick={() => dispatch({ type: 'dashboard:set-tab', tab: 'triage' })}
        >
          Triage
        </button>
      </div>

      <div className={styles.body}>
        <div className={detailEntry ? styles.mainWithPanel : styles.main}>
          {/* Overview Tab */}
          {state.dashboardTab === 'overview' && (
            <>
              <QuickStats jobs={allJobs} analyses={allAnalyses} />
              <FeedbackInsights summary={feedbackSummary} />

              {/* Top Picks */}
              <div className={styles.sectionTitle}>Top Picks</div>
              {topPicks.length === 0 ? (
                <div className={styles.sectionEmpty}>No strong matches yet.</div>
              ) : (
                topPicks.map((ranked) => {
                  const entry = entries.find((e) => e.ranked.job.id === ranked.job.id);
                  return (
                    <JobCard
                      key={ranked.job.id}
                      ranked={ranked}
                      analyses={entry?.analyses}
                      onAction={handleAction}
                      onOpenDetail={handleOpenDetail}
                    />
                  );
                })
              )}

              {/* Near Misses */}
              <NearMissGroup
                jobs={allJobs}
                analyses={allAnalyses}
                onAction={handleAction}
                onOpenDetail={handleOpenDetail}
              />
            </>
          )}

          {/* Triage Tab */}
          {state.dashboardTab === 'triage' && (
            <>
              <div className={styles.triageHeader}>
                <span className={styles.triageCount}>
                  {allJobs.length} job{allJobs.length !== 1 ? 's' : ''} to review
                </span>
              </div>
              {allJobs.map((ranked) => {
                const entry = entries.find((e) => e.ranked.job.id === ranked.job.id);
                return (
                  <JobCard
                    key={ranked.job.id}
                    ranked={ranked}
                    analyses={entry?.analyses}
                    onAction={handleAction}
                    onOpenDetail={handleOpenDetail}
                  />
                );
              })}
            </>
          )}
        </div>

        {/* Detail Panel */}
        {detailEntry && (
          <DetailPanel
            ranked={detailEntry.ranked}
            analyses={detailEntry.analyses}
            onClose={handleCloseDetail}
            onAction={handleAction}
          />
        )}
      </div>
    </div>
  );
}
```

**Step 2: Create CSS module**

```css
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--accent);
}

.filterBar {
  display: flex;
  gap: 0.5rem;
}

.companyFilter {
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.tab {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.85rem;
  border-bottom: 2px solid transparent;
}

.tab:hover {
  color: var(--text-primary);
}

.tabActive {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main {
  flex: 1;
  overflow-y: auto;
}

.mainWithPanel {
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
  max-width: 60%;
}

.sectionTitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.sectionEmpty {
  font-size: 0.85rem;
  color: var(--text-secondary);
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
}

.triageHeader {
  margin-bottom: 0.75rem;
}

.triageCount {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.loading {
  padding: 2rem;
  color: var(--text-secondary);
  text-align: center;
}

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--text-secondary);
}
```

**Step 3: Run the app to verify the dashboard renders**

Run: `npm start`
Expected: Dashboard shows in NavRail, clicking it loads data, shows QuickStats, Top Picks, Near Misses, and Triage tab. Detail panel opens on click.

**Step 4: Commit**

```bash
git add src/renderer/views/Dashboard.tsx src/renderer/views/Dashboard.module.css
git commit -m "feat(dashboard): implement full Dashboard view with overview, triage, and detail panel"
```

---

### Task 12: Wire feedback modal into triage actions

**Files:**
- Modify: `src/renderer/views/Dashboard.tsx`

**Step 1: Add inline feedback modal for reject/skip actions**

In Dashboard.tsx, add a state for pending feedback:

```typescript
const [feedbackModal, setFeedbackModal] = useState<{ jobId: string; column: JobKanbanColumn } | null>(null);
const [feedbackTags, setFeedbackTags] = useState<FeedbackTag[]>([]);
const [feedbackNotes, setFeedbackNotes] = useState('');
```

Update `handleAction` so that `rejected` and `not-applying` open the modal instead of moving directly:

```typescript
if (column === 'rejected' || column === 'not-applying') {
  setFeedbackModal({ jobId, column });
  setFeedbackTags([]);
  setFeedbackNotes('');
  return;
}
```

Add a `handleFeedbackSubmit` function:

```typescript
const handleFeedbackSubmit = useCallback(async () => {
  if (!feedbackModal) return;
  const companyId = state.pipelineCompanyId ?? companies[0]?.id;
  if (!companyId) return;
  try {
    await api.kanban.move(feedbackModal.jobId, companyId, feedbackModal.column, {
      tags: feedbackTags,
      notes: feedbackNotes || undefined,
    });
    setFeedbackModal(null);
    await loadData();
  } catch { /* ignore */ }
}, [api, feedbackModal, feedbackTags, feedbackNotes, companies, state.pipelineCompanyId, loadData]);
```

Add the modal JSX at the bottom of the component, before the closing `</div>`:

```tsx
{feedbackModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <div className={styles.modalTitle}>
        {feedbackModal.column === 'rejected' ? 'Reject' : 'Not Applying'} — Why?
      </div>
      <div className={styles.tagGrid}>
        {FEEDBACK_TAGS.map((t) => (
          <button
            key={t.tag}
            className={`${styles.feedbackTag} ${feedbackTags.includes(t.tag) ? styles.feedbackTagActive : ''}`}
            onClick={() => setFeedbackTags((prev) =>
              prev.includes(t.tag) ? prev.filter((x) => x !== t.tag) : [...prev, t.tag]
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <textarea
        className={styles.feedbackNotes}
        placeholder="Optional notes..."
        value={feedbackNotes}
        onChange={(e) => setFeedbackNotes(e.target.value)}
        rows={3}
      />
      <div className={styles.modalActions}>
        <button className={styles.modalCancel} onClick={() => setFeedbackModal(null)}>Cancel</button>
        <button className={styles.modalConfirm} onClick={handleFeedbackSubmit}>Confirm</button>
      </div>
    </div>
  </div>
)}
```

Add the required imports at the top:

```typescript
import { FEEDBACK_TAGS } from '../../types.js';
import type { FeedbackTag } from '../../types.js';
```

**Step 2: Add modal CSS to Dashboard.module.css**

Append to `src/renderer/views/Dashboard.module.css`:

```css
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.25rem;
  width: 360px;
}

.modalTitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.tagGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.feedbackTag {
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
}

.feedbackTagActive {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(78, 168, 222, 0.1);
}

.feedbackNotes {
  width: 100%;
  font-size: 0.8rem;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  resize: vertical;
  margin-bottom: 0.75rem;
  font-family: inherit;
}

.modalActions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modalCancel {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
}

.modalConfirm {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--accent);
  border-radius: 4px;
  background: rgba(78, 168, 222, 0.15);
  color: var(--accent);
  cursor: pointer;
}
```

**Step 3: Run the app and test the feedback flow**

Run: `npm start`
Expected: Clicking Reject or Skip on a job card opens the feedback modal. Selecting tags and clicking Confirm moves the job and refreshes the dashboard.

**Step 4: Commit**

```bash
git add src/renderer/views/Dashboard.tsx src/renderer/views/Dashboard.module.css
git commit -m "feat(dashboard): add inline feedback modal for reject/skip triage actions"
```

---

### Task 13: End-to-end verification

**Step 1: Run all tests**

Run: `bun test`
Expected: PASS

**Step 2: Run the app and verify the full flow**

Run: `npm start`

Verify:
1. Dashboard appears first in NavRail
2. Running a pipeline navigates to Dashboard on completion
3. Overview tab shows QuickStats, Top Picks, Near Misses, and Feedback Insights
4. Triage tab shows all jobs as cards
5. Clicking chevron on a card expands it (Level 2 disclosure)
6. Clicking Details opens the DetailPanel on the right
7. DetailPanel updates when clicking Details on different cards
8. Triage actions (Looking At, Applying) move jobs via kanban
9. Reject/Skip opens feedback modal, submitting moves and refreshes
10. Company filter dropdown filters all sections
11. Results view still works via NavRail (unchanged)

**Step 3: Commit any fixes needed**

If any adjustments are required from testing, fix and commit with descriptive messages.
