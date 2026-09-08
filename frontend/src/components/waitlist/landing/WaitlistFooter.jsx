import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import Wordmark from '../../brand/Wordmark';
import WaitlistThemeToggle from './WaitlistThemeToggle';

const WaitlistFooter = forwardRef(function WaitlistFooter({ isLight, onToggleTheme }, ref) {
  return (
    <footer className="waitlist-footer" ref={ref}>
      <Link to="/brand" className="waitlist-footer-brand" aria-label="Explore AIIMIN brand">
        <Wordmark size={22} color="var(--color-text-1)" />
      </Link>
      <p className="waitlist-footer-desc">High-density Personal Life OS for ambitious builders, founders, and high performers.</p>
      
      <div className="waitlist-footer-contact" aria-label="Direct contact channels">
        <a href="mailto:support@aiimin.in" className="waitlist-footer-contact-link" aria-label="Email support">
          ✉ support@aiimin.in
        </a>
      </div>

      <nav className="waitlist-footer-nav" aria-label="Footer links">
        <Link to="/app">Android V2</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/security">Security</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Tester Sign in</Link>
        {typeof onToggleTheme === 'function' && (
          <WaitlistThemeToggle
            isLight={isLight}
            onToggle={onToggleTheme}
            className="waitlist-theme-icon-btn--inline"
          />
        )}
      </nav>
      <p className="waitlist-footer-copy">
        © {new Date().getFullYear()} AIIMIN Inc. Built with heart & focus by Aaditya · Private by design.
      </p>
    </footer>
  );
});

export default WaitlistFooter;
