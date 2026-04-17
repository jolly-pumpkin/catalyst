import type { Plugin } from 'rhodium-core';
import type { CandidateProfile, RawJob, ReflectOutput } from '../types.js';

interface RemotiveJob {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location: string;
  description: string;
  url: string;
  date: string;
}

export function remotiveFetcherPlugin(): Plugin {
  return {
    key: 'remotive-fetcher',
    version: '1.0.0',
    manifest: {
      name: 'Remotive Fetcher',
      description: 'Fetches remote job postings from Remotive public API',
      provides: [{ capability: 'jobs.fetch', priority: 60 }],
      needs: [],
      tags: ['job-source', 'real-api'],
    },
    activate(ctx) {
      ctx.provide('jobs.fetch', async (input: {
        'parse-profile': CandidateProfile;
        refinements?: ReflectOutput['searchRefinements'];
      }): Promise<RawJob[]> => {
        const profile = input['parse-profile'];
        const refinements = input.refinements;
        const search = [
          ...profile.titles.slice(0, 1),
          ...(refinements?.additionalKeywords ?? []),
        ].join(' ');
        const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(search)}&limit=10`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);
        let res: Response;
        try {
          res = await fetch(url, { signal: controller.signal });
        } finally {
          clearTimeout(timeout);
        }
        if (!res.ok) throw new Error(`Remotive API error: ${res.status}`);
        const data = await res.json() as { jobs: RemotiveJob[] };
        return data.jobs.map((j): RawJob => ({
          id: `remotive-${j.id}`,
          source: 'remotive',
          title: j.title,
          company: j.company_name,
          location: j.candidate_required_location || 'Remote',
          description: j.description.replace(/<[^>]+>/g, ''),
          url: j.url,
          postedAt: j.date,
        }));
      });
    },
  };
}
