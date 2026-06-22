import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiGet, apiPost } from '../utils/api';
import toast from '../utils/toast';
import supabase from '../utils/supabase';

const AuthContext = createContext(null);

const normalizeUsername = (value = '') => value.trim().toUpperCase();
const normalizeEmail = (value = '') => value.trim().toLowerCase();
const isEmailIdentifier = (value = '') => value.includes('@');

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkSession = useCallback(async (providedSession = null) => {
        let activeSession = providedSession;
        if (!activeSession) {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                activeSession = session;
            } catch (e) {}
        }

        // If no session exists, the user is logged out. Do not hit the backend.
        if (!activeSession?.user) {
            setUser(null);
            setLoading(false);
            return null;
        }

        // Optimistic UI Unblock: if we have a valid JWT session, render the shell instantly
        const fallbackUser = {
            id: activeSession.user.id,
            email: activeSession.user.email,
            full_name: activeSession.user.user_metadata?.full_name || activeSession.user.email?.split('@')[0],
            username: activeSession.user.user_metadata?.username || activeSession.user.email?.split('@')[0],
            role: 'user',
            isGuest: false
        };
        setUser(prev => prev || fallbackUser);
        setLoading(false); // Unblock the UI instantly instead of waiting for backend

        try {
            // Background fetch to sync detailed profile data
            const data = await apiGet('/auth/me');
            if (data && data.user) {
                setUser(data.user);
                return data.user;
            }
            // Return our fallback if DB fails but JWT is valid
            return fallbackUser;
        } catch (error) {
            console.warn('[checkSession] profile fetch failed, using Supabase session fallback:', error.message);
            return fallbackUser;
        }
    }, []);

    useEffect(() => {
        // Failsafe timeout: if Supabase hangs or fails to resolve, unblock UI after 2.5s
        const failsafe = setTimeout(() => {
            setLoading(false);
        }, 2500);

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
            clearTimeout(failsafe);
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
                clearTimeout(failsafe);
                setLoading(false);
            }
        }).catch(err => {
            console.error('Initial getSession failed:', err);
            clearTimeout(failsafe);
            setLoading(false);
        });

        return () => {
            clearTimeout(failsafe);
            subscription.unsubscribe();
        };
    }, [checkSession]);

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account',
                    },
                }
            });
            if (error) throw error;
        } catch (err) {
            console.warn('Google sign-in error:', err);
            toast.error('Google Auth unavailable locally. Please verify Supabase settings.');
        }
    };

    const signUpWithUsername = async (username, pin, fullName = '', email = '') => {
        try {
            const normalizedUsername = normalizeUsername(username);
            const authEmail = normalizeEmail(email) || `${normalizedUsername.toLowerCase()}@aiimin.com`;
            await apiPost('/auth/signup', {
                email: authEmail,
                password: pin,
                fullName,
                username: normalizedUsername
            });

            const { data, error } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password: pin,
            });
            if (error) throw error;

            localStorage.setItem('aiimin_session_fallback', data.session.access_token);
            setSession(data.session);
            
            // Fire checkSession in background, do NOT await it
            checkSession(data.session);
            
            toast.success('Registration successful!');
            
            // Return basic user data instantly
            const basicUser = {
                id: data.session.user.id,
                email: data.session.user.email,
                username: normalizedUsername,
                full_name: fullName,
                role: 'user',
                isGuest: false
            };
            return { user: basicUser, session: data.session };
        } catch (error) {
            console.error('Error signing up:', error);
            throw new Error(error.message || 'Signup failed');
        }
    };

    const signInWithUsername = async (username, pin) => {
        try {
            const identifier = username.trim();
            let authEmail = isEmailIdentifier(identifier)
                ? normalizeEmail(identifier)
                : `${normalizeUsername(identifier).toLowerCase()}@aiimin.com`;
            
            // Resolve username to real email if exists (only if not already an email)
            if (!isEmailIdentifier(identifier)) {
                try {
                    const resolveData = await apiGet(`/auth/resolve?identifier=${encodeURIComponent(identifier)}`, { auth: false });
                    if (resolveData && resolveData.email) {
                        authEmail = resolveData.email;
                    }
                } catch (e) {
                    // Not found or error, default email will be used
                }
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password: pin,
            });
            if (error) throw error;

            localStorage.setItem('aiimin_session_fallback', data.session.access_token);
            setSession(data.session);
            
            // Fire checkSession in background, do NOT await it so we don't block login on /auth/me
            checkSession(data.session);
            
            toast.success('Welcome back!');
            
            // Return basic user data instantly
            const basicUser = {
                id: data.session.user.id,
                email: data.session.user.email,
                username: identifier,
                role: 'user',
                isGuest: false
            };
            return { user: basicUser, session: data.session };
        } catch (error) {
            console.error('Error signing in:', error);
            throw new Error(error.message || 'Invalid credentials');
        }
    };

    const signOut = async () => {
        try {
            try { await apiPost('/auth/logout'); } catch(e) {}
            // Run Supabase sign out, but do not await it indefinitely if it hangs
            try {
                await Promise.race([
                    supabase.auth.signOut(),
                    new Promise(resolve => setTimeout(resolve, 2000))
                ]);
            } catch (e) {
                console.warn('Supabase sign out failed/timed out, clearing local session anyway');
            }
            
            localStorage.removeItem('aiimin_session_fallback');
            setUser(null);
            setSession(null);
            toast.success('Logged out successfully');
            
            // Force redirect to login just in case
            setTimeout(() => {
                window.location.href = '/login';
            }, 300);
        } catch (error) {
            console.error('Error logging out:', error);
            // Fallback clear
            localStorage.removeItem('aiimin_session_fallback');
            setUser(null);
            setSession(null);
            window.location.href = '/login';
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
