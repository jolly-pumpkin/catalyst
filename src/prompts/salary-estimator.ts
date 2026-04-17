import type { CandidateProfile, NormalizedJob } from '../types.js';

export function salaryEstimatorPrompt(jobs: NormalizedJob[], profile: CandidateProfile): string {
  const range = profile.salaryExpectation
    ? `$${profile.salaryExpectation.min / 1000}k–$${profile.salaryExpectation.max / 1000}k`
    : 'unknown';
  return `You are a salary fit estimator. Score each job's likely comp alignment.

Candidate expected range: ${range}

Estimate based on company, title, and location. Score 0-100 for salary fit.

Return ONLY a JSON array:
[{ "jobId": "id", "variant": "salary", "score": number, "reasoning": "1 sentence", "signals": ["key signal"] }]

JOBS:
${JSON.stringify(jobs.map((j) => ({ id: j.id, title: j.title, company: j.company, location: j.location })), null, 2)}`;
}
