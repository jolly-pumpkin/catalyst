import type { CandidateProfile, NormalizedJob } from '../types.js';

export function skillMatcherPrompt(job: NormalizedJob, profile: CandidateProfile): string {
  const candidateSkills = Object.values(profile.skills).flat();
  return `You are a technical skill matcher. Score this job's skill fit for the candidate.

Candidate skills: ${candidateSkills.join(', ')}
Candidate experience: ${profile.yearsExperience} years as ${profile.titles[0] ?? 'professional'}

Return a score 0-100 for technical skill overlap.
Also return:
- matchedSkills: candidate skills that match this job's requirements
- missingSkills: skills the job requires that the candidate lacks
- matchPercent: percentage of required skills the candidate has (0-100)
- gapSeverity: "minor" if matchPercent >= 80, "moderate" if >= 60, "major" if < 60

Return ONLY a JSON object — no markdown, no explanation:
{ "jobId": "${job.id}", "variant": "skill", "score": number, "reasoning": "1 sentence", "signals": ["key signal"], "matchedSkills": ["skill"], "missingSkills": ["skill"], "matchPercent": number, "gapSeverity": "minor"|"moderate"|"major" }

JOB:
${JSON.stringify({ id: job.id, title: job.title, skills: job.skills }, null, 2)}`;
}
