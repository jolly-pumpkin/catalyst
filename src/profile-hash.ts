import { createHash } from 'node:crypto';
import type { CandidateProfile } from './types.js';

/** Deterministic hash of the profile fields that affect job analysis. */
export function hashProfile(profile: CandidateProfile): string {
  const data = JSON.stringify({
    skills: profile.skills,
    yearsExperience: profile.yearsExperience,
    titles: profile.titles,
    salaryExpectation: profile.salaryExpectation,
  });
  return createHash('sha256').update(data).digest('hex');
}
