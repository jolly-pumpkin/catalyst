let electron = require("electron");
//#region src/shared/ipc-channels.ts
var IPC = {
	USERS_LIST: "users:list",
	USERS_CREATE: "users:create",
	USERS_SELECT: "users:select",
	USERS_CURRENT: "users:current",
	PIPELINE_RUN: "pipeline:run",
	PIPELINE_RUN_COMPANY: "pipeline:run-company",
	COMPANIES_LIST: "companies:list",
	COMPANIES_ADD: "companies:add",
	COMPANIES_REMOVE: "companies:remove",
	COMPANIES_TOGGLE: "companies:toggle",
	COMPANIES_SET_FILTERS: "companies:set-filters",
	INDEX_RUN: "index:run",
	INDEX_COMPANY: "index:company",
	KANBAN_COLUMNS: "kanban:columns",
	KANBAN_MOVE: "kanban:move",
	KANBAN_STAGE_COUNTS: "kanban:stage-counts",
	KANBAN_RECENT_ACTIVITY: "kanban:recent-activity",
	KANBAN_RECENT_MOVES: "kanban:recent-moves",
	RESULTS_LIST_RUNS: "results:list-runs",
	RESULTS_GET_RUN: "results:get-run",
	RESULTS_GET_JOBS: "results:get-jobs",
	DOCS_LIST: "docs:list",
	DOCS_READ: "docs:read",
	DOCS_IMPORT: "docs:import",
	SETTINGS_GET: "settings:get",
	SETTINGS_SET: "settings:set",
	OLLAMA_MODELS: "ollama:models",
	PROFILE_GET: "profile:get",
	PROFILE_PARSE: "profile:parse",
	PROFILE_SAVE: "profile:save",
	OPEN_URL: "open-url",
	RESULTS_GET_ALL_JOBS: "results:get-all-jobs",
	KANBAN_FEEDBACK_SUMMARY: "kanban:feedback-summary",
	TRACES_LIST_RUNS: "traces:list-runs",
	TRACES_GET_EVENTS: "traces:get-events",
	TRACES_GET_LLM_CALLS: "traces:get-llm-calls",
	TRACES_GET_LLM_CALL: "traces:get-llm-call",
	PIPELINE_STAGE_UPDATE: "pipeline:stage-update",
	PIPELINE_PROVIDER_UPDATE: "pipeline:provider-update",
	PIPELINE_ENRICHMENT: "pipeline:enrichment",
	PIPELINE_ITERATION: "pipeline:iteration",
	PIPELINE_DONE: "pipeline:done",
	PIPELINE_ERROR: "pipeline:error",
	INDEX_NEW_JOBS: "index:new-jobs",
	PIPELINE_JOB_PROGRESS: "pipeline:job-progress",
	PIPELINE_RUN_SUMMARY: "pipeline:run-summary",
	RESULTS_GET_LATEST_SUMMARY: "results:latest-summary"
};
//#endregion
//#region electron/preload.ts
electron.contextBridge.exposeInMainWorld("catalyst", {
	users: {
		list: () => electron.ipcRenderer.invoke(IPC.USERS_LIST),
		create: (name) => electron.ipcRenderer.invoke(IPC.USERS_CREATE, name),
		select: (id) => electron.ipcRenderer.invoke(IPC.USERS_SELECT, id),
		current: () => electron.ipcRenderer.invoke(IPC.USERS_CURRENT)
	},
	pipeline: {
		run: (text, name) => electron.ipcRenderer.invoke(IPC.PIPELINE_RUN, text, name),
		runCompany: (text, name, companyId) => electron.ipcRenderer.invoke(IPC.PIPELINE_RUN_COMPANY, text, name, companyId)
	},
	companies: {
		list: () => electron.ipcRenderer.invoke(IPC.COMPANIES_LIST),
		add: (url) => electron.ipcRenderer.invoke(IPC.COMPANIES_ADD, url),
		remove: (id) => electron.ipcRenderer.invoke(IPC.COMPANIES_REMOVE, id),
		toggle: (id, enabled) => electron.ipcRenderer.invoke(IPC.COMPANIES_TOGGLE, id, enabled),
		setFilters: (id, filters) => electron.ipcRenderer.invoke(IPC.COMPANIES_SET_FILTERS, id, filters)
	},
	index: {
		run: () => electron.ipcRenderer.invoke(IPC.INDEX_RUN),
		company: (id) => electron.ipcRenderer.invoke(IPC.INDEX_COMPANY, id)
	},
	kanban: {
		columns: (companyId, column) => electron.ipcRenderer.invoke(IPC.KANBAN_COLUMNS, companyId, column),
		move: (jobId, companyId, column, feedback) => electron.ipcRenderer.invoke(IPC.KANBAN_MOVE, jobId, companyId, column, feedback)
	},
	results: {
		listRuns: () => electron.ipcRenderer.invoke(IPC.RESULTS_LIST_RUNS),
		getRun: (id) => electron.ipcRenderer.invoke(IPC.RESULTS_GET_RUN, id),
		getJobs: (id) => electron.ipcRenderer.invoke(IPC.RESULTS_GET_JOBS, id),
		getAllJobs: (companyIds) => electron.ipcRenderer.invoke(IPC.RESULTS_GET_ALL_JOBS, companyIds),
		getLatestSummary: () => electron.ipcRenderer.invoke(IPC.RESULTS_GET_LATEST_SUMMARY)
	},
	dashboard: {
		feedbackSummary: (companyIds) => electron.ipcRenderer.invoke(IPC.KANBAN_FEEDBACK_SUMMARY, companyIds),
		stageCounts: (companyIds) => electron.ipcRenderer.invoke(IPC.KANBAN_STAGE_COUNTS, companyIds),
		recentActivity: () => electron.ipcRenderer.invoke(IPC.KANBAN_RECENT_ACTIVITY),
		recentMoves: () => electron.ipcRenderer.invoke(IPC.KANBAN_RECENT_MOVES)
	},
	profile: {
		get: () => electron.ipcRenderer.invoke(IPC.PROFILE_GET),
		parse: (text, name) => electron.ipcRenderer.invoke(IPC.PROFILE_PARSE, text, name),
		save: (profile) => electron.ipcRenderer.invoke(IPC.PROFILE_SAVE, profile)
	},
	docs: {
		list: () => electron.ipcRenderer.invoke(IPC.DOCS_LIST),
		read: (path) => electron.ipcRenderer.invoke(IPC.DOCS_READ, path),
		import: () => electron.ipcRenderer.invoke(IPC.DOCS_IMPORT)
	},
	settings: {
		get: () => electron.ipcRenderer.invoke(IPC.SETTINGS_GET),
		set: (key, value) => electron.ipcRenderer.invoke(IPC.SETTINGS_SET, key, value)
	},
	ollama: { models: () => electron.ipcRenderer.invoke(IPC.OLLAMA_MODELS) },
	traces: {
		listRuns: () => electron.ipcRenderer.invoke(IPC.TRACES_LIST_RUNS),
		getEvents: (runId) => electron.ipcRenderer.invoke(IPC.TRACES_GET_EVENTS, runId),
		getLLMCalls: (runId) => electron.ipcRenderer.invoke(IPC.TRACES_GET_LLM_CALLS, runId),
		getLLMCall: (callId) => electron.ipcRenderer.invoke(IPC.TRACES_GET_LLM_CALL, callId)
	},
	openUrl: (url) => electron.ipcRenderer.invoke(IPC.OPEN_URL, url),
	on: {
		stageUpdate: (cb) => {
			const listener = (_event, payload) => cb(payload);
			electron.ipcRenderer.on(IPC.PIPELINE_STAGE_UPDATE, listener);
			return () => {
				electron.ipcRenderer.removeListener(IPC.PIPELINE_STAGE_UPDATE, listener);
			};
		},
		providerUpdate: (cb) => {
			const listener = (_event, payload) => cb(payload);
			electron.ipcRenderer.on(IPC.PIPELINE_PROVIDER_UPDATE, listener);
			return () => {
				electron.ipcRenderer.removeListener(IPC.PIPELINE_PROVIDER_UPDATE, listener);
			};
		},
		iteration: (cb) => {
			const listener = (_event, payload) => cb(payload);
			electron.ipcRenderer.on(IPC.PIPELINE_ITERATION, listener);
			return () => {
				electron.ipcRenderer.removeListener(IPC.PIPELINE_ITERATION, listener);
			};
		},
		enrichment: (cb) => {
			const listener = (_event, payload) => cb(payload);
			electron.ipcRenderer.on(IPC.PIPELINE_ENRICHMENT, listener);
			return () => {
				electron.ipcRenderer.removeListener(IPC.PIPELINE_ENRICHMENT, listener);
			};
		},
		pipelineDone: (cb) => {
			const listener = (_event, payload) => cb(payload);
			electron.ipcRenderer.on(IPC.PIPELINE_DONE, listener);
			return () => {
				electron.ipcRenderer.removeListener(IPC.PIPELINE_DONE, listener);
			};
		},
		pipelineError: (cb) => {
			const listener = (_event, payload) => cb(payload);
			electron.ipcRenderer.on(IPC.PIPELINE_ERROR, listener);
			return () => {
				electron.ipcRenderer.removeListener(IPC.PIPELINE_ERROR, listener);
			};
		},
		newJobs: (cb) => {
			const listener = (_event, payload) => cb(payload);
			electron.ipcRenderer.on(IPC.INDEX_NEW_JOBS, listener);
			return () => {
				electron.ipcRenderer.removeListener(IPC.INDEX_NEW_JOBS, listener);
			};
		},
		jobProgress: (cb) => {
			const listener = (_event, payload) => cb(payload);
			electron.ipcRenderer.on(IPC.PIPELINE_JOB_PROGRESS, listener);
			return () => {
				electron.ipcRenderer.removeListener(IPC.PIPELINE_JOB_PROGRESS, listener);
			};
		},
		runSummary: (cb) => {
			const handler = (_e, payload) => cb(payload);
			electron.ipcRenderer.on(IPC.PIPELINE_RUN_SUMMARY, handler);
			return () => {
				electron.ipcRenderer.removeListener(IPC.PIPELINE_RUN_SUMMARY, handler);
			};
		}
	}
});
//#endregion
