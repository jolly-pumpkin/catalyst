import React from 'react';
import { Box, Text } from 'ink';
import { StageRow, ProfileSummary, NavFooter } from './components.js';
import type { TuiState } from './state.js';

export function PipelineView({ state }: { state: TuiState }) {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Box justifyContent="space-between">
        <Text bold color="cyan">catalyst</Text>
        <Text color="gray">iteration {state.iteration}/{state.maxIterations}  {state.done ? '✓' : '⠸'}</Text>
      </Box>
      <Box>
        <Text color="gray">resume: {state.resumeName}    model: {state.model}</Text>
      </Box>
      <Text> </Text>
      {state.stages.map((s) => <StageRow key={s.id} stage={s} />)}
      {state.error && (
        <Box marginTop={1}>
          <Text color="red">Error: {state.error}</Text>
        </Box>
      )}

      {state.profile && <ProfileSummary profile={state.profile} />}

      {state.normalizedJobs && (
        <Box marginTop={1}>
          <Text color="gray">Found {state.normalizedJobs.length} jobs</Text>
        </Box>
      )}

      {state.reflectRationale && (
        <Box marginTop={1} flexDirection="column">
          <Text color="gray">Reflection: {state.reflectRationale}</Text>
          {state.confidence != null && (
            <Text color="gray">Confidence: {(state.confidence * 100).toFixed(0)}%</Text>
          )}
        </Box>
      )}

      {state.done && !state.error && (
        <Box marginTop={1}>
          <Text bold color="green">Pipeline complete — press r to view results</Text>
        </Box>
      )}

      <NavFooter hints={state.done
        ? ['r results', 'u profile', 'h history', 'n new run', 's resumes', 'c companies', 'q quit']
        : state.stages.length === 0
        ? ['n new run', 's resumes', 'c companies', 'h history', 'Ctrl+U switch user', 'q quit']
        : ['q quit']
      } />
    </Box>
  );
}
