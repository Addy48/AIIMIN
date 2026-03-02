import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setSession(session ?? null);
            setLoading(false);
        });

        // Listen to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setSession(session ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in with Google:', error.message);
            throw error;
        }
    };

    const signUpWithEmail = async (email, password, fullName = '') => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error signing up:', error.message);
            throw error;
        }
    };

    const signInWithEmail = async (email, password) => {
        try {
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
