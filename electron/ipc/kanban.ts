import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getBroker } from '../main.js';
import type { KanbanStoreCapability } from '../../src/plugins/kanban-store.js';
import type { JobKanbanColumn, FeedbackTag } from '../../src/types.js';

export function registerKanbanHandlers(): void {
  ipcMain.handle(IPC.KANBAN_COLUMNS, async (_event, companyId: string, column: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    const kanban = broker.resolve<KanbanStoreCapability>('kanban.store');
    return kanban.getColumnJobs(companyId, column as JobKanbanColumn);
  });

  ipcMain.handle(
    IPC.KANBAN_MOVE,
    async (
      _event,
      jobId: string,
      companyId: string,
      column: string,
      feedback?: { tags: string[]; notes?: string },
    ) => {
      const broker = getBroker();
      if (!broker) throw new Error('No user selected');
      const kanban = broker.resolve<KanbanStoreCapability>('kanban.store');
      kanban.moveJob(
        jobId,
        companyId,
        column as JobKanbanColumn,
        feedback ? { tags: feedback.tags as FeedbackTag[], notes: feedback.notes } : undefined,
      );
    },
  );
}
