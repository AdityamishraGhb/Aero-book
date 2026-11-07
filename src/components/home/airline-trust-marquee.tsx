import * as React from "react";
import { ShieldCheck, Award, Globe2, Plane, CheckCircle2 } from "lucide-react";

export function AirlineTrustMarquee() {
  const partners = [
    { name: "Air India", code: "AI", tag: "Star Alliance" },
    { name: "IndiGo", code: "6E", tag: "Direct Partner" },
    { name: "Emirates", code: "EK", tag: "Global Partner" },
    { name: "Singapore Airlines", code: "SQ", tag: "Star Alliance" },
    { name: "Qatar Airways", code: "QR", tag: "Oneworld" },
    { name: "Lufthansa", code: "LH", tag: "Star Alliance" },
    { name: "British Airways", code: "BA", tag: "Oneworld" },
    { name: "Amadeus GDS", code: "1A", tag: "Certified Engine" },
    { name: "IATA Certified", code: "IATA", tag: "Accredited" },
  ];

  return (
    <div className="w-full border-y border-[#163247] bg-[#07131C] py-8 text-white select-none overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Eyebrow label */}
          <div className="shrink-0 text-center md:text-left">
            <span className="text-[10px] font-heading font-extrabold uppercase tracking-[0.25em] text-[#D4A017] block">
              Global Airline Network
            </span>
            <p className="text-xs text-white/60 font-sans mt-0.5">
              Direct live fares across leading international & domestic carriers
            </p>
          </div>

          {/* Partner Badges Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="group flex items-center gap-2 rounded-xl border border-[#163247] bg-[#0B1F2D]/90 px-3.5 py-2 shadow-xs transition-all duration-300 hover:border-[#D4A017]/60 hover:bg-[#163247]"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#D4A017]/15 text-[10px] font-mono font-bold text-[#D4A017] group-hover:scale-105 transition-transform">
                  {partner.code}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xs font-bold text-white group-hover:text-[#D4A017] transition-colors leading-tight">
                    {partner.name}
                  </span>
                  <span className="text-[9px] font-mono text-white/40 leading-none">
                    {partner.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

