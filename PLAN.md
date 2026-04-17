# Catalyst POC Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build `catalyst` — a job seeker pipeline POC app that demonstrates Rhodium's capability-contract model using a mix of REST fetcher plugins and Ollama/Gemma LLM agent plugins, with a live ink TUI and SQLite result persistence.

**Architecture:** 14 Rhodium plugins (3 REST fetchers, 7 LLM agents, 1 Ollama provider, 1 results store, 1 pipeline-runner, 1 CLI sink) wired by the broker via `provides`/`needs` contracts. The `pipeline-runner` package drives execution through a 6-stage `PipelineSpec` with a reflection loop (max 3 iterations). The `cli-sink` plugin renders an `ink` TUI that reacts purely to broker events.

**Tech Stack:** Bun 1.0+, TypeScript 5, `ink` + `chalk` (TUI), `bun:sqlite` (results), `pdf-parse` + `mammoth` (file parsing), Ollama HTTP API (`fetch`), Remotive public API (`fetch`).

---

## Reference

- Design doc: `scratch/2026-04-14-job-seeker-poc-design.md`
- Pipeline-runner API: `packages/pipeline-runner/README.md`
- Test broker: `packages/testing/src/test-broker.ts`
- Capability definition: `packages/capabilities/src/define.ts`

---

## Task 1: Scaffold the `apps/catalyst` package

**Files:**
- Create: `apps/catalyst/package.json`
- Create: `apps/catalyst/tsconfig.json`
- Create: `apps/catalyst/src/index.ts`
- Modify: `package.json` (root — add `apps/*` to workspaces)

**Step 1: Add `apps/*` to root workspaces**

In root `package.json`, change:
```json
"workspaces": ["packages/*"]
```
to:
```json
"workspaces": ["packages/*", "apps/*"]
```

**Step 2: Create `apps/catalyst/package.json`**

```json
{
  "name": "catalyst",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "bun run src/index.ts",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "rhodium-core": "workspace:*",
    "rhodium-capabilities": "workspace:*",
    "rhodium-pipeline-runner": "workspace:*",
    "rhodium-testing": "workspace:*",
    "ink": "^5.0.1",
    "chalk": "^5.3.0",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.8.0",
    "minimist": "^1.2.8"
  },
  "devDependencies": {
    "@types/minimist": "^1.2.5",
    "@types/pdf-parse": "^1.1.4",
    "@types/mammoth": "^1.8.0"
  }
}
```

**Step 3: Create `apps/catalyst/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "jsx": "react-jsx",
    "jsxImportSource": "ink"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../../packages/rhodium-core" },
    { "path": "../../packages/rhodium-capabilities" },
    { "path": "../../packages/rhodium-pipeline-runner" }
  ]
}
```

> Note: If no `tsconfig.base.json` exists at root, copy `compilerOptions` from `packages/core/tsconfig.json` and add `"jsx": "react-jsx", "jsxImportSource": "ink"`.

**Step 4: Create `apps/catalyst/src/index.ts`** (placeholder)

```typescript
console.log('catalyst');
```

**Step 5: Install dependencies**

```bash
cd /Users/collinneill/repos/rhodium
bun install
```

Expected: resolves workspace deps, installs ink/chalk/etc.

**Step 6: Smoke test**

```bash
bun run apps/catalyst/src/index.ts
```

Expected output: `catalyst`

**Step 7: Commit**

```bash
git add apps/catalyst/ package.json
git commit -m "feat(catalyst): scaffold app package"
```

---

## Task 2: Types and Capability Contracts

**Files:**
- Create: `apps/catalyst/src/types.ts`
- Create: `apps/catalyst/src/capabilities.ts`

**Step 1: Write types**

Create `apps/catalyst/src/types.ts`:

```typescript
export interface PipelineInput {
  resumeText: string;
  resumeName: string;
}

export interface CandidateProfile {
  name: string;
  skills: string[];
  yearsExperience: number;
  titles: string[];
  preferredLocations: string[];
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  salaryExpectation?: { min: number; max: number; currency: string };
}

export interface RawJob {
  id: string;
  source: 'indeed' | 'linkedin' | 'remotive';
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedAt: string;
}

export interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  skills: string[];
  description: string;
  url: string;
  source: string;
}

export interface JobAnalysis {
  jobId: string;
  variant: 'skill' | 'culture' | 'salary';
  score: number;
  reasoning: string;
  signals: string[];
}

export interface RankedJob {
  job: NormalizedJob;
  overallScore: number;
  scores: { skill: number; culture: number; salary: number };
  summary: string;
  redFlags: string[];
}

export interface ReflectOutput {
  searchRefinements?: {
    additionalKeywords?: string[];
    expandLocation?: boolean;
    relaxedRequirements?: string[];
  };
  rationale: string;
  confidence: number;
}

export interface RunRecord {
  id: string;
  createdAt: string;
  resumeName: string;
  iteration: number;
  durationMs: number;
  model: string;
}
```

**Step 2: Write capability contracts**

Create `apps/catalyst/src/capabilities.ts`:

```typescript
import { defineCapability } from 'rhodium-capabilities';
import type {
  PipelineInput, CandidateProfile, RawJob, NormalizedJob,
  JobAnalysis, RankedJob, ReflectOutput, RunRecord,
} from './types.js';

export const LLMGenerate = defineCapability<{
  generate(prompt: string, options?: { temperature?: number }): Promise<string>;
}>('llm.generate');

export const ProfileParse = defineCapability<{
  parse(input: PipelineInput): Promise<CandidateProfile>;
}>('profile.parse');

export const JobsFetch = defineCapability<{
  fetch(input: {
    'parse-profile': CandidateProfile;
    refinements?: ReflectOutput['searchRefinements'];
  }): Promise<RawJob[]>;
}>('jobs.fetch');

export const JobsNormalize = defineCapability<{
  normalize(input: { 'fetch-jobs': RawJob[] }): Promise<NormalizedJob[]>;
}>('jobs.normalize');

export const JobsAnalyze = defineCapability<{
  analyze(input: {
    'normalize-jobs': NormalizedJob[];
    'parse-profile': CandidateProfile;
  }): Promise<JobAnalysis[]>;
}>('jobs.analyze');

export const JobsSynthesize = defineCapability<{
  synthesize(input: {
    'analyze-jobs': JobAnalysis[];
    'parse-profile': CandidateProfile;
  }): Promise<RankedJob[]>;
}>('jobs.synthesize');

export const JobsReflect = defineCapability<{
  reflect(input: {
    synthesize: RankedJob[];
    'parse-profile': CandidateProfile;
  }): Promise<ReflectOutput>;
}>('jobs.reflect');

export const JobsSearchComplete = defineCapability<{
  shouldStop(ctx: {
    iteration: number;
    stageOutputs: Map<string, unknown>;
  }): boolean;
}>('jobs.search-complete');

export const ResultsStore = defineCapability<{
  save(runId: string, resumeName: string, model: string,
       iteration: number, durationMs: number,
       jobs: RankedJob[]): Promise<void>;
}>('results.store');

export const ResultsQuery = defineCapability<{
  listRuns(): Promise<RunRecord[]>;
  getJobs(runId: string): Promise<RankedJob[]>;
}>('results.query');
```

**Step 3: Verify types compile**

```bash
cd apps/catalyst && bun run typecheck
```

Expected: no errors.

**Step 4: Commit**

```bash
git add apps/catalyst/src/types.ts apps/catalyst/src/capabilities.ts
git commit -m "feat(catalyst): define types and capability contracts"
```

---

## Task 3: `results-store` Plugin (SQLite)

**Files:**
- Create: `apps/catalyst/src/plugins/results-store.ts`
- Create: `apps/catalyst/src/plugins/results-store.test.ts`

**Step 1: Write the failing test**

Create `apps/catalyst/src/plugins/results-store.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'bun:test';
import { createTestBroker } from 'rhodium-testing';
import { resultsStorePlugin } from './results-store.js';

describe('results-store plugin', () => {
  it('saves and retrieves a run', async () => {
    const { broker } = createTestBroker();
    broker.register(resultsStorePlugin({ dbPath: ':memory:' }));
    await broker.activate();

    const store = broker.resolve<{ save: Function }>('results.store');
    const query = broker.resolve<{ listRuns: Function; getJobs: Function }>('results.query');

    await store.save('run-1', 'resume.txt', 'gemma4', 2, 5000, [
      {
        job: { id: 'j1', title: 'Senior Engineer', company: 'Stripe',
               location: 'Remote', remote: true, skills: ['TypeScript'],
               description: '', url: 'https://stripe.com', source: 'indeed' },
        overallScore: 92,
        scores: { skill: 94, culture: 91, salary: 90 },
        summary: 'Great match',
        redFlags: [],
      },
    ]);

    const runs = await query.listRuns();
    expect(runs).toHaveLength(1);
    expect(runs[0].resumeName).toBe('resume.txt');
    expect(runs[0].iteration).toBe(2);

    const jobs = await query.getJobs('run-1');
    expect(jobs).toHaveLength(1);
    expect(jobs[0].overallScore).toBe(92);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd apps/catalyst && bun test src/plugins/results-store.test.ts
```

Expected: FAIL — `resultsStorePlugin` not found.

**Step 3: Implement `results-store` plugin**

Create `apps/catalyst/src/plugins/results-store.ts`:

```typescript
import { Database } from 'bun:sqlite';
import type { Plugin } from 'rhodium-core';
import type { RankedJob, RunRecord } from '../types.js';

export interface ResultsStoreOptions {
  dbPath?: string; // default: ~/.catalyst/results.db
}

export function resultsStorePlugin(options: ResultsStoreOptions = {}): Plugin {
  return {
    key: 'results-store',
    version: '1.0.0',
    manifest: {
      name: 'Results Store',
      description: 'Persists pipeline results to SQLite',
      provides: [
        { capability: 'results.store' },
        { capability: 'results.query' },
      ],
      needs: [],
    },
    activate(ctx) {
      const dbPath = options.dbPath ?? `${process.env.HOME}/.catalyst/results.db`;
      const db = new Database(dbPath);

      db.run(`CREATE TABLE IF NOT EXISTS runs (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        resume_name TEXT NOT NULL,
        iteration INTEGER NOT NULL,
        duration_ms INTEGER NOT NULL,
        model TEXT NOT NULL
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS ranked_jobs (
        run_id TEXT NOT NULL,
        rank INTEGER NOT NULL,
        job_id TEXT NOT NULL,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        url TEXT NOT NULL,
        score INTEGER NOT NULL,
        skill INTEGER NOT NULL,
        culture INTEGER NOT NULL,
        salary INTEGER NOT NULL,
        summary TEXT NOT NULL,
        source TEXT NOT NULL,
        job_json TEXT NOT NULL
      )`);

      ctx.provide('results.store', {
        async save(runId, resumeName, model, iteration, durationMs, jobs) {
          db.run(
            `INSERT INTO runs VALUES (?,?,?,?,?,?)`,
            [runId, new Date().toISOString(), resumeName, iteration, durationMs, model],
          );
          for (const [i, ranked] of jobs.entries()) {
            db.run(
              `INSERT INTO ranked_jobs VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
              [runId, i + 1, ranked.job.id, ranked.job.title, ranked.job.company,
               ranked.job.url, ranked.overallScore,
               ranked.scores.skill, ranked.scores.culture, ranked.scores.salary,
               ranked.summary, ranked.job.source, JSON.stringify(ranked)],
            );
          }
        },
      });

      ctx.provide('results.query', {
        async listRuns(): Promise<RunRecord[]> {
          return db.query(
            `SELECT id, created_at as createdAt, resume_name as resumeName,
                    iteration, duration_ms as durationMs, model
             FROM runs ORDER BY created_at DESC`
          ).all() as RunRecord[];
        },
        async getJobs(runId): Promise<RankedJob[]> {
          const rows = db.query(
            `SELECT job_json FROM ranked_jobs WHERE run_id = ? ORDER BY rank`
          ).all(runId) as { job_json: string }[];
          return rows.map((r) => JSON.parse(r.job_json));
        },
      });

      ctx.registerCommand('results:clear', async () => {
        db.run('DELETE FROM ranked_jobs');
        db.run('DELETE FROM runs');
      });
    },
  };
}
```

**Step 4: Run tests to verify they pass**

```bash
cd apps/catalyst && bun test src/plugins/results-store.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add apps/catalyst/src/plugins/results-store.ts apps/catalyst/src/plugins/results-store.test.ts
git commit -m "feat(catalyst): results-store plugin with SQLite persistence"
```

---

## Task 4: `ollama-provider` Plugin

**Files:**
- Create: `apps/catalyst/src/plugins/ollama-provider.ts`
- Create: `apps/catalyst/src/plugins/ollama-provider.test.ts`

**Step 1: Write the failing test**

Create `apps/catalyst/src/plugins/ollama-provider.test.ts`:

```typescript
import { describe, it, expect, mock } from 'bun:test';
import { createTestBroker } from 'rhodium-testing';
import { ollamaProviderPlugin } from './ollama-provider.js';

describe('ollama-provider plugin', () => {
  it('provides llm.generate capability', async () => {
    const fetchMock = mock(async () =>
      new Response(JSON.stringify({ response: 'hello world' }))
    );
    global.fetch = fetchMock as any;

    const { broker } = createTestBroker();
    broker.register(ollamaProviderPlugin({ model: 'gemma4', baseUrl: 'http://localhost:11434' }));
    await broker.activate();

    const llm = broker.resolve<{ generate: Function }>('llm.generate');
    const result = await llm.generate('say hello');

    expect(result).toBe('hello world');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:11434/api/generate',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws a clear error when Ollama is unreachable', async () => {
    global.fetch = mock(async () => { throw new Error('ECONNREFUSED'); }) as any;

    const { broker } = createTestBroker();
    broker.register(ollamaProviderPlugin({ model: 'gemma4' }));
    await broker.activate();

    const llm = broker.resolve<{ generate: Function }>('llm.generate');
    await expect(llm.generate('hello')).rejects.toThrow('Ollama unreachable');
  });
});
```

**Step 2: Run to verify it fails**

```bash
cd apps/catalyst && bun test src/plugins/ollama-provider.test.ts
```

Expected: FAIL.

**Step 3: Implement**

Create `apps/catalyst/src/plugins/ollama-provider.ts`:

```typescript
import type { Plugin } from 'rhodium-core';

export interface OllamaProviderOptions {
  model?: string;
  baseUrl?: string;
}

export function ollamaProviderPlugin(options: OllamaProviderOptions = {}): Plugin {
  const model = options.model ?? process.env.OLLAMA_MODEL ?? 'gemma4';
  const baseUrl = options.baseUrl ?? process.env.OLLAMA_URL ?? 'http://localhost:11434';

  return {
    key: 'ollama-provider',
    version: '1.0.0',
    manifest: {
      name: 'Ollama Provider',
      description: `LLM capability via Ollama (${model})`,
      provides: [{ capability: 'llm.generate', priority: 100 }],
      needs: [],
      tags: ['llm'],
    },
    activate(ctx) {
      ctx.provide('llm.generate', {
        async generate(prompt: string, opts: { temperature?: number } = {}) {
          let res: Response;
          try {
            res = await fetch(`${baseUrl}/api/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model,
                prompt,
                stream: false,
                options: { temperature: opts.temperature ?? 0.3 },
              }),
            });
          } catch (err) {
            throw new Error(`Ollama unreachable at ${baseUrl}: ${(err as Error).message}`);
          }
          if (!res.ok) throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
          const data = await res.json() as { response: string };
          return data.response;
        },
      });
    },
  };
}
```

**Step 4: Run tests**

```bash
cd apps/catalyst && bun test src/plugins/ollama-provider.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add apps/catalyst/src/plugins/ollama-provider.ts apps/catalyst/src/plugins/ollama-provider.test.ts
git commit -m "feat(catalyst): ollama-provider plugin"
```

---

## Task 5: REST Fetcher Plugins (Indeed, LinkedIn, Remotive)

**Files:**
- Create: `apps/catalyst/src/plugins/indeed-fetcher.ts`
- Create: `apps/catalyst/src/plugins/linkedin-fetcher.ts`
- Create: `apps/catalyst/src/plugins/remotive-fetcher.ts`
- Create: `apps/catalyst/src/plugins/fetchers.test.ts`
- Create: `apps/catalyst/src/fixtures/indeed-jobs.json`
- Create: `apps/catalyst/src/fixtures/linkedin-jobs.json`

**Step 1: Create fixtures**

`apps/catalyst/src/fixtures/indeed-jobs.json`:
```json
[
  { "id": "indeed-1", "title": "Senior TypeScript Engineer", "company": "Acme Corp",
    "location": "Remote", "description": "We need a senior TypeScript engineer with React experience.",
    "url": "https://indeed.com/job/1", "postedAt": "2026-04-13" },
  { "id": "indeed-2", "title": "Staff Software Engineer", "company": "Globex",
    "location": "San Francisco, CA", "description": "Staff-level engineer for platform team.",
    "url": "https://indeed.com/job/2", "postedAt": "2026-04-12" }
]
```

`apps/catalyst/src/fixtures/linkedin-jobs.json`:
```json
[
  { "id": "linkedin-1", "title": "Principal Engineer", "company": "Initech",
    "location": "New York, NY (Hybrid)", "description": "Lead our infrastructure team.",
    "url": "https://linkedin.com/jobs/1", "postedAt": "2026-04-14" },
  { "id": "linkedin-2", "title": "Engineering Manager", "company": "Umbrella Corp",
    "location": "Remote", "description": "Manage a team of 6 engineers.",
    "url": "https://linkedin.com/jobs/2", "postedAt": "2026-04-11" }
]
```

**Step 2: Write failing tests**

Create `apps/catalyst/src/plugins/fetchers.test.ts`:

```typescript
import { describe, it, expect } from 'bun:test';
import { createTestBroker } from 'rhodium-testing';
import { indeedFetcherPlugin } from './indeed-fetcher.js';
import { linkedinFetcherPlugin } from './linkedin-fetcher.js';
import { remotiveFetcherPlugin } from './remotive-fetcher.js';

const mockProfile = {
  name: 'Jane Doe', skills: ['TypeScript', 'React'], yearsExperience: 7,
  titles: ['Senior Engineer'], preferredLocations: ['Remote'],
  remotePreference: 'remote' as const,
};

describe('indeed-fetcher', () => {
  it('returns fixture jobs', async () => {
    const { broker } = createTestBroker();
    broker.register(indeedFetcherPlugin());
    await broker.activate();
    const fetcher = broker.resolve<{ fetch: Function }>('jobs.fetch');
    const jobs = await fetcher.fetch({ 'parse-profile': mockProfile });
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs[0].source).toBe('indeed');
  });
});

describe('linkedin-fetcher', () => {
  it('returns fixture jobs', async () => {
    const { broker } = createTestBroker();
    broker.register(linkedinFetcherPlugin());
    await broker.activate();
    const fetcher = broker.resolve<{ fetch: Function }>('jobs.fetch');
    const jobs = await fetcher.fetch({ 'parse-profile': mockProfile });
    expect(jobs[0].source).toBe('linkedin');
  });

  it('throws in flaky mode to demo error isolation', async () => {
    const { broker } = createTestBroker();
    broker.register(linkedinFetcherPlugin({ flaky: true }));
    await broker.activate();
    const fetcher = broker.resolve<{ fetch: Function }>('jobs.fetch');
    await expect(fetcher.fetch({ 'parse-profile': mockProfile })).rejects.toThrow();
  });
});

describe('remotive-fetcher', () => {
  it('provides the jobs.fetch capability', async () => {
    const { broker } = createTestBroker();
    broker.register(remotiveFetcherPlugin());
    await broker.activate();
    const states = broker.getPluginStates();
    expect(states.get('remotive-fetcher')?.status).toBe('active');
  });
});
```

**Step 3: Run to verify they fail**

```bash
cd apps/catalyst && bun test src/plugins/fetchers.test.ts
```

Expected: FAIL.

**Step 4: Implement `indeed-fetcher`**

Create `apps/catalyst/src/plugins/indeed-fetcher.ts`:

```typescript
import type { Plugin } from 'rhodium-core';
import fixtures from '../fixtures/indeed-jobs.json' assert { type: 'json' };
import type { RawJob } from '../types.js';

export function indeedFetcherPlugin(): Plugin {
  return {
    key: 'indeed-fetcher',
    version: '1.0.0',
    manifest: {
      name: 'Indeed Fetcher',
      description: 'Fetches job postings from Indeed (mock)',
      provides: [{ capability: 'jobs.fetch', priority: 80 }],
      needs: [],
      tags: ['job-source', 'mock'],
    },
    activate(ctx) {
      ctx.provide('jobs.fetch', {
        async fetch({ 'parse-profile': profile, refinements }) {
          // Simulate network delay
          await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
          const keywords = [
            ...profile.skills,
            ...(refinements?.additionalKeywords ?? []),
          ].map((k) => k.toLowerCase());
          return (fixtures as RawJob[])
            .filter((j) =>
              keywords.some((k) => j.description.toLowerCase().includes(k))
            )
            .map((j) => ({ ...j, source: 'indeed' as const }));
        },
      });
    },
  };
}
```

**Step 5: Implement `linkedin-fetcher`**

Create `apps/catalyst/src/plugins/linkedin-fetcher.ts`:

```typescript
import type { Plugin } from 'rhodium-core';
import fixtures from '../fixtures/linkedin-jobs.json' assert { type: 'json' };
import type { RawJob } from '../types.js';

export interface LinkedinFetcherOptions {
  flaky?: boolean; // set true in demo mode to show error isolation
}

export function linkedinFetcherPlugin(options: LinkedinFetcherOptions = {}): Plugin {
  return {
    key: 'linkedin-fetcher',
    version: '1.0.0',
    manifest: {
      name: 'LinkedIn Fetcher',
      description: 'Fetches job postings from LinkedIn (mock)',
      provides: [{ capability: 'jobs.fetch', priority: 100 }],
      needs: [],
      tags: ['job-source', 'mock'],
    },
    activate(ctx) {
      ctx.provide('jobs.fetch', {
        async fetch({ 'parse-profile': profile }) {
          await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
          if (options.flaky) {
            throw new Error('LinkedIn API: rate limit exceeded (demo)');
          }
          return (fixtures as RawJob[]).map((j) => ({ ...j, source: 'linkedin' as const }));
        },
      });
    },
  };
}
```

**Step 6: Implement `remotive-fetcher`**

Create `apps/catalyst/src/plugins/remotive-fetcher.ts`:

```typescript
import type { Plugin } from 'rhodium-core';
import type { RawJob } from '../types.js';

interface RemotiveJob {
  id: number; title: string; company_name: string;
  candidate_required_location: string; description: string;
  url: string; date: string;
}

export function remotiveFetcherPlugin(): Plugin {
  return {
    key: 'remotive-fetcher',
    version: '1.0.0',
    manifest: {
      name: 'Remotive Fetcher',
      description: 'Fetches remote job postings from Remotive public API',
      provides: [{ capability: 'jobs.fetch', priority: 60 }],
      needs: [],
      tags: ['job-source', 'real-api'],
    },
    activate(ctx) {
      ctx.provide('jobs.fetch', {
        async fetch({ 'parse-profile': profile, refinements }) {
          const search = [
            ...profile.titles.slice(0, 1),
            ...(refinements?.additionalKeywords ?? []),
          ].join(' ');
          const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(search)}&limit=10`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Remotive API error: ${res.status}`);
          const data = await res.json() as { jobs: RemotiveJob[] };
          return data.jobs.map((j): RawJob => ({
            id: `remotive-${j.id}`,
            source: 'remotive',
            title: j.title,
            company: j.company_name,
            location: j.candidate_required_location || 'Remote',
            description: j.description.replace(/<[^>]+>/g, ''),
            url: j.url,
            postedAt: j.date,
          }));
        },
      });
    },
  };
}
```

**Step 7: Run tests**

```bash
cd apps/catalyst && bun test src/plugins/fetchers.test.ts
```

Expected: PASS.

**Step 8: Commit**

```bash
git add apps/catalyst/src/plugins/ apps/catalyst/src/fixtures/
git commit -m "feat(catalyst): REST fetcher plugins (indeed, linkedin, remotive)"
```

---

## Task 6: `profile-parser` Plugin (LLM)

**Files:**
- Create: `apps/catalyst/src/plugins/profile-parser.ts`
- Create: `apps/catalyst/src/plugins/profile-parser.test.ts`
- Create: `apps/catalyst/src/prompts/profile-parser.ts`

**Step 1: Write failing test**

Create `apps/catalyst/src/plugins/profile-parser.test.ts`:

```typescript
import { describe, it, expect } from 'bun:test';
import { createTestBroker } from 'rhodium-testing';
import { profileParserPlugin } from './profile-parser.js';

describe('profile-parser plugin', () => {
  it('parses a resume using the LLM capability', async () => {
    const mockLLM = {
      generate: async (_prompt: string) => JSON.stringify({
        name: 'Jane Doe',
        skills: ['TypeScript', 'React', 'Node.js'],
        yearsExperience: 7,
        titles: ['Senior Engineer'],
        preferredLocations: ['Remote'],
        remotePreference: 'remote',
        salaryExpectation: { min: 180000, max: 220000, currency: 'USD' },
      }),
    };

    const { broker } = createTestBroker();
    broker.register({
      key: 'mock-llm', version: '1.0.0',
      manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
      activate(ctx) { ctx.provide('llm.generate', mockLLM); },
    });
    broker.register(profileParserPlugin());
    await broker.activate();

    const parser = broker.resolve<{ parse: Function }>('profile.parse');
    const profile = await parser.parse({ resumeText: 'Jane Doe, Senior Engineer...', resumeName: 'jane.txt' });

    expect(profile.name).toBe('Jane Doe');
    expect(profile.skills).toContain('TypeScript');
    expect(profile.remotePreference).toBe('remote');
  });
});
```

**Step 2: Run to verify it fails**

```bash
cd apps/catalyst && bun test src/plugins/profile-parser.test.ts
```

**Step 3: Create prompt**

Create `apps/catalyst/src/prompts/profile-parser.ts`:

```typescript
export function profileParserPrompt(resumeText: string): string {
  return `You are a resume parser. Extract structured information from the resume below.

Return ONLY a JSON object with this exact shape (no markdown, no explanation):
{
  "name": "string",
  "skills": ["array", "of", "skills"],
  "yearsExperience": number,
  "titles": ["most recent title first"],
  "preferredLocations": ["city or Remote"],
  "remotePreference": "remote" | "hybrid" | "onsite" | "flexible",
  "salaryExpectation": { "min": number, "max": number, "currency": "USD" } | null
}

RESUME:
${resumeText}`;
}
```

**Step 4: Implement plugin**

Create `apps/catalyst/src/plugins/profile-parser.ts`:

```typescript
import type { Plugin } from 'rhodium-core';
import { profileParserPrompt } from '../prompts/profile-parser.js';
import type { CandidateProfile, PipelineInput } from '../types.js';

export function profileParserPlugin(): Plugin {
  return {
    key: 'profile-parser',
    version: '1.0.0',
    manifest: {
      name: 'Profile Parser',
      description: 'Extracts structured candidate profile from resume text',
      provides: [{ capability: 'profile.parse' }],
      needs: [{ capability: 'llm.generate' }],
    },
    activate(ctx) {
      const llm = ctx.resolve<{ generate: Function }>('llm.generate');
      ctx.provide('profile.parse', {
        async parse(input: PipelineInput): Promise<CandidateProfile> {
          const raw = await llm.generate(profileParserPrompt(input.resumeText));
          const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
          return JSON.parse(cleaned) as CandidateProfile;
        },
      });
    },
  };
}
```

**Step 5: Run tests**

```bash
cd apps/catalyst && bun test src/plugins/profile-parser.test.ts
```

Expected: PASS.

**Step 6: Commit**

```bash
git add apps/catalyst/src/plugins/profile-parser.ts apps/catalyst/src/plugins/profile-parser.test.ts apps/catalyst/src/prompts/
git commit -m "feat(catalyst): profile-parser LLM plugin"
```

---

## Task 7: `job-normalizer` Plugin (LLM)

**Files:**
- Create: `apps/catalyst/src/plugins/job-normalizer.ts`
- Create: `apps/catalyst/src/plugins/job-normalizer.test.ts`
- Create: `apps/catalyst/src/prompts/job-normalizer.ts`

Follow the same pattern as Task 6. The normalizer receives `{ 'fetch-jobs': RawJob[] }` and returns `NormalizedJob[]`.

**Prompt template** (`apps/catalyst/src/prompts/job-normalizer.ts`):

```typescript
import type { RawJob } from '../types.js';

export function jobNormalizerPrompt(jobs: RawJob[]): string {
  return `You are a job data normalizer. Clean and structure the following job postings.

For each job, extract skills mentioned in the description and determine if it is remote.

Return ONLY a JSON array — no markdown, no explanation:
[{
  "id": "same id as input",
  "title": "cleaned title",
  "company": "company name",
  "location": "city/state or Remote",
  "remote": true | false,
  "skills": ["extracted", "skills"],
  "description": "first 200 chars of cleaned description",
  "url": "same url",
  "source": "same source"
}]

JOBS:
${JSON.stringify(jobs, null, 2)}`;
}
```

**Plugin** (`apps/catalyst/src/plugins/job-normalizer.ts`):

```typescript
import type { Plugin } from 'rhodium-core';
import { jobNormalizerPrompt } from '../prompts/job-normalizer.js';
import type { NormalizedJob, RawJob } from '../types.js';

export function jobNormalizerPlugin(): Plugin {
  return {
    key: 'job-normalizer',
    version: '1.0.0',
    manifest: {
      name: 'Job Normalizer',
      description: 'Deduplicates and standardizes job postings across sources',
      provides: [{ capability: 'jobs.normalize' }],
      needs: [{ capability: 'llm.generate' }],
    },
    activate(ctx) {
      const llm = ctx.resolve<{ generate: Function }>('llm.generate');
      ctx.provide('jobs.normalize', {
        async normalize(input: { 'fetch-jobs': RawJob[] }): Promise<NormalizedJob[]> {
          const jobs = input['fetch-jobs'];
          if (!jobs.length) return [];
          const raw = await llm.generate(jobNormalizerPrompt(jobs));
          const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
          return JSON.parse(cleaned) as NormalizedJob[];
        },
      });
    },
  };
}
```

**Test** follows the same mock-llm pattern as profile-parser. Verify `normalize()` returns a `NormalizedJob[]` with `remote: boolean` and `skills: string[]`.

**Commit:**
```bash
git commit -m "feat(catalyst): job-normalizer LLM plugin"
```

---

## Task 8: Scoring Plugins — `skill-matcher`, `culture-fit-analyzer`, `salary-estimator`

All three follow the same structure. Each provides `jobs.analyze`, each needs `llm.generate`. They differ only in their prompt and the `variant` field on `JobAnalysis`.

**Files:**
- Create: `apps/catalyst/src/plugins/skill-matcher.ts`
- Create: `apps/catalyst/src/plugins/culture-fit-analyzer.ts`
- Create: `apps/catalyst/src/plugins/salary-estimator.ts`
- Create: `apps/catalyst/src/plugins/scoring.test.ts`
- Create: `apps/catalyst/src/prompts/skill-matcher.ts`
- Create: `apps/catalyst/src/prompts/culture-fit-analyzer.ts`
- Create: `apps/catalyst/src/prompts/salary-estimator.ts`

**Shared prompt shape** — each prompt returns a JSON array:

```typescript
// Each prompt returns: JobAnalysis[] where variant is fixed
// [{ jobId, variant, score: 0-100, reasoning: "...", signals: ["..."] }]
```

**`skill-matcher` prompt** (`apps/catalyst/src/prompts/skill-matcher.ts`):

```typescript
import type { CandidateProfile, NormalizedJob } from '../types.js';

export function skillMatcherPrompt(jobs: NormalizedJob[], profile: CandidateProfile): string {
  return `You are a technical skill matcher. Score each job's skill fit for the candidate.

Candidate skills: ${profile.skills.join(', ')}
Candidate experience: ${profile.yearsExperience} years as ${profile.titles[0]}

For each job return a score 0-100 for technical skill overlap.

Return ONLY a JSON array:
[{ "jobId": "id", "variant": "skill", "score": number, "reasoning": "1 sentence", "signals": ["key signal"] }]

JOBS:
${JSON.stringify(jobs.map((j) => ({ id: j.id, title: j.title, skills: j.skills })), null, 2)}`;
}
```

**`culture-fit-analyzer` prompt** (`apps/catalyst/src/prompts/culture-fit-analyzer.ts`):

```typescript
import type { CandidateProfile, NormalizedJob } from '../types.js';

export function cultureFitPrompt(jobs: NormalizedJob[], profile: CandidateProfile): string {
  return `You are a culture fit analyzer. Score each job's culture alignment for the candidate.

Candidate preference: ${profile.remotePreference}, locations: ${profile.preferredLocations.join(', ')}

For each job score 0-100 for culture/team/values fit based on location, remote policy, and description signals.

Return ONLY a JSON array:
[{ "jobId": "id", "variant": "culture", "score": number, "reasoning": "1 sentence", "signals": ["key signal"] }]

JOBS:
${JSON.stringify(jobs.map((j) => ({ id: j.id, title: j.title, location: j.location, remote: j.remote, description: j.description })), null, 2)}`;
}
```

**`salary-estimator` prompt** (`apps/catalyst/src/prompts/salary-estimator.ts`):

```typescript
import type { CandidateProfile, NormalizedJob } from '../types.js';

export function salaryEstimatorPrompt(jobs: NormalizedJob[], profile: CandidateProfile): string {
  const range = profile.salaryExpectation
    ? `$${profile.salaryExpectation.min / 1000}k–$${profile.salaryExpectation.max / 1000}k`
    : 'unknown';
  return `You are a salary fit estimator. Score each job's likely comp alignment.

Candidate expected range: ${range}

Estimate based on company, title, and location. Score 0-100 for salary fit.

Return ONLY a JSON array:
[{ "jobId": "id", "variant": "salary", "score": number, "reasoning": "1 sentence", "signals": ["key signal"] }]

JOBS:
${JSON.stringify(jobs.map((j) => ({ id: j.id, title: j.title, company: j.company, location: j.location })), null, 2)}`;
}
```

**Plugin template** (same for all three, vary `key`, `name`, `capability variant`, `prompt fn`):

```typescript
// apps/catalyst/src/plugins/skill-matcher.ts
import type { Plugin } from 'rhodium-core';
import { skillMatcherPrompt } from '../prompts/skill-matcher.js';
import type { CandidateProfile, JobAnalysis, NormalizedJob } from '../types.js';

export function skillMatcherPlugin(): Plugin {
  return {
    key: 'skill-matcher',
    version: '1.0.0',
    manifest: {
      name: 'Skill Matcher',
      description: 'Scores technical skill overlap between candidate and jobs',
      provides: [{ capability: 'jobs.analyze', priority: 100 }],
      needs: [{ capability: 'llm.generate' }],
    },
    activate(ctx) {
      const llm = ctx.resolve<{ generate: Function }>('llm.generate');
      ctx.provide('jobs.analyze', {
        async analyze(input: {
          'normalize-jobs': NormalizedJob[];
          'parse-profile': CandidateProfile;
        }): Promise<JobAnalysis[]> {
          const raw = await llm.generate(
            skillMatcherPrompt(input['normalize-jobs'], input['parse-profile'])
          );
          return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
        },
      });
    },
  };
}
```

Repeat for `culture-fit-analyzer` (key: `culture-fit-analyzer`, priority: 90) and `salary-estimator` (key: `salary-estimator`, priority: 80).

**Test** (`apps/catalyst/src/plugins/scoring.test.ts`):

```typescript
import { describe, it, expect } from 'bun:test';
import { createTestBroker } from 'rhodium-testing';
import { skillMatcherPlugin } from './skill-matcher.js';
import { cultureFitAnalyzerPlugin } from './culture-fit-analyzer.js';
import { salaryEstimatorPlugin } from './salary-estimator.js';

const mockLLM = (variant: string) => ({
  generate: async () => JSON.stringify([
    { jobId: 'j1', variant, score: 85, reasoning: 'Good match', signals: ['TypeScript'] },
  ]),
});

const input = {
  'normalize-jobs': [{ id: 'j1', title: 'Engineer', company: 'X', location: 'Remote',
    remote: true, skills: ['TypeScript'], description: '', url: '', source: 'indeed' }],
  'parse-profile': { name: 'Jane', skills: ['TypeScript'], yearsExperience: 5,
    titles: ['Engineer'], preferredLocations: ['Remote'], remotePreference: 'remote' as const },
};

for (const [plugin, variant] of [
  [skillMatcherPlugin, 'skill'],
  [cultureFitAnalyzerPlugin, 'culture'],
  [salaryEstimatorPlugin, 'salary'],
] as const) {
  describe(`${variant} analyzer`, () => {
    it('returns job analysis with correct variant', async () => {
      const { broker } = createTestBroker();
      broker.register({
        key: 'mock-llm', version: '1.0.0',
        manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
        activate(ctx) { ctx.provide('llm.generate', mockLLM(variant)); },
      });
      broker.register(plugin());
      await broker.activate();
      const analyzer = broker.resolve<{ analyze: Function }>('jobs.analyze');
      const results = await analyzer.analyze(input);
      expect(results[0].variant).toBe(variant);
      expect(results[0].score).toBe(85);
    });
  });
}
```

**Commit:**
```bash
git commit -m "feat(catalyst): skill-matcher, culture-fit-analyzer, salary-estimator plugins"
```

---

## Task 9: `synthesizer` Plugin (LLM)

**Files:**
- Create: `apps/catalyst/src/plugins/synthesizer.ts`
- Create: `apps/catalyst/src/plugins/synthesizer.test.ts`
- Create: `apps/catalyst/src/prompts/synthesizer.ts`

**Prompt** (`apps/catalyst/src/prompts/synthesizer.ts`):

```typescript
import type { CandidateProfile, JobAnalysis, NormalizedJob } from '../types.js';

export function synthesizerPrompt(
  jobs: NormalizedJob[],
  analyses: JobAnalysis[],
  profile: CandidateProfile,
): string {
  const byJob = jobs.map((job) => ({
    job,
    skill: analyses.find((a) => a.jobId === job.id && a.variant === 'skill'),
    culture: analyses.find((a) => a.jobId === job.id && a.variant === 'culture'),
    salary: analyses.find((a) => a.jobId === job.id && a.variant === 'salary'),
  }));

  return `You are a job match synthesizer. Rank these jobs for ${profile.name} (${profile.titles[0]}).

Combine skill, culture, and salary scores into an overall score. Write a 2-sentence summary.

Return ONLY a JSON array sorted by overallScore DESC:
[{
  "jobId": "id",
  "overallScore": number,
  "scores": { "skill": number, "culture": number, "salary": number },
  "summary": "2 sentence explanation",
  "redFlags": ["any concerns"]
}]

DATA:
${JSON.stringify(byJob, null, 2)}`;
}
```

**Plugin** (`apps/catalyst/src/plugins/synthesizer.ts`):

```typescript
import type { Plugin } from 'rhodium-core';
import { synthesizerPrompt } from '../prompts/synthesizer.js';
import type { CandidateProfile, JobAnalysis, NormalizedJob, RankedJob } from '../types.js';

export function synthesizerPlugin(): Plugin {
  return {
    key: 'synthesizer',
    version: '1.0.0',
    manifest: {
      name: 'Synthesizer',
      description: 'Merges analysis scores into a ranked job list',
      provides: [{ capability: 'jobs.synthesize' }],
      needs: [{ capability: 'llm.generate' }],
    },
    activate(ctx) {
      const llm = ctx.resolve<{ generate: Function }>('llm.generate');
      ctx.provide('jobs.synthesize', {
        async synthesize(input: {
          'analyze-jobs': JobAnalysis[];
          'parse-profile': CandidateProfile;
          // normalized jobs need to come from stageOutputs — resolved via inputFrom
          'normalize-jobs'?: NormalizedJob[];
        }): Promise<RankedJob[]> {
          const analyses = input['analyze-jobs'];
          const jobs = input['normalize-jobs'] ?? [];
          const raw = await llm.generate(synthesizerPrompt(jobs, analyses, input['parse-profile']));
          const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as Array<{
            jobId: string; overallScore: number;
            scores: { skill: number; culture: number; salary: number };
            summary: string; redFlags: string[];
          }>;
          return parsed.map((p) => ({
            job: jobs.find((j) => j.id === p.jobId) ?? { id: p.jobId, title: '', company: '',
              location: '', remote: false, skills: [], description: '', url: '', source: '' },
            overallScore: p.overallScore,
            scores: p.scores,
            summary: p.summary,
            redFlags: p.redFlags,
          }));
        },
      });
    },
  };
}
```

> Note: the pipeline spec's `inputFrom` on `synthesize` must include `normalize-jobs` to pass normalized jobs through. Update the spec in Task 11.

**Commit:**
```bash
git commit -m "feat(catalyst): synthesizer LLM plugin"
```

---

## Task 10: `reflection-agent` Plugin (LLM)

**Files:**
- Create: `apps/catalyst/src/plugins/reflection-agent.ts`
- Create: `apps/catalyst/src/plugins/reflection-agent.test.ts`
- Create: `apps/catalyst/src/prompts/reflection-agent.ts`

**Prompt** (`apps/catalyst/src/prompts/reflection-agent.ts`):

```typescript
import type { CandidateProfile, RankedJob } from '../types.js';

export function reflectionAgentPrompt(jobs: RankedJob[], profile: CandidateProfile, iteration: number): string {
  const topScore = jobs[0]?.overallScore ?? 0;
  return `You are a job search reflection agent. Evaluate if these results are good enough.

Iteration: ${iteration} of 3
Top result score: ${topScore}/100
Candidate: ${profile.name}, ${profile.titles[0]}

If top score >= 80 and there are 3+ results with score >= 70, the search is complete.
Otherwise suggest refinements.

Return ONLY JSON:
{
  "confidence": number between 0 and 1,
  "rationale": "1 sentence",
  "searchRefinements": {
    "additionalKeywords": ["optional", "keywords"],
    "expandLocation": true | false,
    "relaxedRequirements": ["optional relaxed requirement"]
  } | null
}

TOP RESULTS:
${JSON.stringify(jobs.slice(0, 5).map((j) => ({ title: j.job.title, company: j.job.company, score: j.overallScore })), null, 2)}`;
}
```

**Plugin** (`apps/catalyst/src/plugins/reflection-agent.ts`):

```typescript
import type { Plugin } from 'rhodium-core';
import { reflectionAgentPrompt } from '../prompts/reflection-agent.js';
import type { CandidateProfile, RankedJob, ReflectOutput } from '../types.js';

export function reflectionAgentPlugin(): Plugin {
  return {
    key: 'reflection-agent',
    version: '1.0.0',
    manifest: {
      name: 'Reflection Agent',
      description: 'Evaluates result quality and decides whether to refine the search',
      provides: [
        { capability: 'jobs.reflect' },
        { capability: 'jobs.search-complete' },
      ],
      needs: [{ capability: 'llm.generate' }],
    },
    activate(ctx) {
      const llm = ctx.resolve<{ generate: Function }>('llm.generate');
      let lastOutput: ReflectOutput | null = null;

      ctx.provide('jobs.reflect', {
        async reflect(input: { synthesize: RankedJob[]; 'parse-profile': CandidateProfile }): Promise<ReflectOutput> {
          // iteration is not directly available here — passed via stageOutputs in search-complete
          const raw = await llm.generate(reflectionAgentPrompt(input.synthesize, input['parse-profile'], 1));
          lastOutput = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as ReflectOutput;
          return lastOutput;
        },
      });

      ctx.provide('jobs.search-complete', {
        shouldStop(ctx: { iteration: number; stageOutputs: Map<string, unknown> }): boolean {
          const reflect = ctx.stageOutputs.get('reflect') as ReflectOutput | undefined;
          if (!reflect) return false;
          return reflect.confidence >= 0.8 || ctx.iteration >= 3;
        },
      });
    },
  };
}
```

**Test** — verify that `shouldStop` returns true when confidence >= 0.8:

```typescript
// reflection-agent.test.ts
it('shouldStop returns true when confidence >= 0.8', async () => {
  // ... setup broker with mock llm and reflection-agent plugin
  const stopper = broker.resolve<{ shouldStop: Function }>('jobs.search-complete');
  const result = stopper.shouldStop({
    iteration: 1,
    stageOutputs: new Map([['reflect', { confidence: 0.85, rationale: 'good', searchRefinements: null }]]),
  });
  expect(result).toBe(true);
});
```

**Commit:**
```bash
git commit -m "feat(catalyst): reflection-agent LLM plugin"
```

---

## Task 11: Pipeline Spec

**Files:**
- Create: `apps/catalyst/src/spec.ts`
- Create: `apps/catalyst/src/spec.test.ts`

**Step 1: Write spec**

Create `apps/catalyst/src/spec.ts`:

```typescript
import type { PipelineSpec } from 'rhodium-pipeline-runner';

export const jobSeekerSpec: PipelineSpec = {
  name: 'job-seeker',
  stages: [
    {
      id: 'parse-profile',
      capability: 'profile.parse',
      policy: 'single',
      errorPolicy: 'fail-fast',
    },
    {
      id: 'fetch-jobs',
      capability: 'jobs.fetch',
      policy: 'fanout',
      errorPolicy: 'skip',
      reducer: { kind: 'concat' },
      inputFrom: ['parse-profile'],
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
      errorPolicy: 'skip',
      reducer: { kind: 'concat' },
      inputFrom: ['normalize-jobs', 'parse-profile'],
    },
    {
      id: 'synthesize',
      capability: 'jobs.synthesize',
      policy: 'single',
      errorPolicy: 'fail-fast',
      inputFrom: ['analyze-jobs', 'parse-profile', 'normalize-jobs'],
    },
    {
      id: 'reflect',
      capability: 'jobs.reflect',
      policy: 'single',
      errorPolicy: 'fall-through',
      inputFrom: ['synthesize', 'parse-profile'],
    },
  ],
  termination: {
    maxIterations: 3,
    stopCondition: { capability: 'jobs.search-complete' },
  },
};
```

**Step 2: Validate spec against pipeline-runner**

Create `apps/catalyst/src/spec.test.ts`:

```typescript
import { describe, it, expect } from 'bun:test';
import { validatePipelineSpec } from 'rhodium-pipeline-runner';
import { jobSeekerSpec } from './spec.js';

describe('jobSeekerSpec', () => {
  it('passes pipeline-runner validation', () => {
    const errors = validatePipelineSpec(jobSeekerSpec);
    expect(errors).toHaveLength(0);
  });

  it('has 6 stages', () => {
    expect(jobSeekerSpec.stages).toHaveLength(6);
  });

  it('all fanout stages have reducers', () => {
    const fanout = jobSeekerSpec.stages.filter((s) => s.policy === 'fanout');
    expect(fanout.every((s) => s.reducer)).toBe(true);
  });
});
```

> Note: check if `validatePipelineSpec` is exported from `rhodium-pipeline-runner`. If not, skip that test and just test the structure.

**Step 3: Run tests**

```bash
cd apps/catalyst && bun test src/spec.test.ts
```

**Step 4: Commit**

```bash
git commit -m "feat(catalyst): pipeline spec (6 stages, 3-iteration reflection loop)"
```

---

## Task 12: TUI — Pipeline View (ink)

**Files:**
- Create: `apps/catalyst/src/tui/state.ts`
- Create: `apps/catalyst/src/tui/PipelineView.tsx`
- Create: `apps/catalyst/src/tui/components.tsx`
- Create: `apps/catalyst/src/tui/state.test.ts`

**Step 1: Define TUI state shape and reducer**

Create `apps/catalyst/src/tui/state.ts`:

```typescript
export type ProviderStatus = 'pending' | 'running' | 'done' | 'failed' | 'skipped';
export type StageStatus = 'pending' | 'running' | 'done' | 'failed' | 'degraded' | 'skipped';

export interface ProviderState {
  id: string;
  status: ProviderStatus;
  durationMs?: number;
  error?: string;
}

export interface StageState {
  id: string;
  capability: string;
  status: StageStatus;
  durationMs?: number;
  providers: ProviderState[];
}

export interface TuiState {
  view: 'input' | 'pipeline' | 'results' | 'history';
  resumeName: string;
  model: string;
  iteration: number;
  maxIterations: number;
  stages: StageState[];
  results: import('../types.js').RankedJob[];
  reflectRationale?: string;
  confidence?: number;
  done: boolean;
  error?: string;
}

export type TuiAction =
  | { type: 'pipeline:start'; resumeName: string; model: string }
  | { type: 'stage:start'; stageId: string; capability: string }
  | { type: 'stage:done'; stageId: string; durationMs: number }
  | { type: 'stage:degraded'; stageId: string; reason: string }
  | { type: 'stage:skipped'; stageId: string; reason: string }
  | { type: 'provider:start'; stageId: string; providerId: string }
  | { type: 'provider:done'; stageId: string; providerId: string; durationMs: number }
  | { type: 'provider:fail'; stageId: string; providerId: string; error: string }
  | { type: 'pipeline:done'; results: import('../types.js').RankedJob[]; iteration: number; durationMs: number }
  | { type: 'pipeline:fail'; error: string }
  | { type: 'view:change'; view: TuiState['view'] };

export const initialState: TuiState = {
  view: 'input',
  resumeName: '',
  model: '',
  iteration: 1,
  maxIterations: 3,
  stages: [],
  results: [],
  done: false,
};

export function tuiReducer(state: TuiState, action: TuiAction): TuiState {
  switch (action.type) {
    case 'pipeline:start':
      return { ...state, view: 'pipeline', resumeName: action.resumeName, model: action.model, stages: [], done: false };

    case 'stage:start': {
      const existing = state.stages.find((s) => s.id === action.stageId);
      if (existing) {
        return { ...state, stages: state.stages.map((s) =>
          s.id === action.stageId ? { ...s, status: 'running', providers: [] } : s
        )};
      }
      return { ...state, stages: [...state.stages, {
        id: action.stageId, capability: action.capability,
        status: 'running', providers: [],
      }]};
    }

    case 'stage:done':
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stageId ? { ...s, status: 'done', durationMs: action.durationMs } : s
      )};

    case 'stage:degraded':
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stageId ? { ...s, status: 'degraded' } : s
      )};

    case 'provider:start':
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stageId
          ? { ...s, providers: [...s.providers, { id: action.providerId, status: 'running' }] }
          : s
      )};

    case 'provider:done':
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stageId ? { ...s, providers: s.providers.map((p) =>
          p.id === action.providerId ? { ...p, status: 'done', durationMs: action.durationMs } : p
        )} : s
      )};

    case 'provider:fail':
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stageId ? { ...s, providers: s.providers.map((p) =>
          p.id === action.providerId ? { ...p, status: 'failed', error: action.error } : p
        )} : s
      )};

    case 'pipeline:done':
      return { ...state, view: 'results', results: action.results, iteration: action.iteration, done: true };

    case 'pipeline:fail':
      return { ...state, error: action.error, done: true };

    case 'view:change':
      return { ...state, view: action.view };

    default:
      return state;
  }
}
```

**Step 2: Test the reducer**

Create `apps/catalyst/src/tui/state.test.ts`:

```typescript
import { describe, it, expect } from 'bun:test';
import { tuiReducer, initialState } from './state.js';

describe('tuiReducer', () => {
  it('transitions to pipeline view on pipeline:start', () => {
    const next = tuiReducer(initialState, { type: 'pipeline:start', resumeName: 'r.txt', model: 'gemma4' });
    expect(next.view).toBe('pipeline');
    expect(next.resumeName).toBe('r.txt');
  });

  it('adds a stage on stage:start', () => {
    let s = tuiReducer(initialState, { type: 'pipeline:start', resumeName: 'r.txt', model: 'gemma4' });
    s = tuiReducer(s, { type: 'stage:start', stageId: 'fetch-jobs', capability: 'jobs.fetch' });
    expect(s.stages).toHaveLength(1);
    expect(s.stages[0].status).toBe('running');
  });

  it('marks stage done with duration', () => {
    let s = tuiReducer(initialState, { type: 'pipeline:start', resumeName: 'r.txt', model: 'gemma4' });
    s = tuiReducer(s, { type: 'stage:start', stageId: 'fetch-jobs', capability: 'jobs.fetch' });
    s = tuiReducer(s, { type: 'stage:done', stageId: 'fetch-jobs', durationMs: 1234 });
    expect(s.stages[0].status).toBe('done');
    expect(s.stages[0].durationMs).toBe(1234);
  });
});
```

```bash
cd apps/catalyst && bun test src/tui/state.test.ts
```

Expected: PASS.

**Step 3: Create ink components**

Create `apps/catalyst/src/tui/components.tsx`:

```tsx
import React from 'react';
import { Text, Box } from 'ink';
import chalk from 'chalk';
import type { StageState, ProviderState } from './state.js';

const STATUS_ICONS: Record<string, string> = {
  pending:  '·',
  running:  '⠸',
  done:     '✓',
  failed:   '✗',
  degraded: '⚠',
  skipped:  '–',
};

function fmtDuration(ms?: number): string {
  if (!ms) return '';
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

export function ProviderRow({ provider }: { provider: ProviderState }) {
  const icon = STATUS_ICONS[provider.status];
  const color = provider.status === 'done' ? 'green'
    : provider.status === 'failed' ? 'red'
    : provider.status === 'running' ? 'yellow' : 'gray';

  return (
    <Box paddingLeft={6}>
      <Text color={color}>{icon}  {provider.id}</Text>
      {provider.durationMs && <Text color="gray">{'  '}{fmtDuration(provider.durationMs)}</Text>}
      {provider.error && <Text color="red">{'  '}failed · skipped</Text>}
    </Box>
  );
}

export function StageRow({ stage }: { stage: StageState }) {
  const icon = STATUS_ICONS[stage.status];
  const color = stage.status === 'done' ? 'green'
    : stage.status === 'failed' ? 'red'
    : stage.status === 'degraded' ? 'yellow'
    : stage.status === 'running' ? 'cyan' : 'gray';

  return (
    <Box flexDirection="column">
      <Box>
        <Box width={4}><Text color={color}>{icon}</Text></Box>
        <Text color={color}>{stage.id}</Text>
        <Text color="gray">{'  '}{fmtDuration(stage.durationMs)}</Text>
      </Box>
      {stage.providers.map((p) => <ProviderRow key={p.id} provider={p} />)}
    </Box>
  );
}

export function ScoreBar({ score }: { score: number }) {
  const filled = Math.round(score / 10);
  const bar = '█'.repeat(filled) + '▒'.repeat(10 - filled);
  const color = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';
  return <Text color={color}>{bar}</Text>;
}
```

**Step 4: Create PipelineView**

Create `apps/catalyst/src/tui/PipelineView.tsx`:

```tsx
import React from 'react';
import { Box, Text } from 'ink';
import { StageRow } from './components.js';
import type { TuiState } from './state.js';

export function PipelineView({ state }: { state: TuiState }) {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Box justifyContent="space-between">
        <Text bold color="cyan">catalyst</Text>
        <Text color="gray">iteration {state.iteration}/{state.maxIterations}  {state.done ? '✓' : '⠸'}</Text>
      </Box>
      <Box>
        <Text color="gray">resume: {state.resumeName}    model: {state.model}</Text>
      </Box>
      <Text> </Text>
      <Text bold>PIPELINE</Text>
      {state.stages.map((s) => <StageRow key={s.id} stage={s} />)}
    </Box>
  );
}
```

**Step 5: Commit**

```bash
git add apps/catalyst/src/tui/
git commit -m "feat(catalyst): TUI state reducer and pipeline view components"
```

---

## Task 13: TUI — Results + History Views

**Files:**
- Create: `apps/catalyst/src/tui/ResultsView.tsx`
- Create: `apps/catalyst/src/tui/HistoryView.tsx`
- Create: `apps/catalyst/src/tui/App.tsx`

**`ResultsView.tsx`:**

```tsx
import React from 'react';
import { Box, Text } from 'ink';
import { ScoreBar } from './components.js';
import type { TuiState } from './state.js';

export function ResultsView({ state }: { state: TuiState }) {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="green" padding={1}>
      <Box justifyContent="space-between">
        <Text bold color="green">catalyst — results</Text>
        <Text color="gray">{state.results.length} jobs · {state.iteration} iteration{state.iteration > 1 ? 's' : ''}</Text>
      </Box>
      <Text> </Text>
      {state.results.slice(0, 8).map((r, i) => (
        <Box key={r.job.id} flexDirection="column" marginBottom={1}>
          <Box>
            <Text bold>{i + 1}  {r.job.title} · {r.job.company}</Text>
            <Text color="gray">  {r.overallScore} </Text>
            <ScoreBar score={r.overallScore} />
          </Box>
          <Text color="gray">     skill {r.scores.skill}  culture {r.scores.culture}  salary {r.scores.salary}  [{r.job.source}]</Text>
          <Text color="gray">     {r.summary}</Text>
          {r.redFlags.length > 0 && <Text color="red">     ⚠ {r.redFlags.join(' · ')}</Text>}
        </Box>
      ))}
      <Text color="gray">P pipeline view · H history · Q quit</Text>
    </Box>
  );
}
```

**`HistoryView.tsx`:**

```tsx
import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import type { RunRecord } from '../types.js';

export function HistoryView({
  listRuns,
  onSelect,
  onBack,
}: {
  listRuns: () => Promise<RunRecord[]>;
  onSelect: (runId: string) => void;
  onBack: () => void;
}) {
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    listRuns().then(setRuns);
  }, []);

  useInput((input, key) => {
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1));
    if (key.downArrow) setCursor((c) => Math.min(runs.length - 1, c + 1));
    if (key.return && runs[cursor]) onSelect(runs[cursor].id);
    if (key.escape) onBack();
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1}>
      <Text bold color="yellow">catalyst — history</Text>
      <Text> </Text>
      {runs.length === 0 && <Text color="gray">No runs yet.</Text>}
      {runs.map((r, i) => (
        <Box key={r.id}>
          <Text color={i === cursor ? 'cyan' : 'white'}>
            {i === cursor ? '▸ ' : '  '}
            {r.resumeName.padEnd(30)} {r.iteration} iter · {r.durationMs}ms  {r.createdAt.slice(0, 16)}
          </Text>
        </Box>
      ))}
      <Text> </Text>
      <Text color="gray">↑↓ navigate · enter view · esc back</Text>
    </Box>
  );
}
```

**`App.tsx`** — top-level ink app wiring all views together:

```tsx
import React, { useReducer, useCallback } from 'react';
import { useInput, useApp } from 'ink';
import { tuiReducer, initialState } from './state.js';
import { PipelineView } from './PipelineView.js';
import { ResultsView } from './ResultsView.js';
import { HistoryView } from './HistoryView.js';
import type { TuiAction } from './state.js';

export function App({
  dispatch: externalDispatch,
  listRuns,
  getJobs,
}: {
  dispatch: (action: TuiAction) => void;
  listRuns: () => Promise<import('../types.js').RunRecord[]>;
  getJobs: (runId: string) => Promise<import('../types.js').RankedJob[]>;
}) {
  const [state, dispatch] = useReducer(tuiReducer, initialState);
  const { exit } = useApp();

  // Expose dispatch to external broker event wiring
  React.useEffect(() => {
    // externalDispatch is a setter provided by the entry point
    (externalDispatch as any).__inner = dispatch;
  }, [dispatch]);

  useInput((input, key) => {
    if (input === 'q' || (key.ctrl && input === 'c')) exit();
    if (input === 'p') dispatch({ type: 'view:change', view: 'pipeline' });
    if (input === 'r') dispatch({ type: 'view:change', view: 'results' });
    if (input === 'h') dispatch({ type: 'view:change', view: 'history' });
  });

  if (state.view === 'history') {
    return (
      <HistoryView
        listRuns={listRuns}
        onSelect={async (runId) => {
          const jobs = await getJobs(runId);
          dispatch({ type: 'pipeline:done', results: jobs, iteration: 1, durationMs: 0 });
        }}
        onBack={() => dispatch({ type: 'view:change', view: 'results' })}
      />
    );
  }

  if (state.view === 'results' && state.results.length > 0) {
    return <ResultsView state={state} />;
  }

  return <PipelineView state={state} />;
}
```

**Commit:**
```bash
git add apps/catalyst/src/tui/
git commit -m "feat(catalyst): TUI results and history views"
```

---

## Task 14: Input Handling + Config

**Files:**
- Create: `apps/catalyst/src/input.ts`
- Create: `apps/catalyst/src/input.test.ts`

**`input.ts`:**

```typescript
import { readFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, extname } from 'node:path';

export interface CatalystConfig {
  docsFolder: string;
  ollamaModel: string;
  ollamaUrl: string;
}

export function loadConfig(): CatalystConfig {
  const configDir = join(homedir(), '.catalyst');
  const configPath = join(configDir, 'config.json');
  if (!existsSync(configDir)) mkdirSync(configDir, { recursive: true });
  if (!existsSync(configPath)) {
    const defaults: CatalystConfig = {
      docsFolder: join(configDir, 'docs'),
      ollamaModel: 'gemma4',
      ollamaUrl: 'http://localhost:11434',
    };
    Bun.write(configPath, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  return JSON.parse(readFileSync(configPath, 'utf-8')) as CatalystConfig;
}

export async function readResumeFile(filePath: string): Promise<string> {
  // Strip quotes added by macOS Finder drag-and-drop
  const cleaned = filePath.trim().replace(/^["']|["']$/g, '');
  const resolved = cleaned.startsWith('~')
    ? join(homedir(), cleaned.slice(1))
    : cleaned;

  if (!existsSync(resolved)) throw new Error(`File not found: ${resolved}`);

  const ext = extname(resolved).toLowerCase();

  if (ext === '.txt' || ext === '.md') {
    return readFileSync(resolved, 'utf-8');
  }

  if (ext === '.pdf') {
    const pdfParse = (await import('pdf-parse')).default;
    const buffer = readFileSync(resolved);
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (ext === '.docx') {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ path: resolved });
    return result.value;
  }

  throw new Error(`Unsupported file format: ${ext}. Supported: .txt, .md, .pdf, .docx`);
}

export function listDocsFolder(folder: string): Array<{ name: string; path: string; mtime: Date }> {
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .filter((f) => ['.txt', '.md', '.pdf', '.docx'].includes(extname(f).toLowerCase()))
    .map((f) => {
      const p = join(folder, f);
      const stat = Bun.file(p);
      return { name: f, path: p, mtime: new Date(stat.lastModified) };
    })
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}
```

**Test (`input.test.ts`):**

```typescript
import { describe, it, expect } from 'bun:test';
import { readResumeFile } from './input.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

describe('readResumeFile', () => {
  it('reads a .txt file', async () => {
    const path = '/tmp/test-resume.txt';
    writeFileSync(path, 'Jane Doe, Senior Engineer');
    const text = await readResumeFile(path);
    expect(text).toContain('Jane Doe');
  });

  it('strips macOS drag-drop quotes', async () => {
    const path = '/tmp/test-resume.txt';
    writeFileSync(path, 'Jane Doe');
    const text = await readResumeFile(`"/tmp/test-resume.txt"`);
    expect(text).toContain('Jane Doe');
  });

  it('throws for unsupported extension', async () => {
    await expect(readResumeFile('/tmp/resume.xyz')).rejects.toThrow('Unsupported');
  });
});
```

**Commit:**
```bash
git commit -m "feat(catalyst): input handling, config, file parsing"
```

---

## Task 15: Entry Point — Broker Wiring

**Files:**
- Create: `apps/catalyst/src/index.ts` (replaces placeholder)

**Step 1: Write entry point**

```typescript
import { createBroker } from 'rhodium-core';
import { createPipelineRunnerPlugin } from 'rhodium-pipeline-runner';
import { render } from 'ink';
import React from 'react';
import { randomUUID } from 'node:crypto';
import minimist from 'minimist';

import { ollamaProviderPlugin } from './plugins/ollama-provider.js';
import { resultsStorePlugin } from './plugins/results-store.js';
import { indeedFetcherPlugin } from './plugins/indeed-fetcher.js';
import { linkedinFetcherPlugin } from './plugins/linkedin-fetcher.js';
import { remotiveFetcherPlugin } from './plugins/remotive-fetcher.js';
import { profileParserPlugin } from './plugins/profile-parser.js';
import { jobNormalizerPlugin } from './plugins/job-normalizer.js';
import { skillMatcherPlugin } from './plugins/skill-matcher.js';
import { cultureFitAnalyzerPlugin } from './plugins/culture-fit-analyzer.js';
import { salaryEstimatorPlugin } from './plugins/salary-estimator.js';
import { synthesizerPlugin } from './plugins/synthesizer.js';
import { reflectionAgentPlugin } from './plugins/reflection-agent.js';
import { jobSeekerSpec } from './spec.js';
import { loadConfig, readResumeFile, listDocsFolder } from './input.js';
import { App } from './tui/App.js';
import type { TuiAction } from './tui/state.js';
import type { RankedJob } from './types.js';

import { PIPELINE_EVENTS, STAGE_EVENTS, PROVIDER_EVENTS } from 'rhodium-pipeline-runner';

async function main() {
  const argv = minimist(process.argv.slice(2));
  const config = loadConfig();
  const model = argv.model ?? config.ollamaModel;

  // --- Resolve resume input ---
  let resumeText: string;
  let resumeName: string;

  if (argv._[0]) {
    resumeText = await readResumeFile(argv._[0]);
    resumeName = argv._[0].split('/').pop() ?? argv._[0];
  } else {
    // Default to first file in docs folder for now (full TUI input menu is a stretch goal)
    const docs = listDocsFolder(config.docsFolder);
    if (!docs.length) {
      console.error(`No resume found. Pass a file path: bun run catalyst resume.txt`);
      process.exit(1);
    }
    resumeText = await readResumeFile(docs[0].path);
    resumeName = docs[0].name;
  }

  // --- Set up broker ---
  const broker = createBroker({ debug: !!argv.debug });

  broker.register(ollamaProviderPlugin({ model, baseUrl: config.ollamaUrl }));
  broker.register(resultsStorePlugin());
  broker.register(createPipelineRunnerPlugin());

  // Demo mode: flaky LinkedIn to show error isolation
  const flaky = !!argv.flaky;
  broker.register(indeedFetcherPlugin());
  broker.register(linkedinFetcherPlugin({ flaky }));
  broker.register(remotiveFetcherPlugin());

  broker.register(profileParserPlugin());
  broker.register(jobNormalizerPlugin());
  broker.register(skillMatcherPlugin());
  broker.register(cultureFitAnalyzerPlugin());
  broker.register(salaryEstimatorPlugin());
  broker.register(synthesizerPlugin());
  broker.register(reflectionAgentPlugin());

  await broker.activate();

  // --- Wire TUI ---
  let innerDispatch: ((action: TuiAction) => void) | null = null;
  const dispatch = (action: TuiAction) => innerDispatch?.(action);
  const query = broker.resolve<{ listRuns: Function; getJobs: Function }>('results.query');

  const { unmount } = render(
    React.createElement(App, {
      dispatch,
      listRuns: () => query.listRuns(),
      getJobs: (id: string) => query.getJobs(id),
    })
  );

  // Give App time to mount and register __inner
  await new Promise((r) => setTimeout(r, 50));

  // Bridge broker events → TUI dispatch
  broker.on(PIPELINE_EVENTS.STARTED, ({ specName }) =>
    dispatch({ type: 'pipeline:start', resumeName, model }));

  broker.on(STAGE_EVENTS.STARTED, ({ stageId, capability }) =>
    dispatch({ type: 'stage:start', stageId, capability }));

  broker.on(STAGE_EVENTS.COMPLETE, ({ stageId, durationMs }) =>
    dispatch({ type: 'stage:done', stageId, durationMs }));

  broker.on(STAGE_EVENTS.DEGRADED, ({ stageId, reason }) =>
    dispatch({ type: 'stage:degraded', stageId, reason }));

  broker.on(PROVIDER_EVENTS.SELECTED, ({ stageId, providerId }) =>
    dispatch({ type: 'provider:start', stageId, providerId }));

  broker.on(PROVIDER_EVENTS.FAILED, ({ stageId, providerId, error }) =>
    dispatch({ type: 'provider:fail', stageId, providerId, error: String(error) }));

  // --- Run pipeline ---
  const runner = broker.resolve<{ run: Function }>('pipeline-runner');
  const runId = randomUUID();
  const start = Date.now();

  try {
    const result = await runner.run(jobSeekerSpec, { resumeText, resumeName });
    const jobs = (result.stageOutputs.get('synthesize') ?? []) as RankedJob[];
    const durationMs = Date.now() - start;

    // Persist results
    const store = broker.resolve<{ save: Function }>('results.store');
    await store.save(runId, resumeName, model, result.iteration, durationMs, jobs);

    dispatch({ type: 'pipeline:done', results: jobs, iteration: result.iteration, durationMs });
  } catch (err) {
    dispatch({ type: 'pipeline:fail', error: String(err) });
  }
}

main().catch(console.error);
```

**Step 2: Run end-to-end smoke test (requires Ollama running)**

```bash
# Requires: ollama serve (in a separate terminal)
# Requires: ollama pull gemma4

echo "Jane Doe\nSenior TypeScript Engineer\n7 years experience\nSkills: TypeScript, React, Node.js\nPrefers remote" > /tmp/test-resume.txt

bun run apps/catalyst/src/index.ts /tmp/test-resume.txt --debug
```

Expected: TUI renders, stages tick through, results appear.

**Step 3: Test demo mode (flaky LinkedIn)**

```bash
bun run apps/catalyst/src/index.ts /tmp/test-resume.txt --flaky
```

Expected: LinkedIn shows `✗ failed · skipped`, pipeline continues with Indeed + Remotive.

**Step 4: Commit**

```bash
git add apps/catalyst/src/index.ts
git commit -m "feat(catalyst): entry point, broker wiring, pipeline execution"
```

---

## Task 16: End-to-End Integration Test (mock LLMs)

**Files:**
- Create: `apps/catalyst/src/integration.test.ts`

**Step 1: Write integration test with all mock LLMs**

```typescript
import { describe, it, expect } from 'bun:test';
import { createBroker } from 'rhodium-core';
import { createPipelineRunnerPlugin } from 'rhodium-pipeline-runner';
import { indeedFetcherPlugin } from './plugins/indeed-fetcher.js';
import { linkedinFetcherPlugin } from './plugins/linkedin-fetcher.js';
import { profileParserPlugin } from './plugins/profile-parser.js';
import { jobNormalizerPlugin } from './plugins/job-normalizer.js';
import { skillMatcherPlugin } from './plugins/skill-matcher.js';
import { cultureFitAnalyzerPlugin } from './plugins/culture-fit-analyzer.js';
import { salaryEstimatorPlugin } from './plugins/salary-estimator.js';
import { synthesizerPlugin } from './plugins/synthesizer.js';
import { reflectionAgentPlugin } from './plugins/reflection-agent.js';
import { resultsStorePlugin } from './plugins/results-store.js';
import { jobSeekerSpec } from './spec.js';
import type { CandidateProfile, NormalizedJob, JobAnalysis, RankedJob, ReflectOutput } from './types.js';

// Deterministic mock LLM responses keyed by prompt content
function createMockLLM() {
  return {
    generate: async (prompt: string): Promise<string> => {
      if (prompt.includes('resume parser')) {
        return JSON.stringify({
          name: 'Jane Doe', skills: ['TypeScript', 'React'], yearsExperience: 7,
          titles: ['Senior Engineer'], preferredLocations: ['Remote'],
          remotePreference: 'remote', salaryExpectation: { min: 180000, max: 220000, currency: 'USD' },
        } satisfies CandidateProfile);
      }
      if (prompt.includes('normalizer')) {
        const jobs = [
          { id: 'indeed-1', title: 'Senior TS Engineer', company: 'Acme', location: 'Remote',
            remote: true, skills: ['TypeScript'], description: 'Great role', url: 'https://x.com', source: 'indeed' },
        ] satisfies NormalizedJob[];
        return JSON.stringify(jobs);
      }
      if (prompt.includes('skill matcher')) {
        return JSON.stringify([
          { jobId: 'indeed-1', variant: 'skill', score: 88, reasoning: 'Strong TS', signals: ['TypeScript'] },
        ] satisfies JobAnalysis[]);
      }
      if (prompt.includes('culture fit')) {
        return JSON.stringify([
          { jobId: 'indeed-1', variant: 'culture', score: 90, reasoning: 'Remote role', signals: ['Remote'] },
        ] satisfies JobAnalysis[]);
      }
      if (prompt.includes('salary')) {
        return JSON.stringify([
          { jobId: 'indeed-1', variant: 'salary', score: 82, reasoning: 'In range', signals: ['Competitive'] },
        ] satisfies JobAnalysis[]);
      }
      if (prompt.includes('synthesizer')) {
        return JSON.stringify([{
          jobId: 'indeed-1', overallScore: 87,
          scores: { skill: 88, culture: 90, salary: 82 },
          summary: 'Excellent TypeScript match with remote work.',
          redFlags: [],
        }]);
      }
      if (prompt.includes('reflection')) {
        return JSON.stringify({
          confidence: 0.9, rationale: 'Results are strong', searchRefinements: null,
        } satisfies ReflectOutput);
      }
      return '[]';
    },
  };
}

describe('end-to-end pipeline', () => {
  it('runs full pipeline and returns ranked jobs', async () => {
    const broker = createBroker({ activationTimeoutMs: 10_000 });

    broker.register({
      key: 'mock-llm', version: '1.0.0',
      manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
      activate(ctx) { ctx.provide('llm.generate', createMockLLM()); },
    });

    broker.register(resultsStorePlugin({ dbPath: ':memory:' }));
    broker.register(createPipelineRunnerPlugin());
    broker.register(indeedFetcherPlugin());
    broker.register(linkedinFetcherPlugin());
    broker.register(profileParserPlugin());
    broker.register(jobNormalizerPlugin());
    broker.register(skillMatcherPlugin());
    broker.register(cultureFitAnalyzerPlugin());
    broker.register(salaryEstimatorPlugin());
    broker.register(synthesizerPlugin());
    broker.register(reflectionAgentPlugin());

    await broker.activate();

    const runner = broker.resolve<{ run: Function }>('pipeline-runner');
    const result = await runner.run(jobSeekerSpec, {
      resumeText: 'Jane Doe, Senior TypeScript Engineer, 7 years',
      resumeName: 'jane.txt',
    });

    expect(result.stopped).toBe(true); // reflection agent confidence >= 0.8
    const jobs = result.stageOutputs.get('synthesize') as RankedJob[];
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs[0].overallScore).toBeGreaterThan(0);
  }, 30_000);

  it('continues when linkedin-fetcher fails (error isolation)', async () => {
    const broker = createBroker({ activationTimeoutMs: 10_000 });

    broker.register({
      key: 'mock-llm', version: '1.0.0',
      manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
      activate(ctx) { ctx.provide('llm.generate', createMockLLM()); },
    });

    broker.register(resultsStorePlugin({ dbPath: ':memory:' }));
    broker.register(createPipelineRunnerPlugin());
    broker.register(indeedFetcherPlugin());
    broker.register(linkedinFetcherPlugin({ flaky: true })); // ← will throw
    broker.register(profileParserPlugin());
    broker.register(jobNormalizerPlugin());
    broker.register(skillMatcherPlugin());
    broker.register(cultureFitAnalyzerPlugin());
    broker.register(salaryEstimatorPlugin());
    broker.register(synthesizerPlugin());
    broker.register(reflectionAgentPlugin());

    await broker.activate();

    const runner = broker.resolve<{ run: Function }>('pipeline-runner');
    // Should not throw — fetch-jobs has errorPolicy: 'skip'
    const result = await runner.run(jobSeekerSpec, {
      resumeText: 'Jane Doe, Senior TypeScript Engineer',
      resumeName: 'jane.txt',
    });

    expect(result).toBeDefined(); // pipeline completed despite LinkedIn failure
  }, 30_000);
});
```

**Step 2: Run integration tests**

```bash
cd apps/catalyst && bun test src/integration.test.ts --timeout 30000
```

Expected: both tests PASS.

**Step 3: Final commit**

```bash
git add apps/catalyst/src/integration.test.ts
git commit -m "test(catalyst): end-to-end integration tests with mock LLMs"
```

---

## Checklist

- [ ] Task 1: Package scaffold
- [ ] Task 2: Types + capabilities
- [ ] Task 3: results-store plugin
- [ ] Task 4: ollama-provider plugin
- [ ] Task 5: REST fetcher plugins
- [ ] Task 6: profile-parser plugin
- [ ] Task 7: job-normalizer plugin
- [ ] Task 8: Scoring plugins (3×)
- [ ] Task 9: synthesizer plugin
- [ ] Task 10: reflection-agent plugin
- [ ] Task 11: Pipeline spec
- [ ] Task 12: TUI pipeline view
- [ ] Task 13: TUI results + history views
- [ ] Task 14: Input handling + config
- [ ] Task 15: Entry point + broker wiring
- [ ] Task 16: End-to-end integration test
