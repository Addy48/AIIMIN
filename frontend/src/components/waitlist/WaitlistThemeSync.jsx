import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';
import { useAccessGate } from '../../hooks/useAccessGate';
import { readStoredWaitlistTheme } from '../../hooks/useWaitlistSurfaceTheme';

const WAITLIST_ALWAYS_PATHS = new Set(['/waitlist', '/brand']);

/**
 * Keeps waitlist theme forced while the user is on waitlist landing or waitlist brand.
 * Lives in App so theme does not reset during client-side navigation between those routes.
 */
export default function WaitlistThemeSync() {
  const location = useLocation();
  const { isWaitlistMode, canAccessApp } = useAccessGate();
  const { setForcedTheme } = useTheme();

  useLayoutEffect(() => {
    const onWaitlistSurface =
      WAITLIST_ALWAYS_PATHS.has(location.pathname) ||
      (location.pathname === '/' && isWaitlistMode && !canAccessApp);

    if (onWaitlistSurface) {
      setForcedTheme(readStoredWaitlistTheme());
    } else {
      setForcedTheme(null);
    }
  }, [location.pathname, isWaitlistMode, canAccessApp, setForcedTheme]);

  return null;
}
