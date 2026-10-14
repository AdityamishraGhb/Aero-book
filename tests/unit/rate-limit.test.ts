import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  checkRateLimit,
  createRateLimitHeaders,
  createRateLimitErrorResponse,
  resetMemoryRateLimiter,
  getClientIdentifier,
} from "@/lib/rate-limit";

describe("Rate Limiting", () => {
  beforeEach(() => {
    resetMemoryRateLimiter();
  });

  it("extracts client IP from x-forwarded-for header", () => {
    const req = new NextRequest("http://localhost:3000/api/airports", {
      headers: { "x-forwarded-for": "203.0.113.195, 70.41.3.18" },
    });
    expect(getClientIdentifier(req)).toBe("203.0.113.195");
  });

  it("extracts client IP from x-real-ip header", () => {
    const req = new NextRequest("http://localhost:3000/api/airports", {
      headers: { "x-real-ip": "198.51.100.25" },
    });
    expect(getClientIdentifier(req)).toBe("198.51.100.25");
  });

  it("falls back to 127.0.0.1 when no IP headers are present", () => {
    const req = new NextRequest("http://localhost:3000/api/airports");
    expect(getClientIdentifier(req)).toBe("127.0.0.1");
  });

  it("permits requests within the defined threshold", async () => {
    const req = new NextRequest("http://localhost:3000/api/airports", {
      headers: { "x-real-ip": "10.0.0.1" },
    });

    const res1 = await checkRateLimit(req, { limit: 3, windowSeconds: 60, prefix: "test" });
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);
    expect(res1.limit).toBe(3);

    const res2 = await checkRateLimit(req, { limit: 3, windowSeconds: 60, prefix: "test" });
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = await checkRateLimit(req, { limit: 3, windowSeconds: 60, prefix: "test" });
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("rejects requests exceeding the limit with 429 details and retryAfter", async () => {
    const req = new NextRequest("http://localhost:3000/api/airports", {
      headers: { "x-real-ip": "10.0.0.2" },
    });

    // Exhaust quota (limit = 2)
    await checkRateLimit(req, { limit: 2, windowSeconds: 60, prefix: "test" });
    await checkRateLimit(req, { limit: 2, windowSeconds: 60, prefix: "test" });

    // Exceeded call
    const blocked = await checkRateLimit(req, { limit: 2, windowSeconds: 60, prefix: "test" });
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);

    const headers = createRateLimitHeaders(blocked) as Record<string, string>;
    expect(headers["X-RateLimit-Limit"]).toBe("2");
    expect(headers["X-RateLimit-Remaining"]).toBe("0");
    expect(headers["Retry-After"]).toBeDefined();

    const response = createRateLimitErrorResponse(blocked);
    expect(response.status).toBe(429);
    const body = await response.json();
    expect(body.error.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(body.error.retryAfter).toBeDefined();
  });
});
