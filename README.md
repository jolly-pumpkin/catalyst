# Catalyst

Personal job indexer and analysis pipeline built on [Rhodium](../rhodium/) — a capability-contract composition framework. An Electron desktop app where you add career pages for companies you're interested in, Catalyst indexes their open roles on a schedule, then runs LLM analysis passes (skill matching, culture fit, salary estimation) against your resume to produce a ranked list with a per-company kanban board. No plugin knows about any other plugin.

## Why

This project answers: **does Rhodium's capability-contract model produce a cleaner, more extensible system than LangGraph/CrewAI/Swarm for a mixed REST + LLM pipeline?**

The architecture is the inverse of a hardcoded agent graph. Plugins provide and consume typed capabilities through a broker. The pipeline topology is derived at runtime from what's registered — add a new job source plugin and it automatically joins the fanout stage.

## How It Works

### 1. Add companies you care about

In the Companies view, paste a career page URL (e.g. `https://anthropic.com/careers`). Catalyst auto-detects the ATS (Greenhouse, Lever, Ashby, or Workable) and stores the company in a local SQLite database.

### 2. Jobs are indexed automatically

A background indexer pulls open roles from each company's ATS API on a configurable interval (default: every 6 hours). Jobs are stored locally, deduped, and marked inactive when they disappear from the board. Native notifications fire when new jobs are found.

### 3. Run the analysis pipeline

Select a resume from the Resume Manager and run the pipeline. It reads from your local job index (plus supplementary live sources like Remotive), then runs through LLM analysis to produce ranked results.

### 4. Triage with kanban

Each company gets a 5-column kanban board: **New → Looking At → Applying → Rejected / Not Applying**. Jobs land in "New" when a pipeline run completes. Drag-and-drop to move cards. Moving to Rejected or Not Applying captures feedback (tags + optional notes) that feeds back into the reflection agent on subsequent runs.

## Pipeline

```
resume
    │
    ▼
┌─────────────┐
│ parse-profile│  LLM: extract structured candidate profile
└──────┬──────┘
       ▼
┌─────────────┐
│  fetch-jobs  │  fanout → local index + Remotive (live API)
└──────┬──────┘
       ▼
┌──────────────┐
│normalize-jobs │  LLM: deduplicate & standardize across sources
└──────┬───────┘
       ▼
┌──────────────┐
│ analyze-jobs  │  fanout → skill-matcher + culture-fit + salary-estimator (3 LLM passes)
└──────┬───────┘
       ▼
┌──────────────┐
│  synthesize   │  LLM: merge scores → ranked job list with summaries
└──────┬───────┘
       ▼
┌──────────────┐
│   reflect     │  LLM: evaluate quality, refine search or stop
└──────┬───────┘
       │
       └──→ loop up to 3 iterations (stops early if confidence >= 0.8)
```

## Prerequisites

- [Node.js](https://nodejs.org/) (for Electron)
- [Bun](https://bun.sh/) (package management and test runner)
- [Ollama](https://ollama.ai/) running locally on port 11434
- A model pulled in Ollama (default: `gemma4`)

```bash
ollama pull gemma4
```

Rhodium packages must be available at `../rhodium/packages/*` (linked via `file:` deps in package.json).

## Setup

```bash
bun install
```

## Running

```bash
npm start             # electron-forge start (dev mode with HMR)
npm run build         # electron-forge make (production build)
npm run package       # electron-forge package
```

Override the LLM model with `OLLAMA_MODEL` in `.env`.

## Testing

```bash
bun test              # runs vitest
```

Tests use `createTestBroker()` from `rhodium-testing` to test each plugin in isolation with mock capabilities.

## App Views

- **Companies** — add/remove career page URLs, toggle indexing, trigger manual index
- **Kanban** — per-company 5-column drag-and-drop board for triaging jobs
- **Pipeline** — stage execution progress during a run
- **Results** — ranked jobs with composite scores
- **Job Detail** — full job detail with per-analyzer breakdowns
- **Profile** — parsed candidate profile from your resume
- **History** — browse past pipeline runs
- **Resume Manager** — manage resume files
- **Settings** — app configuration

## Project Structure

```
electron/
  main.ts               # Electron entry: window, broker setup, IPC registration
  preload.ts            # contextBridge → typed window.catalyst API
  events.ts             # broker events → renderer push via webContents.send
  scheduler.ts          # background index timer + native notifications
  ipc/                  # IPC handler modules (users, pipeline, companies, kanban, etc.)
src/
  platform.ts           # Node compatibility: openDatabase, readFileText, etc.
  context.ts            # CatalystContext — per-user DB paths, docs folder
  capabilities.ts       # defineCapability calls for all contracts
  types.ts              # shared interfaces
  spec.ts               # pipeline spec (6 stages + reflection loop)
  input.ts              # config loading, resume file parsing
  llm-parse.ts          # LLM JSON response parser
  shared/
    ipc-channels.ts     # IPC channel name constants
    window.d.ts         # window.catalyst type declaration
  plugins/              # all Rhodium plugins (see CLAUDE.md for full listing)
  prompts/              # prompt templates for each LLM plugin
  renderer/
    main.tsx            # React root mount
    App.tsx             # layout shell: Toolbar + NavRail + content + StatusBar
    api.ts              # React context wrapping window.catalyst
    state.ts            # AppState/AppAction/appReducer (useReducer pattern)
    views/              # Companies, Kanban, Pipeline, Results, etc.
    components/         # NavRail, Toolbar, StatusBar, ScoreBar, KanbanCard, etc.
    styles/             # CSS modules + global theme
  fixtures/             # sample data
```

## Architecture

**Process model:**
- **Main process** — Rhodium broker, all plugins, pipeline runner, background indexer
- **Renderer process** — React UI, communicates via IPC bridge (`window.catalyst`)
- **Preload** — `contextBridge` exposes a typed API; renderer is sandboxed (no `nodeIntegration`)

**Multi-user:** each user gets isolated data at `~/.catalyst/users/<name>/` with separate databases for catalog, results, and traces, plus a personal `docs/` folder for resumes. A global index at `~/.catalyst/users-index.db` maps usernames to data dirs.

## Key Patterns

**Capability contracts** — every inter-plugin boundary is a typed `defineCapability<T>(name)` call. Pipeline stage capabilities are functions; non-pipeline capabilities (like `llm.generate`) are objects.

**IPC bridge** — renderer calls `window.catalyst.X.method()` → `ipcMain.handle()` resolves the capability from the broker.

**Event push** — broker events → `webContents.send()` → renderer `ipcRenderer.on()` → dispatch to React reducer.

**Fanout + error isolation** — `jobs.fetch` and `jobs.analyze` resolve multiple providers in parallel. `errorPolicy: 'skip'` means one provider failing doesn't crash the stage.

**Plugin isolation** — plugins never import each other. They resolve capabilities from the broker at runtime.

**Reflection loop** — the pipeline iterates up to 3 times. The reflection agent evaluates result quality and either signals completion (confidence >= 0.8) or suggests search refinements. Kanban rejection feedback is included in the prompt.

**Derived topology** — register a new fetcher plugin that provides `jobs.fetch` and it automatically joins the fanout. No wiring code changes needed.

## License

Private — not published.
