"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Plane,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Luggage,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAirportByIata } from "@/data/airports";
import { findOfferById } from "@/lib/providers/offer-lookup";
import { formatCurrency, formatDuration, formatTime, formatDate } from "@/lib/format";
import { useBookingStore } from "@/lib/store/booking-store";
import type { FlightOffer, FlightSlice } from "@/types/flight";

export default function FlightOfferDetailsPage() {
  const params = useParams<{ route: string; offerId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const setSelectedOffer = useBookingStore((s) => s.setSelectedOffer);

  const routeParam = params?.route || "DEL-BOM";
  const offerId = params?.offerId || "offer-DELBOM-1";

  const [from = "DEL", to = "BOM"] = routeParam.toUpperCase().split("-");

  const depart = searchParams.get("depart") || "2026-11-20";
  const returnDate = searchParams.get("return") || undefined;
  const trip = (searchParams.get("trip") as "oneway" | "roundtrip") || "oneway";
  const adults = Number(searchParams.get("adults")) || 1;
  const children = Number(searchParams.get("children")) || 0;
  const infants = Number(searchParams.get("infants")) || 0;
  const cabin =
    (searchParams.get("cabin") as "economy" | "premium-economy" | "business" | "first") ||
    "economy";

  const originAirport = getAirportByIata(from);
  const destAirport = getAirportByIata(to);

  // Deterministically resolve the offer
  const offer: FlightOffer | null = React.useMemo(() => {
    return findOfferById(offerId, {
      from,
      to,
      depart,
      return: returnDate,
      trip,
      adults,
      children,
      infants,
      cabin,
      directOnly: false,
      currency: "INR",
      sort: "best",
    });
  }, [offerId, from, to, depart, returnDate, trip, adults, children, infants, cabin]);

  const handleProceedToBooking = () => {
    if (offer) {
      setSelectedOffer(offer);
      const queryParams = new URLSearchParams({
        offerId: offer.id,
        from,
        to,
        depart,
        ...(returnDate ? { return: returnDate } : {}),
        trip,
        adults: String(adults),
        children: String(children),
        infants: String(infants),
        cabin,
      }).toString();
      router.push(`/booking?${queryParams}`);
    }
  };

  if (!offer) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Flight offer not found</h2>
        <Button asChild className="mt-4">
          <Link href={`/flights/${from}-${to}`}>Back to Search Results</Link>
        </Button>
      </div>
    );
  }

  const isRoundTrip = offer.slices.length > 1;

  return (
    <div className="flex-1 w-full bg-background min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <Link
            href={`/flights/${from}-${to}?depart=${depart}&trip=${trip}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to search results</span>
          </Link>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary font-mono text-xs">
              {from} ✈ {to}
            </Badge>
            <Badge variant="accent" className="text-xs font-bold gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Score {offer.scoring.bestScore}/10</span>
            </Badge>
          </div>
        </div>

        {/* Page Title & Flight Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <span>{offer.slices[0].segments[0].carrierName}</span>
              <span>•</span>
              <span className="font-mono">{offer.slices[0].segments[0].flightNumber}</span>
            </div>
            <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
              {originAirport?.city} ({from}) to {destAirport?.city} ({to})
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {formatDate(depart, "long")} •{" "}
              {offer.slices[0].stops === 0 ? "Non-stop" : `${offer.slices[0].stops} stop`} •{" "}
              {formatDuration(offer.slices[0].durationMinutes)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="accent"
              size="lg"
              onClick={handleProceedToBooking}
              className="h-12 px-8 font-bold gap-2 shadow-md"
            >
              <span>Book This Flight</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Grid: Itinerary Details (8 cols) + Price Card (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Itinerary, Baggage, Fare Rules */}
          <div className="lg:col-span-8 space-y-8">
            {/* Itinerary Timeline Card */}
            <Card>
              <CardHeader className="border-b border-border/80">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" />
                  <span>Flight Itinerary Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {offer.slices.map((slice: FlightSlice, sliceIndex: number) => (
                  <div key={sliceIndex} className="space-y-6">
                    {isRoundTrip && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        <span>{sliceIndex === 0 ? "Outbound Flight" : "Return Flight"}</span>
                        <span>•</span>
                        <span>
                          {formatDate(sliceIndex === 0 ? depart : returnDate || depart, "medium")}
                        </span>
                      </div>
                    )}

                    <div className="space-y-6 border-l-2 border-primary/40 pl-6 ml-3">
                      {slice.segments.map((seg) => (
                        <div key={seg.id} className="relative space-y-4">
                          {/* Segment Dot */}
                          <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-card bg-primary shadow-xs" />

                          {/* Departure Point */}
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="font-heading text-lg font-extrabold text-foreground">
                                  {formatTime(seg.departureTime)}
                                </span>
                                <span className="font-mono text-sm font-bold text-primary">
                                  {seg.departureAirport}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground font-medium">
                                {getAirportByIata(seg.departureAirport)?.name}
                                {seg.departureTerminal
                                  ? ` • Terminal ${seg.departureTerminal}`
                                  : ""}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                              {formatDate(seg.departureTime, "short")}
                            </span>
                          </div>

                          {/* Flight In-Air Flight Info */}
                          <div className="rounded-xl border border-border bg-muted/40 p-3.5 my-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-primary font-bold font-mono border border-border">
                                {seg.carrierCode}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {seg.carrierName} ({seg.flightNumber})
                                </p>
                                <p className="text-muted-foreground text-[11px]">
                                  {seg.aircraft} • {seg.cabin}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-muted-foreground font-medium">
                              <span>Flight duration: {formatDuration(seg.durationMinutes)}</span>
                              <span>•</span>
                              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                                98% On-Time
                              </span>
                            </div>
                          </div>

                          {/* Layover Notice (if applicable) */}
                          {seg.layoverMinutes && (
                            <div className="rounded-xl border border-amber-300/60 bg-amber-50/60 dark:bg-amber-950/20 p-3.5 my-3 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200">
                              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                              <div>
                                <span className="font-bold">
                                  {formatDuration(seg.layoverMinutes)} connection layover in{" "}
                                  {seg.arrivalAirport}
                                </span>
                                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                                  Baggage checked through to final destination. Proceed directly to
                                  transfer gate.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Arrival Point */}
                          <div className="flex items-start justify-between pt-1">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="font-heading text-lg font-extrabold text-foreground">
                                  {formatTime(seg.arrivalTime)}
                                </span>
                                <span className="font-mono text-sm font-bold text-primary">
                                  {seg.arrivalAirport}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground font-medium">
                                {getAirportByIata(seg.arrivalAirport)?.name}
                                {seg.arrivalTerminal ? ` • Terminal ${seg.arrivalTerminal}` : ""}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                              {formatDate(seg.arrivalTime, "short")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Baggage Allowance Policy Card */}
            <Card>
              <CardHeader className="border-b border-border/80">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Luggage className="h-5 w-5 text-primary" />
                  <span>Baggage Allowance & Policies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Luggage className="h-4 w-4 text-primary" />
                      <span className="font-heading text-sm font-bold text-foreground">
                        Cabin Baggage
                      </span>
                    </div>
                    <p className="text-xs text-foreground font-semibold">
                      {offer.baggage.cabin} (1 piece + laptop bag)
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Must fit comfortably in the overhead compartment or under the seat in front.
                      Max dimensions: 55cm x 35cm x 25cm.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Luggage className="h-4 w-4 text-accent" />
                      <span className="font-heading text-sm font-bold text-foreground">
                        Check-in Luggage
                      </span>
                    </div>
                    <p className="text-xs text-foreground font-semibold">{offer.baggage.checked}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Drop off at airline check-in counter at least 60 minutes prior to domestic
                      departure. Excess baggage can be pre-booked at discounted rates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fare Rules & Cancellation Policy */}
            <Card>
              <CardHeader className="border-b border-border/80">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span>Fare Rules & Cancellation Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border border-border bg-muted/40">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      Up to 72 hrs prior
                    </span>
                    <span className="font-heading text-sm font-bold text-foreground mt-0.5 block">
                      ₹2,000 Fee
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      Balance refunded to source
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-border bg-muted/40">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      24 – 72 hrs prior
                    </span>
                    <span className="font-heading text-sm font-bold text-foreground mt-0.5 block">
                      ₹3,000 Fee
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Balance refunded to source
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-border bg-muted/40">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      Within 2 hrs of departure
                    </span>
                    <span className="font-heading text-sm font-bold text-destructive mt-0.5 block">
                      Non-refundable
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Airport tax only refunded
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Info className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    Free date change permitted up to 48 hours prior to departure. Any fare
                    difference between dates applies.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols): Sticky Price Breakdown Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <Card className="border-accent/40 bg-accent/[0.01] shadow-soft-md">
              <CardHeader className="border-b border-border/80 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="accent">Fare Summary</Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {offer.cabin.toUpperCase()}
                  </span>
                </div>
                <CardTitle className="text-xl mt-2">Price Breakdown</CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-4 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Base Airfare ({adults} adult)</span>
                  <span className="font-semibold text-foreground font-mono">
                    {formatCurrency(offer.price.baseFare)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Airport Taxes & UDF/PSF</span>
                  <span className="font-semibold text-foreground font-mono">
                    {formatCurrency(Math.round(offer.price.taxes * 0.75))}
                  </span>
                </div>

                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Aviation Security Fee & GST (5%)</span>
                  <span className="font-semibold text-foreground font-mono">
                    {formatCurrency(Math.round(offer.price.taxes * 0.25))}
                  </span>
                </div>

                <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                  <span>AeroBook Service Markup</span>
                  <span>₹0 (Free)</span>
                </div>

                <div className="border-t border-border/80 pt-4 flex items-baseline justify-between">
                  <div>
                    <span className="font-heading text-sm font-bold text-foreground block">
                      Total Payable
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      All taxes and charges included
                    </span>
                  </div>
                  <span className="font-heading text-3xl font-extrabold text-foreground">
                    {formatCurrency(offer.price.amount)}
                  </span>
                </div>

                <Button
                  variant="accent"
                  size="lg"
                  onClick={handleProceedToBooking}
                  className="w-full h-12 font-bold text-sm gap-2 mt-4 shadow-md"
                >
                  <span>Continue to Passenger Details</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Price locked for instant reservation</span>
                </div>
              </CardContent>
            </Card>

            {/* Assistance card */}
            <div className="rounded-xl border border-border bg-card p-4 text-xs space-y-1.5">
              <span className="font-semibold text-foreground block">
                Need assistance with this flight?
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Our support team is available 24/7 for booking modifications and seat reservations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
