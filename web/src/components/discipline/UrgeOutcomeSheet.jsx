import React from 'react';
import { motion } from 'framer-motion';

const OUTCOMES = [
  { id: 'resisted', label: 'Resisted' },
  { id: 'partial', label: 'Partial' },
  { id: 'acted', label: 'Acted' },
  { id: 'still_riding', label: 'Still riding' },
];

/** One-tap outcome sheet — equal visual weight, no shame chrome. */
export default function UrgeOutcomeSheet({ open, onPick, onSkip }) {
  if (!open) return null;
  return (
    <motion.div
      className="urge-outcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="urge-outcome__sheet"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="urge-outcome__title">How did that go?</h2>
        <p className="urge-outcome__sub">One tap. Same weight for every outcome.</p>
        <div className="urge-outcome__grid">
          {OUTCOMES.map((o) => (
            <button
              key={o.id}
              type="button"
              className="urge-outcome__btn"
              onClick={() => onPick(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
        <button type="button" className="urge-outcome__skip" onClick={onSkip}>
          Skip
        </button>
      </motion.div>
    </motion.div>
  );
}
