/**
 * Internationalization, currency and date formatting utilities for AeroBook.
 * Default locale: en-IN (India) with INR currency and DD/MM/YYYY formatting.
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: "INR", symbol: "₹", label: "INR (₹) - Indian Rupee", locale: "en-IN" },
  { code: "USD", symbol: "$", label: "USD ($) - US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", label: "EUR (€) - Euro", locale: "en-IE" },
  { code: "GBP", symbol: "£", label: "GBP (£) - British Pound", locale: "en-GB" },
  { code: "AED", symbol: "AED", label: "AED (د.إ) - UAE Dirham", locale: "en-AE" },
  { code: "SGD", symbol: "S$", label: "SGD (S$) - Singapore Dollar", locale: "en-SG" },
];

export const DEFAULT_CURRENCY = "INR";
export const DEFAULT_LOCALE = "en-IN";

/**
 * Format a numeric amount to a localized currency string.
 */
export function formatCurrency(
  amount: number,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
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
 * Format time from a date input into 12-hour or 24-hour time (e.g. 14:35 or 02:35 PM).
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
