import type { CandidateProfile, RankedJob, FeedbackTag } from '../types.js';

export interface PriorFeedback {
  totalRejected: number;
  totalNotApplying: number;
  tagCounts: Record<string, number>;
  recentNotes: string[];
}

export function reflectionAgentPrompt(
  jobs: RankedJob[],
  profile: CandidateProfile,
  iteration: number,
  priorFeedback?: PriorFeedback,
): string {
  const topScore = jobs[0]?.overallScore ?? 0;

  let feedbackSection = '';
  if (priorFeedback && (priorFeedback.totalRejected > 0 || priorFeedback.totalNotApplying > 0)) {
    const tagLines = Object.entries(priorFeedback.tagCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([tag, count]) => `  - ${tag}: ${count} times`)
      .join('\n');

    const notesLines = priorFeedback.recentNotes.length > 0
      ? `\nRecent user notes:\n${priorFeedback.recentNotes.map((n) => `  - "${n}"`).join('\n')}`
      : '';

    feedbackSection = `
PRIOR USER FEEDBACK (from previous pipeline runs):
The user has rejected ${priorFeedback.totalRejected} jobs and marked ${priorFeedback.totalNotApplying} as "not applying".
Common rejection reasons:
${tagLines}${notesLines}

Use this feedback to AVOID recommending similar jobs. For example:
- If "low-pay" is common, prioritize higher-paying roles
- If "bad-location" is common, focus on remote or preferred-location roles
- If "wrong-level" is common, better match seniority
- If "wrong-tech-stack" is common, prioritize matching technologies
Include this context in your refinement suggestions.
`;
  }

  return `You are a job search reflection agent. Evaluate if these results are good enough.

Iteration: ${iteration} of 3
Top result score: ${topScore}/100
Candidate: ${profile.name}, ${profile.titles[0] ?? 'professional'}

If top score >= 80 and there are 3+ results with score >= 70, the search is complete.
Otherwise suggest refinements.
${feedbackSection}
Return ONLY JSON:
{
  "confidence": number between 0 and 1,
  "rationale": "1 sentence",
  "searchRefinements": {
    "additionalKeywords": ["optional", "keywords"],
    "expandLocation": true | false,
    "relaxedRequirements": ["optional relaxed requirement"]
  } | null
}

TOP RESULTS:
${JSON.stringify(jobs.slice(0, 5).map((j) => ({ title: j.job.title, company: j.job.company, score: j.overallScore })), null, 2)}`;
}
