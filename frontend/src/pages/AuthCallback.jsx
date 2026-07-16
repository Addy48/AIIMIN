import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { apiGet } from '../utils/api';
import { authClient } from '../lib/auth-client';
import { readAccessToken, persistSessionFromAuthResponse, getApiOrigin } from '../utils/authSession';
import { useAuth } from '../hooks/useAuth';
import ThemedMark from '../components/brand/ThemedMark';
import Wordmark from '../components/brand/Wordmark';

const SESSION_TIMEOUT_MS = 15_000;

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkSession, refetchSession } = useAuth();
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('Establishing secure connection…');
    const finishedRef = useRef(false);
    const ottAttemptRef = useRef(false);

    useEffect(() => {
        const queryStatus = searchParams.get('status');
        const reason = searchParams.get('reason');
        const authError = searchParams.get('error');

        if (authError || queryStatus === 'error') {
            setError(reason || authError || 'Authentication failed');
            setTimeout(() => navigate('/login'), 4000);
            return undefined;
        }

        let cancelled = false;

        const fail = (msg) => {
            if (cancelled || finishedRef.current) return;
            finishedRef.current = true;
            setError(msg);
            setTimeout(() => navigate('/login'), 3000);
        };

        const finishWithProfile = async () => {
            if (cancelled || finishedRef.current) return;
            finishedRef.current = true;
            setStatus('Checking profile…');

            try {
                await checkSession();
                const data = await apiGet('/auth/me');
                const userProfile = data?.user;
                const isIncomplete =
                    !userProfile?.username ||
                    userProfile.username === '' ||
                    userProfile.onboarding_stage === 0 ||
                    userProfile.onboarding_stage == null;

                navigate(isIncomplete ? '/onboarding' : '/overview', { replace: true });
            } catch (err) {
                console.error('[AuthCallback] profile check failed:', err);
                if (readAccessToken()) {
                    navigate('/onboarding', { replace: true });
                } else {
                    fail('Could not verify your profile. Please try signing in again.');
                }
            }
        };

        const timeoutId = setTimeout(() => {
            fail('Session setup timed out. Please try signing in again.');
        }, SESSION_TIMEOUT_MS);

        const resolveSession = async () => {
            const result = await authClient.getSession({ fetchOptions: { credentials: 'include' } });
            if (result?.error) throw result.error;
            const hasSession = Boolean(result?.data?.session && result?.data?.user);
            const hasBearer = Boolean(readAccessToken());
            return { hasSession, hasBearer, data: result?.data };
        };

        const handleCallback = async () => {
            try {
                setStatus('Verifying identity…');

                const ott = searchParams.get('ott');
                if (ott) {
                    if (readAccessToken()) {
                        await finishWithProfile();
                        return;
                    }
                    if (ottAttemptRef.current) {
                        for (let i = 0; i < 15; i += 1) {
                            await new Promise((r) => setTimeout(r, 120));
                            if (readAccessToken()) {
                                await finishWithProfile();
                                return;
                            }
                        }
                    }
                    ottAttemptRef.current = true;

                    const apiOrigin = getApiOrigin();
                    const verifyRes = await fetch(`${apiOrigin}/api/auth/one-time-token/verify`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token: ott }),
                    });

                    if (verifyRes.ok) {
                        await persistSessionFromAuthResponse(verifyRes);
                    }

                    if (!verifyRes.ok && !readAccessToken()) {
                        const errBody = await verifyRes.json().catch(() => ({}));
                        throw new Error(errBody?.message || 'One-time token verification failed');
                    }

                    await refetchSession?.();
                    await finishWithProfile();
                    return;
                }

                let { hasSession, hasBearer, data } = await resolveSession();

                if (!hasSession && !hasBearer) {
                    await new Promise((r) => setTimeout(r, 400));
                    ({ hasSession, hasBearer, data } = await resolveSession());
                }

                if (!hasSession && !hasBearer) {
                    throw new Error('No session established after Google sign-in');
                }

                await refetchSession?.();
                if (!data?.user) await refetchSession?.();

                await finishWithProfile();
            } catch (err) {
                console.error('[AuthCallback] error:', err);
                fail('Something went wrong during sign-in. Please try again.');
            }
        };

        handleCallback();

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [searchParams, navigate, checkSession, refetchSession]);

    if (error) {
        return (
            <div style={{
                minHeight: '100vh', background: 'var(--color-base)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-sans)',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '40px 36px', background: 'var(--bg-card)',
                        border: '1px solid var(--border)', borderRadius: '24px',
                        textAlign: 'center', maxWidth: '420px', width: '90%',
                    }}
                >
                    <div style={{
                        width: '52px', height: '52px', borderRadius: '50%',
                        background: 'rgba(239,68,68,0.1)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                    }}>
                        <AlertTriangle size={24} color="#EF4444" />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 800, color: 'var(--text-1)', margin: '0 0 12px' }}>
                        Authentication Failed
                    </h2>
                    <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: '0 0 20px', lineHeight: 1.6, wordBreak: 'break-word' }}>
                        {error}
                    </p>
                    <p style={{ color: 'var(--text-3)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                        Redirecting to login…
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh', background: 'var(--color-base)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-sans)',
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <ThemedMark size={48} />
                    <Wordmark size={28} weight={700} color="var(--text-1)" />
                </div>
                <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                    <div style={{
                        position: 'absolute', inset: 0, borderRadius: '50%',
                        border: '2.5px solid var(--border)',
                        borderTopColor: 'var(--color-accent)',
                        animation: 'cb-spin 0.75s linear infinite',
                    }} />
                </div>
                <motion.p key={status} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    style={{ color: 'var(--text-2)', fontSize: '14px', margin: 0 }}>
                    {status}
                </motion.p>
            </motion.div>
            <style>{`@keyframes cb-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AuthCallback;
