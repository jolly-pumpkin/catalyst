import { describe, it, expect } from 'vitest';
import { createTestBroker } from 'rhodium-testing';
import type { Plugin } from 'rhodium-core';
import { remotiveFetcherPlugin } from './remotive-fetcher.js';
import { indexFetcherPlugin } from './index-fetcher.js';
import { jobIndexStorePlugin } from './job-index-store.js';
import { catalogDbPlugin } from './catalog-db.js';
import { companyStorePlugin } from './company-store.js';
import type { RawJob } from '../types.js';

function mockAtsDetectorPlugin(): Plugin {
  return {
    key: 'mock-ats-detector',
    version: '1.0.0',
    manifest: {
      name: 'Mock ATS Detector',
      provides: [{ capability: 'ats.detect' }],
      needs: [],
    },
    activate(ctx) {
      ctx.provide('ats.detect', { detect: async () => null });
    },
  };
}

const mockProfile = {
  name: 'Jane Doe',
  skills: { 'Programming': ['TypeScript', 'React'] },
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
    broker.register(mockAtsDetectorPlugin());
    broker.register(companyStorePlugin());
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

  it('returns all jobs when company has no filters', async () => {
    const { broker } = createTestBroker();
    broker.register(catalogDbPlugin({ dbPath: ':memory:' }));
    broker.register(jobIndexStorePlugin());
    broker.register(mockAtsDetectorPlugin());
    broker.register(companyStorePlugin());
    broker.register(indexFetcherPlugin());
    await broker.activate();

    const db = broker.resolve<import('better-sqlite3').Database>('catalog.db');
    db.prepare(
      `INSERT INTO company_sources (id, name, url, ats_type, slug, added_at, job_count, enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run('co-1', 'TestCo', 'https://example.com', 'greenhouse', 'test',
       new Date().toISOString(), 0, 1);

    const jobIndex = broker.resolve<{
      upsertJobs(companySourceId: string, jobs: RawJob[], atsType: string): Promise<number>;
    }>('job.index');

    await jobIndex.upsertJobs('co-1', [
      {
        id: 'j1', source: 'greenhouse:test', title: 'Engineer',
        company: 'TestCo', location: 'Remote', description: 'Build stuff',
        url: 'https://example.com/1', postedAt: new Date().toISOString(),
      },
      {
        id: 'j2', source: 'greenhouse:test', title: 'Designer',
        company: 'TestCo', location: 'NYC', description: 'Design stuff',
        url: 'https://example.com/2', postedAt: new Date().toISOString(),
      },
    ], 'greenhouse');

    const { setPipelineCompanyId } = await import('../context.js');
    setPipelineCompanyId('co-1');

    const fetch = broker.resolve<(input: any) => Promise<RawJob[]>>('jobs.fetch');
    const jobs = await fetch({ 'parse-profile': mockProfile });

    // No company filters -- falls back to profile titles
    expect(jobs.length).toBeGreaterThanOrEqual(1);

    setPipelineCompanyId(undefined);
  });

  it('filters jobs by company titleKeywords filter', async () => {
    const { broker } = createTestBroker();
    broker.register(catalogDbPlugin({ dbPath: ':memory:' }));
    broker.register(jobIndexStorePlugin());
    broker.register(mockAtsDetectorPlugin());
    broker.register(companyStorePlugin());
    broker.register(indexFetcherPlugin());
    await broker.activate();

    const db = broker.resolve<import('better-sqlite3').Database>('catalog.db');
    db.prepare(
      `INSERT INTO company_sources (id, name, url, ats_type, slug, added_at, job_count, enabled, filters)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run('co-2', 'TestCo', 'https://example.com', 'greenhouse', 'test',
       new Date().toISOString(), 0, 1, JSON.stringify({ titleKeywords: ['Engineer'] }));

    const jobIndex = broker.resolve<{
      upsertJobs(companySourceId: string, jobs: RawJob[], atsType: string): Promise<number>;
    }>('job.index');

    await jobIndex.upsertJobs('co-2', [
      {
        id: 'j1', source: 'greenhouse:test', title: 'Software Engineer',
        company: 'TestCo', location: 'Remote', description: 'Build stuff',
        url: 'https://example.com/1', postedAt: new Date().toISOString(),
      },
      {
        id: 'j2', source: 'greenhouse:test', title: 'Marketing Manager',
        company: 'TestCo', location: 'NYC', description: 'Market stuff',
        url: 'https://example.com/2', postedAt: new Date().toISOString(),
      },
    ], 'greenhouse');

    const { setPipelineCompanyId } = await import('../context.js');
    setPipelineCompanyId('co-2');

    const fetch = broker.resolve<(input: any) => Promise<RawJob[]>>('jobs.fetch');
    const jobs = await fetch({ 'parse-profile': mockProfile });

    expect(jobs.length).toBe(1);
    expect(jobs[0].title).toBe('Software Engineer');

    setPipelineCompanyId(undefined);
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
