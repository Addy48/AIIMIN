import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { canAccess, hasTier, TIER_LABELS } from '../../utils/tierGating';

/**
 * Blocks gated features when the user's plan is too low.
 */
export default function FeatureGate({
  feature,
  requiredTier,
  children,
  label = 'This feature',
}) {
  const { profile, loading } = useUserProfile();
  const tier = profile?.subscription_tier || 'explore';
  const required = requiredTier || 'core';
  const allowed = canAccess(tier, feature) || hasTier(tier, required);

  if (loading) return children;

  if (allowed) {
    return children;
  }

  return (
    <div
      style={{
        padding: '24px 22px',
        borderRadius: 14,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface-1)',
        textAlign: 'center',
      }}
    >
      <Lock size={20} style={{ color: 'var(--color-accent)', marginBottom: 12 }} />
      <p style={{ margin: '0 0 6px', fontWeight: 700, color: 'var(--color-text-1)', fontSize: 15 }}>
        {label}
      </p>
      <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 16, lineHeight: 1.5 }}>
        Unlocks on <strong>{TIER_LABELS[required] || required}</strong>. You&apos;re on{' '}
        <strong>{TIER_LABELS[tier] || 'Explore'}</strong>.
      </p>
      <Link
        to="/account?section=subscription"
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--color-accent)',
          textDecoration: 'none',
        }}
      >
        Choose a plan →
      </Link>
    </div>
  );
}
