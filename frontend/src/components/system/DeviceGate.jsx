import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDeviceTier, applyDeviceTierAttr } from '../../hooks/useDeviceTier';

const PUBLIC_PREFIXES = [
  '/login',
  '/auth',
  '/onboarding',
  '/verify-email',
  '/privacy',
  '/terms',
  '/data-deletion',
  '/security',
  '/about',
  '/contact',
  '/brand',
  '/m',
];

function isPublicPath(pathname) {
  if (pathname === '/') return true;
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Phone browsers → /m capture shell (native app coming).
 * iPad/tablet → stay on full Life OS.
 * Bypass: ?forceDesktop=1 (testing only).
 */
export default function DeviceGate({ children, authed }) {
  const location = useLocation();
  const { isPhone } = useDeviceTier();

  useEffect(() => {
    applyDeviceTierAttr();
  }, [location.pathname]);

  const params = new URLSearchParams(location.search);
  const forceDesktop = params.get('forceDesktop') === '1';

  if (
    authed
    && isPhone
    && !forceDesktop
    && location.pathname.startsWith('/account')
  ) {
    return <Navigate to={`/m/account${location.search || ''}`} replace />;
  }

  if (
    authed
    && isPhone
    && !forceDesktop
    && !isPublicPath(location.pathname)
  ) {
    return <Navigate to="/m" replace />;
  }

  return children;
}
