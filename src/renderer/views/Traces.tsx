import React, { useState, useEffect } from 'react';
import { useApi } from '../api.js';
import type { TraceRun, TraceEvent, TraceLLMCall } from '../../types.js';
import styles from './Traces.module.css';

function fmtDuration(ms?: number): string {
  if (ms == null) return '-';
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function fmtTime(iso: string): string {
  return iso.replace('T', ' ').slice(0, 19);
}

/* ---------- Events tab ---------- */
function EventsTab({ events }: { events: TraceEvent[] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Time</th>
          <th>Event</th>
          <th>Stage</th>
          <th>Plugin</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {events.map((e) => {
          const hasError = e.data?.error != null;
          return (
            <tr key={e.id} className={hasError ? styles.errorRow : undefined} title={hasError ? String(e.data!.error) : undefined}>
              <td>{fmtTime(e.timestamp)}</td>
              <td className={styles.eventName}>{e.event}</td>
              <td>{e.stageId ?? '-'}</td>
              <td>{e.pluginId ?? '-'}</td>
              <td>{fmtDuration(e.durationMs)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ---------- LLM Calls tab ---------- */
function LLMCallsTab({ calls }: { calls: TraceLLMCall[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Plugin</th>
          <th>Model</th>
          <th>Duration</th>
          <th>Tokens</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {calls.map((c) => (
          <React.Fragment key={c.id}>
            <tr
              className={`${styles.expandable} ${c.error ? styles.errorRow : ''}`}
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
            >
              <td>{c.pluginKey}</td>
              <td>{c.model}</td>
              <td>{fmtDuration(c.durationMs)}</td>
              <td>
                {c.promptTokens != null
                  ? `${c.promptTokens} / ${c.responseTokens ?? '-'}`
                  : '-'}
              </td>
              <td>{c.error ? 'failed' : c.completedAt ? 'done' : 'running'}</td>
            </tr>
            {expandedId === c.id && (
              <tr>
                <td colSpan={5} className={styles.expandedContent}>
                  {c.error && (
                    <div className={styles.expandedSection}>
                      <div className={styles.expandedLabel}>Error</div>
                      <pre>{c.error}</pre>
                    </div>
                  )}
                  <div className={styles.expandedSection}>
                    <div className={styles.expandedLabel}>Prompt</div>
                    <pre>{c.prompt}</pre>
                  </div>
                  {c.response && (
                    <div className={styles.expandedSection}>
                      <div className={styles.expandedLabel}>Response</div>
                      <pre>{c.response}</pre>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

/* ---------- Main Traces view ---------- */
export function Traces() {
  const api = useApi();
  const [runs, setRuns] = useState<TraceRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const [llmCalls, setLLMCalls] = useState<TraceLLMCall[]>([]);
  const [tab, setTab] = useState<'events' | 'llm'>('events');

  // Load run list
  useEffect(() => {
    let cancelled = false;
    api.traces.listRuns().then((r: TraceRun[]) => {
      if (!cancelled) setRuns(r);
    });
    return () => { cancelled = true; };
  }, [api]);

  // Load detail when a run is selected
  useEffect(() => {
    if (!selectedRunId) {
      setEvents([]);
      setLLMCalls([]);
      return;
    }
    let cancelled = false;
    Promise.all([
      api.traces.getEvents(selectedRunId),
      api.traces.getLLMCalls(selectedRunId),
    ]).then(([ev, lc]: [TraceEvent[], TraceLLMCall[]]) => {
      if (!cancelled) {
        setEvents(ev);
        setLLMCalls(lc);
      }
    });
    return () => { cancelled = true; };
  }, [selectedRunId, api]);

  const selectedRun = runs.find((r) => r.runId === selectedRunId);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Traces</span>
      </div>

      {runs.length === 0 ? (
        <div className={styles.emptyState}>
          <div>No trace runs recorded yet.</div>
        </div>
      ) : (
        <div className={styles.panels}>
          {/* Run list */}
          <div className={styles.runList}>
            {runs.map((r) => (
              <div
                key={r.runId}
                className={`${styles.runItem} ${r.runId === selectedRunId ? styles.runItemActive : ''}`}
                onClick={() => setSelectedRunId(r.runId)}
              >
                <div className={styles.runMeta}>
                  <span className={`${styles.runStatus} ${
                    r.status === 'complete' ? styles.statusComplete
                    : r.status === 'failed' ? styles.statusFailed
                    : styles.statusRunning
                  }`}>
                    {r.status}
                  </span>
                  <span className={styles.runDuration}>{fmtDuration(r.durationMs)}</span>
                </div>
                <div className={styles.runDate}>
                  {r.resumeName} &middot; {r.model} &middot; {fmtTime(r.startedAt)}
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div className={styles.detail}>
            {!selectedRun ? (
              <div className={styles.emptyState}>Select a run to view details</div>
            ) : (
              <>
                <div className={styles.tabs}>
                  <button
                    className={`${styles.tab} ${tab === 'events' ? styles.tabActive : ''}`}
                    onClick={() => setTab('events')}
                  >
                    Events ({events.length})
                  </button>
                  <button
                    className={`${styles.tab} ${tab === 'llm' ? styles.tabActive : ''}`}
                    onClick={() => setTab('llm')}
                  >
                    LLM Calls ({llmCalls.length})
                  </button>
                </div>
                {tab === 'events' && <EventsTab events={events} />}
                {tab === 'llm' && <LLMCallsTab calls={llmCalls} />}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
