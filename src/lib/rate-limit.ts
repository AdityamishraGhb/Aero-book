import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
  prefix?: string;
  identifier?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
  retryAfter?: number; // Seconds to wait if rate limit exceeded
}

interface InMemoryRecord {
  count: number;
  resetAt: number; // milliseconds timestamp
}

/**
 * In-memory sliding window rate limiter fallback
 */
class InMemoryRateLimiter {
  private records = new Map<string, InMemoryRecord>();

  check(key: string, limit: number, windowSeconds: number): RateLimitResult {
    const now = Date.now();
    const existing = this.records.get(key);

    if (!existing || now >= existing.resetAt) {
      // First request or window has expired
      const resetAt = now + windowSeconds * 1000;
      this.records.set(key, { count: 1, resetAt });

      return {
        success: true,
        limit,
        remaining: Math.max(0, limit - 1),
        reset: Math.ceil(resetAt / 1000),
      };
    }

    // Within active window
    if (existing.count >= limit) {
      const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      return {
        success: false,
        limit,
        remaining: 0,
        reset: Math.ceil(existing.resetAt / 1000),
        retryAfter,
      };
    }

    existing.count += 1;
    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - existing.count),
      reset: Math.ceil(existing.resetAt / 1000),
    };
  }

  clear(): void {
    this.records.clear();
  }
}

const memoryRateLimiter = new InMemoryRateLimiter();

/**
 * Extract client IP or identifier from NextRequest
 */
export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Return first IP in comma-separated list
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

/**
 * Execute rate limit check against Redis or in-memory fallback
 */
export async function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const { limit, windowSeconds, prefix = "api", identifier } = options;
  const clientId = identifier || getClientIdentifier(request);
  const key = `ratelimit:${prefix}:${clientId}`;

  const redisUrl = env.UPSTASH_REDIS_REST_URL;
  const redisToken = env.UPSTASH_REDIS_REST_TOKEN;

  // Use Upstash Redis when configured
  if (redisUrl && redisToken) {
    try {
      // Pipeline INCR and EXPIRE in a single round-trip
      const res = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["TTL", key],
        ]),
        signal: AbortSignal.timeout(1200),
      });

      if (res.ok) {
        const data = (await res.json()) as Array<{ result?: number }>;
        const currentCount = data?.[0]?.result ?? 1;
        let ttl = data?.[1]?.result ?? -1;

        // If key had no expiration, set it
        if (ttl === -1 || currentCount === 1) {
          await fetch(`${redisUrl}/expire/${encodeURIComponent(key)}/${windowSeconds}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${redisToken}` },
            signal: AbortSignal.timeout(1000),
          }).catch(() => {});
          ttl = windowSeconds;
        }

        const nowSec = Math.floor(Date.now() / 1000);
        const reset = nowSec + (ttl > 0 ? ttl : windowSeconds);

        if (currentCount > limit) {
          return {
            success: false,
            limit,
            remaining: 0,
            reset,
            retryAfter: ttl > 0 ? ttl : windowSeconds,
          };
        }

        return {
          success: true,
          limit,
          remaining: Math.max(0, limit - currentCount),
          reset,
        };
      }
    } catch {
      // Fall back to in-memory rate limiter on network/Redis error
    }
  }

  return memoryRateLimiter.check(key, limit, windowSeconds);
}

/**
 * Construct standard rate limit headers
 */
export function createRateLimitHeaders(result: RateLimitResult): HeadersInit {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
  };

  if (!result.success && result.retryAfter) {
    headers["Retry-After"] = String(result.retryAfter);
  }

  return headers;
}

/**
 * Return a 429 Too Many Requests response with standard rate limit headers
 */
export function createRateLimitErrorResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please slow down and try again later.",
        retryAfter: result.retryAfter ?? 60,
      },
    },
    {
      status: 429,
      headers: createRateLimitHeaders(result),
    }
  );
}

/**
 * Export for unit testing
 */
export function resetMemoryRateLimiter(): void {
  memoryRateLimiter.clear();
}
