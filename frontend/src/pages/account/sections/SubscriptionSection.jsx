import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { apiGet, apiPost } from '../../../utils/api';
import toast from '../../../utils/toast';
import { trackEvent } from '../../../hooks/usePageAnalytics';

/* ─── Hardcoded tier definitions — always rendered, even if API is down ─── */
const STATIC_TIERS = [
  {
    id: 'explore',
    name: 'Explore',
    price_inr: 0,
    priceLabel: 'Free',
    icon: <Star size={18} />,
    color: 'var(--color-text-3)',
    accentColor: '#6B6B7B',
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
    color: 'var(--color-accent)',
    accentColor: '#2563EB',
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
    color: '#F59E0B',
    accentColor: '#F59E0B',
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
    <div>
      <div style={{ marginBottom: 32 }}>
        <p className="text-label" style={{ color: 'var(--color-text-3)', marginBottom: 6 }}>Account</p>
        <h1 className="text-h1" style={{ marginBottom: 8 }}>Subscription</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>
          AIIMIN grows with you. Upgrade or downgrade any time.
        </p>
      </div>

      {/* Current plan banner */}
      {!loading && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--color-accent-dim)', border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 'var(--r-lg)', padding: '14px 18px', marginBottom: 28,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--color-accent)',
            boxShadow: '0 0 8px rgba(37,99,235,0.6)',
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-1)' }}>
            You're on the <strong style={{ color: 'var(--color-accent)' }}>
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
        <div className="skeleton" style={{ height: 48, borderRadius: 12, marginBottom: 28 }} />
      )}

      {/* 3-tier comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        {STATIC_TIERS.map((tier) => {
          const isCurrent = tier.id === currentTier;
          const tierIndex = TIER_ORDER.indexOf(tier.id);
          const isUpgrade = tierIndex > currentTierIndex;

          return (
            <div
              key={tier.id}
              style={{
                position: 'relative',
                background: isCurrent ? `${tier.accentColor}08` : 'var(--color-surface)',
                border: `1px solid ${isCurrent ? `${tier.accentColor}40` : 'var(--color-border)'}`,
                borderRadius: 'var(--r-xl)',
                padding: '24px 20px',
                transition: 'border-color 0.15s',
              }}
            >
              {/* Popular badge */}
              {tier.popular && !isCurrent && (
                <div style={{
                  position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--color-accent)', color: '#fff',
                  fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                  padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  Most Popular
                </div>
              )}

              {/* Current badge */}
              {isCurrent && (
                <div style={{
                  position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                  background: tier.accentColor, color: isCurrent && tier.id === 'explore' ? 'var(--color-text-1)' : '#fff',
                  fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                  padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  Current Plan
                </div>
              )}

              {/* Tier header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ color: tier.accentColor }}>{tier.icon}</span>
                <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-text-1)', fontFamily: 'var(--font-sans)' }}>
                  {tier.name}
                </span>
              </div>

              <div style={{ marginBottom: 4 }}>
                <span style={{
                  fontSize: 26, fontWeight: 900, color: tier.accentColor,
                  fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em',
                }}>
                  {tier.priceLabel}
                </span>
                {tier.price_inr > 0 && (
                  <span style={{ fontSize: 11, color: 'var(--color-text-3)', marginLeft: 4 }}>/ month</span>
                )}
              </div>

              <p style={{ fontSize: 12, color: 'var(--color-text-2)', marginBottom: 20, lineHeight: 1.4 }}>
                {tier.description}
              </p>

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Check size={13} color={tier.accentColor} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: 'var(--color-text-2)', lineHeight: 1.4 }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div style={{
                  textAlign: 'center', padding: '10px',
                  borderRadius: 'var(--r-md)', background: `${tier.accentColor}14`,
                  fontSize: 12, fontWeight: 700, color: tier.accentColor,
                }}>
                  ✓ Active
                </div>
              ) : isUpgrade ? (
                <button
                  type="button"
                  disabled={checkoutLoading === tier.id || loading}
                  onClick={() => startCheckout(tier.id)}
                  style={{
                    width: '100%', padding: '11px', borderRadius: 'var(--r-md)',
                    background: tier.id === 'core' ? 'var(--color-accent)' : `${tier.accentColor}18`,
                    border: tier.id === 'core' ? 'none' : `1px solid ${tier.accentColor}40`,
                    color: tier.id === 'core' ? '#fff' : tier.accentColor,
                    fontSize: 13, fontWeight: 800, cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'var(--font-sans)',
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {checkoutLoading === tier.id ? 'Opening checkout…' : `Upgrade to ${tier.name}`}
                </button>
              ) : (
                <div style={{
                  textAlign: 'center', padding: '10px',
                  fontSize: 11, fontWeight: 500, color: 'var(--color-text-3)',
                }}>
                  Included in your plan
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-caption" style={{ marginTop: 20, color: 'var(--color-text-3)', textAlign: 'center' }}>
        All prices in INR · Cancel any time · Billed monthly · Support: support@aiimin.in
      </p>
    </div>
  );
}
