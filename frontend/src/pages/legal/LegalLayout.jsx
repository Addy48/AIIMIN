import React from 'react';
import { Link } from 'react-router-dom';

export const LegalSection = ({ title, children }) => (
    <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
            {title}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {children}
        </div>
    </div>
);

export const LegalPara = ({ children }) => (
    <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
        {children}
    </p>
);

const LegalLayout = ({ title, lastUpdated, children }) => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '80px 20px 60px' }}>
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>

                {/* Back */}
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', marginBottom: '32px' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                >
                    ← AIIMIN
                </Link>

                {/* Header */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>
                        Compliance
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.5px', margin: '0 0 10px' }}>
                        {title}
                    </h1>
                    {lastUpdated && (
                        <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: 0 }}>
                            Last updated {lastUpdated}
                        </p>
                    )}
                </div>

                {children}

                <div style={{ padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <Link to="/" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none' }}>Back to Dashboard →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalLayout;
