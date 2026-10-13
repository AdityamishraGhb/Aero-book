"use client";

import * as React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AvailableAirline {
  code: string;
  name: string;
  count: number;
  minPrice: number;
}

export interface FilterState {
  stops: "all" | "0" | "1";
  selectedAirlines: string[]; // empty means all
  departureWindow: "all" | "morning" | "afternoon" | "evening";
  maxPrice?: number;
}

interface FiltersSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableAirlines: AvailableAirline[];
  minPricePossible: number;
  maxPricePossible: number;
  onResetFilters: () => void;
  className?: string;
}

export function FiltersSidebar({
  filters,
  onFilterChange,
  availableAirlines,
  minPricePossible,
  maxPricePossible,
  onResetFilters,
  className,
}: FiltersSidebarProps) {
  const currentMaxPrice = filters.maxPrice ?? maxPricePossible;

  const handleStopChange = (val: "all" | "0" | "1") => {
    onFilterChange({ ...filters, stops: val });
  };

  const handleAirlineToggle = (code: string) => {
    const isSelected = filters.selectedAirlines.includes(code);
    let updated: string[];

    if (isSelected) {
      updated = filters.selectedAirlines.filter((c) => c !== code);
    } else {
      updated = [...filters.selectedAirlines, code];
    }

    onFilterChange({ ...filters, selectedAirlines: updated });
  };

  const handleWindowChange = (win: "all" | "morning" | "afternoon" | "evening") => {
    onFilterChange({ ...filters, departureWindow: win });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, maxPrice: value[0] });
  };

  const isFiltered =
    filters.stops !== "all" ||
    filters.selectedAirlines.length > 0 ||
    filters.departureWindow !== "all" ||
    (filters.maxPrice !== undefined && filters.maxPrice < maxPricePossible);

  return (
    <div
      data-testid="filters-sidebar"
      className={cn("rounded-2xl border border-border bg-card p-5 shadow-xs space-y-6", className)}
    >
      {/* Title & Reset Button */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="font-heading text-sm font-bold text-foreground">Filter Flights</h3>
        </div>

        {isFiltered && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onResetFilters}
            className="text-[11px] text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {/* 1. Stops Filter */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Stops
        </span>
        <div className="flex flex-col gap-1.5 text-xs">
          {[
            { id: "all" as const, label: "Any number of stops" },
            { id: "0" as const, label: "Non-stop only" },
            { id: "1" as const, label: "1 stop maximum" },
          ].map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="stops-filter"
                checked={filters.stops === opt.id}
                onChange={() => handleStopChange(opt.id)}
                className="h-4 w-4 text-primary focus:ring-primary accent-primary"
              />
              <span className="font-medium text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Price Range Slider */}
      {maxPricePossible > minPricePossible && (
        <div className="space-y-3 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Max Price
            </span>
            <span className="font-heading text-xs font-bold text-primary">
              Up to {formatCurrency(currentMaxPrice)}
            </span>
          </div>

          <Slider
            min={minPricePossible}
            max={maxPricePossible}
            step={200}
            value={[currentMaxPrice]}
            onValueChange={handlePriceChange}
          />

          <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
            <span>{formatCurrency(minPricePossible)}</span>
            <span>{formatCurrency(maxPricePossible)}</span>
          </div>
        </div>
      )}

      {/* 3. Departure Window */}
      <div className="space-y-2.5 pt-4 border-t border-border/60">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Departure Times
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { id: "all" as const, label: "All Day" },
            { id: "morning" as const, label: "Morning (06-12)" },
            { id: "afternoon" as const, label: "Afternoon (12-18)" },
            { id: "evening" as const, label: "Evening (18-24)" },
          ].map((win) => (
            <button
              key={win.id}
              type="button"
              onClick={() => handleWindowChange(win.id)}
              className={cn(
                "py-2 px-2.5 rounded-lg border text-center transition-colors font-medium text-[11px]",
                filters.departureWindow === win.id
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {win.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Airlines */}
      {availableAirlines.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-border/60">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Airlines ({availableAirlines.length})
          </span>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {availableAirlines.map((airline) => {
              const isChecked =
                filters.selectedAirlines.length === 0 ||
                filters.selectedAirlines.includes(airline.code);

              return (
                <label
                  key={airline.code}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted/50 cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAirlineToggle(airline.code)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                    />
                    <span className="font-medium text-foreground">{airline.name}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {formatCurrency(airline.minPrice)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
