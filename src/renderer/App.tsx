import React, { useReducer, useEffect } from 'react';
import { ApiProvider, useApi } from './api.js';
import { appReducer, initialState } from './state.js';
import type { AppState, AppAction } from './state.js';
import { Toolbar } from './components/Toolbar.js';
import { NavRail } from './components/NavRail.js';
import { StatusBar } from './components/StatusBar.js';
import styles from './styles/App.module.css';

/* ---------- placeholder views (Tasks 19-24 will replace these) ---------- */
function Placeholder({ name }: { name: string }) {
  return <div style={{ padding: 20, color: 'var(--text-secondary)' }}>
    {name} view — coming soon
  </div>;
}

/* ---------- inner shell (needs ApiProvider above it) ---------- */
function Shell() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const api = useApi();

  /* Wire IPC push events to dispatch */
  useEffect(() => {
    const unsubs: Array<() => void> = [];

    unsubs.push(
      api.on.stageUpdate((payload: any) => {
        if (payload.status === 'start') {
          dispatch({ type: 'stage:start', stageId: payload.stageId, capability: payload.capability });
        } else if (payload.status === 'done') {
          dispatch({ type: 'stage:done', stageId: payload.stageId, durationMs: payload.durationMs });
        } else if (payload.status === 'degraded') {
          dispatch({ type: 'stage:degraded', stageId: payload.stageId, reason: payload.reason });
        } else if (payload.status === 'skipped') {
          dispatch({ type: 'stage:skipped', stageId: payload.stageId, reason: payload.reason });
        }
      }),
    );

    unsubs.push(
      api.on.providerUpdate((payload: any) => {
        if (payload.status === 'start') {
          dispatch({ type: 'provider:start', stageId: payload.stageId, providerId: payload.providerId });
        } else if (payload.status === 'done') {
          dispatch({ type: 'provider:done', stageId: payload.stageId, providerId: payload.providerId, durationMs: payload.durationMs });
        } else if (payload.status === 'fail') {
          dispatch({ type: 'provider:fail', stageId: payload.stageId, providerId: payload.providerId, error: payload.error });
        }
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

    return () => { unsubs.forEach((fn) => fn()); };
  }, [api]);

  /* ---------- render ---------- */
  return (
    <div className={styles.layout}>
      <Toolbar state={state} dispatch={dispatch} />
      <div className={styles.body}>
        <NavRail activeView={state.view} dispatch={dispatch} />
        <main className={styles.content}>
          {state.view === 'companies' && <Placeholder name="Companies" />}
          {state.view === 'pipeline' && <Placeholder name="Pipeline" />}
          {state.view === 'results' && <Placeholder name="Results" />}
          {state.view === 'job-detail' && <Placeholder name="Job Detail" />}
          {state.view === 'history' && <Placeholder name="History" />}
          {state.view === 'profile' && <Placeholder name="Profile" />}
          {state.view === 'resume-manager' && <Placeholder name="Resume Manager" />}
          {state.view === 'kanban' && <Placeholder name="Kanban" />}
          {state.view === 'input' && <Placeholder name="Input" />}
          {state.view === 'settings' && <Placeholder name="Settings" />}
          {state.view === 'user-selection' && <Placeholder name="User Selection" />}
        </main>
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
