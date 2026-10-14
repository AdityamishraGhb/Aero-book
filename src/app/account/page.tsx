"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Plane,
  Bookmark,
  Heart,
  LogOut,
  ArrowRight,
  ExternalLink,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatTime, formatDate } from "@/lib/format";
import type { Booking, SavedSearch, FavouriteRoute } from "@/lib/db/schema";

export default function AccountPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "bookings" | "saved" | "favourites") || "bookings";

  const [activeTab, setActiveTab] = React.useState<"bookings" | "saved" | "favourites">(initialTab);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [savedSearches, setSavedSearches] = React.useState<SavedSearch[]>([]);
  const [favouriteRoutes, setFavouriteRoutes] = React.useState<FavouriteRoute[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [bookingsRes, savedRes, favsRes] = await Promise.all([
          fetch("/api/user/bookings").then((r) => r.json()),
          fetch("/api/user/saved-searches").then((r) => r.json()),
          fetch("/api/user/favourite-routes").then((r) => r.json()),
        ]);

        if (!cancelled) {
          if (bookingsRes?.bookings) setBookings(bookingsRes.bookings);
          if (savedRes?.savedSearches) setSavedSearches(savedRes.savedSearches);
          if (favsRes?.routes) setFavouriteRoutes(favsRes.routes);
        }
      } catch (err) {
        console.error("Failed to load account data:", err);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Delete saved search
  const handleDeleteSavedSearch = async (id: string) => {
    try {
      await fetch(`/api/user/saved-searches?id=${id}`, { method: "DELETE" });
      setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete saved search:", err);
    }
  };

  // Delete favourite route
  const handleDeleteFavourite = async (id: string) => {
    try {
      await fetch(`/api/user/favourite-routes?id=${id}`, { method: "DELETE" });
      setFavouriteRoutes((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Failed to delete favourite route:", err);
    }
  };

  return (
    <div className="flex-1 w-full bg-background min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Account Profile Header Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-heading font-extrabold text-2xl shadow-xs">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-extrabold text-foreground">
                  Aditya Mishra
                </h1>
                <Badge variant="accent" className="text-[10px] font-bold">
                  Verified Member
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                aditya@aerobook.in • Member since October 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-xs font-semibold gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border/80 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "bookings"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plane className="h-4 w-4" />
            <span>Booking History</span>
            <Badge variant="secondary" className="text-[10px] ml-1">
              {bookings.length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "saved"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Saved Searches</span>
            <Badge variant="secondary" className="text-[10px] ml-1">
              {savedSearches.length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("favourites")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "favourites"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Favourite Routes</span>
            <Badge variant="secondary" className="text-[10px] ml-1">
              {favouriteRoutes.length}
            </Badge>
          </button>
        </div>

        {/* TAB 1: BOOKING HISTORY */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
                <Plane className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="font-heading text-lg font-bold">No Bookings Found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  You have not made any flight bookings yet. Search and book flights to view your
                  reservations here.
                </p>
                <Button asChild className="mt-2 text-xs font-bold" variant="default">
                  <Link href="/">Search Flights</Link>
                </Button>
              </div>
            ) : (
              bookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="border-border shadow-xs hover:border-primary/40 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left: Carrier and Flight Info */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-heading font-extrabold text-sm shadow-xs">
                          {booking.carrierCode}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-base font-bold text-foreground">
                              {booking.carrierName} ({booking.flightNumber})
                            </span>
                            <Badge variant="success" className="text-[10px] font-bold">
                              Confirmed
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>
                              Booking Ref:{" "}
                              <strong className="font-mono text-foreground font-semibold">
                                {booking.bookingReference}
                              </strong>
                            </span>
                            <span>•</span>
                            <span>
                              PNR:{" "}
                              <strong className="font-mono text-primary font-semibold">
                                {booking.pnr}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Route & Times */}
                      <div className="flex items-center gap-6 text-xs">
                        <div>
                          <span className="font-heading text-lg font-extrabold text-foreground block">
                            {formatTime(booking.departureTime)}
                          </span>
                          <span className="font-mono font-bold text-primary">{booking.origin}</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <Plane className="h-4 w-4 text-primary" />
                          <span className="text-[10px] text-muted-foreground font-medium mt-1">
                            {formatDate(booking.departureTime, "medium")}
                          </span>
                        </div>

                        <div>
                          <span className="font-heading text-lg font-extrabold text-foreground block">
                            {formatTime(booking.arrivalTime)}
                          </span>
                          <span className="font-mono font-bold text-primary">
                            {booking.destination}
                          </span>
                        </div>
                      </div>

                      {/* Right: Price & View CTA */}
                      <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-4 lg:pt-0">
                        <div className="lg:text-right">
                          <span className="font-heading text-xl font-extrabold text-foreground block">
                            {formatCurrency(booking.totalAmount)}
                          </span>
                          <span className="text-[11px] text-muted-foreground">Paid in full</span>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs font-semibold gap-1.5"
                        >
                          <Link href="/booking/confirmation">
                            <span>View Ticket</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* TAB 2: SAVED SEARCHES */}
        {activeTab === "saved" && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Loading saved searches...</p>
              </div>
            ) : savedSearches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
                <Bookmark className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="font-heading text-lg font-bold">No Saved Searches</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Save flight searches while exploring itineraries to quickly monitor prices later.
                </p>
                <Button asChild className="mt-2 text-xs font-bold" variant="default">
                  <Link href="/">Explore Routes</Link>
                </Button>
              </div>
            ) : (
              savedSearches.map((search) => (
                <Card
                  key={search.id}
                  className="border-border shadow-xs hover:border-primary/40 transition-all"
                >
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent font-heading font-extrabold text-xs shadow-xs">
                        ✈
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-base font-bold text-foreground">
                            {search.fromCity} ({search.fromIata}) ➔ {search.toCity} ({search.toIata}
                            )
                          </span>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {search.trip}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Depart: {formatDate(search.departDate, "medium")} • {search.passengers}{" "}
                          passenger • {search.cabin} class
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="accent"
                        size="sm"
                        asChild
                        className="text-xs font-bold gap-1.5"
                      >
                        <Link
                          href={`/flights/${search.fromIata}-${search.toIata}?depart=${search.departDate}&trip=${search.trip}&cabin=${search.cabin}`}
                        >
                          <span>Search Again</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSavedSearch(search.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Remove saved search"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* TAB 3: FAVOURITE ROUTES */}
        {activeTab === "favourites" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Loading favourite routes...</p>
              </div>
            ) : favouriteRoutes.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
                <Heart className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="font-heading text-lg font-bold">No Favourite Routes</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Bookmark frequent travel corridors to search live fares in one click.
                </p>
              </div>
            ) : (
              favouriteRoutes.map((route) => (
                <Card
                  key={route.id}
                  className="border-border shadow-xs hover:border-primary/40 transition-all"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-xs">
                        {route.fromIata} ✈ {route.toIata}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => handleDeleteFavourite(route.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Remove favourite"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="font-heading text-base font-bold text-foreground">
                        {route.fromCity} to {route.toCity}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        High frequency corridor
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full text-xs font-bold gap-1.5"
                    >
                      <Link href={`/flights/${route.fromIata}-${route.toIata}`}>
                        <span>Check Live Flights</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
