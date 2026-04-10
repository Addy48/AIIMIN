import React from 'react';

/**
 * PlacementStrip — Tier 2 urgency bar.
 * Displays placement season countdown + DSA coverage %.
 * Spec: compact horizontal strip, text-label style.
 */
const PlacementStrip = ({
  daysRemaining,    // number
  dsaPercent,       // 0-100
  topicsRevised,    // number
  totalTopics,      // number
}) => {
  const urgency = daysRemaining <= 14 ? 'critical'
    : daysRemaining <= 30 ? 'warning'
    : 'normal';

  const urgencyColor = urgency === 'critical'
    ? 'var(--color-alert-red)'
    : urgency === 'warning'
    ? 'var(--color-hero)'
    : 'var(--color-text-2)';

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
    }}>

      {/* Placement Countdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="text-label">Placement</span>
        <span style={{
          font: '500 13px/1 var(--font-mono)',
          color: urgencyColor,
        }}>
          {daysRemaining != null ? `${daysRemaining}d` : '—'}
        </span>
      </div>

      {/* Separator */}
      <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

      {/* DSA Coverage */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="text-label">DSA</span>
        <span style={{
          font: '500 13px/1 var(--font-mono)',
          color: (dsaPercent || 0) >= 60
            ? 'var(--color-accent)'
            : 'var(--color-text-2)',
        }}>
          {dsaPercent != null ? `${dsaPercent}%` : '—'}
        </span>
        {topicsRevised != null && totalTopics != null && (
          <span className="text-subtext">{topicsRevised}/{totalTopics} topics</span>
        )}
      </div>

      {/* Separator */}
      <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

      {/* Season label */}
      <span className="text-subtext">
        Season starts July 4
      </span>
    </div>
  );
};

export default PlacementStrip;
