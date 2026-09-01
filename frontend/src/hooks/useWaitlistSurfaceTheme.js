import { useLayoutEffect, useState } from 'react';
import useTheme from './useTheme';
import { THEME_DARK, THEME_LIGHT, isLightTheme, normalizeThemeId } from '../constants/themes';

export const WAITLIST_THEME_STORAGE_KEY = 'aiimin-waitlist-theme';
export const WAITLIST_LIGHT_THEME = THEME_LIGHT;
export const WAITLIST_DARK_THEME = THEME_DARK;

export function readStoredWaitlistTheme() {
  if (typeof window === 'undefined') return WAITLIST_DARK_THEME;
  const stored = localStorage.getItem(WAITLIST_THEME_STORAGE_KEY);
  if (!stored) return WAITLIST_DARK_THEME;
  return normalizeThemeId(stored);
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
    setWaitlistTheme((prev) => (isLightTheme(prev) ? WAITLIST_DARK_THEME : WAITLIST_LIGHT_THEME));
  };

  const isLight = isLightTheme(waitlistTheme);

  return { waitlistTheme, toggleWaitlistTheme, isLight, setWaitlistTheme };
}
