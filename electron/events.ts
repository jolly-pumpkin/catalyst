import type { BrowserWindow } from 'electron';
import type { Broker } from 'rhodium-core';
import { PIPELINE_EVENTS, STAGE_EVENTS, PROVIDER_EVENTS } from 'rhodium-pipeline-runner';
import { IPC } from '../src/shared/ipc-channels.js';
import { getModel } from './main.js';

/**
 * Wire broker events to the renderer window via IPC.
 * Ported from src/index.ts wireBrokerEvents() — replaces TUI dispatch with
 * win.webContents.send() calls.
 */
export function wireBrokerEvents(broker: Broker, getWindow: () => BrowserWindow | null): void {
  let currentRunId: string | null = null;
  let currentResumeName = '';

  const on = (event: string, handler: (payload: any) => void) => {
    (broker as any).on(event, (wrapped: any) => {
      handler('detail' in wrapped ? wrapped.detail : wrapped);
    });
  };

  /** Safe send — checks window is still alive before sending. */
  const send = (channel: string, data: unknown) => {
    const win = getWindow();
    if (win && !win.isDestroyed()) {
      win.webContents.send(channel, data);
    }
  };

  // --- Stage events → renderer ---

  on(STAGE_EVENTS.STARTED, ({ stageId, capability }: any) => {
    send(IPC.PIPELINE_STAGE_UPDATE, {
      type: 'start', stageId, capability,
    });
  });

  on(STAGE_EVENTS.COMPLETE, ({ stageId, durationMs }: any) => {
    send(IPC.PIPELINE_STAGE_UPDATE, {
      type: 'done', stageId, durationMs,
    });
  });

  on(STAGE_EVENTS.DEGRADED, ({ stageId, reason }: any) => {
    send(IPC.PIPELINE_STAGE_UPDATE, {
      type: 'degraded', stageId, reason,
    });
  });

  on(STAGE_EVENTS.SKIPPED, ({ stageId, reason }: any) => {
    send(IPC.PIPELINE_STAGE_UPDATE, {
      type: 'skipped', stageId, reason,
    });
  });

  // --- Provider events → renderer ---

  on(PROVIDER_EVENTS.SELECTED, ({ stageId, providerId }: any) => {
    send(IPC.PIPELINE_PROVIDER_UPDATE, {
      type: 'start', stageId, providerId,
    });
  });

  on(PROVIDER_EVENTS.COMPLETE, ({ stageId, providerId, durationMs }: any) => {
    send(IPC.PIPELINE_PROVIDER_UPDATE, {
      type: 'done', stageId, providerId, durationMs,
    });
  });

  on(PROVIDER_EVENTS.FAILED, ({ stageId, providerId, error }: any) => {
    send(IPC.PIPELINE_PROVIDER_UPDATE, {
      type: 'fail', stageId, providerId, error: String(error),
    });
  });

  // --- Trace store recording ---

  const trace = broker.resolve<{
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
    trace.startRun(payload.runId, payload.specName, getModel(), currentResumeName);
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
    send(IPC.PIPELINE_ITERATION, { iteration: payload.iteration });
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

  // --- Per-job progress events → renderer ---

  on('job:progress', (payload: any) => {
    send(IPC.PIPELINE_JOB_PROGRESS, payload);
  });

  on('llm:call-start', (payload: any) => {
    if (currentRunId) {
      trace.startLLMCall(
        currentRunId, payload.callId, payload.caller,
        payload.model, payload.prompt, payload.temperature,
      );
    }
  });

  on('llm:call-complete', (payload: any) => {
    trace.completeLLMCall(
      payload.callId, payload.response, payload.durationMs,
      payload.promptTokens != null
        ? { prompt: payload.promptTokens, response: payload.responseTokens }
        : undefined,
    );
  });

  on('llm:call-failed', (payload: any) => {
    trace.failLLMCall(payload.callId, payload.error, payload.durationMs);
  });

  // Expose a way to set resume name for trace recording
  _setResumeName = (name: string) => {
    currentResumeName = name;
  };
}

let _setResumeName: ((name: string) => void) | null = null;

export function setCurrentResumeName(name: string): void {
  if (_setResumeName) _setResumeName(name);
}
