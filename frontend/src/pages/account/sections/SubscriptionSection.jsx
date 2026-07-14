import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { apiGet, apiPost } from '../../../utils/api';
import toast from '../../../utils/toast';
import { trackEvent } from '../../../hooks/usePageAnalytics';
import '../../../styles/subscriptionSection.css';

const STATIC_TIERS = [
  {
    id: 'explore',
    name: 'Explore',
    price_inr: 0,
    priceLabel: '₹0',
    icon: <Star size={18} />,
    description: 'Try the operating system with intentionally limited usage.',
    features: [
      'Habits tracking (up to 3)',
      'Goals tracking (up to 2)',
      'Free Write journal',
      'Basic overview dashboard',
      '1 AI insight per day',
      'Limited history and exports',
    ],
  },
  {
    id: 'core',
    name: 'Core',
    price_inr: 25,
    priceLabel: '₹25',
    icon: <Zap size={18} />,
    description: 'Your full personal operating system.',
    popular: true,
    features: [
      'Unlimited habits and goals',
      'All 5 journal modes + AI analysis',
      'Finance dashboard + safe-to-spend',
      'Sports arena + live scores',
      'Unlimited AI insights',
      'Focus room + Pomodoro',
      'Growth engine',
      'Priority support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price_inr: 61,
    priceLabel: '₹61',
    icon: <Crown size={18} />,
    description: 'Everything, plus your family.',
    features: [
      'Everything in Core',
      'Family vault (shared space)',
      'Lab — cognitive benchmarks',
      'Advanced analytics + reports',
      'Data export (JSON/CSV)',
      'ATS placement tracker',
      'Early access to new features',
    ],
  },
];

const TIER_ORDER = ['explore', 'core', 'pro'];

export default function SubscriptionSection() {
  const [currentTier, setCurrentTier] = useState('explore');
  const [renewalDate, setRenewalDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  useEffect(() => {
    apiGet('/billing/status')
      .then((st) => {
        if (st?.tier) setCurrentTier(st.tier);
        if (st?.current_period_end) setRenewalDate(st.current_period_end);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === '1') {
      trackEvent('upgrade_completed', { tier: params.get('tier') || 'core' });
    }
  }, []);

  const startCheckout = async (tierId) => {
    trackEvent('upgrade_clicked', { tier: tierId });
    setCheckoutLoading(tierId);
    try {
      const res = await apiPost('/billing/checkout', { tier: tierId });
      if (res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.message || 'Checkout unavailable. Please contact support.');
      }
    } catch (e) {
      toast.error(e.message || 'Checkout failed. Try again or contact support@aiimin.in');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const currentTierIndex = TIER_ORDER.indexOf(currentTier);

  return (
    <div className="subscription-section">
      <div>
        <p className="text-label" style={{ color: 'var(--color-text-3)', marginBottom: 6 }}>Account</p>
        <h1 className="text-h1" style={{ marginBottom: 8 }}>Subscription</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>
          AIIMIN grows with you. Upgrade or downgrade any time.
        </p>
      </div>

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

          return (
            <div
              key={tier.id}
              className={[
                'subscription-pricing-card',
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
                {tier.priceLabel}
                {tier.price_inr > 0 && (
                  <span className="subscription-tier-price-unit">/ month</span>
                )}
              </div>

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
              ) : isUpgrade ? (
                <button
                  type="button"
                  disabled={checkoutLoading === tier.id || loading}
                  onClick={() => startCheckout(tier.id)}
                  className={`subscription-tier-cta ${tier.id === 'core' ? 'subscription-tier-cta--primary' : 'subscription-tier-cta--ghost'}`}
                  style={tier.id !== 'core' ? {
                    border: '1px solid color-mix(in srgb, var(--color-accent) 35%, var(--color-border))',
                    color: 'var(--color-accent)',
                    background: 'var(--color-accent-dim)',
                    cursor: 'pointer',
                  } : undefined}
                >
                  {checkoutLoading === tier.id ? 'Opening checkout…' : `Upgrade to ${tier.name}`}
                </button>
              ) : (
                <div className="subscription-tier-cta subscription-tier-cta--ghost">Included in your plan</div>
              )}
            </div>
          );
        })}
      </div>

      <p className="subscription-footnote text-caption">
        All prices in INR · Cancel any time · Billed monthly · Support: support@aiimin.in
      </p>
    </div>
  );
}
