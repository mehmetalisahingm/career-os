import { describe, expect, it } from "vitest";

import { createApplicationSchema, createCompanySchema } from "@/features/applications/validation";

describe("application validation", () => {
  it("accepts valid company payload", () => {
    const result = createCompanySchema.safeParse({
      name: "OpenAI",
      websiteUrl: "https://openai.com",
      location: "Remote",
    });

    expect(result.success).toBe(true);
  });

  it("accepts valid application payload", () => {
    const result = createApplicationSchema.safeParse({
      companyId: "550e8400-e29b-41d4-a716-446655440000",
      title: "Backend Intern",
      source: "linkedin",
      jobType: "internship",
      workMode: "remote",
      listingUrl: "https://example.com/job",
      salaryMin: "20000",
      salaryMax: "30000",
      currency: "TRY",
      status: "applied",
      appliedAt: new Date().toISOString(),
      followUpAt: new Date().toISOString(),
    });

    expect(result.success).toBe(true);
  });
});
