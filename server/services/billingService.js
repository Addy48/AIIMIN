/**
 * Subscription tiers + Stripe checkout (P11).
 * Click-upgrade is the default until Stripe prices are configured.
 */
import { pool } from '../lib/db.js';
import { patchUserProfile, getUserProfile } from './userProfileService.js';

export const TIER_ORDER = ['explore', 'core', 'pro', 'elite'];

export const TIERS = {
  explore: {
    id: 'explore',
    name: 'Explore',
    price_inr: 0,
    features: ['Limited daily logging', '3 habits', '2 goals', 'Basic overview', '1 AI call per day'],
  },
  core: {
    id: 'core',
    name: 'Core',
    price_inr: 29,
    stripe_price_env: 'STRIPE_PRICE_CORE',
    features: [
      'Full discipline engine + urge tracking',
      '5 journal modes with AI analysis',
      'Finance safe-to-spend + SIP planner',
      'Sports feed personalization',
      'Lab cognitive benchmarks',
      '10 AI calls per day',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price_inr: 59,
    stripe_price_env: 'STRIPE_PRICE_PRO',
    features: [
      'Everything in Core',
      'Family vault document storage',
      'Weekly AI life review emails',
      'Advanced finance what-if',
      'Priority support',
      '25 AI calls per day',
    ],
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price_inr: 99,
    stripe_price_env: 'STRIPE_PRICE_ELITE',
    features: [
      'Everything in Pro',
      'Early access to new modules',
      'Founder priority support',
      '40 AI calls per day (highest quota)',
      'Lifetime feature previews',
    ],
  },
};

/** Stripe secret + at least one price id present. */
export function isStripeCheckoutReady() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return false;
  return Boolean(
    process.env.STRIPE_PRICE_CORE
    || process.env.STRIPE_PRICE_PRO
    || process.env.STRIPE_PRICE_ELITE,
  );
}

/**
 * Instant plan changes without Stripe.
 * On when SUBSCRIPTION_MODE=true, or when Stripe is not ready yet.
 */
export function isClickUpgradeEnabled() {
  if (process.env.SUBSCRIPTION_MODE === 'true') return true;
  if (process.env.SUBSCRIPTION_MODE === 'false' && isStripeCheckoutReady()) return false;
  return !isStripeCheckoutReady();
}

/** Alias kept for existing callers. */
export function isSubscriptionMode() {
  return isClickUpgradeEnabled();
}

/**
 * Testing allows up + down. Set UPGRADE_ONLY=true later to block downgrades.
 */
export function isUpgradeOnlyMode() {
  return process.env.UPGRADE_ONLY === 'true';
}

export function tierRank(tierId) {
  const idx = TIER_ORDER.indexOf(tierId);
  return idx >= 0 ? idx : 0;
}

export function listPlans() {
  return Object.values(TIERS);
}

export async function getUserTier(userId) {
  const profile = await getUserProfile(pool, userId);
  return profile?.subscription_tier || 'explore';
}

export async function selectSubscriptionTier(userId, tierId) {
  if (!TIERS[tierId]) {
    throw new Error('Invalid tier');
  }

  if (!isClickUpgradeEnabled()) {
    throw new Error('Billing checkout required');
  }

  const current = await getUserTier(userId);
  if (isUpgradeOnlyMode() && tierRank(tierId) < tierRank(current)) {
    const err = new Error('Downgrades are disabled until billing is live');
    err.code = 'UPGRADE_ONLY';
    throw err;
  }

  return handleSubscriptionUpgrade(userId, tierId);
}

export async function createCheckoutSession(userId, tierId, successUrl, cancelUrl) {
  const tier = TIERS[tierId];
  if (!tier) {
    throw new Error('Invalid tier');
  }

  if (isClickUpgradeEnabled()) {
    await selectSubscriptionTier(userId, tierId);
    const sep = successUrl.includes('?') ? '&' : '?';
    return {
      subscriptionMode: true,
      clickUpgrade: true,
      tier: tierId,
      url: `${successUrl}${sep}upgraded=1&tier=${tierId}`,
    };
  }

  if (tierId === 'explore') {
    throw new Error('Use select-tier to switch to Explore');
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env[tier.stripe_price_env];

  if (!secret || !priceId) {
    return {
      stub: true,
      url: `${successUrl}?checkout=stub&tier=${tierId}`,
      message: 'Stripe not configured — stub checkout for development',
    };
  }

  const params = new URLSearchParams({
    mode: 'subscription',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: successUrl,
    cancel_url: cancelUrl,
    'client_reference_id': userId,
    'metadata[tier]': tierId,
  });

  const profile = await getUserProfile(pool, userId);
  if (profile?.stripe_customer_id) {
    params.set('customer', profile.stripe_customer_id);
  }

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Stripe checkout failed');
  return { url: data.url, sessionId: data.id };
}

export async function handleSubscriptionUpgrade(userId, newTier, stripeIds = {}) {
  const profile = await getUserProfile(pool, userId);
  const oldTier = profile?.subscription_tier || 'explore';

  const periodEnd = newTier === 'explore'
    ? null
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await patchUserProfile(pool, userId, {
    prev_tier: oldTier,
    subscription_tier: newTier,
    subscription_period_end: periodEnd,
    ...(stripeIds.customerId ? { stripe_customer_id: stripeIds.customerId } : {}),
    ...(stripeIds.subscriptionId ? { stripe_subscription_id: stripeIds.subscriptionId } : {}),
  });

  if (newTier !== 'explore' && oldTier !== newTier) {
    try {
      const { rows } = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
      const email = rows[0]?.email;
      if (email) {
        const { sendEmail } = await import('../lib/email.js');
        await sendEmail(email, 'post_purchase', {
          tier_name: TIERS[newTier]?.name || newTier,
        });
      }
    } catch (err) {
      console.warn('[billing] post_purchase email skipped:', err.message);
    }
  }

  return { oldTier, newTier, subscription_period_end: periodEnd };
}
