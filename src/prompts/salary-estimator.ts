import type { CandidateProfile, NormalizedJob } from '../types.js';

export function salaryEstimatorPrompt(job: NormalizedJob, profile: CandidateProfile): string {
  const range = profile.salaryExpectation
    ? `$${profile.salaryExpectation.min / 1000}k–$${profile.salaryExpectation.max / 1000}k`
    : 'unknown';
  return `You are a salary fit estimator. Score this job's likely comp alignment.

Candidate expected range: ${range}

Estimate based on company, title, and location. Score 0-100 for salary fit.

Return ONLY a JSON object — no markdown, no explanation:
{ "jobId": "${job.id}", "variant": "salary", "score": number, "reasoning": "1 sentence", "signals": ["key signal"] }

JOB:
${JSON.stringify({ id: job.id, title: job.title, company: job.company, location: job.location }, null, 2)}`;
}
