import { describe, it, expect } from 'vitest';
import { withConcurrency } from './concurrency.js';

describe('withConcurrency', () => {
  it('returns results in input order', async () => {
    const items = [10, 20, 30];
    const results = await withConcurrency(items, async (n) => n * 2, { limit: 2 });
    expect(results).toEqual([20, 40, 60]);
  });

  it('returns empty array for empty input', async () => {
    const results = await withConcurrency([], async () => 1);
    expect(results).toEqual([]);
  });

  it('respects concurrency limit', async () => {
    let inflight = 0;
    let maxInflight = 0;
    const items = [1, 2, 3, 4, 5];

    await withConcurrency(items, async (n) => {
      inflight++;
      maxInflight = Math.max(maxInflight, inflight);
      await new Promise((r) => setTimeout(r, 10));
      inflight--;
      return n;
    }, { limit: 2 });

    expect(maxInflight).toBe(2);
  });

  it('propagates errors when no onError provided', async () => {
    await expect(
      withConcurrency([1, 2, 3], async (n) => {
        if (n === 2) throw new Error('fail');
        return n;
      }),
    ).rejects.toThrow('fail');
  });

  it('skips failed items when onError provided', async () => {
    const errors: number[] = [];
    const results = await withConcurrency(
      [1, 2, 3],
      async (n) => {
        if (n === 2) throw new Error('fail');
        return n * 10;
      },
      { limit: 1, onError: (_err, idx) => errors.push(idx) },
    );
    expect(results).toEqual([10, 30]);
    expect(errors).toEqual([1]);
  });
});
