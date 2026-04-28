# Categorized Skills Design

## Problem
Skills in `CandidateProfile` are a flat `string[]`. Users want skills organized into named categories (e.g. "Programming Languages", "Tools", "Soft Skills") that are collapsible, editable, and support moving skills between categories.

## Decision
- **Data model**: `skills: Record<string, string[]>` — keys are category names, values are skill arrays
- **LLM auto-categorizes** on resume parse; user can rearrange after
- **Pipeline stages flatten** categories via `Object.values(skills).flat()` — categories are UI-only, no impact on matching

## Data Model

```typescript
// src/types.ts — CandidateProfile
skills: Record<string, string[]>;
```

## UI Behavior (Profile View, edit mode)

- Each category renders as a collapsible section with header
- Skills within each category are removable tags
- "Add Skill" input at bottom of each category
- "Add Category" button below all categories
- Click a skill tag to get a dropdown of other categories to move it to
- Delete empty category via "x" on the category header

## Files Changed

| File | Change |
|------|--------|
| `src/types.ts` | `skills: string[]` -> `Record<string, string[]>` |
| `src/prompts/profile-parser.ts` | Update JSON example for categorized output |
| `src/prompts/skill-matcher.ts` | Flatten skills for prompt |
| `src/plugins/index-fetcher.ts` | Flatten skills for query |
| `src/renderer/views/Profile.tsx` | Categorized skills UI |
| `src/renderer/views/Profile.module.css` | Category styles |
| `src/renderer/views/Pipeline.tsx` | Flatten for display |
| `src/renderer/views/ResumeManager.tsx` | Flatten for display |
| `src/plugins/profile-parser.test.ts` | Update mock/assertions |
