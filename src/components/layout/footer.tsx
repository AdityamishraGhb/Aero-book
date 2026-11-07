"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Zap, Globe2 } from "lucide-react";
import { Logo } from "./logo";

function CurrentYear() {
  const year = React.useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => 2026
  );

  return <>{year}</>;
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-white transition-colors">
      {/* Brand Aesthetic Ribbon from Style Guide: TRAVEL | EXPLORE | BOOK | REPEAT */}
      <div className="border-b border-[#163247] bg-[#0B1F2D] text-white py-2.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] font-heading font-semibold tracking-[0.25em] uppercase">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#D4A017]" />
            <span className="w-2 h-2 rounded-full bg-[#6B7280]" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
            <span className="text-xs font-normal normal-case tracking-normal text-white/70 hidden sm:inline">
              Official Brand Identity
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-white/90">
            <span className="hover:text-[#D4A017] transition-colors">TRAVEL</span>
            <span className="text-white/30">|</span>
            <span className="hover:text-[#D4A017] transition-colors">EXPLORE</span>
            <span className="text-white/30">|</span>
            <span className="hover:text-[#D4A017] transition-colors">BOOK</span>
            <span className="text-white/30">|</span>
            <span className="text-[#D4A017] font-bold">REPEAT</span>
            <span className="text-[#D4A017] text-sm ml-1 select-none">✈</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <Logo size="md" withTagline={true} />
            <p className="text-base font-bold text-[#0B1F2D] font-heading">
              Your Next Journey, <span className="text-[#D4A017]">Simplified.</span>
            </p>
            <p className="max-w-sm text-xs leading-relaxed text-[#6B7280]">
              AeroBook is a modern metasearch and travel intelligence platform delivering unbiased
              flight comparisons, transparent fare breakdowns, and direct booking paths across
              hundreds of global carriers.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#6B7280]">
              <span className="inline-flex items-center gap-1 font-medium text-[#0B1F2D]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#D4A017]" />
                Verified Fares
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-[#0B1F2D]">
                <Zap className="h-3.5 w-3.5 text-[#D4A017]" />
                Zero Booking Fees
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-[#0B1F2D]">
                <Globe2 className="h-3.5 w-3.5 text-[#D4A017]" />
                Global Network
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
              Explore Flights
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/routes"
                  className="hover:text-primary transition-colors font-semibold text-primary"
                >
                  Top 20 Indian Flight Routes
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Search All Flights
                </Link>
              </li>
              <li>
                <Link href="/#popular-routes" className="hover:text-primary transition-colors">
                  Popular Indian Routes
                </Link>
              </li>
              <li>
                <Link href="/#popular-routes" className="hover:text-primary transition-colors">
                  Direct Flights Only
                </Link>
              </li>
              <li>
                <Link href="/#popular-routes" className="hover:text-primary transition-colors">
                  Last-Minute Weekend Escapes
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div className="space-y-3">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
              About AeroBook
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/#why-aerobook" className="hover:text-primary transition-colors">
                  Why Choose AeroBook
                </Link>
              </li>
              <li>
                <Link href="/#why-aerobook" className="hover:text-primary transition-colors">
                  Our Fare Scoring Algorithm
                </Link>
              </li>
              <li>
                <Link href="/#why-aerobook" className="hover:text-primary transition-colors">
                  Carrier Partnerships
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-primary transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support, Legal & Dev */}
          <div className="space-y-3">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
              Legal & Dev
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/#faq" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/dev/ui"
                  className="text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  UI Design System (/dev/ui)
                </Link>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © <CurrentYear /> AeroBook Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HeartHandshake className="h-3.5 w-3.5 text-primary" />
            <span>Built with precision for seamless journey planning</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
