import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getBroker } from '../main.js';
import type {
  RunRecord, RankedJob, CandidateProfile,
  NormalizedJob, JobAnalysis,
} from '../../src/types.js';

export function registerResultsHandlers(): void {
  ipcMain.handle(IPC.RESULTS_LIST_RUNS, async () => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    const query = broker.resolve<{ listRuns(): Promise<RunRecord[]> }>('results.query');
    return query.listRuns();
  });

  ipcMain.handle(IPC.RESULTS_GET_RUN, async (_event, id: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    const query = broker.resolve<{
      getRunDetail(runId: string): Promise<{
        run: RunRecord; jobs: RankedJob[];
        profile?: CandidateProfile; normalizedJobs?: NormalizedJob[];
        analyses?: JobAnalysis[]; reflectRationale?: string; confidence?: number;
      } | null>;
    }>('results.query');
    return query.getRunDetail(id);
  });

  ipcMain.handle(IPC.RESULTS_GET_JOBS, async (_event, id: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    const query = broker.resolve<{ getJobs(runId: string): Promise<RankedJob[]> }>('results.query');
    return query.getJobs(id);
  });
}
