import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  variant?: "default" | "light";
  withTagline?: boolean;
}

export function Logo({
  className,
  size = "md",
  showWordmark = true,
  variant = "default",
  withTagline = false,
}: LogoProps) {
  const sizeMap = {
    sm: { glyph: "w-8 h-8", text: "text-lg", tagline: "text-[9px] tracking-[0.2em]" },
    md: { glyph: "w-10 h-10", text: "text-2xl", tagline: "text-[10px] tracking-[0.25em]" },
    lg: { glyph: "w-14 h-14", text: "text-3xl", tagline: "text-xs tracking-[0.3em]" },
  };

  const { glyph, text, tagline } = sizeMap[size];
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] focus-visible:ring-offset-2 rounded-lg select-none",
        className
      )}
      aria-label="AeroBook Home"
    >
      {/* Brand Ascending Airliner Vector Icon with Dynamic Contrail */}
      <div
        className={cn(
          "relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
          glyph
        )}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
          aria-hidden="true"
        >
          {/* Contrail streak extending backwards across */}
          <path
            d="M3 30.5C11 30 19 28.5 27 26.5"
            stroke="#D4A017"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M5 31L23 27"
            stroke="#D4A017"
            strokeWidth="1.2"
            opacity="0.6"
            strokeLinecap="round"
          />

          {/* Ascending Airliner in Brand Gold (#D4A017) */}
          <g fill="#D4A017">
            {/* Fuselage & Nose */}
            <path d="M22 27L38 18.5C41 16.9 43.5 17.5 45 19.5C45.8 20.6 45.5 21.8 44 22.8L31.5 29.5L22 27Z" />
            {/* Main Swept Wing (Far side / top) */}
            <path d="M30 22.5L34 8L38 8.8L35.5 20L30 22.5Z" />
            {/* Main Swept Wing (Near side / bottom) */}
            <path d="M26 25.5L23 37L26.5 37.5L31 28L26 25.5Z" />
            {/* Tail Fin (Vertical Stabilizer) */}
            <path d="M21 27.2L15 21.5L18 20.8L23 26.2L21 27.2Z" />
            {/* Horizontal Stabilizer (Far side) */}
            <path d="M20 27.5L16.5 24L18.5 23.5L21.5 26.8L20 27.5Z" />
          </g>
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-heading font-extrabold tracking-tight flex items-baseline leading-none",
              text
            )}
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            <span
              className={cn(
                "transition-colors",
                isLight ? "text-white" : "text-[#0B1F2D]"
              )}
            >
              Aero
            </span>
            <span className="text-[#D4A017]">Book</span>
          </span>

          {withTagline && (
            <span
              className={cn(
                "font-heading font-semibold uppercase leading-tight mt-0.5",
                tagline,
                isLight ? "text-white/70" : "text-[#6B7280]"
              )}
            >
              Flights • Hotels • More
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
