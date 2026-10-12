import { z } from "zod";

/**
 * Validated application environment configuration.
 * All third-party secrets default safely to allow zero-config local development.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  FLIGHT_PROVIDER: z.enum(["mock", "amadeus", "duffel"]).default("mock"),
  PROVIDER_API_KEY: z.string().optional().default(""),
  PROVIDER_API_SECRET: z.string().optional().default(""),
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal("")),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().default(""),
  DATABASE_URL: z.string().optional().default(""),
  AUTH_SECRET: z.string().optional().default(""),
  SENTRY_DSN: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  FLIGHT_PROVIDER: process.env.FLIGHT_PROVIDER || "mock",
  PROVIDER_API_KEY: process.env.PROVIDER_API_KEY || "",
  PROVIDER_API_SECRET: process.env.PROVIDER_API_SECRET || "",
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  DATABASE_URL: process.env.DATABASE_URL || "",
  AUTH_SECRET: process.env.AUTH_SECRET || "",
  SENTRY_DSN: process.env.SENTRY_DSN || "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
});
