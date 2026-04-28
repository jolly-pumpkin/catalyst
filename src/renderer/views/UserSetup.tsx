import React, { useState } from 'react';
import { useApi } from '../api.js';
import type { AppAction } from '../state.js';
import styles from './UserSetup.module.css';

interface UserSetupProps {
  dispatch: React.Dispatch<AppAction>;
}

type Step = 1 | 2 | 3;

export function UserSetup({ dispatch }: UserSetupProps) {
  const api = useApi();
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState('');

  // Step 1 — name
  const [name, setName] = useState('');

  // Step 2 — resume
  const [resumeName, setResumeName] = useState('');

  // Step 3 — company
  const [companyUrl, setCompanyUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreateUser() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError('');
    try {
      const user = await api.users.create(trimmed);
      await api.users.select(user.id);
      dispatch({ type: 'user:selected', user });
      setStep(2);
    } catch (err) {
      setError(String(err));
    }
  }

  async function handleImportResume() {
    setError('');
    try {
      const result = await api.docs.import();
      if (result) {
        setResumeName(result.name);
      }
    } catch (err) {
      setError(String(err));
    }
  }

  async function handleAddCompany() {
    const url = companyUrl.trim();
    if (!url) return;
    setError('');
    setLoading(true);
    try {
      const source = await api.companies.add(url);
      setCompanyName(`${source.name} (${source.atsType})`);
      setCompanyUrl('');
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function handleFinish() {
    dispatch({ type: 'setup:complete' });
  }

  function stepClass(s: number) {
    if (s < step) return `${styles.step} ${styles.stepDone}`;
    if (s === step) return `${styles.step} ${styles.stepActive}`;
    return styles.step;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.heading}>Welcome to Catalyst</div>
        <div className={styles.subheading}>
          {step === 1 && "Let's set up your profile"}
          {step === 2 && 'Import your resume'}
          {step === 3 && 'Add a company to watch'}
        </div>

        <div className={styles.steps}>
          <div className={stepClass(1)} />
          <div className={stepClass(2)} />
          <div className={stepClass(3)} />
        </div>

        {step === 1 && (
          <>
            <label className={styles.label}>Your name</label>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateUser(); }}
              placeholder="e.g. jane"
              autoFocus
            />
            <div className={styles.actions}>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleCreateUser}
                disabled={!name.trim()}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <label className={styles.label}>
              Choose a resume file (.txt, .md, or .pdf)
            </label>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleImportResume}>
              Choose File
            </button>
            {resumeName && (
              <div className={styles.fileResult}>Imported: {resumeName}</div>
            )}
            <div className={styles.actions}>
              <button className={styles.btn} onClick={() => setStep(3)}>
                {resumeName ? 'Continue' : 'Skip for now'}
              </button>
              {resumeName && (
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => setStep(3)}
                >
                  Continue
                </button>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <label className={styles.label}>Company careers page URL</label>
            <input
              className={styles.input}
              value={companyUrl}
              onChange={(e) => setCompanyUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddCompany(); }}
              placeholder="https://company.com/careers"
              autoFocus
            />
            {loading && <div className={styles.status}>Detecting ATS...</div>}
            {companyName && (
              <div className={styles.companyResult}>Added: {companyName}</div>
            )}
            <div className={styles.actions}>
              {!companyName && (
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={handleAddCompany}
                  disabled={!companyUrl.trim() || loading}
                >
                  Add Company
                </button>
              )}
              {companyName && (
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={handleFinish}
                >
                  Finish Setup
                </button>
              )}
            </div>
          </>
        )}

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
