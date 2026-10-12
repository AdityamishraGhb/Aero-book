import type { FlightSearchQuery } from "@/types/flight";

export interface SearchUrlParams {
  from: string;
  to: string;
  depart: string;
  return?: string;
  trip?: "oneway" | "roundtrip";
  adults?: number;
  children?: number;
  infants?: number;
  cabin?: "economy" | "premium-economy" | "business" | "first";
  directOnly?: boolean;
  currency?: string;
  sort?: "best" | "cheapest" | "fastest" | "departure";
}

/**
 * Builds canonical search URL in format:
 * /flights/{ORIGIN}-{DEST}?depart=YYYY-MM-DD&...
 */
export function buildSearchUrl(params: SearchUrlParams): string {
  const origin = params.from.trim().toUpperCase();
  const dest = params.to.trim().toUpperCase();

  const queryParams = new URLSearchParams();

  if (params.depart) {
    queryParams.set("depart", params.depart);
  }

  const trip = params.trip || "oneway";
  queryParams.set("trip", trip);

  if (trip === "roundtrip" && params.return) {
    queryParams.set("return", params.return);
  }

  if (params.adults && params.adults > 1) {
    queryParams.set("adults", String(params.adults));
  } else {
    queryParams.set("adults", "1");
  }

  if (params.children && params.children > 0) {
    queryParams.set("children", String(params.children));
  }

  if (params.infants && params.infants > 0) {
    queryParams.set("infants", String(params.infants));
  }

  if (params.cabin && params.cabin !== "economy") {
    queryParams.set("cabin", params.cabin);
  } else {
    queryParams.set("cabin", "economy");
  }

  if (params.directOnly) {
    queryParams.set("directOnly", "true");
  }

  if (params.currency && params.currency !== "INR") {
    queryParams.set("currency", params.currency);
  }

  if (params.sort && params.sort !== "best") {
    queryParams.set("sort", params.sort);
  }

  return `/flights/${origin}-${dest}?${queryParams.toString()}`;
}

/**
 * Parses search URL path and query parameters into strongly typed search parameters
 */
export function parseSearchUrl(
  pathname: string,
  searchParams: URLSearchParams
): Partial<FlightSearchQuery> {
  const match = pathname.match(/\/flights\/([A-Za-z]{3})-([A-Za-z]{3})/i);
  const from = match ? match[1].toUpperCase() : undefined;
  const to = match ? match[2].toUpperCase() : undefined;

  const depart = searchParams.get("depart") || undefined;
  const returnDate = searchParams.get("return") || undefined;
  const trip = (searchParams.get("trip") as "oneway" | "roundtrip") || "oneway";

  const adults = Number(searchParams.get("adults")) || 1;
  const children = Number(searchParams.get("children")) || 0;
  const infants = Number(searchParams.get("infants")) || 0;

  const cabin =
    (searchParams.get("cabin") as "economy" | "premium-economy" | "business" | "first") ||
    "economy";

  const directOnly = searchParams.get("directOnly") === "true";
  const currency = searchParams.get("currency") || "INR";
  const sort =
    (searchParams.get("sort") as "best" | "cheapest" | "fastest" | "departure") || "best";

  return {
    from,
    to,
    depart,
    return: returnDate,
    trip,
    adults,
    children,
    infants,
    cabin,
    directOnly,
    currency,
    sort,
  };
}
