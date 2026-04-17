import type { Plugin } from 'rhodium-core';
import { salaryEstimatorPrompt } from '../prompts/salary-estimator.js';
import { parseLLMJson } from '../llm-parse.js';
import type { CandidateProfile, JobAnalysis, NormalizedJob } from '../types.js';

export function salaryEstimatorPlugin(): Plugin {
  return {
    key: 'salary-estimator',
    version: '1.0.0',
    manifest: {
      name: 'Salary Estimator',
      description: 'Estimates compensation fit between candidate expectations and jobs',
      provides: [{ capability: 'jobs.analyze', priority: 80 }],
      needs: [{ capability: 'llm.generate' }],
    },
    activate(ctx) {
      const llm = ctx.resolve<{ generate: (prompt: string) => Promise<string> }>('llm.generate');
      ctx.provide('jobs.analyze', async (input: {
        'normalize-jobs': unknown;
        'parse-profile': CandidateProfile;
      }): Promise<JobAnalysis[]> => {
        // concatReducer wraps single-provider output — flatten
        const jobs = (Array.isArray(input['normalize-jobs'])
          ? (input['normalize-jobs'] as unknown[]).flat()
          : []) as NormalizedJob[];
        const raw = await llm.generate(
          salaryEstimatorPrompt(jobs, input['parse-profile'])
        );
        return parseLLMJson<JobAnalysis[]>(raw, 'salary-estimator');
      });
    },
  };
}
