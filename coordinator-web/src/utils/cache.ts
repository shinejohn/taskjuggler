/**
 * Simple in-memory cache utility for API responses
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Generate cache key from URL and params
   */
  private getCacheKey(url: string, params?: Record<string, any>): string {
    const sortedParams = params
      ? Object.keys(params)
          .sort()
          .map((key) => `${key}=${JSON.stringify(params[key])}`)
          .join('&')
      : '';
    return `${url}${sortedParams ? `?${sortedParams}` : ''}`;
  }

  /**
   * Get cached data if still valid
   */
  get<T>(url: string, params?: Record<string, any>): T | null {
    const key = this.getCacheKey(url, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache entry with TTL in milliseconds
   */
  set<T>(url: string, data: T, ttl: number = 60000, params?: Record<string, any>): void {
    const key = this.getCacheKey(url, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Invalidate cache for a specific URL pattern
   */
  invalidate(urlPattern: string | RegExp): void {
    if (typeof urlPattern === 'string') {
      for (const key of this.cache.keys()) {
        if (key.includes(urlPattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      for (const key of this.cache.keys()) {
        if (urlPattern.test(key)) {
          this.cache.delete(key);
        }
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Track pending request to prevent duplicate concurrent requests
   */
  getPendingRequest<T>(key: string): Promise<T> | null {
    return this.pendingRequests.get(key) || null;
  }

  /**
   * Set pending request
   */
  setPendingRequest<T>(key: string, promise: Promise<T>): void {
    this.pendingRequests.set(key, promise);
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
  }

  /**
   * Clear pending requests
   */
  clearPendingRequests(): void {
    this.pendingRequests.clear();
  }
}

export const apiCache = new ApiCache();

/**
 * Cache TTL constants (in milliseconds)
 */
export const CACHE_TTL = {
  SHORT: 30000, // 30 seconds - for frequently changing data
  MEDIUM: 60000, // 1 minute - default
  LONG: 300000, // 5 minutes - for relatively static data
  VERY_LONG: 900000, // 15 minutes - for static data like organizations
} as const;

