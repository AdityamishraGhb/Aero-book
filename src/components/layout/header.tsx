import Link from "next/link";
import { Plane, Hotel, Car, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { LocaleCurrencySelector } from "./locale-currency-selector";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Product Mode Tabs */}
        <div className="flex items-center gap-8">
          <Logo size="md" />

          {/* Desktop Navigation Tabs */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-2">
            {/* Active Flights Tab */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary shadow-xs transition-colors hover:bg-primary/15"
              aria-current="page"
            >
              <Plane className="h-4 w-4" />
              <span>Flights</span>
            </Link>

            {/* Stays Tab (Disabled "Coming Soon") */}
            <div
              className="group relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground/60 cursor-not-allowed select-none"
              aria-disabled="true"
              role="link"
              title="Hotel & Stays comparison coming soon"
            >
              <Hotel className="h-4 w-4 text-muted-foreground/50" />
              <span>Stays</span>
              <span className="rounded-full bg-muted/80 px-1.5 py-0.2 text-[10px] font-semibold text-muted-foreground border border-border/70">
                Soon
              </span>
            </div>

            {/* Cars Tab (Disabled "Coming Soon") */}
            <div
              className="group relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground/60 cursor-not-allowed select-none"
              aria-disabled="true"
              role="link"
              title="Car rentals comparison coming soon"
            >
              <Car className="h-4 w-4 text-muted-foreground/50" />
              <span>Cars</span>
              <span className="rounded-full bg-muted/80 px-1.5 py-0.2 text-[10px] font-semibold text-muted-foreground border border-border/70">
                Soon
              </span>
            </div>
          </nav>
        </div>

        {/* Right Actions: Currency Selector, Saved Flights, Sign In, Mobile Nav */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LocaleCurrencySelector />
          </div>

          {/* Saved Trips / Shortlist Icon */}
          <button
            type="button"
            aria-label="Saved flights"
            title="Saved flights"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Saved flights</span>
          </button>

          {/* Login / Sign In Button */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex h-9 px-3.5 text-xs font-semibold gap-1.5 border-border hover:border-primary/50 hover:bg-card shadow-xs"
          >
            <User className="h-3.5 w-3.5 text-primary" />
            <span>Sign In</span>
          </Button>

          {/* Mobile Drawer Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
