import React from 'react';

const AVATARS = [
  { initials: 'AK', hue: 145 },
  { initials: 'RS', hue: 168 },
  { initials: 'MP', hue: 132 },
  { initials: 'VD', hue: 155 },
  { initials: 'NJ', hue: 120 },
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
              background: `linear-gradient(145deg, hsl(${avatar.hue} 42% 38%), hsl(${avatar.hue} 48% 28%))`,
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
          <>Join <strong>{count.toLocaleString('en-IN')}</strong> early members — spots filling for Sept 2026</>
        ) : (
          <>Join the founding waitlist — early members get launch perks first</>
        )}
      </p>
    </div>
  );
}
