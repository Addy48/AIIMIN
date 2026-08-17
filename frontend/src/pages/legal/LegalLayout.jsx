import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const SITE_ORIGIN = 'https://aiimin.in';

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

export const LegalList = ({ items, ordered = false }) => {
    const Tag = ordered ? 'ol' : 'ul';
    return (
        <Tag style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index} style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7 }}>
                    {item}
                </li>
            ))}
        </Tag>
    );
};

export const LegalTable = ({ head, rows, caption }) => (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '480px' }}>
            {caption && (
                <caption style={{ captionSide: 'top', textAlign: 'left', fontSize: '12px', color: 'var(--text-3)', padding: '10px 12px' }}>
                    {caption}
                </caption>
            )}
            <thead>
                <tr>
                    {head.map((cell) => (
                        <th
                            key={cell}
                            scope="col"
                            style={{
                                textAlign: 'left',
                                padding: '10px 12px',
                                borderBottom: '1px solid var(--border)',
                                color: 'var(--text-2)',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {cell}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td
                                // eslint-disable-next-line react/no-array-index-key
                                key={cellIndex}
                                style={{
                                    padding: '10px 12px',
                                    borderBottom: rowIndex === rows.length - 1 ? 'none' : '1px solid var(--border)',
                                    color: 'var(--text-2)',
                                    lineHeight: 1.6,
                                    verticalAlign: 'top',
                                }}
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const LegalLayout = ({ title, lastUpdated, description, canonicalPath, children }) => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '80px 20px 60px' }}>
            <Helmet>
                <title>{`${title} · AIIMIN`}</title>
                {description && <meta name="description" content={description} />}
                {canonicalPath && <link rel="canonical" href={`${SITE_ORIGIN}${canonicalPath}`} />}
                <meta name="robots" content="index,follow" />
            </Helmet>

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
                        <Link to="/legal" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none' }}>All legal documents →</Link>
                        <Link to="/" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none' }}>Back to Dashboard →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalLayout;
