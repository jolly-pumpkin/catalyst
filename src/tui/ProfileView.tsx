import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { NavFooter } from './components.js';
import type { TuiState } from './state.js';

export function ProfileView({
  state,
  onBack,
}: {
  state: TuiState;
  onBack: () => void;
}) {
  const [showRaw, setShowRaw] = useState(false);

  useInput((input, key) => {
    if (key.escape) onBack();
    if (input === 't') setShowRaw((v) => !v);
  });

  if (!state.profile) {
    return (
      <Box flexDirection="column" borderStyle="round" borderColor="magenta" padding={1}>
        <Text bold color="magenta">catalyst — profile</Text>
        <Text> </Text>
        <Text color="gray">No profile yet. Run a pipeline first.</Text>
        <NavFooter hints={['esc back']} />
      </Box>
    );
  }

  const p = state.profile;

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="magenta" padding={1}>
      <Text bold color="magenta">catalyst — profile</Text>
      <Text> </Text>

      <Text bold>{p.name}</Text>
      <Text>{p.yearsExperience} years experience</Text>
      <Text> </Text>

      <Text bold>Titles</Text>
      {p.titles.map((t, i) => (
        <Text key={i} color="gray">  {t}</Text>
      ))}
      <Text> </Text>

      <Text bold>Skills</Text>
      <Text color="gray">  {p.skills.join(', ')}</Text>
      <Text> </Text>

      <Text bold>Preferences</Text>
      <Text color="gray">  Locations: {p.preferredLocations.length > 0 ? p.preferredLocations.join(', ') : 'any'}</Text>
      <Text color="gray">  Remote: {p.remotePreference}</Text>
      {p.salaryExpectation && (
        <Text color="gray">
          Salary: {p.salaryExpectation.currency} {p.salaryExpectation.min.toLocaleString()}–{p.salaryExpectation.max.toLocaleString()}
        </Text>
      )}

      {showRaw && state.resumeText && (
        <>
          <Text> </Text>
          <Text bold>Resume Text</Text>
          <Text color="gray">{state.resumeText}</Text>
        </>
      )}

      <NavFooter hints={['esc back', 't toggle resume', 'r results', 'p pipeline']} />
    </Box>
  );
}
