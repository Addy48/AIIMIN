/**
 * accessService.js — waitlist gate: dev, tester, owner roles.
 * Email-based (works before and after Cognito migration).
 */
import { pool } from '../lib/db.js';
import { patchUserProfile } from './userProfileService.js';

const TIER_RANK = { explore: 0, core: 1, pro: 2, elite: 3 };

function isSubscriptionMode() {
  return process.env.SUBSCRIPTION_MODE === 'true';
}

async function getProfileTier(userId) {
  if (!userId) return 'explore';
  try {
    const { rows } = await pool.query(
      'SELECT subscription_tier FROM user_profiles WHERE user_id = $1 LIMIT 1',
      [userId],
    );
    return rows[0]?.subscription_tier || 'explore';
  } catch {
    return 'explore';
  }
}

async function resolveTierForUser(userId, privilegedDefault = 'elite') {
  if (isSubscriptionMode() && userId) {
    return getProfileTier(userId);
  }
  return privilegedDefault;
}

function parseList(envVar) {
  return (process.env[envVar] || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function parseIdList(envVar) {
  return (process.env[envVar] || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * Resolve access role for a signed-in user.
 * @returns {Promise<{ role: 'owner'|'dev'|'tester'|'public', canAccess: boolean, tier: string }>}
 */
export async function resolveAccess({ email, cognitoSub, userId }) {
  const normalizedEmail = normalizeEmail(email);
  const ownerIds = parseIdList('OWNER_COGNITO_SUBS');
  const ownerEmails = parseList('OWNER_EMAILS');
  const devEmails = parseList('DEV_EMAILS');
  const testerEmails = parseList('TESTER_EMAILS');

  const isOwnerById = cognitoSub && ownerIds.includes(cognitoSub);
  const isOwnerByEmail = normalizedEmail && ownerEmails.includes(normalizedEmail);

  if (isOwnerById || isOwnerByEmail) {
    if (userId && !isSubscriptionMode()) await ensureEliteTier(userId);
    const tier = await resolveTierForUser(userId, 'elite');
    return { role: 'owner', canAccess: true, tier };
  }

  if (normalizedEmail && devEmails.includes(normalizedEmail)) {
    if (userId && !isSubscriptionMode()) await ensureEliteTier(userId);
    const tier = await resolveTierForUser(userId, 'elite');
    return { role: 'dev', canAccess: true, tier };
  }

  if (normalizedEmail && testerEmails.includes(normalizedEmail)) {
    if (userId && !isSubscriptionMode()) await ensureEliteTier(userId);
    const tier = await resolveTierForUser(userId, 'elite');
    return { role: 'tester', canAccess: true, tier };
  }

  if (normalizedEmail) {
    try {
      const { rows } = await pool.query(
        `SELECT role FROM tester_allowlist WHERE lower(email) = $1 LIMIT 1`,
        [normalizedEmail],
      );
      if (rows.length > 0) {
        const role = rows[0].role === 'dev' ? 'dev' : 'tester';
        if (userId && !isSubscriptionMode()) await ensureEliteTier(userId);
        const tier = await resolveTierForUser(userId, 'elite');
        if (cognitoSub) {
          await pool.query(
            `UPDATE tester_allowlist SET cognito_sub = COALESCE(cognito_sub, $2)
             WHERE lower(email) = $1`,
            [normalizedEmail, cognitoSub],
          ).catch(() => {});
        }
        return { role, canAccess: true, tier };
      }
    } catch (err) {
      if (!/does not exist|relation.*tester_allowlist/i.test(err.message)) {
        console.warn('[access] allowlist check failed:', err.message);
      }
    }
  }

  const tier = userId ? await getProfileTier(userId) : 'explore';
  const waitlistEnabled = process.env.WAITLIST_MODE === 'true';
  return { role: 'public', canAccess: !waitlistEnabled, tier };
}

async function ensureEliteTier(userId) {
  try {
    const { rows } = await pool.query(
      'SELECT subscription_tier FROM user_profiles WHERE user_id = $1 LIMIT 1',
      [userId],
    );
    const current = rows[0]?.subscription_tier || 'explore';
    if ((TIER_RANK[current] ?? 0) < TIER_RANK.elite) {
      await patchUserProfile(pool, userId, { subscription_tier: 'elite' });
    }
  } catch (err) {
    console.warn('[access] elite tier patch failed:', err.message);
  }
}

export function getOwnerNotifyEmail() {
  return process.env.OWNER_NOTIFY_EMAIL
    || process.env.DEV_EMAIL
    || 'aadityaupadhyay10@gmail.com';
}
