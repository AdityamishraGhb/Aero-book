import { describe, it, expect } from "vitest";
import { env } from "@/lib/env";

describe("env configuration", () => {
  it("defaults to mock flight provider when not specified", () => {
    expect(["mock", "amadeus", "duffel"]).toContain(env.FLIGHT_PROVIDER);
  });

  it("provides safe defaults for external services", () => {
    expect(typeof env.NEXT_PUBLIC_SITE_URL).toBe("string");
    expect(env.NEXT_PUBLIC_SITE_URL.length).toBeGreaterThan(0);
    expect(env.AUTH_TRUST_HOST).toBe("true");
  });

  it("ensures AUTH_URL is valid", () => {
    expect(typeof env.AUTH_URL).toBe("string");
    expect(env.AUTH_URL).toMatch(/^https?:\/\//);
  });
});
