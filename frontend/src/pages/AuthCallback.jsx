import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import supabase from '../utils/supabase';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const status = searchParams.get('status');
        const reason = searchParams.get('reason');

        // Error from backend redirect
        if (status === 'error') {
            setError(reason || 'Authentication failed');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        // Integration success (non-login OAuth like calendar/youtube connect)
        if (status === 'success') {
            navigate('/');
            return;
        }

        // Login flow: Supabase verify endpoint redirects here with tokens in URL hash
        // e.g. /auth/callback#access_token=xxx&refresh_token=xxx&...
        // The Supabase JS client auto-detects and processes these hash fragments.
        // We just need to wait for the session to be established.

        // Listen for auth state change (fires when Supabase processes the hash)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                navigate('/');
            }
        });

        // Also check if session is already set (hash may have been processed before this effect ran)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/');
            }
        });

        // Timeout fallback — if nothing happens in 10s, go to login
        const timeout = setTimeout(() => {
            setError('Login timed out. Please try again.');
            setTimeout(() => navigate('/login'), 2000);
        }, 10000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, [searchParams, navigate]);

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
                fontFamily: 'inherit',
            }}>
                <div style={{
                    padding: '20px 32px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--danger)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    maxWidth: '400px',
                }}>
                    <p style={{ color: 'var(--danger)', fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>
                        Authentication Error
                    </p>
                    <p style={{ color: 'var(--text-2)', fontSize: '13px', margin: '0 0 12px' }}>
                        {error}
                    </p>
                    <p style={{ color: 'var(--text-3)', fontSize: '11px', margin: 0 }}>
                        Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                border: '3px solid var(--border)',
                borderTopColor: 'var(--accent)',
                animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AuthCallback;
