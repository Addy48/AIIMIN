import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { shouldShip } from '../../utils/designVoteShip';

/**
 * Horizontal sub-nav — smooth sliding indicator when k-smooth-tab is approved/maybe-shipped.
 */
export default function ShippedSubNav({
  tabs,
  active,
  onChange,
  shipId = 'k-smooth-tab',
  className = 'shipped-subnav',
}) {
  const shipped = shouldShip(shipId);
  const containerRef = useRef(null);
  const btnRefs = useRef(new Map());
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });

  useLayoutEffect(() => {
    if (!shipped) return undefined;
    const update = () => {
      const btn = btnRefs.current.get(active);
      const container = containerRef.current;
      if (!btn || !container) return;
      const rect = btn.getBoundingClientRect();
      const parent = container.getBoundingClientRect();
      setIndicator({ width: rect.width, left: rect.left - parent.left });
    };
    requestAnimationFrame(update);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [active, shipped, tabs]);

  return (
    <div className={className} ref={containerRef} role="tablist">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            ref={(el) => {
              if (el) btnRefs.current.set(tab.id, el);
              else btnRefs.current.delete(tab.id);
            }}
            className={`shipped-subnav__btn${isActive ? ' is-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
      {shipped && indicator.width > 0 && (
        <motion.div
          className="shipped-subnav__indicator"
          layout
          animate={{ left: indicator.left, width: indicator.width }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        />
      )}
    </div>
  );
}
