"use client";

import * as React from "react";
import { QrCode as QrIcon, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrCodeCard } from "@/components/common/qr-code-card";

export function MobileQrModal() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors border border-white/15 cursor-pointer"
        title="Scan QR Code to open on Mobile"
      >
        <QrIcon className="h-3.5 w-3.5 text-[#38bdf8]" />
        <span>Scan QR</span>
      </Button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
        >
          {/* Backdrop click */}
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl p-2 animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <QrCodeCard source="01" className="border-0 shadow-none p-4 sm:p-6" />
          </div>
        </div>
      )}
    </>
  );
}

