"use client";

import * as React from "react";
import {
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
  COOKIE_NAME,
  convertPrice,
  formatCurrency,
} from "@/lib/format";

export function subscribeToCurrencyChanges(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("aerobook-currency-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("aerobook-currency-change", callback);
    window.removeEventListener("storage", callback);
  };
}

export function getCurrencySnapshot(): string {
  if (typeof window === "undefined" || typeof document === "undefined") return DEFAULT_CURRENCY;

  // Check localStorage first
  try {
    const local = localStorage.getItem(COOKIE_NAME);
    if (local && SUPPORTED_CURRENCIES.some((c) => c.code === local)) {
      return local;
    }
  } catch {}

  // Check cookie
  const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
  if (match?.[2] && SUPPORTED_CURRENCIES.some((c) => c.code === match[2])) {
    return match[2];
  }

  return DEFAULT_CURRENCY;
}

export function getServerSnapshot(): string {
  return DEFAULT_CURRENCY;
}

/**
 * Primary React hook for currency state and price conversion across the site.
 */
export function useCurrency() {
  const selectedCurrency = React.useSyncExternalStore(
    subscribeToCurrencyChanges,
    getCurrencySnapshot,
    getServerSnapshot
  );

  const config =
    SUPPORTED_CURRENCIES.find((c) => c.code === selectedCurrency) || SUPPORTED_CURRENCIES[0];

  const formatPrice = React.useCallback(
    (amountInInr: number) => {
      const converted = convertPrice(amountInInr, selectedCurrency);
      return formatCurrency(converted, selectedCurrency, config.locale);
    },
    [selectedCurrency, config.locale]
  );

  const convertAmount = React.useCallback(
    (amountInInr: number) => convertPrice(amountInInr, selectedCurrency),
    [selectedCurrency]
  );

  const setCurrency = React.useCallback((newCurrency: string) => {
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE_NAME}=${newCurrency}; path=/; max-age=31536000; SameSite=Lax`;
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(COOKIE_NAME, newCurrency);
      } catch {}
      window.dispatchEvent(
        new CustomEvent("aerobook-currency-change", { detail: { currency: newCurrency } })
      );
    }
  }, []);

  return {
    currency: selectedCurrency,
    currencyConfig: config,
    formatPrice,
    convertAmount,
    setCurrency,
  };
}

