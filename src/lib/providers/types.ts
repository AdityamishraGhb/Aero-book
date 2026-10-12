import type { Airport, FlightSearchQuery, FlightSearchResult } from "@/types/flight";

/**
 * Universal Flight Provider interface implemented by MockProvider and live GDS/NDC adapters (Amadeus, Duffel).
 */
export interface FlightProvider {
  /**
   * Unique identifier of provider
   */
  readonly name: string;

  /**
   * Execute flight search query and return normalized results
   */
  searchFlights(query: FlightSearchQuery): Promise<FlightSearchResult>;

  /**
   * Search airports / hubs supported by provider
   */
  getAirports(query?: string, limit?: number): Promise<Airport[]>;
}
