import type { RawJob } from '../types.js';

export function jobNormalizerPrompt(jobs: RawJob[]): string {
  return `You are a job data normalizer. Clean and structure the following job postings.

For each job, extract skills mentioned in the description and determine if it is remote.

Return ONLY a JSON array — no markdown, no explanation:
[{
  "id": "same id as input",
  "title": "cleaned title",
  "company": "company name",
  "location": "city/state or Remote",
  "remote": true | false,
  "skills": ["extracted", "skills"],
  "description": "first 200 chars of cleaned description",
  "url": "same url",
  "source": "same source"
}]

JOBS:
${JSON.stringify(jobs, null, 2)}`;
}
