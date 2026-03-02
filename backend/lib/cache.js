/**
 * lib/cache.js
 *
 * Lightweight in-memory response cache for heavy aggregate endpoints.
 * Per-user TTL-based cache — no Redis required for single-instance deployments.
 * Replace with Redis when scaling to multiple instances.
 *
 * Usage:
 *   import { cacheGet, cacheSet, cacheInvalidate } from '../lib/cache.js';
 */

const store = new Map();

/**
 * @param {string} key   - e.g. `dashboard:${userId}`
 * @returns {any|null}
 */
export const cacheGet = (key) => {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        store.delete(key);
        return null;
    }
    return entry.value;
};

/**
 * @param {string} key
 * @param {any}    value
 * @param {number} ttlMs  - TTL in milliseconds (default: 60s)
 */
export const cacheSet = (key, value, ttlMs = 60_000) => {
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
};

/**
 * Invalidate a single key or all keys matching a prefix.
 * @param {string} keyOrPrefix
 */
export const cacheInvalidate = (keyOrPrefix) => {
    for (const key of store.keys()) {
        if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
            store.delete(key);
        }
    }
};

/**
 * Express middleware factory: caches GET responses per user.
 * Adds X-Cache: HIT/MISS header.
 *
 * @param {number} ttlMs
 * @param {function} keyFn  - (req) => string — how to key the cache entry
 */
export const cacheMiddleware = (ttlMs = 60_000, keyFn = (req) => `${req.path}:${req.userId}`) => {
    return (req, res, next) => {
        if (req.method !== 'GET') return next();
        const key = keyFn(req);
        const cached = cacheGet(key);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(cached);
        }
        res.setHeader('X-Cache', 'MISS');

        // Intercept json() to cache the response
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode === 200) cacheSet(key, body, ttlMs);
            return originalJson(body);
        };
        next();
    };
};
