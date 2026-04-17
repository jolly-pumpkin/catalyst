import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { NavFooter } from './components.js';

export interface DocEntry {
  name: string;
  path: string;
}

export function InputView({
  docs,
  onSelect,
  onInputModeChange,
}: {
  docs: DocEntry[];
  onSelect: (filePath: string) => void;
  onInputModeChange: (active: boolean) => void;
}) {
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<'list' | 'path'>(() =>
    docs.length === 0 ? 'path' : 'list'
  );
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (mode === 'path') onInputModeChange(true);
    else onInputModeChange(false);
  }, [mode]);

  useInput((input, key) => {
    if (mode === 'path') return;

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
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Text bold color="cyan">catalyst</Text>
      <Text> </Text>

      {docs.length > 0 && mode === 'list' && (
        <>
          <Text color="gray">Select a resume from ~/.catalyst/docs/</Text>
          <Text> </Text>
          {docs.map((d, i) => (
            <Text key={d.path} color={i === cursor ? 'cyan' : 'white'}>
              {i === cursor ? '> ' : '  '}{d.name}
            </Text>
          ))}
          <NavFooter hints={['↑↓ navigate', 'enter select', 'f file path']} />
        </>
      )}

      {docs.length === 0 && mode === 'list' && (
        <>
          <Text color="gray">No resumes found in ~/.catalyst/docs/</Text>
          <Text color="gray">Drop a .txt, .md, .pdf, or .docx file there, or enter a path below.</Text>
          <Text> </Text>
        </>
      )}

      {mode === 'path' && (
        <Box>
          <Text color="cyan">File path: </Text>
          <TextInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            placeholder="/path/to/resume.txt"
          />
        </Box>
      )}

      {mode === 'path' && (
        <NavFooter hints={['enter submit', 'empty to go back']} />
      )}
    </Box>
  );
}
