"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  Printer,
  Plane,
  Luggage,
  Calendar,
  User,
  CreditCard,
  ArrowRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStore } from "@/lib/store/booking-store";
import { getAirportByIata } from "@/data/airports";
import { formatCurrency, formatDuration, formatTime, formatDate } from "@/lib/format";

export default function BookingConfirmationPage() {
  const router = useRouter();
  const confirmedBooking = useBookingStore((s) => s.confirmedBooking);
  const resetBooking = useBookingStore((s) => s.resetBooking);

  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleBookAnotherFlight = () => {
    resetBooking();
    router.push("/");
  };

  const handlePrintTicket = () => {
    window.print();
  };

  if (!confirmedBooking) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          No Confirmed Booking Found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          It looks like there is no active reservation in this session.
        </p>
        <Button asChild className="mt-6" variant="default">
          <Link href="/">Search Flights</Link>
        </Button>
      </div>
    );
  }

  const { bookingReference, pnr, offer, passengers, contact, createdAt } = confirmedBooking;
  const outboundSlice = offer.slices[0];
  const firstSegment = outboundSlice.segments[0];
  const lastSegment = outboundSlice.segments[outboundSlice.segments.length - 1];

  const originAirport = getAirportByIata(outboundSlice.departureAirport);
  const destAirport = getAirportByIata(outboundSlice.arrivalAirport);

  return (
    <div className="flex-1 w-full bg-background min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Confirmed Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 text-center space-y-3 shadow-soft-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <Badge variant="success" className="text-xs font-bold uppercase tracking-wider px-3 py-1">
            Reservation Confirmed • E-Ticket Issued
          </Badge>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Thank you! Your flight is booked.
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            A confirmation email and SMS containing your itinerary and boarding pass receipt have
            been sent to <span className="font-semibold text-foreground">{contact.email}</span>.
          </p>

          {/* Booking Reference & PNR Chips */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {/* Booking Ref */}
            <div className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl shadow-xs">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Booking ID:
              </span>
              <span className="font-mono text-sm font-extrabold text-foreground tracking-wider">
                {bookingReference}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(bookingReference, "ref")}
                className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Copy Booking ID"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              {copiedField === "ref" && (
                <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
              )}
            </div>

            {/* Carrier PNR */}
            <div className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl shadow-xs">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Airline PNR:
              </span>
              <span className="font-mono text-sm font-extrabold text-primary tracking-wider">
                {pnr}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(pnr, "pnr")}
                className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Copy PNR"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              {copiedField === "pnr" && (
                <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
              )}
            </div>
          </div>
        </div>

        {/* E-Ticket Card (Printable) */}
        <Card className="border-border bg-card shadow-soft-md overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-primary/5 border-b border-border/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-xs">
                {firstSegment.carrierCode}
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  {firstSegment.carrierName} • Flight {firstSegment.flightNumber}
                </CardTitle>
                <p className="text-xs text-muted-foreground font-medium">
                  Electronic Ticket Receipt • Class: {offer.cabin.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintTicket}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print E-Ticket</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-8">
            {/* Itinerary Timeline */}
            <div className="rounded-2xl border border-border bg-muted/20 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{formatDate(outboundSlice.departureTime, "long")}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Flight Duration:{" "}
                  <span className="font-semibold text-foreground">
                    {formatDuration(outboundSlice.durationMinutes)}
                  </span>
                  {" • "}
                  <span>
                    {outboundSlice.stops === 0 ? "Non-stop" : `${outboundSlice.stops} stop`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Departure */}
                <div>
                  <div className="font-heading text-2xl font-extrabold text-foreground">
                    {formatTime(outboundSlice.departureTime)}
                  </div>
                  <div className="font-mono text-sm font-bold text-primary mt-0.5">
                    {outboundSlice.departureAirport}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {originAirport?.name}
                    {firstSegment.departureTerminal ? ` • T${firstSegment.departureTerminal}` : ""}
                  </p>
                </div>

                {/* Arrow / Aircraft */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-medium text-muted-foreground mb-1">
                    {firstSegment.aircraft}
                  </span>
                  <div className="w-full flex items-center gap-1 max-w-[140px]">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <div className="h-0.5 flex-1 bg-border relative">
                      <Plane className="h-3.5 w-3.5 text-primary absolute left-1/2 -top-1.5 -translate-x-1/2" />
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                    Confirmed
                  </span>
                </div>

                {/* Arrival */}
                <div className="text-left md:text-right">
                  <div className="font-heading text-2xl font-extrabold text-foreground">
                    {formatTime(outboundSlice.arrivalTime)}
                  </div>
                  <div className="font-mono text-sm font-bold text-primary mt-0.5">
                    {outboundSlice.arrivalAirport}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {destAirport?.name}
                    {lastSegment.arrivalTerminal ? ` • T${lastSegment.arrivalTerminal}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Passenger Roster & E-Ticket Numbers */}
            <div className="space-y-3">
              <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>Passenger Roster & E-Ticket Assignments</span>
              </h3>

              <div className="divide-y divide-border/60 border border-border rounded-xl overflow-hidden">
                {passengers.map((pax, index) => {
                  const ticketNumber = `ETKT-098-4829${index + 1}0`;
                  return (
                    <div
                      key={pax.id}
                      className="p-4 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-heading font-bold text-sm text-foreground">
                          {pax.title} {pax.firstName} {pax.lastName}
                        </div>
                        <div className="text-[11px] text-muted-foreground capitalize mt-0.5">
                          {pax.type} • {pax.gender}
                        </div>
                      </div>

                      <div className="text-left sm:text-right space-y-0.5">
                        <div className="font-mono text-xs font-semibold text-primary">
                          {ticketNumber}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Seat:{" "}
                          <span className="font-medium text-foreground">
                            Auto-assigned at Web Check-in
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Baggage & Inclusions Recap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Luggage className="h-4 w-4 text-primary" />
                  <span>Cabin Baggage</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  {offer.baggage.cabin} (1 cabin bag + personal laptop item)
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Luggage className="h-4 w-4 text-accent" />
                  <span>Check-in Luggage</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  {offer.baggage.checked} per paying passenger
                </p>
              </div>
            </div>

            {/* Payment & Receipt Breakdown */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <span className="font-heading font-bold text-foreground">Payment Summary</span>
                </div>
                <Badge variant="success" className="text-[10px] font-bold">
                  PAID IN FULL
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-muted-foreground pt-1">
                <div>
                  <span className="block text-[11px]">Transaction Reference:</span>
                  <span className="font-mono font-semibold text-foreground mt-0.5 block">
                    TXN-AB-{bookingReference.replace("AB-", "")}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px]">Payment Mode:</span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    Mock UPI / Card Sandbox
                  </span>
                </div>
                <div>
                  <span className="block text-[11px]">Booked On:</span>
                  <span className="font-medium text-foreground mt-0.5 block">
                    {new Date(createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              <div className="border-t border-border/60 pt-3 flex items-baseline justify-between">
                <span className="font-bold text-foreground">Total Paid:</span>
                <span className="font-heading text-xl font-extrabold text-foreground">
                  {formatCurrency(offer.price.amount)}
                </span>
              </div>
            </div>

            {/* Important Airport Guidelines */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Info className="h-4 w-4 text-primary shrink-0" />
                <span>Important Travel Guidelines</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-muted-foreground leading-relaxed">
                <li>
                  Web check-in opens 48 hours prior to scheduled departure time on the airline
                  portal.
                </li>
                <li>
                  Please present a valid photo ID (Aadhaar, Passport, Driving License) at the
                  airport terminal entry gate.
                </li>
                <li>
                  Domestic check-in counters close 60 minutes prior to departure; boarding gates
                  close 25 minutes prior.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handleBookAnotherFlight}
            className="w-full sm:w-auto h-11 text-xs font-bold"
          >
            <span>Book Another Flight</span>
          </Button>

          <Button
            variant="default"
            asChild
            className="w-full sm:w-auto h-11 text-xs font-bold gap-2"
          >
            <Link href="/">
              <span>Return to AeroBook Home</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
