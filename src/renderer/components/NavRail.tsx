import React from 'react';
import type { ViewName, AppAction } from '../state.js';
import styles from './NavRail.module.css';

interface NavItem {
  view: ViewName;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { view: 'companies',      label: 'Companies', icon: '\u{1F3E2}' },
  { view: 'pipeline',       label: 'Pipeline',  icon: '\u{2699}'  },
  { view: 'results',        label: 'Results',   icon: '\u{1F4CA}' },
  { view: 'history',        label: 'History',   icon: '\u{1F4C5}' },
  { view: 'profile',        label: 'Profile',   icon: '\u{1F464}' },
  { view: 'resume-manager', label: 'Resume',    icon: '\u{1F4C4}' },
];

interface NavRailProps {
  activeView: ViewName;
  dispatch: React.Dispatch<AppAction>;
}

export function NavRail({ activeView, dispatch }: NavRailProps) {
  return (
    <nav className={styles.rail}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.view}
          className={`${styles.item} ${activeView === item.view ? styles.active : ''}`}
          onClick={() => dispatch({ type: 'view:change', view: item.view })}
          title={item.label}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
