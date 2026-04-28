import type { CandidateProfile, NormalizedJob } from '../types.js';

export function cultureFitPrompt(job: NormalizedJob, profile: CandidateProfile): string {
  return `You are a culture fit analyzer. Score this job's culture alignment for the candidate.

Candidate preference: ${profile.remotePreference}, locations: ${profile.preferredLocations.join(', ')}

Score 0-100 for culture/team/values fit based on location, remote policy, and description signals.

Return ONLY a JSON object — no markdown, no explanation:
{ "jobId": "${job.id}", "variant": "culture", "score": number, "reasoning": "1 sentence", "signals": ["key signal"] }

JOB:
${JSON.stringify({ id: job.id, title: job.title, location: job.location, remote: job.remote, description: job.description }, null, 2)}`;
}
