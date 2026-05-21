import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet } from '../utils/api';
import toast from '../utils/toast';
import supabase from '../utils/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkSession = async () => {
        try {
            const data = await apiGet('/auth/me');
            if (data && data.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
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
                // Fetch profile details from Hono backend
                try {
                    const data = await apiGet('/auth/me');
                    if (data && data.user) {
                        setUser(data.user);
                    } else {
                        setUser(null);
                    }
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
                checkSession();
            } else {
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

    const signUpWithEmail = async (email, password, fullName = '', username = '') => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        username: username
                    }
                }
            });
            if (error) throw error;
            if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
                throw new Error('This email is already registered. Please sign in instead.');
            }
            toast.success('Registration successful!');
            return data;
        } catch (error) {
            console.error('Error signing up:', error);
            throw new Error(error.message || 'Signup failed');
        }
    };

    const signInWithEmail = async (identifier, password) => {
        try {
            let authEmail = identifier;
            if (!identifier.includes('@')) {
                const data = await apiGet(`/auth/resolve?identifier=${encodeURIComponent(identifier)}`, { auth: false });
                authEmail = data.email;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password
            });
            if (error) throw error;
            toast.success('Welcome back!');
            return data;
        } catch (error) {
            console.error('Error signing in:', error);
            throw new Error(error.message || 'Invalid credentials');
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem('aiimin_session_fallback');
            setUser(null);
            setSession(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const value = useMemo(() => ({
        user,
        session,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        checkSession,
    }), [loading, session, user]);

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

