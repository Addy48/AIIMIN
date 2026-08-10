/**
 * apiUsageService.js — external API usage logging + daily budget enforcement.
 * Dual gate: (1) per-user tier AI quota  (2) global provider free-key ceiling
 */
import { pool } from '../lib/db.js';
import { getUserTier } from './billingService.js';

const ENV_LIMITS = {
  cricapi: 'CRICAPI_DAILY_LIMIT',
  rapidapi_cricket: 'RAPIDAPI_CRICKET_DAILY_LIMIT',
  gemini: 'GEMINI_DAILY_LIMIT',
  groq: 'GROQ_DAILY_LIMIT',
  openrouter: 'OPENROUTER_DAILY_LIMIT',
  moonshot: 'MOONSHOT_DAILY_LIMIT',
  sports_cron: 'SPORTS_CRON_DAILY_LIMIT',
};

/** Global ceilings — protect free-sourced provider keys (org-wide). */
const DEFAULT_LIMITS = {
  cricapi: 100,
  rapidapi_cricket: 100,
  gemini: 150,
  groq: 800,
  openrouter: 40,
  moonshot: 80,
  sports_cron: 48,
};

/** Providers that burn LLM free quota — counted against user tier. */
export const AI_PROVIDERS = new Set(['gemini', 'groq', 'openrouter', 'moonshot']);

/**
 * Per-user daily AI call limits by subscription_tier.
 * Matches plan marketing: Explore = 1 insight/day; higher tiers more, not infinite.
 * Override: AI_DAILY_LIMIT_EXPLORE / _CORE / _PRO / _ELITE
 *
 * Report generation uses a SEPARATE monthly pool (see REPORT_GEN_*).
 * Deep / Life OS Review generation must not burn daily AI budget.
 */
const DEFAULT_TIER_AI_LIMITS = {
  explore: 1,
  core: 10,
  pro: 25,
  elite: 40,
};

/** Monthly generation pools — separate from daily AI. */
const DEFAULT_REPORT_GEN_LIMITS = {
  explore: { standard_pdf: 0, deep_report: 0 },
  core: { standard_pdf: 0, deep_report: 0 },
  pro: { standard_pdf: 6, deep_report: 0 },
  /** Elite: unlimited Standard PDFs; 3 Deep Intelligence Reports / month */
  elite: { standard_pdf: -1, deep_report: 3 },
};

/** Endpoints tagged as report generation — excluded from daily AI pool. */
export const REPORT_GEN_ENDPOINT_PREFIX = '/intelligence/report-gen';

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

function utcTodayStart() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function resolveDailyLimit(provider) {
  const envKey = ENV_LIMITS[provider];
  const fromEnv = envKey ? parseInt(process.env[envKey] || '', 10) : NaN;
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
  return DEFAULT_LIMITS[provider] ?? 1000;
}

export function resolveTierAiLimit(tier) {
  const t = String(tier || 'explore').toLowerCase();
  const envKey = `AI_DAILY_LIMIT_${t.toUpperCase()}`;
  const fromEnv = parseInt(process.env[envKey] || '', 10);
  if (Number.isFinite(fromEnv) && fromEnv >= 0) return fromEnv;
  return DEFAULT_TIER_AI_LIMITS[t] ?? DEFAULT_TIER_AI_LIMITS.explore;
}

export function listTierAiLimits() {
  return Object.fromEntries(
    Object.keys(DEFAULT_TIER_AI_LIMITS).map((tier) => [tier, resolveTierAiLimit(tier)]),
  );
}

export function resolveReportGenLimit(tier, kind = 'standard_pdf') {
  const t = String(tier || 'explore').toLowerCase();
  const k = kind === 'deep_report' ? 'deep_report' : 'standard_pdf';
  const envKey = `AI_REPORT_GEN_${t.toUpperCase()}_${k.toUpperCase()}`;
  const fromEnv = parseInt(process.env[envKey] || '', 10);
  if (Number.isFinite(fromEnv)) return fromEnv;
  return DEFAULT_REPORT_GEN_LIMITS[t]?.[k] ?? 0;
}

export function listReportGenLimits() {
  return Object.fromEntries(
    Object.keys(DEFAULT_REPORT_GEN_LIMITS).map((tier) => [
      tier,
      {
        standard_pdf: resolveReportGenLimit(tier, 'standard_pdf'),
        deep_report: resolveReportGenLimit(tier, 'deep_report'),
      },
    ]),
  );
}

function utcMonthStart() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0)).toISOString();
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
     SET used_today = used_today + $2,
         daily_limit = $3
     WHERE provider = $1
       AND used_today + $2 <= $3
     RETURNING used_today, daily_limit, reset_at`,
    [provider, Math.max(1, units || 1), dailyLimit],
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

async function getUserAiUsedToday(userId) {
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(tokens_or_hits), 0)::int AS units
     FROM api_usage_log
     WHERE user_id = $1
       AND created_at >= $2::timestamptz
       AND provider = ANY($3::text[])
       AND endpoint NOT LIKE $4`,
    [userId, utcTodayStart(), [...AI_PROVIDERS], `${REPORT_GEN_ENDPOINT_PREFIX}%`],
  );
  return rows[0]?.units || 0;
}

async function getUserReportGenUsedMonth(userId, kind = 'standard_pdf') {
  const endpoint = `${REPORT_GEN_ENDPOINT_PREFIX}/${kind === 'deep_report' ? 'deep_report' : 'standard_pdf'}`;
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(tokens_or_hits), 0)::int AS units
     FROM api_usage_log
     WHERE user_id = $1
       AND created_at >= $2::timestamptz
       AND endpoint = $3`,
    [userId, utcMonthStart(), endpoint],
  );
  return rows[0]?.units || 0;
}

/**
 * Monthly report-generation pool. Does not touch daily AI quota.
 * kind: 'standard_pdf' | 'deep_report'
 * limit -1 = unlimited
 */
export async function checkUserReportGenBudget(userId, kind = 'standard_pdf', units = 1) {
  if (!userId) {
    return { allowed: true, remaining: null, monthlyLimit: null, tier: null, usedThisMonth: 0, kind };
  }
  const tier = await getUserTier(userId);
  const monthlyLimit = resolveReportGenLimit(tier, kind);
  if (monthlyLimit === 0) {
    return {
      allowed: false,
      remaining: 0,
      monthlyLimit: 0,
      tier,
      usedThisMonth: 0,
      kind,
    };
  }
  if (monthlyLimit < 0) {
    return {
      allowed: true,
      remaining: null,
      monthlyLimit: -1,
      tier,
      usedThisMonth: await getUserReportGenUsedMonth(userId, kind).catch(() => 0),
      kind,
    };
  }
  const usedThisMonth = await getUserReportGenUsedMonth(userId, kind).catch(() => 0);
  const need = Math.max(1, units || 1);
  const remaining = Math.max(0, monthlyLimit - usedThisMonth);
  return {
    allowed: usedThisMonth + need <= monthlyLimit,
    remaining,
    monthlyLimit,
    tier,
    usedThisMonth,
    kind,
  };
}

export async function consumeReportGenBudget(userId, kind = 'standard_pdf', units = 1) {
  const status = await checkUserReportGenBudget(userId, kind, units);
  if (!status.allowed) {
    const err = new Error(
      status.monthlyLimit === 0
        ? `Report generation not included on ${status.tier} plan.`
        : `Monthly ${kind} generation pool exhausted (${status.monthlyLimit}/month).`,
    );
    err.code = 'REPORT_GEN_BUDGET_EXCEEDED';
    err.meta = status;
    throw err;
  }
  await logApiUsage({
    userId,
    provider: 'report_gen',
    endpoint: `${REPORT_GEN_ENDPOINT_PREFIX}/${kind === 'deep_report' ? 'deep_report' : 'standard_pdf'}`,
    tokensOrHits: Math.max(1, units || 1),
  });
  return checkUserReportGenBudget(userId, kind, 0);
}

/**
 * Per-user AI quota for the day (tier-based). Does not increment — caller logs after.
 * Report-gen endpoints are excluded from this pool (see getUserAiUsedToday).
 */
export async function checkUserAiBudget(userId, units = 1) {
  if (!userId) {
    return { allowed: true, remaining: null, dailyLimit: null, tier: null, usedToday: 0 };
  }
  const tier = await getUserTier(userId);
  const dailyLimit = resolveTierAiLimit(tier);
  const usedToday = await getUserAiUsedToday(userId).catch(() => 0);
  const need = Math.max(1, units || 1);
  const remaining = Math.max(0, dailyLimit - usedToday);
  return {
    allowed: usedToday + need <= dailyLimit,
    remaining,
    dailyLimit,
    tier,
    usedToday,
  };
}

export async function getUserAiBudgetStatus(userId) {
  const status = await checkUserAiBudget(userId, 0);
  const [std, deep] = await Promise.all([
    checkUserReportGenBudget(userId, 'standard_pdf', 0),
    checkUserReportGenBudget(userId, 'deep_report', 0),
  ]);
  return {
    ...status,
    remaining: Math.max(0, (status.dailyLimit ?? 0) - (status.usedToday ?? 0)),
    resetAt: nextUtcMidnight(),
    limitsByTier: listTierAiLimits(),
    reportGen: {
      standard_pdf: std,
      deep_report: deep,
      limitsByTier: listReportGenLimits(),
    },
  };
}

/**
 * Record usage: user-tier AI gate (if applicable) + global provider ceiling + log.
 * Caps units per call to blunt abuse. Serializes per-user AI burns via advisory lock.
 */
export async function trackExternalCall({
  userId = null,
  provider,
  endpoint,
  units = 1,
  enforceBudget = true,
}) {
  const need = Math.min(5, Math.max(1, Number(units) || 1));
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (userId) {
      // Serialize concurrent AI burns for the same user (race: check then log)
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1::text))', [`ai-budget:${userId}`]);
    }

    if (enforceBudget && userId && AI_PROVIDERS.has(provider)) {
      const tier = await getUserTier(userId);
      const dailyLimit = resolveTierAiLimit(tier);
      const { rows: usedRows } = await client.query(
        `SELECT COALESCE(SUM(tokens_or_hits), 0)::int AS units
         FROM api_usage_log
         WHERE user_id = $1
           AND created_at >= $2::timestamptz
           AND provider = ANY($3::text[])
           AND endpoint NOT LIKE $4`,
        [userId, utcTodayStart(), [...AI_PROVIDERS], `${REPORT_GEN_ENDPOINT_PREFIX}%`],
      );
      const usedToday = usedRows[0]?.units || 0;
      if (usedToday + need > dailyLimit) {
        const err = new Error(
          `AI daily limit reached for ${tier} plan (${dailyLimit}/day). Upgrade for more.`,
        );
        err.code = 'USER_AI_BUDGET_EXCEEDED';
        err.meta = {
          allowed: false,
          remaining: Math.max(0, dailyLimit - usedToday),
          dailyLimit,
          tier,
          usedToday,
        };
        throw err;
      }
    }

    if (enforceBudget) {
      await maybeResetBudget(provider);
      const dailyLimit = resolveDailyLimit(provider);
      const { rows } = await client.query(
        `UPDATE api_provider_budgets
         SET used_today = used_today + $2,
             daily_limit = $3
         WHERE provider = $1
           AND used_today + $2 <= $3
         RETURNING used_today, daily_limit`,
        [provider, need, dailyLimit],
      );
      if (!rows.length) {
        const err = new Error(`${provider} daily budget exceeded`);
        err.code = 'BUDGET_EXCEEDED';
        throw err;
      }
    }

    await client.query(
      `INSERT INTO api_usage_log (user_id, provider, endpoint, tokens_or_hits)
       VALUES ($1, $2, $3, $4)`,
      [userId, provider, endpoint, need],
    );
    await client.query('COMMIT');
    return true;
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (_) { /* ignore */ }
    throw err;
  } finally {
    client.release();
  }
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
  // Keep displayed limit in sync with current env defaults
  const dailyLimit = resolveDailyLimit(provider);
  return {
    provider: row.provider,
    dailyLimit,
    usedToday: row.used_today,
    remaining: Math.max(0, dailyLimit - row.used_today),
    resetAt: row.reset_at,
  };
}

export async function getAllProviderBudgets() {
  const providers = Object.keys(DEFAULT_LIMITS);
  const statuses = await Promise.all(providers.map((p) => getProviderBudgetStatus(p)));
  return statuses;
}

export async function getUsageSummary() {
  const todayStart = utcTodayStart();

  const [byProvider, byUser, totals] = await Promise.all([
    pool.query(
      `SELECT provider,
              COUNT(*)::int AS calls,
              COALESCE(SUM(tokens_or_hits), 0)::int AS units
       FROM api_usage_log
       WHERE created_at >= $1
       GROUP BY provider
       ORDER BY units DESC`,
      [todayStart],
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
      [todayStart],
    ).catch(() => ({ rows: [] })),
    pool.query(
      `SELECT COUNT(*)::int AS total_calls,
              COALESCE(SUM(tokens_or_hits), 0)::int AS total_units
       FROM api_usage_log
       WHERE created_at >= $1`,
      [todayStart],
    ).catch(() => ({ rows: [{ total_calls: 0, total_units: 0 }] })),
  ]);

  return {
    date: todayStart.slice(0, 10),
    totals: totals.rows[0] || { total_calls: 0, total_units: 0 },
    byProvider: byProvider.rows,
    byUser: byUser.rows,
    tierAiLimits: listTierAiLimits(),
  };
}
