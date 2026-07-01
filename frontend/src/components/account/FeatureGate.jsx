import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { canAccess, hasTier } from '../../utils/tierGating';

const TIER_LABELS = { core: 'Core', pro: 'Pro' };

/**
 * Blurred preview below content — never blocks current content (research 3.6).
 */
export default function FeatureGate({
  feature,
  requiredTier,
  children,
  label = 'This feature',
}) {
  const { profile } = useUserProfile();
  const tier = profile?.subscription_tier || 'explore';
  const required = requiredTier || 'core';

  if (canAccess(tier, feature) || hasTier(tier, required)) {
    return children;
  }

  return (
    <>
      {children}
      <div
        style={{
          marginTop: 16,
          padding: '16px 20px',
          borderRadius: 12,
          border: '1px dashed var(--color-border)',
          background: 'color-mix(in srgb, var(--color-surface-3) 80%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Lock size={16} style={{ color: '#2563EB' }} />
          <span className="text-sm" style={{ color: 'var(--color-text-2)' }}>
            {label} unlocks on {TIER_LABELS[required] || required}.
          </span>
        </div>
        <Link
          to="/account?section=subscription"
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#2563EB',
            textDecoration: 'none',
          }}
        >
          View plans →
        </Link>
      </div>
    </>
  );
}
