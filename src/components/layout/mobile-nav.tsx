"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Plane, Compass, HelpCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { LocaleCurrencySelector } from "./locale-currency-selector";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  const links = [
    { href: "/", label: "Search Flights", icon: Plane },
    { href: "/#popular-routes", label: "Popular Routes", icon: Compass },
    { href: "/#why-aerobook", label: "Why AeroBook", icon: ShieldCheck },
    { href: "/#faq", label: "Help & FAQ", icon: HelpCircle },
  ];

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
      <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <SheetHeader className="text-left pb-4 border-b border-border/80">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Logo size="sm" />
          </SheetHeader>

          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Currency</span>
            <LocaleCurrencySelector />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            AeroBook • Fly smarter. Book anywhere.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
