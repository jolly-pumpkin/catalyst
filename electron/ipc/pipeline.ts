import { ipcMain, shell } from 'electron';
import type { PipelineRunner } from 'rhodium-pipeline-runner';
import { IPC } from '../../src/shared/ipc-channels.js';
import { jobSeekerSpec } from '../../src/spec.js';
import { getBroker, getMainWindow, getModel } from '../main.js';
import { setCurrentResumeName } from '../events.js';
import { setPipelineCompanyId } from '../../src/context.js';
import { log } from '../logger.js';
import type {
  RankedJob, CandidateProfile, NormalizedJob,
  JobAnalysis, ReflectOutput,
} from '../../src/types.js';
import type { KanbanStoreCapability } from '../../src/plugins/kanban-store.js';

async function executePipeline(resumeText: string, resumeName: string, companySourceId?: string) {
  const broker = getBroker();
  if (!broker) throw new Error('No user selected');

  // Set resume name for trace recording and company scope for index-fetcher
  setCurrentResumeName(resumeName);
  setPipelineCompanyId(companySourceId);

  const runner = broker.resolve<PipelineRunner>('pipeline-runner');
  const model = getModel();
  const runId = crypto.randomUUID();
  const start = Date.now();
  const win = getMainWindow();

  log.info('pipeline', 'Pipeline started', { resumeName, model, runId, companySourceId });

  try {
    const result = await runner.run(jobSeekerSpec, { resumeText, resumeName });
    const jobs = (result.stageOutputs.get('synthesize') ?? []) as RankedJob[];
    const durationMs = Date.now() - start;

    // Save results
    const store = broker.resolve<{
      save(runId: string, resumeName: string, model: string,
           iteration: number, durationMs: number, jobs: RankedJob[],
           companySourceId?: string): Promise<void>;
      saveSummary(runId: string, summary: string): void;
      saveEnrichment(runId: string, data: {
        profile?: CandidateProfile; normalizedJobs?: NormalizedJob[];
        analyses?: JobAnalysis[]; reflectRationale?: string; confidence?: number;
      }): void;
    }>('results.store');

    await store.save(runId, resumeName, model, result.iteration, durationMs, jobs, companySourceId);

    // Extract enrichment data
    const profile = result.stageOutputs.get('parse-profile') as CandidateProfile | undefined;
    const normalizedJobs = result.stageOutputs.get('normalize-jobs') as NormalizedJob[] | undefined;
    const analyses = (result.stageOutputs.get('analyze-jobs') as JobAnalysis[][] | undefined)?.flat();
    const reflectOutput = result.stageOutputs.get('reflect') as ReflectOutput | undefined;

    store.saveEnrichment(runId, {
      profile, normalizedJobs, analyses,
      reflectRationale: reflectOutput?.rationale,
      confidence: reflectOutput?.confidence,
    });

    // Push enrichment to renderer
    if (win && !win.isDestroyed()) {
      win.webContents.send(IPC.PIPELINE_ENRICHMENT, {
        profile, normalizedJobs, analyses,
        reflectRationale: reflectOutput?.rationale,
        confidence: reflectOutput?.confidence,
      });

      win.webContents.send(IPC.PIPELINE_DONE, {
        results: jobs,
        iteration: result.iteration,
        durationMs,
        runId,
      });
    }

    // Auto-track jobs in kanban if this is a company-scoped run
    if (companySourceId && jobs.length > 0) {
      try {
        const kanban = broker.resolve<KanbanStoreCapability>('kanban.store');
        kanban.ensureTracked(companySourceId, jobs);
      } catch {
        // kanban store may not be available in all configs
      }
    }

    log.info('pipeline', 'Pipeline complete', { runId, jobCount: jobs.length, iteration: result.iteration, durationMs });

    // Generate AI summary (non-critical)
    try {
      const llm = broker.resolve<{ generate(prompt: string, opts?: { temperature?: number }): Promise<string> }>('llm.generate');
      const profileStore = broker.resolve<{ get(): import('../../src/types.js').CandidateProfile | null }>('profile.store');
      const profileData = profileStore.get();
      if (profileData && jobs.length > 0) {
        const { runSummaryPrompt } = await import('../../src/prompts/run-summary.js');
        const summaryText = await llm.generate(runSummaryPrompt(jobs, profileData), { temperature: 0.3 });
        store.saveSummary(runId, summaryText);
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC.PIPELINE_RUN_SUMMARY, { runId, summary: summaryText });
        }
      }
    } catch (err) {
      log.warn('pipeline', 'Failed to generate run summary', { runId, error: String(err) });
    }

    return { runId, jobs, iteration: result.iteration, durationMs };
  } catch (err) {
    log.error('pipeline', 'Pipeline failed', { runId, error: String(err) });
    if (win && !win.isDestroyed()) {
      win.webContents.send(IPC.PIPELINE_ERROR, { error: String(err) });
    }
    throw err;
  } finally {
    setPipelineCompanyId(undefined);
  }
}

export function registerPipelineHandlers(): void {
  ipcMain.handle(IPC.PIPELINE_RUN, async (_event, text: string, name: string) => {
    return executePipeline(text, name);
  });

  ipcMain.handle(IPC.PIPELINE_RUN_COMPANY, async (_event, text: string, name: string, companyId: string) => {
    return executePipeline(text, name, companyId);
  });

  ipcMain.handle(IPC.OPEN_URL, async (_event, url: string) => {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error('Only http/https URLs are allowed');
    }
    await shell.openExternal(url);
  });
}
