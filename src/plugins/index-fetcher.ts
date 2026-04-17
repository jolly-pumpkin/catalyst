import type { Plugin } from 'rhodium-core';
import type { CandidateProfile, IndexedJob, ReflectOutput } from '../types.js';

export function indexFetcherPlugin(): Plugin {
  return {
    key: 'index-fetcher',
    version: '1.0.0',
    manifest: {
      name: 'Index Fetcher',
      description: 'Provides jobs from the local index for pipeline consumption',
      provides: [{ capability: 'jobs.fetch', priority: 90 }],
      needs: [{ capability: 'job.index' }],
      tags: ['job-source', 'local-index'],
    },
    activate(ctx) {
      const jobIndex = ctx.resolve<{
        query(filter?: {
          skills?: string[];
          titles?: string[];
          companyIds?: string[];
        }): Promise<IndexedJob[]>;
      }>('job.index');

      ctx.provide('jobs.fetch', async (input: {
        'parse-profile': CandidateProfile;
        refinements?: ReflectOutput['searchRefinements'];
      }): Promise<IndexedJob[]> => {
        const profile = input['parse-profile'];
        const refinements = input.refinements;

        const skills = [
          ...profile.skills,
          ...(refinements?.additionalKeywords ?? []),
        ];

        const titles = profile.titles;

        return jobIndex.query({ skills, titles });
      });
    },
  };
}
