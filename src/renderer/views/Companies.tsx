import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../api.js';
import type { AppAction } from '../state.js';
import type { CompanyFilters, CompanySource } from '../../types.js';
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
  const [editingFilters, setEditingFilters] = useState<string | null>(null);
  const [filterDraft, setFilterDraft] = useState<CompanyFilters>({});

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

  async function handleRunPipeline(company: CompanySource) {
    if (!company.enabled) {
      setStatus(`${company.name} is disabled -- enable it first`);
      return;
    }
    setStatus(`Starting pipeline for ${company.name}...`);
    try {
      const docs = await api.docs.list();
      if (!docs || docs.length === 0) {
        setStatus('No resume found. Import one via Resume Manager first.');
        return;
      }
      const doc = docs[0];
      const text = await api.docs.read(doc.path);
      dispatch({ type: 'company-pipeline:start', companyId: company.id, companyName: company.name });
      dispatch({ type: 'resume:selected', resumeName: doc.name, resumeText: text });
      await api.pipeline.runCompany(text, doc.name, company.id);
    } catch (err) {
      setStatus(`Pipeline error: ${err}`);
    }
  }

  function handleViewKanban(company: CompanySource) {
    dispatch({ type: 'kanban:open', companyId: company.id, companyName: company.name });
  }

  function openFilterEditor(company: CompanySource) {
    setEditingFilters(company.id);
    setFilterDraft(company.filters ?? {});
  }

  async function saveFilters(companyId: string) {
    try {
      await api.companies.setFilters(companyId, filterDraft);
      setStatus('Filters saved');
      setEditingFilters(null);
      await refresh();
    } catch (err) {
      setStatus(`Error saving filters: ${err}`);
    }
  }

  function updateFilterDraft(key: keyof CompanyFilters, value: string) {
    setFilterDraft((prev) => {
      if (key === 'postedWithinDays') {
        const num = parseInt(value, 10);
        return { ...prev, [key]: isNaN(num) ? undefined : num };
      }
      const arr = value.split(',').map((s) => s.trim()).filter(Boolean);
      return { ...prev, [key]: arr.length > 0 ? arr : undefined };
    });
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
                <React.Fragment key={c.id}>
                  <tr>
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
                        <button className={styles.rowBtn} onClick={() => openFilterEditor(c)}>Filters</button>
                        <button className={styles.rowBtn} onClick={() => handleRunPipeline(c)}>Run</button>
                        <button className={styles.rowBtn} onClick={() => handleViewKanban(c)}>Kanban</button>
                        <button className={`${styles.rowBtn} ${styles.btnDanger}`} onClick={() => handleRemove(c)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                  {editingFilters === c.id && (
                    <tr>
                      <td colSpan={6}>
                        <div className={styles.filterPanel}>
                          <div className={styles.filterRow}>
                            <label className={styles.filterLabel}>Title keywords</label>
                            <input
                              className={styles.filterInput}
                              value={(filterDraft.titleKeywords ?? []).join(', ')}
                              onChange={(e) => updateFilterDraft('titleKeywords', e.target.value)}
                              placeholder="Engineer, Developer, SRE"
                            />
                          </div>
                          <div className={styles.filterRow}>
                            <label className={styles.filterLabel}>Locations</label>
                            <input
                              className={styles.filterInput}
                              value={(filterDraft.locations ?? []).join(', ')}
                              onChange={(e) => updateFilterDraft('locations', e.target.value)}
                              placeholder="Remote, San Francisco, NYC"
                            />
                          </div>
                          <div className={styles.filterRow}>
                            <label className={styles.filterLabel}>Departments</label>
                            <input
                              className={styles.filterInput}
                              value={(filterDraft.departments ?? []).join(', ')}
                              onChange={(e) => updateFilterDraft('departments', e.target.value)}
                              placeholder="Engineering, Product, Design"
                            />
                          </div>
                          <div className={styles.filterRow}>
                            <label className={styles.filterLabel}>Posted within (days)</label>
                            <input
                              className={styles.filterInput}
                              type="number"
                              value={filterDraft.postedWithinDays ?? ''}
                              onChange={(e) => updateFilterDraft('postedWithinDays', e.target.value)}
                              placeholder="30"
                            />
                          </div>
                          <div className={styles.filterActions}>
                            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => saveFilters(c.id)}>
                              Save Filters
                            </button>
                            <button className={styles.btn} onClick={() => setEditingFilters(null)}>Cancel</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
