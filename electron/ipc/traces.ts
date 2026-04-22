import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getBroker } from '../main.js';
import type { TraceRun, TraceEvent, TraceLLMCall } from '../../src/types.js';

interface TraceQuery {
  listRuns(): TraceRun[];
  getEvents(runId: string): TraceEvent[];
  getLLMCalls(runId: string): TraceLLMCall[];
  getLLMCall(callId: string): TraceLLMCall | null;
}

export function registerTraceHandlers(): void {
  ipcMain.handle(IPC.TRACES_LIST_RUNS, async () => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    return broker.resolve<TraceQuery>('trace.query').listRuns();
  });

  ipcMain.handle(IPC.TRACES_GET_EVENTS, async (_event, runId: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    return broker.resolve<TraceQuery>('trace.query').getEvents(runId);
  });

  ipcMain.handle(IPC.TRACES_GET_LLM_CALLS, async (_event, runId: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    return broker.resolve<TraceQuery>('trace.query').getLLMCalls(runId);
  });

  ipcMain.handle(IPC.TRACES_GET_LLM_CALL, async (_event, callId: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    return broker.resolve<TraceQuery>('trace.query').getLLMCall(callId);
  });
}
