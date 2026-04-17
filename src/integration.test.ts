import { describe, it, expect } from 'vitest';
import { createBroker } from 'rhodium-core';
import { createPipelineRunnerPlugin } from 'rhodium-pipeline-runner';
import { catalogDbPlugin } from './plugins/catalog-db.js';
import { jobIndexStorePlugin } from './plugins/job-index-store.js';
import { indexFetcherPlugin } from './plugins/index-fetcher.js';
import { profileParserPlugin } from './plugins/profile-parser.js';
import { jobNormalizerPlugin } from './plugins/job-normalizer.js';
import { skillMatcherPlugin } from './plugins/skill-matcher.js';
import { cultureFitAnalyzerPlugin } from './plugins/culture-fit-analyzer.js';
import { salaryEstimatorPlugin } from './plugins/salary-estimator.js';
import { synthesizerPlugin } from './plugins/synthesizer.js';
import { reflectionAgentPlugin } from './plugins/reflection-agent.js';
import { resultsStorePlugin } from './plugins/results-store.js';
import { jobSeekerSpec } from './spec.js';
import type { CandidateProfile, NormalizedJob, JobAnalysis, RankedJob, ReflectOutput, RawJob } from './types.js';
import type { PipelineRunner } from 'rhodium-pipeline-runner';

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
      if (prompt.includes('job data normalizer')) {
        return JSON.stringify([
          { id: 'test-1', title: 'Senior TS Engineer', company: 'Acme', location: 'Remote',
            remote: true, skills: ['TypeScript'], description: 'Great role', url: 'https://x.com', source: 'greenhouse:test' },
        ] satisfies NormalizedJob[]);
      }
      if (prompt.includes('technical skill matcher')) {
        return JSON.stringify([
          { jobId: 'test-1', variant: 'skill', score: 88, reasoning: 'Strong TS', signals: ['TypeScript'] },
        ] satisfies JobAnalysis[]);
      }
      if (prompt.includes('culture fit analyzer')) {
        return JSON.stringify([
          { jobId: 'test-1', variant: 'culture', score: 90, reasoning: 'Remote role', signals: ['Remote'] },
        ] satisfies JobAnalysis[]);
      }
      if (prompt.includes('job match synthesizer')) {
        return JSON.stringify([{
          jobId: 'test-1', overallScore: 87,
          scores: { skill: 88, culture: 90, salary: 82 },
          summary: 'Excellent TypeScript match with remote work.',
          redFlags: [],
        }]);
      }
      if (prompt.includes('salary fit estimator')) {
        return JSON.stringify([
          { jobId: 'test-1', variant: 'salary', score: 82, reasoning: 'In range', signals: ['Competitive'] },
        ] satisfies JobAnalysis[]);
      }
      if (prompt.includes('reflection agent')) {
        return JSON.stringify({
          confidence: 0.9, rationale: 'Results are strong', searchRefinements: undefined,
        } satisfies ReflectOutput);
      }
      return '[]';
    },
  };
}

function registerMockLLM(broker: ReturnType<typeof createBroker>) {
  broker.register({
    key: 'mock-llm', version: '1.0.0',
    manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
    activate(ctx) { ctx.provide('llm.generate', createMockLLM()); },
  });
}

const seedJobs: RawJob[] = [
  {
    id: 'test-1', source: 'greenhouse:test', title: 'Senior TypeScript Engineer',
    company: 'Acme', location: 'Remote',
    description: 'Build modern TypeScript and React applications. Remote position.',
    url: 'https://example.com/1', postedAt: new Date().toISOString(),
  },
  {
    id: 'test-2', source: 'greenhouse:test', title: 'Backend Python Developer',
    company: 'Acme', location: 'NYC',
    description: 'Python Django backend development.',
    url: 'https://example.com/2', postedAt: new Date().toISOString(),
  },
];

describe('end-to-end pipeline', () => {
  it('runs full pipeline with index-fetcher and returns ranked jobs', async () => {
    const broker = createBroker({ activationTimeoutMs: 10_000 });

    registerMockLLM(broker);
    broker.register(resultsStorePlugin({ dbPath: ':memory:' }));
    broker.register(createPipelineRunnerPlugin());
    broker.register(catalogDbPlugin({ dbPath: ':memory:' }));
    broker.register(jobIndexStorePlugin());
    broker.register(indexFetcherPlugin());
    broker.register(profileParserPlugin());
    broker.register(jobNormalizerPlugin());
    broker.register(skillMatcherPlugin());
    broker.register(cultureFitAnalyzerPlugin());
    broker.register(salaryEstimatorPlugin());
    broker.register(synthesizerPlugin());
    broker.register(reflectionAgentPlugin());

    await broker.activate();

    // Seed a company source row (FK requires it), then seed jobs
    const db = broker.resolve<import('better-sqlite3').Database>('catalog.db');
    db.prepare(
      `INSERT INTO company_sources (id, name, url, ats_type, slug, added_at, job_count, enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run('test-company', 'Acme', 'https://example.com', 'greenhouse', 'test',
       new Date().toISOString(), 0, 1);

    const jobIndex = broker.resolve<{
      upsertJobs(companySourceId: string, jobs: RawJob[], atsType: string): Promise<number>;
    }>('job.index');
    await jobIndex.upsertJobs('test-company', seedJobs, 'greenhouse');

    const runner = broker.resolve<PipelineRunner>('pipeline-runner');
    const result = await runner.run(jobSeekerSpec, {
      resumeText: 'Jane Doe, Senior TypeScript Engineer, 7 years',
      resumeName: 'jane.txt',
    });

    expect(result.stopped).toBe(true);
    const jobs = result.stageOutputs.get('synthesize') as RankedJob[];
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs[0]!.overallScore).toBeGreaterThan(0);
  }, 30_000);
});
