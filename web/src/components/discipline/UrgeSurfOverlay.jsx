import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const COPY = [
  'This will peak and pass. You do not have to win against it — just outlast it.',
  'Urges are waves. Ride this one without acting.',
  'Breathe. The intensity is temporary.',
];

const DEFAULT_SECONDS = 15 * 60;

/**
 * Full-screen urge-surf timer — calm intervention, not a form.
 * Motion: Breathing pulse on ring; overlay Fade.
 */
export default function UrgeSurfOverlay({
  open,
  category = 'custom',
  onPassed,
  onExtend,
  onCancel,
}) {
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const [phase, setPhase] = useState(0); // 0 inhale 1 hold 2 exhale for 4-7-8 visual
  const line = useMemo(() => COPY[Math.floor(Date.now() / 60000) % COPY.length], []);

  useEffect(() => {
    if (!open) return undefined;
    setSeconds(DEFAULT_SECONDS);
    const tick = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(tick);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const cycle = setInterval(() => setPhase((p) => (p + 1) % 3), 4000);
    return () => clearInterval(cycle);
  }, [open]);

  if (!open) return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const breatheScale = phase === 0 ? 1.08 : phase === 1 ? 1.08 : 0.94;
  const breatheLabel = phase === 0 ? 'Inhale' : phase === 1 ? 'Hold' : 'Exhale';

  return (
    <motion.div
      className="urge-surf"
      role="dialog"
      aria-modal="true"
      aria-label="Urge surf"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="urge-surf__inner">
        <p className="urge-surf__eyebrow">{category}</p>
        <motion.div
          className="urge-surf__ring"
          animate={{ scale: breatheScale }}
          transition={{ duration: 3.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="urge-surf__time">{mm}:{ss}</span>
          <span className="urge-surf__breathe">{breatheLabel}</span>
        </motion.div>
        <p className="urge-surf__copy">{line}</p>
        <div className="urge-surf__actions">
          <button type="button" className="urge-surf__btn urge-surf__btn--primary" onClick={onPassed}>
            It passed
          </button>
          <button
            type="button"
            className="urge-surf__btn"
            onClick={() => {
              setSeconds((s) => s + 5 * 60);
              onExtend?.();
            }}
          >
            Extend 5 min
          </button>
          <button type="button" className="urge-surf__btn urge-surf__btn--ghost" onClick={onCancel}>
            End early
          </button>
        </div>
        <a
          className="urge-surf__crisis"
          href="https://www.iasp.info/suicidalthoughts/"
          target="_blank"
          rel="noreferrer"
        >
          Crisis / support resources
        </a>
      </div>
    </motion.div>
  );
}
