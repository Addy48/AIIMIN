import { useRef, useCallback } from 'react';

/**
 * Mobile tab swipe — left = next tab, right = previous tab.
 */
export function useSwipeTabs(tabs, activeIndex, onChange, { threshold = 50, enabled = true } = {}) {
  const touchRef = useRef({ x: 0, y: 0, active: false });

  const onTouchStart = useCallback((e) => {
    if (!enabled || !tabs?.length) return;
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, active: true };
  }, [enabled, tabs]);

  const onTouchEnd = useCallback((e) => {
    if (!enabled || !touchRef.current.active || !tabs?.length) return;
    touchRef.current.active = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0 && activeIndex < tabs.length - 1) {
      onChange(activeIndex + 1);
    } else if (dx > 0 && activeIndex > 0) {
      onChange(activeIndex - 1);
    }
  }, [enabled, tabs, activeIndex, onChange, threshold]);

  return { onTouchStart, onTouchEnd };
}
