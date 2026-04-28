import type { Plugin } from 'rhodium-core';
import http from 'node:http';

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

          const url = new URL('/api/generate', baseUrl);
          const reqBody = JSON.stringify({
            model,
            prompt,
            stream: false,
            options: { temperature },
          });

          let data: { response: string; prompt_eval_count?: number; eval_count?: number };
          try {
            data = await new Promise((resolve, reject) => {
              const req = http.request(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(reqBody) },
              }, (res) => {
                const chunks: Buffer[] = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => {
                  const body = Buffer.concat(chunks).toString();
                  if (res.statusCode && res.statusCode >= 400) {
                    reject(new Error(`Ollama error ${res.statusCode}: ${body}`));
                  } else {
                    resolve(JSON.parse(body));
                  }
                });
              });
              req.on('error', (err) => reject(err));
              req.write(reqBody);
              req.end();
            });
          } catch (err) {
            const durationMs = Math.round(performance.now() - start);
            const error = `Ollama unreachable at ${baseUrl}: ${(err as Error).message}`;
            ctx.emit('llm:call-failed', { callId, caller, model, error, durationMs });
            throw new Error(error);
          }
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
