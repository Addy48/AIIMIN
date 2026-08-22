import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LEGAL } from '../../constants/legal';
import { CONSENT_STORAGE_KEY, readConsent } from '../../utils/consent';

const buttonBase = {
    flex: '1 1 160px',
    minHeight: '44px',
    padding: '11px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: 1.2,
    textAlign: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
};

export default function ConsentBanner() {
    const [visible, setVisible] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setReducedMotion(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
        if (!readConsent()) setVisible(true);
    }, []);

    const decide = (analytics) => {
        try {
            localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
                analytics,
                version: LEGAL.consentVersion,
                at: new Date().toISOString(),
            }));
        } catch {
            /* storage unavailable — the banner simply reappears next visit */
        }
        setVisible(false);
        if (analytics) window.location.reload();
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="consent-banner-title"
            style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 60,
                padding: '16px',
                background: 'var(--bg-card, #2d2d2d)',
                borderTop: '1px solid var(--border, #3a3a3a)',
                boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.25)',
                animation: reducedMotion ? 'none' : 'aiimin-consent-rise 220ms ease-out',
            }}
        >
            <style>{'@keyframes aiimin-consent-rise{from{transform:translateY(100%)}to{transform:translateY(0)}}'}</style>
            <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h2 id="consent-banner-title" style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-1, #f5f5f5)' }}>
                    Analytics are off until you say yes
                </h2>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--text-2, #b5b5b5)' }}>
                    Strictly necessary cookies keep you signed in and remember your interface preferences — those always
                    run. Product analytics and error reporting stay switched off until you agree, and you can change your
                    mind at any time in Account → Privacy.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={() => decide(true)}
                        style={{
                            ...buttonBase,
                            background: 'var(--accent, #ff6b35)',
                            color: '#ffffff',
                            border: '1px solid var(--accent, #ff6b35)',
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
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-1, #f5f5f5)',
                            border: '1px solid var(--border, #4b5563)',
                        }}
                    >
                        Reject
                    </button>
                    <Link
                        to="/cookies"
                        style={{
                            ...buttonBase,
                            background: 'transparent',
                            color: 'var(--text-2, #a3a3a3)',
                            border: '1px solid var(--border, #3a3a3a)',
                        }}
                    >
                        Cookie policy
                    </Link>
                </div>
            </div>
        </div>
    );
}
