import React from 'react';

const AVATARS = [
  { initials: 'AK', bg: '#232936', text: '#cbd5e1' },
  { initials: 'RS', bg: '#1c222e', text: '#94a3b8' },
  { initials: 'MP', bg: '#2a3242', text: '#e2e8f0' },
  { initials: 'VD', bg: '#1f2533', text: '#cbd5e1' },
  { initials: 'NJ', bg: '#262f3f', text: '#94a3b8' },
];

export default function WaitlistSocialProof({ count }) {
  const hasCount = typeof count === 'number' && count > 0;
  const showLargeCount = hasCount && count >= 100;

  return (
    <div className="waitlist-social-proof">
      <div className="waitlist-avatar-stack" aria-hidden="true">
        {AVATARS.map((avatar, index) => (
          <span
            key={avatar.initials}
            className="waitlist-avatar-chip"
            style={{
              zIndex: AVATARS.length - index,
              background: avatar.bg,
              color: avatar.text,
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              fontWeight: 700,
            }}
          >
            {avatar.initials}
          </span>
        ))}
      </div>
      <p className="waitlist-social-proof-text">
        {showLargeCount ? (
          <>Join <strong>{count.toLocaleString('en-IN')}+</strong> founding members on the waitlist</>
        ) : hasCount ? (
          <>Join <strong>{count.toLocaleString('en-IN')}</strong> early members — go-live target Nov 2026</>
        ) : (
          <>Join the founding waitlist — early members get launch perks first</>
        )}
      </p>
    </div>
  );
}
