import React from 'react';
import { BadgeCheck, Calendar, Gift, KeyRound } from 'lucide-react';
import WaitlistSocialProof from './WaitlistSocialProof';

const PERKS = [
  { icon: Gift, text: 'Complimentary Core subscription at go-live' },
  { icon: BadgeCheck, text: 'Pro ₹49/mo · Elite ₹79/mo founding rates for 12 months' },
  { icon: KeyRound, text: 'Lock your 8-character OS-ID right after you join' },
];

export default function WaitlistHeroAside({ count }) {
  return (
    <div className="hero-form-aside">
      <WaitlistSocialProof count={count} />
      <ul className="hero-founding-perks" aria-label="Waitlist founding perks">
        {PERKS.map((perk) => {
          const Icon = perk.icon;
          return (
            <li key={perk.text}>
              <span className="hero-founding-perk-icon" aria-hidden="true">
                <Icon size={14} strokeWidth={2.25} />
              </span>
              <span>{perk.text}</span>
            </li>
          );
        })}
      </ul>
      <div className="hero-form-timeline" role="note">
        <span className="hero-form-timeline-item">
          <Calendar size={13} aria-hidden="true" />
          Go-live target · Sept 2026
        </span>
        <span className="hero-form-timeline-item hero-form-timeline-item--accent">
          Tester invites close · 31 July
        </span>
      </div>
    </div>
  );
}
