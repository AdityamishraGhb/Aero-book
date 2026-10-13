"use client";

import * as React from "react";
import { Plane, Luggage, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { FlightOffer, FlightSlice } from "@/types/flight";
import { formatCurrency, formatDuration, formatTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FlightCardProps {
  offer: FlightOffer;
  isBestOffer?: boolean;
  isCheapestOffer?: boolean;
  isFastestOffer?: boolean;
  onSelect?: (offer: FlightOffer) => void;
}

function SliceRow({ slice, label }: { slice: FlightSlice; label?: string }) {
  const firstSegment = slice.segments[0];
  const lastSegment = slice.segments[slice.segments.length - 1];

  return (
    <div className="space-y-2 py-2">
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
          {label}
        </span>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Carrier Info */}
        <div className="flex items-center gap-3 min-w-[140px]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-heading font-extrabold text-xs shadow-xs">
            {firstSegment.carrierCode}
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-foreground">
              {firstSegment.carrierName}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {firstSegment.flightNumber} • {firstSegment.aircraft}
            </p>
          </div>
        </div>

        {/* Flight Times & Journey Duration Timeline */}
        <div className="flex items-center gap-4 flex-1 max-w-lg">
          {/* Departure */}
          <div>
            <span className="font-heading text-lg sm:text-xl font-bold text-foreground">
              {formatTime(slice.departureTime)}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xs font-semibold text-primary">
                {slice.departureAirport}
              </span>
              {firstSegment.departureTerminal && (
                <span className="text-[10px] text-muted-foreground">
                  ({firstSegment.departureTerminal})
                </span>
              )}
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[11px] font-medium text-muted-foreground mb-1">
              {formatDuration(slice.durationMinutes)}
            </span>
            <div className="w-full flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <div className="h-0.5 flex-1 bg-border relative">
                <Plane className="h-3.5 w-3.5 text-primary absolute left-1/2 -top-1.5 -translate-x-1/2" />
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium mt-1">
              {slice.stops === 0 ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  Non-stop
                </span>
              ) : (
                <span>
                  1 stop via {slice.segments[0].arrivalAirport}
                  {slice.segments[0].layoverMinutes
                    ? ` (${formatDuration(slice.segments[0].layoverMinutes)})`
                    : ""}
                </span>
              )}
            </span>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <span className="font-heading text-lg sm:text-xl font-bold text-foreground">
              {formatTime(slice.arrivalTime)}
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="font-mono text-xs font-semibold text-primary">
                {slice.arrivalAirport}
              </span>
              {lastSegment.arrivalTerminal && (
                <span className="text-[10px] text-muted-foreground">
                  ({lastSegment.arrivalTerminal})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlightCard({
  offer,
  isBestOffer,
  isCheapestOffer,
  isFastestOffer,
  onSelect,
}: FlightCardProps) {
  const isRoundTrip = offer.slices.length > 1;

  return (
    <div
      data-slot="flight-card"
      className={cn(
        "group relative rounded-2xl border bg-card p-5 sm:p-6 shadow-xs transition-all hover:border-primary/50 hover:shadow-soft-md",
        isBestOffer ? "border-accent/40 bg-accent/[0.01]" : "border-border"
      )}
    >
      {/* Top Badges: Best / Cheapest / Fastest */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {isBestOffer && (
          <Badge variant="accent" className="gap-1 text-[11px] font-bold shadow-xs">
            <Sparkles className="h-3 w-3" />
            <span>Best Value • Score {offer.scoring.bestScore}/10</span>
          </Badge>
        )}
        {isCheapestOffer && (
          <Badge variant="success" className="gap-1 text-[11px] font-bold">
            <CheckCircle2 className="h-3 w-3" />
            <span>Cheapest Fare</span>
          </Badge>
        )}
        {isFastestOffer && (
          <Badge variant="default" className="gap-1 text-[11px] font-bold">
            <span>Fastest Option</span>
          </Badge>
        )}
        <span className="text-[11px] text-muted-foreground ml-auto font-mono">
          {offer.seatsRemaining} seats left
        </span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Slices list */}
        <div className="flex-1 divide-y divide-border/60">
          <SliceRow slice={offer.slices[0]} label={isRoundTrip ? "Outbound Flight" : undefined} />
          {isRoundTrip && <SliceRow slice={offer.slices[1]} label="Return Flight" />}
        </div>

        {/* Price column & CTA */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-border/80 pt-4 lg:pt-0 lg:pl-6 shrink-0 min-w-[170px]">
          <div className="lg:text-right">
            <div className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
              {formatCurrency(offer.price.amount, offer.price.currency)}
            </div>
            <p className="text-[11px] text-muted-foreground">Total incl. taxes & fees</p>
          </div>

          <Button
            variant="accent"
            size="default"
            onClick={() => onSelect?.(offer)}
            className="h-10 px-5 text-xs font-bold gap-1.5 shadow-xs group-hover:scale-102 transition-transform"
          >
            <span>Select Flight</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Card Footer: Baggage & Fare Rules Micro-details */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Luggage className="h-3.5 w-3.5 text-primary" />
            Cabin: {offer.baggage.cabin}
          </span>
          <span>•</span>
          <span>Checked: {offer.baggage.checked}</span>
        </div>

        <div className="flex items-center gap-2">
          {offer.amenities.map((item, idx) => (
            <span
              key={idx}
              className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-muted/60 px-2 py-0.5 rounded font-medium"
            >
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
