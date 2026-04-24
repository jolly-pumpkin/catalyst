import type { Plugin } from 'rhodium-core';
import type { ATSType, CompanySource, RawJob } from '../types.js';
import { withConcurrency } from '../concurrency.js';

export interface JobIndexerOptions {
  intervalHours?: number;
  autoStart?: boolean;
}

// --- ATS-specific fetch functions ---
// Each takes a slug and the company name (from CompanySource) so the
// `company` field on RawJob is always the real company name.

async function fetchGreenhouseJobs(slug: string, companyName: string): Promise<RawJob[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;
  const res = await fetchWithTimeout(url, 15_000);
  if (!res.ok) throw new Error(`Greenhouse API error: ${res.status}`);
  const data = await res.json() as { jobs: any[] };
  return data.jobs.map((j): RawJob => ({
    id: `greenhouse-${j.id}`,
    source: `greenhouse:${slug}`,
    title: j.title,
    company: companyName,
    location: j.location?.name ?? 'Unknown',
    description: stripHtml(j.content ?? ''),
    url: j.absolute_url,
    department: j.departments?.[0]?.name,
    postedAt: j.updated_at ?? j.first_published ?? new Date().toISOString(),
  }));
}

async function fetchLeverJobs(slug: string, companyName: string): Promise<RawJob[]> {
  const url = `https://api.lever.co/v0/postings/${slug}?mode=json`;
  const res = await fetchWithTimeout(url, 15_000);
  if (!res.ok) throw new Error(`Lever API error: ${res.status}`);
  const data = await res.json() as any[];
  return data.map((j): RawJob => ({
    id: `lever-${j.id}`,
    source: `lever:${slug}`,
    title: j.text,
    company: companyName,
    location: j.categories?.location ?? 'Unknown',
    description: j.descriptionPlain ?? stripHtml(j.description ?? ''),
    url: j.hostedUrl,
    department: j.categories?.department ?? j.categories?.team,
    postedAt: j.createdAt ? new Date(j.createdAt).toISOString() : new Date().toISOString(),
  }));
}

async function fetchAshbyJobs(slug: string, companyName: string): Promise<RawJob[]> {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=true`;
  const res = await fetchWithTimeout(url, 15_000);
  if (!res.ok) throw new Error(`Ashby API error: ${res.status}`);
  const data = await res.json() as { jobs: any[] };
  return data.jobs.map((j): RawJob => ({
    id: `ashby-${j.id}`,
    source: `ashby:${slug}`,
    title: j.title,
    company: companyName,
    location: j.location ?? 'Unknown',
    description: j.descriptionPlain ?? stripHtml(j.descriptionHtml ?? ''),
    url: j.jobUrl,
    department: j.department,
    postedAt: j.publishedAt ?? new Date().toISOString(),
  }));
}

async function fetchWorkableJobs(slug: string, companyName: string): Promise<RawJob[]> {
  const url = `https://apply.workable.com/api/v1/widget/accounts/${slug}`;
  const res = await fetchWithTimeout(url, 15_000);
  if (!res.ok) throw new Error(`Workable API error: ${res.status}`);
  const data = await res.json() as { jobs: any[] };
  return data.jobs.map((j): RawJob => ({
    id: `workable-${j.shortcode}`,
    source: `workable:${slug}`,
    title: j.title,
    company: companyName,
    location: [j.city, j.country].filter(Boolean).join(', ') || 'Unknown',
    description: j.description ?? '',
    url: j.url ?? `https://apply.workable.com/${slug}/j/${j.shortcode}/`,
    department: j.department,
    postedAt: j.created_at ?? new Date().toISOString(),
  }));
}

const ATS_FETCHERS: Record<ATSType, (slug: string, companyName: string) => Promise<RawJob[]>> = {
  greenhouse: fetchGreenhouseJobs,
  lever: fetchLeverJobs,
  ashby: fetchAshbyJobs,
  workable: fetchWorkableJobs,
};

// --- Helpers ---

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}


export function jobIndexerPlugin(options: JobIndexerOptions = {}): Plugin {
  let intervalHandle: ReturnType<typeof setInterval> | null = null;
  let startupTimeout: ReturnType<typeof setTimeout> | null = null;

  return {
    key: 'job-indexer',
    version: '1.0.0',
    manifest: {
      name: 'Job Indexer',
      description: 'Background crawler that fetches jobs from ATS APIs and indexes them locally',
      provides: [{ capability: 'indexer.run' }],
      needs: [
        { capability: 'company.store' },
        { capability: 'job.index' },
      ],
      tags: ['indexer'],
    },
    activate(ctx) {
      const companyStore = ctx.resolve<{
        list(): Promise<CompanySource[]>;
        get(id: string): Promise<CompanySource | null>;
        updateIndexed(id: string, jobCount: number): Promise<void>;
      }>('company.store');

      const jobIndex = ctx.resolve<{
        upsertJobs(companySourceId: string, jobs: RawJob[], atsType: ATSType): Promise<number>;
        markInactive(companySourceId: string, activeIds: string[]): Promise<number>;
      }>('job.index');

      async function indexCompany(company: CompanySource): Promise<number> {
        const fetcher = ATS_FETCHERS[company.atsType];
        if (!fetcher) throw new Error(`Unknown ATS type: ${company.atsType}`);

        const jobs = await fetcher(company.slug, company.name);
        await jobIndex.upsertJobs(company.id, jobs, company.atsType);
        await jobIndex.markInactive(company.id, jobs.map((j) => j.id));
        await companyStore.updateIndexed(company.id, jobs.length);

        ctx.emit('indexer:company-done', {
          companyId: company.id,
          companyName: company.name,
          jobCount: jobs.length,
        });

        return jobs.length;
      }

      async function indexNow(): Promise<void> {
        const companies = await companyStore.list();
        const enabled = companies.filter((c) => c.enabled);

        if (enabled.length === 0) return;

        ctx.emit('indexer:started', { companyCount: enabled.length });

        let totalJobs = 0;
        const errors: Array<{ company: string; error: string }> = [];

        await withConcurrency(enabled, async (company) => {
          const count = await indexCompany(company);
          totalJobs += count;
          return count;
        }, {
          limit: 3,
          onError: (err, i) => errors.push({ company: enabled[i]!.name, error: String(err) }),
        });

        ctx.emit('indexer:complete', { totalJobs, errors });
      }

      ctx.provide('indexer.run', {
        indexNow,
        async indexCompany(id: string): Promise<void> {
          const company = await companyStore.get(id);
          if (!company) throw new Error(`Company not found: ${id}`);
          await indexCompany(company);
        },
      });

      // Background scheduling — only when autoStart is enabled (skip for CLI subcommands)
      if (options.autoStart !== false) {
        const intervalMs = (options.intervalHours ?? 6) * 60 * 60 * 1000;
        intervalHandle = setInterval(() => {
          indexNow().catch((err) => ctx.emit('indexer:error', { error: String(err) }));
        }, intervalMs);

        startupTimeout = setTimeout(() => {
          indexNow().catch((err) => ctx.emit('indexer:error', { error: String(err) }));
        }, 5_000);
      }
    },

    deactivate() {
      if (intervalHandle) clearInterval(intervalHandle);
      if (startupTimeout) clearTimeout(startupTimeout);
    },
  };
}
