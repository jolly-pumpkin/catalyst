import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from '../src/shared/ipc-channels.js';

const api = {
  users: {
    list: () => ipcRenderer.invoke(IPC.USERS_LIST),
    create: (name: string) => ipcRenderer.invoke(IPC.USERS_CREATE, name),
    select: (id: string) => ipcRenderer.invoke(IPC.USERS_SELECT, id),
    current: () => ipcRenderer.invoke(IPC.USERS_CURRENT),
  },

  pipeline: {
    run: (text: string, name: string) =>
      ipcRenderer.invoke(IPC.PIPELINE_RUN, text, name),
    runCompany: (text: string, name: string, companyId: string) =>
      ipcRenderer.invoke(IPC.PIPELINE_RUN_COMPANY, text, name, companyId),
  },

  companies: {
    list: () => ipcRenderer.invoke(IPC.COMPANIES_LIST),
    add: (url: string) => ipcRenderer.invoke(IPC.COMPANIES_ADD, url),
    remove: (id: string) => ipcRenderer.invoke(IPC.COMPANIES_REMOVE, id),
    toggle: (id: string, enabled: boolean) =>
      ipcRenderer.invoke(IPC.COMPANIES_TOGGLE, id, enabled),
  },

  index: {
    run: () => ipcRenderer.invoke(IPC.INDEX_RUN),
    company: (id: string) => ipcRenderer.invoke(IPC.INDEX_COMPANY, id),
  },

  kanban: {
    columns: (companyId: string, column: string) =>
      ipcRenderer.invoke(IPC.KANBAN_COLUMNS, companyId, column),
    move: (
      jobId: string,
      companyId: string,
      column: string,
      feedback?: { tags: string[]; notes?: string },
    ) => ipcRenderer.invoke(IPC.KANBAN_MOVE, jobId, companyId, column, feedback),
  },

  results: {
    listRuns: () => ipcRenderer.invoke(IPC.RESULTS_LIST_RUNS),
    getRun: (id: string) => ipcRenderer.invoke(IPC.RESULTS_GET_RUN, id),
    getJobs: (id: string) => ipcRenderer.invoke(IPC.RESULTS_GET_JOBS, id),
    getAllJobs: (companyIds?: string[]) =>
      ipcRenderer.invoke(IPC.RESULTS_GET_ALL_JOBS, companyIds),
  },

  dashboard: {
    feedbackSummary: (companyIds?: string[]) =>
      ipcRenderer.invoke(IPC.KANBAN_FEEDBACK_SUMMARY, companyIds),
  },

  profile: {
    get: () => ipcRenderer.invoke(IPC.PROFILE_GET),
    parse: (text: string, name: string) =>
      ipcRenderer.invoke(IPC.PROFILE_PARSE, text, name),
    save: (profile: unknown) => ipcRenderer.invoke(IPC.PROFILE_SAVE, profile),
  },

  docs: {
    list: () => ipcRenderer.invoke(IPC.DOCS_LIST),
    read: (path: string) => ipcRenderer.invoke(IPC.DOCS_READ, path),
    import: () => ipcRenderer.invoke(IPC.DOCS_IMPORT),
  },

  settings: {
    get: () => ipcRenderer.invoke(IPC.SETTINGS_GET),
    set: (key: string, value: unknown) =>
      ipcRenderer.invoke(IPC.SETTINGS_SET, key, value),
  },

  ollama: {
    models: () => ipcRenderer.invoke(IPC.OLLAMA_MODELS),
  },

  traces: {
    listRuns: () => ipcRenderer.invoke(IPC.TRACES_LIST_RUNS),
    getEvents: (runId: string) => ipcRenderer.invoke(IPC.TRACES_GET_EVENTS, runId),
    getLLMCalls: (runId: string) => ipcRenderer.invoke(IPC.TRACES_GET_LLM_CALLS, runId),
    getLLMCall: (callId: string) => ipcRenderer.invoke(IPC.TRACES_GET_LLM_CALL, callId),
  },

  openUrl: (url: string) => ipcRenderer.invoke(IPC.OPEN_URL, url),

  on: {
    stageUpdate: (cb: (payload: unknown) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, payload: unknown) => cb(payload);
      ipcRenderer.on(IPC.PIPELINE_STAGE_UPDATE, listener);
      return () => { ipcRenderer.removeListener(IPC.PIPELINE_STAGE_UPDATE, listener); };
    },
    providerUpdate: (cb: (payload: unknown) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, payload: unknown) => cb(payload);
      ipcRenderer.on(IPC.PIPELINE_PROVIDER_UPDATE, listener);
      return () => { ipcRenderer.removeListener(IPC.PIPELINE_PROVIDER_UPDATE, listener); };
    },
    iteration: (cb: (payload: unknown) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, payload: unknown) => cb(payload);
      ipcRenderer.on(IPC.PIPELINE_ITERATION, listener);
      return () => { ipcRenderer.removeListener(IPC.PIPELINE_ITERATION, listener); };
    },
    enrichment: (cb: (payload: unknown) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, payload: unknown) => cb(payload);
      ipcRenderer.on(IPC.PIPELINE_ENRICHMENT, listener);
      return () => { ipcRenderer.removeListener(IPC.PIPELINE_ENRICHMENT, listener); };
    },
    pipelineDone: (cb: (payload: unknown) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, payload: unknown) => cb(payload);
      ipcRenderer.on(IPC.PIPELINE_DONE, listener);
      return () => { ipcRenderer.removeListener(IPC.PIPELINE_DONE, listener); };
    },
    pipelineError: (cb: (payload: unknown) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, payload: unknown) => cb(payload);
      ipcRenderer.on(IPC.PIPELINE_ERROR, listener);
      return () => { ipcRenderer.removeListener(IPC.PIPELINE_ERROR, listener); };
    },
    newJobs: (cb: (payload: unknown) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, payload: unknown) => cb(payload);
      ipcRenderer.on(IPC.INDEX_NEW_JOBS, listener);
      return () => { ipcRenderer.removeListener(IPC.INDEX_NEW_JOBS, listener); };
    },
    jobProgress: (cb: (payload: unknown) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, payload: unknown) => cb(payload);
      ipcRenderer.on(IPC.PIPELINE_JOB_PROGRESS, listener);
      return () => { ipcRenderer.removeListener(IPC.PIPELINE_JOB_PROGRESS, listener); };
    },
  },
};

contextBridge.exposeInMainWorld('catalyst', api);

export type CatalystAPI = typeof api;
