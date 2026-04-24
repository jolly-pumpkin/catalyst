import type { Plugin } from 'rhodium-core';
import type { CandidateProfile, CompanyFilters, IndexedJob, ReflectOutput } from '../types.js';
import { getPipelineCompanyId } from '../context.js';

export function indexFetcherPlugin(): Plugin {
  return {
    key: 'index-fetcher',
    version: '1.0.0',
    manifest: {
      name: 'Index Fetcher',
      description: 'Provides jobs from the local index for pipeline consumption',
      provides: [{ capability: 'jobs.fetch', priority: 90 }],
      needs: [{ capability: 'job.index' }, { capability: 'company.store' }],
      tags: ['job-source', 'local-index'],
    },
    activate(ctx) {
      const jobIndex = ctx.resolve<{
        query(filter?: {
          titleKeywords?: string[];
          locations?: string[];
          departments?: string[];
          postedWithinDays?: number;
          companyIds?: string[];
        }): Promise<IndexedJob[]>;
      }>('job.index');

      const companyStore = ctx.resolve<{
        get(id: string): Promise<{ filters?: CompanyFilters } | null>;
      }>('company.store');

      ctx.provide('jobs.fetch', async (input: {
        'parse-profile': CandidateProfile;
        refinements?: ReflectOutput['searchRefinements'];
      }): Promise<IndexedJob[]> => {
        const companySourceId = getPipelineCompanyId();
        const companyIds = companySourceId ? [companySourceId] : undefined;

        // Use company filters if running for a specific company
        let filters: CompanyFilters = {};
        if (companySourceId) {
          const company = await companyStore.get(companySourceId);
          if (company?.filters) {
            filters = company.filters;
          }
        }

        // Fall back to profile-based filtering if no company filters set
        if (!companySourceId || Object.keys(filters).length === 0) {
          const profile = input['parse-profile'];
          const refinements = input.refinements;
          filters = {
            titleKeywords: [
              ...profile.titles,
              ...(refinements?.additionalKeywords ?? []),
            ],
          };
        }

        return jobIndex.query({ ...filters, companyIds });
      });
    },
  };
}
