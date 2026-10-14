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
    estFare: "₹4,299",
    tag: "High Frequency",
  },
  {
    from: "BLR",
    fromCity: "Bengaluru",
    to: "DEL",
    toCity: "New Delhi",
    duration: "2h 45m",
    estFare: "₹5,150",
    tag: "Non-Stop",
  },
  {
    from: "BOM",
    fromCity: "Mumbai",
    to: "GOI",
    toCity: "Goa (Dabolim)",
    duration: "1h 15m",
    estFare: "₹2,890",
    tag: "Weekend Escape",
  },
  {
    from: "MAA",
    fromCity: "Chennai",
    to: "CCU",
    toCity: "Kolkata",
    duration: "2h 20m",
    estFare: "₹4,750",
    tag: "Best Value",
  },
  {
    from: "DEL",
    fromCity: "New Delhi",
    to: "DXB",
    toCity: "Dubai",
    duration: "3h 45m",
    estFare: "₹14,990",
    tag: "International Hub",
  },
  {
    from: "BOM",
    fromCity: "Mumbai",
    to: "SIN",
    toCity: "Singapore",
    duration: "5h 25m",
    estFare: "₹18,450",
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
  const nextWeekDate = getFutureDate(7);

  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Skyscanner Benchmark Hero Section with Midnight Navy Background */}
      <section className="relative overflow-hidden bg-[#05203c] pt-10 pb-16 sm:pt-14 sm:pb-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Skyscanner Benchmark Headline */}
          <div className="mb-6 sm:mb-8 text-left">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              Millions of cheap flights. One simple search.
            </h1>
            <h2 className="sr-only">Fly smarter. Book anywhere.</h2>
          </div>

          {/* Unified Horizontal Search Form */}
          <div className="w-full">
            <FlightSearchForm />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 z-20">
        {/* 4 Skyscanner Quick Action Pills / Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/flights/DEL-BOM?trip=oneway"
            className="group flex items-center gap-3 rounded-xl bg-[#03172e] border border-[#0b335c] p-4 text-white hover:bg-[#082a50] hover:border-[#13497d] transition-all shadow-md"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#38bdf8]">
              <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-heading text-sm font-bold">Search with AI</span>
          </Link>

          <Link
            href="#stays-info"
            className="group flex items-center gap-3 rounded-xl bg-[#03172e] border border-[#0b335c] p-4 text-white hover:bg-[#082a50] hover:border-[#13497d] transition-all shadow-md"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
              <Hotel className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-heading text-sm font-bold">Stays</span>
          </Link>

          <Link
            href="#cars-info"
            className="group flex items-center gap-3 rounded-xl bg-[#03172e] border border-[#0b335c] p-4 text-white hover:bg-[#082a50] hover:border-[#13497d] transition-all shadow-md"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
              <Car className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-heading text-sm font-bold">Cars</span>
          </Link>

          <Link
            href="#popular-routes"
            className="group flex items-center gap-3 rounded-xl bg-[#03172e] border border-[#0b335c] p-4 text-white hover:bg-[#082a50] hover:border-[#13497d] transition-all shadow-md"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
              <Compass className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-heading text-sm font-bold">Explore everywhere</span>
          </Link>
        </div>

        {/* Skyscanner Benchmark Travel Trends Inspiration Banner Card */}
        <div className="relative mt-10 sm:mt-14 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl min-h-[380px] sm:min-h-[440px] flex items-center">
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

      {/* Popular Routes Section */}
      <section id="popular-routes" className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Curated Travel Corridors
              </span>
              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Trending Flight Routes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
              Frequent domestic and international routes with instant availability check.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="group relative rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-soft-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {route.tag}
                    </span>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {route.duration}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="font-heading text-xl font-extrabold text-foreground">
                        {route.from}
                      </span>
                      <p className="text-xs text-muted-foreground">{route.fromCity}</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <Plane className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                      <span className="text-[10px] text-muted-foreground mt-0.5">Non-stop</span>
                    </div>

                    <div className="text-right">
                      <span className="font-heading text-xl font-extrabold text-foreground">
                        {route.to}
                      </span>
                      <p className="text-xs text-muted-foreground">{route.toCity}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">
                        Fares starting at
                      </span>
                      <span className="font-heading text-base font-bold text-accent">
                        {route.estFare}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
                      <span>Search Route</span>
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
