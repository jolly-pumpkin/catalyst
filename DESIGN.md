# Job Seeker Pipeline POC — Design Document

**Date:** 2026-04-14
**Status:** Approved
**Author:** Collin Neill

---

## What This Is

A proof-of-concept application built on Rhodium that demonstrates capability-contract composition for a real-world AI pipeline. A user submits a resume; the system fetches live job postings from multiple sources, runs parallel LLM analysis passes, synthesizes ranked results, and optionally refines the search via a reflection loop — all without any plugin knowing about any other plugin.

This POC exists to answer one question: **does Rhodium's capability-contract model produce a cleaner, more extensible system than LangGraph/CrewAI/Swarm for a mixed REST + LLM pipeline?**

---

## Background: Why This Domain

The user previously built a recruiter AI platform (Deep Sourcing System) using LangGraph. That system's own design documentation lists as negative consequences: *Complexity, Dependency Risk, State Synchronization, Debugging Difficulty* — all symptoms of a hardcoded graph where every node knows about shared state.

Job seeker pipeline is the inverse framing of the same domain — and a direct architectural contrast.

---

## Framework Comparison Summary

Six parallel research agents evaluated Rhodium against LangGraph, CrewAI, OpenAI Swarm/Agents SDK, Claude Code Agents, AutoGen v0.4, Google ADK, Amazon Bedrock AgentCore, Mastra, Semantic Kernel, and Haystack.

### Where Rhodium Has Unique Structural Advantages

| Advantage | Why It Matters Here |
|---|---|
| **Derived topology** | Register a new job source plugin → it automatically joins the pipeline. No other framework does this. |
| **Typed multi-provider resolution** | Three job sources providing `jobs.fetch`; fanout resolves all of them. Priority decides ordering. |
| **Structural error boundaries** | LinkedIn fetcher fails → error is contained; Indeed and Remotive continue. Not opt-in, not LLM-reasoned. |
| **System-level composition events** | `plugin:activated`, `capability:provided` — components react to topology changes passively. |
| **TypeScript-native** | Only TS-native framework with capability-contract composition. Mastra is TS but reference-based. SK has no official TS SDK. |
| **Plugins don't know about each other** | True anonymous capability provision. The skill-matcher never imports the LinkedIn fetcher. |
| **3KB / zero deps** | Embeds anywhere. No LLM SDK contamination in the composition layer. |

### Where Rhodium Would Need Supplementation (Honest Assessment)

| Gap | This POC's Answer |
|---|---|
| **No LLM integration** | `ollama-provider` plugin — 30-line wrapper |
| **No observability/tracing** | Subscribe to `stage:*` and `provider:*` events in `cli-sink` |
| **No persistence/durability** | Out of scope for POC |
| **No streaming** | Out of scope for POC |
| **Ecosystem immaturity** | This POC is the ecosystem |

### The Critical Gap — Now Solved

Every research agent independently flagged the same issue: *"Rhodium wires plugins but doesn't execute pipelines."* The orchestration gap is closed by the `pipeline-runner` package already in this repo. `runPipeline(spec, input)` drives data through capability-resolved stages, handles fanout/reduce, enforces termination, and emits structured events.

---

## Architecture

### Pipeline Execution Model

The pipeline-runner owns execution. It resolves capabilities from the broker, drives data between stages, runs fanout stages in parallel via `Promise.allSettled`, and checks the stop condition after each iteration.

```
runner.run(jobSeekerSpec, { resumeText })
  → iteration 1:
      parse-profile   [single]  profile.parse
      fetch-jobs      [fanout]  jobs.fetch        ← 3 providers, parallel, skip-on-fail
      normalize-jobs  [single]  jobs.normalize
      analyze-jobs    [fanout]  jobs.analyze      ← 3 LLM agents, parallel, skip-on-fail
      synthesize      [single]  jobs.synthesize
      reflect         [single]  jobs.reflect
      check: jobs.search-complete → false → iterate
  → iteration 2:
      fetch-jobs runs with refined search params from reflect output
      ... same stages ...
      check: jobs.search-complete → true → stop
  → PipelineResult { stageOutputs, iteration: 2, durationMs, stopped: true }
```

### Pipeline Spec

```typescript
const jobSeekerSpec: PipelineSpec = {
  name: 'job-seeker',
  stages: [
    {
      id: 'parse-profile',
      capability: 'profile.parse',
      policy: 'single',
      errorPolicy: 'fail-fast',
      // input: { resumeText: string }
    },
    {
      id: 'fetch-jobs',
      capability: 'jobs.fetch',
      policy: 'fanout',
      errorPolicy: 'skip',           // LinkedIn dies → Indeed + Remotive continue
      reducer: { kind: 'concat' },
      inputFrom: ['parse-profile'],  // parsed profile informs search query
    },
    {
      id: 'normalize-jobs',
      capability: 'jobs.normalize',
      policy: 'single',
      errorPolicy: 'fail-fast',
      inputFrom: ['fetch-jobs'],
    },
    {
      id: 'analyze-jobs',
      capability: 'jobs.analyze',
      policy: 'fanout',
      errorPolicy: 'skip',           // one scorer fails → others continue
      reducer: { kind: 'concat' },
      inputFrom: ['normalize-jobs', 'parse-profile'],
    },
    {
      id: 'synthesize',
      capability: 'jobs.synthesize',
      policy: 'single',
      errorPolicy: 'fail-fast',
      inputFrom: ['analyze-jobs', 'parse-profile'],
    },
    {
      id: 'reflect',
      capability: 'jobs.reflect',
      policy: 'single',
      errorPolicy: 'fall-through',   // reflection fails → still output results
      inputFrom: ['synthesize', 'parse-profile'],
    },
  ],
  termination: {
    maxIterations: 3,                // hard ceiling — no event storms
    stopCondition: {
      capability: 'jobs.search-complete',
    },
  },
};
```

### Plugin Topology

```
[ollama-provider]                   provides: llm.generate
        │
        ├── [profile-parser LLM]    needs: llm.generate       provides: profile.parse
        ├── [job-normalizer LLM]    needs: llm.generate       provides: jobs.normalize
        ├── [skill-matcher LLM]     needs: llm.generate       provides: jobs.analyze (variant: skill)
        ├── [culture-fit LLM]       needs: llm.generate       provides: jobs.analyze (variant: culture)
        ├── [salary-estimator LLM]  needs: llm.generate       provides: jobs.analyze (variant: salary)
        ├── [synthesizer LLM]       needs: llm.generate       provides: jobs.synthesize
        └── [reflection-agent LLM]  needs: llm.generate       provides: jobs.reflect
                                                              provides: jobs.search-complete

[indeed-fetcher]    REST            provides: jobs.fetch (priority: 80)
[linkedin-fetcher]  REST            provides: jobs.fetch (priority: 100)
[remotive-fetcher]  REST (real API) provides: jobs.fetch (priority: 60)

[pipeline-runner]                   provides: pipeline-runner  (orchestrates execution)
[cli-sink]                          subscribes to pipeline:complete, stage:degraded
```

---

## Plugin Inventory

### Infrastructure

| Plugin | Key | Provides | Notes |
|--------|-----|----------|-------|
| `ollama-provider` | `ollama-provider` | `llm.generate` | Wraps `http://localhost:11434/api/generate`. All LLM plugins resolve this. Swap models here. |
| `pipeline-runner` | `pipeline-runner` | `pipeline-runner` | From `rhodium-pipeline-runner` package. |

### REST / Data Fetcher Plugins

| Plugin | Key | Provides | Priority | Notes |
|--------|-----|----------|----------|-------|
| `indeed-fetcher` | `indeed-fetcher` | `jobs.fetch` | 80 | Mock Indeed API — returns static fixture data |
| `linkedin-fetcher` | `linkedin-fetcher` | `jobs.fetch` | 100 | Mock LinkedIn API — intentionally flaky in demo mode |
| `remotive-fetcher` | `remotive-fetcher` | `jobs.fetch` | 60 | Real Remotive public API (no auth required) |

### LLM Agent Plugins (Ollama / Gemma 4)

| Plugin | Key | Needs | Provides | Role |
|--------|-----|-------|----------|------|
| `profile-parser` | `profile-parser` | `llm.generate` | `profile.parse` | Extracts skills, experience, titles, location, preferences from raw resume text |
| `job-normalizer` | `job-normalizer` | `llm.generate` | `jobs.normalize` | Deduplicates, cleans, standardizes job schema across sources |
| `skill-matcher` | `skill-matcher` | `llm.generate` | `jobs.analyze` (variant: `skill`) | Scores technical skill overlap; returns per-job score 0–100 + reasoning |
| `culture-fit-analyzer` | `culture-fit-analyzer` | `llm.generate` | `jobs.analyze` (variant: `culture`) | Scores team/values/culture alignment from JD signals |
| `salary-estimator` | `salary-estimator` | `llm.generate` | `jobs.analyze` (variant: `salary`) | Estimates comp fit; flags roles likely below or above candidate range |
| `synthesizer` | `synthesizer` | `llm.generate` | `jobs.synthesize` | Merges analysis variants; produces ranked list with natural language reasoning per job |
| `reflection-agent` | `reflection-agent` | `llm.generate` | `jobs.reflect` + `jobs.search-complete` | Evaluates ranking quality; returns refined search params OR signals completion |

### Sinks

| Plugin | Key | Notes |
|--------|-----|-------|
| `cli-sink` | `cli-sink` | Pretty-prints ranked results. Subscribes to `pipeline:complete`, `stage:degraded`, `provider:failed`. |

---

## Data Flow

### Type Contracts

```typescript
// Initial input
interface PipelineInput {
  resumeText: string;
}

// profile.parse output
interface CandidateProfile {
  name: string;
  skills: string[];
  yearsExperience: number;
  titles: string[];            // e.g. ["Senior Engineer", "Staff Engineer"]
  preferredLocations: string[];
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  salaryExpectation?: { min: number; max: number; currency: string };
}

// jobs.fetch output (per provider, concat-reduced)
interface RawJob {
  id: string;
  source: string;              // 'indeed' | 'linkedin' | 'remotive'
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedAt: string;
}

// jobs.normalize output
interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  skills: string[];            // extracted from description
  description: string;
  url: string;
  source: string;
}

// jobs.analyze output (per analyzer variant, concat-reduced)
interface JobAnalysis {
  jobId: string;
  variant: 'skill' | 'culture' | 'salary';
  score: number;               // 0–100
  reasoning: string;
  signals: string[];           // key positive/negative signals
}

// jobs.synthesize output
interface RankedJob {
  job: NormalizedJob;
  overallScore: number;
  scores: { skill: number; culture: number; salary: number };
  summary: string;             // 2–3 sentence natural language explanation
  redFlags: string[];
}

// jobs.reflect input → output
interface ReflectInput {
  synthesize: RankedJob[];
  'parse-profile': CandidateProfile;
}
interface ReflectOutput {
  searchRefinements?: {
    additionalKeywords?: string[];
    expandLocation?: boolean;
    relaxedRequirements?: string[];
  };
  rationale: string;
  confidence: number;          // 0–1; stop condition checks this
}

// jobs.search-complete — called by termination.stopCondition
// (ctx: { iteration: number; stageOutputs: Map<string, unknown> }) => boolean
```

---

## Capability Contracts (defineCapability)

```typescript
import { defineCapability } from 'rhodium/capabilities';

export const LLMGenerate = defineCapability<{
  generate(prompt: string, options?: { temperature?: number }): Promise<string>;
}>('llm.generate');

export const ProfileParse = defineCapability<{
  parse(input: PipelineInput): Promise<CandidateProfile>;
}>('profile.parse');

export const JobsFetch = defineCapability<{
  fetch(profile: CandidateProfile, refinements?: ReflectOutput['searchRefinements']): Promise<RawJob[]>;
}>('jobs.fetch');

export const JobsNormalize = defineCapability<{
  normalize(input: { 'fetch-jobs': RawJob[] }): Promise<NormalizedJob[]>;
}>('jobs.normalize');

export const JobsAnalyze = defineCapability<{
  analyze(input: { 'normalize-jobs': NormalizedJob[]; 'parse-profile': CandidateProfile }): Promise<JobAnalysis[]>;
}>('jobs.analyze');

export const JobsSynthesize = defineCapability<{
  synthesize(input: { 'analyze-jobs': JobAnalysis[]; 'parse-profile': CandidateProfile }): Promise<RankedJob[]>;
}>('jobs.synthesize');

export const JobsReflect = defineCapability<{
  reflect(input: ReflectInput): Promise<ReflectOutput>;
}>('jobs.reflect');

export const JobsSearchComplete = defineCapability<{
  shouldStop(ctx: { iteration: number; stageOutputs: Map<string, unknown> }): boolean;
}>('jobs.search-complete');
```

---

## Reflection Loop

The reflection loop runs inside the pipeline-runner's iteration model — not via event bus. This is cleaner than an event-driven loop because:

- Termination is enforced by `maxIterations: 3` regardless of what the reflection agent returns
- No possibility of event storms or runaway loops
- Stage outputs accumulate across iterations; `fetch-jobs` on iteration 2 receives `reflect` output from iteration 1 via the `inputFrom` composition

**Iteration 1:** Fetch with broad params → analyze → synthesize → reflect returns `{ confidence: 0.4, searchRefinements: { additionalKeywords: ['TypeScript', 'remote'] } }` → `search-complete` returns false → iterate

**Iteration 2:** Fetch with refined params → analyze → synthesize → reflect returns `{ confidence: 0.85 }` → `search-complete` returns true → stop

**Iteration 3 (failsafe):** `maxIterations` ceiling fires `pipeline:halted-iteration-limit`, pipeline returns with whatever it has.

---

## Demo Script (Showing Off Rhodium)

### Scene 1: Topology derivation
Register all plugins. Call `broker.getPluginStates()`. Show the dependency graph — nobody wrote it.

### Scene 2: LinkedIn goes down
Set `linkedin-fetcher` to throw. Run the pipeline. Show `stage:degraded` event on `fetch-jobs` for the LinkedIn provider. Show that Indeed and Remotive results still flow through. Show that `skill-matcher`, `culture-fit-analyzer`, and `salary-estimator` all complete normally.

Compare to LangGraph: *"That would be a try/except in every node plus conditional edge routing — and parallel superstep atomicity would fail the entire fetch superstep."*

### Scene 3: Hot registration
Complete a run with two job sources. Then: `broker.register(glassdoorFetcherPlugin); await broker.activatePlugin('glassdoor-fetcher');`. Run again. Glassdoor results appear in the next `fetch-jobs` fanout with zero code changes to any other plugin.

Compare to LangGraph: *"graph.addNode(), graph.addEdge(), graph.compile() — and redeploy."*

### Scene 4: Swap the LLM model
The `ollama-provider` is the only plugin that knows what model it's calling. Register a second provider at higher priority calling `gemma3:1b` for faster iteration. All seven LLM plugins automatically use the new model on the next `ctx.resolve('llm.generate')`.

### Scene 5: Reflection loop
Run with deliberately sparse resume. Watch iteration count climb. Show `reflect` output refining search keywords each iteration. Show `pipeline:halted-iteration-limit` fire on iteration 3 as the failsafe.

---

## Package Structure

This POC lives in `packages/poc-job-seeker/` (or `apps/job-seeker/`).

```
apps/job-seeker/
  src/
    capabilities.ts         # defineCapability calls for all contracts
    types.ts                # CandidateProfile, RawJob, NormalizedJob, etc.
    spec.ts                 # jobSeekerSpec: PipelineSpec
    plugins/
      ollama-provider.ts
      profile-parser.ts
      indeed-fetcher.ts
      linkedin-fetcher.ts
      remotive-fetcher.ts
      job-normalizer.ts
      skill-matcher.ts
      culture-fit-analyzer.ts
      salary-estimator.ts
      synthesizer.ts
      reflection-agent.ts
      cli-sink.ts
    prompts/
      profile-parser.txt
      job-normalizer.txt
      skill-matcher.txt
      culture-fit-analyzer.txt
      salary-estimator.txt
      synthesizer.txt
      reflection-agent.txt
    index.ts                # broker setup, register all plugins, run pipeline
  fixtures/
    resume-sample.txt
    indeed-mock.json
    linkedin-mock.json
  package.json
  tsconfig.json
```

---

## Constraints

- **Runtime:** Bun 1.0+
- **LLM:** Ollama running locally on `localhost:11434`, model `gemma4` (or configured via env `OLLAMA_MODEL`)
- **External API:** Remotive public API only — no API keys required for any source
- **No persistence** — pipeline is stateless; results printed to terminal
- **No streaming** — LLM responses are request/response only

---

## Success Criteria

1. Pipeline runs end-to-end on a real resume text with at least 2 job sources active
2. Killing `linkedin-fetcher` mid-run does not crash the pipeline
3. Hot-registering a new job source plugin between runs produces results in the next run with zero code changes to other plugins
4. Reflection loop terminates cleanly (either by stop condition or `maxIterations`)
5. Every plugin is independently testable with `createTestBroker()` and mock capabilities

---

## Interface

### Repo Name

`catalyst` — rhodium's primary use is in catalytic converters; the framework is the catalyst that enables components to react without touching each other.

### TUI

Built with `ink` (React for CLIs). Purely reactive — the TUI only subscribes to broker events, never imports a plugin.

Three views, toggled via keyboard:

**Pipeline view** (default during a run):
```
╔─────────────────────────────────────────────────────────────╗
│  catalyst                              iteration 2/3  ⠸     │
├─────────────────────────────────────────────────────────────┤
│  resume: senior-engineer.txt    model: gemma4@localhost      │
├─────────────────────────────────────────────────────────────┤
│  ✓  parse-profile                                  312ms    │
│  ✓  fetch-jobs                                              │
│       ✓  linkedin-fetcher                          891ms    │
│       ✓  indeed-fetcher                            654ms    │
│       ✗  remotive-fetcher          failed · skipped         │
│  ✓  normalize-jobs                                 1.2s     │
│  ⠸  analyze-jobs                                            │
│       ✓  skill-matcher                             2.3s     │
│       ⠸  culture-fit-analyzer      ...                      │
│       ⠸  salary-estimator          ...                      │
│  ·  synthesize                     waiting                  │
│  ·  reflect                        waiting                  │
├─────────────────────────────────────────────────────────────┤
│  1  Senior TypeScript Engineer · Stripe            92 ████  │
│     skill 94  culture 91  salary 90                         │
╚─────────────────────────────────────────────────────────────╝
```

**Results view** (after run, or press R):
Full ranked list with scores, reasoning, red flags, and source URLs.

**History view** (press H):
Browse past runs from SQLite. Select any run to re-view results without re-running.

### Input Modes

```bash
bun run catalyst                    # TUI with input menu
bun run catalyst resume.txt         # skip menu, run directly
bun run catalyst --docs             # open docs folder browser
bun run catalyst --model gemma3:4b  # override model
```

TUI input menu offers: browse docs folder, enter path / drag & drop (macOS Finder drag pastes path), or paste text. Supports `.txt`, `.md`, `.pdf` (via `pdf-parse`), `.docx` (via `mammoth`).

Config lives at `~/.catalyst/config.json`: `{ "docsFolder": "~/docs/resumes", "ollamaModel": "gemma4" }`.

---

## Results Persistence

**Storage:** Bun native SQLite (`bun:sqlite`) at `~/.catalyst/results.db`. Zero extra dependencies.

**Schema:**

```sql
CREATE TABLE runs (
  id          TEXT PRIMARY KEY,
  created_at  TEXT NOT NULL,
  resume_name TEXT NOT NULL,
  iteration   INT  NOT NULL,
  duration_ms INT  NOT NULL,
  model       TEXT NOT NULL
);

CREATE TABLE ranked_jobs (
  run_id   TEXT NOT NULL REFERENCES runs(id),
  rank     INT  NOT NULL,
  job_id   TEXT NOT NULL,
  title    TEXT NOT NULL,
  company  TEXT NOT NULL,
  url      TEXT NOT NULL,
  score    INT  NOT NULL,
  skill    INT  NOT NULL,
  culture  INT  NOT NULL,
  salary   INT  NOT NULL,
  summary  TEXT NOT NULL,
  source   TEXT NOT NULL
);
```

**Plugin:** `results-store` provides two capabilities:
- `results.store` — write a completed run + ranked jobs
- `results.query` — read run history for the history view

Swappable: register a Postgres provider at higher priority to replace SQLite with zero changes to any other plugin.

---

## Out of Scope

- Production deployment
- Authentication for LinkedIn/Indeed real APIs
- Persistent session memory across runs
- LLM response streaming
- Token cost tracking
