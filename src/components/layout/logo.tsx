import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  variant?: "default" | "light";
}

export function Logo({
  className,
  size = "md",
  showWordmark = true,
  variant = "default",
}: LogoProps) {
  const sizeMap = {
    sm: { glyph: "w-7 h-7", text: "text-lg", spacing: "gap-2" },
    md: { glyph: "w-9 h-9", text: "text-2xl", spacing: "gap-2.5" },
    lg: { glyph: "w-11 h-11", text: "text-3xl", spacing: "gap-3" },
  };

  const { glyph, text, spacing } = sizeMap[size];
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg",
        spacing,
        className
      )}
      aria-label="AeroBook Home"
    >
      {/* Aerodynamic wing SVG glyph */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 p-1.5",
          isLight
            ? "bg-white/10 border border-white/15"
            : "bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10",
          glyph
        )}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="aerobook-wing-grad"
              x1="6"
              y1="8"
              x2="34"
              y2="34"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={isLight ? "#38bdf8" : "#0E7C7B"} />
              <stop offset="100%" stopColor={isLight ? "#0284c7" : "#0A6362"} />
            </linearGradient>
            <linearGradient
              id="aerobook-accent-grad"
              x1="18"
              y1="20"
              x2="36"
              y2="36"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FF6B4A" />
              <stop offset="100%" stopColor="#E85A3A" />
            </linearGradient>
          </defs>

          {/* Upper supersonic wing foil */}
          <path d="M6 24L34 8L22 34L18 24L6 24Z" fill="url(#aerobook-wing-grad)" />

          {/* Underwing facet creating depth and fold */}
          <path d="M18 24L34 8L20 20L18 24Z" fill={isLight ? "#0369a1" : "#084E4D"} opacity="0.9" />

          {/* Trailing origami rudder / coral lift accent */}
          <path d="M18 24L22 34L25 25L18 24Z" fill="url(#aerobook-accent-grad)" />

          {/* Flight path trail line */}
          <path
            d="M4 27C10 27 14 26 17 24"
            stroke={isLight ? "#38bdf8" : "#0E7C7B"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 3"
            opacity="0.8"
          />
        </svg>
      </div>

      {showWordmark && (
        <span
          className={cn(
            "font-heading font-extrabold tracking-tight select-none flex items-baseline",
            text
          )}
        >
          <span className={cn("transition-colors", isLight ? "text-white" : "text-foreground")}>
            Aero
          </span>
          <span className={cn("transition-colors", isLight ? "text-[#38bdf8]" : "text-primary")}>
            Book
          </span>
          <span className="inline-block w-1.5 h-1.5 ml-0.5 rounded-full bg-accent" />
        </span>
      )}
    </Link>
  );
}
