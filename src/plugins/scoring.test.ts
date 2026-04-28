import { describe, it, expect } from 'vitest';
import { createTestBroker } from 'rhodium-testing';
import { skillMatcherPlugin } from './skill-matcher.js';
import { cultureFitAnalyzerPlugin } from './culture-fit-analyzer.js';
import { salaryEstimatorPlugin } from './salary-estimator.js';
import type { JobAnalysis } from '../types.js';

const mockLLM = (variant: string) => ({
  generate: async () => JSON.stringify(
    { jobId: 'j1', variant, score: 85, reasoning: 'Good match', signals: ['TypeScript'] },
  ),
});

const input = {
  'normalize-jobs': [{
    id: 'j1', title: 'Engineer', company: 'X', location: 'Remote',
    remote: true, skills: ['TypeScript'], description: '', url: '', source: 'indeed',
  }],
  'parse-profile': {
    name: 'Jane', skills: { 'Programming': ['TypeScript'] }, yearsExperience: 5,
    titles: ['Engineer'], preferredLocations: ['Remote'], remotePreference: 'remote' as const,
  },
};

for (const [plugin, variant] of [
  [skillMatcherPlugin, 'skill'],
  [cultureFitAnalyzerPlugin, 'culture'],
  [salaryEstimatorPlugin, 'salary'],
] as const) {
  describe(`${variant} analyzer`, () => {
    it('returns job analysis with correct variant', async () => {
      const { broker } = createTestBroker();
      broker.register({
        key: 'mock-llm', version: '1.0.0',
        manifest: { name: 'Mock LLM', description: '', provides: [{ capability: 'llm.generate' }], needs: [] },
        activate(ctx) { ctx.provide('llm.generate', mockLLM(variant)); },
      });
      broker.register(plugin());
      await broker.activate();
      const analyze = broker.resolve<(input: any) => Promise<JobAnalysis[]>>('jobs.analyze');
      const results = await analyze(input);
      expect(results[0].variant).toBe(variant);
      expect(results[0].score).toBe(85);
    });
  });
}
