import type { Plugin } from 'rhodium-core';
import { reflectionAgentPrompt } from '../prompts/reflection-agent.js';
import { parseLLMJson } from '../llm-parse.js';
import type { CandidateProfile, RankedJob, ReflectOutput } from '../types.js';

export function reflectionAgentPlugin(): Plugin {
  return {
    key: 'reflection-agent',
    version: '1.0.0',
    manifest: {
      name: 'Reflection Agent',
      description: 'Evaluates result quality and decides whether to refine the search',
      provides: [
        { capability: 'jobs.reflect' },
        { capability: 'jobs.search-complete' },
      ],
      needs: [{ capability: 'llm.generate' }],
    },
    activate(ctx) {
      const llm = ctx.resolve<{ generate: (prompt: string) => Promise<string> }>('llm.generate');

      // jobs.reflect — function for the pipeline runner
      ctx.provide('jobs.reflect', async (input: {
        synthesize: RankedJob[];
        'parse-profile': CandidateProfile;
      }): Promise<ReflectOutput> => {
        const raw = await llm.generate(
          reflectionAgentPrompt(input.synthesize, input['parse-profile'], 1)
        );
        return parseLLMJson<ReflectOutput>(raw, 'reflection-agent');
      });

      // jobs.search-complete — function for stop condition
      ctx.provide('jobs.search-complete', (stopCtx: {
        iteration: number;
        stageOutputs: Map<string, unknown>;
      }): boolean => {
        const reflect = stopCtx.stageOutputs.get('reflect') as ReflectOutput | undefined;
        if (!reflect) return false;
        return reflect.confidence >= 0.8 || stopCtx.iteration >= 3;
      });
    },
  };
}
