import React, { useState, useEffect } from 'react';
import { apiGet } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

const WeeklyLifeReview = ({ reviewOverride = null }) => {
    const { session } = useAuth();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(!reviewOverride);

    useEffect(() => {
        if (reviewOverride) {
            setReview(reviewOverride);
            setLoading(false);
        }
    }, [reviewOverride]);

    useEffect(() => {
        if (reviewOverride) return;
        const fetchReview = async () => {
            try {
                const data = await apiGet('/intelligence/weekly-review', { session });
                if (data.diagnosis) {
                    setReview(data);
                }
            } catch (err) {
                console.error('Failed to fetch weekly review:', err);
            } finally {
                setLoading(false);
            }
        };
        if (session) fetchReview();
    }, [reviewOverride, session]);

    if (loading) return (
        <div className="glass-panel" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="skeleton-text" style={{ width: '60%' }}>Analyzing system dynamics...</div>
        </div>
    );

    if (!review) return null;

    return (
        <div className="glass-panel-gold" style={{ padding: '28px', borderRadius: 'var(--r-lg)', position: 'relative', overflow: 'hidden' }}>
            {/* AI Core Pulse Decorator */}
            <div style={{
                position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px',
                background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)',
                opacity: 0.4, zIndex: 0
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>
                        System Intelligence
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
                        Weekly Life Review
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase' }}>Current Phase</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>Active Diagnostic</div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
                {review.diagnosis.map((d, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{
                            marginTop: '6px', width: '6px', height: '6px', borderRadius: '50%',
                            background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)'
                        }} />
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.5, flex: 1 }}>
                            {d}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px',
                borderTop: '1px solid var(--border-glass)', paddingTop: '24px', position: 'relative', zIndex: 1
            }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-3)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Recovery</div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--success)' }}>{review.currentWeek.avgSleep.toFixed(1)}h</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-2)', marginTop: '2px' }}>
                        {review.currentWeek.avgSleep > review.previousWeek.avgSleep ? '↑' : '↓'}
                        {Math.abs(review.currentWeek.avgSleep - review.previousWeek.avgSleep).toFixed(1)}h vs LW
                    </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-3)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Cognitive</div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--accent)' }}>{review.currentWeek.avgFocus.toFixed(1)}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-2)', marginTop: '2px' }}>Cycles / Day</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-3)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Movement</div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--gold)' }}>{(review.currentWeek.avgSteps / 1000).toFixed(1)}k</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-2)', marginTop: '2px' }}>Steps / Day</div>
                </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '11px', borderRadius: '8px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                    View Full 12-Page Report
                </button>
                <button style={{ padding: '8px 16px', fontSize: '11px', borderRadius: '8px', background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)', fontWeight: 700, cursor: 'pointer' }}>
                    Dismiss
                </button>
            </div>
        </div>
    );
};

export default WeeklyLifeReview;
