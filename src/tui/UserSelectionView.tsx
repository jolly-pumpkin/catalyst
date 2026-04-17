import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { NavFooter } from './components.js';
import type { UserRecord } from '../types.js';

export interface UserManagerHandle {
  list(): UserRecord[];
  create(name: string): UserRecord;
  getCurrentId(): string | null;
  get(id: string): UserRecord | null;
  setCurrentId(id: string): void;
}

export function UserSelectionView({
  userManager,
  onSelectUser,
  onInputModeChange,
}: {
  userManager: UserManagerHandle;
  onSelectUser: (user: UserRecord) => void;
  onInputModeChange: (active: boolean) => void;
}) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const list = userManager.list();
    setUsers(list);

    // Auto-select if there's a current user and only loading for first time
    const currentId = userManager.getCurrentId();
    if (currentId) {
      const user = userManager.get(currentId);
      if (user) {
        onSelectUser(user);
        return;
      }
    }

    // If exactly one user, auto-select
    if (list.length === 1) {
      userManager.setCurrentId(list[0].id);
      onSelectUser(list[0]);
      return;
    }

    // If no users, go straight to create mode
    if (list.length === 0) {
      setMode('create');
      onInputModeChange(true);
    }
  }, []);

  useInput((input, key) => {
    if (mode === 'create') return;

    if (key.upArrow) setCursor((c) => Math.max(0, c - 1));
    if (key.downArrow) setCursor((c) => Math.min(users.length - 1, c + 1));

    if (key.return && users[cursor]) {
      const user = users[cursor]!;
      userManager.setCurrentId(user.id);
      onSelectUser(user);
    }

    if (input === 'a') {
      setMode('create');
      setInputValue('');
      setStatus('');
      onInputModeChange(true);
    }
  });

  const handleSubmit = (value: string) => {
    const name = value.trim();
    if (!name) {
      if (users.length > 0) {
        setMode('list');
        onInputModeChange(false);
      }
      return;
    }

    try {
      const user = userManager.create(name);
      userManager.setCurrentId(user.id);
      onSelectUser(user);
    } catch (err) {
      setStatus(`Error: ${err}`);
      setInputValue('');
    }
  };

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="magenta" padding={1}>
      <Text bold color="magenta">catalyst — who are you?</Text>
      <Text> </Text>

      {users.length === 0 && mode !== 'create' && (
        <Text color="gray">No users yet. Press 'a' to create one.</Text>
      )}

      {mode === 'list' && users.map((u, i) => (
        <Text key={u.id} color={i === cursor ? 'cyan' : 'white'}>
          {i === cursor ? '> ' : '  '}{u.name}
          <Text color="gray">  created {new Date(u.createdAt).toLocaleDateString()}</Text>
        </Text>
      ))}

      {mode === 'create' && (
        <>
          <Text color="gray">Enter a name for your profile:</Text>
          <Box>
            <Text color="magenta">Name: </Text>
            <TextInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              placeholder="e.g. lauren, collin"
            />
          </Box>
        </>
      )}

      {status && (
        <>
          <Text> </Text>
          <Text color="yellow">{status}</Text>
        </>
      )}

      <Text> </Text>
      {mode === 'list' && (
        <NavFooter hints={['↑↓ navigate', 'enter select', 'a new user']} />
      )}
      {mode === 'create' && users.length > 0 && (
        <NavFooter hints={['enter create', 'empty to go back']} />
      )}
    </Box>
  );
}
