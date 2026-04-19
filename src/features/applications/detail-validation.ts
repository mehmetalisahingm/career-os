import { z } from "zod";

export const createNoteSchema = z.object({
  applicationId: z.string().uuid(),
  body: z.string().trim().min(1).max(3000),
});

export const createReminderSchema = z.object({
  applicationId: z.string().uuid(),
  label: z.string().trim().min(2).max(160),
  dueAt: z.string().transform((value) => new Date(value)).refine((value) => !Number.isNaN(value.getTime()), {
    message: "Geçerli bir tarih girilmelidir.",
  }),
});

export const createInterviewSchema = z.object({
  applicationId: z.string().uuid(),
  stageName: z.string().trim().min(2).max(120),
  scheduledAt: z.string().optional().transform((value) => (value ? new Date(value) : undefined)).refine((value) => value === undefined || !Number.isNaN(value.getTime()), {
    message: "Geçerli bir planlanan tarih girilmelidir.",
  }),
  notes: z.string().trim().max(3000).optional().or(z.literal("")).transform((value) => value || undefined),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
