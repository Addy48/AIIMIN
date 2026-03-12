import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

export default function useDevMode() {
    const [isDevMode, setIsDevMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const checkDevStatus = async (session) => {
            if (!mounted) return;

            if (!session?.user?.email) {
                setIsDevMode(false);
                setLoading(false);
                return;
            }

            // Strict comparison against environment variable
            const devEmail = process.env.REACT_APP_DEV_EMAIL;
            const isMatch = Boolean(
                devEmail &&
                session.user.email.toLowerCase() === devEmail.toLowerCase()
            );

            setIsDevMode(isMatch);
            setLoading(false);
        };

        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            checkDevStatus(session);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            checkDevStatus(session);
        });

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    return { isDevMode, loading };
}
