import airportsRaw from "./airports.json";
import type { Airport } from "@/types/flight";

export const AIRPORTS: Airport[] = airportsRaw as Airport[];

export const AIRPORT_MAP = new Map<string, Airport>(
  AIRPORTS.map((airport) => [airport.iata.toUpperCase(), airport])
);

// Popular defaults when search query is empty or minimal
const POPULAR_DEFAULT_IATAS = [
  "DEL", // New Delhi
  "BOM", // Mumbai
  "BLR", // Bengaluru
  "GOI", // Goa
  "MAA", // Chennai
  "HYD", // Hyderabad
  "CCU", // Kolkata
  "COK", // Kochi
  "DXB", // Dubai
  "SIN", // Singapore
  "BKK", // Bangkok
  "LHR", // London
];

/**
 * Retrieve airport by its 3-letter IATA code.
 */
export function getAirportByIata(iata: string): Airport | undefined {
  if (!iata) return undefined;
  return AIRPORT_MAP.get(iata.trim().toUpperCase());
}

/**
 * Search airports by query string (IATA, City, Name) with ranked relevance.
 */
export function searchAirports(query = "", limit = 10): Airport[] {
  const q = query.trim().toLowerCase();

  // If empty query, return popular hubs
  if (!q) {
    const populars: Airport[] = [];
    for (const code of POPULAR_DEFAULT_IATAS) {
      const match = AIRPORT_MAP.get(code);
      if (match) populars.push(match);
      if (populars.length >= limit) break;
    }
    return populars;
  }

  // Scored matching
  type ScoredAirport = { airport: Airport; score: number };
  const scored: ScoredAirport[] = [];

  for (const airport of AIRPORTS) {
    const iata = airport.iata.toLowerCase();
    const city = airport.city.toLowerCase();
    const name = airport.name.toLowerCase();
    const country = airport.country.toLowerCase();

    let score = -1;

    // 1. Exact IATA match (highest score)
    if (iata === q) {
      score = 1000;
    }
    // 2. IATA prefix match (e.g. "de" -> DEL)
    else if (iata.startsWith(q)) {
      score = 800;
    }
    // 3. Exact city match
    else if (city === q) {
      score = 700;
    }
    // 4. City starts with query (e.g. "new" -> New Delhi)
    else if (city.startsWith(q)) {
      score = 600;
    }
    // 5. City contains query words
    else if (city.includes(q)) {
      score = 400;
    }
    // 6. Airport name starts with query
    else if (name.startsWith(q)) {
      score = 300;
    }
    // 7. Airport name contains query
    else if (name.includes(q)) {
      score = 200;
    }
    // 8. Country contains query
    else if (country.includes(q)) {
      score = 100;
    }

    if (score > 0) {
      // Prioritize Indian airports slightly if score is tied
      if (airport.countryCode === "IN") {
        score += 5;
      }
      scored.push({ airport, score });
    }
  }

  // Sort descending by score, tie-break by name
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.airport.city.localeCompare(b.airport.city);
  });

  return scored.slice(0, limit).map((s) => s.airport);
}
