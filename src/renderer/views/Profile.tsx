import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../api.js';
import type { AppState, AppAction } from '../state.js';
import type { CandidateProfile } from '../../types.js';
import styles from './Profile.module.css';

interface ProfileProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

/* --- Tag editor for flat string arrays (titles, locations) --- */
function TagEditor({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInput('');
  };
  return (
    <div className={styles.tagEditor}>
      <div className={styles.tagList}>
        {values.map((v, i) => (
          <span key={i} className={styles.tag}>
            {v}
            <button className={styles.tagRemove} onClick={() => onChange(values.filter((_, j) => j !== i))}>x</button>
          </span>
        ))}
      </div>
      <div className={styles.tagInputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Add..."
        />
        <button className={styles.smallBtn} onClick={add}>Add</button>
      </div>
    </div>
  );
}

/* --- Categorized skills display (read-only, collapsible) --- */
function SkillsDisplay({ skills }: { skills: Record<string, string[]> }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const entries = Object.entries(skills);

  if (entries.length === 0) {
    return <div className={styles.skills}>No skills</div>;
  }

  return (
    <div className={styles.categoryList}>
      {entries.map(([cat, items]) => (
        <div key={cat} className={styles.category}>
          <button
            className={styles.categoryHeader}
            onClick={() => setCollapsed({ ...collapsed, [cat]: !collapsed[cat] })}
          >
            <span className={styles.categoryArrow}>{collapsed[cat] ? '\u25b6' : '\u25bc'}</span>
            <span className={styles.categoryName}>{cat}</span>
            <span className={styles.categoryCount}>{items.length}</span>
          </button>
          {!collapsed[cat] && (
            <div className={styles.tagList}>
              {items.map((skill, i) => (
                <span key={i} className={styles.tag}>{skill}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* --- Categorized skills editor --- */
function SkillsEditor({
  skills,
  onChange,
}: {
  skills: Record<string, string[]>;
  onChange: (s: Record<string, string[]>) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [newCatName, setNewCatName] = useState('');
  const [moveTarget, setMoveTarget] = useState<{ cat: string; skill: string } | null>(null);
  const entries = Object.entries(skills);
  const categories = Object.keys(skills);

  const addCategory = () => {
    const trimmed = newCatName.trim();
    if (trimmed && !(trimmed in skills)) {
      onChange({ ...skills, [trimmed]: [] });
    }
    setNewCatName('');
  };

  const removeCategory = (cat: string) => {
    const next = { ...skills };
    delete next[cat];
    onChange(next);
  };

  const addSkill = (cat: string, skill: string) => {
    const catItems = skills[cat] ?? [];
    if (!skill || catItems.includes(skill)) return;
    onChange({ ...skills, [cat]: [...catItems, skill] });
  };

  const removeSkill = (cat: string, index: number) => {
    onChange({ ...skills, [cat]: (skills[cat] ?? []).filter((_, i) => i !== index) });
  };

  const moveSkill = (fromCat: string, skill: string, toCat: string) => {
    const next = { ...skills };
    next[fromCat] = (next[fromCat] ?? []).filter((s) => s !== skill);
    next[toCat] = [...(next[toCat] ?? []), skill];
    onChange(next);
    setMoveTarget(null);
  };

  return (
    <div className={styles.categoryList}>
      {entries.map(([cat, items]) => (
        <div key={cat} className={styles.category}>
          <div className={styles.categoryHeaderEdit}>
            <button
              className={styles.categoryHeader}
              onClick={() => setCollapsed({ ...collapsed, [cat]: !collapsed[cat] })}
            >
              <span className={styles.categoryArrow}>{collapsed[cat] ? '\u25b6' : '\u25bc'}</span>
              <span className={styles.categoryName}>{cat}</span>
              <span className={styles.categoryCount}>{items.length}</span>
            </button>
            {items.length === 0 && (
              <button className={styles.tagRemove} onClick={() => removeCategory(cat)} title="Remove empty category">x</button>
            )}
          </div>
          {!collapsed[cat] && (
            <div className={styles.categoryBody}>
              <div className={styles.tagList}>
                {items.map((skill, i) => (
                  <span key={i} className={styles.tagEditable}>
                    <button
                      className={styles.tagClickable}
                      onClick={() => setMoveTarget(
                        moveTarget?.cat === cat && moveTarget?.skill === skill
                          ? null
                          : { cat, skill }
                      )}
                    >
                      {skill}
                    </button>
                    <button className={styles.tagRemove} onClick={() => removeSkill(cat, i)}>x</button>
                    {moveTarget?.cat === cat && moveTarget?.skill === skill && (
                      <div className={styles.moveDropdown}>
                        <div className={styles.moveLabel}>Move to:</div>
                        {categories.filter((c) => c !== cat).map((c) => (
                          <button
                            key={c}
                            className={styles.moveOption}
                            onClick={(e) => { e.stopPropagation(); moveSkill(cat, skill, c); }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </span>
                ))}
              </div>
              <SkillInput onAdd={(skill) => addSkill(cat, skill)} />
            </div>
          )}
        </div>
      ))}
      <div className={styles.tagInputRow}>
        <input
          className={styles.input}
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
          placeholder="New category name..."
        />
        <button className={styles.smallBtn} onClick={addCategory}>Add Category</button>
      </div>
    </div>
  );
}

function SkillInput({ onAdd }: { onAdd: (skill: string) => void }) {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim();
    if (trimmed) onAdd(trimmed);
    setInput('');
  };
  return (
    <div className={styles.tagInputRow}>
      <input
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        placeholder="Add skill..."
      />
      <button className={styles.smallBtn} onClick={add}>Add</button>
    </div>
  );
}

/* --- Helper: deep-clone skills Record --- */
function cloneSkills(skills: Record<string, string[]>): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(skills)) {
    result[k] = [...v];
  }
  return result;
}

/* ============================== Main Component ============================== */

export function Profile({ state, dispatch }: ProfileProps) {
  const api = useApi();
  const [showRaw, setShowRaw] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CandidateProfile | null>(null);
  const [resumeList, setResumeList] = useState<{ name: string; path: string }[]>([]);
  const [showResumePicker, setShowResumePicker] = useState(false);

  const p = state.profile;

  // Load stored profile on mount
  useEffect(() => {
    if (!api.profile) return;
    let cancelled = false;
    api.profile.get().then((result: any) => {
      if (cancelled || !result) return;
      dispatch({
        type: 'profile:loaded',
        profile: result.profile,
        sourceResume: result.sourceResume,
        updatedAt: result.updatedAt,
      });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [api, dispatch]);

  const startEdit = useCallback(() => {
    if (p) {
      setDraft({
        ...p,
        skills: cloneSkills(p.skills),
        titles: [...p.titles],
        preferredLocations: [...p.preferredLocations],
        salaryExpectation: p.salaryExpectation ? { ...p.salaryExpectation } : undefined,
      });
      setEditing(true);
    }
  }, [p]);

  const cancelEdit = () => {
    setEditing(false);
    setDraft(null);
  };

  const saveEdit = async () => {
    if (!draft || !api.profile) return;
    await api.profile.save(draft);
    const result = await api.profile.get() as any;
    if (result) {
      dispatch({ type: 'profile:loaded', profile: result.profile, sourceResume: result.sourceResume, updatedAt: result.updatedAt });
    }
    setEditing(false);
    setDraft(null);
  };

  const openResumePicker = async () => {
    const docs = await api.docs.list() as { name: string; path: string }[];
    setResumeList(docs);
    setShowResumePicker(true);
  };

  const parseResume = async (doc: { name: string; path: string }) => {
    setShowResumePicker(false);
    dispatch({ type: 'profile:parsing' });
    try {
      const text = await api.docs.read(doc.path) as string;
      const profile = await api.profile!.parse(text, doc.name) as CandidateProfile;
      const result = await api.profile!.get() as any;
      if (result) {
        dispatch({ type: 'profile:loaded', profile: result.profile, sourceResume: result.sourceResume, updatedAt: result.updatedAt });
      } else {
        dispatch({ type: 'profile:loaded', profile, sourceResume: doc.name, updatedAt: new Date().toISOString() });
      }
    } catch (err: any) {
      dispatch({ type: 'profile:parse-error', error: err.message ?? String(err) });
    }
  };

  // --- Empty state ---
  if (!p && !state.profileParsing) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>Profile</span>
        </div>
        <div className={styles.emptyState}>
          <div>No profile yet.</div>
          {state.profileError && <div className={styles.error}>{state.profileError}</div>}
          <button className={styles.actionBtn} onClick={openResumePicker}>Parse Resume</button>
          {showResumePicker && (
            <div className={styles.resumePicker}>
              {resumeList.length === 0 && <div>No resumes found. Import one in Resume Manager.</div>}
              {resumeList.map((doc) => (
                <button key={doc.path} className={styles.resumeOption} onClick={() => parseResume(doc)}>
                  {doc.name}
                </button>
              ))}
              <button className={styles.smallBtn} onClick={() => setShowResumePicker(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Parsing state ---
  if (state.profileParsing) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>Profile</span>
        </div>
        <div className={styles.emptyState}>
          <div>Parsing resume...</div>
        </div>
      </div>
    );
  }

  if (!p) return null;

  // --- Edit mode ---
  if (editing && draft) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>Edit Profile</span>
          <div className={styles.headerActions}>
            <button className={styles.actionBtn} onClick={saveEdit}>Save</button>
            <button className={styles.toggleBtn} onClick={cancelEdit}>Cancel</button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.sectionTitle}>Name</div>
          <input className={styles.input} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <div className={styles.sectionTitle}>Years Experience</div>
          <input className={styles.input} type="number" value={draft.yearsExperience} onChange={(e) => setDraft({ ...draft, yearsExperience: Number(e.target.value) })} />
        </div>

        <div className={styles.card}>
          <div className={styles.sectionTitle}>Titles</div>
          <TagEditor values={draft.titles} onChange={(titles) => setDraft({ ...draft, titles })} />
        </div>

        <div className={styles.card}>
          <div className={styles.sectionTitle}>Skills</div>
          <SkillsEditor
            skills={draft.skills}
            onChange={(skills) => setDraft({ ...draft, skills })}
          />
        </div>

        <div className={styles.card}>
          <div className={styles.sectionTitle}>Preferred Locations</div>
          <TagEditor values={draft.preferredLocations} onChange={(preferredLocations) => setDraft({ ...draft, preferredLocations })} />

          <div className={styles.sectionTitle}>Remote Preference</div>
          <select className={styles.input} value={draft.remotePreference} onChange={(e) => setDraft({ ...draft, remotePreference: e.target.value as CandidateProfile['remotePreference'] })}>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
            <option value="flexible">Flexible</option>
          </select>

          <div className={styles.sectionTitle}>Salary Expectation</div>
          <div className={styles.salaryRow}>
            <input
              className={styles.input}
              type="number"
              placeholder="Min"
              value={draft.salaryExpectation?.min ?? ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDraft({
                  ...draft,
                  salaryExpectation: {
                    min: val,
                    max: draft.salaryExpectation?.max ?? val,
                    currency: draft.salaryExpectation?.currency ?? 'USD',
                  },
                });
              }}
            />
            <input
              className={styles.input}
              type="number"
              placeholder="Max"
              value={draft.salaryExpectation?.max ?? ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDraft({
                  ...draft,
                  salaryExpectation: {
                    min: draft.salaryExpectation?.min ?? 0,
                    max: val,
                    currency: draft.salaryExpectation?.currency ?? 'USD',
                  },
                });
              }}
            />
            <input
              className={styles.input}
              placeholder="Currency"
              value={draft.salaryExpectation?.currency ?? 'USD'}
              onChange={(e) => {
                setDraft({
                  ...draft,
                  salaryExpectation: {
                    min: draft.salaryExpectation?.min ?? 0,
                    max: draft.salaryExpectation?.max ?? 0,
                    currency: e.target.value,
                  },
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // --- Display mode ---
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Profile</span>
        <div className={styles.headerActions}>
          <button className={styles.toggleBtn} onClick={startEdit}>Edit</button>
          <button className={styles.toggleBtn} onClick={openResumePicker}>Re-parse</button>
          {state.resumeText && (
            <button className={styles.toggleBtn} onClick={() => setShowRaw(!showRaw)}>
              {showRaw ? 'Hide Resume' : 'Show Resume'}
            </button>
          )}
        </div>
      </div>

      {showResumePicker && (
        <div className={styles.resumePicker}>
          {resumeList.length === 0 && <div>No resumes found. Import one in Resume Manager.</div>}
          {resumeList.map((doc) => (
            <button key={doc.path} className={styles.resumeOption} onClick={() => parseResume(doc)}>
              {doc.name}
            </button>
          ))}
          <button className={styles.smallBtn} onClick={() => setShowResumePicker(false)}>Cancel</button>
        </div>
      )}

      {state.profileMeta && (
        <div className={styles.meta}>
          Parsed from <strong>{state.profileMeta.sourceResume}</strong>
          {' '}on {new Date(state.profileMeta.updatedAt).toLocaleDateString()}
        </div>
      )}

      {state.profileError && <div className={styles.error}>{state.profileError}</div>}

      <div className={styles.card}>
        <div className={styles.name}>{p.name}</div>
        <div className={styles.experience}>{p.yearsExperience} years experience</div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Titles</div>
        <ul className={styles.list}>
          {p.titles.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Skills</div>
        <SkillsDisplay skills={p.skills} />
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Preferences</div>
        <div className={styles.prefsGrid}>
          <span className={styles.prefsLabel}>Locations</span>
          <span className={styles.prefsValue}>
            {p.preferredLocations.length > 0 ? p.preferredLocations.join(', ') : 'any'}
          </span>
          <span className={styles.prefsLabel}>Remote</span>
          <span className={styles.prefsValue}>{p.remotePreference}</span>
          {p.salaryExpectation && (
            <>
              <span className={styles.prefsLabel}>Salary</span>
              <span className={styles.prefsValue}>
                {p.salaryExpectation.currency} {p.salaryExpectation.min.toLocaleString()}&ndash;{p.salaryExpectation.max.toLocaleString()}
              </span>
            </>
          )}
        </div>
      </div>

      {showRaw && state.resumeText && (
        <div className={styles.rawSection}>
          <div className={styles.sectionTitle}>Resume Text</div>
          <div className={styles.rawText}>{state.resumeText}</div>
        </div>
      )}
    </div>
  );
}
