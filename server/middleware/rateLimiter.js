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
      const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      console.warn(`[RATE LIMIT] ${key} exceeded ${max}/${windowMs}ms`);
      c.header('Retry-After', String(retryAfterSec));
      return c.json({
        error: 'Too many requests. Try again later.',
        retryAfterSec,
      }, 429);
    }
    await next();
  };
}

const ip = (c) => c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
  || c.req.header('x-real-ip')
  || 'unknown';

/** Only brute-forceable credential endpoints — not OAuth callbacks or session reads */
export function isCredentialAuthPath(path = '') {
  const p = path.toLowerCase();
  return (
    p.includes('/sign-in/email')
    || p.includes('/sign-in/username')
    || p.includes('/sign-in/social')
    || p.includes('/sign-up/')
    || p.includes('/forget-password')
    || p.includes('/reset-password')
    || p.includes('/request-password-reset')
  );
}

/** Login/signup/reset — per IP; allow QA retries without opening brute-force window */
export const authCredentialLimiter = createLimiter({
  windowMs: 15 * 60_000,
  max: 30,
  keyFn: (c) => `auth-cred:${ip(c)}`,
});

/** Apply credential limiter only on sign-in/sign-up/reset — skip OAuth callback + get-session */
export const authCredentialLimiterIfSensitive = async (c, next) => {
  const path = c.req.path || '';
  if (!isCredentialAuthPath(path)) return next();
  return authCredentialLimiter(c, next);
};

export const generalLimiter = createLimiter({
  windowMs: 60_000,
  max: 100,
  keyFn: (c) => `general:${ip(c)}`,
});

export const authLimiter = createLimiter({
  windowMs: 15 * 60_000,
  max: 30,
  keyFn: (c) => `auth:${ip(c)}`,
});

export const aiLimiter = createLimiter({
  windowMs: 60_000,
  // Burst cap — tier daily budgets still apply in trackExternalCall
  max: 8,
  keyFn: (c) => `ai:${c.get('userId') || ip(c)}`,
});

/** Stricter burst for anonymous / unresolved sessions hitting AI-shaped paths */
export const aiAnonymousLimiter = createLimiter({
  windowMs: 60_000,
  max: 2,
  keyFn: (c) => `ai-anon:${ip(c)}`,
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

/** Native mobile sync — per authenticated user */
export const mobileSyncLimiter = createLimiter({
  windowMs: 60_000,
  max: 120,
  keyFn: (c) => `mobile-sync:${c.get('userId') || ip(c)}`,
});

/** Native health probe — generous for monitors */
export const mobileHealthLimiter = createLimiter({
  windowMs: 60_000,
  max: 300,
  keyFn: (c) => `mobile-health:${ip(c)}`,
});
