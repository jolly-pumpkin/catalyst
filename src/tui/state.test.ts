import { describe, it, expect } from 'bun:test';
import { tuiReducer, initialState } from './state.js';

describe('tuiReducer', () => {
  it('transitions to pipeline view on pipeline:start', () => {
    const next = tuiReducer(initialState, { type: 'pipeline:start', resumeName: 'r.txt', model: 'gemma4' });
    expect(next.view).toBe('pipeline');
    expect(next.resumeName).toBe('r.txt');
  });

  it('adds a stage on stage:start', () => {
    let s = tuiReducer(initialState, { type: 'pipeline:start', resumeName: 'r.txt', model: 'gemma4' });
    s = tuiReducer(s, { type: 'stage:start', stageId: 'fetch-jobs', capability: 'jobs.fetch' });
    expect(s.stages).toHaveLength(1);
    expect(s.stages[0].status).toBe('running');
  });

  it('marks stage done with duration', () => {
    let s = tuiReducer(initialState, { type: 'pipeline:start', resumeName: 'r.txt', model: 'gemma4' });
    s = tuiReducer(s, { type: 'stage:start', stageId: 'fetch-jobs', capability: 'jobs.fetch' });
    s = tuiReducer(s, { type: 'stage:done', stageId: 'fetch-jobs', durationMs: 1234 });
    expect(s.stages[0].status).toBe('done');
    expect(s.stages[0].durationMs).toBe(1234);
  });

  it('tracks providers in fanout stages', () => {
    let s = tuiReducer(initialState, { type: 'pipeline:start', resumeName: 'r.txt', model: 'gemma4' });
    s = tuiReducer(s, { type: 'stage:start', stageId: 'fetch-jobs', capability: 'jobs.fetch' });
    s = tuiReducer(s, { type: 'provider:start', stageId: 'fetch-jobs', providerId: 'indeed-fetcher' });
    s = tuiReducer(s, { type: 'provider:done', stageId: 'fetch-jobs', providerId: 'indeed-fetcher', durationMs: 500 });
    expect(s.stages[0].providers).toHaveLength(1);
    expect(s.stages[0].providers[0].status).toBe('done');
  });

  it('handles provider failure', () => {
    let s = tuiReducer(initialState, { type: 'pipeline:start', resumeName: 'r.txt', model: 'gemma4' });
    s = tuiReducer(s, { type: 'stage:start', stageId: 'fetch-jobs', capability: 'jobs.fetch' });
    s = tuiReducer(s, { type: 'provider:start', stageId: 'fetch-jobs', providerId: 'linkedin' });
    s = tuiReducer(s, { type: 'provider:fail', stageId: 'fetch-jobs', providerId: 'linkedin', error: 'rate limit' });
    expect(s.stages[0].providers[0].status).toBe('failed');
    expect(s.stages[0].providers[0].error).toBe('rate limit');
  });

  it('marks running providers as done when stage completes', () => {
    let s = tuiReducer(initialState, { type: 'pipeline:start', resumeName: 'r.txt', model: 'gemma4' });
    s = tuiReducer(s, { type: 'stage:start', stageId: 'fetch-jobs', capability: 'jobs.fetch' });
    s = tuiReducer(s, { type: 'provider:start', stageId: 'fetch-jobs', providerId: 'indeed' });
    s = tuiReducer(s, { type: 'provider:start', stageId: 'fetch-jobs', providerId: 'linkedin' });
    s = tuiReducer(s, { type: 'provider:fail', stageId: 'fetch-jobs', providerId: 'linkedin', error: 'fail' });
    // indeed is still 'running', then stage completes
    s = tuiReducer(s, { type: 'stage:done', stageId: 'fetch-jobs', durationMs: 800 });
    expect(s.stages[0].providers[0].status).toBe('done'); // indeed auto-marked done
    expect(s.stages[0].providers[1].status).toBe('failed'); // linkedin stays failed
  });

  it('transitions to results on pipeline:done', () => {
    let s = tuiReducer(initialState, { type: 'pipeline:start', resumeName: 'r.txt', model: 'gemma4' });
    s = tuiReducer(s, { type: 'pipeline:done', results: [], iteration: 2, durationMs: 5000 });
    expect(s.view).toBe('results');
    expect(s.done).toBe(true);
    expect(s.iteration).toBe(2);
  });
});
