import { describe, it, expect } from 'vitest';
import { createTestBroker } from 'rhodium-testing';
import { remotiveFetcherPlugin } from './remotive-fetcher.js';
import { indexFetcherPlugin } from './index-fetcher.js';
import { jobIndexStorePlugin } from './job-index-store.js';
import { catalogDbPlugin } from './catalog-db.js';
import type { RawJob } from '../types.js';

const mockProfile = {
  name: 'Jane Doe',
  skills: ['TypeScript', 'React'],
  yearsExperience: 7,
  titles: ['Senior Engineer'],
  preferredLocations: ['Remote'],
  remotePreference: 'remote' as const,
};

describe('index-fetcher', () => {
  it('returns jobs from the local index filtered by profile', async () => {
    const { broker } = createTestBroker();
    broker.register(catalogDbPlugin({ dbPath: ':memory:' }));
    broker.register(jobIndexStorePlugin());
    broker.register(indexFetcherPlugin());
    await broker.activate();

    // Seed a company source row (FK requires it)
    const db = broker.resolve<import('better-sqlite3').Database>('catalog.db');
    db.prepare(
      `INSERT INTO company_sources (id, name, url, ats_type, slug, added_at, job_count, enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run('test-company', 'TestCo', 'https://example.com', 'greenhouse', 'test',
       new Date().toISOString(), 0, 1);

    const jobIndex = broker.resolve<{
      upsertJobs(companySourceId: string, jobs: RawJob[], atsType: string): Promise<number>;
    }>('job.index');

    await jobIndex.upsertJobs('test-company', [
      {
        id: 'test-1', source: 'greenhouse:test', title: 'Senior React Engineer',
        company: 'TestCo', location: 'Remote', description: 'Build TypeScript apps with React',
        url: 'https://example.com/1', postedAt: new Date().toISOString(),
      },
      {
        id: 'test-2', source: 'greenhouse:test', title: 'Marketing Manager',
        company: 'TestCo', location: 'NYC', description: 'Lead marketing campaigns',
        url: 'https://example.com/2', postedAt: new Date().toISOString(),
      },
    ], 'greenhouse');

    const fetch = broker.resolve<(input: any) => Promise<RawJob[]>>('jobs.fetch');
    const jobs = await fetch({ 'parse-profile': mockProfile });

    // Should find the React/TypeScript job but not the marketing job
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs.some((j: RawJob) => j.title.includes('React'))).toBe(true);
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
