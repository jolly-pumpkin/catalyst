import React, { useState } from 'react';
import type { AppState } from '../state.js';
import styles from './Profile.module.css';

interface ProfileProps {
  state: AppState;
}

export function Profile({ state }: ProfileProps) {
  const [showRaw, setShowRaw] = useState(false);
  const p = state.profile;

  if (!p) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>Profile</span>
        </div>
        <div className={styles.emptyState}>
          <div>No profile yet.</div>
          <div>Run a pipeline first.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Profile</span>
        {state.resumeText && (
          <button className={styles.toggleBtn} onClick={() => setShowRaw(!showRaw)}>
            {showRaw ? 'Hide Resume' : 'Show Resume'}
          </button>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.name}>{p.name}</div>
        <div className={styles.experience}>{p.yearsExperience} years experience</div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Titles</div>
        <ul className={styles.list}>
          {p.titles.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Skills</div>
        <div className={styles.skills}>{p.skills.join(', ')}</div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Preferences</div>
        <div className={styles.prefsGrid}>
          <span className={styles.prefsLabel}>Locations</span>
          <span className={styles.prefsValue}>
            {p.preferredLocations.length > 0 ? p.preferredLocations.join(', ') : 'any'}
          </span>
          <span className={styles.prefsLabel}>Remote</span>
          <span className={styles.prefsValue}>{p.remotePreference}</span>
          {p.salaryExpectation && (
            <>
              <span className={styles.prefsLabel}>Salary</span>
              <span className={styles.prefsValue}>
                {p.salaryExpectation.currency} {p.salaryExpectation.min.toLocaleString()}&ndash;{p.salaryExpectation.max.toLocaleString()}
              </span>
            </>
          )}
        </div>
      </div>

      {showRaw && state.resumeText && (
        <div className={styles.rawSection}>
          <div className={styles.sectionTitle}>Resume Text</div>
          <div className={styles.rawText}>{state.resumeText}</div>
        </div>
      )}
    </div>
  );
}
