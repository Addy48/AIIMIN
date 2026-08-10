import React from 'react';

const CORR_COLORS = ['#ff6b35', '#10b981', '#3b82f6', '#8b5cf6', '#eab308', '#6366f1'];

/**
 * CausalNodeAnalysis — real Spearman correlations (from intelligence layer).
 */
const CausalNodeAnalysis = ({ correlations = [], logs = [] }) => {
    const items = (correlations || [])
        .filter((c) => Math.abs(c.rho || c.strength || 0) >= 0.25)
        .slice(0, 6)
        .map((c, i) => ({
            cause: c.signalALabel || String(c.signalA || '').replace(/_/g, ' '),
            effect: c.signalBLabel || String(c.signalB || '').replace(/_/g, ' '),
            strength: Math.abs(c.rho ?? c.strength ?? 0),
            color: CORR_COLORS[i % CORR_COLORS.length],
            headline: c.headline,
        }));

    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
                Signal Correlations
            </div>
            {logs.length < 7 || items.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>
                    Need 7+ days of data to show correlations.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {items.map((c) => (
                        <div key={`${c.cause}-${c.effect}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
                                        <span style={{ fontWeight: 700 }}>{c.cause}</span> → {c.effect}
                                    </span>
                                    <span style={{ fontSize: '11px', color: c.color, fontWeight: 700 }}>
                                        ρ={c.strength.toFixed(2)}
                                    </span>
                                </div>
                                {c.headline && (
                                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>{c.headline}</div>
                                )}
                                <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: `${c.strength * 100}%`, height: '100%', background: c.color, borderRadius: '2px' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CausalNodeAnalysis;
