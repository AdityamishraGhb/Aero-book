"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  useQueryState,
  parseAsString,
  parseAsInteger,
  parseAsStringLiteral,
  parseAsBoolean,
} from "nuqs";
import type { FlightOffer, FlightSearchResult } from "@/types/flight";
import { StickySearchSummary } from "@/components/results/sticky-search-summary";
import { SortTabs } from "@/components/results/sort-tabs";
import { FlightCard } from "@/components/results/flight-card";
import { FlightCardSkeleton } from "@/components/results/flight-card-skeleton";
import {
  FiltersSidebar,
  type FilterState,
  type AvailableAirline,
} from "@/components/results/filters-sidebar";
import { MobileFiltersSheet } from "@/components/results/mobile-filters-sheet";
import { EmptyState } from "@/components/results/empty-state";
import { ErrorState } from "@/components/results/error-state";
import { getAirportByIata } from "@/data/airports";

// Format future date default helper
function getDefaultDepartDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function FlightResultsPage() {
  const params = useParams<{ route: string }>();
  const routeParam = params?.route || "DEL-BOM";

  // Parse origin and destination from route param (e.g. "DEL-BOM")
  const [rawFrom = "DEL", rawTo = "BOM"] = routeParam.toUpperCase().split("-");
  const from = rawFrom.length === 3 ? rawFrom : "DEL";
  const to = rawTo.length === 3 ? rawTo : "BOM";

  // URL state synchronization using nuqs
  const [depart] = useQueryState("depart", parseAsString.withDefault(getDefaultDepartDate()));
  const [returnDate] = useQueryState("return", parseAsString.withDefault(""));
  const [trip] = useQueryState(
    "trip",
    parseAsStringLiteral(["oneway", "roundtrip"] as const).withDefault("oneway")
  );
  const [adults] = useQueryState("adults", parseAsInteger.withDefault(1));
  const [childrenCount] = useQueryState("children", parseAsInteger.withDefault(0));
  const [infants] = useQueryState("infants", parseAsInteger.withDefault(0));
  const [cabin] = useQueryState(
    "cabin",
    parseAsStringLiteral(["economy", "premium-economy", "business", "first"] as const).withDefault(
      "economy"
    )
  );

  // Sorting
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(["best", "cheapest", "fastest"] as const).withDefault("best")
  );

  // Filters state in URL
  const [stops, setStops] = useQueryState(
    "stops",
    parseAsStringLiteral(["all", "0", "1"] as const).withDefault("all")
  );
  const [airlinesStr, setAirlinesStr] = useQueryState("airlines", parseAsString.withDefault(""));
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger);
  const [departureWindow, setDepartureWindow] = useQueryState(
    "window",
    parseAsStringLiteral(["all", "morning", "afternoon", "evening"] as const).withDefault("all")
  );
  const [directOnly] = useQueryState("directOnly", parseAsBoolean.withDefault(false));

  // Selected airlines array from comma-separated string
  const selectedAirlines = React.useMemo(() => {
    return airlinesStr ? airlinesStr.split(",").filter(Boolean) : [];
  }, [airlinesStr]);

  // Fetch flights using TanStack Query
  const searchUrl = `/api/flights/search?from=${from}&to=${to}&depart=${depart}&return=${returnDate}&trip=${trip}&adults=${adults}&children=${childrenCount}&infants=${infants}&cabin=${cabin}&directOnly=${directOnly}&sort=${sort}`;

  const { data, isLoading, isError, error, refetch } = useQuery<FlightSearchResult>({
    queryKey: [
      "flights",
      from,
      to,
      depart,
      returnDate,
      trip,
      adults,
      childrenCount,
      infants,
      cabin,
      directOnly,
    ],
    queryFn: async () => {
      const res = await fetch(searchUrl);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || "Failed to fetch flight offers");
      }
      return res.json();
    },
  });

  const rawOffers: FlightOffer[] = React.useMemo(
    () => data?.offers || [],
    [data?.offers]
  );

  // Extract min and max prices across all offers
  const minPricePossible = React.useMemo(() => {
    if (rawOffers.length === 0) return 0;
    return Math.min(...rawOffers.map((o) => o.price.amount));
  }, [rawOffers]);

  const maxPricePossible = React.useMemo(() => {
    if (rawOffers.length === 0) return 50000;
    return Math.max(...rawOffers.map((o) => o.price.amount));
  }, [rawOffers]);

  const minDurationMinutes = React.useMemo(() => {
    if (rawOffers.length === 0) return 0;
    return Math.min(...rawOffers.map((o) => o.slices[0].durationMinutes));
  }, [rawOffers]);

  const bestScore = React.useMemo(() => {
    if (rawOffers.length === 0) return 0;
    return Math.max(...rawOffers.map((o) => o.scoring.bestScore));
  }, [rawOffers]);

  // Available airlines checklist with counts and min fare
  const availableAirlines: AvailableAirline[] = React.useMemo(() => {
    const map = new Map<string, { name: string; count: number; minPrice: number }>();

    for (const offer of rawOffers) {
      const seg = offer.slices[0].segments[0];
      const code = seg.carrierCode;
      const existing = map.get(code);

      if (existing) {
        existing.count += 1;
        existing.minPrice = Math.min(existing.minPrice, offer.price.amount);
      } else {
        map.set(code, {
          name: seg.carrierName,
          count: 1,
          minPrice: offer.price.amount,
        });
      }
    }

    return Array.from(map.entries()).map(([code, item]) => ({
      code,
      name: item.name,
      count: item.count,
      minPrice: item.minPrice,
    }));
  }, [rawOffers]);

  // Client-side filtering & sorting
  const filteredAndSortedOffers = React.useMemo(() => {
    let list = [...rawOffers];

    // Filter 1: Stops
    if (stops === "0" || directOnly) {
      list = list.filter((o) => o.slices[0].stops === 0);
    } else if (stops === "1") {
      list = list.filter((o) => o.slices[0].stops <= 1);
    }

    // Filter 2: Airlines
    if (selectedAirlines.length > 0) {
      list = list.filter((o) => selectedAirlines.includes(o.slices[0].segments[0].carrierCode));
    }

    // Filter 3: Max Price
    if (maxPrice !== null && maxPrice !== undefined) {
      list = list.filter((o) => o.price.amount <= maxPrice);
    }

    // Filter 4: Departure Window
    if (departureWindow !== "all") {
      list = list.filter((o) => {
        const depIso = o.slices[0].departureTime;
        const hour = new Date(depIso).getUTCHours();

        if (departureWindow === "morning") {
          return hour >= 6 && hour < 12;
        } else if (departureWindow === "afternoon") {
          return hour >= 12 && hour < 18;
        } else if (departureWindow === "evening") {
          return hour >= 18 || hour < 6;
        }
        return true;
      });
    }

    // Sorting
    if (sort === "cheapest") {
      list.sort((a, b) => a.price.amount - b.price.amount);
    } else if (sort === "fastest") {
      list.sort((a, b) => a.slices[0].durationMinutes - b.slices[0].durationMinutes);
    } else {
      // Best composite score
      list.sort((a, b) => b.scoring.bestScore - a.scoring.bestScore);
    }

    return list;
  }, [rawOffers, stops, directOnly, selectedAirlines, maxPrice, departureWindow, sort]);

  // Filter state bundle
  const currentFilters: FilterState = {
    stops,
    selectedAirlines,
    departureWindow,
    maxPrice: maxPrice ?? undefined,
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setStops(newFilters.stops);
    setAirlinesStr(
      newFilters.selectedAirlines.length > 0 ? newFilters.selectedAirlines.join(",") : ""
    );
    setMaxPrice(newFilters.maxPrice ?? null);
    setDepartureWindow(newFilters.departureWindow);
  };

  const handleResetFilters = () => {
    setStops("all");
    setAirlinesStr("");
    setMaxPrice(null);
    setDepartureWindow("all");
  };

  const originAirport = getAirportByIata(from);
  const destAirport = getAirportByIata(to);

  return (
    <div className="flex-1 w-full bg-background min-h-screen pb-16">
      {/* 1. Sticky Editable Search Summary Header */}
      <StickySearchSummary
        from={from}
        to={to}
        depart={depart}
        returnDate={returnDate}
        trip={trip}
        adults={adults}
        childrenCount={childrenCount}
        infants={infants}
        cabin={cabin}
        directOnly={directOnly}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 2. Desktop Filters Sidebar (4 cols on lg) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-36">
            <FiltersSidebar
              filters={currentFilters}
              onFilterChange={handleFilterChange}
              availableAirlines={availableAirlines}
              minPricePossible={minPricePossible}
              maxPricePossible={maxPricePossible}
              onResetFilters={handleResetFilters}
            />
          </aside>

          {/* 3. Main Results Column (8 cols on lg) */}
          <main className="lg:col-span-8 space-y-6">
            {/* Sort Tabs */}
            <SortTabs
              currentSort={sort}
              onSortChange={setSort}
              minPrice={minPricePossible}
              minDurationMinutes={minDurationMinutes}
              bestScore={bestScore}
            />

            {/* Results Header Count & Active Route Summary */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <div>
                {!isLoading && !isError && (
                  <p>
                    Showing{" "}
                    <span className="font-bold text-foreground">
                      {filteredAndSortedOffers.length}
                    </span>{" "}
                    of {rawOffers.length} available flights from{" "}
                    <span className="font-semibold text-foreground">
                      {originAirport?.city || from}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-foreground">{destAirport?.city || to}</span>
                  </p>
                )}
              </div>

              {data?.meta?.cached && (
                <span className="inline-flex items-center gap-1 text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                  Instant Cache
                </span>
              )}
            </div>

            {/* Content: Skeletons, Error, Empty, or Cards list */}
            {isLoading ? (
              <div className="space-y-4">
                <FlightCardSkeleton />
                <FlightCardSkeleton />
                <FlightCardSkeleton />
              </div>
            ) : isError ? (
              <ErrorState
                message={
                  error instanceof Error
                    ? error.message
                    : "Unable to load flight offers. Please check your parameters and try again."
                }
                onRetry={() => refetch()}
              />
            ) : filteredAndSortedOffers.length === 0 ? (
              <EmptyState onResetFilters={handleResetFilters} />
            ) : (
              <div className="space-y-4">
                {filteredAndSortedOffers.map((offer, index) => (
                  <FlightCard
                    key={offer.id}
                    offer={offer}
                    isBestOffer={sort === "best" && index === 0}
                    isCheapestOffer={sort === "cheapest" && index === 0}
                    isFastestOffer={sort === "fastest" && index === 0}
                    onSelect={(selected) => {
                      // Simulates selection action
                      window.location.href = selected.bookingUrl;
                    }}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 4. Mobile Bottom Sheet for Filters */}
      <MobileFiltersSheet
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        availableAirlines={availableAirlines}
        minPricePossible={minPricePossible}
        maxPricePossible={maxPricePossible}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredAndSortedOffers.length}
      />
    </div>
  );
}
