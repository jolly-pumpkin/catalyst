# User-Driven Index Filters

## Problem

The index-fetcher uses the candidate's profile skills/titles as a keyword filter when pulling jobs from the local index into the pipeline. This is too aggressive — for a company like OpenAI (657 jobs on Ashby), only jobs matching your specific skill keywords show up (e.g., 1 result). The user has no control over what gets filtered.

## Design

Per-company saved filters applied at both index time and pipeline fetch time. Filters are stored as a JSON column on `company_sources`.

### Data Model

```ts
export interface CompanyFilters {
  titleKeywords?: string[];    // e.g. ["Engineer", "Developer"]
  locations?: string[];        // e.g. ["Remote", "San Francisco"]
  departments?: string[];      // e.g. ["Engineering", "Product"]
  postedWithinDays?: number;   // e.g. 30
}
```

Schema changes:
- `company_sources`: add `filters TEXT DEFAULT '{}'`
- `indexed_jobs`: add `department TEXT`
- `CompanySource` type gains `filters?: CompanyFilters`
- `RawJob` and `IndexedJob` types gain `department?: string`

### ATS Department Extraction

Each ATS fetcher extracts department from the API response:
- Greenhouse: `j.departments[0]?.name`
- Lever: `j.categories?.team` or `j.categories?.department`
- Ashby: `j.department`
- Workable: `j.department`

### Filtering Flow

**Index time (job-indexer):** After fetching all jobs from the ATS API, apply the company's filters before upserting into SQLite:
- `titleKeywords` — case-insensitive substring match on job title
- `locations` — case-insensitive substring match on location
- `departments` — case-insensitive substring match on department
- `postedWithinDays` — compare `postedAt` against `now - N days`
- Empty/missing filter dimension = no filtering on that dimension (pass all)

**Pipeline fetch time (index-fetcher):** Replace the current profile-based keyword filter with the company's saved filters. `job.index.query()` accepts `CompanyFilters` instead of `skills`/`titles`.

### IPC

New channel `COMPANIES_SET_FILTERS` — takes `(id: string, filters: CompanyFilters)` and updates the JSON column.

### UI

Add a "Filters" button on each company row in the Companies table. Clicking it expands an inline panel below the row with:
- Title keywords: comma-separated text input
- Locations: comma-separated text input
- Departments: comma-separated text input
- Posted within: number input + "days" label
- Save button to persist

### Files Changed

- `src/types.ts` — add `CompanyFilters`, extend `CompanySource`, `RawJob`, `IndexedJob`
- `src/plugins/catalog-db.ts` — ALTER TABLE migrations
- `src/plugins/company-store.ts` — read/write filters JSON, new `setFilters` method
- `src/plugins/job-indexer.ts` — apply filters after ATS fetch, extract department field
- `src/plugins/job-index-store.ts` — update schema + query to use `CompanyFilters`
- `src/plugins/index-fetcher.ts` — use company filters instead of profile keywords
- `src/shared/ipc-channels.ts` — add `COMPANIES_SET_FILTERS`
- `electron/ipc/companies.ts` — register new handler
- `src/renderer/views/Companies.tsx` — filter editor UI
- `src/shared/window.d.ts` — extend typed API
- `electron/preload.ts` — expose new IPC call
