import React from 'react';

const Section = ({ title, children }) => (
    <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
            {title}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {children}
        </div>
    </div>
);

const Para = ({ children }) => (
    <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
        {children}
    </p>
);

const TermsOfService = () => {
    const lastUpdated = 'March 2, 2026';

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '80px 20px 60px' }}>
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>

                <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', marginBottom: '32px' }}>
                    ← AIIMIN
                </a>

                <div style={{ marginBottom: '48px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>Legal</div>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.5px', margin: '0 0 10px' }}>
                        Terms of Service
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: 0 }}>Last updated {lastUpdated}</p>
                </div>

                <Section title="Agreement">
                    <Para>
                        By accessing or using AIIMIN ("the Service"), you agree to be bound by these Terms. If you do not agree, do not use the Service. These Terms apply to all users.
                    </Para>
                </Section>

                <Section title="Use of Service">
                    <Para>AIIMIN is a personal productivity tool for individual use. You may not:</Para>
                    <Para>— Use the Service for any unlawful purpose</Para>
                    <Para>— Attempt to access other users' data or accounts</Para>
                    <Para>— Reverse engineer, copy, or reproduce any part of the Service</Para>
                    <Para>— Use automated systems to access or scrape the Service</Para>
                    <Para>— Resell, sublicense, or commercialize the Service without written permission</Para>
                </Section>

                <Section title="Your Data">
                    <Para>
                        You retain full ownership of all content and data you input into AIIMIN. We do not claim ownership over your logs, notes, or any personal information. See our <a href="/privacy" style={{ color: 'var(--accent)', fontWeight: 600 }}>Privacy Policy</a> for full data details.
                    </Para>
                </Section>

                <Section title="Google Integration">
                    <Para>
                        AIIMIN integrates with Google Calendar and YouTube via OAuth 2.0. By connecting your Google account, you authorize AIIMIN to access specific data scopes (calendar read-only, YouTube playlist read-only) as described during the OAuth flow. You may revoke this access at any time from Settings or from your Google Account at <a href="https://myaccount.google.com/permissions" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>.
                    </Para>
                </Section>

                <Section title="Service Availability">
                    <Para>
                        We aim for high availability but do not guarantee uninterrupted access. The Service may be updated, modified, or temporarily unavailable for maintenance. We will not be liable for any data loss or disruption caused by outages.
                    </Para>
                </Section>

                <Section title="Account Termination">
                    <Para>
                        You may delete your account at any time from Settings → Data & Privacy. We reserve the right to suspend or terminate accounts that violate these Terms. Upon termination, your data will be permanently deleted within 30 days.
                    </Para>
                </Section>

                <Section title="Disclaimer of Warranties">
                    <Para>
                        The Service is provided "as is" without warranties of any kind. AIIMIN makes no warranties regarding accuracy, reliability, or fitness for a particular purpose. Use of behavioral insights is informational only and not medical, psychological, or professional advice.
                    </Para>
                </Section>

                <Section title="Limitation of Liability">
                    <Para>
                        To the maximum extent permitted by law, AIIMIN shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
                    </Para>
                </Section>

                <Section title="Changes to Terms">
                    <Para>
                        We may update these Terms from time to time. Significant changes will be communicated via email or in-app notice. Continued use of the Service after changes constitutes acceptance.
                    </Para>
                </Section>

                <Section title="Governing Law">
                    <Para>
                        These Terms are governed by the laws of India. Any disputes shall be resolved under the jurisdiction of competent courts.
                    </Para>
                </Section>

                <Section title="Contact">
                    <Para>For any questions about these Terms: <strong style={{ color: 'var(--text-1)' }}>legal@aiimin.app</strong></Para>
                </Section>

                <div style={{ padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <a href="/privacy" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy →</a>
                        <a href="/" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none' }}>Back to Dashboard →</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
