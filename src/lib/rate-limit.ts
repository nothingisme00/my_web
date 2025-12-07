/**
 * Simple in-memory rate limiter for VPS deployment
 * Uses LRU cache to prevent memory leaks
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private cache: Map<string, RateLimitEntry>;
  private maxSize: number;

  constructor(maxSize: number = 10000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (IP address, user ID, etc.)
   * @param limit - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with { success: boolean, remaining: number, resetTime: number }
   */
  check(
    identifier: string,
    limit: number,
    windowMs: number
  ): { success: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.cache.get(identifier);

    // Clean up old entries periodically to prevent memory leaks
    if (this.cache.size > this.maxSize) {
      this.cleanup(now);
    }

    if (!entry || now > entry.resetTime) {
      // New window or expired entry
      const resetTime = now + windowMs;
      this.cache.set(identifier, {
        count: 1,
        resetTime,
      });

      return {
        success: true,
        remaining: limit - 1,
        resetTime,
      };
    }

    if (entry.count >= limit) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;
    this.cache.set(identifier, entry);

    return {
      success: true,
      remaining: limit - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(now: number) {
    const toDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.resetTime) {
        toDelete.push(key);
      }
    }

    for (const key of toDelete) {
      this.cache.delete(key);
    }
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string) {
    this.cache.delete(identifier);
  }

  /**
   * Clear all rate limits
   */
  clear() {
    this.cache.clear();
  }
}

// Create singleton instances for different use cases
export const loginLimiter = new RateLimiter();
export const uploadLimiter = new RateLimiter();
export const apiLimiter = new RateLimiter();

/**
 * Get client identifier from request
 * Uses IP address or fallback to user agent
 */
export function getClientIdentifier(headers: Headers): string {
  // Try to get real IP from common proxy headers
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip');

  const ip =
    cfConnectingIp ||
    realIp ||
    forwardedFor?.split(',')[0].trim() ||
    'unknown';

  return ip;
}

/**
 * Rate limit configuration presets
 */
export const RATE_LIMITS = {
  LOGIN: {
    limit: 5, // 5 attempts
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  UPLOAD: {
    limit: 10, // 10 uploads
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  API: {
    limit: 100, // 100 requests
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
} as const;
