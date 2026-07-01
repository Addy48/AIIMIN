import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../utils/api';

const IS_WAITLIST_MODE = process.env.REACT_APP_WAITLIST_MODE === 'true';

const DEV_EMAILS = (process.env.REACT_APP_DEV_EMAILS || '')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const TESTER_EMAILS = (process.env.REACT_APP_TESTER_EMAILS || '')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

function envFallbackAccess(email) {
  if (!IS_WAITLIST_MODE) return { canAccessApp: true, role: 'public', tier: 'explore' };
  const normalized = String(email || '').trim().toLowerCase();
  if (normalized && DEV_EMAILS.includes(normalized)) {
    return { canAccessApp: true, role: 'dev', tier: 'elite' };
  }
  if (normalized && TESTER_EMAILS.includes(normalized)) {
    return { canAccessApp: true, role: 'tester', tier: 'elite' };
  }
  return { canAccessApp: false, role: 'public', tier: 'explore' };
}

/**
 * Server-backed waitlist gate — email allowlist + dev/tester env.
 */
export function useAccessGate() {
  const { isSignedIn, user, loading: authLoading } = useAuth();
  const [state, setState] = useState({
    loading: true,
    canAccessApp: !IS_WAITLIST_MODE,
    role: 'public',
    tier: 'explore',
  });

  useEffect(() => {
    if (authLoading) return;

    if (!isSignedIn) {
      setState({
        loading: false,
        canAccessApp: !IS_WAITLIST_MODE,
        role: 'public',
        tier: 'explore',
      });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await apiGet('/auth/access');
        if (cancelled) return;
        setState({
          loading: false,
          canAccessApp: Boolean(data.canAccessApp ?? data.canAccess),
          role: data.role || 'public',
          tier: data.tier || 'explore',
        });
      } catch {
        if (cancelled) return;
        const fallback = envFallbackAccess(user?.email);
        setState({ loading: false, ...fallback });
      }
    })();

    return () => { cancelled = true; };
  }, [isSignedIn, authLoading, user?.email]);

  return { ...state, isWaitlistMode: IS_WAITLIST_MODE };
}

export default useAccessGate;
