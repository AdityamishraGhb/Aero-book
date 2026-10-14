"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from "@/lib/format";

const COOKIE_NAME = "aerobook_currency";

function subscribeToCurrencyChanges(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("aerobook-currency-change", callback);
  return () => window.removeEventListener("aerobook-currency-change", callback);
}

function getCurrencySnapshot(): string {
  if (typeof document === "undefined") return DEFAULT_CURRENCY;
  const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
  if (match?.[2] && SUPPORTED_CURRENCIES.some((c) => c.code === match[2])) {
    return match[2];
  }
  return DEFAULT_CURRENCY;
}

function getServerSnapshot(): string {
  return DEFAULT_CURRENCY;
}

export function LocaleCurrencySelector() {
  const router = useRouter();
  const selectedCurrency = React.useSyncExternalStore(
    subscribeToCurrencyChanges,
    getCurrencySnapshot,
    getServerSnapshot
  );

  const handleCurrencyChange = (newCurrency: string) => {
    // Persist in cookie for 1 year
    document.cookie = `${COOKIE_NAME}=${newCurrency}; path=/; max-age=31536000; SameSite=Lax`;

    // Notify listeners
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("aerobook-currency-change", { detail: { currency: newCurrency } })
      );
    }

    router.refresh();
  };

  const currentConfig =
    SUPPORTED_CURRENCIES.find((c) => c.code === selectedCurrency) || SUPPORTED_CURRENCIES[0];

  return (
    <div className="flex items-center gap-1.5" title="Select Currency">
      <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
        <SelectTrigger
          aria-label="Select currency"
          className="h-9 w-auto gap-2 border-white/20 bg-white/10 text-white px-2.5 text-xs font-semibold hover:bg-white/20 rounded-lg"
        >
          <Globe className="h-3.5 w-3.5 text-white/80" aria-hidden="true" />
          <SelectValue>
            <span className="text-white">
              {currentConfig.symbol} {currentConfig.code}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border/60">
            Regional Currency
          </div>
          {SUPPORTED_CURRENCIES.map((currency) => (
            <SelectItem key={currency.code} value={currency.code} className="text-xs py-2">
              <span className="font-medium">{currency.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
