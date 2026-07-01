import React, { useState } from 'react';
import { X } from 'lucide-react';
import { apiPatch } from '../../utils/api';

export default function FeatureTip({ tipId, message, seenTips = [] }) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const localSeen = JSON.parse(localStorage.getItem('aiimin_seen_tips') || '[]');
      return localSeen.includes(tipId);
    } catch {
      return false;
    }
  });

  if (dismissed || seenTips.includes(tipId)) return null;

  const dismiss = async () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      try {
        const localSeen = JSON.parse(localStorage.getItem('aiimin_seen_tips') || '[]');
        if (!localSeen.includes(tipId)) {
          localSeen.push(tipId);
          localStorage.setItem('aiimin_seen_tips', JSON.stringify(localSeen));
        }
      } catch (err) {
        console.error('[FeatureTip] Failed to save seen tip to localStorage:', err);
      }
    }
    try {
      await apiPatch('/account/seen-tips', { tip_id: tipId });
    } catch {
      // Non-blocking
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 16px',
        marginBottom: 20,
        background: 'var(--color-accent-dim)',
        border: '1px solid rgba(37, 99, 235, 0.25)',
        borderRadius: 'var(--r-md)',
      }}
    >
      <p className="feature-tip-message" style={{ flex: 1, margin: 0, fontSize: 13, color: 'var(--color-text-2)', lineHeight: 1.5 }}>
        {message}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss tip"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-3)',
          padding: 4,
          minWidth: 44,
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
