import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShippedSpringAmount } from '../design/ShippedMotion';
import { springSnappy } from '../../utils/motionPresets';

export default function XPGainToast({ event, onDone }) {
  useEffect(() => {
    if (!event) return undefined;
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [event, onDone]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.id}
          className="xp-gain-toast"
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={springSnappy}
        >
          <span className="xp-gain-toast__amount"><ShippedSpringAmount amount={event.amount} /></span>
          {event.multiplier > 1 && (
            <span className="xp-gain-toast__mult">{event.multiplier.toFixed(1)}× streak</span>
          )}
          {event.breakdown?.length > 0 && (
            <span className="xp-gain-toast__detail">
              {event.breakdown.slice(0, 3).map((b) => b.label).join(' · ')}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
