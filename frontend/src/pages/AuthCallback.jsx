import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { apiGet } from '../utils/api';
import { resolveOAuthSession } from '../utils/authSession';
import { useAuth } from '../hooks/useAuth';
import ThemedMark from '../components/brand/ThemedMark';
import Wordmark from '../components/brand/Wordmark';

const SESSION_TIMEOUT_MS = 15_000;

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkSession } = useAuth();
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('Establishing secure connection…');
    const finishedRef = useRef(false);

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const supabaseError = searchParams.get('error') || hashParams.get('error');
        const supabaseDesc = searchParams.get('error_description') || hashParams.get('error_description');
        const errorCode = searchParams.get('error_code') || hashParams.get('error_code');
        const queryStatus = searchParams.get('status');
        const reason = searchParams.get('reason');

        if (supabaseError) {
            let msg = supabaseDesc ? decodeURIComponent(supabaseDesc.replace(/\+/g, ' ')) : supabaseError;
            if (errorCode === 'signup_disabled') {
                msg = 'New signups are disabled in Supabase. Your tester email must be pre-invited — contact the team or use OS-ID + PIN login.';
            }
            setError(msg);
            setTimeout(() => navigate('/login'), 5000);
            return undefined;
        }

        if (queryStatus === 'error') {
            setError(reason || 'Authentication failed');
            setTimeout(() => navigate('/login'), 3000);
            return undefined;
        }

        let cancelled = false;

        const fail = (msg) => {
            if (cancelled || finishedRef.current) return;
            finishedRef.current = true;
            setError(msg);
            setTimeout(() => navigate('/login'), 3000);
        };

        const finishWithSession = async (session) => {
            if (cancelled || finishedRef.current) return;
            const token = session?.access_token;
            if (!token) {
                fail('Could not establish session. Please try again.');
                return;
            }

            finishedRef.current = true;
            setStatus('Checking profile…');

            try {
                const data = await apiGet('/auth/me');
                const userProfile = data?.user;

                const isIncomplete =
                    !userProfile?.username ||
                    userProfile.username === '' ||
                    userProfile.onboarding_stage === 0 ||
                    userProfile.onboarding_stage == null;

                if (isIncomplete) {
                    setStatus('Setting up your profile…');
                    navigate('/onboarding', { replace: true });
                } else {
                    setStatus('Welcome back!');
                    navigate('/overview', { replace: true });
                }
            } catch (err) {
                console.error('[AuthCallback] profile check failed:', err);
                // Valid JWT but profile fetch failed — still let them onboard
                navigate('/onboarding', { replace: true });
            }
        };

        const timeoutId = setTimeout(() => {
            fail('Session setup timed out. Please try signing in again.');
        }, SESSION_TIMEOUT_MS);

        const handleCallback = async () => {
            try {
                setStatus('Verifying identity…');
                const session = await resolveOAuthSession(supabase, {
                    searchParams,
                    timeoutMs: SESSION_TIMEOUT_MS - 1000,
                });

                // Hydrate AuthContext before routing — prevents waitlist gate race
                let hydrated = session;
                if (!session?.user?.email) {
                    const { data: { session: full } } = await supabase.auth.getSession();
                    hydrated = full || session;
                }
                await checkSession(hydrated);

                await finishWithSession(hydrated);
            } catch (err) {
                console.error('[AuthCallback] error:', err);
                fail(err?.message?.includes('timed out')
                    ? 'Sign-in took too long. Please try again.'
                    : 'Something went wrong. Redirecting…');
            }
        };

        handleCallback();

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [searchParams, navigate]);

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
                        boxShadow: '0 24px 64px rgba(0,0,0,0.08)',
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
                        {error?.includes('exchange') ? 'Google OAuth misconfiguration — verify provider setup in Supabase.' : error}
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

                <motion.p
                    key={status}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: 'var(--text-2)', fontSize: '14px', margin: 0 }}
                >
                    {status}
                </motion.p>
            </motion.div>

            <style>{`@keyframes cb-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AuthCallback;
