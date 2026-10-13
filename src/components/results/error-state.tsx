import * as React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Unable to fetch live flight offers for this route.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      data-testid="error-results-state"
      className="rounded-2xl border border-destructive/20 bg-destructive/[0.02] p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertCircle className="h-7 w-7" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-heading text-lg font-bold text-foreground">Flight Search Failed</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{message}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <Button
            variant="default"
            size="sm"
            onClick={onRetry}
            className="gap-2 text-xs font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>
        )}

        <Button asChild variant="outline" size="sm" className="gap-2 text-xs">
          <Link href="/">
            <Home className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
