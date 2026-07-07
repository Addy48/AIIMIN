import React from 'react';
import { ArrowRight } from 'lucide-react';
import WaitlistForm from '../WaitlistForm';

export default function WaitlistSecondaryCta({ onSignupSuccess }) {
  return (
    <section className="waitlist-section waitlist-secondary-cta">
      <h2>Join the waitlist — founding member perks at launch</h2>
      <p className="waitlist-section-copy">
        Starter kit, complimentary Core, Pro founding ₹49/mo, and Elite founding ₹79/mo. Invited testers get the VIP package — sign in instead.
      </p>
      <div className="waitlist-secondary-cta-form">
        <WaitlistForm compact onSuccess={onSignupSuccess} showFeatureVote={false} />
      </div>
      <a href="#top" className="waitlist-back-top">
        Back to hero <ArrowRight size={14} />
      </a>
    </section>
  );
}
