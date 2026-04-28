import React, { useState, useEffect } from 'react';
import { useApi } from '../api.js';
import type { AppState, AppAction } from '../state.js';
import styles from './ResumeManager.module.css';

interface DocEntry {
  name: string;
  path: string;
}

interface ResumeManagerProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export function ResumeManager({ state, dispatch }: ResumeManagerProps) {
  const api = useApi();
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [pathInput, setPathInput] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.docs.list().then((list: DocEntry[]) => {
      if (!cancelled) setDocs(list);
    });
    return () => { cancelled = true; };
  }, [api]);

  async function handleSelect(path: string) {
    try {
      const text = await api.docs.read(path);
      const name = path.split('/').pop() ?? path;
      dispatch({ type: 'resume:selected', resumeName: name, resumeText: text });

      // If there's a pending company pipeline, start it
      if (state.pipelineCompanyId) {
        await api.pipeline.runCompany(text, name, state.pipelineCompanyId);
      } else {
        await api.pipeline.run(text, name);
      }
    } catch {
      // ignore
    }
  }

  function handlePathSubmit() {
    const trimmed = pathInput.trim();
    if (!trimmed) return;
    handleSelect(trimmed);
    setPathInput('');
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Resume Manager</span>
      </div>

      {state.resumeName && (
        <div className={styles.currentCard}>
          <div className={styles.currentLabel}>Current Resume</div>
          <div className={styles.currentName}>{state.resumeName}</div>
          {state.profile && (
            <div className={styles.profileSummary}>
              {state.profile.name} &middot; {state.profile.titles.join(' / ')} &middot; {state.profile.yearsExperience}y
              <br />
              Skills: {(() => { const all = Object.values(state.profile.skills).flat(); return all.slice(0, 6).join(', ') + (all.length > 6 ? ' ...' : ''); })()}
            </div>
          )}
        </div>
      )}

      <div className={styles.subtitle}>
        {state.resumeName ? 'Select a different resume:' : 'Choose a resume:'}
      </div>

      {docs.length > 0 ? (
        <div className={styles.docList}>
          {docs.map((d) => {
            const isCurrent = state.resumeName === d.name;
            return (
              <div
                key={d.path}
                className={`${styles.docItem} ${isCurrent ? styles.docItemCurrent : ''}`}
                onClick={() => handleSelect(d.path)}
              >
                {d.name}
                {isCurrent && <span className={styles.currentTag}>(current)</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          No resumes found in docs folder.
        </div>
      )}

      <div className={styles.pathSection}>
        <div className={styles.pathLabel}>Or enter a file path:</div>
        <div className={styles.pathRow}>
          <input
            className={styles.pathInput}
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handlePathSubmit(); }}
            placeholder="/path/to/resume.txt"
          />
          <button className={styles.pathBtn} onClick={handlePathSubmit}>Load</button>
        </div>
      </div>
    </div>
  );
}
