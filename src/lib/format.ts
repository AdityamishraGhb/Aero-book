/**
 * Internationalization, currency and date formatting utilities for AeroBook.
 * Default locale: en-IN (India) with INR currency.
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  locale: string;
  rateAgainstInr: number; // multiplier to convert 1 INR to this currency
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: "INR", symbol: "₹", label: "INR (₹) - Indian Rupee", locale: "en-IN", rateAgainstInr: 1 },
  { code: "USD", symbol: "$", label: "USD ($) - US Dollar", locale: "en-US", rateAgainstInr: 0.0116 },
  { code: "EUR", symbol: "€", label: "EUR (€) - Euro", locale: "en-IE", rateAgainstInr: 0.0108 },
  { code: "GBP", symbol: "£", label: "GBP (£) - British Pound", locale: "en-GB", rateAgainstInr: 0.0091 },
  { code: "AED", symbol: "AED", label: "AED (د.إ) - UAE Dirham", locale: "en-AE", rateAgainstInr: 0.0425 },
  { code: "SGD", symbol: "S$", label: "SGD (S$) - Singapore Dollar", locale: "en-SG", rateAgainstInr: 0.0154 },
];

export const EXCHANGE_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.0116,
  EUR: 0.0108,
  GBP: 0.0091,
  AED: 0.0425,
  SGD: 0.0154,
};

export const DEFAULT_CURRENCY = "INR";
export const DEFAULT_LOCALE = "en-IN";
export const COOKIE_NAME = "aerobook_currency";

/**
 * Convert an amount from base currency (INR) to target currency.
 */
export function convertPrice(amountInInr: number, targetCurrency: string = DEFAULT_CURRENCY): number {
  if (!amountInInr || isNaN(amountInInr)) return 0;
  if (targetCurrency === "INR") return Math.round(amountInInr);

  const rate = EXCHANGE_RATES[targetCurrency] ?? 1;
  const converted = amountInInr * rate;
  return Math.max(1, Math.round(converted));
}

/**
 * Format a numeric amount to a localized currency string.
 * Automatically resolves the appropriate locale if not provided.
 */
export function formatCurrency(
  amount: number,
  currency = DEFAULT_CURRENCY,
  locale?: string
): string {
  const targetConfig =
    SUPPORTED_CURRENCIES.find((c) => c.code === currency) || SUPPORTED_CURRENCIES[0];
  const targetLocale = locale || targetConfig.locale;

  try {
    return new Intl.NumberFormat(targetLocale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${targetConfig.symbol}${amount.toLocaleString()}`;
  }
}

/**
 * Format an ISO string, timestamp or Date object into localized DD/MM/YYYY date.
 */
export function formatDate(
  dateInput: Date | string | number,
  style: "short" | "medium" | "long" = "short",
  locale = DEFAULT_LOCALE
): string {
  const date =
    typeof dateInput === "string" || typeof dateInput === "number"
      ? new Date(dateInput)
      : dateInput;

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  const options: Intl.DateTimeFormatOptions =
    style === "short"
      ? { day: "2-digit", month: "2-digit", year: "numeric" }
      : style === "medium"
        ? { day: "numeric", month: "short", year: "numeric" }
        : { weekday: "short", day: "numeric", month: "short", year: "numeric" };

  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format time from a date input into 24-hour time (e.g. 14:35).
 */
export function formatTime(dateInput: Date | string | number, locale = DEFAULT_LOCALE): string {
  const date =
    typeof dateInput === "string" || typeof dateInput === "number"
      ? new Date(dateInput)
      : dateInput;

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Format minutes into a human-readable duration, e.g. 145 -> "2h 25m".
 */
export function formatDuration(minutes: number): string {
  if (!minutes || minutes < 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format number of stops into a friendly flight label.
 */
export function formatStops(stops: number): string {
  if (stops === 0) return "Direct";
  if (stops === 1) return "1 stop";
  return `${stops} stops`;
}
