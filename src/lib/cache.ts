import { env } from "@/lib/env";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * In-memory LRU/TTL cache fallback for local development or when Redis is unconfigured.
 */
class InMemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private readonly maxEntries: number;

  constructor(maxEntries = 1000) {
    this.maxEntries = maxEntries;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    // Evict oldest if exceeding limit
    if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

const memoryCache = new InMemoryCache();

/**
 * Universal Cache Client with Upstash Redis and In-Memory fallback.
 */
export class CacheClient {
  private redisUrl = env.UPSTASH_REDIS_REST_URL;
  private redisToken = env.UPSTASH_REDIS_REST_TOKEN;
  private isRedisEnabled = Boolean(this.redisUrl && this.redisToken);

  /**
   * Fetch item from cache by key
   */
  async get<T>(key: string): Promise<T | null> {
    if (this.isRedisEnabled && this.redisUrl && this.redisToken) {
      try {
        const res = await fetch(`${this.redisUrl}/get/${encodeURIComponent(key)}`, {
          headers: {
            Authorization: `Bearer ${this.redisToken}`,
          },
          signal: AbortSignal.timeout(1500),
          cache: "no-store",
        });

        if (res.ok) {
          const data = (await res.json()) as { result?: string | null };
          if (data?.result) {
            try {
              return JSON.parse(data.result) as T;
            } catch {
              return data.result as unknown as T;
            }
          }
          return null;
        }
      } catch {
        // Fall back to in-memory cache silently on network/redis error
      }
    }

    return memoryCache.get<T>(key);
  }

  /**
   * Persist item in cache with TTL in seconds (default: 900s / 15 minutes)
   */
  async set<T>(key: string, value: T, ttlSeconds = 900): Promise<void> {
    const serialized = JSON.stringify(value);

    if (this.isRedisEnabled && this.redisUrl && this.redisToken) {
      try {
        const res = await fetch(
          `${this.redisUrl}/set/${encodeURIComponent(key)}?ex=${ttlSeconds}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.redisToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(serialized),
            signal: AbortSignal.timeout(1500),
          }
        );

        if (res.ok) return;
      } catch {
        // Fall back to memory cache
      }
    }

    memoryCache.set<T>(key, value, ttlSeconds);
  }

  /**
   * Remove item from cache
   */
  async delete(key: string): Promise<void> {
    if (this.isRedisEnabled && this.redisUrl && this.redisToken) {
      try {
        await fetch(`${this.redisUrl}/del/${encodeURIComponent(key)}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${this.redisToken}` },
          signal: AbortSignal.timeout(1500),
        });
      } catch {
        // Ignore
      }
    }

    memoryCache.delete(key);
  }

  /**
   * Clear in-memory cache (primarily for unit tests)
   */
  clear(): void {
    memoryCache.clear();
  }

  /**
   * Inspect current cache adapter
   */
  getStatus(): { adapter: "redis" | "memory"; memoryEntries: number } {
    return {
      adapter: this.isRedisEnabled ? "redis" : "memory",
      memoryEntries: memoryCache.size(),
    };
  }
}

export const cache = new CacheClient();
