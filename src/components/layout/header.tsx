import Link from "next/link";
import { Plane, Hotel, Car, Heart, User, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { LocaleCurrencySelector } from "./locale-currency-selector";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#0b335c] bg-[#05203c] text-white shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Product Mode Tabs */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Logo size="md" variant="light" />

          {/* Desktop Navigation Tabs matching Skyscanner header */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-2">
            {/* Active Flights Tab */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#0062E3] px-4 py-1.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0052bd]"
              aria-current="page"
            >
              <Plane className="h-4 w-4" />
              <span>Flights</span>
            </Link>

            {/* Stays Tab (Coming soon) */}
            <div
              className="group relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-white/70 cursor-not-allowed select-none hover:text-white"
              aria-disabled="true"
              role="link"
              title="Hotel & Stays comparison coming soon"
            >
              <Hotel className="h-4 w-4 text-white/60" />
              <span>Stays</span>
              <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px] font-semibold text-white/80 border border-white/20">
                Soon
              </span>
            </div>

            {/* Cars Tab (Coming soon) */}
            <div
              className="group relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-white/70 cursor-not-allowed select-none hover:text-white"
              aria-disabled="true"
              role="link"
              title="Car rentals comparison coming soon"
            >
              <Car className="h-4 w-4 text-white/60" />
              <span>Cars</span>
              <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px] font-semibold text-white/80 border border-white/20">
                Soon
              </span>
            </div>
          </nav>
        </div>

        {/* Right Actions: Help, Currency Selector, Saved Flights, Sign In, Mobile Nav */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Help link */}
          <Link
            href="#faq"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help</span>
          </Link>

          <div className="hidden sm:block">
            <LocaleCurrencySelector />
          </div>

          {/* Saved Trips / Shortlist Icon */}
          <Link
            href="/account?tab=saved"
            aria-label="Saved flights"
            title="Saved flights"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Saved flights</span>
          </Link>

          {/* Login / Account Button */}
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex h-9 px-4 text-xs font-bold gap-1.5 bg-white text-[#05203c] hover:bg-white/90 border-0 rounded-lg shadow-xs"
          >
            <Link href="/account" aria-label="Account">
              <User className="h-3.5 w-3.5 text-[#05203c]" />
              <span>Account</span>
            </Link>
          </Button>

          {/* Mobile Drawer Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
