import { z } from "zod";

/**
 * Validated application environment configuration.
 * All third-party secrets default safely to allow zero-config local development
 * and automatic preview deployment resolution on Vercel.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  FLIGHT_PROVIDER: z.enum(["mock", "amadeus", "duffel"]).default("mock"),
  PROVIDER_API_KEY: z.string().optional().default(""),
  PROVIDER_API_SECRET: z.string().optional().default(""),
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal("")),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().default(""),
  DATABASE_URL: z.string().optional().default(""),
  AUTH_SECRET: z.string().optional().default(""),
  AUTH_GOOGLE_ID: z.string().optional().default(""),
  AUTH_GOOGLE_SECRET: z.string().optional().default(""),
  AUTH_URL: z.string().optional().default("http://localhost:3000"),
  AUTH_TRUST_HOST: z.string().optional().default("true"),
  SENTRY_DSN: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

// Always trust dynamic preview and localhost origins for NextAuth v5
if (!process.env.AUTH_TRUST_HOST) {
  process.env.AUTH_TRUST_HOST = "true";
}

const resolveSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
};

const resolveAuthUrl = (): string => {
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
};

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: (process.env.VERCEL_ENV as "production" | "preview" | "development") || undefined,
  FLIGHT_PROVIDER: process.env.FLIGHT_PROVIDER || "mock",
  PROVIDER_API_KEY: process.env.PROVIDER_API_KEY || "",
  PROVIDER_API_SECRET: process.env.PROVIDER_API_SECRET || "",
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  DATABASE_URL: process.env.DATABASE_URL || "",
  AUTH_SECRET: process.env.AUTH_SECRET || "",
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID || "",
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET || "",
  AUTH_URL: resolveAuthUrl(),
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || "true",
  SENTRY_DSN: process.env.SENTRY_DSN || "",
  NEXT_PUBLIC_SITE_URL: resolveSiteUrl(),
});
