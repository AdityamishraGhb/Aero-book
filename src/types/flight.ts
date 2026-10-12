import { z } from "zod";

/**
 * Standard IATA Airport domain representation
 */
export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  timezone: string;
}

/**
 * Validated query parameters for flight search
 */
export const flightSearchQuerySchema = z
  .object({
    from: z
      .string()
      .trim()
      .length(3, "Origin must be a 3-letter IATA code")
      .transform((val) => val.toUpperCase()),
    to: z
      .string()
      .trim()
      .length(3, "Destination must be a 3-letter IATA code")
      .transform((val) => val.toUpperCase()),
    depart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Departure date must be YYYY-MM-DD"),
    return: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Return date must be YYYY-MM-DD")
      .optional()
      .or(z.literal("")),
    trip: z.enum(["oneway", "roundtrip"]).default("oneway"),
    adults: z.coerce.number().int().min(1).max(9).default(1),
    children: z.coerce.number().int().min(0).max(8).default(0),
    infants: z.coerce.number().int().min(0).max(4).default(0),
    cabin: z.enum(["economy", "premium-economy", "business", "first"]).default("economy"),
    directOnly: z
      .preprocess((val) => {
        if (typeof val === "string") return val === "true" || val === "1";
        return Boolean(val);
      }, z.boolean())
      .default(false),
    currency: z.string().default("INR"),
    sort: z.enum(["best", "cheapest", "fastest", "departure"]).default("best"),
  })
  .refine((data) => data.from !== data.to, {
    message: "Origin and destination airports must be different",
    path: ["to"],
  })
  .refine(
    (data) => {
      if (data.trip === "roundtrip" && data.return) {
        return data.return >= data.depart;
      }
      return true;
    },
    {
      message: "Return date cannot be earlier than departure date",
      path: ["return"],
    }
  );

export type FlightSearchQuery = z.infer<typeof flightSearchQuerySchema>;

/**
 * Single segment of a flight leg
 */
export interface FlightSegment {
  id: string;
  carrierCode: string;
  carrierName: string;
  flightNumber: string;
  aircraft: string;
  departureAirport: string;
  departureTerminal?: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTerminal?: string;
  arrivalTime: string;
  durationMinutes: number;
  layoverMinutes?: number;
  cabin: string;
}

/**
 * A slice/leg represents outbound or inbound journey
 */
export interface FlightSlice {
  durationMinutes: number;
  stops: number;
  departureAirport: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTime: string;
  segments: FlightSegment[];
}

/**
 * Normalized flight offer produced by providers
 */
export interface FlightOffer {
  id: string;
  provider: string;
  slices: FlightSlice[];
  price: {
    amount: number;
    currency: string;
    baseFare: number;
    taxes: number;
  };
  scoring: {
    bestScore: number;
    priceScore: number;
    durationScore: number;
  };
  cabin: string;
  seatsRemaining: number;
  baggage: {
    cabin: string;
    checked: string;
  };
  amenities: string[];
  bookingUrl: string;
}

/**
 * Search response returned from BFF search endpoints
 */
export interface FlightSearchResult {
  searchId: string;
  query: FlightSearchQuery;
  count: number;
  offers: FlightOffer[];
  meta: {
    provider: string;
    cached: boolean;
    durationMs: number;
    minPrice: number;
    maxPrice: number;
    currency: string;
  };
}

/**
 * Typed error schema for API endpoints
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
