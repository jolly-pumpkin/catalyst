import type { Plugin } from 'rhodium-core';
import { profileParserPrompt } from '../prompts/profile-parser.js';
import { parseLLMJson } from '../llm-parse.js';
import type { CandidateProfile, PipelineInput } from '../types.js';

export function profileParserPlugin(): Plugin {
  return {
    key: 'profile-parser',
    version: '1.0.0',
    manifest: {
      name: 'Profile Parser',
      description: 'Extracts structured candidate profile from resume text',
      provides: [{ capability: 'profile.parse' }],
      needs: [{ capability: 'llm.generate' }],
    },
    activate(ctx) {
      const llm = ctx.resolve<{ generate: (prompt: string) => Promise<string> }>('llm.generate');
      ctx.provide('profile.parse', async (input: PipelineInput): Promise<CandidateProfile> => {
        const raw = await llm.generate(profileParserPrompt(input.resumeText));
        return parseLLMJson<CandidateProfile>(raw, 'profile-parser');
      });
    },
  };
}
