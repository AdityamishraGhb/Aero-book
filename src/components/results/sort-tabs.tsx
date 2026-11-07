"use client";

import * as React from "react";
import { Sparkles, TrendingDown, Zap } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { useCurrency } from "@/lib/hooks/use-currency";
import { cn } from "@/lib/utils";

interface SortTabsProps {
  currentSort: "best" | "cheapest" | "fastest";
  onSortChange: (sort: "best" | "cheapest" | "fastest") => void;
  minPrice?: number;
  minDurationMinutes?: number;
  bestScore?: number;
}

export function SortTabs({
  currentSort,
  onSortChange,
  minPrice,
  minDurationMinutes,
  bestScore,
}: SortTabsProps) {
  const { formatPrice } = useCurrency();
  const tabs = [
    {
      id: "best" as const,
      label: "Best",
      subtext: bestScore ? `Score: ${bestScore}/10` : "Best value ratio",
      icon: Sparkles,
      iconColor: "text-[#D4A017]",
    },
    {
      id: "cheapest" as const,
      label: "Cheapest",
      subtext: minPrice ? `from ${formatPrice(minPrice)}` : "Lowest fare",
      icon: TrendingDown,
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "fastest" as const,
      label: "Fastest",
      subtext: minDurationMinutes ? `from ${formatDuration(minDurationMinutes)}` : "Shortest time",
      icon: Zap,
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-xs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentSort === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSortChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-center transition-all select-none cursor-pointer",
              isActive
                ? "bg-[#0B1F2D] text-white shadow-xs font-bold"
                : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <Icon className={cn("h-4 w-4", isActive ? "text-[#D4A017]" : tab.iconColor)} />
              <span className={cn("font-heading text-xs sm:text-sm font-bold", isActive ? "text-white" : "text-foreground")}>
                {tab.label}
              </span>
            </div>
            <span
              className={cn(
                "text-[11px] truncate max-w-full font-medium",
                isActive ? "text-[#D4A017] font-semibold" : "text-muted-foreground"
              )}
            >
              {tab.subtext}
            </span>
          </button>
        );
      })}
    </div>
  );
}
