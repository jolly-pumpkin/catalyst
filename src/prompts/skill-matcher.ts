import type { CandidateProfile, NormalizedJob } from '../types.js';

export function skillMatcherPrompt(jobs: NormalizedJob[], profile: CandidateProfile): string {
  return `You are a technical skill matcher. Score each job's skill fit for the candidate.

Candidate skills: ${profile.skills.join(', ')}
Candidate experience: ${profile.yearsExperience} years as ${profile.titles[0] ?? 'professional'}

For each job return a score 0-100 for technical skill overlap.

Return ONLY a JSON array:
[{ "jobId": "id", "variant": "skill", "score": number, "reasoning": "1 sentence", "signals": ["key signal"] }]

JOBS:
${JSON.stringify(jobs.map((j) => ({ id: j.id, title: j.title, skills: j.skills })), null, 2)}`;
}
