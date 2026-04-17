import type { CandidateProfile, NormalizedJob } from '../types.js';

export function cultureFitPrompt(jobs: NormalizedJob[], profile: CandidateProfile): string {
  return `You are a culture fit analyzer. Score each job's culture alignment for the candidate.

Candidate preference: ${profile.remotePreference}, locations: ${profile.preferredLocations.join(', ')}

For each job score 0-100 for culture/team/values fit based on location, remote policy, and description signals.

Return ONLY a JSON array:
[{ "jobId": "id", "variant": "culture", "score": number, "reasoning": "1 sentence", "signals": ["key signal"] }]

JOBS:
${JSON.stringify(jobs.map((j) => ({ id: j.id, title: j.title, location: j.location, remote: j.remote, description: j.description })), null, 2)}`;
}
