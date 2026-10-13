import { Skeleton } from "@/components/ui/skeleton";

export function FlightCardSkeleton() {
  return (
    <div
      data-testid="flight-card-skeleton"
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4"
    >
      {/* Top Badge Shimmer */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Timeline representation */}
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-between gap-4 max-w-md w-full">
            <div className="space-y-1">
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-3 w-10" />
            </div>

            <div className="flex-1 flex flex-col items-center gap-1.5 px-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-1 w-full rounded-full" />
              <Skeleton className="h-3 w-14" />
            </div>

            <div className="space-y-1 text-right">
              <Skeleton className="h-6 w-14 ml-auto" />
              <Skeleton className="h-3 w-10 ml-auto" />
            </div>
          </div>
        </div>

        {/* Price column */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 min-w-[170px] border-t lg:border-t-0 pt-4 lg:pt-0">
          <div className="space-y-1">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Footer info shimmer */}
      <div className="pt-3 border-t border-border/60 flex items-center justify-between">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
