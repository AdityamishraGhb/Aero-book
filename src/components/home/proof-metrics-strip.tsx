import * as React from "react";
import { Globe, ShieldCheck, Zap, Ticket } from "lucide-react";

export function ProofMetricsStrip() {
  const metrics = [
    {
      stat: "1,200+",
      label: "Commercial Airports",
      desc: "Comprehensive domestic Indian corridors & international destinations",
      icon: Globe,
    },
    {
      stat: "₹0",
      label: "Hidden Booking Markups",
      desc: "Pure transparent metasearch with government taxes & airport fees included",
      icon: ShieldCheck,
    },
    {
      stat: "< 400ms",
      label: "Sub-Second Latency",
      desc: "Fast distributed querying across live carrier feeds & global GDS",
      icon: Zap,
    },
    {
      stat: "100%",
      label: "Direct Airline PNR",
      desc: "Instant verified reservation codes issued straight to your account",
      icon: Ticket,
    },
  ];

  return (
    <div className="border-b border-[#E5E7EB] bg-[#F6F7FB] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:border-[#D4A017]/60 hover:shadow-soft-lg hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1F2D] text-[#D4A017] shadow-xs group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7280]">
                    Verified
                  </span>
                </div>

                <div className="font-heading text-3xl sm:text-4xl font-black text-[#0B1F2D] tracking-tight">
                  {m.stat}
                </div>
                <h3 className="font-heading text-sm font-bold text-[#1F2937] mt-1">
                  {m.label}
                </h3>
                <p className="text-xs text-[#6B7280] font-sans mt-1.5 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
