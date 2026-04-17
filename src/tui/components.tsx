import React from 'react';
import { Text, Box } from 'ink';
import type { StageState, ProviderState } from './state.js';
import type { CandidateProfile } from '../types.js';

const STATUS_ICONS: Record<string, string> = {
  pending:  '·',
  running:  '⠸',
  done:     '✓',
  failed:   '✗',
  degraded: '⚠',
  skipped:  '–',
};

function fmtDuration(ms?: number): string {
  if (!ms) return '';
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

export function ProviderRow({ provider }: { provider: ProviderState }) {
  const icon = STATUS_ICONS[provider.status];
  const color = provider.status === 'done' ? 'green'
    : provider.status === 'failed' ? 'red'
    : provider.status === 'running' ? 'yellow' : 'gray';

  return (
    <Box paddingLeft={6}>
      <Text color={color}>{icon}  {provider.id}</Text>
      {provider.durationMs ? <Text color="gray">{'  '}{fmtDuration(provider.durationMs)}</Text> : null}
      {provider.error ? <Text color="red">{'  '}failed · skipped</Text> : null}
    </Box>
  );
}

export function StageRow({ stage }: { stage: StageState }) {
  const icon = STATUS_ICONS[stage.status];
  const color = stage.status === 'done' ? 'green'
    : stage.status === 'failed' ? 'red'
    : stage.status === 'degraded' ? 'yellow'
    : stage.status === 'running' ? 'cyan' : 'gray';

  return (
    <Box flexDirection="column">
      <Box>
        <Box width={4}><Text color={color}>{icon}</Text></Box>
        <Text color={color}>{stage.id}</Text>
        <Text color="gray">{'  '}{fmtDuration(stage.durationMs)}</Text>
      </Box>
      {stage.providers.map((p) => <ProviderRow key={p.id} provider={p} />)}
    </Box>
  );
}

export function ScoreBar({ score }: { score: number }) {
  const filled = Math.round(score / 10);
  const bar = '█'.repeat(filled) + '▒'.repeat(10 - filled);
  const color = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';
  return <Text color={color}>{bar}</Text>;
}

export function NavFooter({ hints }: { hints: string[] }) {
  return (
    <Box marginTop={1}>
      <Text color="gray">{hints.join(' · ')}</Text>
    </Box>
  );
}

export function ProfileSummary({ profile }: { profile: CandidateProfile }) {
  return (
    <Box flexDirection="column" marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
      <Text bold>{profile.name}</Text>
      <Text color="gray">
        {profile.titles.join(' / ')} · {profile.yearsExperience}y exp · {profile.remotePreference}
      </Text>
      <Text color="gray">
        Skills: {profile.skills.slice(0, 8).join(', ')}
        {profile.skills.length > 8 ? ` +${profile.skills.length - 8} more` : ''}
      </Text>
      {profile.salaryExpectation && (
        <Text color="gray">
          Salary: {profile.salaryExpectation.currency} {profile.salaryExpectation.min.toLocaleString()}–{profile.salaryExpectation.max.toLocaleString()}
        </Text>
      )}
    </Box>
  );
}
