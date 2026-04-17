# Catalyst

Personal job indexer and analysis pipeline built on [Rhodium](../rhodium/) — a capability-contract composition framework. Add career pages for companies you're interested in, Catalyst indexes their open roles on a schedule, then runs LLM analysis passes (skill matching, culture fit, salary estimation) against your resume to produce a ranked list. No plugin knows about any other plugin.

## Why

This project answers: **does Rhodium's capability-contract model produce a cleaner, more extensible system than LangGraph/CrewAI/Swarm for a mixed REST + LLM pipeline?**

The architecture is the inverse of a hardcoded agent graph. Plugins provide and consume typed capabilities through a broker. The pipeline topology is derived at runtime from what's registered — add a new job source plugin and it automatically joins the fanout stage.

## How It Works

### 1. Add companies you care about

```bash
bun run src/index.ts companies add https://anthropic.com/careers
bun run src/index.ts companies add https://stripe.com/jobs
```

Catalyst auto-detects the ATS (Greenhouse, Lever, Ashby, or Workable) and stores the company in a local SQLite database.

### 2. Jobs are indexed automatically

A background indexer pulls open roles from each company's ATS API on a configurable interval (default: every 6 hours). Jobs are stored locally, deduped, and marked inactive when they disappear from the board.

```bash
# Or trigger a manual index
bun run src/index.ts index
```

### 3. Run the analysis pipeline

```bash
bun run src/index.ts resume.txt
```

The pipeline reads from your local job index (plus supplementary live sources like Remotive), then runs through LLM analysis to produce ranked results.

## Pipeline

```
resume.txt
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

- [Bun](https://bun.sh/) (v1.3+)
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

## Usage

### Company management

```bash
# Add a company (auto-detects ATS)
bun run src/index.ts companies add https://anthropic.com/careers

# List watched companies
bun run src/index.ts companies list

# Remove a company (also deletes its indexed jobs)
bun run src/index.ts companies remove <id>

# Enable/disable without removing
bun run src/index.ts companies enable <id>
bun run src/index.ts companies disable <id>
```

Supported ATS platforms: **Greenhouse**, **Lever**, **Ashby**, **Workable**. Just provide any career page URL and Catalyst will probe the APIs to detect which one the company uses.

### Indexing

```bash
# Index all enabled companies now
bun run src/index.ts index

# Index a single company
bun run src/index.ts index <company-id>
```

The background indexer also runs automatically on a configurable interval (default: 6 hours) while the TUI is open.

### Running the pipeline

```bash
# TUI with interactive file picker
bun run src/index.ts

# Run directly on a resume file
bun run src/index.ts resume.txt

# Override the LLM model
bun run src/index.ts --model gemma3:4b
```

Supported resume formats: `.txt`, `.md`, `.pdf`, `.docx`

### TUI views

While the TUI is running, press:
- `p` — pipeline progress
- `r` — results
- `h` — run history
- `c` — company management (add, remove, toggle, index)
- `q` — quit

## Testing

```bash
bun test
```

Tests use `createTestBroker()` from `rhodium-testing` to test each plugin in isolation with mock capabilities. The integration test runs the full pipeline with a mock LLM provider and a seeded in-memory job index.

## Project Structure

```
src/
  index.ts                  # broker wiring, CLI subcommands, pipeline execution
  capabilities.ts           # defineCapability() typed contracts
  types.ts                  # shared interfaces
  spec.ts                   # pipeline spec (6 stages + reflection loop)
  llm-parse.ts              # shared LLM JSON response parser
  input.ts                  # config loading, resume file reading
  plugins/
    ollama-provider.ts      # Ollama HTTP wrapper → llm.generate
    profile-parser.ts       # LLM: resume text → CandidateProfile
    catalog-db.ts           # shared SQLite database for indexer
    ats-detector.ts         # probes ATS APIs to detect company platform → ats.detect
    company-store.ts        # CRUD for watched companies → company.store
    job-index-store.ts      # SQLite storage for indexed jobs → job.index
    job-indexer.ts           # background crawler, fetches ATS APIs → indexer.run
    index-fetcher.ts        # reads from local index → jobs.fetch (priority 90)
    remotive-fetcher.ts     # live Remotive API → jobs.fetch (priority 60)
    job-normalizer.ts       # LLM: dedup/standardize → jobs.normalize
    skill-matcher.ts        # LLM: technical skill scoring → jobs.analyze (priority 100)
    culture-fit-analyzer.ts # LLM: culture/values scoring → jobs.analyze (priority 90)
    salary-estimator.ts     # LLM: compensation fit scoring → jobs.analyze (priority 80)
    synthesizer.ts          # LLM: merge analyses → ranked list → jobs.synthesize
    reflection-agent.ts     # LLM: evaluate + refine → jobs.reflect + jobs.search-complete
    results-store.ts        # SQLite persistence → results.store + results.query
  prompts/                  # prompt templates for each LLM plugin
  tui/                      # ink (React for CLIs) views
  fixtures/                 # sample data
```

## Key Patterns

**Personal indexer** — users add career page URLs, the system auto-detects the ATS, indexes jobs on a schedule, and stores them locally in SQLite. The pipeline reads from this local index rather than hitting APIs live every run.

**ATS auto-detection** — given any career page URL, probes Greenhouse, Lever, Ashby, and Workable APIs in parallel to find the right one. No manual configuration needed.

**Capability contracts** — every inter-plugin boundary is a typed `defineCapability<T>(name)` call. Pipeline stage capabilities are functions; non-pipeline capabilities (like `llm.generate`) are objects.

**Fanout + error isolation** — `jobs.fetch` and `jobs.analyze` resolve multiple providers in parallel. `errorPolicy: 'skip'` means one provider failing doesn't crash the stage.

**Plugin isolation** — plugins never import each other. They resolve capabilities from the broker at runtime via `ctx.resolve('capability.name')`.

**Reflection loop** — the pipeline iterates up to 3 times. The reflection agent evaluates result quality and either signals completion (confidence >= 0.8) or suggests search refinements.

**Derived topology** — register a new fetcher plugin that provides `jobs.fetch` and it automatically joins the fanout. No wiring code changes needed.

## Configuration

Config is stored at `~/.catalyst/config.json` (auto-created on first run):

```json
{
  "docsFolder": "~/.catalyst/docs",
  "ollamaModel": "gemma4",
  "ollamaUrl": "http://localhost:11434",
  "indexIntervalHours": 6
}
```

Override the model per-run with `--model` or set `OLLAMA_MODEL` in `.env`.

## Data Storage

- `~/.catalyst/config.json` — user configuration
- `~/.catalyst/catalyst.db` — company sources and indexed jobs
- `~/.catalyst/results.db` — pipeline run history and ranked results
- `~/.catalyst/docs/` — default resume folder

## License

Private — not published.
