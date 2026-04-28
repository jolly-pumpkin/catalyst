//#region src/prompts/run-summary.ts
function runSummaryPrompt(jobs, profile) {
	const topJobs = jobs.filter((j) => j.overallScore >= 75);
	const companies = [...new Set(jobs.map((j) => j.job.company))];
	const avgScore = jobs.length > 0 ? Math.round(jobs.reduce((s, j) => s + j.overallScore, 0) / jobs.length) : 0;
	const allRedFlags = jobs.flatMap((j) => j.redFlags);
	const redFlagCounts = {};
	for (const rf of allRedFlags) redFlagCounts[rf] = (redFlagCounts[rf] || 0) + 1;
	return `You are a career search analyst. Write a concise 3-4 sentence summary of this pipeline run for ${profile.name}.

Data:
- ${jobs.length} jobs scored across ${companies.length} companies
- ${topJobs.length} strong matches (score 75+)
- Average score: ${avgScore}
- Companies with most results: ${companies.slice(0, 5).join(", ")}
- Top red flags: ${Object.entries(redFlagCounts).sort(([, a], [, b]) => b - a).slice(0, 3).map(([rf, n]) => `${rf} (${n}x)`).join(", ") || "none"}
- Candidate skills: ${Object.values(profile.skills).flat().slice(0, 10).join(", ")}

Write a brief, actionable summary. Mention:
1. How many strong matches and which companies look promising
2. Any patterns in red flags or skill gaps
3. One specific actionable suggestion

Respond with ONLY the summary text, no JSON, no markdown.`;
}
//#endregion
exports.runSummaryPrompt = runSummaryPrompt;
