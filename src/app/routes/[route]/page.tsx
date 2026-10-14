import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  ArrowRight,
  TrendingUp,
  Luggage,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TOP_INDIAN_ROUTES, getTopRouteBySlug } from "@/data/top-routes";
import { formatCurrency } from "@/lib/format";

const DEFAULT_DEPART_DATE = "2026-11-20";
const PRICE_VALID_UNTIL_DATE = "2026-12-31";

interface Props {
  params: Promise<{ route: string }>;
}

export function generateStaticParams() {
  return TOP_INDIAN_ROUTES.map((route) => ({
    route: route.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { route: routeSlug } = await params;
  const route = getTopRouteBySlug(routeSlug);

  if (!route) {
    return {
      title: "Route Not Found | AeroBook",
      description: "The requested flight route could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aerobook.flights";
  const title = `Cheap Flights from ${route.fromCity} to ${route.toCity} (${route.fromIata} to ${route.toIata}) from ${formatCurrency(route.startingFare)} | AeroBook`;
  const description = `Find cheap direct flights from ${route.fromCity} (${route.fromIata}) to ${route.toCity} (${route.toIata}). Compare non-stop flight times (${route.averageDuration}), airlines, and book with zero hidden fees.`;

  return {
    title,
    description,
    keywords: [
      `${route.fromCity} to ${route.toCity} flights`,
      `${route.fromIata} to ${route.toIata} cheap flights`,
      `direct flights ${route.fromCity} to ${route.toCity}`,
      `flight ticket price ${route.fromCity} to ${route.toCity}`,
      "AeroBook flights India",
    ],
    alternates: {
      canonical: `${siteUrl}/routes/${route.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/routes/${route.slug}`,
      type: "website",
      locale: "en_IN",
      siteName: "AeroBook",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RouteLandingPage({ params }: Props) {
  const { route: routeSlug } = await params;
  const route = getTopRouteBySlug(routeSlug);

  if (!route) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aerobook.flights";

  // Reverse route for reciprocal navigation
  const returnSlug = `${route.toIata.toLowerCase()}-${route.fromIata.toLowerCase()}`;
  const returnRoute = getTopRouteBySlug(returnSlug);

  // Other routes from this origin
  const otherFromRoutes = TOP_INDIAN_ROUTES.filter(
    (r) => r.fromIata === route.fromIata && r.slug !== route.slug
  ).slice(0, 3);

  const defaultDepart = DEFAULT_DEPART_DATE;

  const directSearchHref = `/flights/${route.fromIata}-${route.toIata}?depart=${defaultDepart}&trip=oneway&adults=1&cabin=economy`;

  // JSON-LD Structured Data Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Domestic Flight Routes",
        item: `${siteUrl}/routes`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${route.fromCity} to ${route.toCity} Flights`,
        item: `${siteUrl}/routes/${route.slug}`,
      },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Direct Flights from ${route.fromCity} (${route.fromIata}) to ${route.toCity} (${route.toIata})`,
    description: route.overview,
    brand: {
      "@type": "Brand",
      name: "AeroBook",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: route.startingFare,
      offerCount: route.dailyFlightsCount,
      priceValidUntil: PRICE_VALID_UNTIL_DATE,
      url: `${siteUrl}${directSearchHref}`,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: route.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Inject JSON-LD Rich Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex-1 w-full bg-background min-h-screen py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center text-xs text-muted-foreground gap-2"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <Link href="/routes" className="hover:text-primary transition-colors">
              Flight Routes
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-foreground font-semibold" aria-current="page">
              {route.fromCity} to {route.toCity}
            </span>
          </nav>

          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-10 lg:p-12 shadow-soft-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent" className="text-xs font-bold gap-1.5 py-1">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    <span>Top Indian Domestic Route</span>
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono font-bold">
                    {route.fromIata} ➔ {route.toIata}
                  </Badge>
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                  Flights from {route.fromCity} to {route.toCity}
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {route.overview}
                </p>

                {/* Key Metrics Quick Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="rounded-xl border border-border/80 bg-background/60 p-3">
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      Non-Stop Flight Time
                    </span>
                    <span className="font-heading text-lg font-bold text-foreground">
                      {route.averageDuration}
                    </span>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-background/60 p-3">
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      Fares Starting From
                    </span>
                    <span className="font-heading text-lg font-bold text-primary">
                      {formatCurrency(route.startingFare)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-background/60 p-3">
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      Daily Non-Stop Flights
                    </span>
                    <span className="font-heading text-lg font-bold text-foreground">
                      {route.dailyFlightsCount}+ flights
                    </span>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-background/60 p-3">
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      Flight Distance
                    </span>
                    <span className="font-heading text-lg font-bold text-foreground">
                      {route.distanceKm} km
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Booking CTA Card */}
              <div className="shrink-0 rounded-2xl border border-primary/20 bg-primary/10 p-6 text-center space-y-4 lg:w-80">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                  Best Value Fares
                </span>
                <div>
                  <span className="text-xs text-muted-foreground block">Starting at</span>
                  <span className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
                    {formatCurrency(route.startingFare)}
                  </span>
                  <span className="text-xs text-muted-foreground block mt-0.5">
                    one way, per adult
                  </span>
                </div>

                <Button
                  asChild
                  size="lg"
                  variant="accent"
                  className="w-full text-xs font-bold shadow-sm gap-2"
                >
                  <Link href={directSearchHref}>
                    <span>Search Live Flights</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>

                <p className="text-[11px] text-muted-foreground">
                  Compare IndiGo, Air India, Vistara, Akasa Air & SpiceJet
                </p>
              </div>
            </div>
          </section>

          {/* Quick Route Facts Cards */}
          <section aria-labelledby="route-intelligence-heading" className="space-y-6">
            <h2
              id="route-intelligence-heading"
              className="font-heading text-2xl font-bold text-foreground"
            >
              Route Intelligence & Travel Facts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border shadow-soft-sm">
                <CardHeader className="pb-3 flex flex-row items-center gap-3 space-y-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Best Time to Book</CardTitle>
                    <span className="text-xs text-muted-foreground">Cheapest Season</span>
                  </div>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>
                    <strong className="text-foreground">Lowest Fares:</strong> {route.cheapestMonth}
                    .
                  </p>
                  <p>
                    <strong className="text-foreground">Peak Holiday Season:</strong>{" "}
                    {route.peakSeason}.
                  </p>
                  <p>
                    Booking 3 to 4 weeks ahead typically secures the lowest domestic bucket fares.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft-sm">
                <CardHeader className="pb-3 flex flex-row items-center gap-3 space-y-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Building className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Airport Terminals</CardTitle>
                    <span className="text-xs text-muted-foreground">Departure & Arrival</span>
                  </div>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>
                    <strong className="text-foreground">{route.fromIata} Departure:</strong>{" "}
                    {route.originTerminals}
                  </p>
                  <p>
                    <strong className="text-foreground">{route.toIata} Arrival:</strong>{" "}
                    {route.destTerminals}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft-sm">
                <CardHeader className="pb-3 flex flex-row items-center gap-3 space-y-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Luggage className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Baggage & DigiYatra</CardTitle>
                    <span className="text-xs text-muted-foreground">Seamless Transit</span>
                  </div>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>
                    <strong className="text-foreground">Standard Baggage:</strong> 15 kg check-in +
                    7 kg cabin bag on economy.
                  </p>
                  <p>
                    <strong className="text-foreground">DigiYatra:</strong> Biometric facial
                    recognition entry is active at both airports.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Monthly Fare Trends Visualizer */}
          <section aria-labelledby="monthly-fare-trends-heading" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2
                  id="monthly-fare-trends-heading"
                  className="font-heading text-2xl font-bold text-foreground"
                >
                  Monthly Fare Trends ({route.fromIata} to {route.toIata})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Estimated average lowest one-way fares across the calendar year
                </p>
              </div>
              <Badge variant="outline" className="w-fit text-xs font-semibold gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>Cheapest in {route.cheapestMonth}</span>
              </Badge>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-sm">
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3 items-end pt-6">
                {route.monthlyFares.map((item) => {
                  const isLowest =
                    item.price === Math.min(...route.monthlyFares.map((m) => m.price));
                  const heightPercentage = Math.round((item.price / 6000) * 100);

                  return (
                    <div key={item.month} className="flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors">
                        ₹{(item.price / 1000).toFixed(1)}k
                      </span>
                      <div className="w-full bg-muted/60 rounded-t-lg h-32 flex items-end p-1">
                        <div
                          style={{ height: `${heightPercentage}%` }}
                          className={`w-full rounded-t transition-all group-hover:opacity-100 ${
                            isLowest
                              ? "bg-primary opacity-90 shadow-xs"
                              : "bg-primary/40 opacity-70"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold ${isLowest ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Airlines Comparison */}
          <section aria-labelledby="airlines-heading" className="space-y-6">
            <h2 id="airlines-heading" className="font-heading text-2xl font-bold text-foreground">
              Airlines Operating on {route.fromCity} ➔ {route.toCity}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {route.popularAirlines.map((airline) => (
                <Card
                  key={airline}
                  className="border-border shadow-xs hover:border-primary/40 transition-all"
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-heading text-base font-bold text-foreground">
                        {airline}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Multiple daily non-stop departures
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                        <span>15 kg Check-in</span>
                        <span>•</span>
                        <span>Direct Cabin</span>
                      </div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-heading font-extrabold text-xs">
                      {airline.slice(0, 2).toUpperCase()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section aria-labelledby="faqs-heading" className="space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 id="faqs-heading" className="font-heading text-2xl font-bold text-foreground">
                Frequently Asked Questions: {route.fromCity} to {route.toCity}
              </h2>
            </div>

            <div className="space-y-4">
              {route.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm space-y-2"
                >
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Corridors */}
          <section
            aria-labelledby="related-routes-heading"
            className="space-y-6 pt-4 border-t border-border"
          >
            <h2
              id="related-routes-heading"
              className="font-heading text-xl font-bold text-foreground"
            >
              Popular Connected Routes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Return route */}
              {returnRoute && (
                <Card className="border-border shadow-xs hover:border-primary/40 transition-all">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs font-mono">
                        {returnRoute.fromIata} ➔ {returnRoute.toIata}
                      </Badge>
                      <span className="text-xs font-bold text-primary">
                        {formatCurrency(returnRoute.startingFare)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-foreground">
                        {returnRoute.fromCity} to {returnRoute.toCity}
                      </h4>
                      <span className="text-[11px] text-muted-foreground">
                        {returnRoute.averageDuration} non-stop
                      </span>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold"
                    >
                      <Link href={`/routes/${returnRoute.slug}`}>View Fares</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Other routes */}
              {otherFromRoutes.map((other) => (
                <Card
                  key={other.slug}
                  className="border-border shadow-xs hover:border-primary/40 transition-all"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs font-mono">
                        {other.fromIata} ➔ {other.toIata}
                      </Badge>
                      <span className="text-xs font-bold text-primary">
                        {formatCurrency(other.startingFare)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-foreground">
                        {other.fromCity} to {other.toCity}
                      </h4>
                      <span className="text-[11px] text-muted-foreground">
                        {other.averageDuration} non-stop
                      </span>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold"
                    >
                      <Link href={`/routes/${other.slug}`}>View Fares</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
