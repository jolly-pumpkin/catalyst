# Catalyst

Job seeker pipeline POC built on Rhodium. Demonstrates capability-contract composition for a mixed REST + LLM pipeline. Electron desktop app.

## Runtime

- **Electron** — desktop app with Vite + React renderer
- **Node.js** (Electron main process) — `better-sqlite3` for SQLite, `node:fs` for file I/O
- **Bun** — still used for package management (`bun add`, `bun remove`) and running tests (`vitest`)
- Rhodium packages linked from `../rhodium/packages/*` via `file:` deps

## Architecture

Rhodium capability-contract model. Plugins provide/consume capabilities via a broker. No plugin imports another plugin.

**Process model:**
- **Main process** — Rhodium broker, all plugins, pipeline runner, background indexer
- **Renderer process** — React UI, communicates via IPC bridge (`window.catalyst`)
- **Preload** — `contextBridge` exposes typed API; renderer is sandboxed (no `nodeIntegration`)

Rhodium packages:
- **rhodium-core** — broker, plugin lifecycle, event bus
- **rhodium-capabilities** — `defineCapability` typed contracts
- **rhodium-pipeline-runner** — `runPipeline(spec, input)` drives stages, fanout/reduce, iteration
- **rhodium-testing** — `createTestBroker()` for isolated plugin tests

## Project Structure

```
electron/
  main.ts               # Electron entry: window, broker setup, IPC registration
  preload.ts            # contextBridge → typed window.catalyst API
  events.ts             # broker events → renderer push via webContents.send
  scheduler.ts          # background index timer + native notifications
  ipc/
    index.ts            # aggregates all IPC handler registrations
    users.ts            # user CRUD, broker teardown/rebuild on switch
    pipeline.ts         # pipeline execution, results save, URL opening
    companies.ts        # company CRUD + indexer triggers
    kanban.ts           # kanban column queries + job movement
    results.ts          # run listing, detail, job queries
    docs.ts             # resume file listing/reading + settings
src/
  platform.ts           # Node compatibility: openDatabase, readFileText, etc.
  context.ts            # CatalystContext — per-user DB paths, docs folder
  capabilities.ts       # defineCapability calls for all contracts
  types.ts              # CandidateProfile, RawJob, NormalizedJob, JobAnalysis, RankedJob, etc.
  spec.ts               # jobSeekerSpec: PipelineSpec
  input.ts              # config loading, resume file parsing
  llm-parse.ts          # LLM JSON response parser
  shared/
    ipc-channels.ts     # IPC channel name constants
    window.d.ts         # window.catalyst type declaration
  plugins/
    user-manager.ts     # multi-user: user CRUD, user-index.db, data dir isolation
    ollama-provider.ts  # wraps localhost:11434, provides llm.generate
    profile-parser.ts   # LLM: resume → CandidateProfile
    catalog-db.ts       # shared SQLite for company_sources + indexed_jobs
    ats-detector.ts     # probes ATS APIs (Greenhouse, Lever, Ashby, Workable)
    company-store.ts    # CRUD for watched companies
    job-index-store.ts  # SQLite storage for indexed jobs
    job-indexer.ts      # background crawler, fetches ATS APIs
    index-fetcher.ts    # reads local index → jobs.fetch (priority 90)
    remotive-fetcher.ts # real Remotive API → jobs.fetch (priority 60)
    job-normalizer.ts   # LLM: dedup/standardize jobs
    skill-matcher.ts    # LLM: provides jobs.analyze (variant: skill)
    culture-fit-analyzer.ts
    salary-estimator.ts
    synthesizer.ts      # LLM: merge analyses → ranked list
    reflection-agent.ts # LLM: provides jobs.reflect + jobs.search-complete
    results-store.ts    # SQLite: pipeline runs + ranked results
    trace-store.ts      # SQLite: execution traces + LLM call logs
    kanban-store.ts     # SQLite: per-company job boards + rejection feedback
  prompts/              # text prompt templates per LLM plugin
  renderer/
    main.tsx            # React root mount
    App.tsx             # layout shell: Toolbar + NavRail + content + StatusBar
    api.ts              # React context wrapping window.catalyst
    state.ts            # AppState/AppAction/appReducer (useReducer pattern)
    views/
      Companies.tsx     # company table with add/remove/toggle/index
      Kanban.tsx        # 5-column drag-and-drop kanban board
      Pipeline.tsx      # stage execution progress
      Results.tsx       # ranked jobs with scores
      JobDetail.tsx     # job detail panel
      Profile.tsx       # candidate profile display
      History.tsx       # run history browser
      ResumeManager.tsx # resume file management
      Settings.tsx      # app configuration
    components/
      NavRail.tsx       # vertical navigation sidebar
      Toolbar.tsx       # top bar with user switcher
      StatusBar.tsx     # bottom status bar
      ScoreBar.tsx      # visual score bar (0-100)
      StageRow.tsx      # pipeline stage with providers
      KanbanCard.tsx    # draggable kanban job card
    styles/
      global.css        # CSS reset + theme variables
      App.module.css    # layout grid
      *.module.css      # per-component CSS modules
  fixtures/             # mock data (resume-sample.txt)
```

## Multi-User Data Model

Each user gets isolated data at `~/.catalyst/users/<name>/`:
- `catalyst.db` — company sources + indexed jobs
- `results.db` — pipeline runs + ranked results
- `traces.db` — execution traces
- `docs/` — user's resume files

Global index at `~/.catalyst/users-index.db` maps usernames to data dirs.
Legacy data at `~/.catalyst/` is auto-migrated to a "default" user on first run.

## Kanban Flow

Each company gets a 5-column kanban board: New → Looking At → Applying → Rejected / Not Applying.
Jobs land in "New" when a pipeline run completes. Drag-and-drop or keyboard shortcuts to move.
Moving to Rejected or Not Applying captures feedback (tags + optional notes).
Feedback is fed back into the reflection agent's prompt on subsequent pipeline runs.

## Key Patterns

- **Capability contracts** — every inter-plugin boundary is a `defineCapability<T>(name)` call in `capabilities.ts`
- **IPC bridge** — renderer calls `window.catalyst.X.method()` → `ipcMain.handle()` resolves capability from broker
- **Event push** — broker events → `webContents.send()` → renderer `ipcRenderer.on()` → dispatch to reducer
- **Fanout stages** — `jobs.fetch` and `jobs.analyze` resolve multiple providers in parallel; `errorPolicy: 'skip'`
- **Reflection loop** — pipeline iterates up to `maxIterations: 3`; reflection-agent refines or signals completion
- **Plugin isolation** — plugins never import each other; resolve from broker at runtime
- **Background indexing** — configurable interval, native notifications when new jobs found

## LLM

Ollama on `localhost:11434`. Model configured via `OLLAMA_MODEL` env var (default: `gemma4`). All LLM plugins resolve `llm.generate` from the `ollama-provider` plugin.

## Testing

```bash
bun test              # runs vitest
```

Use `createTestBroker()` from `rhodium-testing` to test plugins in isolation with mock capabilities.

## Running

```bash
npm start             # electron-forge start (dev mode with HMR)
npm run build         # electron-forge make (production build)
npm run package       # electron-forge package
```

## Platform Abstraction

Plugins use `src/platform.ts` for database and file I/O:
- `openDatabase(path)` — wraps `better-sqlite3`
- `readFileText(path)`, `readFileBuffer(path)`, `writeFileText(path, content)`, `fileExists(path)` — wrap `node:fs/promises`

URL opening uses `shell.openExternal()` from Electron (in `electron/ipc/pipeline.ts`).
