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
      <p>High-density Personal Life OS for ambitious builders and high performers.</p>
      <nav>
        <Link to="/app">Android</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Sign in</Link>
        {typeof onToggleTheme === 'function' && (
          <WaitlistThemeToggle
            isLight={isLight}
            onToggle={onToggleTheme}
            className="waitlist-theme-icon-btn--inline"
          />
        )}
      </nav>
    </footer>
  );
});

export default WaitlistFooter;
