import { describe, it, expect } from "vitest";
import { TOP_INDIAN_ROUTES, getTopRouteBySlug } from "@/data/top-routes";

describe("Top Indian Routes Dataset", () => {
  it("contains 20 high-frequency domestic Indian flight routes", () => {
    expect(TOP_INDIAN_ROUTES.length).toBe(20);
  });

  it("ensures each route has valid IATA pairs, non-zero fares, and duration", () => {
    for (const route of TOP_INDIAN_ROUTES) {
      expect(route.slug).toMatch(/^[a-z]{3}-[a-z]{3}$/);
      expect(route.fromIata).toMatch(/^[A-Z]{3}$/);
      expect(route.toIata).toMatch(/^[A-Z]{3}$/);
      expect(route.fromCity.length).toBeGreaterThan(0);
      expect(route.toCity.length).toBeGreaterThan(0);
      expect(route.distanceKm).toBeGreaterThan(100);
      expect(route.startingFare).toBeGreaterThan(1000);
      expect(route.dailyFlightsCount).toBeGreaterThan(10);
      expect(route.popularAirlines.length).toBeGreaterThanOrEqual(3);
      expect(route.monthlyFares.length).toBe(12);
      expect(route.faqs.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("resolves route info by slug correctly", () => {
    const delBom = getTopRouteBySlug("del-bom");
    expect(delBom).toBeDefined();
    expect(delBom?.fromIata).toBe("DEL");
    expect(delBom?.toIata).toBe("BOM");
    expect(delBom?.startingFare).toBe(3999);

    const blrDel = getTopRouteBySlug("BLR-DEL");
    expect(blrDel).toBeDefined();
    expect(blrDel?.fromCity).toBe("Bengaluru");
    expect(blrDel?.toCity).toBe("New Delhi");

    const nonExistent = getTopRouteBySlug("xyz-abc");
    expect(nonExistent).toBeUndefined();
  });
});
