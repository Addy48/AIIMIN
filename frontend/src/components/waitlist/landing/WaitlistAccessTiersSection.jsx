import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ACCESS_PACKAGES } from './waitlistLandingData';

export default function WaitlistAccessTiersSection() {
  return (
    <section className="waitlist-section waitlist-access-tiers waitlist-desktop-only">
      <p className="waitlist-section-label">Early access</p>
      <h2>Two paths in — testers get the VIP package</h2>
      <p className="waitlist-section-copy">
        Invited testers and waitlist members get different packages. Pick the path that matches how you arrived.
      </p>
      <div className="path-timeline">
        <div className="timeline-step active"><span className="step-number">1</span><span className="step-label">Now: Sign up</span></div>
        <div className="timeline-connector" />
        <div className="timeline-step"><span className="step-number">2</span><span className="step-label">Launch: Onboard</span></div>
        <div className="timeline-connector" />
        <div className="timeline-step"><span className="step-number">3</span><span className="step-label">Day 1: Your OS</span></div>
      </div>
      <div className="waitlist-tier-compare">
        {ACCESS_PACKAGES.map((pkg, index) => (
          <motion.article
            key={pkg.id}
            className={`waitlist-tier-card waitlist-tier-card-${pkg.id} ${pkg.tagVariant === 'premium' ? 'waitlist-tier-card-premium' : 'waitlist-tier-card-founding'}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <span className={`waitlist-tier-tag waitlist-tier-tag-${pkg.tagVariant}`}>{pkg.tag}</span>
            <h3>{pkg.title}</h3>
            <p className="waitlist-tier-deadline">{pkg.deadline()}</p>
            <ul className="waitlist-tier-list">
              {pkg.perks.map((perk) => {
                const Icon = perk.icon;
                return (
                  <li key={perk.text}>
                    <span className="waitlist-tier-perk-icon" aria-hidden="true">
                      <Icon size={14} />
                    </span>
                    {perk.text}
                  </li>
                );
              })}
            </ul>
            <div className="waitlist-tier-cta-wrap">
              {pkg.cta.href.startsWith('/') ? (
                <Link to={pkg.cta.href} className="waitlist-btn waitlist-btn-primary waitlist-tier-cta">
                  {pkg.cta.label}
                </Link>
              ) : (
                <a href={pkg.cta.href} className="waitlist-btn waitlist-btn-primary waitlist-tier-cta">
                  <Sparkles size={15} />
                  {pkg.cta.label}
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
