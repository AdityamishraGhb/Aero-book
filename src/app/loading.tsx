export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading AeroBook"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05203c] transition-colors"
    >
      <div className="relative flex items-center justify-center">
        {/* Glowing animated spinner ring */}
        <div className="h-20 w-20 animate-spin rounded-full border-[2.5px] border-white/20 border-t-white border-r-white/70" />

        {/* Central Sunburst / Compass Logo Glyph (Matches Skyscanner exact icon) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white animate-pulse"
            aria-hidden="true"
          >
            {/* Curved horizon / bridge arch */}
            <path
              d="M10 26C14 21.5 26 21.5 30 26"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* 5 radiating sunburst rays */}
            <path d="M11 20.5L7 16.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M14 16.5L11 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 14.5V7.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M26 16.5L29 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M29 20.5L33 16.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <span className="sr-only">Loading AeroBook...</span>
    </div>
  );
}
