import React from 'react';
import { Calendar } from 'lucide-react';
import WaitlistSocialProof from './WaitlistSocialProof';
import WaitlistFoundingPerks from './WaitlistFoundingPerks';

export default function WaitlistHeroAside({ count }) {
  return (
    <div className="hero-form-aside">
      <WaitlistSocialProof count={count} />
      <WaitlistFoundingPerks />
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
