import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../api.js';
import type { AppAction } from '../state.js';
import type { CompanySource } from '../../types.js';
import styles from './Companies.module.css';

interface CompaniesProps {
  dispatch: React.Dispatch<AppAction>;
}

export function Companies({ dispatch }: CompaniesProps) {
  const api = useApi();
  const [companies, setCompanies] = useState<CompanySource[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [status, setStatus] = useState('');

  const refresh = useCallback(async () => {
    try {
      const list = await api.companies.list();
      setCompanies(list);
    } catch (err) {
      setStatus(`Error loading companies: ${err}`);
    }
  }, [api]);

  useEffect(() => { refresh(); }, [refresh]);

  async function handleAdd() {
    const url = urlInput.trim();
    if (!url) return;
    setStatus(`Detecting ATS for ${url}...`);
    try {
      const source = await api.companies.add(url);
      setStatus(`Added ${source.name} (${source.atsType})`);
      setUrlInput('');
      setAddMode(false);
      await refresh();
    } catch (err) {
      setStatus(`Error: ${err}`);
    }
  }

  async function handleRemove(company: CompanySource) {
    try {
      await api.companies.remove(company.id);
      setStatus(`Removed ${company.name}`);
      await refresh();
    } catch (err) {
      setStatus(`Error: ${err}`);
    }
  }

  async function handleToggle(company: CompanySource) {
    try {
      await api.companies.toggle(company.id, !company.enabled);
      setStatus(`${company.name} ${company.enabled ? 'disabled' : 'enabled'}`);
      await refresh();
    } catch (err) {
      setStatus(`Error: ${err}`);
    }
  }

  async function handleIndex(company: CompanySource) {
    setStatus(`Indexing ${company.name}...`);
    try {
      await api.index.company(company.id);
      setStatus(`Indexed ${company.name}`);
      await refresh();
    } catch (err) {
      setStatus(`Error: ${err}`);
    }
  }

  async function handleIndexAll() {
    setStatus('Indexing all companies...');
    try {
      await api.index.run();
      setStatus('Indexing complete');
      await refresh();
    } catch (err) {
      setStatus(`Error: ${err}`);
    }
  }

  function handleRunPipeline(company: CompanySource) {
    if (!company.enabled) {
      setStatus(`${company.name} is disabled -- enable it first`);
      return;
    }
    dispatch({ type: 'company-pipeline:start', companyId: company.id, companyName: company.name });
    dispatch({ type: 'view:change', view: 'resume-manager' });
  }

  function handleViewKanban(company: CompanySource) {
    dispatch({ type: 'kanban:open', companyId: company.id, companyName: company.name });
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Companies</span>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={handleIndexAll}>Index All</button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => { setAddMode(!addMode); setUrlInput(''); }}
          >
            {addMode ? 'Cancel' : 'Add Company'}
          </button>
        </div>
      </div>

      {addMode && (
        <div className={styles.addRow}>
          <input
            className={styles.urlInput}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAddMode(false); }}
            placeholder="https://company.com/careers"
            autoFocus
          />
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>Add</button>
        </div>
      )}

      {status && <div className={styles.status}>{status}</div>}

      {companies.length === 0 ? (
        <div className={styles.emptyState}>
          <div>No companies configured.</div>
          <div>Add a career page URL to get started.</div>
        </div>
      ) : (
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>ATS Type</th>
                <th>Status</th>
                <th>Jobs</th>
                <th>Last Indexed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td><span className={styles.atsType}>{c.atsType}</span></td>
                  <td>
                    <span className={`${styles.enabledBadge} ${c.enabled ? styles.enabled : styles.disabled}`}>
                      {c.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td>{c.jobCount}</td>
                  <td>{c.lastIndexedAt ? new Date(c.lastIndexedAt).toLocaleDateString() : '--'}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <button className={styles.rowBtn} onClick={() => handleToggle(c)}>
                        {c.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button className={styles.rowBtn} onClick={() => handleIndex(c)}>Index</button>
                      <button className={styles.rowBtn} onClick={() => handleRunPipeline(c)}>Run</button>
                      <button className={styles.rowBtn} onClick={() => handleViewKanban(c)}>Kanban</button>
                      <button className={`${styles.rowBtn} ${styles.btnDanger}`} onClick={() => handleRemove(c)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
