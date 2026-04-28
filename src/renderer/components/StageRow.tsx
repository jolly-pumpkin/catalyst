import React, { useState, useEffect, useRef } from 'react';
import type { StageState, ProviderState, JobProgressState } from '../state.js';
import styles from './StageRow.module.css';

function fmtDuration(ms?: number): string {
  if (!ms) return '';
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

/** Live elapsed counter — ticks every second while active. */
function Elapsed({ active }: { active: boolean }) {
  const startRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) return;
    startRef.current = Date.now();
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  if (!active || elapsed < 1000) return null;
  return <span className={styles.elapsed}>{(elapsed / 1000).toFixed(0)}s</span>;
}

const STATUS_ICON: Record<string, string> = {
  pending:  '\u00B7',   // middle dot
  running:  '',         // CSS spinner used instead
  done:     '\u2713',   // check mark
  failed:   '\u2717',   // X mark
  degraded: '\u26A0',   // warning
  skipped:  '\u2013',   // en dash
};

function ProviderRow({ provider }: { provider: ProviderState }) {
  const cls =
    provider.status === 'done' ? styles.statusDone
    : provider.status === 'failed' ? styles.statusFailed
    : provider.status === 'running' ? styles.statusRunning
    : styles.statusPending;

  return (
    <div className={styles.provider}>
      <span className={`${styles.providerIcon} ${cls}`}>
        {provider.status === 'running'
          ? <span className={styles.spinner} />
          : STATUS_ICON[provider.status]}
      </span>
      <span className={styles.providerName}>{provider.id}</span>
      {provider.status === 'running' && <Elapsed active />}
      {provider.durationMs != null && (
        <span className={styles.duration}>{fmtDuration(provider.durationMs)}</span>
      )}
      {provider.error && (
        <span className={styles.error} title={provider.error}>
          {provider.error.length > 60 ? provider.error.slice(0, 60) + '\u2026' : provider.error}
        </span>
      )}
    </div>
  );
}

function JobProgress({ progress }: { progress: JobProgressState }) {
  const pct = progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  return (
    <div className={styles.jobProgress}>
      <div className={styles.jobProgressBar}>
        <div className={styles.jobProgressFill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.jobProgressText}>
        {progress.completed}/{progress.total} jobs
        {progress.cached > 0 && <span className={styles.jobCached}> ({progress.cached} cached)</span>}
      </div>
      {progress.currentJob && progress.status === 'processing' && (
        <div className={styles.jobCurrent}>
          <span className={styles.spinner} /> {progress.currentJob}
        </div>
      )}
    </div>
  );
}

interface StageRowProps {
  stage: StageState;
}

export function StageRow({ stage }: StageRowProps) {
  const [expanded, setExpanded] = useState(stage.providers.length > 0);

  const cls =
    stage.status === 'done' ? styles.statusDone
    : stage.status === 'failed' ? styles.statusFailed
    : stage.status === 'degraded' ? styles.statusDegraded
    : stage.status === 'running' ? styles.statusRunning
    : styles.statusPending;

  return (
    <div className={styles.row}>
      <div
        className={styles.header}
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`${styles.icon} ${cls}`}>
          {stage.status === 'running'
            ? <span className={styles.spinner} />
            : STATUS_ICON[stage.status]}
        </span>
        <span className={`${styles.name} ${cls}`}>{stage.id}</span>
        {stage.status === 'running' && <Elapsed active />}
        <span className={styles.duration}>{fmtDuration(stage.durationMs)}</span>
        {stage.providers.length > 0 && (
          <span className={styles.chevron}>{expanded ? '\u25B4' : '\u25BE'}</span>
        )}
      </div>
      {expanded && stage.providers.length > 0 && (
        <div className={styles.providers}>
          {stage.providers.map((p) => (
            <ProviderRow key={p.id} provider={p} />
          ))}
        </div>
      )}
      {stage.status === 'running' && stage.jobProgress && (
        <JobProgress progress={stage.jobProgress} />
      )}
    </div>
  );
}
