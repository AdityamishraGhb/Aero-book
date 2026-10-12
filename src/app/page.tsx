import Link from "next/link";
import {
  Plane,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface via-background to-background pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Subtle background geometric atmospheric gradients */}
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
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Next-Generation Flight Metasearch</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-primary font-bold">Phase 1 Foundation</span>
            </div>

            {/* Hero Headline */}
            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Fly smarter. <br />
              <span className="bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent">
                Book anywhere.
              </span>
            </h1>

            {/* Tagline Subtitle */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
              AeroBook connects you directly with global airlines and verified booking providers.
              Real-time route comparisons, transparent fare breakdowns, and zero hidden markups.
            </p>

            {/* Quick Action Preview */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="accent" size="lg" className="h-12 px-7 text-sm font-semibold shadow-md">
                <Link href="#popular-routes" className="inline-flex items-center gap-2">
                  <span>Explore Flight Intelligence</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-sm">
                <Link href="#why-aerobook">Why AeroBook</Link>
              </Button>
            </div>

            {/* Value Highlights */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border/80 pt-8 sm:grid-cols-4">
              <div className="flex flex-col items-center p-2">
                <span className="font-heading text-xl sm:text-2xl font-bold text-foreground">1,200+</span>
                <span className="text-xs text-muted-foreground mt-0.5">Airports Indexed</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <span className="font-heading text-xl sm:text-2xl font-bold text-primary">0%</span>
                <span className="text-xs text-muted-foreground mt-0.5">Hidden Fees</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <span className="font-heading text-xl sm:text-2xl font-bold text-foreground">100%</span>
                <span className="text-xs text-muted-foreground mt-0.5">Zod Type-Safe</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <span className="font-heading text-xl sm:text-2xl font-bold text-accent">₹ INR</span>
                <span className="text-xs text-muted-foreground mt-0.5">India Default Locale</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars: Why AeroBook */}
      <section id="why-aerobook" className="border-t border-border bg-card/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Engineered for clarity and speed
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Every detail in AeroBook is tuned to provide a calm, trustworthy, and modern flight shopping experience.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingDown className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                Algorithmic Best Value
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Our proprietary composite scoring combines flight duration, price delta, and layover inconvenience into a transparent &quot;Best&quot; score.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                URL-First Param State
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Filter by stops, departure windows, cabin classes, and airlines with deep URL state. Share your exact search result link with zero drift.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                Strict Provider Normalization
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                External airline schemas are validated by Zod at our BFF boundary. Consistent, reliable domain representations across all routes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Preview (Section 6) */}
      <section id="popular-routes" className="border-t border-border bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Trending Travel Routes
              </span>
              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Popular Domestic Corridors
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
              Direct routes with multiple daily frequencies and live fare alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { from: "DEL", fromCity: "New Delhi", to: "BOM", toCity: "Mumbai", duration: "2h 10m", estFare: "₹4,299" },
              { from: "BLR", fromCity: "Bengaluru", to: "DEL", toCity: "New Delhi", duration: "2h 45m", estFare: "₹5,150" },
              { from: "BOM", fromCity: "Mumbai", to: "GOI", toCity: "Goa Dabolim", duration: "1h 15m", estFare: "₹2,890" },
              { from: "MAA", fromCity: "Chennai", to: "CCU", toCity: "Kolkata", duration: "2h 20m", estFare: "₹4,750" },
            ].map((route) => (
              <div
                key={`${route.from}-${route.to}`}
                className="group relative rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-bold text-muted-foreground tracking-wider">
                    NON-STOP
                  </span>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {route.duration}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="font-heading text-xl font-extrabold text-foreground">{route.from}</span>
                    <p className="text-xs text-muted-foreground">{route.fromCity}</p>
                  </div>
                  <Plane className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                  <div className="text-right">
                    <span className="font-heading text-xl font-extrabold text-foreground">{route.to}</span>
                    <p className="text-xs text-muted-foreground">{route.toCity}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="text-xs text-muted-foreground">Fares from</span>
                  <span className="font-heading text-sm font-bold text-accent">{route.estFare}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="border-t border-border bg-card/30 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Everything you need to know about how AeroBook discovers and normalizes airfares.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {[
              {
                q: "What makes AeroBook different from conventional flight booking websites?",
                a: "AeroBook acts as a pure metasearch engine. We do not inflate prices, charge commission markups, or prefer specific carriers. You receive direct provider offers with transparent baggage and cancellation policies.",
              },
              {
                q: "How does the AeroBook Best score work?",
                a: "Our algorithm calculates a balanced score between lowest price, shortest travel time, and minimal layovers. A flight that is 10% cheaper but takes 8 hours longer will be ranked appropriately below a rapid direct flight.",
              },
              {
                q: "Are the displayed prices final in INR?",
                a: "Yes. For our default India locale, all fares include mandatory airport taxes, fuel surcharges, and passenger service fees in Indian Rupees (INR). You can also switch currency anytime in the header.",
              },
              {
                q: "How are my bookings processed?",
                a: "AeroBook passes your passenger details securely to the chosen ticketing provider or airline reservation system, providing you with a direct airline PNR reference.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground">
                  {faq.q}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
