"use client";

import * as React from "react";
import { Users, Plus, Minus, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TravellersPopoverProps {
  adults: number;
  childrenCount: number;
  infants: number;
  cabin: "economy" | "premium-economy" | "business" | "first";
  onChange: (data: {
    adults: number;
    children: number;
    infants: number;
    cabin: "economy" | "premium-economy" | "business" | "first";
  }) => void;
  variant?: "default" | "unified";
  className?: string;
}

const CABIN_OPTIONS: Array<{
  value: "economy" | "premium-economy" | "business" | "first";
  label: string;
}> = [
  { value: "economy", label: "Economy" },
  { value: "premium-economy", label: "Premium Economy" },
  { value: "business", label: "Business Class" },
  { value: "first", label: "First Class" },
];

export function TravellersPopover({
  adults,
  childrenCount,
  infants,
  cabin,
  onChange,
  variant = "default",
  className,
}: TravellersPopoverProps) {
  const [open, setOpen] = React.useState(false);

  const totalTravellers = adults + childrenCount + infants;

  const updateCount = (type: "adults" | "children" | "infants", delta: number) => {
    let newAdults = adults;
    let newChildren = childrenCount;
    let newInfants = infants;

    if (type === "adults") {
      newAdults = Math.max(1, Math.min(9, adults + delta));
      // Ensure infants don't exceed adults
      if (newInfants > newAdults) {
        newInfants = newAdults;
      }
    } else if (type === "children") {
      newChildren = Math.max(0, Math.min(8, childrenCount + delta));
    } else if (type === "infants") {
      newInfants = Math.max(0, Math.min(adults, infants + delta));
    }

    // Ensure total adults + children <= 9
    if (newAdults + newChildren > 9) return;

    onChange({
      adults: newAdults,
      children: newChildren,
      infants: newInfants,
      cabin,
    });
  };

  const handleCabinChange = (newCabin: "economy" | "premium-economy" | "business" | "first") => {
    onChange({
      adults,
      children: childrenCount,
      infants,
      cabin: newCabin,
    });
  };

  const cabinLabel = CABIN_OPTIONS.find((c) => c.value === cabin)?.label || "Economy";
  const summaryText = `${totalTravellers} ${totalTravellers === 1 ? "Traveller" : "Travellers"}, ${cabinLabel}`;

  const isUnified = variant === "unified";

  return (
    <div
      className={cn(
        isUnified
          ? "relative flex-1 min-w-0 h-full flex flex-col justify-center"
          : "relative flex-1 min-w-[200px]",
        className
      )}
    >
      {!isUnified && (
        <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
          Travellers & Cabin
        </span>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Travellers: ${summaryText}`}
            className={cn(
              isUnified
                ? "w-full h-full text-left px-4 py-2.5 flex flex-col justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0062E3] hover:bg-slate-50 cursor-pointer select-none"
                : "w-full flex items-center justify-between text-left h-14 px-3.5 rounded-xl border bg-card transition-all shadow-xs hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
              isUnified
                ? open
                  ? "bg-slate-50"
                  : "bg-white"
                : open
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border"
            )}
          >
            {isUnified ? (
              <>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  Travellers and cabin class
                </span>
                <div className="font-heading text-sm sm:text-base font-bold text-slate-900 truncate">
                  {totalTravellers} {totalTravellers === 1 ? "Adult" : "Travellers"}, {cabinLabel}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <div className="font-heading text-sm sm:text-base font-bold text-foreground truncate">
                    {totalTravellers} {totalTravellers === 1 ? "Traveller" : "Travellers"}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{cabinLabel}</p>
                </div>
              </div>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[300px] sm:w-[340px] p-4 shadow-soft-lg"
          align="end"
          sideOffset={6}
        >
          <div className="space-y-4">
            <div className="font-heading text-sm font-bold text-foreground border-b border-border pb-2">
              Travellers (Max 9)
            </div>

            {/* Adults Stepper */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Adults</p>
                <p className="text-[11px] text-muted-foreground">Age 12+ years</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={adults <= 1}
                  onClick={() => updateCount("adults", -1)}
                  aria-label="Decrease adult count"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-5 text-center font-bold text-sm text-foreground">{adults}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={adults + childrenCount >= 9}
                  onClick={() => updateCount("adults", 1)}
                  aria-label="Increase adult count"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Children Stepper */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Children</p>
                <p className="text-[11px] text-muted-foreground">Age 2-11 years</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={childrenCount <= 0}
                  onClick={() => updateCount("children", -1)}
                  aria-label="Decrease children count"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-5 text-center font-bold text-sm text-foreground">
                  {childrenCount}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={adults + childrenCount >= 9}
                  onClick={() => updateCount("children", 1)}
                  aria-label="Increase children count"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Infants Stepper */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Infants</p>
                <p className="text-[11px] text-muted-foreground">Under 2 years (on lap)</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={infants <= 0}
                  onClick={() => updateCount("infants", -1)}
                  aria-label="Decrease infant count"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-5 text-center font-bold text-sm text-foreground">{infants}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={infants >= adults}
                  onClick={() => updateCount("infants", 1)}
                  aria-label="Increase infant count"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Cabin Class Selection */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground">Cabin Class</span>
              <div className="grid grid-cols-2 gap-1.5">
                {CABIN_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleCabinChange(opt.value)}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-colors",
                      cabin === opt.value
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <span>{opt.label}</span>
                    {cabin === opt.value && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="default"
              size="sm"
              className="w-full mt-2"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
