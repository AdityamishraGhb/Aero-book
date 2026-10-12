"use client";

import Link from "next/link";
import {
  Plane,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
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
      {/* Hero Section with Search Panel */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface via-background to-background pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Subtle geometric gradient backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-accent/20 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/85 px-4 py-1.5 text-xs font-semibold text-foreground shadow-xs backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Next-Generation Flight Metasearch</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-primary font-bold">Live Route Engine</span>
            </div>

            {/* Hero Headline */}
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Fly smarter. <br />
              <span className="bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent">
                Book anywhere.
              </span>
            </h1>

            {/* Tagline Subtitle */}
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
              Compare live routes, find best-value airfares, and experience seamless flight shopping
              across hundreds of global carriers with zero hidden markups.
            </p>
          </div>

          {/* Full Interactive Search Form Widget */}
          <div className="mx-auto max-w-5xl">
            <FlightSearchForm />
          </div>

          {/* Value Stat Highlights */}
          <div className="mx-auto max-w-4xl mt-12 grid grid-cols-2 gap-4 border-t border-border/80 pt-8 sm:grid-cols-4">
            <div className="flex flex-col items-center p-2 text-center">
              <span className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                1,200+
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">Airports Indexed</span>
            </div>
            <div className="flex flex-col items-center p-2 text-center">
              <span className="font-heading text-xl sm:text-2xl font-bold text-primary">0%</span>
              <span className="text-xs text-muted-foreground mt-0.5">Hidden Fees</span>
            </div>
            <div className="flex flex-col items-center p-2 text-center">
              <span className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                100%
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">Zod Type-Safe</span>
            </div>
            <div className="flex flex-col items-center p-2 text-center">
              <span className="font-heading text-xl sm:text-2xl font-bold text-accent">₹ INR</span>
              <span className="text-xs text-muted-foreground mt-0.5">Default India Currency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section id="popular-routes" className="border-t border-border bg-background py-16 sm:py-24">
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
