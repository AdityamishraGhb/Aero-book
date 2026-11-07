"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Copy, Check, ExternalLink, QrCode as QrIcon, Smartphone, Printer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrCodeCardProps {
  source?: string;
  className?: string;
  showPosterNotice?: boolean;
}

export function QrCodeCard({
  source = "01",
  className = "",
  showPosterNotice = true,
}: QrCodeCardProps) {
  const [qrDataUrl, setQrDataUrl] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);
  const [fullUrl, setFullUrl] = React.useState(`https://aerobook-theta.vercel.app/?source=${source}`);

  React.useEffect(() => {
    // Resolve current origin if in browser, falling back to production URL
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://aerobook-theta.vercel.app";
    const resolvedUrl = `${origin}/?source=${source}`;
    setFullUrl(resolvedUrl);

    // Generate high-resolution QR code
    QRCode.toDataURL(resolvedUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: "#05203c", // Dark AeroBook Navy
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Generation error:", err));
  }, [source]);

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrintPoster = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft-md text-center flex flex-col items-center ${className}`}
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-4">
        <Smartphone className="h-3.5 w-3.5" />
        <span>AeroBook Mobile Web App</span>
      </div>

      <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-foreground mb-2">
        Scan to Launch on Mobile
      </h3>

      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        Point your smartphone camera at the QR code below to launch AeroBook instantly on your mobile device.
      </p>

      {/* QR Code Container matching client sample format */}
      <div className="relative p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-md mb-4 flex items-center justify-center">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrDataUrl}
            alt={`AeroBook QR Code for ${fullUrl}`}
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
          />
        ) : (
          <div className="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center bg-slate-50 rounded-lg text-muted-foreground gap-2">
            <QrIcon className="h-8 w-8 animate-pulse text-primary" />
            <span className="text-xs font-medium">Generating QR Code...</span>
          </div>
        )}
      </div>

      {/* Source Link underneath matching client sample: https://.../?source=01 */}
      <div className="w-full max-w-md space-y-2 mb-5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Direct Mobile Web Link
        </div>
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs sm:text-sm font-bold text-[#0062E3] hover:text-[#0052bd] underline break-all flex items-center gap-1 transition-colors"
          >
            <span>{fullUrl}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 inline" />
          </a>
        </div>
      </div>

      {/* Action Buttons: Copy link & Open */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full max-w-sm mb-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="text-xs font-semibold gap-1.5 h-9 flex-1 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Source Link</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          asChild
          className="text-xs font-semibold gap-1.5 h-9 flex-1 cursor-pointer"
        >
          <a href={fullUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open in Browser</span>
          </a>
        </Button>
      </div>

      {/* Explanatory Body text from sample image */}
      <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-left space-y-2.5 text-xs text-muted-foreground max-w-md w-full">
        <p className="font-semibold text-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span>Zero Installation Required:</span>
        </p>
        <p className="leading-relaxed text-[11px]">
          AeroBook is designed to work on a mobile device through your computer or mobile browser (Safari, Chrome, Firefox). There is no need to install anything on your device.
        </p>
        <p className="leading-relaxed text-[11px]">
          By using the QR code on your device, you will be able to search flight corridors, compare verified fares in multiple currencies, and book tickets with instant PNR delivery.
        </p>
      </div>

      {/* Poster printable option */}
      {showPosterNotice && (
        <div className="mt-4 pt-4 border-t border-border/60 w-full flex items-center justify-between text-xs text-muted-foreground max-w-md">
          <span className="text-[11px]">Need a physical poster for your office or desk?</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePrintPoster}
            className="text-[11px] font-bold text-primary gap-1 h-7 px-2 cursor-pointer"
          >
            <Printer className="h-3 w-3" />
            <span>Print Poster</span>
          </Button>
        </div>
      )}
    </div>
  );
}

