"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Plane,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  Hotel,
  Car,
  Compass,
} from "lucide-react";
import { FlightSearchForm } from "@/components/search/flight-search-form";
import { buildSearchUrl } from "@/lib/url";
import { useCurrency } from "@/lib/hooks/use-currency";
import { MobileAppSection } from "@/components/home/mobile-app-section";
import { AirlineTrustMarquee } from "@/components/home/airline-trust-marquee";
import { ProofMetricsStrip } from "@/components/home/proof-metrics-strip";
import { LuxuryPreviewArtifact } from "@/components/home/luxury-preview-artifact";

// Default future departure date helper (7 days from today)
function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const POPULAR_ROUTES = [
  {
    from: "DEL",
    fromCity: "New Delhi",
    to: "BOM",
    toCity: "Mumbai",
    duration: "2h 15m",
    estFareInInr: 4299,
    tag: "High Frequency",
  },
  {
    from: "BLR",
    fromCity: "Bengaluru",
    to: "DEL",
    toCity: "New Delhi",
    duration: "2h 45m",
    estFareInInr: 5150,
    tag: "Non-Stop",
  },
  {
    from: "BOM",
    fromCity: "Mumbai",
    to: "GOI",
    toCity: "Goa (Dabolim)",
    duration: "1h 15m",
    estFareInInr: 2890,
    tag: "Weekend Escape",
  },
  {
    from: "MAA",
    fromCity: "Chennai",
    to: "CCU",
    toCity: "Kolkata",
    duration: "2h 20m",
    estFareInInr: 4750,
    tag: "Best Value",
  },
  {
    from: "DEL",
    fromCity: "New Delhi",
    to: "DXB",
    toCity: "Dubai",
    duration: "3h 45m",
    estFareInInr: 14990,
    tag: "International Hub",
  },
  {
    from: "BOM",
    fromCity: "Mumbai",
    to: "SIN",
    toCity: "Singapore",
    duration: "5h 25m",
    estFareInInr: 18450,
    tag: "Direct",
  },
];

const FAQS = [
  {
    q: "What makes AeroBook different from conventional flight booking portals?",
    a: "AeroBook acts as a pure metasearch engine and travel intelligence platform. We do not inflate prices, levy hidden convenience markups, or bias rankings toward preferred carriers. You receive direct provider offers with transparent baggage, cancellation policies, and seat choices.",
  },
  {
    q: "How does the AeroBook 'Best Score' work?",
    a: "Our composite scoring engine balances three key factors: lowest price delta, minimal flight duration, and layover inconvenience. A route that is 10% cheaper but requires an 8-hour overnight connection will be ranked appropriately below a rapid direct flight.",
  },
  {
    q: "Are the displayed prices final in Indian Rupees (INR)?",
    a: "Yes. For our default India locale, all quotes include mandatory government airport taxes, passenger service fees (PSF), user development fees (UDF), and fuel surcharges. You can also switch currency anytime in the header.",
  },
  {
    q: "How does the airport autocomplete work?",
    a: "Our index covers 1,200+ global airports with comprehensive coverage of over 40 Indian commercial airports. It features sub-millisecond debounced searching, keyboard arrow navigation, and automatically preserves your recent flight lookups locally.",
  },
  {
    q: "How are my bookings confirmed?",
    a: "AeroBook securely transfers your journey parameters directly to the chosen airline reservation system or verified ticketing provider, giving you an official airline PNR reference immediately upon checkout.",
  },
];

export default function HomePage() {
  const { formatPrice } = useCurrency();
  const nextWeekDate = getFutureDate(7);

  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Hero Section with Official Midnight Navy Background (#0B1F2D) */}
      <section className="relative overflow-hidden bg-[#0B1F2D] pt-12 pb-20 sm:pt-16 sm:pb-24 text-white border-b border-[#163247]">
        {/* Subtle radial light blooms for luxury depth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#D4A017]/10 via-[#0E7C7B]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Eyebrow Badge & Editorial Scale Headline */}
          <div className="mb-8 sm:mb-10 text-left max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-[#D4A017]/40 backdrop-blur-md text-xs font-bold text-white shadow-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
              <span className="tracking-[0.18em] uppercase text-[11px] text-[#D4A017] font-heading font-extrabold">
                Live Metasearch Engine
              </span>
              <span className="text-white/40">•</span>
              <span className="text-white/90 text-[11px] font-medium font-sans">
                1,200+ Global Airports
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-white leading-[1.06]">
              Your Next Journey,{" "}
              <span className="text-[#D4A017] relative inline-block">
                Simplified.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl font-sans leading-relaxed">
              Unbiased flight comparisons, transparent fare breakdowns, and direct airline bookings with zero hidden markups across the world&apos;s leading carriers.
            </p>
          </div>

          {/* Unified Horizontal Search Form / Floating Console */}
          <div className="w-full">
            <FlightSearchForm />
          </div>
        </div>
      </section>

      {/* Main Quick Action Pills Floating Over Bottom of Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/flights/DEL-BOM?trip=oneway"
            className="group flex items-center gap-3 rounded-2xl bg-[#0B1F2D] border border-[#163247] p-4 text-white hover:bg-[#163247] hover:border-[#D4A017]/60 transition-all shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4A017]/20 text-[#D4A017]">
              <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-heading text-sm font-bold block">Search with AI</span>
              <span className="text-[10px] text-white/50 font-sans">Smart routing engine</span>
            </div>
          </Link>

          <Link
            href="#stays-info"
            className="group flex items-center gap-3 rounded-2xl bg-[#0B1F2D] border border-[#163247] p-4 text-white hover:bg-[#163247] hover:border-[#D4A017]/60 transition-all shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <Hotel className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-heading text-sm font-bold block">Stays & Hotels</span>
              <span className="text-[10px] text-[#D4A017] font-sans">Coming Q3 2027</span>
            </div>
          </Link>

          <Link
            href="#cars-info"
            className="group flex items-center gap-3 rounded-2xl bg-[#0B1F2D] border border-[#163247] p-4 text-white hover:bg-[#163247] hover:border-[#D4A017]/60 transition-all shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <Car className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-heading text-sm font-bold block">Car Rentals</span>
              <span className="text-[10px] text-[#D4A017] font-sans">Coming Q3 2027</span>
            </div>
          </Link>

          <Link
            href="#popular-routes"
            className="group flex items-center gap-3 rounded-2xl bg-[#0B1F2D] border border-[#163247] p-4 text-white hover:bg-[#163247] hover:border-[#D4A017]/60 transition-all shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <Compass className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-heading text-sm font-bold block">Top 20 Corridors</span>
              <span className="text-[10px] text-white/50 font-sans">Direct airline rates</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Global Airline Network Marquee Strip */}
      <div className="mt-12 sm:mt-16">
        <AirlineTrustMarquee />
      </div>

      {/* Enterprise Proof Metrics Strip */}
      <ProofMetricsStrip />

      {/* Layered 3D Luxury Boarding Pass & Metasearch Artifact */}
      <LuxuryPreviewArtifact />

      {/* Travel Trends Inspiration Showcase */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl min-h-[380px] sm:min-h-[440px] flex items-center">
          {/* Background Travel Photography */}
          <Image
            src="/images/travel-trends-hero.jpg"
            alt="Travel inspiration campervan view over coastline"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />

          {/* Cinematic Contrast Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none" />

          {/* Banner Typography & CTA */}
          <div className="relative z-10 max-w-xl p-6 sm:p-12 lg:p-16 text-white space-y-4">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              The trips everyone&apos;s talking about
            </h2>
            <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed max-w-md">
              Meet the trends, destinations and ideas shaping 2027
            </p>
            <div className="pt-3">
              <Link
                href="#popular-routes"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100 transition-colors shadow-lg active:scale-95"
              >
                See what&apos;s next
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Routes Section with Luxury Cards */}
      <section id="popular-routes" className="bg-[#F6F7FB] py-16 sm:py-24 border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-[0.25em] text-[#D4A017]">
                Curated Travel Corridors
              </span>
              <h2 className="mt-1 font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0B1F2D]">
                Trending Flight Routes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-sm font-sans">
              Frequent domestic Indian corridors and international routes with instant availability and live multi-currency quotes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_ROUTES.map((route) => {
              const searchUrl = buildSearchUrl({
                from: route.from,
                to: route.to,
                depart: nextWeekDate,
                trip: "oneway",
                adults: 1,
                cabin: "economy",
              });

              return (
                <Link
                  key={`${route.from}-${route.to}`}
                  href={searchUrl}
                  className="group relative rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:border-[#D4A017]/70 hover:shadow-soft-lg hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#0B1F2D] bg-[#F6F7FB] border border-[#E5E7EB] px-2.5 py-0.5 rounded-full">
                      {route.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#D4A017] bg-[#0B1F2D] px-2.5 py-0.5 rounded-full">
                      {route.duration}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="font-heading text-2xl font-black text-[#0B1F2D]">
                        {route.from}
                      </span>
                      <p className="text-xs text-[#6B7280] font-medium">{route.fromCity}</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <Plane className="h-4 w-4 text-[#D4A017] transition-transform group-hover:translate-x-1" />
                      <span className="text-[10px] font-mono text-[#6B7280] mt-0.5">Non-stop</span>
                    </div>

                    <div className="text-right">
                      <span className="font-heading text-2xl font-black text-[#0B1F2D]">
                        {route.to}
                      </span>
                      <p className="text-xs text-[#6B7280] font-medium">{route.toCity}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                    <div>
                      <span className="text-[11px] text-[#6B7280] font-sans block">
                        Fares starting at
                      </span>
                      <span className="font-heading text-lg font-black text-[#0B1F2D]">
                        {formatPrice(route.estFareInInr)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4A017] group-hover:translate-x-0.5 transition-transform">
                      <span>View Deals</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Pillars: Why AeroBook */}
      <section id="why-aerobook" className="border-t border-border bg-card/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Core Architecture
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Why Travelers Choose AeroBook
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Every component is tuned to eliminate friction and provide transparent journey
              discovery.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-soft-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingDown className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                Algorithmic Best Score
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Our composite scoring calculates a balanced ratio between travel duration, price
                deltas, and layover inconvenience into an intuitive 1-10 quality metric.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-soft-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                URL-First Deep State
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Every filter, stop preference, date selection, and cabin choice maps to clean
                canonical URL parameters. Bookmark, share, or revisit your exact flight query
                without drift.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-soft-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                Zero Hidden Markups
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We normalize real-time provider APIs and display all mandatory airport taxes,
                baggage allowances, and fare rules before handoff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navan-inspired Mobile App & QR Code Launch Section */}
      <MobileAppSection />

      {/* FAQ Section */}
      <section id="faq" className="border-t border-border bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Got Questions?
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Everything you need to know about searching, comparing, and booking through AeroBook.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-xl border border-border bg-card p-5 shadow-xs transition-all open:ring-1 open:ring-primary/20"
              >
                <summary className="flex cursor-pointer items-center justify-between font-heading text-sm sm:text-base font-semibold text-foreground select-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/60 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
