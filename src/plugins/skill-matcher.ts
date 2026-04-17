import type { Plugin } from 'rhodium-core';
import { skillMatcherPrompt } from '../prompts/skill-matcher.js';
import { parseLLMJson } from '../llm-parse.js';
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
          skillMatcherPrompt(jobs, input['parse-profile'])
        );
        return parseLLMJson<JobAnalysis[]>(raw, 'skill-matcher');
      });
    },
  };
}
