import React from 'react';
import { useNavigate } from 'react-router-dom';

const SystemBottleneckCard = ({ scores = null, drift = [] }) => {
    const navigate = useNavigate();

    if (!scores) return null;

    let weakest = 'emotional';
    let minScore = 100;

    const names = { physical: 'Physical Capacity', cognitive: 'Cognitive Load', discipline: 'Behavioral Consistency', financial: 'Financial Health', emotional: 'Emotional Stability' };

    for (const [k, v] of Object.entries(scores)) {
        if (v < minScore) {
            minScore = v;
            weakest = k;
        }
    }

    const severeDrift = drift.filter(d => ['severe', 'critical'].includes(d.severity));
    const title = severeDrift.length > 0 ? "System Drift Detected" : "System Bottleneck Detected";
    const highlightColor = severeDrift.length > 0 ? "var(--danger)" : "var(--gold)";
    const bgDim = severeDrift.length > 0 ? "var(--danger-dim)" : "rgba(212,175,55,0.05)";
    const borderDim = severeDrift.length > 0 ? "rgba(255,68,102,0.2)" : "rgba(212,175,55,0.2)";

    return (
        <div style={{
            background: bgDim, border: `1px solid ${borderDim}`,
            borderRadius: 'var(--r-lg)', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: borderDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    {severeDrift.length > 0 ? '🚨' : '⚠️'}
                </div>
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: highlightColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)', marginTop: '2px' }}>
                        {severeDrift.length > 0 ? (
                            <span><span style={{ color: 'var(--danger)' }}>{severeDrift[0].metric.replace('_', ' ')}</span> is dropping rapidly ({severeDrift[0].drift})</span>
                        ) : (
                            <span>Weakest System: <span style={{ color: 'var(--gold)' }}>{names[weakest]} ({minScore})</span></span>
                        )}
                    </div>
                </div>
            </div>
            <button onClick={() => navigate('/insights')} style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--bg-card)', border: `1px solid ${highlightColor}`, color: highlightColor, fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                View Diagnostics →
            </button>
        </div>
    );
}

export default SystemBottleneckCard;
