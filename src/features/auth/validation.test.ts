import { describe, expect, it } from "vitest";

import { loginSchema, signUpSchema } from "@/features/auth/validation";

describe("auth validation", () => {
  it("accepts valid signup payload", () => {
    const result = signUpSchema.safeParse({
      name: "Mehmet Ali",
      email: "mehmet@example.com",
      password: "Password123!",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid login payload", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "123",
    });

    expect(result.success).toBe(false);
  });
});
