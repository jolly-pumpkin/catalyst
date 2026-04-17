import type { Plugin } from 'rhodium-core';

export interface OllamaProviderOptions {
  model?: string;
  baseUrl?: string;
}

export function ollamaProviderPlugin(options: OllamaProviderOptions = {}): Plugin {
  const model = options.model ?? process.env.OLLAMA_MODEL ?? 'gemma4';
  const baseUrl = options.baseUrl ?? process.env.OLLAMA_URL ?? 'http://localhost:11434';

  return {
    key: 'ollama-provider',
    version: '1.0.0',
    manifest: {
      name: 'Ollama Provider',
      description: `LLM capability via Ollama (${model})`,
      provides: [{ capability: 'llm.generate', priority: 100 }],
      needs: [],
      tags: ['llm'],
    },
    activate(ctx) {
      ctx.provide('llm.generate', {
        async generate(prompt: string, opts: { temperature?: number; caller?: string } = {}) {
          const callId = crypto.randomUUID();
          const temperature = opts.temperature ?? 0.3;
          const caller = opts.caller ?? 'unknown';

          ctx.emit('llm:call-start', { callId, caller, model, prompt, temperature });
          const start = performance.now();

          let res: Response;
          try {
            res = await fetch(`${baseUrl}/api/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model,
                prompt,
                stream: false,
                options: { temperature },
              }),
            });
          } catch (err) {
            const durationMs = Math.round(performance.now() - start);
            const error = `Ollama unreachable at ${baseUrl}: ${(err as Error).message}`;
            ctx.emit('llm:call-failed', { callId, caller, model, error, durationMs });
            throw new Error(error);
          }
          if (!res.ok) {
            const durationMs = Math.round(performance.now() - start);
            const error = `Ollama error ${res.status}: ${await res.text()}`;
            ctx.emit('llm:call-failed', { callId, caller, model, error, durationMs });
            throw new Error(error);
          }
          const data = await res.json() as {
            response: string;
            prompt_eval_count?: number;
            eval_count?: number;
          };
          const durationMs = Math.round(performance.now() - start);
          ctx.emit('llm:call-complete', {
            callId, caller, model,
            response: data.response,
            temperature, durationMs,
            promptTokens: data.prompt_eval_count,
            responseTokens: data.eval_count,
          });
          return data.response;
        },
      });
    },
  };
}
