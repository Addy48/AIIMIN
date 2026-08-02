import { useEffect, useRef, useState } from 'react';

// ease-out-expo — confident, decisive (animate skill). No bounce/elastic.
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Animate a number toward `value`. Gives the life score / ₹ figures a living
 * count instead of a static snap — the core "de-robotify" motion.
 * Respects reduced motion (snaps instantly).
 */
export default function useCountUp(value, reduce = false, duration = 520) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    if (reduce) { setDisplay(value); return undefined; }
    const from = fromRef.current;
    const to = value;
    if (from === to) return undefined;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutExpo(t);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [value, reduce, duration]);

  return display;
}
