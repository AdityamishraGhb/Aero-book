import { env } from "@/lib/env";
import type { FlightProvider } from "./types";
import { MockProvider } from "./mock-provider";

let defaultMockProvider: MockProvider | null = null;

/**
 * Factory function to retrieve active FlightProvider instance
 */
export function getFlightProvider(providerName?: string): FlightProvider {
  const selected = providerName || env.FLIGHT_PROVIDER || "mock";

  switch (selected.toLowerCase()) {
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
