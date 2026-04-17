import type { Plugin } from 'rhodium-core';
import type { ATSType } from '../types.js';

interface ATSProbeResult {
  atsType: ATSType;
  slug: string;
  name: string;
}

const IGNORED_SUBDOMAINS = new Set(['jobs', 'careers', 'boards', 'apply', 'www', 'hire']);
const IGNORED_PATH_SEGMENTS = new Set(['careers', 'jobs', 'openings', 'positions', 'work', 'join', 'apply']);

/** Extract candidate slugs from a career page URL. */
function extractSlugs(url: string): string[] {
  const slugs = new Set<string>();
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const parts = host.split('.');

    // Handle known ATS URL patterns: jobs.lever.co/company → slug is "company"
    const isATSHost = host.endsWith('.lever.co') || host.endsWith('.greenhouse.io')
      || host.endsWith('.ashbyhq.com') || host.endsWith('.workable.com');
    if (isATSHost) {
      const pathSegments = parsed.pathname.split('/').filter(Boolean);
      if (pathSegments[0]) slugs.add(pathSegments[0].toLowerCase());
      return [...slugs];
    }

    // Domain-based: filter out ATS-related subdomains
    const domainBase = parts[0];
    if (domainBase && !IGNORED_SUBDOMAINS.has(domainBase)) {
      slugs.add(domainBase);
    }
    // If first part was ignored (e.g. "jobs.acme.com"), try second part
    if (domainBase && IGNORED_SUBDOMAINS.has(domainBase) && parts[1]) {
      slugs.add(parts[1]);
    }

    // Path-based: look for meaningful path segments
    const segments = parsed.pathname.split('/').filter(Boolean);
    for (const seg of segments) {
      if (!IGNORED_PATH_SEGMENTS.has(seg.toLowerCase())) {
        slugs.add(seg.toLowerCase());
      }
    }
  } catch {
    // If it's not a valid URL, treat the whole thing as a slug
    slugs.add(url.replace(/[^a-z0-9-]/gi, '').toLowerCase());
  }
  return [...slugs];
}

async function probeATS(
  slug: string,
  atsType: ATSType,
  url: string,
  timeout: number,
): Promise<ATSProbeResult | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;

    const data = await res.json() as any;

    if (atsType === 'greenhouse') {
      if (!data?.jobs || !Array.isArray(data.jobs)) return null;
      const name = data.jobs[0]?.company_name ?? slug;
      return { atsType, slug, name };
    }

    if (atsType === 'lever') {
      if (!Array.isArray(data) || data.length === 0) return null;
      // Lever doesn't include company name in responses; capitalize the slug
      const name = slug.charAt(0).toUpperCase() + slug.slice(1);
      return { atsType, slug, name };
    }

    if (atsType === 'ashby') {
      if (!data?.jobs || !Array.isArray(data.jobs)) return null;
      const name = data.jobs[0]?.organizationName ?? slug;
      return { atsType, slug, name };
    }

    if (atsType === 'workable') {
      if (!data?.jobs || !Array.isArray(data.jobs)) return null;
      const name = data.name ?? slug;
      return { atsType, slug, name };
    }

    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function buildProbeUrl(atsType: ATSType, slug: string): string {
  switch (atsType) {
    case 'greenhouse':
      return `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`;
    case 'lever':
      return `https://api.lever.co/v0/postings/${slug}?mode=json`;
    case 'ashby':
      return `https://api.ashbyhq.com/posting-api/job-board/${slug}`;
    case 'workable':
      return `https://apply.workable.com/api/v1/widget/accounts/${slug}`;
  }
}

const ATS_TYPES: ATSType[] = ['greenhouse', 'lever', 'ashby', 'workable'];
const PROBE_TIMEOUT = 3000;

export function atsDetectorPlugin(): Plugin {
  return {
    key: 'ats-detector',
    version: '1.0.0',
    manifest: {
      name: 'ATS Detector',
      description: 'Detects which ATS platform a company uses by probing known API endpoints',
      provides: [{ capability: 'ats.detect' }],
      needs: [],
      tags: ['indexer'],
    },
    activate(ctx) {
      ctx.provide('ats.detect', {
        async detect(url: string): Promise<ATSProbeResult | null> {
          const slugs = extractSlugs(url);

          // Probe all ATS types for all slugs in parallel
          const probes = slugs.flatMap((slug) =>
            ATS_TYPES.map((atsType) =>
              probeATS(slug, atsType, buildProbeUrl(atsType, slug), PROBE_TIMEOUT),
            ),
          );

          const results = await Promise.allSettled(probes);

          for (const result of results) {
            if (result.status === 'fulfilled' && result.value) {
              return result.value;
            }
          }

          return null;
        },
      });
    },
  };
}
