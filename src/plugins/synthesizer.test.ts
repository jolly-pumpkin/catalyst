import { describe, it, expect } from 'vitest';
import { createTestBroker } from 'rhodium-testing';
import { synthesizerPlugin } from './synthesizer.js';
import type { RankedJob } from '../types.js';

describe('synthesizer plugin', () => {
  it('merges analyses into ranked jobs', async () => {
    const mockLLM = {
      generate: async () => JSON.stringify([{
        jobId: 'j1', overallScore: 87,
        scores: { skill: 88, culture: 90, salary: 82 },
        summary: 'Excellent TypeScript match with remote work.',
        redFlags: [],
      }]),
    };

    const { broker } = createTestBroker();
    broker.register({
      key: 'mock-llm', version: '1.0.0',
      manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
      activate(ctx) { ctx.provide('llm.generate', mockLLM); },
    });
    broker.register(synthesizerPlugin());
    await broker.activate();

    const synthesize = broker.resolve<(input: any) => Promise<RankedJob[]>>('jobs.synthesize');
    const result = await synthesize({
      'analyze-jobs': [
        [{ jobId: 'j1', variant: 'skill', score: 88, reasoning: 'Good', signals: [] }],
        [{ jobId: 'j1', variant: 'culture', score: 90, reasoning: 'Good', signals: [] }],
      ],
      'normalize-jobs': [{
        id: 'j1', title: 'Engineer', company: 'X', location: 'Remote',
        remote: true, skills: ['TypeScript'], description: '', url: '', source: 'indeed',
      }],
      'parse-profile': {
        name: 'Jane', skills: ['TypeScript'], yearsExperience: 5,
        titles: ['Engineer'], preferredLocations: ['Remote'], remotePreference: 'remote' as const,
      },
    });

    expect(result).toHaveLength(1);
    expect(result[0].overallScore).toBe(87);
    expect(result[0].job.id).toBe('j1');
  });
});
