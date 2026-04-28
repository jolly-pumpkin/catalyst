export interface ConcurrencyOptions {
  limit?: number;
  onError?: (err: unknown, index: number) => void;
}

/**
 * Run an async function over items with a concurrency limit, collecting results.
 * Results preserve input ordering. If `onError` is provided, failed items are
 * excluded from results; otherwise the first error rejects the entire call.
 */
export async function withConcurrency<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  options: ConcurrencyOptions = {},
): Promise<R[]> {
  const limit = options.limit ?? 3;
  if (!items.length) return [];

  const results: (R | undefined)[] = new Array(items.length);
  const succeeded: boolean[] = new Array(items.length).fill(false);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const idx = nextIndex++;
      try {
        results[idx] = await fn(items[idx]!, idx);
        succeeded[idx] = true;
      } catch (err) {
        if (options.onError) {
          options.onError(err, idx);
        } else {
          throw err;
        }
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );

  return results.filter((_, i) => succeeded[i]) as R[];
}
