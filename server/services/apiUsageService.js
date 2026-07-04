/**
 * apiUsageService.js — external API usage logging + daily budget enforcement.
 */
import { pool } from '../lib/db.js';

const ENV_LIMITS = {
  cricapi: 'CRICAPI_DAILY_LIMIT',
  rapidapi_cricket: 'RAPIDAPI_CRICKET_DAILY_LIMIT',
  gemini: 'GEMINI_DAILY_LIMIT',
  groq: 'GROQ_DAILY_LIMIT',
  moonshot: 'MOONSHOT_DAILY_LIMIT',
  sports_cron: 'SPORTS_CRON_DAILY_LIMIT',
};

const DEFAULT_LIMITS = {
  cricapi: 100,
  rapidapi_cricket: 100,
  gemini: 1500,
  groq: 14400,
  moonshot: 500,
  sports_cron: 48,
};

function nextUtcMidnight() {
  const now = new Date();
  const next = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0,
  ));
  return next.toISOString();
}

function resolveDailyLimit(provider) {
  const envKey = ENV_LIMITS[provider];
  const fromEnv = envKey ? parseInt(process.env[envKey] || '', 10) : NaN;
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
  return DEFAULT_LIMITS[provider] ?? 1000;
}

async function ensureBudgetRow(provider) {
  const dailyLimit = resolveDailyLimit(provider);
  await pool.query(
    `INSERT INTO api_provider_budgets (provider, daily_limit, used_today, reset_at)
     VALUES ($1, $2, 0, $3::timestamptz)
     ON CONFLICT (provider) DO NOTHING`,
    [provider, dailyLimit, nextUtcMidnight()],
  );
}

async function maybeResetBudget(provider) {
  await ensureBudgetRow(provider);
  await pool.query(
    `UPDATE api_provider_budgets
     SET used_today = 0,
         daily_limit = $2,
         reset_at = $3::timestamptz
     WHERE provider = $1
       AND reset_at <= NOW()`,
    [provider, resolveDailyLimit(provider), nextUtcMidnight()],
  );
}

/**
 * Log an external API call. Does not enforce budget by itself.
 */
export async function logApiUsage({
  userId = null,
  provider,
  endpoint,
  tokensOrHits = 1,
}) {
  if (!provider || !endpoint) return;
  try {
    await pool.query(
      `INSERT INTO api_usage_log (user_id, provider, endpoint, tokens_or_hits)
       VALUES ($1, $2, $3, $4)`,
      [userId, provider, endpoint, Math.max(1, tokensOrHits || 1)],
    );
  } catch (err) {
    if (!/does not exist|relation.*api_usage_log/i.test(err.message)) {
      console.warn('[apiUsage] log failed:', err.message);
    }
  }
}

/**
 * Check budget and increment if allowed. Returns { allowed, remaining, dailyLimit }.
 */
export async function consumeProviderBudget(provider, units = 1) {
  await maybeResetBudget(provider);
  const dailyLimit = resolveDailyLimit(provider);
  const { rows } = await pool.query(
    `UPDATE api_provider_budgets
     SET used_today = used_today + $2
     WHERE provider = $1
       AND used_today + $2 <= daily_limit
     RETURNING used_today, daily_limit, reset_at`,
    [provider, Math.max(1, units || 1)],
  );

  if (rows.length === 0) {
    const status = await getProviderBudgetStatus(provider);
    return {
      allowed: false,
      remaining: status?.remaining ?? 0,
      dailyLimit: status?.dailyLimit ?? dailyLimit,
    };
  }

  const row = rows[0];
  return {
    allowed: true,
    remaining: Math.max(0, row.daily_limit - row.used_today),
    dailyLimit: row.daily_limit,
  };
}

/**
 * Record usage: budget check + log row.
 */
export async function trackExternalCall({
  userId = null,
  provider,
  endpoint,
  units = 1,
  enforceBudget = true,
}) {
  if (enforceBudget) {
    const budget = await consumeProviderBudget(provider, units);
    if (!budget.allowed) {
      const err = new Error(`${provider} daily budget exceeded`);
      err.code = 'BUDGET_EXCEEDED';
      throw err;
    }
  }
  await logApiUsage({ userId, provider, endpoint, tokensOrHits: units });
  return true;
}

export async function getProviderBudgetStatus(provider) {
  await maybeResetBudget(provider);
  const { rows } = await pool.query(
    `SELECT provider, daily_limit, used_today, reset_at
     FROM api_provider_budgets
     WHERE provider = $1`,
    [provider],
  );
  if (!rows.length) {
    return {
      provider,
      dailyLimit: resolveDailyLimit(provider),
      usedToday: 0,
      remaining: resolveDailyLimit(provider),
      resetAt: nextUtcMidnight(),
    };
  }
  const row = rows[0];
  return {
    provider: row.provider,
    dailyLimit: row.daily_limit,
    usedToday: row.used_today,
    remaining: Math.max(0, row.daily_limit - row.used_today),
    resetAt: row.reset_at,
  };
}

export async function getAllProviderBudgets() {
  const providers = Object.keys(DEFAULT_LIMITS);
  const statuses = await Promise.all(providers.map((p) => getProviderBudgetStatus(p)));
  return statuses;
}

export async function getUsageSummary() {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [byProvider, byUser, totals] = await Promise.all([
    pool.query(
      `SELECT provider,
              COUNT(*)::int AS calls,
              COALESCE(SUM(tokens_or_hits), 0)::int AS units
       FROM api_usage_log
       WHERE created_at >= $1
       GROUP BY provider
       ORDER BY units DESC`,
      [todayStart.toISOString()],
    ).catch(() => ({ rows: [] })),
    pool.query(
      `SELECT u.email,
              l.user_id,
              l.provider,
              COUNT(*)::int AS calls,
              COALESCE(SUM(l.tokens_or_hits), 0)::int AS units
       FROM api_usage_log l
       LEFT JOIN users u ON u.id = l.user_id
       WHERE l.created_at >= $1
         AND l.user_id IS NOT NULL
       GROUP BY u.email, l.user_id, l.provider
       ORDER BY units DESC
       LIMIT 50`,
      [todayStart.toISOString()],
    ).catch(() => ({ rows: [] })),
    pool.query(
      `SELECT COUNT(*)::int AS total_calls,
              COALESCE(SUM(tokens_or_hits), 0)::int AS total_units
       FROM api_usage_log
       WHERE created_at >= $1`,
      [todayStart.toISOString()],
    ).catch(() => ({ rows: [{ total_calls: 0, total_units: 0 }] })),
  ]);

  return {
    date: todayStart.toISOString().slice(0, 10),
    totals: totals.rows[0] || { total_calls: 0, total_units: 0 },
    byProvider: byProvider.rows,
    byUser: byUser.rows,
  };
}
