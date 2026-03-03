import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

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

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUser(session.user);
                fetchProfile(session.user.id);
            }
            setSession(session ?? null);
            setLoading(false);
        });

        // Listen to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
                fetchProfile(session.user.id);
            } else {
                setUser(null);
            }
            setSession(session ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/google/auth/login`);
            if (!response.ok) throw new Error('Failed to initiate Google login');
            const { authUrl } = await response.json();
            window.location.href = authUrl;
        } catch (error) {
            console.error('Error logging in with Google:', error.message);
            throw error;
        }
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
            // Resolve identifier (email or username) to actual email via backend
            const resolveUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/resolve?identifier=${encodeURIComponent(identifier)}`;
            const resolveResponse = await fetch(resolveUrl);

            if (!resolveResponse.ok) {
                const errData = await resolveResponse.json();
                throw new Error(errData.error || 'User not found');
            }

            const { email } = await resolveResponse.json();

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
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
