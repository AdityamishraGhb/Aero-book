import { NextRequest, NextResponse } from "next/server";
import { flightSearchQuerySchema, type FlightSearchResult } from "@/types/flight";
import { getFlightProvider, ProviderError } from "@/lib/providers";
import { cache } from "@/lib/cache";
import {
  checkRateLimit,
  createRateLimitErrorResponse,
  createRateLimitHeaders,
} from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // 1. Enforce Rate Limiting (30 requests per minute)
  const rateLimitResult = await checkRateLimit(request, {
    limit: 30,
    windowSeconds: 60,
    prefix: "flights-search",
  });

  if (!rateLimitResult.success) {
    return createRateLimitErrorResponse(rateLimitResult);
  }

  const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);

  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parseResult = flightSearchQuerySchema.safeParse(searchParams);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid flight search parameters provided",
            details: parseResult.error.flatten(),
          },
        },
        {
          status: 400,
          headers: rateLimitHeaders,
        }
      );
    }

    const query = parseResult.data;

    // Cache key representing the unique flight search parameters
    const cacheKey = `flights:${query.from}:${query.to}:${query.depart}:${query.return || ""}:${query.trip}:${query.cabin}:${query.adults}:${query.children}:${query.infants}:${query.directOnly}:${query.sort}`;

    // 2. Check Cache (Redis / In-memory fallback)
    const cachedResult = await cache.get<FlightSearchResult>(cacheKey);
    if (cachedResult) {
      return NextResponse.json(
        {
          ...cachedResult,
          meta: {
            ...cachedResult.meta,
            cached: true,
          },
        },
        {
          status: 200,
          headers: rateLimitHeaders,
        }
      );
    }

    // 3. Query Flight Provider
    const provider = getFlightProvider();
    const result = await provider.searchFlights(query);

    // 4. Cache flight offers for 15 minutes (900 seconds)
    await cache.set(cacheKey, result, 900);

    return NextResponse.json(result, {
      status: 200,
      headers: rateLimitHeaders,
    });
  } catch (error) {
    if (error instanceof ProviderError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        {
          status: error.statusCode,
          headers: rateLimitHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred during flight search",
        },
      },
      {
        status: 500,
        headers: rateLimitHeaders,
      }
    );
  }
}
