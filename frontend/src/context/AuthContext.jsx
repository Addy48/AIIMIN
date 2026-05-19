import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost } from '../utils/api';
import toast from '../utils/toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null); // Keep for compatibility if used anywhere
    const [loading, setLoading] = useState(true);

    const checkSession = async () => {
        try {
            const data = await apiGet('/auth/me');
            if (data && data.user) {
                setUser(data.user);
                setSession({ user: data.user }); // mock session object
            } else {
                setUser(null);
                setSession(null);
            }
        } catch (error) {
            setUser(null);
            setSession(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    const signInWithGoogle = async () => {
        // Redirect to backend endpoint
        const apiBase = process.env.REACT_APP_API_URL || '/api';
        window.location.href = `${apiBase}/auth/google`;
    };

    const signUpWithEmail = async (email, password, fullName = '', username = '') => {
        try {
            const data = await apiPost('/auth/signup', { email, password, fullName, username });
            setUser(data.user);
            setSession({ user: data.user });
            if (data.token) {
                localStorage.setItem('aiimin_session_fallback', data.token);
            }
        } catch (error) {
            console.error('Error signing up:', error);
            throw new Error(error.response?.data?.error || 'Signup failed');
        }
    };

    const signInWithEmail = async (identifier, password) => {
        try {
            let authEmail = identifier;
            if (!identifier.includes('@')) {
                const data = await apiGet(`/auth/resolve?identifier=${encodeURIComponent(identifier)}`, { auth: false });
                authEmail = data.email;
            }

            const data = await apiPost('/auth/login', { email: authEmail, password });
            setUser(data.user);
            setSession({ user: data.user });
            
            // Set fallback for local dev if cookies are blocked
            if (data.token) {
                localStorage.setItem('aiimin_session_fallback', data.token);
            }
        } catch (error) {
            console.error('Error signing in:', error);
            throw new Error(error.response?.data?.error || 'Invalid credentials');
        }
    };

    const signOut = async () => {
        try {
            await apiPost('/auth/logout');
            setUser(null);
            setSession(null);
            localStorage.removeItem('aiimin_session_fallback');
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
