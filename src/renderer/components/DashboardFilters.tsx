import React from 'react';
import type { JobKanbanColumn, CompanySource } from '../../types.js';
import styles from './DashboardFilters.module.css';

export type SortBy = 'score' | 'company' | 'salary' | 'date';

interface DashboardFiltersProps {
  companies: CompanySource[];
  selectedCompanyIds: string[];
  onCompanyChange: (ids: string[]) => void;
  scoreMin: number;
  scoreMax: number;
  onScoreChange: (min: number, max: number) => void;
  keyword: string;
  onKeywordChange: (kw: string) => void;
  visibleColumns: Set<JobKanbanColumn>;
  onColumnToggle: (col: JobKanbanColumn) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
}

const COLUMN_OPTIONS: { key: JobKanbanColumn; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'looking-at', label: 'Looking At' },
  { key: 'applying', label: 'Applying' },
];

export function DashboardFilters({
  companies,
  selectedCompanyIds,
  onCompanyChange,
  scoreMin,
  scoreMax,
  onScoreChange,
  keyword,
  onKeywordChange,
  visibleColumns,
  onColumnToggle,
  sortBy,
  onSortChange,
}: DashboardFiltersProps) {
  return (
    <div className={styles.bar}>
      {/* Company select */}
      <select
        className={styles.select}
        value={selectedCompanyIds.length === 0 ? 'all' : selectedCompanyIds[0]}
        onChange={(e) => {
          const v = e.target.value;
          onCompanyChange(v === 'all' ? [] : [v]);
        }}
      >
        <option value="all">All companies</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Keyword search */}
      <input
        type="text"
        className={styles.keywordInput}
        placeholder="Search titles..."
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
      />

      {/* Score range */}
      <div className={styles.scoreGroup}>
        <label>Score</label>
        <input
          type="number"
          className={styles.scoreInput}
          min={0}
          max={100}
          value={scoreMin}
          onChange={(e) => onScoreChange(Number(e.target.value), scoreMax)}
        />
        <span className={styles.scoreSep}>-</span>
        <input
          type="number"
          className={styles.scoreInput}
          min={0}
          max={100}
          value={scoreMax}
          onChange={(e) => onScoreChange(scoreMin, Number(e.target.value))}
        />
      </div>

      {/* Kanban status toggles */}
      <div className={styles.toggleGroup}>
        {COLUMN_OPTIONS.map((col) => (
          <button
            key={col.key}
            className={`${styles.toggle} ${visibleColumns.has(col.key) ? styles.toggleActive : ''}`}
            onClick={() => onColumnToggle(col.key)}
          >
            {col.label}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <select
        className={styles.select}
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortBy)}
      >
        <option value="score">Sort: Score</option>
        <option value="company">Sort: Company</option>
        <option value="salary">Sort: Salary</option>
      </select>
    </div>
  );
}
