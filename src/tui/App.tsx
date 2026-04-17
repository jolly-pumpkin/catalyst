import React, { useReducer, useEffect, useState } from 'react';
import { useInput, useApp } from 'ink';
import { tuiReducer, initialState } from './state.js';
import { PipelineView } from './PipelineView.js';
import { ResultsView } from './ResultsView.js';
import { JobDetailView } from './JobDetailView.js';
import { ProfileView } from './ProfileView.js';
import { HistoryView } from './HistoryView.js';
import { CompaniesView } from './CompaniesView.js';
import { InputView } from './InputView.js';
import { UserSelectionView } from './UserSelectionView.js';
import { KanbanView } from './KanbanView.js';
import { ResumeManagerView } from './ResumeManagerView.js';
import type { DocEntry } from './InputView.js';
import type { TuiAction } from './state.js';
import type { UserManagerHandle } from './UserSelectionView.js';
import type { KanbanStoreCapability } from '../plugins/kanban-store.js';
import type { RunRecord, RankedJob, CompanySource, CandidateProfile, NormalizedJob, JobAnalysis, UserRecord } from '../types.js';

export interface RunDetail {
  run: RunRecord;
  jobs: RankedJob[];
  profile?: CandidateProfile;
  normalizedJobs?: NormalizedJob[];
  analyses?: JobAnalysis[];
  reflectRationale?: string;
  confidence?: number;
}

export function App({
  onDispatchReady,
  onResumeSelected,
  onRunCompanyPipeline,
  onUserSelected,
  onOpenUrl,
  docs,
  listUserDocs,
  readResume,
  listRuns,
  getJobs,
  getRunDetail,
  initialRunId,
  companyStore,
  indexer,
  userManager,
  kanbanStore,
}: {
  onDispatchReady: (dispatch: (action: TuiAction) => void) => void;
  onResumeSelected: (resumeText: string, resumeName: string) => void;
  onRunCompanyPipeline?: (companyId: string, companyName: string) => void;
  onUserSelected?: (user: UserRecord) => void;
  onOpenUrl: (url: string) => void;
  docs: DocEntry[];
  listUserDocs?: () => DocEntry[];
  readResume: (filePath: string) => Promise<string>;
  listRuns: () => Promise<RunRecord[]>;
  getJobs: (runId: string) => Promise<RankedJob[]>;
  getRunDetail?: (runId: string) => Promise<RunDetail | null>;
  initialRunId?: string;
  companyStore?: {
    add(url: string): Promise<CompanySource>;
    remove(id: string): Promise<void>;
    list(): Promise<CompanySource[]>;
    setEnabled(id: string, enabled: boolean): Promise<void>;
  };
  indexer?: {
    indexNow(): Promise<void>;
    indexCompany(id: string): Promise<void>;
  };
  userManager?: UserManagerHandle;
  kanbanStore?: KanbanStoreCapability;
}) {
  const [state, dispatch] = useReducer(tuiReducer, initialState);
  const [inputActive, setInputActive] = useState(false);
  const [dynamicDocs, setDynamicDocs] = useState(docs);
  const { exit } = useApp();

  useEffect(() => {
    onDispatchReady(dispatch);
  }, [dispatch]);

  // If no user manager, skip user selection
  useEffect(() => {
    if (!userManager) {
      dispatch({ type: 'view:change', view: 'input' });
    }
  }, [userManager]);

  // Auto-restore last run on startup
  useEffect(() => {
    if (!initialRunId || !getRunDetail) return;
    let cancelled = false;
    getRunDetail(initialRunId).then((detail) => {
      if (cancelled || !detail || detail.jobs.length === 0) return;
      dispatch({
        type: 'pipeline:enrich',
        profile: detail.profile,
        normalizedJobs: detail.normalizedJobs,
        analyses: detail.analyses,
        reflectRationale: detail.reflectRationale,
        confidence: detail.confidence,
      });
      dispatch({
        type: 'pipeline:done',
        results: detail.jobs,
        iteration: detail.run.iteration,
        durationMs: detail.run.durationMs,
      });
    });
    return () => { cancelled = true; };
  }, [initialRunId]);

  useInput((input, key) => {
    if (inputActive) return;
    if (state.view === 'user-selection') return; // handled by UserSelectionView

    if (input === 'q' || (key.ctrl && input === 'c')) exit();
    if (input === 'p') dispatch({ type: 'view:change', view: 'pipeline' });
    if (input === 'r' && state.results.length > 0) dispatch({ type: 'view:change', view: 'results' });
    if (input === 'h') dispatch({ type: 'view:change', view: 'history' });
    if (input === 'c' && companyStore && indexer) dispatch({ type: 'view:change', view: 'companies' });
    if (input === 'u' && state.profile) dispatch({ type: 'view:change', view: 'profile' });
    if (input === 'n') dispatch({ type: 'view:change', view: 'input' });
    if (input === 's') dispatch({ type: 'view:change', view: 'resume-manager' });
    // Ctrl+U to switch users
    if (key.ctrl && input === 'u' && userManager) {
      dispatch({ type: 'view:change', view: 'user-selection' });
    }
  });

  // --- User Selection ---
  if (state.view === 'user-selection' && userManager) {
    return (
      <UserSelectionView
        userManager={userManager}
        onSelectUser={async (user) => {
          dispatch({ type: 'user:selected', user });
          await onUserSelected?.(user);
          if (listUserDocs) setDynamicDocs(listUserDocs());
        }}
        onInputModeChange={setInputActive}
      />
    );
  }

  // --- Companies ---
  if (state.view === 'companies' && companyStore && indexer) {
    return (
      <CompaniesView
        companyStore={companyStore}
        indexer={indexer}
        onBack={() => dispatch({ type: 'view:change', view: 'pipeline' })}
        onInputModeChange={setInputActive}
        onRunPipeline={onRunCompanyPipeline ? (companyId, companyName) => {
          dispatch({ type: 'company-pipeline:start', companyId, companyName });
          onRunCompanyPipeline(companyId, companyName);
        } : undefined}
        onViewKanban={kanbanStore ? (companyId, companyName) => {
          dispatch({ type: 'kanban:open', companyId, companyName });
        } : undefined}
      />
    );
  }

  // --- Kanban ---
  if (state.view === 'kanban' && kanbanStore && state.kanbanCompanyId) {
    return (
      <KanbanView
        companyId={state.kanbanCompanyId}
        companyName={state.kanbanCompanyName ?? ''}
        kanbanStore={kanbanStore}
        onBack={() => dispatch({ type: 'view:change', view: 'companies' })}
        onInputModeChange={setInputActive}
      />
    );
  }

  // --- Resume Manager ---
  if (state.view === 'resume-manager') {
    return (
      <ResumeManagerView
        currentResumeName={state.resumeName || undefined}
        currentProfile={state.profile}
        docs={dynamicDocs}
        onSelect={async (filePath) => {
          try {
            const text = await readResume(filePath);
            const name = filePath.split('/').pop() ?? filePath;
            dispatch({ type: 'resume:selected', resumeName: name, resumeText: text });
            onResumeSelected(text, name);
          } catch (err) {
            dispatch({ type: 'pipeline:fail', error: String(err) });
          }
        }}
        onBack={() => dispatch({ type: 'view:change', view: state.results.length > 0 ? 'results' : 'pipeline' })}
        onInputModeChange={setInputActive}
      />
    );
  }

  // --- History ---
  if (state.view === 'history') {
    return (
      <HistoryView
        listRuns={listRuns}
        onSelect={async (runId) => {
          if (getRunDetail) {
            const detail = await getRunDetail(runId);
            if (detail) {
              dispatch({
                type: 'pipeline:enrich',
                profile: detail.profile,
                normalizedJobs: detail.normalizedJobs,
                analyses: detail.analyses,
                reflectRationale: detail.reflectRationale,
                confidence: detail.confidence,
              });
              dispatch({ type: 'pipeline:done', results: detail.jobs, iteration: detail.run.iteration, durationMs: detail.run.durationMs });
              return;
            }
          }
          const jobs = await getJobs(runId);
          dispatch({ type: 'pipeline:done', results: jobs, iteration: 1, durationMs: 0 });
        }}
        onBack={() => dispatch({ type: 'view:change', view: 'results' })}
      />
    );
  }

  // --- Job Detail ---
  if (state.view === 'job-detail') {
    return (
      <JobDetailView
        state={state}
        onBack={() => dispatch({ type: 'view:change', view: 'results' })}
        onOpenUrl={onOpenUrl}
      />
    );
  }

  // --- Profile ---
  if (state.view === 'profile') {
    return (
      <ProfileView
        state={state}
        onBack={() => dispatch({ type: 'view:change', view: 'pipeline' })}
      />
    );
  }

  // --- Results ---
  if (state.view === 'results' && state.results.length > 0) {
    return (
      <ResultsView
        state={state}
        onViewJob={(index) => {
          dispatch({ type: 'results:navigate', index });
          dispatch({ type: 'view:change', view: 'job-detail' });
        }}
      />
    );
  }

  // --- Input (resume selection) ---
  if (state.view === 'input') {
    return (
      <InputView
        docs={dynamicDocs}
        onSelect={async (filePath) => {
          try {
            const text = await readResume(filePath);
            const name = filePath.split('/').pop() ?? filePath;
            dispatch({ type: 'resume:selected', resumeName: name, resumeText: text });
            onResumeSelected(text, name);
          } catch (err) {
            dispatch({ type: 'pipeline:fail', error: String(err) });
          }
        }}
        onInputModeChange={setInputActive}
      />
    );
  }

  // --- Pipeline ---
  return <PipelineView state={state} />;
}
