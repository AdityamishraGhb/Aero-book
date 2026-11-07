"use client";

import * as React from "react";
import Link from "next/link";
import {
  Smartphone,
  Zap,
  Globe,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { QrCodeCard } from "@/components/common/qr-code-card";
import { Button } from "@/components/ui/button";

export function MobileAppSection() {
  return (
    <section id="mobile-app" className="border-t border-border bg-[#05203c] text-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (7 cols): Navan-style value proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-[#38bdf8] border border-white/15">
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile Web Experience (Navan Inspired)</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Flight search and booking in the palm of your hand.
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              Experience the full power of AeroBook directly on your smartphone browser. Compare live airfares, receive instant booking confirmations, and view your tickets on the go with zero app store installation.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5">
                <Zap className="h-5 w-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-xs font-bold text-white">Sub-Second Flight Search</h4>
                  <p className="text-[11px] text-white/70 mt-0.5">
                    Lightning fast results across hundreds of domestic and international airlines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5">
                <Globe className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-xs font-bold text-white">Live Multi-Currency</h4>
                  <p className="text-[11px] text-white/70 mt-0.5">
                    Switch seamlessly between INR, USD, EUR, GBP, AED, and SGD in real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5">
                <Smartphone className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-xs font-bold text-white">No App Download Needed</h4>
                  <p className="text-[11px] text-white/70 mt-0.5">
                    Runs natively in Chrome, Safari, and mobile browsers with zero storage taken.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5">
                <ShieldCheck className="h-5 w-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-xs font-bold text-white">Direct PNR & Digital Tickets</h4>
                  <p className="text-[11px] text-white/70 mt-0.5">
                    Official airline booking references saved directly to your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button
                asChild
                variant="accent"
                size="default"
                className="h-11 px-6 text-xs font-bold gap-2 shadow-md cursor-pointer"
              >
                <Link href="/mobile">
                  <span>View Printable QR Poster</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="default"
                className="h-11 px-6 text-xs font-bold gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              >
                <a href="/?source=01" target="_blank" rel="noopener noreferrer">
                  <span>Test Mobile Link (?source=01)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column (5 cols): Real Scannable QR Code Card */}
          <div className="lg:col-span-5 flex justify-center">
            <QrCodeCard
              source="01"
              className="w-full max-w-md bg-white text-slate-900 border-white/20 shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

