/** Shared framer-motion presets — smooth, low-jank, dashboard-safe */

export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.4, 0, 0.2, 1];

export const springSnappy = { type: 'spring', stiffness: 420, damping: 32, mass: 0.85 };
export const springSoft = { type: 'spring', stiffness: 280, damping: 28, mass: 1 };
export const springBounce = { type: 'spring', stiffness: 500, damping: 26, mass: 0.9 };

export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE_OUT } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.22, ease: EASE_IN_OUT } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springSoft },
};

export const hoverLift = {
  whileHover: { y: -3, transition: springSnappy },
  whileTap: { scale: 0.98, transition: { duration: 0.12 } },
};

export const progressTween = { duration: 0.9, ease: EASE_OUT };
