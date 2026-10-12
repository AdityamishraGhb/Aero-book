"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Plane, Hotel, Car, Heart, User, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./logo";
import { LocaleCurrencySelector } from "./locale-currency-selector";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 text-foreground hover:bg-muted"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[350px] p-6 flex flex-col justify-between"
      >
        <div className="space-y-6">
          <SheetHeader className="text-left pb-4 border-b border-border/80">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Logo size="sm" />
          </SheetHeader>

          {/* Product Category Tabs */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3">
              Categories
            </span>
            <div className="mt-2 flex flex-col gap-1">
              {/* Flights - Active */}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold bg-primary/10 text-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Plane className="h-4 w-4" />
                  <span>Flights</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-primary bg-primary/15 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </Link>

              {/* Stays - Disabled */}
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground/60 cursor-not-allowed select-none"
                aria-disabled="true"
              >
                <div className="flex items-center gap-3">
                  <Hotel className="h-4 w-4 text-muted-foreground/50" />
                  <span>Stays</span>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/70">
                  Soon
                </span>
              </div>

              {/* Cars - Disabled */}
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground/60 cursor-not-allowed select-none"
                aria-disabled="true"
              >
                <div className="flex items-center gap-3">
                  <Car className="h-4 w-4 text-muted-foreground/50" />
                  <span>Cars</span>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/70">
                  Soon
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1 pt-4 border-t border-border/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3">
              User Actions
            </span>
            <div className="mt-2 flex flex-col gap-1">
              <Link
                href="#saved"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
              >
                <Heart className="h-4 w-4 text-primary" />
                <span>Saved Flights</span>
              </Link>

              <Link
                href="/dev/ui"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
              >
                <Layers className="h-4 w-4 text-accent" />
                <span>UI Design System (/dev/ui)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer actions in drawer */}
        <div className="pt-6 border-t border-border/80 space-y-4">
          <Button
            variant="outline"
            className="w-full justify-center gap-2 h-10 font-semibold"
            onClick={() => setOpen(false)}
          >
            <User className="h-4 w-4 text-primary" />
            <span>Sign In / Create Account</span>
          </Button>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Currency</span>
            <LocaleCurrencySelector />
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            AeroBook • Fly smarter. Book anywhere.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
