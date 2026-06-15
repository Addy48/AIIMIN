import React from 'react';
import { Link } from 'react-router-dom';

const Brand = () => {
    const styles = {
        page: {
            minHeight: '100vh',
            backgroundColor: '#0a0a0f',
            color: '#fff',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        hero: {
            background: 'linear-gradient(135deg, #0a0a0f 0%, #111128 50%, #0a0a0f 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '80px 24px 64px',
            textAlign: 'center',
        },
        logo: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '40px',
        },
        logoMark: {
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-0.5px',
        },
        logoText: {
            fontSize: '28px',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-1px',
        },
        heroTitle: {
            fontSize: '48px',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            margin: '0 0 16px',
            background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
        },
        heroSubtitle: {
            fontSize: '18px',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '560px',
            margin: '0 auto 32px',
            lineHeight: 1.6,
        },
        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '100px',
            padding: '6px 16px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#a5b4fc',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
        },
        container: {
            maxWidth: '960px',
            margin: '0 auto',
            padding: '0 24px',
        },
        section: {
            padding: '64px 0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
        },
        sectionTitle: {
            fontSize: '11px',
            fontWeight: 800,
            color: '#6366f1',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: '12px',
        },
        sectionHeading: {
            fontSize: '28px',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-0.5px',
            marginBottom: '16px',
        },
        sectionText: {
            fontSize: '15px',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.8,
            maxWidth: '680px',
            margin: '0 0 24px',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            marginTop: '24px',
        },
        card: {
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: '24px',
        },
        cardTitle: {
            fontSize: '15px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '8px',
        },
        cardText: {
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7,
        },
        colorRow: {
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginTop: '24px',
        },
        colorChip: (bg, border) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
        }),
        colorSwatch: (bg) => ({
            width: '80px',
            height: '80px',
            borderRadius: '14px',
            background: bg,
            border: '1px solid rgba(255,255,255,0.1)',
        }),
        colorLabel: {
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
        },
        colorValue: {
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'monospace',
        },
        complianceGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '12px',
            marginTop: '24px',
        },
        complianceItem: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '12px',
            padding: '16px',
        },
        checkIcon: {
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(99,102,241,0.2)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            color: '#a5b4fc',
            fontWeight: 900,
        },
        complianceText: {
            fontSize: '13px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5,
        },
        linkRow: {
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            marginTop: '24px',
        },
        link: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.15s',
        },
        primaryLink: {
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc',
        },
        ghostLink: {
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
        },
        footer: {
            padding: '40px 24px',
            textAlign: 'center',
        },
        footerText: {
            fontSize: '13px',
            color: 'rgba(255,255,255,0.2)',
        },
        logoLarge: {
            width: '120px',
            height: '120px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-1px',
            margin: '0 auto 20px',
            boxShadow: '0 20px 60px rgba(99,102,241,0.35)',
        },
        logoVariants: {
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            marginTop: '24px',
        },
        logoVariant: (bg) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '28px',
            borderRadius: '16px',
            background: bg,
            border: '1px solid rgba(255,255,255,0.06)',
            flex: '1',
            minWidth: '140px',
        }),
        variantLabel: {
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
        },
    };

    const complianceItems = [
        'Google API Limited Use Policy compliant',
        'Read-only calendar and YouTube access',
        'No data sold to third parties',
        'No advertising or tracking cookies',
        'OAuth tokens encrypted at rest',
        'User data deletion on request',
        'HTTPS end-to-end encryption',
        'Revoke access anytime from Google',
    ];

    const brandColors = [
        { label: 'Primary', value: '#6366F1', bg: '#6366F1' },
        { label: 'Accent', value: '#8B5CF6', bg: '#8B5CF6' },
        { label: 'Background', value: '#0A0A0F', bg: '#0A0A0F' },
        { label: 'Surface', value: '#111128', bg: '#111128' },
        { label: 'White', value: '#FFFFFF', bg: '#FFFFFF' },
        { label: 'Muted', value: '#A5B4FC', bg: '#A5B4FC' },
    ];

    return (
        <div style={styles.page}>
            {/* Hero */}
            <div style={styles.hero}>
                <div style={styles.container}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
                        <div style={styles.logoLarge}>AI</div>
                    </div>
                    <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '24px' }}>
                        <span style={styles.badge}>● Personal OS</span>
                    </div>
                    <h1 style={styles.heroTitle}>AIIMIN Brand</h1>
                    <p style={styles.heroSubtitle}>
                        Brand identity, guidelines, and compliance information for AIIMIN — a personal productivity and life operating system.
                    </p>
                    <div style={styles.linkRow}>
                        <Link to="/privacy" style={{ ...styles.link, ...styles.primaryLink }}>Privacy Policy →</Link>
                        <Link to="/terms" style={{ ...styles.link, ...styles.ghostLink }}>Terms of Service →</Link>
                        <Link to="/data-deletion" style={{ ...styles.link, ...styles.ghostLink }}>Data Deletion →</Link>
                    </div>
                </div>
            </div>

            <div style={styles.container}>
                {/* About the App */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>About</div>
                    <h2 style={styles.sectionHeading}>What is AIIMIN?</h2>
                    <p style={styles.sectionText}>
                        AIIMIN (pronounced "I am in") is a personal life operating system — a private productivity dashboard designed to centralize daily habits, goal tracking, journal entries, focus sessions, calendar management, and personal analytics in one powerful interface.
                    </p>
                    <p style={styles.sectionText}>
                        Built and maintained by a single developer for their own use, AIIMIN is not a commercial SaaS platform. It is a deeply personal tool designed to replace scattered apps and notebooks with a single, private, intelligent system.
                    </p>
                    <div style={styles.grid}>
                        {[
                            { title: 'Personal OS', text: 'A single dashboard to manage your entire life — habits, goals, finance, focus, and more.' },
                            { title: 'Privacy First', text: 'No ads, no tracking pixels, no third-party analytics. Your data is yours alone.' },
                            { title: 'Google Integrations', text: 'Read-only Google Calendar and YouTube access to display your data inside your dashboard.' },
                            { title: 'AI-Powered', text: 'Smart insights, ATS resume analysis, and intelligent summaries powered by AI.' },
                        ].map(item => (
                            <div key={item.title} style={styles.card}>
                                <div style={styles.cardTitle}>{item.title}</div>
                                <div style={styles.cardText}>{item.text}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logo */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Logo</div>
                    <h2 style={styles.sectionHeading}>Logo & Identity</h2>
                    <p style={styles.sectionText}>
                        The AIIMIN wordmark uses a bold, geometric sans-serif typeface. The logomark is a rounded square containing the letters "AI" — representing artificial intelligence and the user's identity.
                    </p>
                    <div style={styles.logoVariants}>
                        <div style={styles.logoVariant('rgba(255,255,255,0.03)')}>
                            <div style={{ ...styles.logoLarge, margin: 0, width: '72px', height: '72px', fontSize: '26px', borderRadius: '18px' }}>AI</div>
                            <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>AIIMIN</div>
                            <div style={styles.variantLabel}>Dark Background</div>
                        </div>
                        <div style={styles.logoVariant('#fff')}>
                            <div style={{ ...styles.logoLarge, margin: 0, width: '72px', height: '72px', fontSize: '26px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(99,102,241,0.25)' }}>AI</div>
                            <div style={{ fontSize: '20px', fontWeight: 900, color: '#111', letterSpacing: '-0.5px' }}>AIIMIN</div>
                            <div style={{ ...styles.variantLabel, color: 'rgba(0,0,0,0.35)' }}>Light Background</div>
                        </div>
                        <div style={styles.logoVariant('linear-gradient(135deg, #6366f1, #8b5cf6)')}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', border: '2px solid rgba(255,255,255,0.3)' }}>AI</div>
                            <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>AIIMIN</div>
                            <div style={{ ...styles.variantLabel, color: 'rgba(255,255,255,0.5)' }}>Brand Gradient</div>
                        </div>
                    </div>
                </div>

                {/* Colors */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Visual Identity</div>
                    <h2 style={styles.sectionHeading}>Brand Colors</h2>
                    <p style={styles.sectionText}>
                        AIIMIN uses a dark-first design system with a signature indigo-violet gradient as the primary brand accent.
                    </p>
                    <div style={styles.colorRow}>
                        {brandColors.map(c => (
                            <div key={c.label} style={styles.colorChip()}>
                                <div style={styles.colorSwatch(c.bg)} />
                                <div style={styles.colorLabel}>{c.label}</div>
                                <div style={styles.colorValue}>{c.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Google Compliance */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Compliance</div>
                    <h2 style={styles.sectionHeading}>Google API Compliance</h2>
                    <p style={styles.sectionText}>
                        AIIMIN uses Google APIs (Calendar, YouTube) strictly to display the authenticated user's own data within their private dashboard. All use is read-only, and access is governed by the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#a5b4fc', textDecoration: 'none' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.
                    </p>
                    <div style={styles.complianceGrid}>
                        {complianceItems.map(item => (
                            <div key={item} style={styles.complianceItem}>
                                <div style={styles.checkIcon}>✓</div>
                                <div style={styles.complianceText}>{item}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ ...styles.linkRow, marginTop: '32px' }}>
                        <Link to="/privacy" style={{ ...styles.link, ...styles.primaryLink }}>Full Privacy Policy →</Link>
                        <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ ...styles.link, ...styles.ghostLink }}>Google API Policy →</a>
                    </div>
                </div>

                {/* Contact */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Contact</div>
                    <h2 style={styles.sectionHeading}>Get in Touch</h2>
                    <p style={styles.sectionText}>
                        For any questions about AIIMIN, its branding, privacy practices, or Google API usage, please reach out directly.
                    </p>
                    <div style={styles.grid}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}>Developer & Owner</div>
                            <div style={styles.cardText}>Hasmatullah Kumar<br />Solo developer and user of AIIMIN</div>
                        </div>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}>Email</div>
                            <div style={styles.cardText}>
                                <a href="mailto:you@example.com" style={{ color: '#a5b4fc', textDecoration: 'none' }}>you@example.com</a>
                            </div>
                        </div>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}>Application Domain</div>
                            <div style={styles.cardText}>
                                <a href="https://www.aiimin.in" style={{ color: '#a5b4fc', textDecoration: 'none' }}>www.aiimin.in</a>
                            </div>
                        </div>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}>Legal Documents</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                                {[
                                    ['/privacy', 'Privacy Policy'],
                                    ['/terms', 'Terms of Service'],
                                    ['/data-deletion', 'Data Deletion'],
                                    ['/security', 'Security'],
                                ].map(([to, label]) => (
                                    <Link key={to} to={to} style={{ color: '#a5b4fc', fontSize: '13px', textDecoration: 'none' }}>{label} →</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <div style={styles.container}>
                    <p style={styles.footerText}>
                        © {new Date().getFullYear()} AIIMIN. Built by Hasmatullah Kumar. Personal use only.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Brand;
