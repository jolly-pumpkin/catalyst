import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../api.js';
import type { AppState, AppAction } from '../state.js';
import type { UserRecord } from '../../types.js';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export function Toolbar({ state, dispatch }: ToolbarProps) {
  const api = useApi();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.users.list().then(setUsers).catch(() => {});
  }, [api, state.currentUser]);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const selectUser = async (user: UserRecord) => {
    await api.users.select(user.id);
    dispatch({ type: 'user:selected', user });
    setDropdownOpen(false);
  };

  return (
    <header className={styles.toolbar}>
      <div className={styles.title}>Catalyst</div>

      <div className={styles.actions}>
        {/* User switcher */}
        <div className={styles.dropdown} ref={dropdownRef}>
          <button
            className={styles.userButton}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {state.currentUser?.name ?? 'Select user'}
            <span className={styles.caret}>{dropdownOpen ? '\u25B4' : '\u25BE'}</span>
          </button>
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              {users.map((u) => (
                <button
                  key={u.id}
                  className={`${styles.dropdownItem} ${u.id === state.currentUser?.id ? styles.dropdownItemActive : ''}`}
                  onClick={() => selectUser(u)}
                >
                  {u.name}
                </button>
              ))}
              {users.length === 0 && (
                <div className={styles.dropdownEmpty}>No users</div>
              )}
              <div className={styles.dropdownDivider} />
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  dispatch({ type: 'user:new-profile' });
                  setDropdownOpen(false);
                }}
              >
                + New Profile
              </button>
            </div>
          )}
        </div>

        {/* New Run */}
        <button
          className={styles.newRunButton}
          onClick={() => dispatch({ type: 'view:change', view: 'input' })}
        >
          New Run
        </button>

        {/* Settings */}
        <button
          className={styles.iconButton}
          onClick={() => dispatch({ type: 'view:change', view: 'settings' })}
          title="Settings"
        >
          {'\u2699'}
        </button>
      </div>
    </header>
  );
}
