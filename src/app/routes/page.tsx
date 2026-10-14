import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Plane, ArrowRight, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TOP_INDIAN_ROUTES } from "@/data/top-routes";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "Top Domestic Flight Routes in India | AeroBook",
  description:
    "Explore the most popular domestic flight corridors across India. Compare live schedules, airline operators, flight times, and book cheap air tickets with AeroBook.",
  keywords: [
    "domestic flights India",
    "top flight routes India",
    "Delhi Mumbai flights",
    "Bangalore Delhi flights",
    "cheap air tickets India",
    "AeroBook routes",
  ],
  alternates: {
    canonical: "/routes",
  },
  openGraph: {
    title: "Top Domestic Flight Routes in India | AeroBook",
    description:
      "Explore the most popular domestic flight corridors across India with instant fare comparison and transparent booking.",
    url: "https://aerobook.flights/routes",
    type: "website",
  },
};

export default function RoutesIndexPage() {
  return (
    <div className="flex-1 w-full bg-background min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="accent" className="text-xs font-bold gap-1.5 py-1">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Curated Flight Corridors</span>
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Top Domestic Flight Routes in India
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Discover real-time schedules, airport guides, non-stop flight times, and lowest
            historical airfares for India&apos;s busiest travel corridors.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TOP_INDIAN_ROUTES.map((route) => (
            <Card
              key={route.slug}
              className="border-border shadow-xs hover:border-primary/50 hover:shadow-soft-md transition-all group flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs font-bold">
                    {route.fromIata} ➔ {route.toIata}
                  </Badge>
                  <span className="text-xs font-extrabold text-primary">
                    From {formatCurrency(route.startingFare)}
                  </span>
                </div>

                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {route.fromCity} to {route.toCity}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {route.fromAirportName.split(" ")[0]} to {route.toAirportName.split(" ")[0]}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground border-t border-border/80 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span>{route.averageDuration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Plane className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span>{route.dailyFlightsCount}+ daily flights</span>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold gap-1.5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                >
                  <Link href={`/routes/${route.slug}`}>
                    <span>Explore Route Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
