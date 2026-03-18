import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import supabase from '../utils/supabase';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            const tokenHash = searchParams.get('token_hash');
            const type = searchParams.get('type');
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

            // Login flow: verify the magic link token
            if (tokenHash && type) {
                const { error: verifyError } = await supabase.auth.verifyOtp({
                    token_hash: tokenHash,
                    type: type,
                });

                if (verifyError) {
                    setError(verifyError.message);
                    setTimeout(() => navigate('/login'), 3000);
                    return;
                }

                // Session established — onAuthStateChange in useAuth will pick it up
                navigate('/');
                return;
            }

            // Fallback: no recognized params, go home
            navigate('/');
        };

        handleCallback();
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
