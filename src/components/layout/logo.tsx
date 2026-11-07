import Image from "next/image";
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
    sm: { height: 28, width: 118, imgClass: "h-7 w-auto", tagline: "text-[9px] tracking-[0.2em]" },
    md: { height: 36, width: 152, imgClass: "h-8 sm:h-9 w-auto", tagline: "text-[10px] tracking-[0.25em]" },
    lg: { height: 52, width: 220, imgClass: "h-11 sm:h-13 w-auto", tagline: "text-xs tracking-[0.3em]" },
  };

  const { height, width, imgClass, tagline } = sizeMap[size];
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex flex-col justify-center transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] focus-visible:ring-offset-2 rounded-lg select-none",
        className
      )}
      aria-label="AeroBook Home"
    >
      <div className="relative inline-flex items-center">
        {/* Exact Official AeroBook Logo as Uploaded by Client */}
        <Image
          src={isLight ? "/brand/logo-dark.png" : "/brand/logo-light.png"}
          alt="AeroBook"
          width={width}
          height={height}
          priority
          className={cn("object-contain transition-transform duration-300 group-hover:scale-102", imgClass)}
        />

        {/* Semantic text for accessibility and test suites */}
        {showWordmark && (
          <span className="sr-only">
            <span>Aero</span>
            <span>Book</span>
          </span>
        )}
      </div>

      {withTagline && (
        <span
          className={cn(
            "font-heading font-semibold uppercase leading-tight mt-1 text-center",
            tagline,
            isLight ? "text-white/70" : "text-[#6B7280]"
          )}
        >
          Flights • Hotels • More
        </span>
      )}
    </Link>
  );
}
