import { describe, it, expect } from "vitest";
import { buildSearchUrl, parseSearchUrl } from "@/lib/url";

describe("Flight Search URL Utilities", () => {
  describe("buildSearchUrl", () => {
    it("builds standard canonical one-way search URL", () => {
      const url = buildSearchUrl({
        from: "DEL",
        to: "BOM",
        depart: "2026-11-20",
        trip: "oneway",
        adults: 1,
        cabin: "economy",
      });

      expect(url).toBe("/flights/DEL-BOM?depart=2026-11-20&trip=oneway&adults=1&cabin=economy");
    });

    it("includes return date for round-trip flights", () => {
      const url = buildSearchUrl({
        from: "del",
        to: "bom",
        depart: "2026-11-20",
        return: "2026-11-25",
        trip: "roundtrip",
        adults: 2,
        cabin: "business",
        directOnly: true,
      });

      expect(url).toContain("/flights/DEL-BOM");
      expect(url).toContain("depart=2026-11-20");
      expect(url).toContain("return=2026-11-25");
      expect(url).toContain("trip=roundtrip");
      expect(url).toContain("adults=2");
      expect(url).toContain("cabin=business");
      expect(url).toContain("directOnly=true");
    });

    it("includes children and infants when present", () => {
      const url = buildSearchUrl({
        from: "BLR",
        to: "GOI",
        depart: "2026-12-01",
        adults: 2,
        children: 1,
        infants: 1,
      });

      expect(url).toContain("children=1");
      expect(url).toContain("infants=1");
    });
  });

  describe("parseSearchUrl", () => {
    it("extracts origin, destination and params from pathname and query", () => {
      const pathname = "/flights/DEL-BOM";
      const searchParams = new URLSearchParams(
        "depart=2026-11-20&trip=oneway&adults=2&cabin=business&directOnly=true"
      );

      const parsed = parseSearchUrl(pathname, searchParams);
      expect(parsed.from).toBe("DEL");
      expect(parsed.to).toBe("BOM");
      expect(parsed.depart).toBe("2026-11-20");
      expect(parsed.trip).toBe("oneway");
      expect(parsed.adults).toBe(2);
      expect(parsed.cabin).toBe("business");
      expect(parsed.directOnly).toBe(true);
    });
  });
});
