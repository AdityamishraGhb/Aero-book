import { describe, it, expect, beforeEach, vi } from "vitest";
import { CacheClient } from "@/lib/cache";

describe("CacheClient", () => {
  let cache: CacheClient;

  beforeEach(() => {
    cache = new CacheClient();
    cache.clear();
  });

  it("stores and retrieves values accurately", async () => {
    await cache.set("test:key:1", { message: "hello aerobook" }, 60);
    const retrieved = await cache.get<{ message: string }>("test:key:1");
    expect(retrieved).toEqual({ message: "hello aerobook" });
  });

  it("returns null for non-existent keys", async () => {
    const missing = await cache.get("unknown:key");
    expect(missing).toBeNull();
  });

  it("deletes stored keys", async () => {
    await cache.set("test:delete", 42, 60);
    expect(await cache.get("test:delete")).toBe(42);

    await cache.delete("test:delete");
    expect(await cache.get("test:delete")).toBeNull();
  });

  it("expires keys after TTL expires", async () => {
    vi.useFakeTimers();

    await cache.set("test:expiring", "temporary", 5); // 5 seconds TTL
    expect(await cache.get("test:expiring")).toBe("temporary");

    // Fast forward 6 seconds
    vi.advanceTimersByTime(6000);

    expect(await cache.get("test:expiring")).toBeNull();

    vi.useRealTimers();
  });

  it("reports adapter status", () => {
    const status = cache.getStatus();
    expect(["redis", "memory"]).toContain(status.adapter);
    expect(typeof status.memoryEntries).toBe("number");
  });
});
