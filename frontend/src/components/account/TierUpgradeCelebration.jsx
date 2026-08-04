import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPlanTill } from './PlanStatusChip';
import '../../styles/tierUpgradeCelebration.css';

const TIER_SOUL = {
  explore: {
    color: '#6b7280',
    eyebrow: "You're on",
    tagline: 'Daily logging stays. Advanced tools pause until you upgrade again.',
    unlocks: ['Daily log', 'Basic streaks', '30-day history', '1 AI call/day'],
    whisper: 'Switching to Explore',
    cta: 'Continue on Explore',
  },
  core: {
    color: '#2dd4bf',
    eyebrow: "You're on",
    tagline: 'Habits, money, and focus — unlocked across your Life OS.',
    unlocks: ['Habits & money', 'Focus timer', 'Weekly patterns', '10 AI calls/day'],
    whisper: 'Updating your plan',
    cta: 'Continue on Core',
  },
  pro: {
    color: '#ff6b35',
    eyebrow: "You're on",
    tagline: 'Deeper patterns, reports, and higher AI quota — now open.',
    unlocks: ['Correlation insights', 'Habit recovery', 'Monthly reports', '25 AI calls/day'],
    whisper: 'Updating your plan',
    cta: 'Continue on Pro',
  },
  elite: {
    color: '#fbbf24',
    eyebrow: "You're on",
    tagline: 'Full access — highest AI quota, priority queue, early modules.',
    unlocks: ['40 AI calls/day', 'Sports briefing', 'Priority support', 'Early access'],
    whisper: 'Updating your plan',
    cta: 'Continue on Elite',
  },
};

const TIER_LABELS = {
  explore: 'Explore',
  core: 'Core',
  pro: 'Pro',
  elite: 'Elite',
};

/**
 * Identity-shift celebration after a successful plan change.
 * Zones: status → name → unlocks → receipt (no overlap).
 */
export default function TierUpgradeCelebration({
  open,
  fromTier = 'explore',
  toTier = 'core',
  periodEnd = null,
  onClose,
}) {
  const soul = TIER_SOUL[toTier] || TIER_SOUL.core;
  const [phase, setPhase] = useState('idle');
  const tillLabel = formatPlanTill(periodEnd);

  const prefersReduced = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (!open) {
      setPhase('idle');
      return undefined;
    }

    if (prefersReduced) {
      setPhase('receipt');
      return undefined;
    }

    setPhase('hold');
    const timers = [
      setTimeout(() => setPhase('dissolve'), 600),
      setTimeout(() => setPhase('land'), 1300),
      setTimeout(() => setPhase('unlocks'), 2100),
      setTimeout(() => setPhase('receipt'), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [open, toTier, prefersReduced]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const showFrom = phase === 'hold' || phase === 'dissolve' || phase === 'idle';
  const showTo = phase === 'land' || phase === 'unlocks' || phase === 'receipt';
  const showUnlocks = phase === 'unlocks' || phase === 'receipt';
  const showReceipt = phase === 'receipt';
  const showHold = phase === 'hold';

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="tier-celeb-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            className="tier-celeb-stage"
            style={{ '--tier': soul.color }}
            data-tier={toTier}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tier-celeb-title"
          >
            <div className="tier-celeb-zone tier-celeb-zone--status">
              <AnimatePresence>
                {showHold && (
                  <motion.div
                    className="tier-celeb-hold"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="tier-celeb-hold-dot" />
                    <span>{soul.whisper}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="tier-celeb-zone tier-celeb-zone--identity">
              <AnimatePresence mode="wait">
                {showFrom && (
                  <motion.p
                    key="from"
                    className="tier-celeb-from"
                    initial={{ opacity: 1 }}
                    animate={
                      phase === 'dissolve'
                        ? { opacity: 0, y: -12, filter: 'blur(6px)', letterSpacing: '0.1em' }
                        : { opacity: 1 }
                    }
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    {TIER_LABELS[fromTier] || fromTier}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showTo && (
                  <motion.div
                    key="to"
                    className="tier-celeb-to"
                    initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="tier-celeb-eyebrow">{soul.eyebrow}</p>
                    <h2 id="tier-celeb-title" className="tier-celeb-name">
                      {TIER_LABELS[toTier] || toTier}
                    </h2>
                    <p className="tier-celeb-tagline">{soul.tagline}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="tier-celeb-zone tier-celeb-zone--unlocks">
              {showUnlocks &&
                soul.unlocks.map((item, i) => (
                  <motion.span
                    key={item}
                    className="tier-celeb-chip"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: prefersReduced ? 0 : i * 0.07, duration: 0.35 }}
                  >
                    {item}
                  </motion.span>
                ))}
            </div>

            <div className="tier-celeb-zone tier-celeb-zone--receipt">
              <AnimatePresence>
                {showReceipt && (
                  <motion.div
                    className="tier-celeb-receipt"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="tier-celeb-receipt-head">
                      <span className="tier-celeb-brand">AIIMIN</span>
                      <span className="tier-celeb-stamp">ACTIVE</span>
                    </div>
                    <div className="tier-celeb-receipt-row">
                      <span>Previous plan</span>
                      <span>{TIER_LABELS[fromTier] || fromTier}</span>
                    </div>
                    <div className="tier-celeb-receipt-row">
                      <span>New plan</span>
                      <span>{TIER_LABELS[toTier] || toTier}</span>
                    </div>
                    {toTier !== 'explore' && tillLabel ? (
                      <div className="tier-celeb-receipt-row">
                        <span>Valid</span>
                        <span>{tillLabel}</span>
                      </div>
                    ) : null}
                    <button type="button" className="tier-celeb-cta" onClick={onClose}>
                      {soul.cta}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
