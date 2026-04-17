import type { RankedJob, CandidateProfile, NormalizedJob, JobAnalysis, JobKanbanColumn, FeedbackTag, UserRecord } from '../types.js';

export type ProviderStatus = 'pending' | 'running' | 'done' | 'failed' | 'skipped';
export type StageStatus = 'pending' | 'running' | 'done' | 'failed' | 'degraded' | 'skipped';

export interface ProviderState {
  id: string;
  status: ProviderStatus;
  durationMs?: number;
  error?: string;
}

export interface StageState {
  id: string;
  capability: string;
  status: StageStatus;
  durationMs?: number;
  providers: ProviderState[];
}

export type ViewName =
  | 'user-selection'
  | 'input'
  | 'pipeline'
  | 'results'
  | 'job-detail'
  | 'profile'
  | 'history'
  | 'companies'
  | 'kanban'
  | 'resume-manager';

export interface TuiState {
  view: ViewName;
  currentUser?: UserRecord;
  resumeName: string;
  resumeText?: string;
  model: string;
  iteration: number;
  maxIterations: number;
  stages: StageState[];
  results: RankedJob[];
  profile?: CandidateProfile;
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
}

export type TuiAction =
  | { type: 'user:selected'; user: UserRecord }
  | { type: 'resume:selected'; resumeName: string; resumeText: string }
  | { type: 'pipeline:start'; resumeName: string; model: string }
  | { type: 'stage:start'; stageId: string; capability: string }
  | { type: 'stage:done'; stageId: string; durationMs: number }
  | { type: 'stage:degraded'; stageId: string; reason: string }
  | { type: 'stage:skipped'; stageId: string; reason: string }
  | { type: 'provider:start'; stageId: string; providerId: string }
  | { type: 'provider:done'; stageId: string; providerId: string; durationMs: number }
  | { type: 'provider:fail'; stageId: string; providerId: string; error: string }
  | { type: 'pipeline:enrich'; profile?: CandidateProfile; normalizedJobs?: NormalizedJob[]; analyses?: JobAnalysis[]; reflectRationale?: string; confidence?: number }
  | { type: 'pipeline:done'; results: RankedJob[]; iteration: number; durationMs: number }
  | { type: 'pipeline:fail'; error: string }
  | { type: 'results:navigate'; index: number }
  | { type: 'view:change'; view: ViewName }
  | { type: 'kanban:open'; companyId: string; companyName: string }
  | { type: 'company-pipeline:start'; companyId: string; companyName: string }
  | { type: 'company-pipeline:clear' };

export const initialState: TuiState = {
  view: 'user-selection',
  resumeName: '',
  model: '',
  iteration: 1,
  maxIterations: 3,
  stages: [],
  results: [],
  selectedJobIndex: 0,
  done: false,
};

export function tuiReducer(state: TuiState, action: TuiAction): TuiState {
  switch (action.type) {
    case 'user:selected':
      return { ...state, currentUser: action.user, view: 'pipeline' };

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
      return { ...state, view: 'results', results: action.results, iteration: action.iteration, selectedJobIndex: 0, done: true };

    case 'pipeline:fail':
      return { ...state, error: action.error, done: true };

    case 'results:navigate':
      return { ...state, selectedJobIndex: action.index };

    case 'view:change':
      return { ...state, view: action.view };

    case 'kanban:open':
      return { ...state, view: 'kanban', kanbanCompanyId: action.companyId, kanbanCompanyName: action.companyName };

    case 'company-pipeline:start':
      return { ...state, pipelineCompanyId: action.companyId, pipelineCompanyName: action.companyName };

    case 'company-pipeline:clear':
      return { ...state, pipelineCompanyId: undefined, pipelineCompanyName: undefined };

    default:
      return state;
  }
}
