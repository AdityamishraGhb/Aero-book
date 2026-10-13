"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FiltersSidebar, type FilterState, type AvailableAirline } from "./filters-sidebar";

interface MobileFiltersSheetProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableAirlines: AvailableAirline[];
  minPricePossible: number;
  maxPricePossible: number;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export function MobileFiltersSheet({
  filters,
  onFilterChange,
  availableAirlines,
  minPricePossible,
  maxPricePossible,
  onResetFilters,
  totalFilteredCount,
}: MobileFiltersSheetProps) {
  const [open, setOpen] = React.useState(false);

  // Count active filters
  let activeCount = 0;
  if (filters.stops !== "all") activeCount++;
  if (filters.selectedAirlines.length > 0) activeCount++;
  if (filters.departureWindow !== "all") activeCount++;
  if (filters.maxPrice !== undefined && filters.maxPrice < maxPricePossible) activeCount++;

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="lg"
            className="rounded-full shadow-soft-xl px-6 h-12 text-sm font-bold gap-2 border border-primary-foreground/20 backdrop-blur-md"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl p-6">
          <SheetHeader className="text-left pb-4 border-b border-border">
            <SheetTitle className="font-heading text-lg font-bold">Filter Flights</SheetTitle>
          </SheetHeader>

          <div className="py-4">
            <FiltersSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              availableAirlines={availableAirlines}
              minPricePossible={minPricePossible}
              maxPricePossible={maxPricePossible}
              onResetFilters={onResetFilters}
              className="border-0 p-0 shadow-none bg-transparent"
            />
          </div>

          <div className="sticky bottom-0 bg-background pt-3 border-t border-border mt-4">
            <Button className="w-full h-11 text-sm font-bold" onClick={() => setOpen(false)}>
              Show {totalFilteredCount} {totalFilteredCount === 1 ? "Flight" : "Flights"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
