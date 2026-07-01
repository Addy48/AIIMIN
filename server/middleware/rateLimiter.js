/**
 * In-memory tiered rate limiters for Hono API.
 * For production scale, migrate to Upstash Redis.
 */

const stores = new Map();

function createLimiter({ windowMs, max, keyFn }) {
  return async (c, next) => {
    const key = keyFn(c);
    const now = Date.now();
    let bucket = stores.get(key);
    if (!bucket || now > bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      stores.set(key, bucket);
    }
    bucket.count += 1;
    if (bucket.count > max) {
      console.warn(`[RATE LIMIT] ${key} exceeded ${max}/${windowMs}ms`);
      return c.json({ error: 'Too many requests. Try again later.' }, 429);
    }
    await next();
  };
}

const ip = (c) => c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
  || c.req.header('x-real-ip')
  || 'unknown';

export const generalLimiter = createLimiter({
  windowMs: 60_000,
  max: 100,
  keyFn: (c) => `general:${ip(c)}`,
});

export const authLimiter = createLimiter({
  windowMs: 15 * 60_000,
  max: 10,
  keyFn: (c) => `auth:${ip(c)}`,
});

export const aiLimiter = createLimiter({
  windowMs: 60_000,
  max: 5,
  keyFn: (c) => `ai:${c.get('userId') || ip(c)}`,
});

/** Per-user sports manual refresh — expensive upstream aggregation */
export const sportsRefreshLimiter = createLimiter({
  windowMs: 15 * 60_000,
  max: 3,
  keyFn: (c) => `sports-refresh:${c.get('userId') || ip(c)}`,
});

export const waitlistLimiter = createLimiter({
  windowMs: 60 * 60_000,
  max: 3,
  keyFn: (c) => `waitlist:${ip(c)}`,
});

export const feedbackLimiter = createLimiter({
  windowMs: 60 * 60_000,
  max: 10,
  keyFn: (c) => `feedback:${ip(c)}`,
});

export const accountCreationLimiter = createLimiter({
  windowMs: 60 * 60_000,
  max: 3,
  keyFn: (c) => `account:${ip(c)}`,
});
