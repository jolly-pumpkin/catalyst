import { Notification } from 'electron';
import type { Broker } from 'rhodium-core';
import type { CatalystConfig } from '../src/input.js';
import { IPC } from '../src/shared/ipc-channels.js';
import { getMainWindow } from './main.js';

let schedulerInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Start the background job indexer scheduler.
 * Runs indexer.run on the configured interval and notifies the renderer
 * if new jobs are found.
 */
export function startScheduler(broker: Broker, config: CatalystConfig): void {
  stopScheduler();

  const intervalMs = config.indexIntervalHours * 60 * 60 * 1000;

  schedulerInterval = setInterval(async () => {
    try {
      const jobIndex = broker.resolve<{
        stats(): Promise<{ totalJobs: number; activeJobs: number; companies: number }>;
      }>('job.index');

      const indexer = broker.resolve<{
        indexNow(): Promise<void>;
      }>('indexer.run');

      const before = await jobIndex.stats();
      await indexer.indexNow();
      const after = await jobIndex.stats();

      const newJobCount = after.activeJobs - before.activeJobs;

      if (newJobCount > 0) {
        // Show system notification
        const notification = new Notification({
          title: 'Catalyst — New Jobs Found',
          body: `${newJobCount} new job${newJobCount === 1 ? '' : 's'} indexed from ${after.companies} companies.`,
        });
        notification.show();

        // Push to renderer
        const win = getMainWindow();
        if (win) {
          win.webContents.send(IPC.INDEX_NEW_JOBS, {
            newJobCount,
            totalActive: after.activeJobs,
            companies: after.companies,
          });
        }
      }
    } catch (err) {
      console.error('[scheduler] Index tick failed:', err);
    }
  }, intervalMs);
}

/**
 * Stop the background scheduler if running.
 */
export function stopScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}
