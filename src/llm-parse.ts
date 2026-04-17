/**
 * Parse an LLM response as JSON, stripping markdown fences and providing clear errors.
 */
export function parseLLMJson<T>(raw: string, pluginName: string): T {
  // Strip markdown fences (```json, ```JSON, ```js, ```, etc.)
  const cleaned = raw.replace(/```\w*\s*\n?|\n?\s*```/g, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch (e) {
    throw new Error(
      `${pluginName}: failed to parse LLM response as JSON: ${cleaned.slice(0, 300)}`,
      { cause: e },
    );
  }
}
