import { describe, it, expect } from 'vitest';
import { createTestBroker } from 'rhodium-testing';
import { jobNormalizerPlugin } from './job-normalizer.js';
import type { NormalizedJob } from '../types.js';

describe('job-normalizer plugin', () => {
  it('normalizes raw jobs via LLM', async () => {
    const mockLLM = {
      generate: async () => JSON.stringify([
        {
          id: 'indeed-1', title: 'Senior TS Engineer', company: 'Acme',
          location: 'Remote', remote: true, skills: ['TypeScript', 'React'],
          description: 'Great role for TS devs', url: 'https://x.com', source: 'indeed',
        },
      ] satisfies NormalizedJob[]),
    };

    const { broker } = createTestBroker();
    broker.register({
      key: 'mock-llm', version: '1.0.0',
      manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
      activate(ctx) { ctx.provide('llm.generate', mockLLM); },
    });
    broker.register(jobNormalizerPlugin());
    await broker.activate();

    const normalize = broker.resolve<(input: any) => Promise<NormalizedJob[]>>('jobs.normalize');
    // Simulate concatReducer nested array output
    const result = await normalize({ 'fetch-jobs': [[{ id: 'indeed-1', source: 'indeed', title: 'Engineer', company: 'X', location: 'Remote', description: 'test', url: '', postedAt: '' }]] });
    expect(result).toHaveLength(1);
    expect(result[0].remote).toBe(true);
    expect(result[0].skills).toContain('TypeScript');
  });
});
