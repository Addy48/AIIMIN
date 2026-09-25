import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuth } from '../../hooks/useAuth';
import { hasLifeArc } from '../../constants/arc';

const EXEMPT_PREFIXES = [
  '/onboarding',
  '/login',
  '/auth',
  '/privacy',
  '/terms',
  '/contact',
  '/about',
  '/security',
  '/data-deletion',
  '/brand',
];

/**
 * Redirects signed-in users without a Life Arc to finish onboarding setup.
 */
export default function ArcGuard({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const isAuthenticatedUser = Boolean(session && user && !user.isGuest);
  const { profile, loading } = useUserProfile({ enabled: isAuthenticatedUser });

  const exempt = EXEMPT_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (!isAuthenticatedUser || loading || exempt) return;
    if (!hasLifeArc(profile?.tagline)) {
      navigate('/onboarding?arc=1', { replace: true });
    }
  }, [isAuthenticatedUser, loading, exempt, profile?.tagline, navigate]);

  if (isAuthenticatedUser && !exempt && !loading && !hasLifeArc(profile?.tagline)) {
    return null;
  }

  return children;
}
