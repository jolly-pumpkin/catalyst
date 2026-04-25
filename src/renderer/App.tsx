import React, { useReducer, useEffect, useState, useCallback } from 'react';
import { ApiProvider, useApi } from './api.js';
import { appReducer, initialState } from './state.js';
import type { AppAction } from './state.js';
import type { JobKanbanColumn } from '../types.js';
import { Toolbar } from './components/Toolbar.js';
import { NavRail } from './components/NavRail.js';
import { StatusBar } from './components/StatusBar.js';
import { Companies } from './views/Companies.js';
import { Kanban } from './views/Kanban.js';
import { Pipeline } from './views/Pipeline.js';
import { Results } from './views/Results.js';
import { JobDetail } from './views/JobDetail.js';
import { Profile } from './views/Profile.js';
import { History } from './views/History.js';
import { ResumeManager } from './views/ResumeManager.js';
import { Settings } from './views/Settings.js';
import { Traces } from './views/Traces.js';
import { Dashboard } from './views/Dashboard.js';
import { UserSetup } from './views/UserSetup.js';
import { DetailPanel } from './components/DetailPanel.js';
import styles from './styles/App.module.css';

/* ---------- placeholder for views not yet ported ---------- */
function Placeholder({ name }: { name: string }) {
  return <div style={{ padding: 20, color: 'var(--text-secondary)' }}>
    {name} view — coming soon
  </div>;
}

/* ---------- inner shell (needs ApiProvider above it) ---------- */
function Shell() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  /* Auto-select persisted user on startup */
  useEffect(() => {
    let cancelled = false;
    api.users.current().then(async (user: any) => {
      if (cancelled) return;
      if (user) {
        await api.users.select(user.id);
        dispatch({ type: 'user:selected', user });
        dispatch({ type: 'setup:complete' });
      }
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [api]);

  /* Wire IPC push events to dispatch */
  useEffect(() => {
    const unsubs: Array<() => void> = [];

    unsubs.push(
      api.on.stageUpdate((payload: any) => {
        if (payload.type === 'start') {
          dispatch({ type: 'stage:start', stageId: payload.stageId, capability: payload.capability });
        } else if (payload.type === 'done') {
          dispatch({ type: 'stage:done', stageId: payload.stageId, durationMs: payload.durationMs });
        } else if (payload.type === 'degraded') {
          dispatch({ type: 'stage:degraded', stageId: payload.stageId, reason: payload.reason });
        } else if (payload.type === 'skipped') {
          dispatch({ type: 'stage:skipped', stageId: payload.stageId, reason: payload.reason });
        }
      }),
    );

    unsubs.push(
      api.on.providerUpdate((payload: any) => {
        if (payload.type === 'start') {
          dispatch({ type: 'provider:start', stageId: payload.stageId, providerId: payload.providerId });
        } else if (payload.type === 'done') {
          dispatch({ type: 'provider:done', stageId: payload.stageId, providerId: payload.providerId, durationMs: payload.durationMs });
        } else if (payload.type === 'fail') {
          dispatch({ type: 'provider:fail', stageId: payload.stageId, providerId: payload.providerId, error: payload.error });
        }
      }),
    );

    unsubs.push(
      api.on.iteration((payload: any) => {
        dispatch({ type: 'pipeline:iteration', iteration: payload.iteration });
      }),
    );

    unsubs.push(
      api.on.enrichment((payload: any) => {
        dispatch({ type: 'pipeline:enrich', ...payload });
      }),
    );

    unsubs.push(
      api.on.pipelineDone((payload: any) => {
        dispatch({ type: 'pipeline:done', results: payload.results, iteration: payload.iteration, durationMs: payload.durationMs });
      }),
    );

    unsubs.push(
      api.on.pipelineError((payload: any) => {
        dispatch({ type: 'pipeline:fail', error: payload.error ?? String(payload) });
      }),
    );

    unsubs.push(
      api.on.newJobs((_payload: any) => {
        /* TODO: refresh companies / job counts when indexer finds new jobs */
      }),
    );

    unsubs.push(
      api.on.jobProgress((payload: any) => {
        dispatch({ type: 'job:progress', ...payload });
      }),
    );

    return () => { unsubs.forEach((fn) => fn()); };
  }, [api]);

  /* ---------- detail panel action handler ---------- */
  const handleDetailAction = useCallback(async (jobId: string, column: JobKanbanColumn) => {
    const companyId = state.pipelineCompanyId;
    if (!companyId) {
      const companies = await api.companies.list();
      const fallback = companies[0]?.id;
      if (!fallback) return;
      await api.kanban.move(jobId, fallback, column);
    } else {
      await api.kanban.move(jobId, companyId, column);
    }
    dispatch({ type: 'detail:close' });
  }, [api, state.pipelineCompanyId]);

  /* ---------- render ---------- */
  if (loading) {
    return null;
  }

  if (!state.setupComplete) {
    return <UserSetup dispatch={dispatch} />;
  }

  return (
    <div className={styles.layout}>
      <Toolbar state={state} dispatch={dispatch} />
      <div className={styles.body}>
        <NavRail activeView={state.view} dispatch={dispatch} />
        <div className={styles.contentArea}>
          <main className={styles.content}>
            {state.view === 'dashboard' && <Dashboard state={state} dispatch={dispatch} />}
            {state.view === 'companies' && <Companies dispatch={dispatch} />}
            {state.view === 'pipeline' && <Pipeline state={state} dispatch={dispatch} />}
            {state.view === 'results' && <Results state={state} dispatch={dispatch} />}
            {state.view === 'job-detail' && <JobDetail state={state} dispatch={dispatch} />}
            {state.view === 'history' && <History dispatch={dispatch} />}
            {state.view === 'profile' && <Profile state={state} dispatch={dispatch} />}
            {state.view === 'resume-manager' && <ResumeManager state={state} dispatch={dispatch} />}
            {state.view === 'kanban' && state.kanbanCompanyId && state.kanbanCompanyName && (
              <Kanban
                companyId={state.kanbanCompanyId}
                companyName={state.kanbanCompanyName}
                dispatch={dispatch}
              />
            )}
            {state.view === 'traces' && <Traces />}
            {state.view === 'input' && <Placeholder name="Input" />}
            {state.view === 'settings' && <Settings />}
          </main>
          {state.detailPanel && (
            <DetailPanel
              ranked={state.detailPanel.ranked}
              analyses={state.detailPanel.analyses}
              onClose={() => dispatch({ type: 'detail:close' })}
              onAction={handleDetailAction}
            />
          )}
        </div>
      </div>
      <StatusBar state={state} />
    </div>
  );
}

export function App() {
  return (
    <ApiProvider>
      <Shell />
    </ApiProvider>
  );
}
