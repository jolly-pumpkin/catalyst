import React, { useState, useEffect } from 'react';
import { useApi } from '../api.js';
import type { AppAction } from '../state.js';
import type { RunRecord } from '../../types.js';
import styles from './History.module.css';

interface HistoryProps {
  dispatch: React.Dispatch<AppAction>;
}

export function History({ dispatch }: HistoryProps) {
  const api = useApi();
  const [runs, setRuns] = useState<RunRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    api.results.listRuns().then((r: RunRecord[]) => {
      if (!cancelled) setRuns(r);
    });
    return () => { cancelled = true; };
  }, [api]);

  async function handleSelect(runId: string) {
    try {
      const detail = await api.results.getRun(runId);
      if (!detail) return;
      // Navigate to results with loaded data
      dispatch({ type: 'pipeline:done', results: detail.jobs, iteration: detail.run.iteration ?? 1, durationMs: 0 });
      dispatch({ type: 'pipeline:enrich', analyses: detail.analyses });
      dispatch({ type: 'view:change', view: 'results' });
    } catch {
      // ignore
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>History</span>
      </div>

      {runs.length === 0 ? (
        <div className={styles.emptyState}>
          <div>No runs yet.</div>
        </div>
      ) : (
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Resume</th>
                <th>Iterations</th>
                <th>Duration</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id} className={styles.clickableRow} onClick={() => handleSelect(r.id)}>
                  <td>{r.resumeName}</td>
                  <td>{r.iteration}</td>
                  <td>{r.durationMs < 1000 ? `${r.durationMs}ms` : `${(r.durationMs / 1000).toFixed(1)}s`}</td>
                  <td>{r.createdAt.slice(0, 16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
