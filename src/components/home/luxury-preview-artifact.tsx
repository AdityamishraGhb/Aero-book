"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plane,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Luggage,
  Zap,
  ArrowRight,
  QrCode,
  Compass,
} from "lucide-react";
import { useCurrency } from "@/lib/hooks/use-currency";
import { Button } from "@/components/ui/button";

export function LuxuryPreviewArtifact() {
  const { formatPrice } = useCurrency();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#0B1F2D] text-white">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4A017]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (5 cols): Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-[#D4A017] border border-[#D4A017]/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Generation Flight Metasearch</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Designed for travelers who expect <span className="text-[#D4A017]">clarity.</span>
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
              Unlike legacy booking portals that hide convenience fees until checkout or manipulate carrier rankings, AeroBook provides unfiltered market intelligence, live multi-currency fares, and direct airline ticketing.
            </p>

            {/* 3 Pillars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D4A017]/20 text-[#D4A017]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-white">Direct Airline PNR</h4>
                  <p className="text-xs text-white/60">
                    Official booking reference generated directly on the carrier reservation system.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D4A017]/20 text-[#D4A017]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-white">Zero Hidden Surcharges</h4>
                  <p className="text-xs text-white/60">
                    All taxes, UDF, PSF, and fuel surcharges included upfront in your selected currency.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D4A017]/20 text-[#D4A017]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-white">Real-Time Metasearch Engine</h4>
                  <p className="text-xs text-white/60">
                    Sub-second multi-provider queries across 1,200+ global airports and 40+ Indian corridors.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                asChild
                variant="gold"
                size="lg"
                className="h-12 px-8 text-xs font-bold gap-2 cursor-pointer shadow-lg"
              >
                <Link href="/flights/DEL-BOM?trip=oneway">
                  <span>Explore Live Search Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column (7 cols): Photorealistic Layered Boarding Pass & Itinerary Card */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-xl">
              {/* Back Card Glow / Floating Depth */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#D4A017]/30 to-blue-500/20 blur-xl opacity-70" />

              {/* Main Boarding Pass Container */}
              <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-[#0F283A] to-[#071520] p-6 sm:p-8 shadow-2xl space-y-6 text-white overflow-hidden">
                {/* Top Carrier Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4A017] text-[#0B1F2D] font-heading font-black text-sm shadow-md">
                      AI
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-base font-extrabold text-white">
                          Air India
                        </span>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-[#D4A017] border border-[#D4A017]/30">
                          AI-805
                        </span>
                      </div>
                      <p className="text-xs text-white/60 font-sans">
                        Boeing 787-8 Dreamliner • Economy Class
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>On Schedule</span>
                    </div>
                    <p className="text-[10px] font-mono text-white/40 mt-1">
                      PNR: AB-9842X
                    </p>
                  </div>
                </div>

                {/* Journey Flight Path Visualization */}
                <div className="grid grid-cols-3 items-center py-2 text-center">
                  {/* Origin */}
                  <div className="text-left">
                    <span className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight">
                      DEL
                    </span>
                    <p className="text-xs font-semibold text-white/90 mt-0.5">08:45 AM</p>
                    <p className="text-[11px] text-white/50 truncate">New Delhi (T3)</p>
                  </div>

                  {/* Flight Trail Vector */}
                  <div className="flex flex-col items-center px-2">
                    <span className="text-[11px] font-mono text-[#D4A017] font-bold">
                      2h 15m
                    </span>
                    <div className="relative w-full flex items-center my-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#D4A017]" />
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-[#D4A017] via-white/50 to-[#D4A017] stroke-dasharray" />
                      <Plane className="h-4 w-4 text-[#D4A017] rotate-90 mx-1 shrink-0" />
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-[#D4A017] via-white/50 to-[#D4A017]" />
                      <div className="w-2 h-2 rounded-full bg-[#D4A017]" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                      Non-Stop
                    </span>
                  </div>

                  {/* Destination */}
                  <div className="text-right">
                    <span className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight">
                      BOM
                    </span>
                    <p className="text-xs font-semibold text-white/90 mt-0.5">11:00 AM</p>
                    <p className="text-[11px] text-white/50 truncate">Mumbai (T2)</p>
                  </div>
                </div>

                {/* Micro Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-white/5 p-4 border border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block font-mono">
                      Gate / Seat
                    </span>
                    <span className="font-heading font-bold text-white text-sm">
                      14B • 12F
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block font-mono">
                      Baggage
                    </span>
                    <span className="font-heading font-bold text-white text-sm">
                      15kg + 7kg
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block font-mono">
                      In-Flight
                    </span>
                    <span className="font-heading font-bold text-white text-sm">
                      Meal + WiFi
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block font-mono">
                      Score
                    </span>
                    <span className="font-heading font-bold text-[#D4A017] text-sm">
                      9.8 / 10
                    </span>
                  </div>
                </div>

                {/* Tear-Line Perforation with Barcode & Price */}
                <div className="relative border-t-2 border-dashed border-white/20 pt-5 flex items-center justify-between">
                  {/* Left Ticket Notch */}
                  <div className="absolute -left-10 -top-3 w-6 h-6 rounded-full bg-[#0B1F2D] border-r border-white/15" />
                  {/* Right Ticket Notch */}
                  <div className="absolute -right-10 -top-3 w-6 h-6 rounded-full bg-[#0B1F2D] border-l border-white/15" />

                  {/* Price Block */}
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/60 block">
                      All-Inclusive Market Rate
                    </span>
                    <div className="font-heading text-2xl sm:text-3xl font-extrabold text-[#D4A017]">
                      {formatPrice(4299)}
                    </div>
                  </div>

                  {/* Scannable Micro Barcode Aesthetic */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 h-8 opacity-80">
                      {[3, 1, 4, 1, 5, 2, 6, 2, 1, 3, 4, 1, 2, 5, 1, 4, 2].map((w, idx) => (
                        <div
                          key={idx}
                          className="bg-white h-full rounded-xs"
                          style={{ width: `${w}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-white/40 mt-1">
                      VERIFIED DIRECT FARE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
