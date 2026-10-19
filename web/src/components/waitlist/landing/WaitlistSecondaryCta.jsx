import React from 'react';
import { ArrowUp } from '@phosphor-icons/react';
import WaitlistForm from '../WaitlistForm';

export default function WaitlistSecondaryCta({ onSignupSuccess }) {
  return (
    <section className="waitlist-section waitlist-secondary-cta">
      <h2>Join the waitlist</h2>
      <p className="waitlist-section-copy">
        Free for one person. Waitlist members get 1 month of Plus free when paid plans start, and more for every friend who joins. Invited beta testers: sign in instead.
      </p>
      <div className="waitlist-secondary-cta-form">
        <WaitlistForm compact onSuccess={onSignupSuccess} showFeatureVote={false} />
      </div>
      <a href="#top" className="waitlist-back-top">
        Back to top <ArrowUp size={14} weight="bold" />
      </a>
    </section>
  );
}
