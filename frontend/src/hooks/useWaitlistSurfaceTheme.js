import { useLayoutEffect, useState } from 'react';
import useTheme from './useTheme';
import { isLightTheme } from '../constants/themes';

export const WAITLIST_THEME_STORAGE_KEY = 'aiimin-waitlist-theme';
export const WAITLIST_LIGHT_THEME = 'nordic';
export const WAITLIST_DARK_THEME = 'vercel';

export function readStoredWaitlistTheme() {
  if (typeof window === 'undefined') return WAITLIST_LIGHT_THEME;
  return localStorage.getItem(WAITLIST_THEME_STORAGE_KEY) || WAITLIST_LIGHT_THEME;
}

/**
 * Theme preference for waitlist surfaces (landing + waitlist brand).
 * Single writer for forced theme — logo/brand lockups must read ThemeContext, not remount this hook.
 */
export default function useWaitlistSurfaceTheme() {
  const { setForcedTheme, theme } = useTheme();
  const [waitlistTheme, setWaitlistTheme] = useState(readStoredWaitlistTheme);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WAITLIST_THEME_STORAGE_KEY, waitlistTheme);
    }
    setForcedTheme(waitlistTheme);
  }, [waitlistTheme, setForcedTheme]);

  const toggleWaitlistTheme = () => {
    setWaitlistTheme((prev) => (prev === WAITLIST_LIGHT_THEME ? WAITLIST_DARK_THEME : WAITLIST_LIGHT_THEME));
  };

  const isLight = isLightTheme(theme);

  return { waitlistTheme, toggleWaitlistTheme, isLight, setWaitlistTheme };
}
