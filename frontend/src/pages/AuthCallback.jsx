import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { session } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const status = searchParams.get('status');
        const reason = searchParams.get('reason');
        const supabaseError = searchParams.get('error');
        const supabaseDesc = searchParams.get('error_description');

        if (supabaseError) {
            const msg = supabaseDesc ? decodeURIComponent(supabaseDesc) : supabaseError;
            setError(msg);
            setTimeout(() => navigate('/login'), 4000);
            return;
        }

        if (status === 'error') {
            setError(reason || 'Authentication failed');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        if (status === 'success') {
            navigate('/', { replace: true });
            return;
        }
    }, [searchParams, navigate]);

    useEffect(() => {
        if (session) {
            navigate('/overview', { replace: true });
        }
    }, [session, navigate]);

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
                        Google Sign-In Failed
                    </p>
                    <p style={{ color: 'var(--text-2)', fontSize: '12px', margin: '0 0 12px', wordBreak: 'break-word' }}>
                        {error?.includes('exchange') ? 'Google OAuth misconfiguration — see setup instructions.' : error}
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
