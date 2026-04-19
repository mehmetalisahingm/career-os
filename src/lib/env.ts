import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET en az 32 karakter olmalı."),
  AUTH_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
  DATABASE_URL: process.env.DATABASE_URL,
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables", parsed.error.flatten().fieldErrors);
  throw new Error("Environment variables are invalid.");
}

export const env = parsed.data;
