export interface PipelineInput {
  resumeText: string;
  resumeName: string;
}

export interface CandidateProfile {
  name: string;
  skills: Record<string, string[]>;
  yearsExperience: number;
  titles: string[];
  preferredLocations: string[];
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  salaryExpectation?: { min: number; max: number; currency: string };
}

export interface RawJob {
  id: string;
  source: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedAt: string;
  department?: string;
}

export interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  skills: string[];
  description: string;
  url: string;
  source: string;
}

export interface JobAnalysis {
  jobId: string;
  variant: 'skill' | 'culture' | 'salary';
  score: number;
  reasoning: string;
  signals: string[];
  // Skill gap data (only present for variant === 'skill')
  matchedSkills?: string[];
  missingSkills?: string[];
  matchPercent?: number;
  gapSeverity?: 'minor' | 'moderate' | 'major';
}

export interface RankedJob {
  job: NormalizedJob;
  overallScore: number;
  scores: { skill: number; culture: number; salary: number };
  summary: string;
  redFlags: string[];
}

export interface ReflectOutput {
  searchRefinements?: {
    additionalKeywords?: string[];
    expandLocation?: boolean;
    relaxedRequirements?: string[];
  };
  rationale: string;
  confidence: number;
}

export interface RunRecord {
  id: string;
  createdAt: string;
  resumeName: string;
  iteration: number;
  durationMs: number;
  model: string;
}

// --- Job Indexer types ---

export type ATSType = 'greenhouse' | 'lever' | 'ashby' | 'workable';

export interface CompanySource {
  id: string;
  name: string;
  url: string;
  atsType: ATSType;
  slug: string;
  addedAt: string;
  lastIndexedAt?: string;
  jobCount: number;
  enabled: boolean;
  filters?: CompanyFilters;
}

export interface CompanyFilters {
  titleKeywords?: string[];
  locations?: string[];
  departments?: string[];
  postedWithinDays?: number;
}

export interface IndexedJob extends RawJob {
  companySourceId: string;
  firstSeenAt: string;
  lastSeenAt: string;
  isActive: boolean;
  atsType: ATSType;
}

// --- Kanban types ---

export type JobKanbanColumn = 'new' | 'looking-at' | 'applying' | 'rejected' | 'not-applying';

export type FeedbackTag =
  | 'wrong-level'
  | 'bad-location'
  | 'low-pay'
  | 'no-remote'
  | 'wrong-tech-stack'
  | 'bad-culture-fit'
  | 'other';

export const FEEDBACK_TAGS: { tag: FeedbackTag; label: string }[] = [
  { tag: 'wrong-level', label: 'Wrong level' },
  { tag: 'bad-location', label: 'Bad location' },
  { tag: 'low-pay', label: 'Low pay' },
  { tag: 'no-remote', label: 'No remote' },
  { tag: 'wrong-tech-stack', label: 'Wrong tech stack' },
  { tag: 'bad-culture-fit', label: 'Bad culture fit' },
  { tag: 'other', label: 'Other' },
];

export const KANBAN_COLUMNS: { key: JobKanbanColumn; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'looking-at', label: 'Looking At' },
  { key: 'applying', label: 'Applying' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'not-applying', label: 'Not Applying' },
];

export interface JobFeedback {
  id: string;
  jobId: string;
  companySourceId: string;
  column: JobKanbanColumn;
  tags: FeedbackTag[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// --- User types ---

export interface UserRecord {
  id: string;
  name: string;
  createdAt: string;
  dataDir: string;
}

// --- Trace types ---

export interface TraceRun {
  runId: string;
  specName: string;
  model: string;
  resumeName: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  iteration?: number;
  status: 'running' | 'complete' | 'failed';
}

export interface TraceEvent {
  id: number;
  runId: string;
  timestamp: string;
  event: string;
  stageId?: string;
  pluginId?: string;
  durationMs?: number;
  data?: Record<string, unknown>;
}

export interface TraceLLMCall {
  id: number;
  runId: string;
  callId: string;
  pluginKey: string;
  model: string;
  prompt: string;
  response?: string;
  temperature?: number;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  promptTokens?: number;
  responseTokens?: number;
  error?: string;
}
