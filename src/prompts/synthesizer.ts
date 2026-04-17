import type { CandidateProfile, JobAnalysis, NormalizedJob } from '../types.js';

export function synthesizerPrompt(
  jobs: NormalizedJob[],
  analyses: JobAnalysis[],
  profile: CandidateProfile,
): string {
  const byJob = jobs.map((job) => ({
    job,
    skill: analyses.find((a) => a.jobId === job.id && a.variant === 'skill'),
    culture: analyses.find((a) => a.jobId === job.id && a.variant === 'culture'),
    salary: analyses.find((a) => a.jobId === job.id && a.variant === 'salary'),
  }));

  return `You are a job match synthesizer. Rank these jobs for ${profile.name} (${profile.titles[0] ?? 'professional'}).

Combine skill, culture, and salary scores into an overall score. Write a 2-sentence summary.

Return ONLY a JSON array sorted by overallScore DESC:
[{
  "jobId": "id",
  "overallScore": number,
  "scores": { "skill": number, "culture": number, "salary": number },
  "summary": "2 sentence explanation",
  "redFlags": ["any concerns"]
}]

DATA:
${JSON.stringify(byJob, null, 2)}`;
}
