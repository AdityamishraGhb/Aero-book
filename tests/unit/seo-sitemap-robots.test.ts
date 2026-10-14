import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { TOP_INDIAN_ROUTES } from "@/data/top-routes";

describe("SEO: Sitemap & Robots Generators", () => {
  it("generates a comprehensive sitemap with root, routes directory, and individual route pages", () => {
    const map = sitemap();
    expect(Array.isArray(map)).toBe(true);

    const urls = map.map((entry) => entry.url);

    // Root and routes index
    expect(urls.some((u) => u.endsWith("/") || u === "https://aerobook.flights")).toBe(true);
    expect(urls.some((u) => u.includes("/routes"))).toBe(true);

    // Contains all 20 individual route landing pages
    for (const route of TOP_INDIAN_ROUTES) {
      expect(urls.some((u) => u.includes(`/routes/${route.slug}`))).toBe(true);
      expect(urls.some((u) => u.includes(`/flights/${route.fromIata}-${route.toIata}`))).toBe(true);
    }

    // High priority for core pages
    const rootEntry = map.find(
      (u) =>
        !u.url.includes("/routes") &&
        !u.url.includes("/flights") &&
        !u.url.includes("/auth") &&
        !u.url.includes("/dev")
    );
    expect(rootEntry?.priority).toBe(1.0);
  });

  it("generates robots.txt with secure disallow rules and valid sitemap pointer", () => {
    const rules = robots();
    expect(rules.sitemap).toContain("/sitemap.xml");

    const ruleList = Array.isArray(rules.rules) ? rules.rules : [rules.rules];
    expect(ruleList.length).toBeGreaterThan(0);

    const primaryRule = ruleList[0];
    expect(primaryRule.userAgent).toBe("*");

    const disallows = Array.isArray(primaryRule.disallow)
      ? primaryRule.disallow
      : [primaryRule.disallow];
    expect(disallows).toContain("/api/");
    expect(disallows).toContain("/account");
    expect(disallows).toContain("/booking");

    const allows = Array.isArray(primaryRule.allow) ? primaryRule.allow : [primaryRule.allow];
    expect(allows).toContain("/");
    expect(allows).toContain("/routes/");
  });
});
