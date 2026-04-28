import type { RawJob } from '../types.js';

export function jobNormalizerPrompt(job: RawJob): string {
  return `You are a job data normalizer. Clean and structure the following job posting.

Extract skills mentioned in the description and determine if it is remote.

Return ONLY a JSON object — no markdown, no explanation:
{
  "id": "${job.id}",
  "title": "cleaned title",
  "company": "company name",
  "location": "city/state or Remote",
  "remote": true | false,
  "skills": ["extracted", "skills"],
  "description": "first 200 chars of cleaned description",
  "url": "same url",
  "source": "same source"
}

JOB:
${JSON.stringify(job, null, 2)}`;
}
