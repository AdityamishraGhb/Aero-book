import { env } from "@/lib/env";
import type { FlightProvider } from "./types";
import { MockProvider } from "./mock-provider";
import { AmadeusProvider } from "./amadeus-provider";

let defaultMockProvider: MockProvider | null = null;
let defaultAmadeusProvider: AmadeusProvider | null = null;

/**
 * Factory function to retrieve active FlightProvider instance.
 * Defaults to MockProvider for local dev and tests.
 */
export function getFlightProvider(providerName?: string): FlightProvider {
  const selected = providerName || env.FLIGHT_PROVIDER || "mock";

  switch (selected.toLowerCase()) {
    case "amadeus":
      if (!defaultAmadeusProvider) {
        defaultAmadeusProvider = new AmadeusProvider();
      }
      return defaultAmadeusProvider;

    case "mock":
    default:
      if (!defaultMockProvider) {
        defaultMockProvider = new MockProvider();
      }
      return defaultMockProvider;
  }
}

export * from "./types";
export * from "./mock-provider";
export * from "./mock-generator";
export * from "./amadeus-provider";
