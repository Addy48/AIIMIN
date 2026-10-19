import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LEGAL } from '../../constants/legal';
import { analyticsConfigured, needsConsentPrompt, readConsent, writeConsent } from '../../utils/consent';
import { POPUP_PRIORITY, usePopupSlot } from '../../utils/popupQueue';

const EXEMPT_PATHS = ['/login', '/onboarding', '/verify-email', '/auth', '/m', '/proto'];

/** Wait for the visitor to engage (scroll or a few seconds of reading) before asking anything. */
const ENGAGE_DELAY_MS = 12000;
const ENGAGE_SCROLL_PX = 320;

const pending = () => needsConsentPrompt(readConsent(), {
    configured: analyticsConfigured(),
    version: LEGAL.consentVersion,
});

export default function ConsentBanner() {
    const location = useLocation();
    const [needed, setNeeded] = useState(pending);
    const [engaged, setEngaged] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(true);

    const isExempt = EXEMPT_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`));

    useEffect(() => {
        setReducedMotion(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
        // The Cookie policy page's "Change my choice" asks again.
        const reopen = () => { setNeeded(pending()); setEngaged(true); };
        window.addEventListener('aiimin:consent-reopen', reopen);
        return () => window.removeEventListener('aiimin:consent-reopen', reopen);
    }, []);

    useEffect(() => {
        if (!needed || engaged) return undefined;
        const engage = () => setEngaged(true);
        // Some pages scroll inside their own container, so listen in the capture phase.
        const onScroll = (e) => {
            const y = e.target === document ? window.scrollY : e.target?.scrollTop || 0;
            if (y > ENGAGE_SCROLL_PX) engage();
        };
        const t = setTimeout(engage, ENGAGE_DELAY_MS);
        document.addEventListener('scroll', onScroll, { passive: true, capture: true });
        return () => {
            clearTimeout(t);
            document.removeEventListener('scroll', onScroll, { capture: true });
        };
    }, [needed, engaged]);

    const showing = usePopupSlot('consent', {
        priority: POPUP_PRIORITY.consent,
        want: needed && engaged && !isExempt,
    });

    const decide = (analytics) => {
        writeConsent(analytics, LEGAL.consentVersion);
        setNeeded(false);
    };

    if (!showing) return null;

    return (
        <div
            role="region"
            aria-label="Analytics choice"
            className="aiimin-consent"
            style={{ animation: reducedMotion ? 'none' : 'aiimin-consent-rise 180ms ease-out' }}
        >
            <style>{`
                @keyframes aiimin-consent-rise{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}
                .aiimin-consent{position:fixed;left:16px;bottom:16px;z-index:9990;max-width:400px;
                  display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 14px;
                  background:var(--color-elevated,#1a1a1a);color:var(--color-text-1,#f5f5f5);
                  border:1px solid var(--color-border,#3d3d3d);border-radius:12px;
                  box-shadow:0 6px 20px rgba(0,0,0,.18);font-size:13px;line-height:1.45}
                .aiimin-consent p{margin:0;flex:1 1 220px;color:var(--color-text-2,#b5b5b5)}
                .aiimin-consent a{color:inherit;text-decoration:underline;text-underline-offset:2px}
                .aiimin-consent .row{display:flex;gap:8px}
                .aiimin-consent button{min-height:40px;padding:0 14px;border-radius:9px;font:inherit;
                  font-weight:700;cursor:pointer;border:1px solid var(--color-border,#4b5563);
                  background:transparent;color:var(--color-text-1,#f5f5f5)}
                .aiimin-consent button.yes{background:var(--color-text-1,#f5f5f5);
                  color:var(--color-base,#0a0a0a);border-color:transparent}
                @media (max-width:640px){.aiimin-consent{left:12px;right:12px;bottom:12px;max-width:none}}
            `}</style>
            <p>
                Allow anonymous usage stats to help improve AIIMIN? Off unless you say yes.{' '}
                <Link to="/cookies">Details</Link>
            </p>
            <div className="row">
                <button type="button" onClick={() => decide(false)}>No thanks</button>
                <button type="button" className="yes" onClick={() => decide(true)}>Allow</button>
            </div>
        </div>
    );
}
