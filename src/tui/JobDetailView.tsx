import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { ScoreBar, NavFooter } from './components.js';
import type { TuiState } from './state.js';

const DESC_LINES = 10;

export function JobDetailView({
  state,
  onBack,
  onOpenUrl,
}: {
  state: TuiState;
  onBack: () => void;
  onOpenUrl: (url: string) => void;
}) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const job = state.results[state.selectedJobIndex];

  useInput((input, key) => {
    if (key.escape) onBack();
    if (input === 's' && job?.job.url) onOpenUrl(job.job.url);
    if (key.downArrow) setScrollOffset((o) => o + 1);
    if (key.upArrow) setScrollOffset((o) => Math.max(0, o - 1));
  });

  if (!job) {
    return (
      <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1}>
        <Text color="red">No job selected.</Text>
        <NavFooter hints={['esc back']} />
      </Box>
    );
  }

  const analyses = (state.analyses ?? []).filter((a) => a.jobId === job.job.id);
  const descLines = job.job.description.split('\n');
  const visibleDesc = descLines.slice(scrollOffset, scrollOffset + DESC_LINES);
  const hasMoreDesc = scrollOffset + DESC_LINES < descLines.length;

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1}>
      <Text bold color="blue">catalyst — job detail</Text>
      <Text> </Text>

      {/* Header */}
      <Text bold>{job.job.title}</Text>
      <Text>{job.job.company} · {job.job.location}{job.job.remote ? ' · remote' : ''}</Text>
      {job.job.url && <Text color="gray">{job.job.url}</Text>}
      <Text> </Text>

      {/* Scores */}
      <Box>
        <Text bold>Overall: {job.overallScore}  </Text>
        <ScoreBar score={job.overallScore} />
      </Box>
      <Box>
        <Text color="gray">  skill {job.scores.skill}  </Text>
        <ScoreBar score={job.scores.skill} />
        <Text color="gray">  culture {job.scores.culture}  </Text>
        <ScoreBar score={job.scores.culture} />
        <Text color="gray">  salary {job.scores.salary}  </Text>
        <ScoreBar score={job.scores.salary} />
      </Box>
      <Text> </Text>

      {/* Summary */}
      <Text bold>Summary</Text>
      <Text>{job.summary}</Text>

      {/* Red flags */}
      {job.redFlags.length > 0 && (
        <>
          <Text> </Text>
          <Text bold color="red">Red Flags</Text>
          {job.redFlags.map((flag, i) => (
            <Text key={i} color="red">  ⚠ {flag}</Text>
          ))}
        </>
      )}

      {/* Analysis reasoning */}
      {analyses.length > 0 && (
        <>
          <Text> </Text>
          <Text bold>Analysis</Text>
          {analyses.map((a) => (
            <Box key={a.variant} flexDirection="column">
              <Text color="cyan">  {a.variant} ({a.score})</Text>
              <Text color="gray">    {a.reasoning}</Text>
              {a.signals.length > 0 && (
                <Text color="gray">    Signals: {a.signals.join(', ')}</Text>
              )}
            </Box>
          ))}
        </>
      )}

      {/* Description */}
      <Text> </Text>
      <Text bold>Description</Text>
      {visibleDesc.map((line, i) => (
        <Text key={i} color="gray">{line}</Text>
      ))}
      {hasMoreDesc && <Text color="gray">  ↓ scroll for more</Text>}

      <NavFooter hints={['esc back', 's open in browser', '↑↓ scroll']} />
    </Box>
  );
}
