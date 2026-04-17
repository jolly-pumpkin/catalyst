import { describe, it, expect } from 'vitest';
import { createTestBroker } from 'rhodium-testing';
import { reflectionAgentPlugin } from './reflection-agent.js';
import type { ReflectOutput } from '../types.js';

describe('reflection-agent plugin', () => {
  it('reflects on results via LLM', async () => {
    const mockLLM = {
      generate: async () => JSON.stringify({
        confidence: 0.9,
        rationale: 'Results are strong',
        searchRefinements: null,
      } satisfies ReflectOutput),
    };

    const { broker } = createTestBroker();
    broker.register({
      key: 'mock-llm', version: '1.0.0',
      manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
      activate(ctx) { ctx.provide('llm.generate', mockLLM); },
    });
    broker.register(reflectionAgentPlugin());
    await broker.activate();

    const reflect = broker.resolve<(input: any) => Promise<ReflectOutput>>('jobs.reflect');
    const result = await reflect({
      synthesize: [],
      'parse-profile': {
        name: 'Jane', skills: ['TypeScript'], yearsExperience: 5,
        titles: ['Engineer'], preferredLocations: ['Remote'], remotePreference: 'remote' as const,
      },
    });
    expect(result.confidence).toBe(0.9);
  });

  it('shouldStop returns true when confidence >= 0.8', async () => {
    const mockLLM = { generate: async () => '{}' };

    const { broker } = createTestBroker();
    broker.register({
      key: 'mock-llm', version: '1.0.0',
      manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
      activate(ctx) { ctx.provide('llm.generate', mockLLM); },
    });
    broker.register(reflectionAgentPlugin());
    await broker.activate();

    const shouldStop = broker.resolve<(ctx: any) => boolean>('jobs.search-complete');
    expect(shouldStop({
      iteration: 1,
      stageOutputs: new Map([['reflect', { confidence: 0.85, rationale: 'good' }]]),
    })).toBe(true);
  });

  it('shouldStop returns false when confidence < 0.8', async () => {
    const mockLLM = { generate: async () => '{}' };

    const { broker } = createTestBroker();
    broker.register({
      key: 'mock-llm', version: '1.0.0',
      manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
      activate(ctx) { ctx.provide('llm.generate', mockLLM); },
    });
    broker.register(reflectionAgentPlugin());
    await broker.activate();

    const shouldStop = broker.resolve<(ctx: any) => boolean>('jobs.search-complete');
    expect(shouldStop({
      iteration: 1,
      stageOutputs: new Map([['reflect', { confidence: 0.4, rationale: 'needs work' }]]),
    })).toBe(false);
  });
});
