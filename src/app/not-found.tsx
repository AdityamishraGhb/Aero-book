import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-sm">
        <Compass className="h-12 w-12 animate-pulse text-primary" aria-hidden="true" />
        <span className="absolute -top-2 -right-2 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground shadow-sm">
          404
        </span>
      </div>

      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Flight Path Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
        The destination or booking route you are looking for has been moved, cancelled, or doesn’t exist in our radar.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button asChild variant="accent" size="lg" className="h-11 px-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Flight Search</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
