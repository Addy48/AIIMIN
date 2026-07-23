import React from 'react';
import { Compass, Layers, Zap, Crown } from 'lucide-react';

export const PLAN_TIER_META = {
  explore: {
    id: 'explore',
    label: 'Explore',
    color: '#6b7280',
    Icon: Compass,
  },
  core: {
    id: 'core',
    label: 'Core',
    color: '#2dd4bf',
    Icon: Layers,
  },
  pro: {
    id: 'pro',
    label: 'Pro',
    color: '#ff6b35',
    Icon: Zap,
  },
  elite: {
    id: 'elite',
    label: 'Elite',
    color: '#fbbf24',
    Icon: Crown,
  },
};

export function formatPlanTill(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const day = d.getDate();
  const mon = d.toLocaleDateString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  return `till ${day} ${mon.toLowerCase()} ${year}`;
}

/**
 * Compact plan chip for profile — icon + name + till date. Click opens subscription.
 */
export default function PlanStatusChip({
  tier = 'explore',
  periodEnd = null,
  onClick,
  className = '',
}) {
  const meta = PLAN_TIER_META[tier] || PLAN_TIER_META.explore;
  const Icon = meta.Icon;
  const till = formatPlanTill(periodEnd);
  const sub =
    tier === 'explore'
      ? 'Free plan'
      : till || 'Manage plan';

  return (
    <button
      type="button"
      className={`plan-status-chip ${className}`.trim()}
      style={{ '--tier-soul': meta.color }}
      onClick={onClick}
      aria-label={`${meta.label} plan${till ? `, ${till}` : ''}. Open subscription.`}
    >
      <span className="plan-status-chip-icon" aria-hidden="true">
        <Icon size={17} strokeWidth={2.4} />
      </span>
      <span className="plan-status-chip-copy">
        <strong>{meta.label}</strong>
        <span>{sub}</span>
      </span>
    </button>
  );
}
