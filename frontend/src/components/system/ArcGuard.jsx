import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../hooks/useUserProfile';
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
  const { profile, loading } = useUserProfile();

  const exempt = EXEMPT_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (loading || exempt) return;
    if (!hasLifeArc(profile?.tagline)) {
      navigate('/onboarding?arc=1', { replace: true });
    }
  }, [loading, exempt, profile?.tagline, navigate]);

  if (!exempt && !loading && !hasLifeArc(profile?.tagline)) {
    return null;
  }

  return children;
}
