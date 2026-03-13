import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { redirectToGoogle } from '../utils/authRedirect';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async (userId) => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/account/profile`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });
                const profile = await response.json();
                setUser(prev => ({ ...prev, ...profile }));
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            }
        };

        // Guarantee the public.users row exists (trigger may have been missed)
        const ensureUserRow = async (authUser) => {
            const meta = authUser.user_metadata || {};
            await supabase.from('users').upsert(
                {
                    id:         authUser.id,
                    email:      authUser.email,
                    full_name:  meta.full_name || meta.name || null,
                    avatar_url: meta.avatar_url || meta.picture || null,
                },
                { onConflict: 'id', ignoreDuplicates: true }
            );
        };

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUser(session.user);
                ensureUserRow(session.user).then(() => fetchProfile(session.user.id));
            }
            setSession(session ?? null);
            setLoading(false);
        });

        // Listen to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
                ensureUserRow(session.user).then(() => fetchProfile(session.user.id));
            } else {
                setUser(null);
            }
            setSession(session ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = () => {
        redirectToGoogle('login');
    };

    const signUpWithEmail = async (email, password, fullName = '', username = '') => {
        try {
            const { error } = await supabase.auth.signUp({
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
        } catch (error) {
            console.error('Error signing up:', error.message);
            throw error;
        }
    };

    const signInWithEmail = async (identifier, password) => {
        try {
            let email;

            if (identifier.includes('@')) {
                // It's already an email — use directly, no backend needed
                email = identifier.toLowerCase();
            } else {
                // It's a username — resolve via backend
                const resolveUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/resolve?identifier=${encodeURIComponent(identifier)}`;
                const resolveResponse = await fetch(resolveUrl);
                if (!resolveResponse.ok) {
                    const errData = await resolveResponse.json();
                    throw new Error(errData.error || 'User not found');
                }
                ({ email } = await resolveResponse.json());
            }

            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (error) {
            console.error('Error signing in:', error.message);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Error logging out:', error.message);
            throw error;
        }
    };

    return { user, session, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, signOut };
};

export default useAuth;
