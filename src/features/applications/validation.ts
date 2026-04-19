import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().trim().min(2).max(160),
  websiteUrl: z.string().trim().url().optional().or(z.literal("")).transform((value) => value || undefined),
  location: z.string().trim().max(160).optional().or(z.literal("")).transform((value) => value || undefined),
});

export const createApplicationSchema = z.object({
  companyId: z.string().uuid(),
  title: z.string().trim().min(2).max(160),
  source: z.enum(["linkedin", "company_site", "referral", "github", "kariyer_net", "other"]),
  jobType: z.enum(["internship", "full_time", "part_time", "contract", "freelance"]),
  workMode: z.enum(["remote", "hybrid", "onsite"]).optional(),
  listingUrl: z.string().trim().url().optional().or(z.literal("")).transform((value) => value || undefined),
  salaryMin: z.string().optional().transform((value) => (value && value.length > 0 ? Number(value) : undefined)).refine((value) => value === undefined || Number.isInteger(value), {
    message: "salaryMin tam sayı olmalı.",
  }),
  salaryMax: z.string().optional().transform((value) => (value && value.length > 0 ? Number(value) : undefined)).refine((value) => value === undefined || Number.isInteger(value), {
    message: "salaryMax tam sayı olmalı.",
  }),
  currency: z.string().trim().min(3).max(12).default("TRY"),
  followUpAt: z.string().optional().transform((value) => (value ? new Date(value) : undefined)).refine((value) => value === undefined || !Number.isNaN(value.getTime()), {
    message: "Geçerli bir takip tarihi girilmelidir.",
  }),
  appliedAt: z.string().optional().transform((value) => (value ? new Date(value) : undefined)).refine((value) => value === undefined || !Number.isNaN(value.getTime()), {
    message: "Geçerli bir başvuru tarihi girilmelidir.",
  }),
  status: z.enum(["wishlist", "applied", "screening", "interview", "offer", "rejected", "archived"]),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["wishlist", "applied", "screening", "interview", "offer", "rejected", "archived"]),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
