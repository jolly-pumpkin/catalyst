import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import type { CompanySource } from '../types.js';

export function CompaniesView({
  companyStore,
  indexer,
  onBack,
  onInputModeChange,
  onRunPipeline,
  onViewKanban,
}: {
  companyStore: {
    add(url: string): Promise<CompanySource>;
    remove(id: string): Promise<void>;
    list(): Promise<CompanySource[]>;
    setEnabled(id: string, enabled: boolean): Promise<void>;
  };
  indexer: {
    indexNow(): Promise<void>;
    indexCompany(id: string): Promise<void>;
  };
  onBack: () => void;
  onInputModeChange: (active: boolean) => void;
  onRunPipeline?: (companyId: string, companyName: string) => void;
  onViewKanban?: (companyId: string, companyName: string) => void;
}) {
  const [companies, setCompanies] = useState<CompanySource[]>([]);
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<'list' | 'add'>('list');
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('');

  const refresh = useCallback(() => {
    let cancelled = false;
    companyStore.list().then((list) => { if (!cancelled) setCompanies(list); });
    return () => { cancelled = true; };
  }, [companyStore]);

  useEffect(() => {
    return refresh();
  }, [refresh]);

  useInput((input, key) => {
    if (mode === 'add') return;

    if (companies.length === 0) {
      if (input === 'a') {
        setMode('add');
        setInputValue('');
        setStatus('');
        onInputModeChange(true);
      }
      if (key.escape) onBack();
      return;
    }

    if (key.escape) onBack();
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1));
    if (key.downArrow) setCursor((c) => Math.min(companies.length - 1, c + 1));

    if (input === 'a') {
      setMode('add');
      setInputValue('');
      setStatus('');
      onInputModeChange(true);
    }

    if (input === 'd' && companies[cursor]) {
      const company = companies[cursor];
      companyStore.remove(company.id).then(() => {
        setStatus(`Removed ${company.name}`);
        refresh();
        setCursor((c) => Math.max(0, c - 1));
      }).catch((err) => {
        setStatus(`Error: ${err}`);
      });
    }

    if (input === 't' && companies[cursor]) {
      const company = companies[cursor];
      companyStore.setEnabled(company.id, !company.enabled).then(() => {
        setStatus(`${company.name} ${company.enabled ? 'disabled' : 'enabled'}`);
        refresh();
      }).catch((err) => {
        setStatus(`Error: ${err}`);
      });
    }

    if (input === 'i' && companies[cursor]) {
      const company = companies[cursor];
      setStatus(`Indexing ${company.name}...`);
      indexer.indexCompany(company.id).then(() => {
        setStatus(`Indexed ${company.name}`);
        refresh();
      }).catch((err) => {
        setStatus(`Error: ${err}`);
      });
    }

    if (input === 'I') {
      setStatus('Indexing all companies...');
      indexer.indexNow().then(() => {
        setStatus('Indexing complete');
        refresh();
      }).catch((err) => {
        setStatus(`Error: ${err}`);
      });
    }

    // Run pipeline for selected company
    if (key.return && companies[cursor] && onRunPipeline) {
      const company = companies[cursor];
      if (!company.enabled) {
        setStatus(`${company.name} is disabled — enable it first`);
        return;
      }
      setStatus(`Starting pipeline for ${company.name}...`);
      onRunPipeline(company.id, company.name);
    }

    // View kanban board for selected company
    if (input === 'k' && companies[cursor] && onViewKanban) {
      const company = companies[cursor];
      onViewKanban(company.id, company.name);
    }
  });

  const handleSubmit = (value: string) => {
    const url = value.trim();
    setMode('list');
    onInputModeChange(false);
    if (!url) return;

    setStatus(`Detecting ATS for ${url}...`);
    companyStore.add(url).then((source) => {
      setStatus(`Added ${source.name} (${source.atsType})`);
      refresh();
    }).catch((err) => {
      setStatus(`Error: ${err}`);
    });
  };

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="green" padding={1}>
      <Text bold color="green">catalyst — companies</Text>
      <Text> </Text>

      {companies.length === 0 && mode === 'list' && (
        <Text color="gray">No companies configured. Press 'a' to add a career page.</Text>
      )}

      {companies.map((c, i) => {
        const sel = i === cursor ? '> ' : '  ';
        const enabledLabel = c.enabled ? '' : ' [disabled]';
        const indexed = c.lastIndexedAt
          ? `${c.jobCount} jobs · ${new Date(c.lastIndexedAt).toLocaleDateString()}`
          : 'not indexed';
        return (
          <Box key={c.id} flexDirection="column">
            <Text color={i === cursor ? 'cyan' : 'white'}>
              {sel}{c.name} <Text color="gray">({c.atsType})</Text>{enabledLabel}
            </Text>
            <Text color="gray">    {indexed} · {c.url}</Text>
          </Box>
        );
      })}

      <Text> </Text>

      {mode === 'add' && (
        <Box>
          <Text color="green">Career page URL: </Text>
          <TextInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            placeholder="https://company.com/careers"
          />
        </Box>
      )}

      {status && <Text color="yellow">{status}</Text>}

      <Text> </Text>
      <Text color="gray">
        a add · d remove · t toggle · i index · I index all{onRunPipeline ? ' · enter run pipeline' : ''}{onViewKanban ? ' · k kanban' : ''} · esc back
      </Text>
    </Box>
  );
}
