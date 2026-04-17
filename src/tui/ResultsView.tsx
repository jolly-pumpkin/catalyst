import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { ScoreBar, NavFooter } from './components.js';
import type { TuiState } from './state.js';

const VISIBLE = 8;

export function ResultsView({
  state,
  onViewJob,
}: {
  state: TuiState;
  onViewJob: (index: number) => void;
}) {
  const [cursor, setCursor] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const total = state.results.length;

  useInput((_input, key) => {
    if (key.upArrow && cursor > 0) {
      const next = cursor - 1;
      setCursor(next);
      if (next < scrollTop) setScrollTop(next);
    }
    if (key.downArrow && cursor < total - 1) {
      const next = cursor + 1;
      setCursor(next);
      if (next >= scrollTop + VISIBLE) setScrollTop(next - VISIBLE + 1);
    }
    if (key.return && total > 0) {
      onViewJob(cursor);
    }
  });

  if (total === 0) {
    return (
      <Box flexDirection="column" borderStyle="round" borderColor="green" padding={1}>
        <Text bold color="green">catalyst — results</Text>
        <Text> </Text>
        <Text color="gray">No results yet. Run a pipeline first.</Text>
        <NavFooter hints={['p pipeline', 'n new run', 'h history', 'q quit']} />
      </Box>
    );
  }

  const visible = state.results.slice(scrollTop, scrollTop + VISIBLE);
  const hasAbove = scrollTop > 0;
  const hasBelow = scrollTop + VISIBLE < total;

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="green" padding={1}>
      <Box justifyContent="space-between">
        <Text bold color="green">catalyst — results</Text>
        <Text color="gray">{total} jobs · {state.iteration} iteration{state.iteration > 1 ? 's' : ''}</Text>
      </Box>
      <Text> </Text>
      {hasAbove && <Text color="gray">  ↑ {scrollTop} more</Text>}
      {visible.map((r, vi) => {
        const i = scrollTop + vi;
        const selected = i === cursor;
        return (
          <Box key={r.job.id} flexDirection="column" marginBottom={1}>
            <Box>
              <Text color={selected ? 'cyan' : 'white'} bold={selected}>
                {selected ? '> ' : '  '}{i + 1}  {r.job.title} · {r.job.company}
              </Text>
              <Text color="gray">  {r.overallScore} </Text>
              <ScoreBar score={r.overallScore} />
            </Box>
            <Text color="gray">     skill {r.scores.skill}  culture {r.scores.culture}  salary {r.scores.salary}  [{r.job.source}]</Text>
            <Text color="gray">     {r.summary}</Text>
            {r.redFlags.length > 0 && <Text color="red">     ⚠ {r.redFlags.join(' · ')}</Text>}
          </Box>
        );
      })}
      {hasBelow && <Text color="gray">  ↓ {total - scrollTop - VISIBLE} more</Text>}
      <NavFooter hints={['↑↓ navigate', 'enter details', 'u profile', 'p pipeline', 'h history', 'n new run', 'q quit']} />
    </Box>
  );
}
