import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/flights/search/route";
import { cache } from "@/lib/cache";

describe("GET /api/flights/search API Route", () => {
  beforeEach(() => {
    cache.clear();
  });

  const validUrl =
    "http://localhost:3000/api/flights/search?from=DEL&to=BOM&depart=2026-11-20&trip=oneway&adults=1&cabin=economy";

  it("returns 200 with flight search results for valid parameters", async () => {
    const req = new NextRequest(validUrl);
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.count).toBeGreaterThan(0);
    expect(data.query.from).toBe("DEL");
    expect(data.query.to).toBe("BOM");
    expect(data.offers[0].price.currency).toBe("INR");
    expect(data.meta.cached).toBe(false);
  });

  it("returns cached result on subsequent identical search", async () => {
    const req1 = new NextRequest(validUrl);
    const res1 = await GET(req1);
    const data1 = await res1.json();
    expect(data1.meta.cached).toBe(false);

    const req2 = new NextRequest(validUrl);
    const res2 = await GET(req2);
    const data2 = await res2.json();
    expect(data2.meta.cached).toBe(true);
    expect(data2.offers[0].id).toBe(data1.offers[0].id);
  });

  it("returns 400 when origin and destination airports are identical", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/flights/search?from=DEL&to=DEL&depart=2026-11-20"
    );
    const res = await GET(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 when departure date is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/flights/search?from=DEL&to=BOM");
    const res = await GET(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 when return date is before departure date for roundtrip", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/flights/search?from=DEL&to=BOM&depart=2026-11-20&return=2026-11-10&trip=roundtrip"
    );
    const res = await GET(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 404 when origin airport does not exist in airport database", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/flights/search?from=ZZZ&to=BOM&depart=2026-11-20"
    );
    const res = await GET(req);
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data.error.code).toBe("INVALID_ORIGIN");
  });
});
