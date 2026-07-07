import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import Wordmark from '../../brand/Wordmark';

const WaitlistFooter = forwardRef(function WaitlistFooter(_props, ref) {
  return (
    <footer className="waitlist-footer" ref={ref}>
      <Link to="/brand" className="waitlist-footer-brand" aria-label="Explore AIIMIN brand">
        <Wordmark size={22} color="var(--color-text-1)" />
      </Link>
      <p>India-first life OS for students and early professionals.</p>
      <nav>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Sign in</Link>
      </nav>
    </footer>
  );
});

export default WaitlistFooter;
