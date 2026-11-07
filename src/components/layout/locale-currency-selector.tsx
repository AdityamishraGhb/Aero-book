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
import { SUPPORTED_CURRENCIES } from "@/lib/format";
import { useCurrency } from "@/lib/hooks/use-currency";

export function LocaleCurrencySelector() {
  const router = useRouter();
  const { currency, currencyConfig, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1.5" title="Select Currency">
      <Select value={currency} onValueChange={handleCurrencyChange}>
        <SelectTrigger
          aria-label="Select currency"
          className="h-9 w-auto gap-2 border-white/20 bg-white/10 text-white px-2.5 text-xs font-semibold hover:bg-white/20 rounded-lg cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5 text-white/80" aria-hidden="true" />
          <SelectValue>
            <span className="text-white">
              {currencyConfig.symbol} {currencyConfig.code}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end" className="w-56 bg-card border-border shadow-lg z-50">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border/60">
            Regional Currency
          </div>
          {SUPPORTED_CURRENCIES.map((item) => (
            <SelectItem key={item.code} value={item.code} className="text-xs py-2 cursor-pointer">
              <span className="font-medium">{item.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
