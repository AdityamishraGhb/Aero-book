import { describe, it, expect } from "vitest";
import { AIRPORTS, getAirportByIata, searchAirports } from "@/data/airports";

describe("Airport Dataset & Search", () => {
  it("contains at least 150 major global airports", () => {
    expect(AIRPORTS.length).toBeGreaterThanOrEqual(150);
  });

  it("provides extensive coverage for Indian airports (35+)", () => {
    const indianAirports = AIRPORTS.filter((a) => a.countryCode === "IN");
    expect(indianAirports.length).toBeGreaterThanOrEqual(35);

    // Verify key domestic airports exist
    const keyIndianIatas = [
      "DEL",
      "BOM",
      "BLR",
      "MAA",
      "CCU",
      "HYD",
      "GOI",
      "COK",
      "PNQ",
      "AMD",
      "JAI",
    ];
    for (const code of keyIndianIatas) {
      expect(AIRPORTS.some((a) => a.iata === code)).toBe(true);
    }
  });

  it("validates all airport records have proper domain schemas", () => {
    for (const airport of AIRPORTS) {
      expect(airport.iata).toMatch(/^[A-Z]{3}$/);
      expect(airport.city.length).toBeGreaterThan(0);
      expect(airport.name.length).toBeGreaterThan(0);
      expect(airport.country.length).toBeGreaterThan(0);
      expect(airport.lat).toBeGreaterThanOrEqual(-90);
      expect(airport.lat).toBeLessThanOrEqual(90);
      expect(airport.lon).toBeGreaterThanOrEqual(-180);
      expect(airport.lon).toBeLessThanOrEqual(180);
      expect(airport.timezone).toBeTruthy();
    }
  });

  describe("getAirportByIata", () => {
    it("retrieves airport by IATA case-insensitively", () => {
      const delUpper = getAirportByIata("DEL");
      const delLower = getAirportByIata("del");
      expect(delUpper).toBeDefined();
      expect(delUpper?.city).toBe("New Delhi");
      expect(delLower?.iata).toBe("DEL");
    });

    it("returns undefined for unknown airport code", () => {
      expect(getAirportByIata("ZZZ")).toBeUndefined();
      expect(getAirportByIata("")).toBeUndefined();
    });
  });

  describe("searchAirports", () => {
    it("returns popular hubs when query is empty", () => {
      const results = searchAirports("", 5);
      expect(results.length).toBe(5);
      expect(results.some((a) => a.iata === "DEL")).toBe(true);
    });

    it("prioritizes exact IATA match first", () => {
      const results = searchAirports("bom");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].iata).toBe("BOM");
    });

    it("finds airports by city prefix", () => {
      const results = searchAirports("Bengaluru");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].iata).toBe("BLR");
    });

    it("respects result limit parameter", () => {
      const results = searchAirports("a", 3);
      expect(results.length).toBeLessThanOrEqual(3);
    });
  });
});
