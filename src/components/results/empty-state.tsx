import * as React from "react";
import { PlaneTakeoff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
}

export function EmptyState({
  title = "No flights matching your active filters",
  description = "Try adjusting your price range, airline preferences, or stop restrictions to view more available flights.",
  onResetFilters,
}: EmptyStateProps) {
  return (
    <div
      data-testid="empty-results-state"
      className="rounded-2xl border border-dashed border-border bg-card p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <PlaneTakeoff className="h-7 w-7 text-primary" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {onResetFilters && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="gap-2 text-xs font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}
