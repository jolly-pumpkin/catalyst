import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { NavFooter, ScoreBar } from './components.js';
import type { RankedJob, JobKanbanColumn, FeedbackTag } from '../types.js';
import { KANBAN_COLUMNS, FEEDBACK_TAGS } from '../types.js';
import type { KanbanStoreCapability } from '../plugins/kanban-store.js';

interface KanbanJob {
  jobId: string;
  title: string;
  company: string;
  score: number;
  column: JobKanbanColumn;
}

type Mode = 'browse' | 'feedback-tags' | 'feedback-notes';

export function KanbanView({
  companyId,
  companyName,
  kanbanStore,
  onBack,
  onViewJob,
  onInputModeChange,
}: {
  companyId: string;
  companyName: string;
  kanbanStore: KanbanStoreCapability;
  onBack: () => void;
  onViewJob?: (jobId: string) => void;
  onInputModeChange: (active: boolean) => void;
}) {
  const [jobs, setJobs] = useState<KanbanJob[]>([]);
  const [columnIndex, setColumnIndex] = useState(0);
  const [rowIndices, setRowIndices] = useState<number[]>([0, 0, 0, 0, 0]);
  const [mode, setMode] = useState<Mode>('browse');
  const [selectedTags, setSelectedTags] = useState<Set<FeedbackTag>>(new Set());
  const [tagCursor, setTagCursor] = useState(0);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [pendingMove, setPendingMove] = useState<{ jobId: string; toColumn: JobKanbanColumn } | null>(null);
  const [status, setStatus] = useState('');

  function loadJobs() {
    const allJobs: KanbanJob[] = [];
    for (const col of KANBAN_COLUMNS) {
      const colJobs = kanbanStore.getColumnJobs(companyId, col.key);
      for (const job of colJobs) {
        allJobs.push({
          jobId: job.jobId,
          title: job.title,
          company: job.company,
          score: job.score,
          column: col.key,
        });
      }
    }
    setJobs(allJobs);
  }

  useEffect(() => {
    loadJobs();
  }, [companyId]);

  const getColumnJobs = (col: JobKanbanColumn) =>
    jobs.filter((j) => j.column === col);

  const currentColumn = KANBAN_COLUMNS[columnIndex]!;
  const currentColumnJobs = getColumnJobs(currentColumn.key);
  const currentRowIndex = rowIndices[columnIndex] ?? 0;
  const selectedJob = currentColumnJobs[currentRowIndex] as KanbanJob | undefined;

  useInput((input, key) => {
    if (mode === 'feedback-notes') return;

    if (mode === 'feedback-tags') {
      if (key.upArrow) setTagCursor((c) => Math.max(0, c - 1));
      if (key.downArrow) setTagCursor((c) => Math.min(FEEDBACK_TAGS.length - 1, c + 1));
      if (input === ' ') {
        const tag = FEEDBACK_TAGS[tagCursor]!.tag;
        setSelectedTags((prev) => {
          const next = new Set(prev);
          if (next.has(tag)) next.delete(tag);
          else next.add(tag);
          return next;
        });
      }
      if (key.return) {
        setMode('feedback-notes');
        setFeedbackNotes('');
        onInputModeChange(true);
      }
      if (key.escape) {
        setMode('browse');
        setPendingMove(null);
        setSelectedTags(new Set());
      }
      return;
    }

    // Browse mode
    if (key.escape) { onBack(); return; }
    if (key.leftArrow) {
      setColumnIndex((c) => Math.max(0, c - 1));
    }
    if (key.rightArrow) {
      setColumnIndex((c) => Math.min(KANBAN_COLUMNS.length - 1, c + 1));
    }
    if (key.upArrow) {
      setRowIndices((prev) => {
        const next = [...prev];
        next[columnIndex] = Math.max(0, (next[columnIndex] ?? 0) - 1);
        return next;
      });
    }
    if (key.downArrow) {
      setRowIndices((prev) => {
        const next = [...prev];
        next[columnIndex] = Math.min(currentColumnJobs.length - 1, (next[columnIndex] ?? 0) + 1);
        return next;
      });
    }

    // Move job to next column
    if (input === 'm' && selectedJob) {
      const nextColIdx = Math.min(KANBAN_COLUMNS.length - 1, columnIndex + 1);
      const toColumn = KANBAN_COLUMNS[nextColIdx]!.key;
      moveJobTo(selectedJob.jobId, toColumn);
    }

    // Move job back
    if (input === 'M' && selectedJob) {
      const prevColIdx = Math.max(0, columnIndex - 1);
      const toColumn = KANBAN_COLUMNS[prevColIdx]!.key;
      moveJobTo(selectedJob.jobId, toColumn);
    }

    // Quick-move shortcuts
    if (input === 'r' && selectedJob) moveJobTo(selectedJob.jobId, 'rejected');
    if (input === 'x' && selectedJob) moveJobTo(selectedJob.jobId, 'not-applying');

    // View job detail
    if (key.return && selectedJob && onViewJob) {
      onViewJob(selectedJob.jobId);
    }
  });

  function moveJobTo(jobId: string, toColumn: JobKanbanColumn) {
    if (toColumn === 'rejected' || toColumn === 'not-applying') {
      setPendingMove({ jobId, toColumn });
      setMode('feedback-tags');
      setSelectedTags(new Set());
      setTagCursor(0);
      return;
    }

    kanbanStore.moveJob(jobId, companyId, toColumn);
    loadJobs();
    setStatus(`Moved to ${toColumn}`);
  }

  function completeFeedbackMove(notes: string) {
    if (!pendingMove) return;
    const tags = Array.from(selectedTags);
    kanbanStore.moveJob(pendingMove.jobId, companyId, pendingMove.toColumn, {
      tags,
      notes: notes.trim() || undefined,
    });
    loadJobs();
    setStatus(`Moved to ${pendingMove.toColumn} with ${tags.length} tag(s)`);
    setPendingMove(null);
    setSelectedTags(new Set());
    setMode('browse');
    onInputModeChange(false);
  }

  const totalJobs = jobs.length;

  // Feedback modal
  if (mode === 'feedback-tags' || mode === 'feedback-notes') {
    return (
      <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1}>
        <Text bold color="yellow">
          Why {pendingMove?.toColumn === 'rejected' ? 'reject' : 'skip'} this job?
        </Text>
        <Text> </Text>

        {mode === 'feedback-tags' && (
          <>
            <Text color="gray">Select tags (space to toggle, enter to continue):</Text>
            <Text> </Text>
            {FEEDBACK_TAGS.map((ft, i) => {
              const selected = selectedTags.has(ft.tag);
              const isCursor = i === tagCursor;
              return (
                <Text key={ft.tag} color={isCursor ? 'cyan' : 'white'}>
                  {isCursor ? '> ' : '  '}{selected ? '[x]' : '[ ]'} {ft.label}
                </Text>
              );
            })}
            <Text> </Text>
            <NavFooter hints={['↑↓ navigate', 'space toggle', 'enter next', 'esc cancel']} />
          </>
        )}

        {mode === 'feedback-notes' && (
          <>
            <Text color="gray">Optional notes (enter to submit, leave empty to skip):</Text>
            <Box>
              <Text color="yellow">Notes: </Text>
              <TextInput
                value={feedbackNotes}
                onChange={setFeedbackNotes}
                onSubmit={(val) => completeFeedbackMove(val)}
                placeholder="e.g. salary too low for the level"
              />
            </Box>
          </>
        )}
      </Box>
    );
  }

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1}>
      <Box justifyContent="space-between">
        <Text bold color="blue">catalyst — {companyName} board</Text>
        <Text color="gray">{totalJobs} jobs tracked</Text>
      </Box>
      <Text> </Text>

      {totalJobs === 0 && (
        <Text color="gray">No jobs tracked yet. Run the pipeline for this company first.</Text>
      )}

      {totalJobs > 0 && (
        <Box>
          {KANBAN_COLUMNS.map((col, ci) => {
            const colJobs = getColumnJobs(col.key);
            const isActive = ci === columnIndex;
            const colColor = isActive ? 'cyan' : 'gray';

            return (
              <Box key={col.key} flexDirection="column" width={24} marginRight={1}>
                <Box borderStyle={isActive ? 'single' : undefined} borderColor={colColor}>
                  <Text bold color={colColor}>
                    {col.label} ({colJobs.length})
                  </Text>
                </Box>
                {colJobs.length === 0 && (
                  <Text color="gray" dimColor>  —</Text>
                )}
                {colJobs.map((job, ji) => {
                  const isSelected = isActive && ji === currentRowIndex;
                  return (
                    <Box key={job.jobId} flexDirection="column">
                      <Text
                        color={isSelected ? 'cyan' : 'white'}
                        bold={isSelected}
                        wrap="truncate"
                      >
                        {isSelected ? '>' : ' '} {job.title.slice(0, 20)}
                      </Text>
                      {isSelected && (
                        <Text color="gray" wrap="truncate">
                          {'  '}{job.score > 0 ? `${job.score}pts` : ''}
                        </Text>
                      )}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      )}

      {status && (
        <>
          <Text> </Text>
          <Text color="yellow">{status}</Text>
        </>
      )}

      <Text> </Text>
      <NavFooter hints={[
        '←→ columns', '↑↓ jobs', 'm move→', 'M move←',
        'r reject', 'x skip', 'enter detail', 'esc back',
      ]} />
    </Box>
  );
}
