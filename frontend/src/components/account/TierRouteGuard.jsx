import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { hasTier, minTierForPath, TIER_LABELS } from '../../utils/tierGating';

const Fallback = () => (
  <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="spinner" />
  </div>
);

/**
 * Blocks route content when the user's plan is below the required tier.
 */
export default function TierRouteGuard({ children, minTier, label }) {
  const { pathname } = useLocation();
  const required = minTier || minTierForPath(pathname);
  const { profile, loading } = useUserProfile();
  const tier = profile?.subscription_tier || 'explore';

  if (loading) return <Fallback />;

  if (hasTier(tier, required)) {
    return children;
  }

  const featureLabel = label || pathname.replace('/', '') || 'This page';

  return (
    <div
      className="page-container"
      style={{
        maxWidth: 520,
        margin: '48px auto',
        padding: '32px 28px',
        borderRadius: 18,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface-2)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          margin: '0 auto 16px',
          display: 'grid',
          placeItems: 'center',
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Lock size={22} style={{ color: 'var(--color-accent)' }} />
      </div>
      <h1 className="text-h2" style={{ marginBottom: 8 }}>
        {featureLabel} is on {TIER_LABELS[required]}
      </h1>
      <p className="text-body" style={{ color: 'var(--color-text-2)', marginBottom: 20, lineHeight: 1.55 }}>
        You&apos;re on <strong>{TIER_LABELS[tier] || 'Explore'}</strong>. Upgrade to unlock this module — billing
        isn&apos;t live yet; pick a plan in Subscription and it applies instantly.
      </p>
      <Link
        to="/account?section=subscription"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 20px',
          borderRadius: 12,
          background: 'var(--color-accent)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          textDecoration: 'none',
        }}
      >
        View plans
      </Link>
    </div>
  );
}
