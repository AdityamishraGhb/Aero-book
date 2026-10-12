import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatTime,
  formatDuration,
  formatStops,
  SUPPORTED_CURRENCIES,
} from "@/lib/format";

describe("format utilities", () => {
  describe("formatCurrency", () => {
    it("formats INR currency with Indian locale by default", () => {
      const formatted = formatCurrency(4500);
      // Match ₹ 4,500 or ₹4,500
      expect(formatted).toMatch(/₹\s?4,500/);
    });

    it("formats USD currency when requested", () => {
      const formatted = formatCurrency(120, "USD", "en-US");
      expect(formatted).toMatch(/\$\s?120/);
    });

    it("supports all predefined currencies", () => {
      expect(SUPPORTED_CURRENCIES.length).toBeGreaterThanOrEqual(4);
      expect(SUPPORTED_CURRENCIES.some((c) => c.code === "INR")).toBe(true);
    });
  });

  describe("formatDate", () => {
    it("formats date in DD/MM/YYYY format for en-IN", () => {
      const date = new Date(2026, 4, 15); // May 15, 2026
      const formatted = formatDate(date, "short", "en-IN");
      expect(formatted).toContain("15/05/2026");
    });

    it("returns friendly error for invalid date", () => {
      expect(formatDate("invalid-date")).toBe("Invalid date");
    });
  });

  describe("formatTime", () => {
    it("formats hours and minutes accurately", () => {
      const date = new Date("2026-05-15T14:35:00Z");
      const time = formatTime(date);
      expect(time).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe("formatDuration", () => {
    it("formats minutes into hours and minutes", () => {
      expect(formatDuration(135)).toBe("2h 15m");
      expect(formatDuration(60)).toBe("1h");
      expect(formatDuration(45)).toBe("45m");
      expect(formatDuration(0)).toBe("0m");
    });
  });

  describe("formatStops", () => {
    it("formats stop counts into friendly flight descriptions", () => {
      expect(formatStops(0)).toBe("Direct");
      expect(formatStops(1)).toBe("1 stop");
      expect(formatStops(2)).toBe("2 stops");
    });
  });
});
