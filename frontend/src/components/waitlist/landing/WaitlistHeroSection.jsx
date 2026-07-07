import React from 'react';
import { motion } from 'framer-motion';
import { Laptop } from 'lucide-react';
import WaitlistForm from '../WaitlistForm';
import WaitlistHeroAside from '../WaitlistHeroAside';
import WaitlistSocialProof from '../WaitlistSocialProof';
import HeroBrandLockup from './HeroBrandLockup';
import HeroPreviewMock from './HeroPreviewMock';
import MobilePreviewMock from './MobilePreviewMock';
import WaitlistThemeToggle from './WaitlistThemeToggle';
import { fadeUp, HERO_TRUST_LINE } from './waitlistLandingData';

export default function WaitlistHeroSection({
  count,
  onSignupSuccess,
  isLight,
  onToggleTheme,
}) {
  return (
    <>
      <section className="waitlist-mobile-only mobile-hero-context">
        <div className="mobile-hero-topbar">
          <HeroBrandLockup markSize={28} wordmarkSize={22} />
          <WaitlistThemeToggle isLight={isLight} onToggle={onToggleTheme} className="waitlist-theme-icon-btn--inline" />
        </div>
        <div className="waitlist-desktop-notice" role="note">
          <Laptop size={18} className="waitlist-desktop-notice-icon" aria-hidden="true" />
          <div>
            <p className="waitlist-desktop-notice-title">Built for laptop &amp; desktop</p>
            <p className="waitlist-desktop-notice-copy">
              Join on your phone. Run the full Life OS on laptop at launch — native mobile companion shipping after.
            </p>
          </div>
        </div>
        <span className="hero-exclusive-badge">✦ Exclusive early access</span>
        <h1>
          <span className="line-two hero-headline-hook"><strong>One screen.</strong> Every day.</span>
          <span className="hero-headline-lead">Your habits, <span className="hero-accent-word">money</span>, focus, and mood.</span>
        </h1>
        <p>
          AIIMIN is your personal Life OS — web command center now, native app next.
          Built for Indian students and early professionals who refuse to juggle five apps.
        </p>
        <div className="mobile-preview-wrap">
          <MobilePreviewMock />
        </div>
      </section>

      <header className="waitlist-hero">
        <div className="waitlist-hero-orbit" aria-hidden="true" />
        <div className="waitlist-hero-glow" aria-hidden="true" />

        <div className="waitlist-top-bar waitlist-desktop-only">
          <HeroBrandLockup />
          <div className="waitlist-top-bar-actions">
            <span className="hero-exclusive-badge hero-exclusive-badge--topbar">✦ Exclusive early access</span>
            <WaitlistThemeToggle isLight={isLight} onToggle={onToggleTheme} className="waitlist-theme-icon-btn--topbar" />
          </div>
        </div>

        <div className="waitlist-hero-panels waitlist-desktop-only">
          <motion.div
            className="waitlist-hero-copy"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <motion.h1 className="hero-headline" custom={0} variants={fadeUp}>
              <span className="line-two hero-headline-hook"><strong>One screen.</strong> Every day.</span>
              <span className="hero-headline-lead">
                Your habits, <span className="hero-accent-word">money</span>, focus, and mood.
              </span>
            </motion.h1>
            <motion.p className="hero-subhead hero-subhead--compact" custom={1} variants={fadeUp}>
              One aggressive Life OS for Indian students and early professionals — web command center now, native app en route. No app hopping.
            </motion.p>
            <motion.p className="hero-trust-line" custom={2} variants={fadeUp}>
              {HERO_TRUST_LINE}
            </motion.p>
            <motion.div className="waitlist-hero-copy-preview" custom={3} variants={fadeUp}>
              <HeroPreviewMock />
            </motion.div>
          </motion.div>

          <motion.div
            className="waitlist-hero-side"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            <div className="waitlist-hero-form-wrap" id="waitlist-join">
              <div className="waitlist-hero-form">
                <p className="waitlist-mobile-form-title waitlist-mobile-only">Join the waitlist — founding member perks at launch</p>
                <WaitlistForm variant="hero" onSuccess={onSignupSuccess} showUrgency />
                <div className="waitlist-desktop-only waitlist-hero-form-aside">
                  <WaitlistHeroAside count={count} />
                </div>
              </div>
              <div className="waitlist-mobile-only waitlist-mobile-social">
                <WaitlistSocialProof count={count} />
              </div>
            </div>
          </motion.div>
        </div>
      </header>
    </>
  );
}
