export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading AeroBook"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05203c] transition-colors gap-4"
    >
      <div className="relative flex items-center justify-center">
        {/* Glowing animated spinner ring in AeroBook cyan */}
        <div className="h-20 w-20 animate-spin rounded-full border-[2.5px] border-white/10 border-t-[#38bdf8] border-r-[#38bdf8]/70" />

        {/* Central AeroBook Proprietary Supersonic Wing Emblem */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 animate-pulse"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="loading-wing-grad"
                x1="6"
                y1="8"
                x2="34"
                y2="34"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient
                id="loading-accent-grad"
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
            <path d="M6 24L34 8L22 34L18 24L6 24Z" fill="url(#loading-wing-grad)" />

            {/* Underwing geometric fold facet */}
            <path d="M18 24L34 8L20 20L18 24Z" fill="#0369a1" opacity="0.9" />

            {/* Trailing origami rudder coral lift accent */}
            <path d="M18 24L22 34L25 25L18 24Z" fill="url(#loading-accent-grad)" />

            {/* Flight trajectory arc */}
            <path
              d="M4 27C10 27 14 26 17 24"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 3"
              opacity="0.85"
            />
          </svg>
        </div>
      </div>

      {/* AeroBook Distinctive Brand Wordmark */}
      <div className="flex items-baseline gap-0.5 font-heading text-sm font-extrabold tracking-wider select-none text-white">
        <span>Aero</span>
        <span className="text-[#38bdf8]">Book</span>
        <span className="inline-block h-1.5 w-1.5 ml-0.5 rounded-full bg-[#FF6B4A]" />
      </div>

      <span className="sr-only">Loading AeroBook...</span>
    </div>
  );
}
