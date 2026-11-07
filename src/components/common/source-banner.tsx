"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Smartphone, X } from "lucide-react";

function BannerContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (source) {
      setIsVisible(true);
    }
  }, [source]);

  if (!isVisible || !source) return null;

  return (
    <aside
      aria-label="Mobile app access notification"
      className="bg-gradient-to-r from-[#0062E3] to-[#0E7C7B] text-white px-4 py-2.5 text-xs shadow-sm flex items-center justify-between gap-3 sticky top-0 z-50 animate-in slide-in-from-top"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1 justify-center text-center">
        <Smartphone className="h-4 w-4 shrink-0 text-white" />
        <span>
          <strong>AeroBook Mobile Web App active!</strong> Connected via QR code link (
          <code className="bg-white/20 px-1 py-0.5 rounded font-mono text-[11px]">
            ?source={source}
          </code>
          ). No app store download needed.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 shrink-0 cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </aside>
  );
}

export function SourceBanner() {
  return (
    <React.Suspense fallback={null}>
      <BannerContent />
    </React.Suspense>
  );
}
