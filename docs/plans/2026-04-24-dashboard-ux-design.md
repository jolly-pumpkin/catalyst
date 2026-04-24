# Dashboard UX Design

## Problem

After running a pipeline, the current Results view is a flat ranked list. It doesn't help users understand why jobs ranked the way they did, what's close but not quite a fit, or what actions to take. Users want a holistic view of their job search with actionable insights and fast decision-making.

## Decision

Add a new top-level **Dashboard** view alongside the existing Results view. The dashboard aggregates jobs across all companies and runs, with company filters. It has three modes: Overview (summary), Triage (action-taking), and a Detail Panel (full reasoning). A new "near misses" concept surfaces jobs that are close to matching with explicit skill gap data.

## Dashboard Layout & Modes

### Overview Tab (default landing after pipeline run)

- **Quick Stats bar** — jobs analyzed, average match score, top picks count, near misses count
- **Top Picks section** — 3-5 highest-scored jobs as compact cards (title, company, overall score bar, one-line summary). The "apply now" shortlist.
- **Near Misses section** — grouped by skill gap: "Learn Python -> 5 jobs", "Get AWS experience -> 3 jobs". Each group expandable to show the jobs.
- **Feedback Insights** — rejection pattern summary from kanban feedback data ("You've rejected 14 jobs: 6 for wrong tech stack, 4 for low pay"). Trend nudges when a rejection reason is dominant.

### Triage Tab

- Cards shown as a scrollable stack, sorted by score descending, defaulting to untriaged jobs
- Each card supports progressive disclosure (see Card Model below)
- Action buttons at bottom of each card: Looking At / Applying / Reject / Not Applying
- Reject and Not Applying trigger the existing feedback modal (tags + notes)
- Progress indicator: "12 of 34 triaged"

### Detail Panel (slide-out, not a tab)

- Triggered by clicking "Details" on any card in Overview or Triage
- Slides in from the right, ~40% width
- Shows: full score breakdown with all three ScoreBars, complete reasoning per variant, all signals, red flags with context, full job description
- Stays open as you navigate between cards — updates to show focused card
- Can be dismissed
- "Open URL" button to view original posting
- Kanban action buttons also available here

### Filters

- Company filter dropdown at top, below tabs. Defaults to "All Companies", supports single or multi-select.
- Filters apply to all modes (Overview, Triage, Detail Panel)
- Near Misses rollup and Quick Stats recalculate based on active filters

## Job Card — Progressive Disclosure

Shared card component used in Overview, Triage, and potentially Results view.

### Level 1 — Collapsed (default)

- Job title + company name
- Overall score bar (existing ScoreBar component)
- One-line summary (from synthesizer)
- Source badge (remotive, greenhouse, etc.)
- Company pill (for context when viewing "All Companies")

### Level 2 — Expanded (click chevron on card)

- Everything from Level 1, plus:
- Three mini score bars inline: Skill / Culture / Salary
- Top 3 signals as tags (e.g., "React match", "remote-friendly", "below salary range")
- Red flags as warning tags (if any)
- Skill gap indicator if near-miss: "87% match — missing: Python, Docker"
- Action buttons (kanban-aligned): Looking At / Applying / Reject / Not Applying

### Level 3 — Detail Panel

- Full reasoning per variant (skill, culture, salary) — paragraph each
- All signals listed with context
- Red flags with severity
- Skill gap breakdown: matched skills vs missing skills
- Full job description
- "Open URL" button
- Kanban action buttons

## Near Misses & Skill Gap Data

### New data captured per job (skill-matcher variant)

```typescript
// Added to JobAnalysis for variant === 'skill'
matchedSkills: string[]   // candidate skills that matched
missingSkills: string[]   // skills the job wants that candidate lacks
matchPercent: number      // skill overlap percentage
gapSeverity: 'minor' | 'moderate' | 'major'
```

Skill-matcher LLM prompt updated to extract this structured data alongside existing score/reasoning/signals.

### Near-miss definition

Jobs with `matchPercent >= 60%` and `overallScore < 70` (thresholds configurable). High skill overlap but didn't make the top picks.

### Dashboard rollup — "Learn X -> unlocks N jobs"

Computed client-side from the near-miss set. Group by `missingSkills`, count jobs per missing skill, sort by count descending. Derived view, not stored — recalculates when filters change.

## Quick Stats & Feedback Insights

### Stats row (always visible in Overview)

- Jobs Analyzed — total count across filtered companies
- Average Match — mean overall score
- Top Picks — count of jobs with score >= 75
- Near Misses — count of close-but-not-quite jobs

### Feedback insights (from existing kanban data)

- Rejection pattern summary — aggregated from `kanban-store.getFeedbackSummary()`
- Trend nudge — surfaces dominant rejection reasons with actionable suggestion
- No new data capture — computed from existing kanban feedback

## Navigation & Wiring

### NavRail

- New "Dashboard" item, positioned first (above Companies)
- After pipeline run completes, auto-navigate to Dashboard
- Results view stays in nav for the raw ranked list

### State changes (state.ts)

- `dashboardTab: 'overview' | 'triage'`
- `dashboardFilter: { companyIds: string[] }`
- `detailPanelJobIndex: number | null`
- `triageProgress: { triaged: number, total: number }`

### Data flow

- Dashboard loads all ranked jobs across runs via new IPC call `api.results.getAllJobs(companyIds?)`
- Deduplicates by job ID (keeps latest score)
- Near-miss rollup computed in renderer from filtered job list
- Feedback insights via new IPC call `api.kanban.feedbackSummary(companyIds?)`
- Triage actions use existing `api.kanban.move()`

### Prompt changes

- `skill-matcher` prompt updated to return matchedSkills, missingSkills, matchPercent, gapSeverity
- `JobAnalysis` type extended with optional gap fields (only for skill variant)

## New Components

| Component | Purpose |
|-----------|---------|
| `DashboardView.tsx` | Top-level view with tabs and filter bar |
| `JobCard.tsx` | Shared progressive-disclosure card |
| `DetailPanel.tsx` | Slide-out right panel for full job detail |
| `NearMissGroup.tsx` | Expandable "Learn X -> N jobs" rows |
| `QuickStats.tsx` | Stats bar component |
| `FeedbackInsights.tsx` | Rejection pattern display |

## What's NOT Changing

- No new database tables — gap data lives in existing `analyses_json` column
- Results view stays as-is for raw ranked list access
- Kanban view stays as-is — triage actions feed into it
- Existing ScoreBar, KanbanCard components reused where possible
