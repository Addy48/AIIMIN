import React from 'react';
import { Link } from 'react-router-dom';
import Shell, { Meta } from '../../site/Shell';

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

const LegalLayout = ({ title, lastUpdated, description, canonicalPath, children }) => (
    <Shell>
        <Meta
            title={`${title} · AIIMIN`}
            description={description || `${title} for AIIMIN, the Android app for your day, your money and your family's papers.`}
            path={canonicalPath || '/legal'}
        />
        <article className="s-wrap s-legal">
            <h1>{title}</h1>
            {lastUpdated && <p className="s-legal__meta">Last updated {lastUpdated}</p>}
            <div className="s-legal__body">{children}</div>
            <div className="s-legal__more">
                <Link className="s-btn s-btn--sm s-btn--ghost" to="/legal">All legal pages</Link>
                <Link className="s-btn s-btn--sm s-btn--ghost" to="/contact">Contact us</Link>
                <Link className="s-btn s-btn--sm" to="/waitlist">Back to AIIMIN</Link>
            </div>
        </article>
    </Shell>
);

export default LegalLayout;
