import { describe, it, expect } from 'vitest';
import { createTestBroker } from 'rhodium-testing';
import { profileParserPlugin } from './profile-parser.js';
import type { CandidateProfile, PipelineInput } from '../types.js';

describe('profile-parser plugin', () => {
  it('parses a resume using the LLM capability', async () => {
    const mockLLM = {
      generate: async (_prompt: string) => JSON.stringify({
        name: 'Jane Doe',
        skills: ['TypeScript', 'React', 'Node.js'],
        yearsExperience: 7,
        titles: ['Senior Engineer'],
        preferredLocations: ['Remote'],
        remotePreference: 'remote',
        salaryExpectation: { min: 180000, max: 220000, currency: 'USD' },
      }),
    };

    const { broker } = createTestBroker();
    broker.register({
      key: 'mock-llm', version: '1.0.0',
      manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
      activate(ctx) { ctx.provide('llm.generate', mockLLM); },
    });
    broker.register(profileParserPlugin());
    await broker.activate();

    const parse = broker.resolve<(input: PipelineInput) => Promise<CandidateProfile>>('profile.parse');
    const profile = await parse({ resumeText: 'Jane Doe, Senior Engineer...', resumeName: 'jane.txt' });

    expect(profile.name).toBe('Jane Doe');
    expect(profile.skills).toContain('TypeScript');
    expect(profile.remotePreference).toBe('remote');
  });
});
