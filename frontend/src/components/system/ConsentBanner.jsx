import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { LEGAL } from '../../constants/legal';
import { CONSENT_STORAGE_KEY, readConsent } from '../../utils/consent';

const buttonBase = {
    minHeight: '44px',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 700,
    lineHeight: 1.2,
    textAlign: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
};

const EXEMPT_PATHS = ['/login', '/onboarding', '/verify-email', '/auth', '/m', '/proto'];

export default function ConsentBanner() {
    const [visible, setVisible] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(true);
    const location = useLocation();

    const isExempt = EXEMPT_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`));

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setReducedMotion(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
        if (!readConsent()) {
            setVisible(true);
        }
    }, []);

    const decide = (analytics) => {
        try {
            localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
                analytics,
                version: LEGAL.consentVersion,
                at: new Date().toISOString(),
            }));
            window.dispatchEvent(new CustomEvent('aiimin:consent-updated', { detail: { analytics } }));
        } catch {
            /* storage unavailable */
        }
        setVisible(false);
    };

    if (!visible || isExempt) return null;

    return (
        <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="consent-banner-title"
            style={{
                position: 'fixed',
                left: '16px',
                right: '16px',
                bottom: '16px',
                maxWidth: '680px',
                margin: '0 auto',
                zIndex: 9999,
                padding: '16px 20px',
                background: '#242424',
                border: '1px solid #3d3d3d',
                borderRadius: '14px',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
                animation: reducedMotion ? 'none' : 'aiimin-consent-rise 200ms ease-out',
            }}
        >
            <style>{'@keyframes aiimin-consent-rise{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}'}</style>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 id="consent-banner-title" style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#f5f5f5' }}>
                        Privacy & Analytics
                    </h2>
                    <button
                        type="button"
                        onClick={() => decide(false)}
                        aria-label="Dismiss cookie notice"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#a3a3a3',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '32px',
                            minWidth: '32px',
                            borderRadius: '6px',
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.55, color: '#b5b5b5' }}>
                    Strictly necessary cookies keep you signed in and remember your interface preferences. Analytics and telemetry stay disabled until you opt in. You can change this at any time in Account → Privacy.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                    <button
                        type="button"
                        onClick={() => decide(true)}
                        style={{
                            ...buttonBase,
                            background: 'var(--color-accent, #ff6b35)',
                            color: '#ffffff',
                            border: '1px solid var(--color-accent, #ff6b35)',
                            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.35)',
                        }}
                    >
                        Accept analytics
                    </button>
                    <button
                        type="button"
                        onClick={() => decide(false)}
                        style={{
                            ...buttonBase,
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: '#f5f5f5',
                            border: '1px solid #4b5563',
                        }}
                    >
                        Reject
                    </button>
                    <Link
                        to="/cookies"
                        style={{
                            ...buttonBase,
                            background: 'transparent',
                            color: '#a3a3a3',
                            border: '1px solid #3d3d3d',
                        }}
                    >
                        Cookie policy
                    </Link>
                </div>
            </div>
        </div>
    );
}
