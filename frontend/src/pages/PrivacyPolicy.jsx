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

const PrivacyPolicy = () => {
    const lastUpdated = 'March 2, 2026';

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '80px 20px 60px' }}>
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>

                {/* Back */}
                <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', marginBottom: '32px' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                >
                    ← AIIMIN
                </a>

                {/* Header */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>
                        Legal
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.5px', margin: '0 0 10px' }}>
                        Privacy Policy
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: 0 }}>
                        Last updated {lastUpdated}
                    </p>
                </div>

                <Section title="Overview">
                    <Para>
                        AIIMIN ("we", "us", "our") is a personal productivity operating system. This Privacy Policy explains what data we collect, how we use it, and your rights as a user. We are committed to being direct and clear about our data practices.
                    </Para>
                    <Para>
                        By using AIIMIN, you agree to the collection and use of information in accordance with this policy.
                    </Para>
                </Section>

                <Section title="What We Collect">
                    <Para><strong style={{ color: 'var(--text-1)' }}>Account Data:</strong> Email address and name when you sign up or log in with Google. This is necessary to create and identify your account.</Para>
                    <Para><strong style={{ color: 'var(--text-1)' }}>Log Data:</strong> Daily logs, mood entries, focus session data, habit tracking, and notes you voluntarily input. This is the core functional data.</Para>
                    <Para><strong style={{ color: 'var(--text-1)' }}>Google Integration Data:</strong> If you connect Google Calendar, we read your calendar events (read-only) to display them in the dashboard. We do not modify or store your calendar data on our servers. If you connect YouTube, we access only your playlist list for playback. We never access your watch history or personal YouTube activity.</Para>
                    <Para><strong style={{ color: 'var(--text-1)' }}>Usage Data:</strong> Basic anonymous analytics (page visits, feature usage). No personally identifiable information is attached to analytics events.</Para>
                </Section>

                <Section title="How We Use Your Data">
                    <Para>— To provide and operate the AIIMIN dashboard</Para>
                    <Para>— To generate behavioral insights and summaries based solely on your own log data</Para>
                    <Para>— To remember your preferences and settings across sessions</Para>
                    <Para>— To improve the product (anonymous, aggregated analytics only)</Para>
                    <Para>We do <strong style={{ color: 'var(--text-1)' }}>not</strong> sell your data. We do <strong style={{ color: 'var(--text-1)' }}>not</strong> use your private logs for advertising. We do <strong style={{ color: 'var(--text-1)' }}>not</strong> share your data with third parties except as described below.</Para>
                </Section>

                <Section title="Third-Party Services">
                    <Para><strong style={{ color: 'var(--text-1)' }}>Supabase:</strong> Provides our authentication and database infrastructure. Your data is stored on Supabase's servers. Supabase is SOC 2 compliant.</Para>
                    <Para><strong style={{ color: 'var(--text-1)' }}>Google APIs:</strong> Calendar (read-only) and YouTube (playlist read-only) are accessed only upon your explicit authorization. Google's own privacy policy governs their data handling.</Para>
                </Section>

                <Section title="Data Retention">
                    <Para>Your data is retained for as long as your account is active. You may request deletion at any time from the Settings → Data & Privacy section, or by contacting us. Deletion is permanent and irreversible.</Para>
                </Section>

                <Section title="Your Rights (GDPR)">
                    <Para>If you are located in the European Economic Area, you have the right to: access the data we hold about you, correct inaccurate data, request deletion of your data, object to or restrict processing, and data portability.</Para>
                    <Para>To exercise these rights, use Settings → Export Your Data, or contact us at the address below.</Para>
                </Section>

                <Section title="Cookies">
                    <Para>AIIMIN uses only functional cookies (authentication session tokens). We do not use tracking, advertising, or third-party cookies. No cookie consent banner is required as all cookies are strictly necessary for the service to function.</Para>
                </Section>

                <Section title="Security">
                    <Para>Data is transmitted over HTTPS. Authentication tokens are encrypted. Google OAuth tokens are stored server-side and are never exposed to the browser. We conduct periodic security reviews.</Para>
                </Section>

                <Section title="Contact">
                    <Para>For any privacy-related questions or to exercise your rights: <strong style={{ color: 'var(--text-1)' }}>privacy@aiimin.app</strong></Para>
                </Section>

                <div style={{ padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <a href="/terms" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>Terms of Service →</a>
                        <a href="/" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none' }}>Back to Dashboard →</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
