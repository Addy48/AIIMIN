import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Laptop, Menu, X } from 'lucide-react';
import WaitlistForm from '../WaitlistForm';
import WaitlistHeroAside from '../WaitlistHeroAside';
import WaitlistFoundingPerks from '../WaitlistFoundingPerks';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <section className="waitlist-mobile-only mobile-hero-context">
        <div className="mobile-hero-topbar">
          <HeroBrandLockup markSize={24} wordmarkSize={19} />
          <div className="mobile-hero-topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <a href="/login" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-accent)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Sign in</a>
            <WaitlistThemeToggle isLight={isLight} onToggle={onToggleTheme} className="waitlist-theme-icon-btn--inline" />
            <button
              type="button"
              className="mobile-hamburger-btn"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="mobile-nav-drawer" aria-label="Mobile Navigation">
            <div className="mobile-nav-drawer-links">
              <a href="#launch-journey" onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#screens" onClick={() => setMobileMenuOpen(false)}>Command Surfaces</a>
              <a href="#android-app" onClick={() => setMobileMenuOpen(false)}>Android V2 Companion</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <a href="/app" onClick={() => setMobileMenuOpen(false)}>Download Android APK</a>
            </div>
            <div className="mobile-nav-drawer-actions">
              <a href="#waitlist-join" className="mobile-drawer-cta" onClick={() => setMobileMenuOpen(false)}>
                Join Waitlist
              </a>
              <a href="/login" className="mobile-drawer-login" onClick={() => setMobileMenuOpen(false)}>
                Tester Sign In →
              </a>
            </div>
          </nav>
        )}
        <div className="waitlist-desktop-notice" role="note">
          <Laptop size={18} className="waitlist-desktop-notice-icon" aria-hidden="true" />
          <div>
            <p className="waitlist-desktop-notice-title">Web Life OS + Android companion</p>
            <p className="waitlist-desktop-notice-copy">
              Join on your phone. Full Life OS on laptop. Native Android V2 tester preview is live — get the APK at{' '}
              <a href="/app">/app</a> or in the Android section below.
            </p>
          </div>
        </div>
        <span className="hero-exclusive-badge">✦ Exclusive early access</span>
        <h1>
          <span className="line-two hero-headline-hook"><strong>One screen.</strong> Every day.</span>
          <span className="hero-headline-lead">Your habits, <span className="hero-accent-word">money</span>, focus, and mood.</span>
        </h1>
        <p>
          Stop juggling separate apps for habits, expenses, focus, and notes. AIIMIN brings your daily execution into one command screen — web command center live now, native Android companion in closed testing.
        </p>
        <div className="mobile-preview-wrap">
          <MobilePreviewMock />
        </div>
      </section>

      <header className="waitlist-hero">
        <div className="waitlist-top-bar waitlist-desktop-only">
          <HeroBrandLockup />
          <div className="waitlist-top-bar-actions">
            <nav className="waitlist-hero-nav" aria-label="Page sections">
              <a href="#launch-journey">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="#screens">Surfaces</a>
              <a href="#faq">FAQ</a>
            </nav>
            <a href="/app" style={{ fontSize: '13px', color: 'var(--color-text-2)', textDecoration: 'none', marginRight: '6px', fontWeight: 500 }}>Android V2</a>
            <a href="/login" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-accent)', textDecoration: 'none', padding: '5px 12px', border: '1px solid color-mix(in srgb, var(--color-accent) 35%, transparent)', borderRadius: '6px', background: 'color-mix(in srgb, var(--color-accent) 6%, transparent)' }}>Tester Sign in →</a>
            <span className="hero-exclusive-badge hero-exclusive-badge--topbar">✦ Exclusive early access</span>
            <WaitlistThemeToggle isLight={isLight} onToggle={onToggleTheme} className="waitlist-theme-icon-btn--topbar" />
          </div>
        </div>

        {/* Form stays outside desktop-only so mobile can join. Copy column is desktop-only. */}
        <div className="waitlist-hero-panels">
          <motion.div
            className="waitlist-hero-copy waitlist-desktop-only"
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
              Stop juggling separate apps for habits, expenses, focus, and notes. AIIMIN brings your daily execution into one command screen — web command center live now, native Android companion in closed testing.
            </motion.p>
            <motion.p className="hero-trust-line" custom={2} variants={fadeUp}>
              {HERO_TRUST_LINE}
            </motion.p>
            <motion.div className="hero-signal-grid" custom={3} variants={fadeUp} aria-label="AIIMIN product signals">
              <span><i aria-hidden="true" />Web command center</span>
              <span><i aria-hidden="true" />Android companion</span>
              <span><i aria-hidden="true" />Private by design</span>
            </motion.div>
            <motion.div className="waitlist-hero-copy-preview" custom={4} variants={fadeUp}>
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
                <WaitlistFoundingPerks className="waitlist-founding-perks-block--above-form" />
                <p className="waitlist-mobile-form-title waitlist-mobile-only">
                  Join free — perks lock in at signup
                </p>
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
