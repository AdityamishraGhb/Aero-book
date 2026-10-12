import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/airports/route";
import { cache } from "@/lib/cache";

describe("GET /api/airports API Route", () => {
  beforeEach(() => {
    cache.clear();
  });

  it("returns popular airports for empty query", async () => {
    const req = new NextRequest("http://localhost:3000/api/airports");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.count).toBeGreaterThanOrEqual(10);
    expect(data.cached).toBe(false);
  });

  it("searches and returns airports matching query", async () => {
    const req = new NextRequest("http://localhost:3000/api/airports?q=DEL");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.airports[0].iata).toBe("DEL");
  });

  it("returns cached results on second request", async () => {
    const req1 = new NextRequest("http://localhost:3000/api/airports?q=BLR");
    const res1 = await GET(req1);
    const data1 = await res1.json();
    expect(data1.cached).toBe(false);

    const req2 = new NextRequest("http://localhost:3000/api/airports?q=BLR");
    const res2 = await GET(req2);
    const data2 = await res2.json();
    expect(data2.cached).toBe(true);
    expect(data2.airports[0].iata).toBe("BLR");
  });

  it("returns 400 validation error for negative or invalid limit", async () => {
    const req = new NextRequest("http://localhost:3000/api/airports?limit=999");
    const res = await GET(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });
});
