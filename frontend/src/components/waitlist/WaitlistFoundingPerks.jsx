import React from 'react';
import { Gift, SealCheck, Key } from '@phosphor-icons/react';

export const FOUNDING_PERKS = [
  { icon: Gift, text: 'Free Core at go-live' },
  { icon: SealCheck, text: 'Pro ₹49/mo · Elite ₹79/mo founding rates' },
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
