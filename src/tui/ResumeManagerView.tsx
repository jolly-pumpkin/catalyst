import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { NavFooter } from './components.js';
import type { DocEntry } from './InputView.js';
import type { CandidateProfile } from '../types.js';

export function ResumeManagerView({
  currentResumeName,
  currentProfile,
  docs,
  onSelect,
  onBack,
  onInputModeChange,
}: {
  currentResumeName?: string;
  currentProfile?: CandidateProfile;
  docs: DocEntry[];
  onSelect: (filePath: string) => void;
  onBack: () => void;
  onInputModeChange: (active: boolean) => void;
}) {
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<'list' | 'path'>('list');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (mode === 'path') onInputModeChange(true);
    else onInputModeChange(false);
  }, [mode]);

  useInput((input, key) => {
    if (mode === 'path') return;

    if (key.escape) { onBack(); return; }
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1));
    if (key.downArrow) setCursor((c) => Math.min(docs.length - 1, c + 1));
    if (key.return && docs[cursor]) {
      onSelect(docs[cursor].path);
    }
    if (input === 'f') {
      setMode('path');
      setInputValue('');
    }
  });

  const handleSubmit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setMode('list');
      onInputModeChange(false);
      return;
    }
    onSelect(trimmed);
  };

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="green" padding={1}>
      <Text bold color="green">catalyst — resume manager</Text>
      <Text> </Text>

      {currentResumeName && (
        <Box flexDirection="column" marginBottom={1}>
          <Text>Current: <Text bold color="cyan">{currentResumeName}</Text></Text>
          {currentProfile && (
            <Box flexDirection="column" paddingLeft={2}>
              <Text color="gray">{currentProfile.name}</Text>
              <Text color="gray">{currentProfile.titles.join(' / ')} · {currentProfile.yearsExperience}y</Text>
              <Text color="gray">Skills: {currentProfile.skills.slice(0, 6).join(', ')}{currentProfile.skills.length > 6 ? ' ...' : ''}</Text>
            </Box>
          )}
          <Text> </Text>
          <Text color="gray">Select a different resume below:</Text>
        </Box>
      )}

      {!currentResumeName && (
        <Text color="gray">No resume selected. Choose one below:</Text>
      )}

      <Text> </Text>

      {docs.length > 0 && mode === 'list' && docs.map((d, i) => {
        const isCurrent = currentResumeName === d.name;
        return (
          <Text key={d.path} color={i === cursor ? 'cyan' : isCurrent ? 'green' : 'white'}>
            {i === cursor ? '> ' : '  '}{d.name}{isCurrent ? ' (current)' : ''}
          </Text>
        );
      })}

      {docs.length === 0 && mode === 'list' && (
        <Text color="gray">No resumes found. Press 'f' to enter a file path.</Text>
      )}

      {mode === 'path' && (
        <Box>
          <Text color="green">File path: </Text>
          <TextInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            placeholder="/path/to/resume.txt"
          />
        </Box>
      )}

      <Text> </Text>
      {mode === 'list' && (
        <NavFooter hints={['↑↓ navigate', 'enter select', 'f file path', 'esc back']} />
      )}
      {mode === 'path' && (
        <NavFooter hints={['enter submit', 'empty to go back']} />
      )}
    </Box>
  );
}
