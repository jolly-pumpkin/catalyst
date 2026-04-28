import React, { useState, useEffect } from 'react';
import { useApi } from '../api.js';
import styles from './Settings.module.css';

interface SettingsData {
  ollamaModel?: string;
  ollamaUrl?: string;
  indexIntervalHours?: number;
}

interface OllamaModel {
  name: string;
  size: number;
  parameterSize?: string;
  quantization?: string;
}

export function Settings() {
  const api = useApi();
  const [model, setModel] = useState('');
  const [url, setUrl] = useState('');
  const [interval, setInterval] = useState('');
  const [original, setOriginal] = useState<SettingsData>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState<string | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    setModelsLoading(true);
    setModelsError(null);
    api.ollama.models()
      .then((list: OllamaModel[]) => {
        if (cancelled) return;
        setModels(list);
        setModelsLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setModelsError(err.message);
        setModelsLoading(false);
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

  function formatSize(bytes: number): string {
    const gb = bytes / 1e9;
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1e6).toFixed(0)} MB`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Settings</span>
      </div>

      <div className={styles.card}>
        <div className={styles.field}>
          <label className={styles.label}>Ollama Model</label>
          {modelsLoading ? (
            <span className={styles.hint}>Loading models...</span>
          ) : modelsError ? (
            <>
              <input
                className={styles.input}
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="gemma4"
              />
              <span className={styles.hint}>Could not reach Ollama — enter model name manually</span>
            </>
          ) : (
            <select
              className={styles.input}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {!model && <option value="">Select a model...</option>}
              {models.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} ({formatSize(m.size)}{m.parameterSize ? `, ${m.parameterSize}` : ''}{m.quantization ? `, ${m.quantization}` : ''})
                </option>
              ))}
            </select>
          )}
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
