const globalStore = globalThis as unknown as {
  __careerOsRateLimit?: Map<string, { count: number; resetAt: number }>;
};

const store = globalStore.__careerOsRateLimit ?? new Map<string, { count: number; resetAt: number }>();

if (!globalStore.__careerOsRateLimit) {
  globalStore.__careerOsRateLimit = store;
}

export function enforceRateLimit(key: string, options?: { limit?: number; windowMs?: number }) {
  const limit = options?.limit ?? 10;
  const windowMs = options?.windowMs ?? 60_000;
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: current.resetAt - now };
  }

  current.count += 1;
  store.set(key, current);
  return { ok: true, remaining: limit - current.count };
}
