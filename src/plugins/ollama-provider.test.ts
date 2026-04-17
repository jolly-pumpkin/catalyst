import { describe, it, expect, vi, afterEach } from 'vitest';
import { createTestBroker } from 'rhodium-testing';
import { ollamaProviderPlugin } from './ollama-provider.js';

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

describe('ollama-provider plugin', () => {
  it('provides llm.generate capability', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ response: 'hello world' }))
    );
    globalThis.fetch = fetchMock as any;

    const { broker } = createTestBroker();
    broker.register(ollamaProviderPlugin({ model: 'gemma4', baseUrl: 'http://localhost:11434' }));
    await broker.activate();

    const llm = broker.resolve<{ generate: (p: string) => Promise<string> }>('llm.generate');
    const result = await llm.generate('say hello');

    expect(result).toBe('hello world');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:11434/api/generate',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws a clear error when Ollama is unreachable', async () => {
    globalThis.fetch = vi.fn(async () => { throw new Error('ECONNREFUSED'); }) as any;

    const { broker } = createTestBroker();
    broker.register(ollamaProviderPlugin({ model: 'gemma4' }));
    await broker.activate();

    const llm = broker.resolve<{ generate: (p: string) => Promise<string> }>('llm.generate');
    await expect(llm.generate('hello')).rejects.toThrow('Ollama unreachable');
  });
});
