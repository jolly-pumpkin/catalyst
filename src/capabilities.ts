import { defineCapability } from 'rhodium-capabilities';
import type {
  PipelineInput, CandidateProfile, RawJob, NormalizedJob,
  JobAnalysis, RankedJob, ReflectOutput, RunRecord,
  ATSType, CompanySource, IndexedJob,
  TraceRun, TraceEvent, TraceLLMCall,
  UserRecord, JobKanbanColumn, FeedbackTag, JobFeedback,
} from './types.js';

// --- Pipeline stage capabilities (must be functions for the runner) ---

export const ProfileParse = defineCapability<
  (input: PipelineInput) => Promise<CandidateProfile>
>('profile.parse');

export const JobsFetch = defineCapability<
  (input: {
    'parse-profile': CandidateProfile;
    refinements?: ReflectOutput['searchRefinements'];
  }) => Promise<RawJob[]>
>('jobs.fetch');

export const JobsNormalize = defineCapability<
  (input: { 'fetch-jobs': RawJob[][] }) => Promise<NormalizedJob[]>
>('jobs.normalize');

export const JobsAnalyze = defineCapability<
  (input: {
    'normalize-jobs': NormalizedJob[];
    'parse-profile': CandidateProfile;
  }) => Promise<JobAnalysis[]>
>('jobs.analyze');

export const JobsSynthesize = defineCapability<
  (input: {
    'analyze-jobs': JobAnalysis[][];
    'parse-profile': CandidateProfile;
    'normalize-jobs': NormalizedJob[];
  }) => Promise<RankedJob[]>
>('jobs.synthesize');

export const JobsReflect = defineCapability<
  (input: {
    synthesize: RankedJob[];
    'parse-profile': CandidateProfile;
  }) => Promise<ReflectOutput>
>('jobs.reflect');

export const JobsSearchComplete = defineCapability<
  (ctx: { iteration: number; stageOutputs: Map<string, unknown> }) => boolean
>('jobs.search-complete');

// --- Non-pipeline capabilities (object style, resolved directly by plugins) ---

export const LLMGenerate = defineCapability<{
  generate(prompt: string, options?: { temperature?: number }): Promise<string>;
}>('llm.generate');

export const ResultsStore = defineCapability<{
  save(runId: string, resumeName: string, model: string,
       iteration: number, durationMs: number,
       jobs: RankedJob[]): Promise<void>;
}>('results.store');

export const ResultsQuery = defineCapability<{
  listRuns(): Promise<RunRecord[]>;
  getJobs(runId: string): Promise<RankedJob[]>;
}>('results.query');

// --- Job indexer capabilities ---

export const CatalogDB = defineCapability<import('better-sqlite3').Database>('catalog.db');

export const ATSDetect = defineCapability<{
  detect(url: string): Promise<{ atsType: ATSType; slug: string; name: string } | null>;
}>('ats.detect');

export const CompanyStoreCapability = defineCapability<{
  add(url: string): Promise<CompanySource>;
  remove(id: string): Promise<void>;
  list(): Promise<CompanySource[]>;
  get(id: string): Promise<CompanySource | null>;
  setEnabled(id: string, enabled: boolean): Promise<void>;
  updateIndexed(id: string, jobCount: number): Promise<void>;
}>('company.store');

export const JobIndex = defineCapability<{
  upsertJobs(companySourceId: string, jobs: RawJob[], atsType: ATSType): Promise<number>;
  markInactive(companySourceId: string, activeIds: string[]): Promise<number>;
  query(filter?: { skills?: string[]; titles?: string[]; companyIds?: string[] }): Promise<IndexedJob[]>;
  stats(): Promise<{ totalJobs: number; activeJobs: number; companies: number }>;
}>('job.index');

export const IndexerRun = defineCapability<{
  indexNow(): Promise<void>;
  indexCompany(id: string): Promise<void>;
}>('indexer.run');

// --- Trace capabilities ---

export const TraceStore = defineCapability<{
  startRun(runId: string, specName: string, model: string, resumeName: string): void;
  completeRun(runId: string, durationMs: number, iteration: number): void;
  failRun(runId: string, error: string): void;
  recordEvent(runId: string, event: string, payload: Record<string, unknown>): void;
  startLLMCall(runId: string, callId: string, pluginKey: string, model: string, prompt: string, temperature: number): void;
  completeLLMCall(callId: string, response: string, durationMs: number, tokens?: { prompt: number; response: number }): void;
  failLLMCall(callId: string, error: string, durationMs: number): void;
}>('trace.store');

export const TraceQuery = defineCapability<{
  listRuns(): TraceRun[];
  getRun(runId: string): TraceRun | null;
  getEvents(runId: string): TraceEvent[];
  getLLMCalls(runId: string): TraceLLMCall[];
  getLLMCall(callId: string): TraceLLMCall | null;
}>('trace.query');

// --- User management capabilities ---

export const UserManager = defineCapability<{
  list(): UserRecord[];
  create(name: string): UserRecord;
  get(id: string): UserRecord | null;
  getByName(name: string): UserRecord | null;
  getCurrentId(): string | null;
  setCurrentId(id: string): void;
}>('user.manager');

// --- Kanban capabilities ---

export const KanbanStoreCapability = defineCapability<{
  getJobColumn(jobId: string): JobKanbanColumn | null;
  moveJob(jobId: string, companySourceId: string, toColumn: JobKanbanColumn,
          feedback?: { tags: FeedbackTag[]; notes?: string }): void;
  getColumnJobs(companySourceId: string, column: JobKanbanColumn): { jobId: string; title: string; company: string; score: number }[];
  getAllFeedback(companySourceId?: string): JobFeedback[];
  getFeedback(jobId: string): JobFeedback | null;
  ensureTracked(companySourceId: string, jobs: RankedJob[]): void;
  getFeedbackSummary(companySourceId?: string): {
    totalRejected: number;
    totalNotApplying: number;
    tagCounts: Record<FeedbackTag, number>;
    recentNotes: string[];
  };
}>('kanban.store');
