import { describe, it, expect } from "vitest";
import { findOfferById } from "@/lib/providers/offer-lookup";

describe("findOfferById", () => {
  const baseQuery = {
    from: "DEL",
    to: "BOM",
    depart: "2026-11-20",
    trip: "oneway" as const,
    adults: 1,
    children: 0,
    infants: 0,
    cabin: "economy" as const,
  };

  it("finds offer by exact id", () => {
    const offer = findOfferById("offer-DELBOM-1", baseQuery);
    expect(offer).not.toBeNull();
    expect(offer?.id).toBe("offer-DELBOM-1");
    expect(offer?.slices[0].departureAirport).toBe("DEL");
    expect(offer?.slices[0].arrivalAirport).toBe("BOM");
    expect(offer?.price.amount).toBeGreaterThan(0);
    expect(offer?.baggage.cabin).toBeDefined();
  });

  it("returns fallback offer when offerId has different index within generated pool", () => {
    const offer = findOfferById("offer-DELBOM-3", baseQuery);
    expect(offer).not.toBeNull();
    expect(offer?.id).toBe("offer-DELBOM-3");
  });

  it("returns null or fallback when offer id is completely unrecognized", () => {
    const offer = findOfferById("invalid-id-xyz", baseQuery);
    // Even for arbitrary ID, deterministic generator provides the first valid offer for that route
    expect(offer).not.toBeNull();
    expect(offer?.slices[0].departureAirport).toBe("DEL");
    expect(offer?.slices[0].arrivalAirport).toBe("BOM");
  });
});
