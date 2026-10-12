"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  retry,
  reset,
}: {
  error: Error & { digest?: string };
  retry?: () => void;
  reset?: () => void;
}) {
  React.useEffect(() => {
    // Log client error for debugging
    console.error("AeroBook App Error:", error);
  }, [error]);

  const handleRetry = () => {
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-sm">
        <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden="true" />
      </div>

      <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        We Encountered Turbulence
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        Something unexpected occurred while processing your request. Rest assured, our systems have logged the event.
      </p>

      {error?.digest && (
        <p className="mt-3 font-mono text-xs text-muted-foreground/80 bg-muted/60 px-3 py-1 rounded-md">
          Incident ID: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={handleRetry} variant="default" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
        <Button asChild variant="outline">
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
