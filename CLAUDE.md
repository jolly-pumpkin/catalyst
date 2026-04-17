# Catalyst

Job seeker pipeline POC built on Rhodium. Demonstrates capability-contract composition for a mixed REST + LLM pipeline.

## Runtime

- **Bun** — use `bun` for everything (run, test, install). No Node, no npm.
- **Bun APIs** — use `bun:sqlite`, `Bun.file`, `Bun.$` where applicable. No `better-sqlite3`, no `node:fs` readFile/writeFile, no `execa`.
- Bun auto-loads `.env` — no dotenv.

## Architecture

Rhodium capability-contract model. Plugins provide/consume capabilities via a broker. No plugin imports another plugin.

- **rhodium-core** — broker, plugin lifecycle, event bus
- **rhodium-capabilities** — `defineCapability` typed contracts
- **rhodium-pipeline-runner** — `runPipeline(spec, input)` drives stages, fanout/reduce, iteration
- **rhodium-testing** — `createTestBroker()` for isolated plugin tests

All rhodium packages are linked from `../rhodium/packages/*` via `file:` deps.

## Project Structure

```
src/
  index.ts              # broker setup, user selection flow, pipeline execution
  context.ts            # CatalystContext — per-user DB paths, docs folder
  capabilities.ts       # defineCapability calls for all contracts
  types.ts              # CandidateProfile, RawJob, NormalizedJob, JobAnalysis, RankedJob, kanban types, etc.
  spec.ts               # jobSeekerSpec: PipelineSpec
  input.ts              # config loading, resume file parsing
  llm-parse.ts          # LLM JSON response parser
  plugins/
    user-manager.ts     # multi-user: user CRUD, user-index.db, data dir isolation
    ollama-provider.ts  # wraps localhost:11434, provides llm.generate
    profile-parser.ts   # LLM: resume → CandidateProfile
    catalog-db.ts       # shared SQLite for company_sources + indexed_jobs
    ats-detector.ts     # probes ATS APIs (Greenhouse, Lever, Ashby, Workable)
    company-store.ts    # CRUD for watched companies
    job-index-store.ts  # SQLite storage for indexed jobs
    job-indexer.ts       # background crawler, fetches ATS APIs
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
  tui/                  # ink (React for CLIs) views
    App.tsx             # main router — user selection → input → pipeline → results
    state.ts            # TUI reducer + action types
    UserSelectionView.tsx   # multi-user: pick/create user on startup
    InputView.tsx           # resume file picker
    ResumeManagerView.tsx   # view current resume + switch
    CompaniesView.tsx       # add/list/manage career pages, run pipeline, open kanban
    KanbanView.tsx          # 5-column kanban board per company with feedback
    PipelineView.tsx        # stage execution progress
    ResultsView.tsx         # ranked jobs with navigation
    JobDetailView.tsx       # job detail inspector
    ProfileView.tsx         # candidate profile display
    HistoryView.tsx         # run history browser
    components.tsx          # reusable UI components (StageRow, ScoreBar, etc.)
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
Jobs land in "New" when a pipeline run completes. Moving to Rejected or Not Applying captures feedback
(tags like wrong-level, bad-location, low-pay + optional free-text notes).
Feedback is fed back into the reflection agent's prompt on subsequent pipeline runs.

## Key Patterns

- **Capability contracts** — every inter-plugin boundary is a `defineCapability<T>(name)` call in `capabilities.ts`
- **Fanout stages** — `jobs.fetch` and `jobs.analyze` resolve multiple providers in parallel via `Promise.allSettled`; `errorPolicy: 'skip'` means one provider failing doesn't crash the stage
- **Reflection loop** — pipeline iterates up to `maxIterations: 3`; `reflection-agent` refines search params or signals completion via `jobs.search-complete`
- **Plugin isolation** — plugins never import each other; they resolve capabilities from the broker at runtime via `ctx.resolve('capability.name')`
- **User context** — `setCatalystContext()` / `getCatalystContext()` propagates per-user DB paths to all plugins
- **Feedback loop** — kanban rejection feedback → reflection agent prompt → better search refinements

## LLM

Ollama on `localhost:11434`. Model configured via `OLLAMA_MODEL` env var (default: `gemma4`). All LLM plugins resolve `llm.generate` from the `ollama-provider` plugin.

## Testing

```bash
bun test
```

Use `createTestBroker()` from `rhodium-testing` to test plugins in isolation with mock capabilities.

## Running

```bash
bun run src/index.ts                    # TUI with user selection → input menu
bun run src/index.ts resume.txt         # run directly on a file
bun run src/index.ts --model gemma3:4b  # override model
bun run src/index.ts --user collin      # use specific user (for CLI subcommands)
```

Supports `.txt`, `.md`, `.pdf` (pdf-parse), `.docx` (mammoth).

### CLI Subcommands

```bash
bun run src/index.ts companies add <url>        # auto-detect ATS, add company
bun run src/index.ts companies list              # list all watched companies
bun run src/index.ts companies remove <id>       # remove a company
bun run src/index.ts companies enable|disable <id>
bun run src/index.ts index [company-id]          # index jobs from ATS APIs
bun run src/index.ts traces [show|llm] [id]      # inspect execution traces
```

### TUI Keyboard Shortcuts

- `q` / `Ctrl+C` — quit
- `n` — new run (select resume)
- `s` — resume manager
- `c` — companies view
- `p` — pipeline view
- `r` — results view
- `h` — history
- `u` — profile
- `Ctrl+U` — switch users
