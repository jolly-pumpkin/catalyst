import { createBroker } from 'rhodium-core';
import { createPipelineRunnerPlugin, PIPELINE_EVENTS, STAGE_EVENTS, PROVIDER_EVENTS } from 'rhodium-pipeline-runner';
import type { PipelineRunner } from 'rhodium-pipeline-runner';
import { render } from 'ink';
import React from 'react';
import minimist from 'minimist';

import { ollamaProviderPlugin } from './plugins/ollama-provider.js';
import { resultsStorePlugin } from './plugins/results-store.js';
import { traceStorePlugin } from './plugins/trace-store.js';
import { catalogDbPlugin } from './plugins/catalog-db.js';
import { atsDetectorPlugin } from './plugins/ats-detector.js';
import { companyStorePlugin } from './plugins/company-store.js';
import { jobIndexStorePlugin } from './plugins/job-index-store.js';
import { jobIndexerPlugin } from './plugins/job-indexer.js';
import { indexFetcherPlugin } from './plugins/index-fetcher.js';
import { remotiveFetcherPlugin } from './plugins/remotive-fetcher.js';
import { profileParserPlugin } from './plugins/profile-parser.js';
import { jobNormalizerPlugin } from './plugins/job-normalizer.js';
import { skillMatcherPlugin } from './plugins/skill-matcher.js';
import { cultureFitAnalyzerPlugin } from './plugins/culture-fit-analyzer.js';
import { salaryEstimatorPlugin } from './plugins/salary-estimator.js';
import { synthesizerPlugin } from './plugins/synthesizer.js';
import { reflectionAgentPlugin } from './plugins/reflection-agent.js';
import { userManagerPlugin } from './plugins/user-manager.js';
import { kanbanStorePlugin } from './plugins/kanban-store.js';
import { jobSeekerSpec } from './spec.js';
import { loadConfig, readResumeFile, listDocsFolder } from './input.js';
import { setCatalystContext, getCatalystContext, buildUserContext } from './context.js';
import { App } from './tui/App.js';
import type { TuiAction } from './tui/state.js';
import type { UserManagerHandle } from './tui/UserSelectionView.js';
import type { KanbanStoreCapability } from './plugins/kanban-store.js';
import type { RankedJob, RunRecord, CompanySource, TraceRun, TraceEvent, TraceLLMCall, CandidateProfile, NormalizedJob, JobAnalysis, ReflectOutput, UserRecord } from './types.js';

interface CreateAppOptions {
  config: Awaited<ReturnType<typeof loadConfig>>;
  model: string;
  debug: boolean;
  autoStartIndexer?: boolean;
}

/** Create and activate the broker with all plugins. Context must be set before calling. */
async function createApp({ config, model, debug, autoStartIndexer = true }: CreateAppOptions) {
  const broker = createBroker({ debug });

  // Infrastructure
  broker.register(ollamaProviderPlugin({ model, baseUrl: config.ollamaUrl }));
  broker.register(resultsStorePlugin());
  broker.register(traceStorePlugin());
  broker.register(createPipelineRunnerPlugin());

  // Job indexer stack
  broker.register(catalogDbPlugin());
  broker.register(atsDetectorPlugin());
  broker.register(companyStorePlugin());
  broker.register(jobIndexStorePlugin());
  broker.register(jobIndexerPlugin({
    intervalHours: config.indexIntervalHours,
    autoStart: autoStartIndexer,
  }));

  // Kanban
  broker.register(kanbanStorePlugin());

  // Job sources (pipeline fetchers)
  broker.register(indexFetcherPlugin());
  broker.register(remotiveFetcherPlugin());

  // Pipeline stages
  broker.register(profileParserPlugin());
  broker.register(jobNormalizerPlugin());
  broker.register(skillMatcherPlugin());
  broker.register(cultureFitAnalyzerPlugin());
  broker.register(salaryEstimatorPlugin());
  broker.register(synthesizerPlugin());
  broker.register(reflectionAgentPlugin());

  await broker.activate();
  return broker;
}

// --- CLI subcommands ---

async function handleCompaniesCommand(argv: minimist.ParsedArgs) {
  const config = await loadConfig();
  // Need a user context for DB paths — use default or specified user
  const userName = argv.user ?? 'default';
  setCatalystContext(buildUserContext(userName));

  const broker = await createApp({
    config, model: config.ollamaModel, debug: !!argv.debug, autoStartIndexer: false,
  });

  try {
    const store = broker.resolve<{
      add(url: string): Promise<CompanySource>;
      remove(id: string): Promise<void>;
      list(): Promise<CompanySource[]>;
      setEnabled(id: string, enabled: boolean): Promise<void>;
    }>('company.store');

    const sub = argv._[1];

    if (sub === 'add') {
      const url = argv._[2];
      if (!url) {
        console.error('Usage: bun run src/index.ts companies add <url>');
        process.exit(1);
      }
      console.log(`Detecting ATS for ${url}...`);
      const source = await store.add(url);
      console.log(`Added: ${source.name} (${source.atsType}, slug: ${source.slug})`);
    } else if (sub === 'list') {
      const companies = await store.list();
      if (companies.length === 0) {
        console.log('No companies configured. Add one: bun run src/index.ts companies add <url>');
      } else {
        console.log(`\n  Watched Companies (${companies.length}):\n`);
        for (const c of companies) {
          const status = c.enabled ? 'enabled' : 'disabled';
          const indexed = c.lastIndexedAt
            ? `last indexed ${new Date(c.lastIndexedAt).toLocaleDateString()}, ${c.jobCount} jobs`
            : 'not yet indexed';
          console.log(`  ${c.name} (${c.atsType})`);
          console.log(`    id: ${c.id}`);
          console.log(`    url: ${c.url}`);
          console.log(`    status: ${status} | ${indexed}\n`);
        }
      }
    } else if (sub === 'remove') {
      const id = argv._[2];
      if (!id) {
        console.error('Usage: bun run src/index.ts companies remove <id>');
        process.exit(1);
      }
      await store.remove(id);
      console.log('Removed.');
    } else if (sub === 'enable' || sub === 'disable') {
      const id = argv._[2];
      if (!id) {
        console.error(`Usage: bun run src/index.ts companies ${sub} <id>`);
        process.exit(1);
      }
      await store.setEnabled(id, sub === 'enable');
      console.log(`Company ${sub}d.`);
    } else {
      console.error('Usage: bun run src/index.ts companies <add|list|remove|enable|disable>');
      process.exit(1);
    }
  } finally {
    await broker.deactivate();
  }

  process.exit(0);
}

async function handleIndexCommand(argv: minimist.ParsedArgs) {
  const config = await loadConfig();
  const userName = argv.user ?? 'default';
  setCatalystContext(buildUserContext(userName));

  const broker = await createApp({
    config, model: config.ollamaModel, debug: !!argv.debug, autoStartIndexer: false,
  });

  try {
    const indexer = broker.resolve<{
      indexNow(): Promise<void>;
      indexCompany(id: string): Promise<void>;
    }>('indexer.run');

    const companyId = argv._[1];
    if (companyId) {
      console.log(`Indexing company ${companyId}...`);
      await indexer.indexCompany(companyId);
    } else {
      console.log('Indexing all enabled companies...');
      await indexer.indexNow();
    }

    const jobIndex = broker.resolve<{
      stats(): Promise<{ totalJobs: number; activeJobs: number; companies: number }>;
    }>('job.index');
    const stats = await jobIndex.stats();
    console.log(`Done. ${stats.activeJobs} active jobs from ${stats.companies} companies.`);
  } finally {
    await broker.deactivate();
  }

  process.exit(0);
}

async function handleTracesCommand(argv: minimist.ParsedArgs) {
  const config = await loadConfig();
  const userName = argv.user ?? 'default';
  setCatalystContext(buildUserContext(userName));

  const broker = await createApp({
    config, model: config.ollamaModel, debug: !!argv.debug, autoStartIndexer: false,
  });

  try {
    const query = broker.resolve<{
      listRuns(): TraceRun[];
      getRun(runId: string): TraceRun | null;
      getEvents(runId: string): TraceEvent[];
      getLLMCalls(runId: string): TraceLLMCall[];
      getLLMCall(callId: string): TraceLLMCall | null;
    }>('trace.query');

    const sub = argv._[1];

    if (sub === 'show') {
      const runId = argv._[2];
      if (!runId) {
        console.error('Usage: bun run src/index.ts traces show <runId>');
        process.exit(1);
      }
      const run = query.getRun(runId);
      if (!run) {
        console.error(`Run not found: ${runId}`);
        process.exit(1);
      }

      console.log(`\n  Run ${run.runId.slice(0, 8)}`);
      console.log(`  spec: ${run.specName}  model: ${run.model}  resume: ${run.resumeName}`);
      console.log(`  status: ${run.status}  duration: ${run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : '-'}  iterations: ${run.iteration ?? '-'}`);
      console.log(`  started: ${run.startedAt}\n`);

      const events = query.getEvents(runId);
      if (events.length > 0) {
        console.log('  Events:');
        const t0 = new Date(events[0].timestamp).getTime();
        for (const e of events) {
          const offset = ((new Date(e.timestamp).getTime() - t0) / 1000).toFixed(2);
          const dur = e.durationMs != null ? ` (${(e.durationMs / 1000).toFixed(2)}s)` : '';
          const ctx = e.stageId ? ` [${e.stageId}]` : e.pluginId ? ` [${e.pluginId}]` : '';
          console.log(`    +${offset.padStart(7)}s  ${e.event}${ctx}${dur}`);
        }
      }

      const llmCalls = query.getLLMCalls(runId);
      if (llmCalls.length > 0) {
        console.log(`\n  LLM Calls (${llmCalls.length}):`);
        for (const c of llmCalls) {
          const dur = c.durationMs != null ? `${(c.durationMs / 1000).toFixed(2)}s` : '-';
          const tokens = c.promptTokens != null ? ` ${c.promptTokens}+${c.responseTokens} tok` : '';
          const status = c.error ? `ERROR: ${c.error.slice(0, 60)}` : `${dur}${tokens}`;
          const promptPreview = c.prompt.slice(0, 80).replace(/\n/g, ' ');
          console.log(`    ${c.callId.slice(0, 8)}  ${c.pluginKey.padEnd(20)}  ${status}`);
          console.log(`      prompt: ${promptPreview}...`);
        }
      }
      console.log('');

    } else if (sub === 'llm') {
      const callId = argv._[2];
      if (!callId) {
        console.error('Usage: bun run src/index.ts traces llm <callId>');
        process.exit(1);
      }
      const call = query.getLLMCall(callId);
      if (!call) {
        console.error(`LLM call not found: ${callId}`);
        process.exit(1);
      }

      console.log(`\n  LLM Call ${call.callId}`);
      console.log(`  plugin: ${call.pluginKey}  model: ${call.model}  temp: ${call.temperature}`);
      console.log(`  duration: ${call.durationMs ? `${(call.durationMs / 1000).toFixed(2)}s` : '-'}`);
      if (call.promptTokens != null) {
        console.log(`  tokens: ${call.promptTokens} prompt + ${call.responseTokens} response`);
      }
      if (call.error) {
        console.log(`  error: ${call.error}`);
      }
      console.log(`\n  --- PROMPT ---\n${call.prompt}\n`);
      if (call.response) {
        console.log(`  --- RESPONSE ---\n${call.response}\n`);
      }

    } else {
      // Default: list runs
      const runs = query.listRuns();
      if (runs.length === 0) {
        console.log('No traces recorded yet.');
      } else {
        console.log(`\n  Traces (${runs.length}):\n`);
        for (const r of runs) {
          const dur = r.durationMs ? `${(r.durationMs / 1000).toFixed(1)}s` : '-';
          const date = new Date(r.startedAt).toLocaleString();
          console.log(`  ${r.runId.slice(0, 8)}  ${r.status.padEnd(8)}  ${dur.padStart(7)}  ${r.model.padEnd(12)}  ${r.resumeName}  ${date}`);
        }
        console.log(`\n  Show details: bun run src/index.ts traces show <runId>\n`);
      }
    }
  } finally {
    await broker.deactivate();
  }

  process.exit(0);
}

// --- Main (pipeline + TUI) ---

async function main() {
  const argv = minimist(process.argv.slice(2));

  // Handle CLI subcommands (no TUI needed)
  const command = argv._[0];
  if (command === 'companies') return handleCompaniesCommand(argv);
  if (command === 'index') return handleIndexCommand(argv);
  if (command === 'traces') return handleTracesCommand(argv);

  const config = await loadConfig();
  const model = argv.model ?? config.ollamaModel;

  // --- Create a lightweight broker just for user management ---
  // (We need to know which user to load before we can set up per-user DBs)
  const userBroker = createBroker({ debug: !!argv.debug });
  userBroker.register(userManagerPlugin());
  await userBroker.activate();
  const userManager = userBroker.resolve<import('./plugins/user-manager.js').UserManagerCapability>('user.manager');

  // --- Resolve resume input (if passed via CLI) ---
  let initialResumeText: string | undefined;
  let initialResumeName: string | undefined;

  if (command) {
    initialResumeText = await readResumeFile(command);
    initialResumeName = String(command).split('/').pop() ?? String(command);
  }

  // --- TUI dispatch plumbing ---
  let resolveDispatchReady: () => void;
  const dispatchReady = new Promise<void>((r) => { resolveDispatchReady = r; });
  let tuiDispatch: ((action: TuiAction) => void) | null = null;
  const dispatch = (action: TuiAction) => tuiDispatch?.(action);

  // --- Broker + pipeline state (will be created after user is selected) ---
  let broker: Awaited<ReturnType<typeof createApp>> | null = null;
  let currentResumeName = '';

  // Pipeline runner
  async function runPipeline(resumeText: string, resumeName: string, companySourceId?: string) {
    if (!broker) return;
    currentResumeName = resumeName;
    const runner = broker.resolve<PipelineRunner>('pipeline-runner');
    const runId = crypto.randomUUID();
    const start = Date.now();

    dispatch({ type: 'pipeline:start', resumeName, model });

    try {
      const result = await runner.run(jobSeekerSpec, { resumeText, resumeName });
      const jobs = (result.stageOutputs.get('synthesize') ?? []) as RankedJob[];
      const durationMs = Date.now() - start;

      const store = broker.resolve<{
        save(runId: string, resumeName: string, model: string,
             iteration: number, durationMs: number, jobs: RankedJob[],
             companySourceId?: string): Promise<void>;
        saveEnrichment(runId: string, data: {
          profile?: CandidateProfile; normalizedJobs?: NormalizedJob[];
          analyses?: JobAnalysis[]; reflectRationale?: string; confidence?: number;
        }): void;
      }>('results.store');
      await store.save(runId, resumeName, model, result.iteration, durationMs, jobs, companySourceId);

      const profile = result.stageOutputs.get('parse-profile') as CandidateProfile | undefined;
      const normalizedJobs = result.stageOutputs.get('normalize-jobs') as NormalizedJob[] | undefined;
      const analyses = (result.stageOutputs.get('analyze-jobs') as JobAnalysis[][] | undefined)?.flat();
      const reflectOutput = result.stageOutputs.get('reflect') as ReflectOutput | undefined;

      store.saveEnrichment(runId, {
        profile, normalizedJobs, analyses,
        reflectRationale: reflectOutput?.rationale,
        confidence: reflectOutput?.confidence,
      });

      dispatch({
        type: 'pipeline:enrich',
        profile, normalizedJobs, analyses,
        reflectRationale: reflectOutput?.rationale,
        confidence: reflectOutput?.confidence,
      });

      dispatch({ type: 'pipeline:done', results: jobs, iteration: result.iteration, durationMs });

      // Auto-track jobs in kanban if this is a company-scoped run
      if (companySourceId && jobs.length > 0) {
        try {
          const kanban = broker.resolve<KanbanStoreCapability>('kanban.store');
          kanban.ensureTracked(companySourceId, jobs);
        } catch {
          // kanban store may not be available in all configs
        }
      }
    } catch (err) {
      dispatch({ type: 'pipeline:fail', error: String(err) });
    }
  }

  /** Called when user is selected — sets up the per-user broker and updates TUI. */
  async function onUserSelected(user: UserRecord) {
    // Tear down previous broker if switching users
    if (broker) {
      await broker.deactivate();
      broker = null;
    }

    // Set user context for DB paths
    const ctx = buildUserContext(user.name);
    setCatalystContext(ctx);

    // Create per-user broker
    broker = await createApp({ config, model, debug: !!argv.debug });

    // Wire broker events -> TUI after broker is ready
    wireBrokerEvents();

    // If CLI resume arg, run immediately
    if (initialResumeText && initialResumeName) {
      await runPipeline(initialResumeText, initialResumeName);
      initialResumeText = undefined; // Only run once
      initialResumeName = undefined;
    }
  }

  function wireBrokerEvents() {
    if (!broker) return;

    const on = (event: string, handler: (payload: any) => void) => {
      (broker as any).on(event, (wrapped: any) => {
        handler('detail' in wrapped ? wrapped.detail : wrapped);
      });
    };

    on(STAGE_EVENTS.STARTED, ({ stageId, capability }: any) =>
      dispatch({ type: 'stage:start', stageId, capability }));

    on(STAGE_EVENTS.COMPLETE, ({ stageId, durationMs }: any) =>
      dispatch({ type: 'stage:done', stageId, durationMs }));

    on(STAGE_EVENTS.DEGRADED, ({ stageId, reason }: any) =>
      dispatch({ type: 'stage:degraded', stageId, reason }));

    on(STAGE_EVENTS.SKIPPED, ({ stageId, reason }: any) =>
      dispatch({ type: 'stage:skipped', stageId, reason }));

    on(PROVIDER_EVENTS.SELECTED, ({ stageId, providerId }: any) =>
      dispatch({ type: 'provider:start', stageId, providerId }));

    on(PROVIDER_EVENTS.FAILED, ({ stageId, providerId, error }: any) =>
      dispatch({ type: 'provider:fail', stageId, providerId, error: String(error) }));

    // Trace store wiring
    let currentRunId: string | null = null;
    const trace = broker!.resolve<{
      startRun(runId: string, specName: string, model: string, resumeName: string): void;
      completeRun(runId: string, durationMs: number, iteration: number): void;
      failRun(runId: string, error: string): void;
      recordEvent(runId: string, event: string, payload: Record<string, unknown>): void;
      startLLMCall(runId: string, callId: string, pluginKey: string, model: string, prompt: string, temperature: number): void;
      completeLLMCall(callId: string, response: string, durationMs: number, tokens?: { prompt: number; response: number }): void;
      failLLMCall(callId: string, error: string, durationMs: number): void;
    }>('trace.store');

    on(PIPELINE_EVENTS.STARTED, (payload: any) => {
      currentRunId = payload.runId;
      trace.startRun(payload.runId, payload.specName, model, currentResumeName);
      trace.recordEvent(payload.runId, PIPELINE_EVENTS.STARTED, payload);
    });

    on(PIPELINE_EVENTS.COMPLETE, (payload: any) => {
      trace.recordEvent(payload.runId, PIPELINE_EVENTS.COMPLETE, payload);
      trace.completeRun(payload.runId, payload.durationMs, payload.stageCount);
      currentRunId = null;
    });

    on(PIPELINE_EVENTS.FAILED, (payload: any) => {
      trace.recordEvent(payload.runId, PIPELINE_EVENTS.FAILED, payload);
      trace.failRun(payload.runId, payload.error);
      currentRunId = null;
    });

    on(PIPELINE_EVENTS.HALTED_ITERATION_LIMIT, (payload: any) => {
      trace.recordEvent(payload.runId, PIPELINE_EVENTS.HALTED_ITERATION_LIMIT, payload);
    });

    on(PIPELINE_EVENTS.ITERATION_STARTED, (payload: any) => {
      trace.recordEvent(payload.runId, PIPELINE_EVENTS.ITERATION_STARTED, payload);
    });

    for (const event of [
      STAGE_EVENTS.STARTED, STAGE_EVENTS.COMPLETE,
      STAGE_EVENTS.SKIPPED, STAGE_EVENTS.DEGRADED,
      PROVIDER_EVENTS.SELECTED, PROVIDER_EVENTS.COMPLETE,
      PROVIDER_EVENTS.FAILED, PROVIDER_EVENTS.FANOUT_STARTED,
      PROVIDER_EVENTS.FANOUT_COMPLETE,
    ]) {
      on(event, (payload: any) => {
        trace.recordEvent(payload.runId, event, payload);
      });
    }

    on('llm:call-start', (payload: any) => {
      if (currentRunId) {
        trace.startLLMCall(currentRunId, payload.callId, payload.caller, payload.model, payload.prompt, payload.temperature);
      }
    });

    on('llm:call-complete', (payload: any) => {
      trace.completeLLMCall(
        payload.callId, payload.response, payload.durationMs,
        payload.promptTokens != null ? { prompt: payload.promptTokens, response: payload.responseTokens } : undefined,
      );
    });

    on('llm:call-failed', (payload: any) => {
      trace.failLLMCall(payload.callId, payload.error, payload.durationMs);
    });
  }

  // --- Render TUI ---
  // The App starts on user-selection view. Once a user is selected,
  // onUserSelected creates the per-user broker and the rest flows as before.

  const app = render(
    React.createElement(App, {
      onDispatchReady: (d: (action: TuiAction) => void) => {
        tuiDispatch = d;
        resolveDispatchReady();
      },
      onResumeSelected: (resumeText: string, resumeName: string) => {
        runPipeline(resumeText, resumeName);
      },
      onRunCompanyPipeline: (companyId: string, companyName: string) => {
        if (!broker) return;
        // Use current resume text from state
        // We need the resume — if not available, show input view
        const resumeText = (tuiDispatch as any)?.__lastResumeText;
        // Fallback: read from current context docs folder
        // For now, just dispatch to pipeline view — the pipeline will use the last resume
        dispatch({ type: 'company-pipeline:start', companyId, companyName });
        // TODO: get resume text from TUI state; for now re-use last known
      },
      onUserSelected: async (user: UserRecord) => {
        await onUserSelected(user);
      },
      onOpenUrl: (url: string) => {
        Bun.$`open ${url}`.quiet();
      },
      docs: [], // Will be updated after user selection via listUserDocs
      listUserDocs: () => listDocsFolder(getCatalystContext().docsDir),
      readResume: readResumeFile,
      listRuns: async () => {
        if (!broker) return [];
        const query = broker.resolve<{ listRuns(): Promise<RunRecord[]> }>('results.query');
        return query.listRuns();
      },
      getJobs: async (id: string) => {
        if (!broker) return [];
        const query = broker.resolve<{ getJobs(runId: string): Promise<RankedJob[]> }>('results.query');
        return query.getJobs(id);
      },
      getRunDetail: async (id: string) => {
        if (!broker) return null;
        const query = broker.resolve<{
          getRunDetail(runId: string): Promise<{
            run: RunRecord; jobs: RankedJob[];
            profile?: CandidateProfile; normalizedJobs?: NormalizedJob[];
            analyses?: JobAnalysis[]; reflectRationale?: string; confidence?: number;
          } | null>;
        }>('results.query');
        return query.getRunDetail(id);
      },
      companyStore: {
        async add(url: string) {
          if (!broker) throw new Error('No user selected');
          return broker.resolve<{ add(url: string): Promise<CompanySource> }>('company.store').add(url);
        },
        async remove(id: string) {
          if (!broker) throw new Error('No user selected');
          return broker.resolve<{ remove(id: string): Promise<void> }>('company.store').remove(id);
        },
        async list() {
          if (!broker) return [];
          return broker.resolve<{ list(): Promise<CompanySource[]> }>('company.store').list();
        },
        async setEnabled(id: string, enabled: boolean) {
          if (!broker) throw new Error('No user selected');
          return broker.resolve<{ setEnabled(id: string, enabled: boolean): Promise<void> }>('company.store').setEnabled(id, enabled);
        },
      },
      indexer: {
        async indexNow() {
          if (!broker) throw new Error('No user selected');
          return broker.resolve<{ indexNow(): Promise<void> }>('indexer.run').indexNow();
        },
        async indexCompany(id: string) {
          if (!broker) throw new Error('No user selected');
          return broker.resolve<{ indexCompany(id: string): Promise<void> }>('indexer.run').indexCompany(id);
        },
      },
      userManager: userManager as unknown as import('./tui/UserSelectionView.js').UserManagerHandle,
      kanbanStore: undefined, // Will be resolved lazily after user selection
    })
  );

  // Clean up when TUI exits
  app.waitUntilExit().then(async () => {
    if (broker) await broker.deactivate();
    await userBroker.deactivate();
  });

  await dispatchReady;
}

main().catch(console.error);
