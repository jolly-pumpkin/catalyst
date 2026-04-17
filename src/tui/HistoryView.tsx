import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { NavFooter } from './components.js';
import type { RunRecord } from '../types.js';

export function HistoryView({
  listRuns,
  onSelect,
  onBack,
}: {
  listRuns: () => Promise<RunRecord[]>;
  onSelect: (runId: string) => void;
  onBack: () => void;
}) {
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listRuns().then((r) => { if (!cancelled) setRuns(r); });
    return () => { cancelled = true; };
  }, [listRuns]);

  useInput((input, key) => {
    if (runs.length === 0) {
      if (key.escape) onBack();
      return;
    }
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1));
    if (key.downArrow) setCursor((c) => Math.min(runs.length - 1, c + 1));
    if (key.return && runs[cursor]) onSelect(runs[cursor].id);
    if (key.escape) onBack();
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1}>
      <Text bold color="yellow">catalyst — history</Text>
      <Text> </Text>
      {runs.length === 0 && <Text color="gray">No runs yet.</Text>}
      {runs.map((r, i) => (
        <Box key={r.id}>
          <Text color={i === cursor ? 'cyan' : 'white'}>
            {i === cursor ? '> ' : '  '}
            {r.resumeName.padEnd(30)} {r.iteration} iter · {r.durationMs}ms  {r.createdAt.slice(0, 16)}
          </Text>
        </Box>
      ))}
      <NavFooter hints={['↑↓ navigate', 'enter view', 'esc back']} />
    </Box>
  );
}
