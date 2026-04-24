import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getBroker } from '../main.js';
import type { RankedJob, JobAnalysis } from '../../src/types.js';
import type { KanbanStoreCapability } from '../../src/plugins/kanban-store.js';

export function registerDashboardHandlers(): void {
  ipcMain.handle(IPC.RESULTS_GET_ALL_JOBS, async (_event, companyIds?: string[]) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');

    const query = broker.resolve<{
      listRuns(): Promise<{ id: string }[]>;
      getJobs(runId: string): Promise<RankedJob[]>;
      getRunDetail(runId: string): Promise<{ analyses?: JobAnalysis[] } | null>;
    }>('results.query');

    const runs = await query.listRuns();
    const jobMap = new Map<string, { ranked: RankedJob; analyses: JobAnalysis[] }>();

    for (const run of runs) {
      const jobs = await query.getJobs(run.id);
      const detail = await query.getRunDetail(run.id);
      const analyses = detail?.analyses ?? [];

      for (const ranked of jobs) {
        if (!jobMap.has(ranked.job.id)) {
          const jobAnalyses = analyses.filter((a) => a.jobId === ranked.job.id);
          jobMap.set(ranked.job.id, { ranked, analyses: jobAnalyses });
        }
      }
    }

    let entries = Array.from(jobMap.values());

    if (companyIds && companyIds.length > 0) {
      try {
        const kanban = broker.resolve<KanbanStoreCapability>('kanban.store');
        entries = entries.filter((e) => {
          return companyIds.some((cid) => {
            const cols = ['new', 'looking-at', 'applying', 'rejected', 'not-applying'] as const;
            return cols.some((col) => {
              const jobs = kanban.getColumnJobs(cid, col);
              return jobs.some((j) => j.jobId === e.ranked.job.id);
            });
          });
        });
      } catch {
        // kanban not available, return unfiltered
      }
    }

    return entries;
  });

  ipcMain.handle(IPC.KANBAN_FEEDBACK_SUMMARY, async (_event, companyIds?: string[]) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');

    const kanban = broker.resolve<KanbanStoreCapability>('kanban.store');

    if (!companyIds || companyIds.length === 0) {
      return kanban.getFeedbackSummary();
    }

    const combined = {
      totalRejected: 0,
      totalNotApplying: 0,
      tagCounts: {} as Record<string, number>,
      recentNotes: [] as string[],
    };

    for (const cid of companyIds) {
      const summary = kanban.getFeedbackSummary(cid);
      combined.totalRejected += summary.totalRejected;
      combined.totalNotApplying += summary.totalNotApplying;
      for (const [tag, count] of Object.entries(summary.tagCounts)) {
        combined.tagCounts[tag] = (combined.tagCounts[tag] ?? 0) + count;
      }
      combined.recentNotes.push(...summary.recentNotes);
    }

    combined.recentNotes = combined.recentNotes.slice(-10);
    return combined;
  });
}
