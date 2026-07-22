import React, { useState, useEffect, useCallback } from 'react';
import { Check, Zap, Crown, Compass, Layers } from 'lucide-react';
import { apiGet, apiPost } from '../../../utils/api';
import toast from '../../../utils/toast';
import { trackEvent } from '../../../hooks/usePageAnalytics';
import { IS_SUBSCRIPTION_MODE } from '../../../utils/tierGating';
import TierUpgradeCelebration from '../../../components/account/TierUpgradeCelebration';
import '../../../styles/subscriptionSection.css';

const STATIC_TIERS = [
  {
    id: 'explore',
    name: 'Explore',
    price_inr: 0,
    priceLabel: '₹0',
    icon: <Compass size={18} />,
    description: 'Log daily. Learn the loop.',
    features: [
      'Log sleep, mood, gym, water, and steps daily',
      'Weekly completion ring and basic streak view',
      'Full Life OS view with 30-day history',
      'Community help centre',
    ],
  },
  {
    id: 'core',
    name: 'Core',
    price_inr: 29,
    priceLabel: '₹29',
    icon: <Layers size={18} />,
    description: 'Run your essentials.',
    features: [
      'Everything in Explore',
      'Habits, money manager, and Pomodoro focus timer',
      'Weekly pattern insights and review loops',
      'Goals across 8 metrics (daily / weekly / monthly)',
      'Mobile logging + desktop Life OS analytics',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price_inr: 59,
    priceLabel: '₹59',
    foundingPriceLabel: '₹49',
    icon: <Zap size={18} />,
    description: 'See the patterns.',
    popular: true,
    features: [
      'Everything in Core',
      'Deeper correlation engine across sleep, mood, and spend',
      'Expanded habit analytics and streak recovery',
      'Monthly PDF-style reports and export',
      'Family vault module (shared goals)',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price_inr: 99,
    priceLabel: '₹99',
    foundingPriceLabel: '₹79',
    icon: <Crown size={18} />,
    description: 'No ceiling.',
    features: [
      'Everything in Pro',
      'Unlimited AI coaching and insight depth',
      'Sports briefing without doom scrolling',
      'Priority feature queue and highest API limits',
      'Early access to every new module at launch',
    ],
  },
];

const TIER_ORDER = ['explore', 'core', 'pro', 'elite'];

function notifyTierChanged(tierId) {
  window.dispatchEvent(new CustomEvent('aiimin:profile-refresh'));
  window.dispatchEvent(new CustomEvent('aiimin:tier-changed', { detail: { tier: tierId } }));
}

export default function SubscriptionSection() {
  const [currentTier, setCurrentTier] = useState('explore');
  const [clickUpgrade, setClickUpgrade] = useState(IS_SUBSCRIPTION_MODE);
  const [upgradeOnly, setUpgradeOnly] = useState(false);
  const [renewalDate, setRenewalDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [celebration, setCelebration] = useState(null);

  const refreshStatus = useCallback(() => {
    return apiGet('/billing/status')
      .then((st) => {
        if (st?.tier) setCurrentTier(st.tier);
        if (st?.current_period_end) setRenewalDate(st.current_period_end);
        const enabled = Boolean(st?.click_upgrade ?? st?.subscription_mode ?? IS_SUBSCRIPTION_MODE);
        setClickUpgrade(enabled);
        setUpgradeOnly(Boolean(st?.upgrade_only));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshStatus().finally(() => setLoading(false));
  }, [refreshStatus]);

  const applyTierLocally = (fromTier, nextTier) => {
    setCurrentTier(nextTier);
    notifyTierChanged(nextTier);
    setCelebration({ fromTier, toTier: nextTier });
    const name = STATIC_TIERS.find((t) => t.id === nextTier)?.name || nextTier;
    toast.success(`You're now on ${name}`);
    trackEvent('upgrade_completed', { tier: nextTier });
  };

  const selectTier = async (tierId) => {
    trackEvent('upgrade_clicked', { tier: tierId });
    setActionLoading(tierId);
    const fromTier = currentTier;
    try {
      const res = await apiPost('/billing/select-tier', { tier: tierId });
      const nextTier = res.tier || tierId;
      applyTierLocally(fromTier, nextTier);
    } catch (e) {
      toast.error(e.message || 'Could not change plan. Try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const startCheckout = async (tierId) => {
    trackEvent('upgrade_clicked', { tier: tierId });
    setActionLoading(tierId);
    const fromTier = currentTier;
    try {
      const res = await apiPost('/billing/checkout', { tier: tierId });
      if (res.subscriptionMode || res.clickUpgrade || clickUpgrade) {
        const nextTier = res.tier || tierId;
        applyTierLocally(fromTier, nextTier);
        return;
      }
      if (res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.message || 'Checkout unavailable. Please contact support.');
      }
    } catch (e) {
      toast.error(e.message || 'Checkout failed. Try again or contact support@aiimin.in');
    } finally {
      setActionLoading(null);
    }
  };

  const handleTierAction = (tierId) => {
    if (clickUpgrade || IS_SUBSCRIPTION_MODE) {
      return selectTier(tierId);
    }
    return startCheckout(tierId);
  };

  const currentTierIndex = TIER_ORDER.indexOf(currentTier);

  return (
    <div className="subscription-section">
      <div>
        <p className="text-label" style={{ color: 'var(--color-text-3)', marginBottom: 6 }}>Account</p>
        <h1 className="text-h1" style={{ marginBottom: 8 }}>Subscription</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>
          AIIMIN grows with you. Upgrade or switch any time
          {clickUpgrade ? ' — testing mode, no charge.' : '.'}
        </p>
      </div>

      {clickUpgrade && (
        <div
          className="subscription-current-banner"
          style={{ borderColor: 'color-mix(in srgb, var(--color-accent) 40%, var(--color-border))' }}
        >
          <span className="subscription-current-dot" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-1)' }}>
            Click to change plan instantly. Stripe billing comes later
            {upgradeOnly ? ' · downgrades locked' : ''}.
          </span>
        </div>
      )}

      {!loading && (
        <div className="subscription-current-banner">
          <span className="subscription-current-dot" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-1)' }}>
            You&apos;re on the <strong style={{ color: 'var(--color-accent)' }}>
              {STATIC_TIERS.find((t) => t.id === currentTier)?.name || 'Explore'}
            </strong> plan
            {renewalDate && (
              <span style={{ color: 'var(--color-text-3)', fontWeight: 400, marginLeft: 8 }}>
                · Renews {new Date(renewalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </span>
        </div>
      )}

      {loading && (
        <div className="skeleton" style={{ height: 48, borderRadius: 12 }} />
      )}

      <div className="subscription-pricing-grid">
        {STATIC_TIERS.map((tier) => {
          const isCurrent = tier.id === currentTier;
          const tierIndex = TIER_ORDER.indexOf(tier.id);
          const isUpgrade = tierIndex > currentTierIndex;
          const isDowngrade = tierIndex < currentTierIndex;
          const busy = actionLoading === tier.id;
          const blockedDowngrade = upgradeOnly && isDowngrade;

          return (
            <div
              key={tier.id}
              className={[
                'subscription-pricing-card',
                `tier-soul-${tier.id}`,
                isCurrent ? 'is-current' : '',
                tier.popular ? 'is-popular' : '',
              ].filter(Boolean).join(' ')}
            >
              {tier.popular && !isCurrent && (
                <span className="subscription-tier-badge">Most Popular</span>
              )}
              {isCurrent && (
                <span className="subscription-tier-badge is-current">Current Plan</span>
              )}

              <div className="subscription-tier-header">
                <span className="subscription-tier-icon">{tier.icon}</span>
                <span className="subscription-tier-name">{tier.name}</span>
              </div>

              <div className="subscription-tier-price">
                {tier.foundingPriceLabel ? (
                  <>
                    <span className="subscription-tier-price-list">{tier.priceLabel}</span>
                    <span>{tier.foundingPriceLabel}</span>
                  </>
                ) : (
                  tier.priceLabel
                )}
                {tier.price_inr > 0 && (
                  <span className="subscription-tier-price-unit">/ month</span>
                )}
              </div>
              {tier.foundingPriceLabel && (
                <p className="subscription-tier-founding-note">Waitlist founding rate</p>
              )}

              <p className="subscription-tier-desc">{tier.description}</p>

              <ul className="subscription-tier-features">
                {tier.features.map((f) => (
                  <li key={f}>
                    <Check size={13} strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="subscription-tier-cta subscription-tier-cta--active">✓ Active</div>
              ) : blockedDowngrade ? (
                <div className="subscription-tier-cta subscription-tier-cta--ghost">
                  Downgrade locked
                </div>
              ) : (
                <button
                  type="button"
                  disabled={busy || loading}
                  onClick={() => handleTierAction(tier.id)}
                  className={`subscription-tier-cta ${
                    isUpgrade
                      ? 'subscription-tier-cta--primary'
                      : 'subscription-tier-cta--switch'
                  }`}
                >
                  {busy
                    ? 'Applying…'
                    : isUpgrade
                      ? `Upgrade to ${tier.name}`
                      : isDowngrade
                        ? `Switch to ${tier.name}`
                        : `Choose ${tier.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="subscription-footnote text-caption">
        All prices in INR · Cancel any time · Billed monthly · Support: support@aiimin.in
      </p>

      <TierUpgradeCelebration
        open={Boolean(celebration)}
        fromTier={celebration?.fromTier || 'explore'}
        toTier={celebration?.toTier || 'core'}
        onClose={() => setCelebration(null)}
      />
    </div>
  );
}
