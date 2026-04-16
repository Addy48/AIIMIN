import React from 'react';

export default function LabOnboarding({ onDismiss }) {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 'var(--space-4)',
        }}>
            <div style={{
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--r-md)', maxWidth: '500px', width: '100%',
                padding: 'var(--space-6)', color: 'var(--color-text-1)',
            }}>
                <h2 style={{ font: 'var(--text-h2)', marginBottom: 'var(--space-3)' }}>Welcome to The Lab</h2>
                <p style={{ font: 'var(--text-body)', color: 'var(--color-text-2)', marginBottom: 'var(--space-4)' }}>
                    This is your behavior-shaping engine. It operates on three pillars:
                </p>

                <div style={{ display: 'grid', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: '20px' }}>🎯</span>
                        <div>
                            <div style={{ font: '500 14px var(--font-sans)' }}>Practice</div>
                            <div style={{ font: 'var(--text-subtext)', color: 'var(--color-text-3)' }}>Timed benchmarks for cognitive and motor precision.</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: '20px' }}>🔍</span>
                        <div>
                            <div style={{ font: '500 14px var(--font-sans)' }}>Intel</div>
                            <div style={{ font: 'var(--text-subtext)', color: 'var(--color-text-3)' }}>Algorithmic pattern detection and daily mindset tracking.</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: '20px' }}>⚖️</span>
                        <div>
                            <div style={{ font: '500 14px var(--font-sans)' }}>Audit</div>
                            <div style={{ font: 'var(--text-subtext)', color: 'var(--color-text-3)' }}>Quarterly inventory of your underlying belief systems.</div>
                        </div>
                    </div>
                </div>

                <button onClick={onDismiss} className="lab-retry-btn" style={{ width: '100%' }}>
                    Initiate Access
                </button>
            </div>
        </div>
    );
}
