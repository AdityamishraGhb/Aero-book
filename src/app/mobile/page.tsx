"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Smartphone, Sparkles, CheckCircle2, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrCodeCard } from "@/components/common/qr-code-card";
import { Logo } from "@/components/layout/logo";

export default function MobilePosterPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex-1 w-full bg-background min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between no-print">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to AeroBook</span>
            </Link>
          </Button>

          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Poster</span>
          </Button>
        </div>

        {/* Printable Poster Container */}
        <div className="rounded-3xl border-2 border-slate-300 bg-white text-slate-900 p-8 sm:p-12 shadow-xl space-y-8 print:border-0 print:shadow-none print:p-0">
          {/* Header */}
          <div className="text-center space-y-3 border-b border-slate-200 pb-6">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0062E3]/10 px-3.5 py-1 text-xs font-bold text-[#0062E3]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Official Mobile Launch</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-[#05203c]">
              We&apos;re excited to officially launch the AeroBook Mobile Web App!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Scan the QR code below using your mobile phone camera to search flights, compare airfares in real-time, and manage bookings on the go.
            </p>
          </div>

          {/* Central QR Code Card with source link */}
          <div className="flex justify-center">
            <QrCodeCard
              source="01"
              showPosterNotice={false}
              className="border-0 shadow-none bg-slate-50 max-w-lg"
            />
          </div>

          {/* Instructions for Use (matches sample document) */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-700">
            <h2 className="font-heading text-base sm:text-lg font-bold text-[#05203c] flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-[#0062E3]" />
              <span>Instructions for Use</span>
            </h2>

            <p className="leading-relaxed">
              <strong>AeroBook is designed to work on a mobile device through your smartphone browser.</strong> The web app delivers instant flight search with live seat availability, transparent baggage rules, and multi-currency conversions.
            </p>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 font-medium">
              💡 <strong>There is no need to install anything on your device.</strong> No App Store or Google Play Store download is required. Simply scan the QR code to launch.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-xs space-y-1">
                <span className="font-mono text-xs font-extrabold text-[#0062E3]">Step 1</span>
                <h4 className="font-bold text-slate-900 text-xs">Open Phone Camera</h4>
                <p className="text-[11px] text-slate-500">
                  Open the default Camera app on your iPhone or Android phone.
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-xs space-y-1">
                <span className="font-mono text-xs font-extrabold text-[#0062E3]">Step 2</span>
                <h4 className="font-bold text-slate-900 text-xs">Point at QR Code</h4>
                <p className="text-[11px] text-slate-500">
                  Hold your camera steady over the QR code until a notification appears.
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-xs space-y-1">
                <span className="font-mono text-xs font-extrabold text-[#0062E3]">Step 3</span>
                <h4 className="font-bold text-slate-900 text-xs">Tap Link & Search</h4>
                <p className="text-[11px] text-slate-500">
                  Tap the notification banner to launch AeroBook with tracked source (?source=01).
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap justify-between items-center gap-2">
            <span>© 2026 AeroBook Technologies Inc. All rights reserved.</span>
            <span className="font-mono text-[11px]">Source tracking: ?source=01</span>
          </div>
        </div>
      </div>
    </div>
  );
}
