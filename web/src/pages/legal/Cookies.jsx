import React, { useEffect, useState } from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
    LegalTable as Table,
} from './LegalLayout';
import { LEGAL } from '../../constants/legal';
import { analyticsConfigured, clearConsent, readConsent } from '../../utils/consent';

const choiceLabel = () => {
    const record = readConsent();
    if (!record) return 'not chosen yet';
    return record.analytics ? 'analytics allowed' : 'analytics off';
};

const changeButton = {
    marginLeft: '4px',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid var(--color-border, #3d3d3d)',
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    fontWeight: 700,
    cursor: 'pointer',
};

const Cookies = () => {
    const [choice, setChoice] = useState(choiceLabel);
    useEffect(() => {
        const refresh = () => setChoice(choiceLabel());
        window.addEventListener('aiimin:consent-updated', refresh);
        window.addEventListener('aiimin:consent-reopen', refresh);
        return () => {
            window.removeEventListener('aiimin:consent-updated', refresh);
            window.removeEventListener('aiimin:consent-reopen', refresh);
        };
    }, []);

    return (
        <LegalLayout
            title="Cookie & Local Storage Policy"
            lastUpdated={LEGAL.effectiveDate}
            description="The complete list of cookies, local storage and app databases AIIMIN uses, which are strictly necessary, and which stay off until you consent."
            canonicalPath="/cookies"
        >
            <Section title="Overview">
                <Para>
                    Effective {LEGAL.effectiveDate}. AIIMIN uses very little. There is no advertising network, no
                    third-party tracking pixel, and no cross-site tracking anywhere on our website or in our app.
                </Para>
            </Section>

            <Section title="What we store, and why">
                <Table
                    caption="Cookies, local storage and app databases used by AIIMIN"
                    head={['Name / kind', 'Type', 'Purpose', 'Consent needed', 'Lifetime']}
                    rows={[
                        ['aiimin_session, better-auth.session_token', 'Cookie', 'Keep you signed in', 'No — strictly necessary', 'Session / 7 days'],
                        ['CSRF / state values used during sign-in', 'Cookie', 'Prevent request forgery and OAuth replay', 'No — strictly necessary', 'Minutes'],
                        ['Theme, font scale, density, navigation pins', 'Local storage', 'Remember how you like the interface', 'No — strictly necessary for your preference', 'Until you clear it'],
                        ['Offline queue and cached reads', 'IndexedDB / app database', 'Let you work offline and see your data quickly', 'No — strictly necessary', 'Until synced or cleared'],
                        ['aiimin_waitlist, referral code', 'Local / session storage', 'Remember that you joined the waitlist, and credit a referral', 'No', '90 days'],
                        ['Product analytics (Google Analytics 4)', 'Cookie + local storage', 'Understand which features are used, and where the product fails', <strong>Yes — off until you consent</strong>, 'Up to 14 months'],
                        ['Error reporting (Sentry)', 'Local storage', 'Diagnose crashes', <strong>Yes — off until you consent</strong>, 'Session'],
                    ]}
                />
            </Section>

            <Section title="Controls">
                <Para>
                    Analytics and error reporting stay off until you say yes, and you can change your mind at any time
                    here. Blocking strictly necessary cookies will stop sign-in from working. Your browser also lets you
                    clear everything we stored locally.
                </Para>
                <Para>
                    {analyticsConfigured() ? (
                        <>
                            Your current choice: <strong>{choice}</strong>.{' '}
                            <button type="button" onClick={clearConsent} style={changeButton}>
                                Change my choice
                            </button>
                        </>
                    ) : (
                        <>No optional analytics or error reporting run on this site right now, so there is nothing to choose.</>
                    )}
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default Cookies;
