import { describe, expect, it } from "vitest";

import { enforceRateLimit } from "@/lib/rate-limit";

describe("rate limit", () => {
  it("blocks after limit is exceeded", () => {
    const key = `test:${Math.random()}`;

    expect(enforceRateLimit(key, { limit: 2, windowMs: 1000 }).ok).toBe(true);
    expect(enforceRateLimit(key, { limit: 2, windowMs: 1000 }).ok).toBe(true);
    expect(enforceRateLimit(key, { limit: 2, windowMs: 1000 }).ok).toBe(false);
  });
});
