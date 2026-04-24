import React from 'react';
import type { AppState, AppAction } from '../state.js';

interface DashboardProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export function Dashboard({ state, dispatch }: DashboardProps) {
  return <div style={{ padding: '1rem' }}>Dashboard — coming soon</div>;
}
