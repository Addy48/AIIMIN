import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const EXEMPT = ['/verify-email', '/login', '/auth', '/onboarding', '/account'];

/**
 * Redirect unverified users to /verify-email (server also blocks writes).
 */
export default function EmailVerifiedGuard({ children }) {
  const { isSignedIn, emailVerified, loading, user } = useAuth();
  const { pathname } = useLocation();

  if (loading || !isSignedIn) return children;

  const synthetic = user?.email?.toLowerCase().endsWith('@aiimin.com');
  if (emailVerified || synthetic) return children;

  const exempt = EXEMPT.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (exempt) return children;

  return <Navigate to="/verify-email" replace />;
}
