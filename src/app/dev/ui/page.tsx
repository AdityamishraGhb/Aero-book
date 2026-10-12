"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plane,
  ArrowRight,
  Sparkles,
  Search,
  SlidersHorizontal,
  Heart,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Luggage,
  Loader2,
  Hotel,
  ChevronRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UIDesignSystemPage() {
  // Interactive playground state
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [cabinClass, setCabinClass] = React.useState("economy");

  return (
    <div className="flex-1 w-full bg-background py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Hero Header */}
        <div className="border-b border-border/80 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Phase 2 Design System</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span className="text-foreground">Token & Component Library</span>
              </div>
              <h1 className="mt-3 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                AeroBook UI Showroom
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Living design tokens, reusable layout components, accessible interactive primitives,
                and state behaviors tuned to the AeroBook flight metasearch experience.
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/">
                <Plane className="h-4 w-4 text-primary" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>

          {/* Quick Nav Anchors */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="py-1 text-muted-foreground font-medium">Quick jump:</span>
            {[
              { id: "tokens", label: "Brand Tokens" },
              { id: "typography", label: "Typography" },
              { id: "buttons", label: "Buttons" },
              { id: "inputs", label: "Inputs & Selects" },
              { id: "badges", label: "Badges & Tags" },
              { id: "cards", label: "Cards & Flight Previews" },
              { id: "states", label: "State Playground" },
            ].map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                className="rounded-lg border border-border bg-card px-2.5 py-1 text-foreground/80 hover:border-primary/50 hover:text-primary transition-colors"
              >
                {anchor.label}
              </a>
            ))}
          </div>
        </div>

        {/* SECTION 1: Brand Tokens & Color Palette */}
        <section id="tokens" className="space-y-6 scroll-mt-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Section 2 Brand Tokens
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground">
              Color Palette & Design Tokens
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Harmonious color system calibrated for high readability and calming travel ergonomics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {/* Ink */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="h-16 w-full rounded-lg bg-[var(--ink)] shadow-inner" />
              <div className="mt-3">
                <span className="font-heading text-xs font-bold text-foreground">Ink</span>
                <p className="text-[11px] text-muted-foreground font-mono">#0B1F2A</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Core high-contrast ink</p>
              </div>
            </div>

            {/* Surface */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="h-16 w-full rounded-lg bg-[var(--surface)] border border-border shadow-inner" />
              <div className="mt-3">
                <span className="font-heading text-xs font-bold text-foreground">Surface</span>
                <p className="text-[11px] text-muted-foreground font-mono">#F7F5F2</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Warm canvas background</p>
              </div>
            </div>

            {/* Primary Teal */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="h-16 w-full rounded-lg bg-[var(--primary)] shadow-inner" />
              <div className="mt-3">
                <span className="font-heading text-xs font-bold text-foreground">Primary Teal</span>
                <p className="text-[11px] text-muted-foreground font-mono">#0E7C7B</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Brand anchor & links</p>
              </div>
            </div>

            {/* Accent Coral */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="h-16 w-full rounded-lg bg-[var(--accent)] shadow-inner" />
              <div className="mt-3">
                <span className="font-heading text-xs font-bold text-foreground">Accent Coral</span>
                <p className="text-[11px] text-muted-foreground font-mono">#FF6B4A</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Conversion & booking CTAs
                </p>
              </div>
            </div>

            {/* Muted Sand */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="h-16 w-full rounded-lg bg-[var(--muted)] border border-border shadow-inner" />
              <div className="mt-3">
                <span className="font-heading text-xs font-bold text-foreground">
                  Muted / Secondary
                </span>
                <p className="text-[11px] text-muted-foreground font-mono">#EEEBE6</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Subtle card fills & tags</p>
              </div>
            </div>

            {/* Border Subtle */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="h-16 w-full rounded-lg bg-[var(--border)] shadow-inner" />
              <div className="mt-3">
                <span className="font-heading text-xs font-bold text-foreground">
                  Border Subtle
                </span>
                <p className="text-[11px] text-muted-foreground font-mono">#E4E1DC</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Divider lines & inputs</p>
              </div>
            </div>
          </div>

          {/* Semantic Status Colors & Radius */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Semantic State Tones</CardTitle>
                <CardDescription>
                  Engineered for airline alert badges, on-time status, and price alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Success / On-Time / Lowest Fare
                  </span>
                  <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                    #16A34A
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800">
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Warning / Layover Alert / Last Seats
                  </span>
                  <span className="font-mono text-xs text-amber-700 dark:text-amber-400">
                    #D97706
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800">
                  <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                    Destructive / Flight Sold Out / Cancelled
                  </span>
                  <span className="font-mono text-xs text-rose-700 dark:text-rose-400">
                    #DC2626
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Border Radii & Elevation Matrix</CardTitle>
                <CardDescription>
                  Gentle, modern corner geometry that prevents harsh boxy edges.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Radius Small (Buttons, Tags)</span>
                  <span className="font-mono text-foreground font-semibold">
                    calc(var(--radius) * 0.6) = 7.2px
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Radius Base (Standard Cards, Inputs)
                  </span>
                  <span className="font-mono text-foreground font-semibold">
                    var(--radius) = 12px (0.75rem)
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Radius Large (Featured Sheets, Modals)
                  </span>
                  <span className="font-mono text-foreground font-semibold">
                    calc(var(--radius) * 1.66) = 20px
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Soft Shadows</span>
                  <span className="font-mono text-foreground font-semibold">
                    soft-sm, soft-md, soft-lg, soft-xl
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 2: Typography */}
        <section id="typography" className="space-y-6 scroll-mt-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Typography Stack
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground">
              Plus Jakarta Sans & Inter
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Dual font pairing providing editorial heading presence and high legibility UI text.
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between border-b border-border/60 pb-1">
                  <span className="font-mono text-xs text-muted-foreground">
                    Display H1 (Plus Jakarta Sans 800)
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    48px / tracking-tight
                  </span>
                </div>
                <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground">
                  Fly smarter. Book anywhere.
                </h1>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between border-b border-border/60 pb-1">
                  <span className="font-mono text-xs text-muted-foreground">
                    Heading H2 (Plus Jakarta Sans 700)
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">30px / font-bold</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  Engineered for clarity and speed
                </h2>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between border-b border-border/60 pb-1">
                  <span className="font-mono text-xs text-muted-foreground">
                    Body Text (Inter 400 & 500)
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    14px / leading-relaxed
                  </span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                  AeroBook metasearch aggregates hundreds of daily airline frequencies with
                  real-time baggage allowances, transparent tax breakdowns, and intelligent
                  multi-segment scoring.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between border-b border-border/60 pb-1">
                  <span className="font-mono text-xs text-muted-foreground">
                    Tabular Numbers & IATA Codes
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    DD/MM/YYYY • 14:35 • DEL ✈ BOM
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-6 font-mono text-sm text-foreground">
                  <span className="font-bold text-primary">DEL → BOM</span>
                  <span>14:35 - 16:45 (2h 10m)</span>
                  <span className="font-bold text-accent">₹4,299</span>
                  <span className="text-muted-foreground">PNR: 6E-8832</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 3: Buttons */}
        <section id="buttons" className="space-y-6 scroll-mt-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Button Component System
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground">
              Buttons & Action Triggers
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Complete set of variants, sizes, icon alignments, and interaction states.
            </p>
          </div>

          {/* Variants Showcase */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Button Variants</CardTitle>
              <CardDescription>
                Choose the appropriate visual weight for primary, secondary, and destructive
                actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default">
                  <span>Primary Teal</span>
                </Button>
                <Button variant="accent">
                  <Sparkles className="h-4 w-4" />
                  <span>Accent Coral</span>
                </Button>
                <Button variant="secondary">
                  <span>Secondary Sand</span>
                </Button>
                <Button variant="outline">
                  <span>Outline Button</span>
                </Button>
                <Button variant="ghost">
                  <span>Ghost Button</span>
                </Button>
                <Button variant="destructive">
                  <span>Destructive</span>
                </Button>
                <Button variant="link">
                  <span>Text Link</span>
                </Button>
              </div>

              <Separator />

              {/* Sizes Showcase */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Scale & Sizing Hierarchy
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs" variant="outline">
                    Extra Small (xs)
                  </Button>
                  <Button size="sm" variant="outline">
                    Small (sm)
                  </Button>
                  <Button size="default" variant="outline">
                    Default (md)
                  </Button>
                  <Button size="lg" variant="default" className="gap-2">
                    <Plane className="h-4 w-4" />
                    <span>Large Primary (lg)</span>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Icon Buttons */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Icon Alignments & Icon-Only Triggers
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="default" className="gap-2">
                    <Search className="h-4 w-4" />
                    <span>Search Flights</span>
                  </Button>
                  <Button variant="accent" className="gap-2">
                    <span>View Deal</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Favorite flight">
                    <Heart className="h-4 w-4 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Filter routes">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" />
                    <span>Sign In</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 4: Inputs, Selects & Forms */}
        <section id="inputs" className="space-y-6 scroll-mt-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Form Controls
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground">
              Inputs, Selects & Field States
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Accessible flight parameters, origin/destination inputs, and dropdown selectors.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Standard Input & Leading Icon Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Text Inputs</CardTitle>
                <CardDescription>
                  Standard, icon-embedded, and disabled input states.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Departure Airport (City or IATA)
                  </label>
                  <Input placeholder="e.g. New Delhi (DEL)" />
                  <span className="text-[11px] text-muted-foreground">
                    Accepts 3-letter IATA code or city name.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Search Carrier / Airline
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="e.g. IndiGo, Air India, Emirates..." />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Disabled Parameter Field
                  </label>
                  <Input disabled value="Pre-selected Domestic Corridor" />
                </div>
              </CardContent>
            </Card>

            {/* Error States & Radix Select */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Validation States & Selects</CardTitle>
                <CardDescription>
                  Error validation styling and Radix dropdown menus.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Cabin Class Selector
                  </label>
                  <Select value={cabinClass} onValueChange={setCabinClass}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select cabin class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy Class</SelectItem>
                      <SelectItem value="premium-economy">Premium Economy</SelectItem>
                      <SelectItem value="business">Business Class</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-[11px] text-muted-foreground">
                    Selected: {cabinClass.replace("-", " ")}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-destructive">
                    Airport Code (Invalid State)
                  </label>
                  <Input error defaultValue="XYZ99" aria-invalid="true" />
                  <div className="flex items-center gap-1.5 text-[11px] text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Airport code not found in global 1,200+ airport index.</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Validated Route (Success State)
                  </label>
                  <div className="relative">
                    <Input
                      defaultValue="BOM — Chhatrapati Shivaji Maharaj Intl"
                      className="border-emerald-500 focus-visible:ring-emerald-500/20 pr-9"
                    />
                    <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 5: Badges & Status Tokens */}
        <section id="badges" className="space-y-6 scroll-mt-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Micro-Tokens & Indicators
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground">
              Badges & Status Micro-Tokens
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Visual markers for flight algorithm rankings, stops, baggage policies, and
              availability.
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Standard Badge Variants
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">Primary Badge</Badge>
                  <Badge variant="accent">Accent Coral</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="success">Success / Live</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="destructive">Sold Out</Badge>
                  <Badge variant="muted">Muted</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  AeroBook Flight Metadata Badges
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="accent" className="gap-1 px-3 py-1 text-xs font-bold shadow-xs">
                    <Sparkles className="h-3 w-3" />
                    <span>Best Score: 9.4</span>
                  </Badge>

                  <Badge variant="success" className="gap-1 px-3 py-1 text-xs font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Cheapest ₹3,999</span>
                  </Badge>

                  <Badge variant="default" className="gap-1 px-3 py-1 text-xs font-semibold">
                    <Clock className="h-3 w-3" />
                    <span>Fastest (1h 55m)</span>
                  </Badge>

                  <Badge variant="outline" className="gap-1 px-2.5 py-1 text-xs font-medium">
                    <Plane className="h-3 w-3 text-primary" />
                    <span>Non-Stop</span>
                  </Badge>

                  <Badge variant="warning" className="gap-1 px-2.5 py-1 text-xs font-medium">
                    <Luggage className="h-3 w-3" />
                    <span>Cabin Bag Only</span>
                  </Badge>

                  <Badge variant="muted" className="gap-1 px-2.5 py-1 text-xs font-medium">
                    <Hotel className="h-3 w-3" />
                    <span>Stays Coming Soon</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 6: Cards & Live Flight Card Preview */}
        <section id="cards" className="space-y-6 scroll-mt-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Card Primitives & Domain Previews
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground">
              Cards & Flight Result Previews
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Rich container cards powering flight search listings and informational panels.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Base Standard Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Container</Badge>
                  <span className="text-xs text-muted-foreground font-mono">Card.tsx</span>
                </div>
                <CardTitle className="mt-2 text-base">Standard Container Card</CardTitle>
                <CardDescription>
                  Base card component with structured header, content body, and action footer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Employs rounded-2xl geometry, subtle border-border stroke, and shadow-soft-sm
                  elevation.
                </p>
              </CardContent>
              <CardFooter className="justify-between border-t border-border/60 pt-4">
                <span className="text-xs text-muted-foreground">Interactive demo</span>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            {/* Feature Pillar Card */}
            <Card className="hover:border-primary/50 transition-all hover:shadow-soft-md group">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle className="mt-4 text-base">Feature Pillar Card</CardTitle>
                <CardDescription>
                  Icon badge highlight with smooth scale-up hover feedback.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Used on the landing page for trust indicators, scoring transparency, and provider
                  guarantees.
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Link
                  href="#tokens"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Explore Architecture</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </CardFooter>
            </Card>

            {/* Fare Class Option Card */}
            <Card className="border-accent/40 bg-accent/[0.02]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="accent">Popular Choice</Badge>
                  <span className="font-heading text-lg font-bold text-accent">₹5,499</span>
                </div>
                <CardTitle className="mt-2 text-base">Flexi Plus Fare</CardTitle>
                <CardDescription>
                  Includes free seat choice, 15kg check-in baggage, and flexible date change.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Cabin baggage 7kg included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Check-in luggage 15kg included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Free rescheduling up to 4h prior</span>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/60">
                <Button variant="accent" className="w-full text-xs font-semibold">
                  Choose Flexi
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Full-width Flight Result Card Preview */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Full-Fledged Flight Result Itinerary Card Preview
              </span>
              <Badge variant="outline" className="text-primary border-primary/30">
                Phase 3 / 4 Foundation
              </Badge>
            </div>

            <Card className="hover:border-primary/50 hover:shadow-soft-md transition-all">
              <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Airline info + Times timeline */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1">
                  {/* Airline Identifier */}
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                      6E
                    </div>
                    <div>
                      <p className="font-heading text-sm font-bold text-foreground">IndiGo</p>
                      <p className="text-xs text-muted-foreground">6E-204 • A321neo</p>
                    </div>
                  </div>

                  {/* Flight Timeline */}
                  <div className="flex items-center gap-4 flex-1 max-w-md">
                    <div>
                      <span className="font-heading text-lg sm:text-xl font-bold text-foreground">
                        06:00
                      </span>
                      <p className="text-xs text-muted-foreground font-mono">DEL (T3)</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-[11px] font-medium text-muted-foreground mb-1">
                        2h 15m (Non-stop)
                      </span>
                      <div className="w-full flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <div className="h-0.5 flex-1 bg-primary/30 relative">
                          <Plane className="h-3.5 w-3.5 text-primary absolute left-1/2 -top-1.5 -translate-x-1/2" />
                        </div>
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                        98% On-Time
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-heading text-lg sm:text-xl font-bold text-foreground">
                        08:15
                      </span>
                      <p className="text-xs text-muted-foreground font-mono">BOM (T2)</p>
                    </div>
                  </div>
                </div>

                {/* Score badge, Price & Book CTA */}
                <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/80">
                  <div className="flex flex-col items-end">
                    <Badge variant="accent" className="text-[11px] font-bold px-2 py-0.5 mb-1">
                      Best Score: 9.4
                    </Badge>
                    <span className="font-heading text-2xl font-extrabold text-foreground">
                      ₹4,299
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Total per adult incl. taxes
                    </span>
                  </div>

                  <Button
                    variant="accent"
                    className="h-11 px-6 text-sm font-semibold gap-2 shadow-xs"
                  >
                    <span>Select Deal</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* SECTION 7: Interactive States Playground */}
        <section id="states" className="space-y-6 scroll-mt-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Live State Sandbox
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground">
              Interactive State Matrix
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Test hover, active, focus-visible, disabled, and async loading behavior across buttons
              and inputs.
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Control State Switches</CardTitle>
                  <CardDescription>
                    Toggle simulated conditions below to inspect component adaptations.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant={isLoading ? "accent" : "outline"}
                    onClick={() => setIsLoading(!isLoading)}
                    className="text-xs"
                  >
                    {isLoading ? "Loading: ON" : "Toggle Loading"}
                  </Button>

                  <Button
                    size="sm"
                    variant={isDisabled ? "accent" : "outline"}
                    onClick={() => setIsDisabled(!isDisabled)}
                    className="text-xs"
                  >
                    {isDisabled ? "Disabled: ON" : "Toggle Disabled"}
                  </Button>

                  <Button
                    size="sm"
                    variant={hasError ? "destructive" : "outline"}
                    onClick={() => setHasError(!hasError)}
                    className="text-xs"
                  >
                    {hasError ? "Error: ON" : "Toggle Error State"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Primary Action
                  </span>
                  <Button
                    variant="default"
                    disabled={isDisabled}
                    className="w-full justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{isLoading ? "Searching Flights..." : "Search Routes"}</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Accent Booking
                  </span>
                  <Button
                    variant="accent"
                    disabled={isDisabled}
                    className="w-full justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{isLoading ? "Securing Fare..." : "Confirm Booking"}</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Outline Trigger
                  </span>
                  <Button
                    variant="outline"
                    disabled={isDisabled}
                    className="w-full justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Reset Parameters</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Dynamic Form Field</label>
                <Input
                  disabled={isDisabled}
                  error={hasError}
                  placeholder="Interactive test field..."
                  defaultValue="BLR — Kempegowda International Airport"
                />
                {hasError && (
                  <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Simulated validation error triggered.
                  </p>
                )}
                {isDisabled && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Info className="h-3.5 w-3.5" />
                    Field is currently locked and disabled.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
