import type { RankedJob, CandidateProfile, NormalizedJob, JobAnalysis, UserRecord } from '../types.js';

export type ProviderStatus = 'pending' | 'running' | 'done' | 'failed' | 'skipped';
export type StageStatus = 'pending' | 'running' | 'done' | 'failed' | 'degraded' | 'skipped';

export interface ProviderState {
  id: string;
  status: ProviderStatus;
  durationMs?: number;
  error?: string;
}

export interface JobProgressState {
  stage: string;
  provider?: string;
  total: number;
  completed: number;
  cached: number;
  currentJob?: string;
  status?: 'processing' | 'cached' | 'done';
}

export interface StageState {
  id: string;
  capability: string;
  status: StageStatus;
  durationMs?: number;
  providers: ProviderState[];
  jobProgress?: JobProgressState;
}

export type ViewName =
  | 'user-selection'
  | 'input'
  | 'dashboard'
  | 'pipeline'
  | 'results'
  | 'job-detail'
  | 'profile'
  | 'history'
  | 'companies'
  | 'kanban'
  | 'resume-manager'
  | 'settings'
  | 'traces';

export interface AppState {
  view: ViewName;
  currentUser?: UserRecord;
  setupComplete: boolean;
  resumeName: string;
  resumeText?: string;
  model: string;
  iteration: number;
  maxIterations: number;
  stages: StageState[];
  results: RankedJob[];
  profile?: CandidateProfile;
  profileMeta?: { sourceResume: string; updatedAt: string };
  profileParsing?: boolean;
  profileError?: string;
  normalizedJobs?: NormalizedJob[];
  analyses?: JobAnalysis[];
  reflectRationale?: string;
  confidence?: number;
  selectedJobIndex: number;
  done: boolean;
  error?: string;
  // Kanban context
  kanbanCompanyId?: string;
  kanbanCompanyName?: string;
  // Pipeline company scope
  pipelineCompanyId?: string;
  pipelineCompanyName?: string;
  // Dashboard
  dashboardTab: 'overview' | 'triage' | 'activity';
  dashboardFilter: { companyIds: string[] };
  detailPanel: { ranked: RankedJob; analyses: JobAnalysis[] } | null;
  triageProgress: { triaged: number; total: number };
  runSummary: string | null;
}

export type AppAction =
  | { type: 'user:selected'; user: UserRecord }
  | { type: 'user:new-profile' }
  | { type: 'setup:complete' }
  | { type: 'resume:selected'; resumeName: string; resumeText: string }
  | { type: 'pipeline:start'; resumeName: string; model: string }
  | { type: 'stage:start'; stageId: string; capability: string }
  | { type: 'stage:done'; stageId: string; durationMs: number }
  | { type: 'stage:degraded'; stageId: string; reason: string }
  | { type: 'stage:skipped'; stageId: string; reason: string }
  | { type: 'provider:start'; stageId: string; providerId: string }
  | { type: 'provider:done'; stageId: string; providerId: string; durationMs: number }
  | { type: 'provider:fail'; stageId: string; providerId: string; error: string }
  | { type: 'pipeline:iteration'; iteration: number }
  | { type: 'pipeline:enrich'; profile?: CandidateProfile; normalizedJobs?: NormalizedJob[]; analyses?: JobAnalysis[]; reflectRationale?: string; confidence?: number }
  | { type: 'pipeline:done'; results: RankedJob[]; iteration: number; durationMs: number }
  | { type: 'pipeline:fail'; error: string }
  | { type: 'results:navigate'; index: number }
  | { type: 'view:change'; view: ViewName }
  | { type: 'kanban:open'; companyId: string; companyName: string }
  | { type: 'company-pipeline:start'; companyId: string; companyName: string }
  | { type: 'company-pipeline:clear' }
  | { type: 'profile:loaded'; profile: CandidateProfile; sourceResume: string; updatedAt: string }
  | { type: 'profile:parsing' }
  | { type: 'profile:parse-error'; error: string }
  | { type: 'job:progress'; stage: string; provider?: string; total: number; completed: number; cached: number; jobTitle?: string; jobCompany?: string; status?: 'processing' | 'cached' | 'done' }
  | { type: 'dashboard:set-tab'; tab: 'overview' | 'triage' | 'activity' }
  | { type: 'dashboard:set-filter'; companyIds: string[] }
  | { type: 'detail:open'; ranked: RankedJob; analyses: JobAnalysis[] }
  | { type: 'detail:close' }
  | { type: 'dashboard:update-triage'; triaged: number; total: number }
  | { type: 'summary:received'; summary: string }
  | { type: 'summary:dismiss' };

export const initialState: AppState = {
  view: 'user-selection',
  setupComplete: false,
  resumeName: '',
  model: '',
  iteration: 1,
  maxIterations: 3,
  stages: [],
  results: [],
  selectedJobIndex: 0,
  done: false,
  dashboardTab: 'overview',
  dashboardFilter: { companyIds: [] },
  detailPanel: null,
  triageProgress: { triaged: 0, total: 0 },
  runSummary: null,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'user:selected':
      return { ...state, currentUser: action.user };

    case 'user:new-profile':
      return { ...initialState, setupComplete: false };

    case 'setup:complete':
      return { ...state, setupComplete: true, view: 'companies' };

    case 'resume:selected':
      return { ...state, view: 'pipeline', resumeName: action.resumeName, resumeText: action.resumeText, stages: [], done: false, error: undefined };

    case 'pipeline:start':
      return { ...state, view: 'pipeline', resumeName: action.resumeName, model: action.model, stages: [], done: false, error: undefined };

    case 'stage:start': {
      const existing = state.stages.find((s) => s.id === action.stageId);
      if (existing) {
        return { ...state, stages: state.stages.map((s) =>
          s.id === action.stageId ? { ...s, status: 'running' as const, providers: [] } : s
        )};
      }
      return { ...state, stages: [...state.stages, {
        id: action.stageId, capability: action.capability,
        status: 'running', providers: [],
      }]};
    }

    case 'stage:done':
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stageId ? {
          ...s, status: 'done' as const, durationMs: action.durationMs,
          providers: s.providers.map((p) =>
            p.status === 'running' ? { ...p, status: 'done' as const } : p
          ),
        } : s
      )};

    case 'stage:degraded':
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stageId ? { ...s, status: 'degraded' as const } : s
      )};

    case 'stage:skipped':
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stageId ? { ...s, status: 'skipped' as const } : s
      )};

    case 'provider:start':
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stageId
          ? { ...s, providers: [...s.providers, { id: action.providerId, status: 'running' as const }] }
          : s
      )};

    case 'provider:done':
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stageId ? { ...s, providers: s.providers.map((p) =>
          p.id === action.providerId ? { ...p, status: 'done' as const, durationMs: action.durationMs } : p
        )} : s
      )};

    case 'provider:fail':
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stageId ? { ...s, providers: s.providers.map((p) =>
          p.id === action.providerId ? { ...p, status: 'failed' as const, error: action.error } : p
        )} : s
      )};

    case 'pipeline:iteration':
      return { ...state, iteration: action.iteration };

    case 'pipeline:enrich':
      return {
        ...state,
        profile: action.profile ?? state.profile,
        normalizedJobs: action.normalizedJobs ?? state.normalizedJobs,
        analyses: action.analyses ?? state.analyses,
        reflectRationale: action.reflectRationale ?? state.reflectRationale,
        confidence: action.confidence ?? state.confidence,
      };

    case 'pipeline:done':
      return { ...state, view: 'dashboard', results: action.results, iteration: action.iteration, selectedJobIndex: 0, done: true };

    case 'pipeline:fail':
      return { ...state, error: action.error, done: true };

    case 'results:navigate':
      return { ...state, selectedJobIndex: action.index };

    case 'view:change':
      return { ...state, view: action.view, detailPanel: null };

    case 'kanban:open':
      return { ...state, view: 'kanban', kanbanCompanyId: action.companyId, kanbanCompanyName: action.companyName };

    case 'company-pipeline:start':
      return { ...state, pipelineCompanyId: action.companyId, pipelineCompanyName: action.companyName };

    case 'company-pipeline:clear':
      return { ...state, pipelineCompanyId: undefined, pipelineCompanyName: undefined };

    case 'profile:loaded':
      return { ...state, profile: action.profile, profileMeta: { sourceResume: action.sourceResume, updatedAt: action.updatedAt }, profileParsing: false, profileError: undefined };

    case 'profile:parsing':
      return { ...state, profileParsing: true, profileError: undefined };

    case 'profile:parse-error':
      return { ...state, profileParsing: false, profileError: action.error };

    case 'job:progress': {
      const currentJob = action.jobTitle
        ? (action.jobCompany ? `${action.jobTitle} @ ${action.jobCompany}` : action.jobTitle)
        : undefined;
      const progress: JobProgressState = {
        stage: action.stage,
        provider: action.provider,
        total: action.total,
        completed: action.completed,
        cached: action.cached,
        currentJob,
        status: action.status,
      };
      return { ...state, stages: state.stages.map((s) =>
        s.id === action.stage ? { ...s, jobProgress: progress } : s
      )};
    }

    case 'dashboard:set-tab':
      return { ...state, dashboardTab: action.tab };

    case 'dashboard:set-filter':
      return { ...state, dashboardFilter: { companyIds: action.companyIds } };

    case 'detail:open':
      return { ...state, detailPanel: { ranked: action.ranked, analyses: action.analyses } };

    case 'detail:close':
      return { ...state, detailPanel: null };

    case 'dashboard:update-triage':
      return { ...state, triageProgress: { triaged: action.triaged, total: action.total } };

    case 'summary:received':
      return { ...state, runSummary: action.summary };

    case 'summary:dismiss':
      return { ...state, runSummary: null };

    default:
      return state;
  }
}
