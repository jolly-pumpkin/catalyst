import type { Plugin } from 'rhodium-core';
import { jobNormalizerPrompt } from '../prompts/job-normalizer.js';
import { parseLLMJson } from '../llm-parse.js';
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
      ctx.provide('jobs.normalize', async (input: { 'fetch-jobs': unknown }): Promise<NormalizedJob[]> => {
        // concatReducer returns nested arrays — flatten them
        const jobs = (Array.isArray(input['fetch-jobs'])
          ? (input['fetch-jobs'] as unknown[]).flat()
          : []) as RawJob[];
        if (!jobs.length) return [];
        const raw = await llm.generate(jobNormalizerPrompt(jobs));
        return parseLLMJson<NormalizedJob[]>(raw, 'job-normalizer');
      });
    },
  };
}
