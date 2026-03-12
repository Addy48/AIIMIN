/**
 * components/commitment/CommitmentCard.jsx
 *
 * Left sidebar card showing today's commitment targets with live fulfillment.
 * Circular ring shows met/total count.
 */
import React, { useState } from 'react';

const METRIC_LABELS = {
    sleep_hours: 'Sleep',
    gym_done: 'Gym',
    steps: 'Steps',
    focus_cycles: 'Focus cycles',
    protein_grams: 'Protein',
    mood_before: 'Mood',
    energy_level: 'Energy',
    learning_done: 'Learning',
};

const CommitmentRing = ({ met, total }) => {
    if (!total) return null;
    const pct = total > 0 ? met / total : 0;
    const radius = 24;
    const circ = 2 * Math.PI * radius;
    const strokeDash = pct * circ;
    const color = pct >= 0.8 ? '#22c55e' : pct >= 0.5 ? '#f5a623' : '#ef4444';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r={radius} fill="none" stroke="var(--border)" strokeWidth="4" />
                <circle
                    cx="30" cy="30" r={radius} fill="none"
                    stroke={color} strokeWidth="4"
                    strokeDasharray={`${strokeDash} ${circ}`}
                    strokeLinecap="round"
                    transform="rotate(-90 30 30)"
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
                <text x="30" y="34" textAnchor="middle" fill={color} fontSize="11" fontWeight="800">
                    {met}/{total}
                </text>
            </svg>
            <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>
                    {Math.round(pct * 100)}%
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>Fulfillment</div>
            </div>
        </div>
    );
};

const CommitmentCard = ({ commitment, loading }) => {
    if (loading) {
        return (
            <div style={{ padding: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px' }}>
                <div style={{ height: '60px', background: 'var(--bg-elevated)', borderRadius: '8px', marginBottom: '10px' }} />
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ height: '28px', background: 'var(--bg-elevated)', borderRadius: '6px', marginBottom: '6px' }} />
                ))}
            </div>
        );
    }

    if (!commitment || !commitment.targets || commitment.targets.length === 0) {
        return (
            <div style={{ padding: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                    Today's Commitment
                </div>
                <div style={{ padding: '16px 0', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>🎯</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', lineHeight: 1.5 }}>
                        No targets set. Set them in Settings → Commitments.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Today's Commitment
            </div>

            <CommitmentRing met={commitment.met_count || 0} total={commitment.total_count || 0} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {commitment.targets.map((t, i) => {
                    const met = t.met === true;
                    return (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '6px 8px', borderRadius: '7px',
                            background: met ? 'rgba(34,197,94,0.07)' : 'var(--bg-elevated)',
                            border: `1px solid ${met ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
                            transition: 'all 0.2s',
                        }}>
                            <div style={{
                                width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0,
                                background: met ? '#22c55e' : 'var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {met && <span style={{ color: 'white', fontSize: '8px', fontWeight: 800 }}>✓</span>}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '11px', fontWeight: 600, color: met ? 'var(--text-1)' : 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {METRIC_LABELS[t.metric] || t.metric}
                                </div>
                                {t.actual !== undefined && (
                                    <div style={{ fontSize: '9px', color: 'var(--text-3)', fontWeight: 500 }}>
                                        {String(t.actual)} / {String(t.target)} {t.unit || ''}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CommitmentCard;
