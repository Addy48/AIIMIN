/**
 * Billing + subscriptions (P11).
 */
import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth.js';
import {
  listPlans,
  getUserTier,
  createCheckoutSession,
  handleSubscriptionUpgrade,
  selectSubscriptionTier,
  isClickUpgradeEnabled,
  isUpgradeOnlyMode,
  TIERS,
} from '../services/billingService.js';
import { getUserProfile } from '../services/userProfileService.js';
import { pool } from '../lib/db.js';

const app = new Hono();

app.get('/plans', requireAuth, (c) => {
  return c.json({ plans: listPlans() });
});

app.get('/status', requireAuth, async (c) => {
  const userId = c.get('userId');
  const tier = await getUserTier(userId);
  const profile = await getUserProfile(pool, userId);
  const clickUpgrade = isClickUpgradeEnabled();
  return c.json({
    tier,
    prev_tier: profile?.prev_tier || 'explore',
    current_period_end: profile?.subscription_period_end || null,
    renewal: profile?.stripe_subscription_id ? 'active' : null,
    subscription_mode: clickUpgrade,
    click_upgrade: clickUpgrade,
    upgrade_only: isUpgradeOnlyMode(),
  });
});

app.post('/select-tier', requireAuth, async (c) => {
  try {
    if (!isClickUpgradeEnabled()) {
      return c.json({ error: 'Billing checkout required' }, 403);
    }
    const userId = c.get('userId');
    const { tier = 'explore' } = await c.req.json();
    if (!TIERS[tier]) {
      return c.json({ error: 'Invalid tier' }, 400);
    }
    const result = await selectSubscriptionTier(userId, tier);
    return c.json({
      ...result,
      tier,
      click_upgrade: true,
      upgrade_only: isUpgradeOnlyMode(),
    });
  } catch (err) {
    const status = err.code === 'UPGRADE_ONLY' ? 403 : 400;
    return c.json({ error: err.message, code: err.code }, status);
  }
});

app.post('/checkout', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { tier = 'core', success_url, cancel_url } = await c.req.json();
    const origin = c.req.header('origin') || 'https://aiimin.in';
    const session = await createCheckoutSession(
      userId,
      tier,
      success_url || `${origin}/account?section=subscription&upgraded=1`,
      cancel_url || `${origin}/account?section=subscription`,
    );
    return c.json(session);
  } catch (err) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * POST /api/billing/webhook — Stripe webhook (no auth, signature verified when configured).
 */
app.post('/webhook', async (c) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await c.req.text();

  if (!secret) {
    console.warn('[billing/webhook] STRIPE_WEBHOOK_SECRET not set — ignoring');
    return c.json({ received: true, stub: true });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.warn('[billing/webhook] STRIPE_SECRET_KEY not set — cannot verify signature');
    return c.json({ error: 'Stripe not configured' }, 503);
  }

  try {
    const sig = c.req.header('stripe-signature');
    if (!sig) {
      return c.json({ error: 'Missing stripe-signature header' }, 400);
    }

    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);
    const event = stripe.webhooks.constructEvent(body, sig, secret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const tier = session.metadata?.tier || 'core';
      if (userId) {
        await handleSubscriptionUpgrade(userId, tier, {
          customerId: session.customer,
          subscriptionId: session.subscription,
        });
      }
    }

    return c.json({ received: true });
  } catch (err) {
    console.error('[billing/webhook]', err.message);
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Dev-only: simulate upgrade without Stripe.
 */
app.post('/simulate-upgrade', requireAuth, async (c) => {
  if (process.env.NODE_ENV === 'production' && !isClickUpgradeEnabled()) {
    return c.json({ error: 'Not available in production' }, 403);
  }
  const userId = c.get('userId');
  const { tier = 'core' } = await c.req.json();
  const result = await handleSubscriptionUpgrade(userId, tier);
  return c.json(result);
});

export default app;
