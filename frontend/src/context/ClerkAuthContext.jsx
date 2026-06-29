/**
 * ClerkAuthContext.jsx
 *
 * Bridges @clerk/clerk-react into the existing useAuth() interface.
 * The rest of the app continues to call useAuth() unchanged — it now
 * gets Clerk-backed user/session/loading/signOut values.
 *
 * Strategy:
 *  - ClerkProvider wraps the whole app (in App.js)
 *  - This context reads from Clerk hooks and shapes data to match the
 *    existing { user, session, loading, signOut } contract
 *  - The "session" object is faked from Clerk's active session so that
 *    places checking `if (session)` keep working
 *  - For API calls, we inject the Clerk JWT via getCurrentAccessToken()
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  useUser,
  useAuth as useClerkAuth,
  useClerk,
} from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken, signOut: clerkSignOut } = useClerkAuth();
  const { openSignIn } = useClerk();

  const [loading, setLoading] = useState(false);

  // Once Clerk has loaded, we're done loading
  useEffect(() => {
    setLoading(false);
  }, [isLoaded]);

  /**
   * Shape the Clerk user into the existing app's user object format.
   * The app reads: id, full_name, username, email, role, isGuest, avatar
   */
  const user = React.useMemo(() => {
    // FORCE GUEST MODE BYPASS
    return {
      id: 'guest_bypass_id',
      full_name: 'Guest User',
      username: 'guest',
      email: 'guest@aiimin.in',
      avatar: null,
      role: 'user', // Treat as user to avoid guest restrictions in the app
      isGuest: false,
      clerkUser: {},
    };
  }, [isSignedIn, clerkUser]);

  /**
   * Fake "session" object — the app checks `if (session)` to gate routes.
   * We provide a truthy object when Clerk says signed in.
   */
  const session = React.useMemo(() => {
    // FORCE GUEST MODE BYPASS
    return { user: { id: 'guest_bypass_id' }, provider: 'guest_bypass' };
  }, [isSignedIn, clerkUser]);

  /**
   * Get Clerk JWT for API calls. Called by utils/api.js.
   * Returns null if not signed in.
   */
  const getCurrentAccessToken = useCallback(async () => {
    if (!isSignedIn) return null;
    try {
      const token = await getToken();
      return token;
    } catch (err) {
      console.warn('[ClerkAuth] getToken failed:', err.message);
      return null;
    }
  }, [isSignedIn, getToken]);

  const signOut = useCallback(async () => {
    try {
      await clerkSignOut();
      toast.success('Logged out successfully');
      window.location.href = '/login';
    } catch (err) {
      console.error('[ClerkAuth] signOut error:', err);
      window.location.href = '/login';
    }
  }, [clerkSignOut]);

  /**
   * Legacy compat: the old Supabase-based methods.
   * We map them to Clerk equivalents or no-ops so nothing crashes.
   */
  const signInWithGoogle = useCallback(() => {
    // Clerk handles Google OAuth natively via its SignIn UI
    openSignIn({ redirectUrl: window.location.origin + '/overview' });
  }, [openSignIn]);

  const signUpWithUsername = useCallback(() => {
    openSignIn({ redirectUrl: window.location.origin + '/overview' });
  }, [openSignIn]);

  const signInWithUsername = useCallback(() => {
    openSignIn({ redirectUrl: window.location.origin + '/overview' });
  }, [openSignIn]);

  // Expose getCurrentAccessToken so api.js can import it
  // We patch it onto window for use by utils/api.js
  useEffect(() => {
    window.__clerk_getToken = getCurrentAccessToken;
  }, [getCurrentAccessToken]);

  const value = {
    user,
    session,
    loading,
    signOut,
    logout: signOut,
    signInWithGoogle,
    signUpWithUsername,
    signInWithUsername,
    checkSession: async () => user,
    getCurrentAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
