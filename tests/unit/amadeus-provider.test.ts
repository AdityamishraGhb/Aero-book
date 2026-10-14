import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  AmadeusProvider,
  parseIsoDurationToMinutes,
  mapCabinToAmadeusClass,
} from "@/lib/providers/amadeus-provider";
import { ProviderError } from "@/lib/providers/mock-provider";
import type { FlightSearchQuery } from "@/types/flight";

describe("AmadeusProvider", () => {
  const originalFetch = global.fetch;

  const mockQuery: FlightSearchQuery = {
    from: "DEL",
    to: "BOM",
    depart: "2026-11-20",
    trip: "oneway",
    adults: 1,
    children: 0,
    infants: 0,
    cabin: "economy",
    directOnly: false,
    currency: "INR",
    sort: "best",
  };

  const sampleAmadeusResponse = {
    data: [
      {
        id: "1",
        numberOfBookableSeats: 7,
        itineraries: [
          {
            duration: "PT2H15M",
            segments: [
              {
                id: "seg-1",
                departure: {
                  iataCode: "DEL",
                  terminal: "3",
                  at: "2026-11-20T06:00:00",
                },
                arrival: {
                  iataCode: "BOM",
                  terminal: "2",
                  at: "2026-11-20T08:15:00",
                },
                carrierCode: "6E",
                number: "204",
                aircraft: { code: "321" },
                duration: "PT2H15M",
                numberOfStops: 0,
              },
            ],
          },
        ],
        price: {
          currency: "INR",
          total: "4299.00",
          base: "3600.00",
          grandTotal: "4299.00",
        },
        travelerPricings: [
          {
            travelerId: "1",
            fareDetailsBySegment: [
              {
                segmentId: "seg-1",
                includedCheckedBags: {
                  weight: 15,
                  weightUnit: "KG",
                },
              },
            ],
          },
        ],
      },
    ],
    dictionaries: {
      carriers: {
        "6E": "IndiGo",
      },
      aircraft: {
        "321": "Airbus A321neo",
      },
    },
    meta: {
      count: 1,
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("Utility Helpers", () => {
    it("parses ISO 8601 duration strings into total minutes", () => {
      expect(parseIsoDurationToMinutes("PT2H15M")).toBe(135);
      expect(parseIsoDurationToMinutes("PT45M")).toBe(45);
      expect(parseIsoDurationToMinutes("PT3H")).toBe(180);
      expect(parseIsoDurationToMinutes("PT1H30M")).toBe(90);
      expect(parseIsoDurationToMinutes(undefined)).toBe(120);
    });

    it("maps cabin to Amadeus travel class parameter correctly", () => {
      expect(mapCabinToAmadeusClass("economy")).toBe("ECONOMY");
      expect(mapCabinToAmadeusClass("premium-economy")).toBe("PREMIUM_ECONOMY");
      expect(mapCabinToAmadeusClass("business")).toBe("BUSINESS");
      expect(mapCabinToAmadeusClass("first")).toBe("FIRST");
    });
  });

  describe("Authentication", () => {
    it("throws 401 ProviderError if API credentials are missing", async () => {
      const provider = new AmadeusProvider({ apiKey: "", apiSecret: "" });

      await expect(provider.getAccessToken()).rejects.toThrowError(ProviderError);
      await expect(provider.getAccessToken()).rejects.toThrowError(
        /Amadeus API Key.*must be configured/
      );
    });

    it("fetches and caches OAuth2 token until expiry", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: "mock-amadeus-token-xyz",
          token_type: "Bearer",
          expires_in: 1799,
        }),
      });
      global.fetch = fetchMock;

      const provider = new AmadeusProvider({
        apiKey: "test-client-id",
        apiSecret: "test-client-secret",
      });

      const token1 = await provider.getAccessToken();
      expect(token1).toBe("mock-amadeus-token-xyz");
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // Subsequent call within expiry window returns cached token without fetch
      const token2 = await provider.getAccessToken();
      expect(token2).toBe("mock-amadeus-token-xyz");
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("searchFlights", () => {
    it("maps Amadeus flight offers response into normalized domain types", async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/security/oauth2/token")) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              access_token: "mock-amadeus-token",
              expires_in: 1800,
            }),
          });
        }
        if (url.includes("/shopping/flight-offers")) {
          return Promise.resolve({
            ok: true,
            json: async () => sampleAmadeusResponse,
          });
        }
        return Promise.reject(new Error(`Unhandled URL: ${url}`));
      });

      const provider = new AmadeusProvider({
        apiKey: "test-key",
        apiSecret: "test-secret",
      });

      const result = await provider.searchFlights(mockQuery);

      expect(result.count).toBe(1);
      expect(result.meta.provider).toBe("amadeus");
      expect(result.offers.length).toBe(1);

      const offer = result.offers[0];
      expect(offer.id).toBe("amadeus-1");
      expect(offer.provider).toBe("amadeus");
      expect(offer.price.amount).toBe(4299);
      expect(offer.price.currency).toBe("INR");
      expect(offer.price.baseFare).toBe(3600);
      expect(offer.price.taxes).toBe(699);

      // Slices & segments
      expect(offer.slices.length).toBe(1);
      const slice = offer.slices[0];
      expect(slice.durationMinutes).toBe(135);
      expect(slice.departureAirport).toBe("DEL");
      expect(slice.arrivalAirport).toBe("BOM");
      expect(slice.segments.length).toBe(1);

      const seg = slice.segments[0];
      expect(seg.carrierCode).toBe("6E");
      expect(seg.carrierName).toBe("IndiGo");
      expect(seg.flightNumber).toBe("6E-204");
      expect(seg.aircraft).toBe("Airbus A321neo");
      expect(seg.departureTerminal).toBe("3");
      expect(seg.arrivalTerminal).toBe("2");

      // Baggage
      expect(offer.baggage.cabin).toBe("7 kg included");
      expect(offer.baggage.checked).toBe("15 KG included");

      // Scoring & booking URL
      expect(offer.scoring.bestScore).toBeGreaterThanOrEqual(1);
      expect(offer.bookingUrl).toContain("/flights/DEL-BOM/amadeus-1");
    });

    it("translates Amadeus 429 rate limit error to typed ProviderError", async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/security/oauth2/token")) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              access_token: "mock-amadeus-token",
              expires_in: 1800,
            }),
          });
        }
        if (url.includes("/shopping/flight-offers")) {
          return Promise.resolve({
            ok: false,
            status: 429,
            json: async () => ({
              errors: [{ status: 429, title: "Rate Limit Exceeded" }],
            }),
          });
        }
        return Promise.reject(new Error(`Unhandled URL: ${url}`));
      });

      const provider = new AmadeusProvider({
        apiKey: "test-key",
        apiSecret: "test-secret",
      });

      await expect(provider.searchFlights(mockQuery)).rejects.toThrowError(ProviderError);
      await expect(provider.searchFlights(mockQuery)).rejects.toMatchObject({
        code: "PROVIDER_RATE_LIMIT",
        statusCode: 429,
      });
    });

    it("throws 404 ProviderError when origin airport is invalid", async () => {
      const provider = new AmadeusProvider({
        apiKey: "test-key",
        apiSecret: "test-secret",
      });

      await expect(provider.searchFlights({ ...mockQuery, from: "ZZZ" })).rejects.toMatchObject({
        code: "INVALID_ORIGIN",
        statusCode: 404,
      });
    });
  });

  describe("getAirports", () => {
    it("returns airports matching query string", async () => {
      const provider = new AmadeusProvider();
      const airports = await provider.getAirports("delhi", 5);

      expect(airports.length).toBeGreaterThan(0);
      expect(airports[0].iata).toBe("DEL");
    });
  });
});
