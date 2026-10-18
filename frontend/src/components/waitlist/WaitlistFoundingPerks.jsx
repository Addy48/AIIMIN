import React from 'react';
import { Gift, SealCheck, Key } from '@phosphor-icons/react';

export const FOUNDING_PERKS = [
  { icon: Gift, text: '1 month of Plus free when paid plans start' },
  { icon: SealCheck, text: 'Invite friends: up to 1 year of Pro free' },
  { icon: Key, text: 'Reserve your OS-ID at signup' },
];

/**
 * Founding perks — visible next to waitlist form (value prop, not just CTA).
 */
export default function WaitlistFoundingPerks({ compact = false, className = '' }) {
  return (
    <div className={`waitlist-founding-perks-block ${compact ? 'waitlist-founding-perks-block--compact' : ''} ${className}`.trim()}>
      <p className="waitlist-founding-perks-block__head">Founding member perks</p>
      <ul className="hero-founding-perks" aria-label="Waitlist founding perks">
        {FOUNDING_PERKS.map((perk) => {
          const Icon = perk.icon;
          return (
            <li key={perk.text}>
              <span className="hero-founding-perk-icon" aria-hidden="true">
                <Icon size={14} weight="duotone" />
              </span>
              <span>{perk.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
