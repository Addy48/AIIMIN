import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../utils/api';
import { readAccessToken } from '../utils/authSession';

const IS_WAITLIST_MODE = process.env.REACT_APP_WAITLIST_MODE === 'true';

const DEV_EMAILS = (process.env.REACT_APP_DEV_EMAILS || '')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const TESTER_EMAILS = (process.env.REACT_APP_TESTER_EMAILS || '')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

const DEFAULT_DEVS = ['aadityaupadhyay10@gmail.com'];
const DEFAULT_TESTERS = [
  'aadityaupadhyay85@gmail.com',
  'sanchitbhatia2006@gmail.com',
  'adityamehta298@gmail.com',
  'shishangthakur@icloud.com',
  'kuldeepyadav2911@gmail.com',
];

function envFallbackAccess(email) {
  if (!IS_WAITLIST_MODE) return { canAccessApp: true, role: 'public', tier: 'explore' };
  const normalized = String(email || '').trim().toLowerCase();
  if (normalized && (DEV_EMAILS.includes(normalized) || DEFAULT_DEVS.includes(normalized))) {
    return { canAccessApp: true, role: 'dev', tier: 'elite' };
  }
  if (normalized && (TESTER_EMAILS.includes(normalized) || DEFAULT_TESTERS.includes(normalized))) {
    return { canAccessApp: true, role: 'tester', tier: 'elite' };
  }
  return { canAccessApp: false, role: 'public', tier: 'explore' };
}

function emailFromJwt(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return String(payload.email || '').trim().toLowerCase() || null;
  } catch {
    return null;
  }
}

/**
 * Server-backed waitlist gate — email allowlist + dev/tester env.
 */
export function useAccessGate() {
  const { isSignedIn, user, loading: authLoading } = useAuth();
  const hasToken = Boolean(readAccessToken());
  const effectivelySignedIn = isSignedIn || hasToken;

  const [state, setState] = useState({
    loading: true,
    canAccessApp: !IS_WAITLIST_MODE,
    role: 'public',
    tier: 'explore',
  });

  useEffect(() => {
    if (authLoading) return;

    if (!effectivelySignedIn) {
      setState({
        loading: false,
        canAccessApp: !IS_WAITLIST_MODE,
        role: 'public',
        tier: 'explore',
      });
      return;
    }

    // Token exists but profile not hydrated yet — keep gate loading to avoid false waitlist redirect
    const email = user?.email || emailFromJwt(readAccessToken());
    if (!email) {
      setState((prev) => ({ ...prev, loading: true }));
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
      } catch (err) {
        if (cancelled) return;
        const fallback = envFallbackAccess(email);
        setState({ loading: false, ...fallback });
      }
    })();

    return () => { cancelled = true; };
  }, [effectivelySignedIn, authLoading, user?.email]);

  return { ...state, isWaitlistMode: IS_WAITLIST_MODE };
}

export default useAccessGate;
