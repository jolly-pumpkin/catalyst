import type { Plugin } from 'rhodium-core';
import { cultureFitPrompt } from '../prompts/culture-fit-analyzer.js';
import { parseLLMJson } from '../llm-parse.js';
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
      ctx.provide('jobs.analyze', async (input: {
        'normalize-jobs': unknown;
        'parse-profile': CandidateProfile;
      }): Promise<JobAnalysis[]> => {
        // concatReducer wraps single-provider output — flatten
        const jobs = (Array.isArray(input['normalize-jobs'])
          ? (input['normalize-jobs'] as unknown[]).flat()
          : []) as NormalizedJob[];
        const raw = await llm.generate(
          cultureFitPrompt(jobs, input['parse-profile'])
        );
        return parseLLMJson<JobAnalysis[]>(raw, 'culture-fit-analyzer');
      });
    },
  };
}
