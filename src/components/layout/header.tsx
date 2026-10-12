import Link from "next/link";
import { Plane, Compass, HelpCircle } from "lucide-react";
import { Logo } from "./logo";
import { LocaleCurrencySelector } from "./locale-currency-selector";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Logo size="md" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              <Plane className="h-4 w-4 text-primary" />
              <span>Flights</span>
            </Link>
            <Link
              href="/#popular-routes"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Routes</span>
            </Link>
            <Link
              href="/#faq"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help & FAQ</span>
            </Link>
          </nav>
        </div>

        {/* Right Actions: Currency Selector + Mobile Nav */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LocaleCurrencySelector />
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
