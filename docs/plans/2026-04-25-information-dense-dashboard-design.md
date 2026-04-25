# Information-Dense Dashboard + UX Polish

**Date:** 2026-04-25
**Status:** Approved

## Problem

The Dashboard is the primary workflow hub, but too much information is hidden behind clicks. Job cards show minimal detail at a glance, there's no way to search or filter within results, the detail panel is Dashboard-only, and there's no cross-company pipeline health view. Users must navigate between multiple views to piece together their job search status.

## Design

### 1. Richer Job Cards

Update JobCard across all views (Dashboard, Results, Kanban) to show more information without expanding.

**Always visible (collapsed state):**
- Title + Company + Location + Remote indicator
- Overall score bar (existing) + 3 mini score pills (Skill / Culture / Salary as colored numbers)
- Top 2-3 matched skills (green tags) + top 1-2 missing skills (orange tags)
- Salary estimate range (if available)
- Kanban status badge (New / Looking At / Applying)
- Source badge (existing)

**Expanded state (on click):**
- Full signal list + red flags + reasoning text
- Action buttons (Looking At, Applying, Reject, Skip)
- Description snippet (first ~150 chars of job description)

**Visual hierarchy:** Title largest. Score + skill tags form a scannable middle band. Salary + status are small metadata at the bottom.

### 2. Pipeline Health Stats Bar

New stats bar at the top of Dashboard, above the existing QuickStats row.

**Contents:**
- **Jobs by stage:** Mini horizontal stacked bar showing New (blue) / Looking At (yellow) / Applying (green) / Rejected (gray) counts across all companies
- **Score distribution:** Sparkline or mini histogram showing the spread of scores
- **This week's activity:** "Reviewed 14 jobs, applied to 3, rejected 8"
- **Top rejection reason:** "Most common: 'low salary' (5x)"

QuickStats (Total Jobs, Avg Score, Top Picks, Near Misses) stays as a secondary row below.

**Data sources:** Kanban store (stage counts, rejection reasons), results store (scores), computed client-side from already-loaded data.

### 3. Dashboard Filters

Horizontal filter bar below the stats bars, above job cards.

**Filters:**
- **Company multi-select** (existing, enhanced)
- **Score range** — min/max number inputs (e.g., 60-100)
- **Title keyword search** — text input, filters cards as you type
- **Kanban status** — checkboxes: New / Looking At / Applying (show/hide already-triaged jobs)
- **Sort by** — dropdown: Score (default), Company, Salary estimate, Date added

All filters are client-side against already-loaded job data. No backend changes needed. Filters persist within the session but reset on view change.

### 4. Persistent Detail Panel

Lift the existing DetailPanel from Dashboard-specific to a layout-level concern available from any view that shows jobs.

**Scope:** Dashboard, Results, History (viewing a run), Kanban.

**Enhancements:**
- Actions (Looking At / Applying / Reject / Skip) pinned at the top of the panel — no scrolling to find them
- Current kanban status shown prominently
- Matched/missing skills section with match percentage
- "Open in Browser" button at the top

**Implementation:** Move DetailPanel rendering from Dashboard into Shell (App.tsx). Add a `detailJobId` to AppState at the top level. Any view dispatches `detail:open` to populate the panel.

### 5. Post-Run AI Summary

After pipeline scoring completes, generate a natural-language summary of the run.

**Summary contents:**
- How many new jobs found, how many are strong matches (75+)
- Which companies had the most results
- Notable patterns (skill gaps, salary trends)
- Comparison to previous run (job count delta, score delta)

**Implementation:** New pipeline summary stage or extension of the synthesizer plugin. Single LLM call with all ranked results as context. Result stored in results DB alongside the run.

**Display:** Collapsible card at the top of Dashboard/Results, shown after each new run. Dismissible.

### 6. Activity Tab in Dashboard

Third tab alongside Overview and Triage.

**Contents:** Chronological list of user actions:
- Job moves (e.g., "Moved [Title] at [Company] to Applying - 2h ago")
- Rejections with reasons (e.g., "Rejected [Title] - reason: low salary, no remote - yesterday")
- Pipeline run completions (e.g., "Pipeline run completed: 18 jobs scored - 2 days ago")

**Features:**
- Filterable by action type (moved, rejected, pipeline run)
- Each entry links to the job (opens detail panel)

**Data sources:** Kanban store (moves + feedback), results store (pipeline runs). Requires a new query that unions these sources and sorts by timestamp. May need a `moved_at` timestamp column in kanban store if not already present.

## Non-Goals

- No changes to Pipeline execution view, Companies view, Profile editor, or Settings
- No new navigation patterns (NavRail stays the same)
- No undo/cancel functionality (valuable but separate effort)
- No command palette or universal search (separate effort)
