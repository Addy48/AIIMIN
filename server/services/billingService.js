/**
 * Subscription tiers + Stripe checkout (P11).
 * Stub mode when STRIPE_SECRET_KEY is unset.
 */
import { pool } from '../lib/db.js';
import { patchUserProfile, getUserProfile } from './userProfileService.js';

export const TIERS = {
  explore: {
    id: 'explore',
    name: 'Explore',
    price_inr: 0,
    features: ['Limited daily logging', '3 habits', '2 goals', 'Basic overview', '1 AI insight per day'],
  },
  core: {
    id: 'core',
    name: 'Core',
    price_inr: 25,
    stripe_price_env: 'STRIPE_PRICE_CORE',
    features: [
      'Full discipline engine + urge tracking',
      '5 journal modes with AI analysis',
      'Finance safe-to-spend + SIP planner',
      'Sports feed personalization',
      'Lab cognitive benchmarks',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price_inr: 61,
    stripe_price_env: 'STRIPE_PRICE_PRO',
    features: [
      'Everything in Core',
      'Family vault document storage',
      'Weekly AI life review emails',
      'Advanced finance what-if',
      'Priority support',
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
      'Unlimited AI insights',
      'Lifetime feature previews',
    ],
  },
};

export function listPlans() {
  return Object.values(TIERS);
}

export async function getUserTier(userId) {
  const profile = await getUserProfile(pool, userId);
  return profile?.subscription_tier || 'explore';
}

export async function createCheckoutSession(userId, tierId, successUrl, cancelUrl) {
  const tier = TIERS[tierId];
  if (!tier || tierId === 'explore') {
    throw new Error('Invalid tier');
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

  await patchUserProfile(pool, userId, {
    prev_tier: oldTier,
    subscription_tier: newTier,
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

  return { oldTier, newTier };
}
