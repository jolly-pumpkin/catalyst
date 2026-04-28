import type { Plugin } from 'rhodium-core';
import { cultureFitPrompt } from '../prompts/culture-fit-analyzer.js';
import { parseLLMJson } from '../llm-parse.js';
import { withConcurrency } from '../concurrency.js';
import { hashProfile } from '../profile-hash.js';
import type { CandidateProfile, JobAnalysis, NormalizedJob } from '../types.js';

export function cultureFitAnalyzerPlugin(): Plugin {
  return {
    key: 'culture-fit-analyzer',
    version: '1.0.0',
    manifest: {
      name: 'Culture Fit Analyzer',
      description: 'Scores culture and values alignment between candidate and jobs',
      provides: [{ capability: 'jobs.analyze', priority: 90 }],
      needs: [{ capability: 'llm.generate' }],
    },
    activate(ctx) {
      const llm = ctx.resolve<{ generate: (prompt: string) => Promise<string> }>('llm.generate');

      let resultsQuery: {
        getLatestRunId(): Promise<string | null>;
        getRunDetail(id: string): Promise<{ profile?: CandidateProfile; analyses?: JobAnalysis[] } | null>;
      } | null = null;
      try { resultsQuery = ctx.resolve('results.query'); } catch { /* not available */ }

      ctx.provide('jobs.analyze', async (input: {
        'normalize-jobs': unknown;
        'parse-profile': CandidateProfile;
      }): Promise<JobAnalysis[]> => {
        const jobs = (Array.isArray(input['normalize-jobs'])
          ? (input['normalize-jobs'] as unknown[]).flat()
          : []) as NormalizedJob[];
        const profile = input['parse-profile'];

        const prevAnalyses = new Map<string, JobAnalysis>();
        if (resultsQuery) {
          const latestRunId = await resultsQuery.getLatestRunId();
          if (latestRunId) {
            const detail = await resultsQuery.getRunDetail(latestRunId);
            if (detail?.profile && hashProfile(detail.profile) === hashProfile(profile)) {
              for (const a of detail.analyses ?? [])
                if (a.variant === 'culture') prevAnalyses.set(a.jobId, a);
            }
          }
        }

        ctx.emit('job:progress', { stage: 'analyze-jobs', provider: 'culture', total: jobs.length, completed: 0, cached: 0 });
        let completed = 0;
        let cached = 0;
        return withConcurrency(jobs, async (job) => {
          const prev = prevAnalyses.get(job.id);
          if (prev) {
            cached++; completed++;
            ctx.emit('job:progress', { stage: 'analyze-jobs', provider: 'culture', total: jobs.length, completed, cached, jobTitle: job.title, jobCompany: job.company, status: 'cached' });
            return prev;
          }
          ctx.emit('job:progress', { stage: 'analyze-jobs', provider: 'culture', total: jobs.length, completed, cached, jobTitle: job.title, jobCompany: job.company, status: 'processing' });
          const raw = await llm.generate(cultureFitPrompt(job, profile));
          const result = parseLLMJson<JobAnalysis>(raw, 'culture-fit-analyzer');
          completed++;
          ctx.emit('job:progress', { stage: 'analyze-jobs', provider: 'culture', total: jobs.length, completed, cached, jobTitle: job.title, jobCompany: job.company, status: 'done' });
          return result;
        }, { limit: 3 });
      });
    },
  };
}
