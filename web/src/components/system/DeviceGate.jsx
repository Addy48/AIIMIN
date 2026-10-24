import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDeviceTier, applyDeviceTierAttr } from '../../hooks/useDeviceTier';
import { DeskNotice } from '../../site/SitePages';

const DESK_KEY = 'aiimin_phone_desktop_ok';
const readOk = () => { try { return sessionStorage.getItem(DESK_KEY) === '1'; } catch { return false; } };

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
  '/waitlist',
  '/legal',
  '/cookies',
  '/grievance',
  '/refunds',
  '/acceptable-use',
  '/ai-disclosure',
  '/subprocessors',
  '/app',
  '/m',
];

function isPublicPath(pathname) {
  if (pathname === '/') return true;
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Signed-in phone browsers → a notice pointing to the app (PRD 3.7).
 * iPad/tablet → the full site.
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
  const [deskOk, setDeskOk] = useState(readOk);

  if (
    authed
    && isPhone
    && !forceDesktop
    && location.pathname.startsWith('/account')
  ) {
    return <Navigate to={`/m/account${location.search || ''}`} replace />;
  }

  // PRD 3.7: a signed-in tester on a phone sees "The full site is for desktop. Use the app.",
  // with "Open desktop site anyway" for this browser session.
  if (authed && isPhone && !forceDesktop && !deskOk && !isPublicPath(location.pathname)) {
    return <DeskNotice onContinue={() => { try { sessionStorage.setItem(DESK_KEY, '1'); } catch { /* private window */ } setDeskOk(true); }} />;
  }
  return children;
}
