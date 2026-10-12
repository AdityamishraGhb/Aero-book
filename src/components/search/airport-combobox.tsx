"use client";

import * as React from "react";
import { Plane, Search, Clock, X, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAirportByIata, searchAirports } from "@/data/airports";
import type { Airport } from "@/types/flight";
import { cn } from "@/lib/utils";

interface AirportComboboxProps {
  label: string;
  value: string;
  onChange: (iata: string) => void;
  excludeIata?: string;
  placeholder?: string;
  error?: string;
}

const RECENT_AIRPORTS_STORAGE_KEY = "aerobook_recent_airports";

function getStoredRecentAirports(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_AIRPORTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function AirportCombobox({
  label,
  value,
  onChange,
  excludeIata,
  placeholder = "Select airport",
  error,
}: AirportComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [recentIatas, setRecentIatas] = React.useState<string[]>(getStoredRecentAirports);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Save recent search
  const saveRecentSearch = (iata: string) => {
    try {
      const updated = [iata, ...recentIatas.filter((c) => c !== iata)].slice(0, 5);
      setRecentIatas(updated);
      localStorage.setItem(RECENT_AIRPORTS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const clearRecents = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentIatas([]);
    try {
      localStorage.removeItem(RECENT_AIRPORTS_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  // Selected airport object
  const selectedAirport = React.useMemo(() => getAirportByIata(value), [value]);

  // Filtered airport list
  const filteredAirports = React.useMemo(() => {
    const results = searchAirports(searchQuery, 10);
    if (!excludeIata) return results;
    return results.filter((a) => a.iata.toUpperCase() !== excludeIata.toUpperCase());
  }, [searchQuery, excludeIata]);

  // Handle open/close state change
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery("");
      setActiveIndex(0);
    }
  };

  // Handle airport selection
  const handleSelect = (airport: Airport) => {
    onChange(airport.iata);
    saveRecentSearch(airport.iata);
    setOpen(false);
    setSearchQuery("");
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = activeIndex < filteredAirports.length - 1 ? activeIndex + 1 : activeIndex;
      setActiveIndex(next);
      scrollActiveIntoView(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = activeIndex > 0 ? activeIndex - 1 : 0;
      setActiveIndex(prev);
      scrollActiveIntoView(prev);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredAirports[activeIndex]) {
        handleSelect(filteredAirports[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const scrollActiveIntoView = (index: number) => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll('[data-slot="airport-option"]');
      if (items[index]) {
        items[index].scrollIntoView({ block: "nearest" });
      }
    }
  };

  const listboxId = `airport-listbox-${label.toLowerCase()}`;

  return (
    <div className="relative flex-1 min-w-[200px]">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </span>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-label={`${label}: ${selectedAirport ? `${selectedAirport.city} (${selectedAirport.iata})` : placeholder}`}
            className={cn(
              "w-full flex items-center justify-between text-left h-14 px-3.5 rounded-xl border bg-card transition-all shadow-xs hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
              open ? "border-primary ring-2 ring-primary/20" : "border-border",
              error && "border-destructive ring-1 ring-destructive/20"
            )}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Plane className="h-4 w-4" />
              </div>
              <div className="truncate">
                {selectedAirport ? (
                  <>
                    <div className="flex items-baseline gap-1.5 truncate">
                      <span className="font-heading text-base font-bold text-foreground">
                        {selectedAirport.city}
                      </span>
                      <span className="font-mono text-xs font-semibold text-primary">
                        {selectedAirport.iata}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {selectedAirport.name}
                    </p>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">{placeholder}</span>
                )}
              </div>
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[320px] sm:w-[380px] p-0 shadow-soft-lg"
          align="start"
          sideOffset={6}
        >
          {/* Search Input Bar */}
          <div className="p-3 border-b border-border">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search city, airport name, or IATA code..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveIndex(0);
                  }}
                  className="absolute right-2.5 p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Recent Searches (if available and no query active) */}
          {!searchQuery && recentIatas.length > 0 && (
            <div className="px-3 py-2 border-b border-border/80 bg-muted/30">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearRecents}
                  className="text-[10px] hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentIatas.map((code) => {
                  const apt = getAirportByIata(code);
                  if (!apt) return null;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleSelect(apt)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-border bg-card text-xs hover:border-primary/50 transition-colors"
                    >
                      <span className="font-bold text-primary font-mono">{code}</span>
                      <span className="text-muted-foreground truncate max-w-[90px]">
                        {apt.city}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Airport Listbox */}
          <div
            id={listboxId}
            role="listbox"
            ref={listRef}
            className="max-h-[260px] overflow-y-auto p-1 divide-y divide-border/40"
          >
            {filteredAirports.length > 0 ? (
              filteredAirports.map((airport, idx) => {
                const isSelected = airport.iata === value;
                const isActive = idx === activeIndex;

                return (
                  <button
                    key={airport.iata}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-slot="airport-option"
                    onClick={() => handleSelect(airport)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors",
                      isActive ? "bg-muted" : "hover:bg-muted/60",
                      isSelected && "bg-primary/10"
                    )}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="truncate">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-semibold text-sm text-foreground truncate">
                            {airport.city}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            ({airport.country})
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{airport.name}</p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        {airport.iata}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No airports matching &quot;{searchQuery}&quot; found.
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {error && <span className="text-[11px] text-destructive mt-1 block">{error}</span>}
    </div>
  );
}
