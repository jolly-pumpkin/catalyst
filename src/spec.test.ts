import { describe, it, expect } from 'bun:test';
import { jobSeekerSpec } from './spec.js';

describe('jobSeekerSpec', () => {
  it('has 6 stages', () => {
    expect(jobSeekerSpec.stages).toHaveLength(6);
  });

  it('all fanout stages have reducers', () => {
    const fanout = jobSeekerSpec.stages.filter((s) => s.policy === 'fanout');
    expect(fanout.length).toBe(2);
    expect(fanout.every((s) => s.reducer)).toBe(true);
  });

  it('has termination with maxIterations and stopCondition', () => {
    expect(jobSeekerSpec.termination.maxIterations).toBe(3);
    expect(jobSeekerSpec.termination.stopCondition?.capability).toBe('jobs.search-complete');
  });

  it('synthesize stage includes normalize-jobs in inputFrom', () => {
    const synth = jobSeekerSpec.stages.find((s) => s.id === 'synthesize');
    expect(synth?.inputFrom).toContain('normalize-jobs');
  });
});
