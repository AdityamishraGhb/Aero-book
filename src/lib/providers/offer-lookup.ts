import type { FlightOffer, FlightSearchQuery } from "@/types/flight";
import { getAirportByIata } from "@/data/airports";
import { generateMockFlights } from "./mock-generator";

/**
 * Deterministically find an offer by its ID and search query parameters
 */
export function findOfferById(
  offerId: string,
  query: Partial<FlightSearchQuery> & { from: string; to: string; depart: string }
): FlightOffer | null {
  const fullQuery: FlightSearchQuery = {
    from: query.from,
    to: query.to,
    depart: query.depart,
    return: query.return,
    trip: query.trip || "oneway",
    adults: query.adults ?? 1,
    children: query.children ?? 0,
    infants: query.infants ?? 0,
    cabin: query.cabin || "economy",
    directOnly: query.directOnly ?? false,
    currency: query.currency || "INR",
    sort: query.sort || "best",
  };

  const origin = getAirportByIata(fullQuery.from);
  const dest = getAirportByIata(fullQuery.to);

  if (!origin || !dest) return null;

  const offers = generateMockFlights(fullQuery, origin, dest);
  const matched = offers.find((o) => o.id === offerId);

  // If specific ID not matched (e.g. out of range), return the first offer as fallback
  return matched || offers[0] || null;
}
