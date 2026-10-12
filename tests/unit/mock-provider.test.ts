import { describe, it, expect } from "vitest";
import { MockProvider, ProviderError } from "@/lib/providers/mock-provider";
import type { FlightSearchQuery } from "@/types/flight";

describe("MockProvider", () => {
  const provider = new MockProvider();

  const baseQuery: FlightSearchQuery = {
    from: "DEL",
    to: "BOM",
    depart: "2026-11-15",
    trip: "oneway",
    adults: 1,
    children: 0,
    infants: 0,
    cabin: "economy",
    directOnly: false,
    currency: "INR",
    sort: "best",
  };

  it("identifies as mock provider", () => {
    expect(provider.name).toBe("mock");
  });

  it("produces deterministic flight offers for identical search parameters", async () => {
    const result1 = await provider.searchFlights(baseQuery);
    const result2 = await provider.searchFlights(baseQuery);

    expect(result1.count).toBe(result2.count);
    expect(result1.offers[0].id).toBe(result2.offers[0].id);
    expect(result1.offers[0].price.amount).toBe(result2.offers[0].price.amount);
    expect(result1.offers[0].slices[0].departureTime).toBe(
      result2.offers[0].slices[0].departureTime
    );
  });

  it("generates realistic domestic INR prices for Indian routes", async () => {
    const result = await provider.searchFlights(baseQuery);
    expect(result.offers.length).toBeGreaterThanOrEqual(5);

    for (const offer of result.offers) {
      expect(offer.price.currency).toBe("INR");
      // DEL-BOM fares are realistically between ₹3,000 and ₹18,000
      expect(offer.price.amount).toBeGreaterThan(2500);
      expect(offer.price.amount).toBeLessThan(25000);
      expect(offer.price.baseFare + offer.price.taxes).toBe(offer.price.amount);
    }
  });

  it("enforces directOnly filter to only return non-stop offers", async () => {
    const directQuery: FlightSearchQuery = {
      ...baseQuery,
      directOnly: true,
    };

    const result = await provider.searchFlights(directQuery);
    for (const offer of result.offers) {
      expect(offer.slices[0].stops).toBe(0);
      expect(offer.slices[0].segments.length).toBe(1);
    }
  });

  it("scales prices when upgrading cabin class", async () => {
    const economyResult = await provider.searchFlights(baseQuery);
    const businessResult = await provider.searchFlights({
      ...baseQuery,
      cabin: "business",
    });

    const economyMin = economyResult.meta.minPrice;
    const businessMin = businessResult.meta.minPrice;

    expect(businessMin).toBeGreaterThan(economyMin * 2);
  });

  it("scales total fare when adding passengers", async () => {
    const soloResult = await provider.searchFlights(baseQuery);
    const groupResult = await provider.searchFlights({
      ...baseQuery,
      adults: 3,
    });

    // 3 adults price should be roughly ~3x solo price
    expect(groupResult.offers[0].price.amount).toBeGreaterThan(
      soloResult.offers[0].price.amount * 2.5
    );
  });

  it("creates two slices for round-trip flights", async () => {
    const roundtripQuery: FlightSearchQuery = {
      ...baseQuery,
      trip: "roundtrip",
      return: "2026-11-20",
    };

    const result = await provider.searchFlights(roundtripQuery);
    expect(result.offers.length).toBeGreaterThan(0);

    const firstOffer = result.offers[0];
    expect(firstOffer.slices.length).toBe(2);
    expect(firstOffer.slices[0].departureAirport).toBe("DEL");
    expect(firstOffer.slices[0].arrivalAirport).toBe("BOM");
    expect(firstOffer.slices[1].departureAirport).toBe("BOM");
    expect(firstOffer.slices[1].arrivalAirport).toBe("DEL");
  });

  it("throws ProviderError with 404 status for unrecognized airport", async () => {
    const invalidQuery: FlightSearchQuery = {
      ...baseQuery,
      from: "ZZZ",
    };

    await expect(provider.searchFlights(invalidQuery)).rejects.toThrow(ProviderError);
    try {
      await provider.searchFlights(invalidQuery);
    } catch (err) {
      expect(err).toBeInstanceOf(ProviderError);
      expect((err as ProviderError).statusCode).toBe(404);
      expect((err as ProviderError).code).toBe("INVALID_ORIGIN");
    }
  });
});
