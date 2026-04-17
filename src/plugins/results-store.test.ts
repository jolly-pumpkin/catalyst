import { describe, it, expect } from 'vitest';
import { createTestBroker } from 'rhodium-testing';
import { resultsStorePlugin } from './results-store.js';
import type { RankedJob, RunRecord } from '../types.js';

describe('results-store plugin', () => {
  it('saves and retrieves a run', async () => {
    const { broker } = createTestBroker();
    broker.register(resultsStorePlugin({ dbPath: ':memory:' }));
    await broker.activate();

    const store = broker.resolve<{
      save(runId: string, resumeName: string, model: string,
           iteration: number, durationMs: number, jobs: RankedJob[]): Promise<void>;
    }>('results.store');
    const query = broker.resolve<{
      listRuns(): Promise<RunRecord[]>;
      getJobs(runId: string): Promise<RankedJob[]>;
    }>('results.query');

    await store.save('run-1', 'resume.txt', 'gemma4', 2, 5000, [
      {
        job: {
          id: 'j1', title: 'Senior Engineer', company: 'Stripe',
          location: 'Remote', remote: true, skills: ['TypeScript'],
          description: '', url: 'https://stripe.com', source: 'indeed',
        },
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
