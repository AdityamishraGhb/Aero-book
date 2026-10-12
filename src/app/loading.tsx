import { Skeleton } from "@/components/ui/skeleton";
import { Plane } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Plane className="h-8 w-8 animate-pulse text-primary" aria-hidden="true" />
        </div>
        <p className="font-heading text-sm font-semibold tracking-wide text-foreground">
          Loading AeroBook...
        </p>

        {/* Shimmer placeholders */}
        <div className="w-full max-w-sm space-y-2.5 pt-4">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-4/5 mx-auto rounded-md" />
        </div>
      </div>
    </div>
  );
}
