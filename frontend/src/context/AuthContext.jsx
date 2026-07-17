import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiGet, apiPost } from '../utils/api';
import toast from '../utils/toast';
import {
    authClient,
    signIn,
    signUp,
    signOut as betterSignOut,
} from '../lib/auth-client';
import {
    authFetchOptions,
    clearAccessToken,
    getOAuthHandoffUrl,
    purgeLegacyAuthTokens,
} from '../utils/authSession';

const AuthContext = createContext(null);

const normalizeUsername = (value = '') => value.trim().toUpperCase();
const normalizeEmail = (value = '') => value.trim().toLowerCase();
const isEmailIdentifier = (value = '') => value.includes('@');

export function AuthProvider({ children }) {
    const { data: sessionData, isPending, refetch } = authClient.useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const session = sessionData?.session || null;
    const sessionUser = sessionData?.user || null;

    useEffect(() => {
        purgeLegacyAuthTokens();
    }, []);

    const checkSession = useCallback(async () => {
        if (!sessionUser) {
            setUser(null);
            setLoading(false);
            return null;
        }

        const fallbackUser = {
            id: sessionUser.id,
            email: sessionUser.email,
            full_name: sessionUser.name || sessionUser.fullName || '',
            username: sessionUser.username || sessionUser.displayUsername || '',
            role: 'user',
            emailVerified: Boolean(sessionUser.emailVerified),
            isGuest: false,
        };

        setUser((prev) => prev || fallbackUser);
        setLoading(false);

        try {
            const data = await apiGet('/auth/me');
            if (data?.user) {
                setUser(data.user);
                return data.user;
            }
            return fallbackUser;
        } catch (error) {
            console.warn('[checkSession] profile fetch failed:', error.message);
            return fallbackUser;
        }
    }, [sessionUser]);

    useEffect(() => {
        if (isPending) return;
        if (sessionUser) {
            checkSession();
        } else {
            setUser(null);
            setLoading(false);
        }
    }, [isPending, sessionUser, checkSession]);

    const signInWithGoogle = async () => {
        const origin = window.location.origin;
        try {
            await signIn.social({
                provider: 'google',
                callbackURL: getOAuthHandoffUrl(),
                errorCallbackURL: `${origin}/auth/callback?status=error`,
                fetchOptions: authFetchOptions,
            });
        } catch (err) {
            toast.error('Could not reach the auth server. Is the API running?');
            throw err;
        }
    };

    const signUpWithUsername = async (username, pin, fullName = '', email = '') => {
        const normalizedUsername = normalizeUsername(username);
        const authEmail = normalizeEmail(email) || `${normalizedUsername.toLowerCase()}@aiimin.com`;

        const result = await signUp.email({
            email: authEmail,
            password: pin,
            name: fullName || normalizedUsername,
            username: normalizedUsername,
            fetchOptions: authFetchOptions,
        });

        if (result.error) throw new Error(result.error.message || 'Signup failed');

        await refetch?.();
        await checkSession();
        toast.success('Registration successful! Check your email to verify your account.');
        return { user: result.data?.user, session: result.data?.session };
    };

    const signInWithUsername = async (username, pin) => {
        const identifier = username.trim();
        let result;

        if (isEmailIdentifier(identifier)) {
            result = await signIn.email({
                email: normalizeEmail(identifier),
                password: pin,
                fetchOptions: authFetchOptions,
            });
        } else {
            // Prefer email sign-in after resolve — Better Auth username casing can drift
            let emailForLogin = null;
            try {
                const resolved = await apiGet(
                    `/auth/resolve?identifier=${encodeURIComponent(normalizeUsername(identifier))}`,
                    { auth: false },
                );
                emailForLogin = resolved?.email || null;
            } catch (_) {
                /* fall through to username sign-in */
            }

            if (emailForLogin) {
                result = await signIn.email({
                    email: normalizeEmail(emailForLogin),
                    password: pin,
                    fetchOptions: authFetchOptions,
                });
            } else {
                result = await signIn.username({
                    username: normalizeUsername(identifier),
                    password: pin,
                    fetchOptions: authFetchOptions,
                });
            }
        }

        if (result.error) {
            const err = new Error(result.error.message || 'Invalid credentials');
            err.status = result.error.status || result.error.statusCode || undefined;
            if (/too many|rate limit/i.test(err.message)) err.status = 429;
            throw err;
        }

        await refetch?.();
        const profile = await checkSession();
        toast.success('Welcome back!');
        return { user: profile, session: result.data?.session };
    };

    const signOut = async () => {
        try {
            try { await apiPost('/auth/logout'); } catch (_) { /* ignore */ }
            await betterSignOut({ fetchOptions: authFetchOptions });
        } catch (_) { /* ignore */ }
        clearAccessToken();
        setUser(null);
        toast.success('Logged out successfully');
    };

    const value = {
        user,
        session: sessionUser,
        loading: loading || isPending,
        isSignedIn: Boolean(sessionUser),
        emailVerified: Boolean(sessionUser?.emailVerified),
        signInWithGoogle,
        signUpWithUsername,
        signInWithUsername,
        logout: signOut,
        signOut,
        checkSession,
        refetchSession: refetch,
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
