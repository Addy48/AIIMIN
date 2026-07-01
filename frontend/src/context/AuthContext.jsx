/**
 * AuthContext — session bridge until AWS Cognito is wired.
 * Reads bearer token from localStorage; no third-party auth SDK.
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiGet } from '../utils/api';

const SESSION_KEY = 'aiimin_session_fallback';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  const loadSession = useCallback(async () => {
    const token = typeof localStorage !== 'undefined'
      ? localStorage.getItem(SESSION_KEY)
      : null;

    if (!token) {
      setUser(null);
      setSession(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await apiGet('/account/user-profile');
      const shaped = {
        id: profile.user_id || profile.id,
        full_name: profile.full_name || profile.display_name || profile.username || 'User',
        username: profile.username || 'USER',
        email: profile.email || '',
        avatar: profile.avatar_url || null,
        role: profile.role || 'user',
        isGuest: false,
        created_at: profile.created_at,
      };
      setUser(shaped);
      setSession({ user: { id: shaped.id }, provider: 'token' });
    } catch {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const signOut = useCallback(async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setSession(null);
    toast.success('Logged out');
    window.location.href = '/';
  }, []);

  const value = {
    user,
    session,
    loading,
    isSignedIn: Boolean(session && user),
    signOut,
    logout: signOut,
    signInWithGoogle: () => { window.location.href = '/login'; },
    signUpWithUsername: () => { window.location.href = '/login'; },
    signInWithUsername: () => { window.location.href = '/login'; },
    checkSession: loadSession,
    getCurrentAccessToken: async () => localStorage.getItem(SESSION_KEY) || null,
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
