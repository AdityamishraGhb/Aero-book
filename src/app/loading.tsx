import Image from "next/image";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading AeroBook"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1F2D] text-white transition-colors px-4"
    >
      {/* Ambient background lighting blooms for luxury depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D4A017]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm text-center">
        {/* Exact Official Brand Logo */}
        <div className="transition-transform duration-500 hover:scale-105">
          <Image
            src="/brand/logo-dark.png"
            alt="AeroBook"
            width={220}
            height={52}
            priority
            className="h-11 sm:h-12 w-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Luxury Gold Radar Scanner & Spinner */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Outer Gold Spinner Ring */}
          <div className="h-20 w-20 animate-spin rounded-full border-[2.5px] border-white/10 border-t-[#D4A017] border-r-[#D4A017]/70" />

          {/* Inner Pulsing Radar Glow */}
          <div className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-[#D4A017]/15 animate-ping" />

          {/* Central Gold Airplane Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-[#D4A017] animate-pulse"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
        </div>

        {/* Live Search Status Indicators */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-heading font-bold text-[#D4A017] border border-[#D4A017]/30 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-ping" />
            <span className="tracking-[0.15em] uppercase text-[10px]">
              Retrieving Live Carrier Fares
            </span>
          </div>

          {/* Animated Gold Shimmer Bar */}
          <div className="relative h-1 w-48 mx-auto overflow-hidden rounded-full bg-white/10">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>

          <p className="text-xs text-white/70 font-sans">
            Comparing direct rates across 1,200+ global airports...
          </p>
        </div>

        {/* Brand Tagline in Gold */}
        <div className="pt-2 text-[11px] font-heading font-semibold tracking-[0.2em] uppercase text-[#D4A017]/90">
          Your Next Journey, Simplified.
        </div>
      </div>

      <span className="sr-only">Loading AeroBook...</span>
    </div>
  );
}
