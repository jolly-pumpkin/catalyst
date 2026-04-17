import type { Plugin } from 'rhodium-core';
import { synthesizerPrompt } from '../prompts/synthesizer.js';
import { parseLLMJson } from '../llm-parse.js';
import type { CandidateProfile, JobAnalysis, NormalizedJob, RankedJob } from '../types.js';

export function synthesizerPlugin(): Plugin {
  return {
    key: 'synthesizer',
    version: '1.0.0',
    manifest: {
      name: 'Synthesizer',
      description: 'Merges analysis scores into a ranked job list',
      provides: [{ capability: 'jobs.synthesize' }],
      needs: [{ capability: 'llm.generate' }],
    },
    activate(ctx) {
      const llm = ctx.resolve<{ generate: (prompt: string) => Promise<string> }>('llm.generate');
      ctx.provide('jobs.synthesize', async (input: {
        'analyze-jobs': unknown;
        'parse-profile': CandidateProfile;
        'normalize-jobs': unknown;
      }): Promise<RankedJob[]> => {
        // concatReducer returns nested arrays — flatten
        const analyses = (Array.isArray(input['analyze-jobs'])
          ? (input['analyze-jobs'] as unknown[]).flat()
          : []) as JobAnalysis[];
        // concatReducer wraps single-provider output — flatten
        const jobs = (Array.isArray(input['normalize-jobs'])
          ? (input['normalize-jobs'] as unknown[]).flat()
          : []) as NormalizedJob[];
        const raw = await llm.generate(synthesizerPrompt(jobs, analyses, input['parse-profile']));
        const parsed = parseLLMJson<Array<{
          jobId: string; overallScore: number;
          scores: { skill: number; culture: number; salary: number };
          summary: string; redFlags: string[];
        }>>(raw, 'synthesizer');
        return parsed.map((p) => ({
          job: jobs.find((j) => j.id === p.jobId) ?? {
            id: p.jobId, title: '', company: '', location: '',
            remote: false, skills: [], description: '', url: '', source: '',
          },
          overallScore: p.overallScore,
          scores: p.scores,
          summary: p.summary,
          redFlags: p.redFlags,
        }));
      });
    },
  };
}
