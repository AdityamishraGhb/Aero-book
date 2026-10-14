import { z } from "zod";
import type {
  Airport,
  FlightOffer,
  FlightSearchQuery,
  FlightSearchResult,
  FlightSegment,
  FlightSlice,
} from "@/types/flight";
import { getAirportByIata, searchAirports } from "@/data/airports";
import { env } from "@/lib/env";
import { ProviderError } from "./mock-provider";
import type { FlightProvider } from "./types";

// ==============================================================================
// Amadeus Self-Service API Zod Validation Schemas
// ==============================================================================

export const amadeusTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().optional(),
  expires_in: z.number(),
});

export const amadeusSegmentSchema = z.object({
  id: z.string().optional(),
  departure: z.object({
    iataCode: z.string(),
    terminal: z.string().optional(),
    at: z.string(),
  }),
  arrival: z.object({
    iataCode: z.string(),
    terminal: z.string().optional(),
    at: z.string(),
  }),
  carrierCode: z.string(),
  number: z.string(),
  aircraft: z
    .object({
      code: z.string().optional(),
    })
    .optional(),
  duration: z.string().optional(),
  numberOfStops: z.number().optional().default(0),
});

export const amadeusItinerarySchema = z.object({
  duration: z.string().optional(),
  segments: z.array(amadeusSegmentSchema),
});

export const amadeusFlightOfferSchema = z.object({
  id: z.string(),
  source: z.string().optional(),
  instantTicketingRequired: z.boolean().optional(),
  nonHomogeneous: z.boolean().optional(),
  oneWay: z.boolean().optional(),
  lastTicketingDate: z.string().optional(),
  numberOfBookableSeats: z.number().optional().default(9),
  itineraries: z.array(amadeusItinerarySchema),
  price: z.object({
    currency: z.string(),
    total: z.string(),
    base: z.string().optional(),
    grandTotal: z.string().optional(),
  }),
  pricingOptions: z
    .object({
      fareType: z.array(z.string()).optional(),
      includedCheckedBagsOnly: z.boolean().optional(),
    })
    .optional(),
  validatingAirlineCodes: z.array(z.string()).optional(),
  travelerPricings: z
    .array(
      z.object({
        travelerId: z.string().optional(),
        fareOption: z.string().optional(),
        travelerType: z.string().optional(),
        price: z
          .object({
            currency: z.string().optional(),
            total: z.string().optional(),
            base: z.string().optional(),
          })
          .optional(),
        fareDetailsBySegment: z
          .array(
            z.object({
              segmentId: z.string().optional(),
              cabin: z.string().optional(),
              fareBasis: z.string().optional(),
              class: z.string().optional(),
              includedCheckedBags: z
                .object({
                  quantity: z.number().optional(),
                  weight: z.number().optional(),
                  weightUnit: z.string().optional(),
                })
                .optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export const amadeusSearchResponseSchema = z.object({
  data: z.array(amadeusFlightOfferSchema),
  dictionaries: z
    .object({
      carriers: z.record(z.string(), z.string()).optional(),
      aircraft: z.record(z.string(), z.string()).optional(),
      currencies: z.record(z.string(), z.string()).optional(),
      locations: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
  meta: z
    .object({
      count: z.number().optional(),
    })
    .optional(),
  errors: z
    .array(
      z.object({
        status: z.number().optional(),
        code: z.union([z.number(), z.string()]).optional(),
        title: z.string().optional(),
        detail: z.string().optional(),
      })
    )
    .optional(),
});

export type AmadeusSearchResponse = z.infer<typeof amadeusSearchResponseSchema>;

// ==============================================================================
// Utility Helpers
// ==============================================================================

/**
 * Parses ISO 8601 duration string (e.g. "PT2H15M", "PT45M", "PT1H") into total minutes
 */
export function parseIsoDurationToMinutes(durationStr?: string): number {
  if (!durationStr) return 120; // default 2 hours if missing

  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
  const match = durationStr.match(regex);
  if (!match) return 120;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);

  return hours * 60 + minutes;
}

/**
 * Maps AeroBook cabin type to Amadeus travel class parameter
 */
export function mapCabinToAmadeusClass(
  cabin: FlightSearchQuery["cabin"]
): "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST" {
  switch (cabin) {
    case "premium-economy":
      return "PREMIUM_ECONOMY";
    case "business":
      return "BUSINESS";
    case "first":
      return "FIRST";
    case "economy":
    default:
      return "ECONOMY";
  }
}

const COMMON_AIRLINES: Record<string, string> = {
  "6E": "IndiGo",
  AI: "Air India",
  UK: "Vistara",
  SG: "SpiceJet",
  QP: "Akasa Air",
  EK: "Emirates",
  QR: "Qatar Airways",
  SQ: "Singapore Airlines",
  BA: "British Airways",
  LH: "Lufthansa",
};

const COMMON_AIRCRAFT: Record<string, string> = {
  "320": "Airbus A320neo",
  "321": "Airbus A321neo",
  "738": "Boeing 737-800",
  "788": "Boeing 787-8 Dreamliner",
  "789": "Boeing 787-9 Dreamliner",
  "77W": "Boeing 777-300ER",
  "359": "Airbus A350-900",
};

// ==============================================================================
// Amadeus Flight Provider Adapter
// ==============================================================================

export class AmadeusProvider implements FlightProvider {
  readonly name = "amadeus";

  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  private cachedToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor(options?: { apiKey?: string; apiSecret?: string; baseUrl?: string }) {
    this.apiKey = options?.apiKey || env.PROVIDER_API_KEY;
    this.apiSecret = options?.apiSecret || env.PROVIDER_API_SECRET;
    this.baseUrl =
      options?.baseUrl ||
      (env.NODE_ENV === "production" ? "https://api.amadeus.com" : "https://test.api.amadeus.com");
  }

  /**
   * Acquire or return cached OAuth2 access token
   */
  async getAccessToken(): Promise<string> {
    const now = Date.now();
    // Return cached token if valid for at least 60 seconds more
    if (this.cachedToken && now < this.tokenExpiresAt - 60000) {
      return this.cachedToken;
    }

    if (!this.apiKey || !this.apiSecret) {
      throw new ProviderError(
        "PROVIDER_AUTH_ERROR",
        "Amadeus API Key (PROVIDER_API_KEY) and Secret (PROVIDER_API_SECRET) must be configured in environment variables.",
        401
      );
    }

    const tokenUrl = `${this.baseUrl}/v1/security/oauth2/token`;
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.apiKey,
      client_secret: this.apiSecret,
    });

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ProviderError(
          "PROVIDER_AUTH_ERROR",
          `Failed to authenticate with Amadeus API (HTTP ${response.status}): ${errorText}`,
          response.status === 401 ? 401 : 502
        );
      }

      const json = await response.json();
      const parseResult = amadeusTokenResponseSchema.safeParse(json);

      if (!parseResult.success) {
        throw new ProviderError(
          "MALFORMED_AUTH_RESPONSE",
          "Received an unexpected OAuth token format from Amadeus API.",
          502
        );
      }

      this.cachedToken = parseResult.data.access_token;
      this.tokenExpiresAt = Date.now() + parseResult.data.expires_in * 1000;

      return this.cachedToken;
    } catch (err) {
      if (err instanceof ProviderError) throw err;
      throw new ProviderError(
        "NETWORK_ERROR",
        `Could not reach Amadeus authentication endpoint: ${err instanceof Error ? err.message : String(err)}`,
        504
      );
    }
  }

  /**
   * Execute flight search using Amadeus Flight Offers Search v2 API
   */
  async searchFlights(query: FlightSearchQuery): Promise<FlightSearchResult> {
    const startTime = Date.now();

    const origin = getAirportByIata(query.from);
    if (!origin) {
      throw new ProviderError(
        "INVALID_ORIGIN",
        `Origin airport code "${query.from}" is not recognized in our airport registry.`,
        404
      );
    }

    const destination = getAirportByIata(query.to);
    if (!destination) {
      throw new ProviderError(
        "INVALID_DESTINATION",
        `Destination airport code "${query.to}" is not recognized in our airport registry.`,
        404
      );
    }

    const token = await this.getAccessToken();

    // Construct Amadeus v2 query parameters
    const searchParams = new URLSearchParams({
      originLocationCode: query.from,
      destinationLocationCode: query.to,
      departureDate: query.depart,
      adults: String(query.adults),
      travelClass: mapCabinToAmadeusClass(query.cabin),
      currencyCode: query.currency || "INR",
      max: "50",
    });

    if (query.trip === "roundtrip" && query.return) {
      searchParams.set("returnDate", query.return);
    }

    if (query.children > 0) {
      searchParams.set("children", String(query.children));
    }

    if (query.infants > 0) {
      searchParams.set("infants", String(query.infants));
    }

    if (query.directOnly) {
      searchParams.set("nonStop", "true");
    }

    const searchUrl = `${this.baseUrl}/v2/shopping/flight-offers?${searchParams.toString()}`;

    let response: Response;
    try {
      response = await fetch(searchUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(15000),
      });
    } catch (err) {
      throw new ProviderError(
        "NETWORK_ERROR",
        `Timeout or network failure connecting to Amadeus Flight Search: ${err instanceof Error ? err.message : String(err)}`,
        504
      );
    }

    // Handle Amadeus HTTP error codes
    if (!response.ok) {
      let errBody: { errors?: Array<{ title?: string; detail?: string }> } | null = null;
      try {
        errBody = (await response.json()) as {
          errors?: Array<{ title?: string; detail?: string }>;
        };
      } catch {
        // Ignore JSON parse failure
      }

      const firstError = errBody?.errors?.[0];
      const errorMessage =
        firstError?.detail ||
        firstError?.title ||
        `Amadeus Flight Search failed (HTTP ${response.status})`;

      if (response.status === 400) {
        throw new ProviderError("INVALID_QUERY", errorMessage, 400);
      }
      if (response.status === 401) {
        // Invalidate cached token for next retry
        this.cachedToken = null;
        throw new ProviderError("PROVIDER_AUTH_ERROR", errorMessage, 401);
      }
      if (response.status === 429) {
        throw new ProviderError(
          "PROVIDER_RATE_LIMIT",
          "Amadeus API request limit exceeded. Please try again shortly.",
          429
        );
      }

      throw new ProviderError("PROVIDER_DOWNSTREAM_ERROR", errorMessage, 502);
    }

    const rawJson = await response.json();
    const parseResult = amadeusSearchResponseSchema.safeParse(rawJson);

    if (!parseResult.success) {
      throw new ProviderError(
        "MALFORMED_PROVIDER_RESPONSE",
        "Amadeus returned a payload that does not match the expected flight offers schema.",
        502
      );
    }

    const { data: rawOffers, dictionaries } = parseResult.data;
    const carrierDict = dictionaries?.carriers || {};
    const aircraftDict = dictionaries?.aircraft || {};

    // Map Amadeus Flight Offers into AeroBook Domain FlightOffers
    const offers: FlightOffer[] = rawOffers.map((rawOffer) => {
      const slices: FlightSlice[] = rawOffer.itineraries.map((itinerary) => {
        const segments: FlightSegment[] = itinerary.segments.map((seg, segIdx) => {
          const carrierName =
            carrierDict[seg.carrierCode] || COMMON_AIRLINES[seg.carrierCode] || seg.carrierCode;
          const aircraftCode = seg.aircraft?.code || "";
          const aircraftName =
            aircraftDict[aircraftCode] ||
            COMMON_AIRCRAFT[aircraftCode] ||
            (aircraftCode ? `Boeing/Airbus (${aircraftCode})` : "Commercial Jet");

          const durationMinutes = parseIsoDurationToMinutes(seg.duration);

          // Calculate layover to next segment if present
          let layoverMinutes: number | undefined;
          if (segIdx < itinerary.segments.length - 1) {
            const nextSeg = itinerary.segments[segIdx + 1];
            const arr = new Date(seg.arrival.at).getTime();
            const dep = new Date(nextSeg.departure.at).getTime();
            if (dep > arr) {
              layoverMinutes = Math.round((dep - arr) / 60000);
            }
          }

          return {
            id: `seg-${rawOffer.id}-${segIdx}`,
            carrierCode: seg.carrierCode,
            carrierName,
            flightNumber: `${seg.carrierCode}-${seg.number}`,
            aircraft: aircraftName,
            departureAirport: seg.departure.iataCode,
            departureTerminal: seg.departure.terminal,
            departureTime: seg.departure.at,
            arrivalAirport: seg.arrival.iataCode,
            arrivalTerminal: seg.arrival.terminal,
            arrivalTime: seg.arrival.at,
            durationMinutes,
            layoverMinutes,
            cabin: query.cabin,
          };
        });

        const totalSliceDuration = parseIsoDurationToMinutes(itinerary.duration);
        const stops = Math.max(0, segments.length - 1);

        return {
          durationMinutes: totalSliceDuration,
          stops,
          departureAirport: segments[0].departureAirport,
          departureTime: segments[0].departureTime,
          arrivalAirport: segments[segments.length - 1].arrivalAirport,
          arrivalTime: segments[segments.length - 1].arrivalTime,
          segments,
        };
      });

      // Price breakdown
      const totalAmount = Math.round(
        parseFloat(rawOffer.price.grandTotal || rawOffer.price.total || "0")
      );
      const baseFare = rawOffer.price.base
        ? Math.round(parseFloat(rawOffer.price.base))
        : Math.round(totalAmount * 0.82);
      const taxes = Math.max(0, totalAmount - baseFare);

      // Baggage policy extraction
      let checkedBaggage = "15 kg included";
      const travelerPricing = rawOffer.travelerPricings?.[0];
      const bagDetails = travelerPricing?.fareDetailsBySegment?.[0]?.includedCheckedBags;
      if (bagDetails) {
        if (bagDetails.weight) {
          checkedBaggage = `${bagDetails.weight} ${bagDetails.weightUnit || "KG"} included`;
        } else if (bagDetails.quantity !== undefined) {
          checkedBaggage =
            bagDetails.quantity === 0 ? "Not included" : `${bagDetails.quantity} piece(s) included`;
        }
      }

      // Amenities
      const amenities: string[] = ["Free check-in", "Standard seat selection"];
      if (query.cabin === "business" || query.cabin === "first") {
        amenities.push("Lounge access", "Priority boarding", "Gourmet meal");
      } else if (query.cabin === "premium-economy") {
        amenities.push("Extra legroom", "Complimentary snack");
      }

      return {
        id: `amadeus-${rawOffer.id}`,
        provider: "amadeus",
        slices,
        price: {
          amount: totalAmount,
          currency: rawOffer.price.currency || query.currency || "INR",
          baseFare,
          taxes,
        },
        scoring: {
          bestScore: 8.5,
          priceScore: 8.5,
          durationScore: 8.5,
        },
        cabin: query.cabin,
        seatsRemaining: rawOffer.numberOfBookableSeats ?? 9,
        baggage: {
          cabin: "7 kg included",
          checked: checkedBaggage,
        },
        amenities,
        bookingUrl: `/flights/${query.from}-${query.to}/amadeus-${rawOffer.id}?depart=${query.depart}&trip=${query.trip}&adults=${query.adults}&cabin=${query.cabin}`,
      };
    });

    // Score offers relative to the dataset
    if (offers.length > 0) {
      const prices = offers.map((o) => o.price.amount);
      const durations = offers.map((o) => o.slices[0].durationMinutes);

      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);

      const priceDelta = maxPrice - minPrice || 1;
      const durationDelta = maxDuration - minDuration || 1;

      for (const offer of offers) {
        const priceRatio = 1 - (offer.price.amount - minPrice) / priceDelta;
        const durationRatio = 1 - (offer.slices[0].durationMinutes - minDuration) / durationDelta;

        const priceScore = Math.max(1, Math.min(10, Math.round((5 + priceRatio * 5) * 10) / 10));
        const durationScore = Math.max(
          1,
          Math.min(10, Math.round((5 + durationRatio * 5) * 10) / 10)
        );
        const stopsPenalty = offer.slices[0].stops * 1.2;

        const bestScore = Math.max(
          1,
          Math.min(
            10,
            Math.round((priceScore * 0.55 + durationScore * 0.45 - stopsPenalty) * 10) / 10
          )
        );

        offer.scoring = {
          bestScore,
          priceScore,
          durationScore,
        };
      }

      // Sort based on requested sort
      if (query.sort === "cheapest") {
        offers.sort((a, b) => a.price.amount - b.price.amount);
      } else if (query.sort === "fastest") {
        offers.sort((a, b) => a.slices[0].durationMinutes - b.slices[0].durationMinutes);
      } else {
        offers.sort((a, b) => b.scoring.bestScore - a.scoring.bestScore);
      }
    }

    const prices = offers.map((o) => o.price.amount);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      searchId: `amadeus-search-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      query,
      count: offers.length,
      offers,
      meta: {
        provider: this.name,
        cached: false,
        durationMs: Date.now() - startTime,
        minPrice,
        maxPrice,
        currency: query.currency || "INR",
      },
    };
  }

  /**
   * Search airports using local comprehensive dataset or Amadeus location reference API
   */
  async getAirports(query = "", limit = 10): Promise<Airport[]> {
    return searchAirports(query, limit);
  }
}
