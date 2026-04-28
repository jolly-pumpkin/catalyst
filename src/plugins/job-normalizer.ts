import type { Plugin } from 'rhodium-core';
import { jobNormalizerPrompt } from '../prompts/job-normalizer.js';
import { parseLLMJson } from '../llm-parse.js';
import { withConcurrency } from '../concurrency.js';
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
      const llm = ctx.resolve<{ generate: (prompt: string) => Promise<string> }>('llm.generate');

      // Optional: reuse normalized jobs from previous runs
      let resultsQuery: {
        getLatestRunId(): Promise<string | null>;
        getRunDetail(id: string): Promise<{ normalizedJobs?: NormalizedJob[] } | null>;
      } | null = null;
      try { resultsQuery = ctx.resolve('results.query'); } catch { /* not available */ }

      ctx.provide('jobs.normalize', async (input: { 'fetch-jobs': unknown }): Promise<NormalizedJob[]> => {
        const jobs = (Array.isArray(input['fetch-jobs'])
          ? (input['fetch-jobs'] as unknown[]).flat()
          : []) as RawJob[];
        if (!jobs.length) return [];

        // Build cache from previous run's normalized jobs
        const prevNormalized = new Map<string, NormalizedJob>();
        if (resultsQuery) {
          const latestRunId = await resultsQuery.getLatestRunId();
          if (latestRunId) {
            const detail = await resultsQuery.getRunDetail(latestRunId);
            for (const nj of detail?.normalizedJobs ?? []) prevNormalized.set(nj.id, nj);
          }
        }

        ctx.emit('job:progress', { stage: 'normalize-jobs', total: jobs.length, completed: 0, cached: 0 });

        let completed = 0;
        let cached = 0;
        return withConcurrency(jobs, async (job) => {
          const prev = prevNormalized.get(job.id);
          if (prev) {
            cached++;
            completed++;
            ctx.emit('job:progress', { stage: 'normalize-jobs', total: jobs.length, completed, cached, jobTitle: job.title, jobCompany: job.company, status: 'cached' });
            return prev;
          }
          ctx.emit('job:progress', { stage: 'normalize-jobs', total: jobs.length, completed, cached, jobTitle: job.title, jobCompany: job.company, status: 'processing' });
          const raw = await llm.generate(jobNormalizerPrompt(job));
          const result = parseLLMJson<NormalizedJob>(raw, 'job-normalizer');
          completed++;
          ctx.emit('job:progress', { stage: 'normalize-jobs', total: jobs.length, completed, cached, jobTitle: job.title, jobCompany: job.company, status: 'done' });
          return result;
        }, { limit: 3 });
      });
    },
  };
}
