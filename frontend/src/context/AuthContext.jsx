import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiGet, apiPost } from '../utils/api';
import toast from '../utils/toast';
import supabase from '../utils/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkSession = async (providedSession = null) => {
        try {
            const data = await apiGet('/auth/me');
            if (data && data.user) {
                setUser(data.user);
                return data.user;
            } else {
                let activeSession = providedSession;
                if (!activeSession) {
                    const { data: { session } } = await supabase.auth.getSession();
                    activeSession = session;
                }
                if (activeSession?.user) {
                    const fallbackUser = {
                        id: activeSession.user.id,
                        email: activeSession.user.email,
                        full_name: activeSession.user.user_metadata?.full_name || activeSession.user.email?.split('@')[0],
                        username: activeSession.user.user_metadata?.username || activeSession.user.email?.split('@')[0],
                        role: 'user',
                        isGuest: false
                    };
                    setUser(fallbackUser);
                    return fallbackUser;
                }
                setUser(null);
                return null;
            }
        } catch (error) {
            console.warn('[checkSession] profile fetch failed, using Supabase session fallback:', error.message);
            try {
                let activeSession = providedSession;
                if (!activeSession) {
                    const { data: { session } } = await supabase.auth.getSession();
                    activeSession = session;
                }
                if (activeSession?.user) {
                    const fallbackUser = {
                        id: activeSession.user.id,
                        email: activeSession.user.email,
                        full_name: activeSession.user.user_metadata?.full_name || activeSession.user.email?.split('@')[0],
                        username: activeSession.user.user_metadata?.username || activeSession.user.email?.split('@')[0],
                        role: 'user',
                        isGuest: false
                    };
                    setUser(fallbackUser);
                    return fallbackUser;
                }
            } catch (e) {}
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Monitor Supabase Auth state changes dynamically
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            console.log(`[Supabase Auth Event] ${event}`);
            if (currentSession) {
                setSession(currentSession);
                localStorage.setItem('aiimin_session_fallback', currentSession.access_token);
                try {
                    await checkSession(currentSession);
                } catch (err) {
                    console.error('Failed to sync profile after auth event:', err);
                    setUser(null);
                }
            } else {
                setSession(null);
                setUser(null);
                localStorage.removeItem('aiimin_session_fallback');
            }
            setLoading(false);
        });

        // Initial check for active session
        supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
            if (activeSession) {
                setSession(activeSession);
                localStorage.setItem('aiimin_session_fallback', activeSession.access_token);
                checkSession(activeSession);
            } else {
                localStorage.removeItem('aiimin_session_fallback');
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/auth/callback'
                }
            });
            if (error) throw error;
        } catch (err) {
            console.error('Google sign-in error:', err);
            toast.error(err.message || 'Google authentication failed');
        }
    };

    const signUpWithUsername = async (username, pin, fullName = '', email = '') => {
        try {
            const authEmail = email || `${username.toLowerCase()}@aiimin.com`;
            await apiPost('/auth/signup', {
                email: authEmail,
                password: pin,
                fullName,
                username
            });

            const { data, error } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password: pin,
            });
            if (error) throw error;

            localStorage.setItem('aiimin_session_fallback', data.session.access_token);
            setSession(data.session);
            const profile = await checkSession(data.session);
            toast.success('Registration successful!');
            return { user: profile, session: data.session };
        } catch (error) {
            console.error('Error signing up:', error);
            throw new Error(error.response?.data?.error || error.message || 'Signup failed');
        }
    };

    const signInWithUsername = async (username, pin) => {
        try {
            let authEmail = `${username.toLowerCase()}@aiimin.com`;
            
            // Resolve username to real email if exists
            try {
                const resolveData = await apiGet(`/auth/resolve?identifier=${encodeURIComponent(username)}`, { auth: false });
                if (resolveData && resolveData.email) {
                    authEmail = resolveData.email;
                }
            } catch (e) {
                // Not found or error, default email will be used
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password: pin,
            });
            if (error) throw error;

            localStorage.setItem('aiimin_session_fallback', data.session.access_token);
            setSession(data.session);
            const profile = await checkSession(data.session);
            toast.success('Welcome back!');
            return { user: profile, session: data.session };
        } catch (error) {
            console.error('Error signing in:', error);
            throw new Error(error.response?.data?.error || error.message || 'Invalid credentials');
        }
    };

    const signOut = async () => {
        try {
            try { await apiPost('/auth/logout'); } catch(e) {}
            await supabase.auth.signOut();
            localStorage.removeItem('aiimin_session_fallback');
            setUser(null);
            setSession(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const value = {
        user,
        session,
        loading,
        signInWithGoogle,
        signUpWithUsername,
        signInWithUsername,
        logout: signOut,
        signOut,
        checkSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
