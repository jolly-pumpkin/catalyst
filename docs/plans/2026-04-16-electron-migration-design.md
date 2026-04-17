# Electron Migration Design

Replace the Ink TUI with an Electron desktop app. Motivated by richer UI capabilities and persistent background job indexing with native notifications.

## Decision Summary

- **Framework:** Electron + Vite + React + plain CSS modules
- **Approach:** Broker runs in Electron main process under Node.js; renderer is a Vite React app communicating via IPC
- **Bun swap:** Catalyst plugins swap `bun:sqlite` → `better-sqlite3`, `Bun.file` → `node:fs/promises`, `Bun.$` → `node:child_process`. Rhodium stays Bun — its packages get bundled by Vite.
- **CLI:** Replaced entirely by Electron app. No dual interface.

## Process Architecture

```
Electron Main Process (Node.js)
├── Rhodium Broker (all plugins, pipeline runner, job indexer)
├── App Shell
│   ├── Index scheduler (setInterval → broker.resolve('indexer.run'))
│   ├── Notification bridge (broker events → Electron Notification API)
│   └── IPC bridge (capability methods → ipcMain.handle())
└── contextBridge
    └── Renderer Process (Vite + React + CSS Modules)
```

- Broker + all plugins live in main process
- IPC bridge: one `ipcMain.handle()` per capability method
- Preload script exposes typed `window.catalyst` API; renderer stays sandboxed
- Broker events push to renderer via `webContents.send()`

## IPC Channels

### Renderer → Main (invoke)

| Channel | Maps to |
|---|---|
| `users:list` | `userManager.list()` |
| `users:create` | `userManager.create(name)` |
| `users:select` | `userManager.setCurrentId(id)` + rebuild broker |
| `pipeline:run` | `runner.run(spec, input)` |
| `pipeline:run-company` | `runner.run(spec, input, { companyId })` |
| `companies:list` | `companyStore.list()` |
| `companies:add` | `companyStore.add(url)` |
| `companies:remove` | `companyStore.remove(id)` |
| `companies:toggle` | `companyStore.setEnabled(id, bool)` |
| `index:run` | `indexer.indexNow()` |
| `index:company` | `indexer.indexCompany(id)` |
| `kanban:columns` | `kanbanStore.getColumnJobs(companyId)` |
| `kanban:move` | `kanbanStore.moveJob(jobId, companyId, column, feedback?)` |
| `results:list-runs` | `resultsQuery.listRuns()` |
| `results:get-run` | `resultsQuery.getRunDetail(id)` |
| `results:get-jobs` | `resultsQuery.getJobs(runId)` |
| `docs:list` | list files in user docs dir |
| `docs:read` | `readResume(path)` |
| `settings:get` | get scheduler interval, model, etc. |
| `settings:set` | update settings |

### Main → Renderer (push)

| Channel | Payload |
|---|---|
| `pipeline:stage-update` | stage progress |
| `pipeline:provider-update` | provider status |
| `pipeline:enrichment` | profile, normalized jobs, analyses |
| `pipeline:done` | final results |
| `pipeline:error` | error |
| `index:new-jobs` | new jobs found |

## Node Compatibility Swaps

| Bun API | Node Replacement | Where |
|---|---|---|
| `bun:sqlite` | `better-sqlite3` | All `*-store.ts` plugins, `user-manager.ts` |
| `Bun.file()` | `node:fs/promises` readFile | `input.ts`, resume reading |
| `Bun.$` | `node:child_process` / `open` package | URL opening |
| Bun auto `.env` | Electron env or `dotenv` | Entry point |

Rhodium packages are NOT modified. They stay on Bun and get bundled by Vite.

## UI Layout

```
┌──────────────────────────────────────────────┐
│  Toolbar: user switcher, new run, settings   │
├────────┬─────────────────────────────────────┤
│        │                                     │
│  Nav   │  Main content area                  │
│  rail  │  (swaps based on active view)       │
│        │                                     │
├────────┴─────────────────────────────────────┤
│  Status bar: indexer status, last run, model │
└──────────────────────────────────────────────┘
```

- Left nav rail replaces keyboard-only navigation (keyboard shortcuts preserved)
- Status bar shows background indexer state and Ollama connection

## View Mapping

| TUI View | Electron View | Upgrades |
|---|---|---|
| UserSelectionView | Toolbar dropdown/modal | No longer a full-screen view |
| InputView | Resume upload area | Drag-and-drop, native file dialog |
| CompaniesView | Companies panel | Table with sort/filter, inline toggles |
| KanbanView | Kanban board | Drag-and-drop cards + keyboard shortcuts, rich card rendering |
| PipelineView | Pipeline progress panel | Animated stages, expandable providers |
| ResultsView | Results table | Sortable columns, score bars, click to expand |
| JobDetailView | Job detail panel | Side panel/modal, full description, clickable URLs |
| ProfileView | Profile panel | Formatted display |
| HistoryView | History panel | Table with search/filter |
| ResumeManagerView | Resume manager | File list with preview |

## Kanban Board

5 columns: New, Looking At, Applying, Rejected, Not Applying.

- Drag-and-drop cards between columns (Trello-style)
- Keyboard shortcuts preserved (arrow keys, m/M to move, r to reject, x to skip)
- Rich card rendering: job title, company, scores, tags, color coding by score tier
- Moving to Rejected/Not Applying triggers feedback modal (tags + optional notes)

## Background Indexing & Notifications

- On app start (after user selected), scheduler runs `indexer.run()` on configurable interval (default: 1 hour)
- All enabled companies indexed in parallel via `Promise.allSettled`
- After each run, diff job counts — if new jobs found, fire `Electron.Notification` ("8 new jobs across 3 companies")
- Push `index:new-jobs` to renderer for live UI update
- Manual index trigger available from companies panel
- Scheduler pauses if no companies are enabled

## State Management

Same `useReducer` + dispatch pattern from the TUI. React context wraps `window.catalyst` API so components call `api.companies.list()` instead of `window.catalyst.companies.list()`.

IPC event listeners in the renderer dispatch actions to the reducer, same as `wireBrokerEvents()` does today.

## Project Structure

```
catalyst/
  electron/
    main.ts             # Electron entry: window, broker setup, IPC bridge
    preload.ts           # contextBridge → window.catalyst typed API
    scheduler.ts         # background index timer + notification dispatch
    platform.ts          # Node replacements: better-sqlite3, fs, child_process
    ipc/
      users.ts
      pipeline.ts
      companies.ts
      kanban.ts
      results.ts
      docs.ts
  src/
    plugins/             # existing plugins (bun→node swaps only)
    capabilities.ts      # unchanged
    context.ts           # unchanged
    types.ts             # unchanged
    spec.ts              # unchanged
    llm-parse.ts         # unchanged
    renderer/
      App.tsx            # main layout
      state.ts           # reducer (adapted for IPC events)
      api.ts             # React context wrapping window.catalyst
      views/
        Companies.tsx
        Kanban.tsx
        Pipeline.tsx
        Results.tsx
        JobDetail.tsx
        Profile.tsx
        History.tsx
        ResumeManager.tsx
        Settings.tsx
      components/
        NavRail.tsx
        Toolbar.tsx
        StatusBar.tsx
        ScoreBar.tsx
        StageRow.tsx
        KanbanCard.tsx
      styles/
        *.module.css
  forge.config.ts
  vite.main.config.ts
  vite.renderer.config.ts
  vite.preload.config.ts
```

**Deleted:** `src/tui/`, `ink`/`ink-text-input`/`chalk` deps, CLI entry point in `src/index.ts`.

**Unchanged:** All plugins, capabilities, types, spec, context, llm-parse, prompts, fixtures.
