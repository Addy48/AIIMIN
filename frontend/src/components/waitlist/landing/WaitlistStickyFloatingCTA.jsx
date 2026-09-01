import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle, X, ArrowRight } from '@phosphor-icons/react';

export default function WaitlistStickyFloatingCTA({ count }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Only show after user scrolls past hero section (> 650px)
      const isPastHero = window.scrollY > 650;
      // Hide near footer
      const isNearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
      setVisible(isPastHero && !isNearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (dismissed) return null;

  const countDisplay = count && count > 10 ? `${count.toLocaleString('en-IN')}+` : 'Early';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="waitlist-floating-pill-container"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          role="region"
          aria-label="Floating waitlist action"
        >
          <a href="#waitlist-join" className="waitlist-floating-pill">
            <span className="waitlist-floating-pill-badge">
              <span className="floating-badge-dot" />
              Nov 2026
            </span>
            <span className="waitlist-floating-pill-text">
              Join <strong>{countDisplay} builders</strong> on the waitlist
            </span>
            <span className="waitlist-floating-pill-arrow">
              <ArrowRight size={13} weight="bold" />
            </span>
          </a>
          <button
            type="button"
            className="waitlist-floating-pill-close"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
          >
            <X size={12} weight="bold" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
