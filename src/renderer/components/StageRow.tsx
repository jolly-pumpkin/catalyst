import React, { useState } from 'react';
import type { StageState, ProviderState } from '../state.js';
import styles from './StageRow.module.css';

function fmtDuration(ms?: number): string {
  if (!ms) return '';
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
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
      {provider.durationMs != null && (
        <span className={styles.duration}>{fmtDuration(provider.durationMs)}</span>
      )}
      {provider.error && (
        <span className={styles.error}>failed - skipped</span>
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
    </div>
  );
}
