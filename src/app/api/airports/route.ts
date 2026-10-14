import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchAirports } from "@/data/airports";
import { cache } from "@/lib/cache";
import type { Airport } from "@/types/flight";
import {
  checkRateLimit,
  createRateLimitErrorResponse,
  createRateLimitHeaders,
} from "@/lib/rate-limit";

const querySchema = z.object({
  q: z.string().trim().max(100).default(""),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export async function GET(request: NextRequest) {
  // 1. Enforce Rate Limiting (60 requests per minute)
  const rateLimitResult = await checkRateLimit(request, {
    limit: 60,
    windowSeconds: 60,
    prefix: "airports",
  });

  if (!rateLimitResult.success) {
    return createRateLimitErrorResponse(rateLimitResult);
  }

  const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);

  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parseResult = querySchema.safeParse(searchParams);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid query parameters provided to /api/airports",
            details: parseResult.error.flatten(),
          },
        },
        {
          status: 400,
          headers: rateLimitHeaders,
        }
      );
    }

    const { q, limit } = parseResult.data;
    const cacheKey = `airports:q:${q.toLowerCase()}:limit:${limit}`;

    // 2. Check cache
    const cachedAirports = await cache.get<Airport[]>(cacheKey);
    if (cachedAirports) {
      return NextResponse.json(
        {
          success: true,
          count: cachedAirports.length,
          airports: cachedAirports,
          cached: true,
        },
        {
          status: 200,
          headers: rateLimitHeaders,
        }
      );
    }

    // 3. Execute search
    const results = searchAirports(q, limit);

    // 4. Cache results for 24 hours (86,400s)
    await cache.set(cacheKey, results, 86400);

    return NextResponse.json(
      {
        success: true,
        count: results.length,
        airports: results,
        cached: false,
      },
      {
        status: 200,
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Internal server error occurred",
        },
      },
      {
        status: 500,
        headers: rateLimitHeaders,
      }
    );
  }
}
