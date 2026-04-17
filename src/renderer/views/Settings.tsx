import React, { useState, useEffect } from 'react';
import { useApi } from '../api.js';
import styles from './Settings.module.css';

interface SettingsData {
  ollamaModel?: string;
  ollamaUrl?: string;
  indexIntervalHours?: number;
}

export function Settings() {
  const api = useApi();
  const [model, setModel] = useState('');
  const [url, setUrl] = useState('');
  const [interval, setInterval] = useState('');
  const [original, setOriginal] = useState<SettingsData>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.settings.get().then((s: SettingsData) => {
      if (cancelled) return;
      setModel(s.ollamaModel ?? '');
      setUrl(s.ollamaUrl ?? '');
      setInterval(String(s.indexIntervalHours ?? ''));
      setOriginal(s);
    });
    return () => { cancelled = true; };
  }, [api]);

  async function handleSave() {
    try {
      if (model !== (original.ollamaModel ?? '')) {
        await api.settings.set('ollamaModel', model);
      }
      if (url !== (original.ollamaUrl ?? '')) {
        await api.settings.set('ollamaUrl', url);
      }
      const parsedInterval = Number(interval);
      if (!isNaN(parsedInterval) && parsedInterval !== (original.indexIntervalHours ?? 0)) {
        await api.settings.set('indexIntervalHours', parsedInterval);
      }
      setOriginal({ ollamaModel: model, ollamaUrl: url, indexIntervalHours: parsedInterval || undefined });
      setStatus({ type: 'success', message: 'Settings saved.' });
    } catch (err) {
      setStatus({ type: 'error', message: `Error: ${err}` });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Settings</span>
      </div>

      <div className={styles.card}>
        <div className={styles.field}>
          <label className={styles.label}>Ollama Model</label>
          <input
            className={styles.input}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gemma4"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Ollama URL</label>
          <input
            className={styles.input}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://localhost:11434"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Index Interval (hours)</label>
          <input
            className={styles.input}
            type="number"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            placeholder="24"
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.saveBtn} onClick={handleSave}>Save</button>
        </div>
      </div>

      {status && (
        <div className={`${styles.status} ${status.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}
