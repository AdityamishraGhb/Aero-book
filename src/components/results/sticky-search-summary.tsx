"use client";

import * as React from "react";
import { Plane, Calendar, Users, SlidersHorizontal, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAirportByIata } from "@/data/airports";
import { formatDate } from "@/lib/format";
import { FlightSearchForm } from "@/components/search/flight-search-form";

interface StickySearchSummaryProps {
  from: string;
  to: string;
  depart: string;
  returnDate?: string;
  trip: "oneway" | "roundtrip";
  adults: number;
  childrenCount: number;
  infants: number;
  cabin: "economy" | "premium-economy" | "business" | "first";
  directOnly: boolean;
}

export function StickySearchSummary({
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
}: StickySearchSummaryProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const originAirport = getAirportByIata(from);
  const destinationAirport = getAirportByIata(to);

  const totalTravellers = adults + childrenCount + infants;
  const cabinLabel =
    {
      economy: "Economy",
      "premium-economy": "Premium Economy",
      business: "Business",
      first: "First Class",
    }[cabin] || "Economy";

  return (
    <div className="sticky top-16 z-30 w-full border-b border-border bg-card/95 backdrop-blur-md transition-all shadow-soft-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Origin -> Destination & Metadata Pills */}
          <div className="flex items-center gap-3 sm:gap-6 overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Plane className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-base sm:text-lg font-extrabold text-foreground">
                    {originAirport ? originAirport.city : from}
                  </span>
                  <span className="font-mono text-xs font-bold text-primary">({from})</span>
                  <span className="text-muted-foreground text-sm font-semibold">→</span>
                  <span className="font-heading text-base sm:text-lg font-extrabold text-foreground">
                    {destinationAirport ? destinationAirport.city : to}
                  </span>
                  <span className="font-mono text-xs font-bold text-primary">({to})</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="capitalize">
                    {trip === "roundtrip" ? "Round-trip" : "One-way"}
                  </span>
                  <span>•</span>
                  <span>{directOnly ? "Direct flights only" : "All flight routes"}</span>
                </div>
              </div>
            </div>

            {/* Date & Travellers Highlights */}
            <div className="hidden md:flex items-center gap-4 border-l border-border/80 pl-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium text-foreground">
                  {depart ? formatDate(depart, "medium") : "Date pending"}
                  {trip === "roundtrip" && returnDate
                    ? ` – ${formatDate(returnDate, "medium")}`
                    : ""}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium text-foreground">
                  {totalTravellers} {totalTravellers === 1 ? "Traveller" : "Travellers"},{" "}
                  {cabinLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Toggle Edit Search button */}
          <Button
            variant={isEditing ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2 text-xs font-semibold h-9 px-3.5"
            aria-expanded={isEditing}
          >
            {isEditing ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Close Editor</span>
              </>
            ) : (
              <>
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                <span>Edit Search</span>
              </>
            )}
          </Button>
        </div>

        {/* Inline Collapsible Search Form Drawer */}
        {isEditing && (
          <div className="mt-4 pt-4 border-t border-border animate-in fade-in-50 duration-200">
            <FlightSearchForm
              initialValues={{
                from,
                to,
                depart,
                return: returnDate,
                trip,
                adults,
                children: childrenCount,
                infants,
                cabin,
                directOnly,
              }}
              className="border-0 shadow-none p-0 bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}
