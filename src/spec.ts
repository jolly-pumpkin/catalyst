import type { PipelineSpec } from 'rhodium-pipeline-runner';

export const jobSeekerSpec: PipelineSpec = {
  name: 'job-seeker',
  stages: [
    {
      id: 'parse-profile',
      capability: 'profile.parse',
      policy: 'single',
      errorPolicy: 'fail-fast',
    },
    {
      id: 'fetch-jobs',
      capability: 'jobs.fetch',
      policy: 'fanout',
      errorPolicy: 'skip',
      reducer: { kind: 'concat' },
      inputFrom: ['parse-profile'],
    },
    {
      id: 'normalize-jobs',
      capability: 'jobs.normalize',
      policy: 'single',
      errorPolicy: 'fail-fast',
      inputFrom: ['fetch-jobs'],
    },
    {
      id: 'analyze-jobs',
      capability: 'jobs.analyze',
      policy: 'fanout',
      errorPolicy: 'skip',
      reducer: { kind: 'concat' },
      inputFrom: ['normalize-jobs', 'parse-profile'],
    },
    {
      id: 'synthesize',
      capability: 'jobs.synthesize',
      policy: 'single',
      errorPolicy: 'fail-fast',
      inputFrom: ['analyze-jobs', 'parse-profile', 'normalize-jobs'],
    },
    {
      id: 'reflect',
      capability: 'jobs.reflect',
      policy: 'single',
      errorPolicy: 'fall-through',
      inputFrom: ['synthesize', 'parse-profile'],
    },
  ],
  termination: {
    maxIterations: 3,
    stopCondition: { capability: 'jobs.search-complete' },
  },
};
