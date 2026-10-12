import type { Airport, FlightOffer, FlightSearchQuery, FlightSearchResult } from "@/types/flight";
import { getAirportByIata, searchAirports } from "@/data/airports";
import { generateMockFlights } from "./mock-generator";
import type { FlightProvider } from "./types";

export class ProviderError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

export class MockProvider implements FlightProvider {
  readonly name = "mock";

  async searchFlights(query: FlightSearchQuery): Promise<FlightSearchResult> {
    const startTime = Date.now();

    const origin = getAirportByIata(query.from);
    if (!origin) {
      throw new ProviderError(
        "INVALID_ORIGIN",
        `Origin airport code "${query.from}" is not recognized in our database.`,
        404
      );
    }

    const destination = getAirportByIata(query.to);
    if (!destination) {
      throw new ProviderError(
        "INVALID_DESTINATION",
        `Destination airport code "${query.to}" is not recognized in our database.`,
        404
      );
    }

    const offers: FlightOffer[] = generateMockFlights(query, origin, destination);

    const prices = offers.map((o) => o.price.amount);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      searchId: `mock-search-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      query,
      count: offers.length,
      offers,
      meta: {
        provider: this.name,
        cached: false,
        durationMs: Date.now() - startTime,
        minPrice,
        maxPrice,
        currency: "INR",
      },
    };
  }

  async getAirports(query = "", limit = 10): Promise<Airport[]> {
    return searchAirports(query, limit);
  }
}
