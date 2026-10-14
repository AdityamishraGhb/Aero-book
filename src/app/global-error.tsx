"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center space-y-4">
          <h2 className="font-heading text-2xl font-bold text-foreground">Something went wrong!</h2>
          <p className="text-xs text-muted-foreground">
            An unexpected error occurred. Our engineering team has been notified automatically.
          </p>
          <Button onClick={() => reset()} variant="accent" size="sm">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
