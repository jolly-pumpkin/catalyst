export function profileParserPrompt(resumeText: string): string {
  return `You are a resume parser. Extract structured information from the resume below.

Return ONLY a JSON object with this exact shape (no markdown, no explanation):
{
  "name": "string",
  "skills": ["array", "of", "skills"],
  "yearsExperience": number,
  "titles": ["most recent title first"],
  "preferredLocations": ["city or Remote"],
  "remotePreference": "remote" | "hybrid" | "onsite" | "flexible",
  "salaryExpectation": { "min": number, "max": number, "currency": "USD" } | null
}

RESUME:
${resumeText}`;
}
