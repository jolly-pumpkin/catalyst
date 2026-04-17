import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from '../api.js';
import type { AppAction } from '../state.js';
import type { JobKanbanColumn, FeedbackTag } from '../../types.js';
import { KANBAN_COLUMNS, FEEDBACK_TAGS } from '../../types.js';
import { KanbanCard } from '../components/KanbanCard.js';
import type { KanbanCardData } from '../components/KanbanCard.js';
import styles from './Kanban.module.css';

interface KanbanProps {
  companyId: string;
  companyName: string;
  dispatch: React.Dispatch<AppAction>;
}

export function Kanban({ companyId, companyName, dispatch }: KanbanProps) {
  const api = useApi();
  const [jobsByColumn, setJobsByColumn] = useState<Record<JobKanbanColumn, KanbanCardData[]>>({
    'new': [],
    'looking-at': [],
    'applying': [],
    'rejected': [],
    'not-applying': [],
  });
  const [status, setStatus] = useState('');
  const [dragJobId, setDragJobId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<JobKanbanColumn | null>(null);

  // Feedback modal state
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState<{ jobId: string; toColumn: JobKanbanColumn } | null>(null);
  const [feedbackTags, setFeedbackTags] = useState<Set<FeedbackTag>>(new Set());
  const [feedbackNotes, setFeedbackNotes] = useState('');

  // Keyboard navigation state
  const [activeCol, setActiveCol] = useState(0);
  const [activeRow, setActiveRow] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadJobs = useCallback(async () => {
    const result: Record<JobKanbanColumn, KanbanCardData[]> = {
      'new': [],
      'looking-at': [],
      'applying': [],
      'rejected': [],
      'not-applying': [],
    };
    for (const col of KANBAN_COLUMNS) {
      try {
        const jobs = await api.kanban.columns(companyId, col.key);
        result[col.key] = (jobs ?? []).map((j: any) => ({
          jobId: j.jobId ?? j.id,
          title: j.title,
          company: j.company,
          score: j.score ?? 0,
          tags: j.tags,
        }));
      } catch {
        // column might be empty
      }
    }
    setJobsByColumn(result);
  }, [api, companyId]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  // Focus container for keyboard events
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const totalJobs = Object.values(jobsByColumn).reduce((sum, arr) => sum + arr.length, 0);

  function startFeedback(jobId: string, toColumn: JobKanbanColumn) {
    setFeedbackTarget({ jobId, toColumn });
    setFeedbackTags(new Set());
    setFeedbackNotes('');
    setFeedbackOpen(true);
  }

  async function moveJob(jobId: string, toColumn: JobKanbanColumn, feedback?: { tags: string[]; notes?: string }) {
    try {
      await api.kanban.move(jobId, companyId, toColumn, feedback);
      setStatus(`Moved to ${toColumn}${feedback ? ` with ${feedback.tags.length} tag(s)` : ''}`);
      await loadJobs();
    } catch (err) {
      setStatus(`Error: ${err}`);
    }
  }

  async function handleDrop(toColumn: JobKanbanColumn) {
    setDragOverColumn(null);
    if (!dragJobId) return;

    if (toColumn === 'rejected' || toColumn === 'not-applying') {
      startFeedback(dragJobId, toColumn);
    } else {
      await moveJob(dragJobId, toColumn);
    }
    setDragJobId(null);
  }

  function handleFeedbackConfirm() {
    if (!feedbackTarget) return;
    const tags = Array.from(feedbackTags);
    moveJob(feedbackTarget.jobId, feedbackTarget.toColumn, {
      tags,
      notes: feedbackNotes.trim() || undefined,
    });
    setFeedbackOpen(false);
    setFeedbackTarget(null);
  }

  function handleFeedbackCancel() {
    setFeedbackOpen(false);
    setFeedbackTarget(null);
  }

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (feedbackOpen) return;

    const colKey = KANBAN_COLUMNS[activeCol]?.key;
    const colJobs = colKey ? jobsByColumn[colKey] : [];

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        setActiveCol((c) => Math.max(0, c - 1));
        setActiveRow(0);
        break;
      case 'ArrowRight':
        e.preventDefault();
        setActiveCol((c) => Math.min(KANBAN_COLUMNS.length - 1, c + 1));
        setActiveRow(0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveRow((r) => Math.max(0, r - 1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveRow((r) => Math.min(colJobs.length - 1, r + 1));
        break;
      case 'm': {
        const job = colJobs[activeRow];
        if (!job) break;
        const nextCol = KANBAN_COLUMNS[Math.min(KANBAN_COLUMNS.length - 1, activeCol + 1)]?.key;
        if (!nextCol) break;
        if (nextCol === 'rejected' || nextCol === 'not-applying') {
          startFeedback(job.jobId, nextCol);
        } else {
          moveJob(job.jobId, nextCol);
        }
        break;
      }
      case 'M': {
        const job = colJobs[activeRow];
        if (!job) break;
        const prevCol = KANBAN_COLUMNS[Math.max(0, activeCol - 1)]?.key;
        if (!prevCol) break;
        moveJob(job.jobId, prevCol);
        break;
      }
      case 'r': {
        const job = colJobs[activeRow];
        if (job) startFeedback(job.jobId, 'rejected');
        break;
      }
      case 'x': {
        const job = colJobs[activeRow];
        if (job) startFeedback(job.jobId, 'not-applying');
        break;
      }
      case 'Escape':
        dispatch({ type: 'view:change', view: 'companies' });
        break;
    }
  }

  return (
    <div
      className={styles.container}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => dispatch({ type: 'view:change', view: 'companies' })}>
            Back
          </button>
          <span className={styles.title}>{companyName}</span>
        </div>
        <span className={styles.jobCount}>{totalJobs} jobs tracked</span>
      </div>

      {totalJobs === 0 ? (
        <div className={styles.emptyState}>
          <div>No jobs tracked yet.</div>
          <div>Run the pipeline for this company first.</div>
        </div>
      ) : (
        <div className={styles.board}>
          {KANBAN_COLUMNS.map((col, ci) => {
            const colJobs = jobsByColumn[col.key];
            const isActive = ci === activeCol;
            return (
              <div
                key={col.key}
                className={`${styles.column} ${isActive ? styles.columnActive : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOverColumn(col.key); }}
                onDragLeave={() => setDragOverColumn(null)}
                onDrop={() => handleDrop(col.key)}
              >
                <div className={styles.columnHeader}>
                  <span className={styles.columnName}>{col.label}</span>
                  <span className={styles.columnCount}>{colJobs.length}</span>
                </div>
                <div className={`${styles.columnBody} ${dragOverColumn === col.key ? styles.columnDragOver : ''}`}>
                  {colJobs.length === 0 && (
                    <div className={styles.emptyColumn}>--</div>
                  )}
                  {colJobs.map((job, ji) => (
                    <KanbanCard
                      key={job.jobId}
                      data={job}
                      selected={isActive && ji === activeRow}
                      onDragStart={() => setDragJobId(job.jobId)}
                      onDragEnd={() => setDragJobId(null)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {status && <div className={styles.status}>{status}</div>}
      <div className={styles.hints}>
        Arrows: navigate | m/M: move right/left | r: reject | x: skip | Esc: back
      </div>

      {/* Feedback modal */}
      {feedbackOpen && (
        <div className={styles.modalOverlay} onClick={handleFeedbackCancel}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>
              Why {feedbackTarget?.toColumn === 'rejected' ? 'reject' : 'skip'} this job?
            </div>
            <div className={styles.modalLabel}>Select tags:</div>
            <div className={styles.tagList}>
              {FEEDBACK_TAGS.map((ft) => (
                <label key={ft.tag} className={styles.tagCheckbox}>
                  <input
                    type="checkbox"
                    checked={feedbackTags.has(ft.tag)}
                    onChange={() => {
                      setFeedbackTags((prev) => {
                        const next = new Set(prev);
                        if (next.has(ft.tag)) next.delete(ft.tag);
                        else next.add(ft.tag);
                        return next;
                      });
                    }}
                  />
                  {ft.label}
                </label>
              ))}
            </div>
            <div className={styles.modalLabel}>Notes (optional):</div>
            <textarea
              className={styles.notesInput}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              placeholder="e.g. salary too low for the level"
            />
            <div className={styles.modalActions}>
              <button className={styles.modalBtn} onClick={handleFeedbackCancel}>Cancel</button>
              <button className={`${styles.modalBtn} ${styles.modalBtnConfirm}`} onClick={handleFeedbackConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
