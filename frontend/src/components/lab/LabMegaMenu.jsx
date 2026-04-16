import React from 'react';
import { NavLink } from 'react-router-dom';

export default function LabMegaMenu({ summary, onClose }) {
    const p = summary?.practice || {};
    const intel = summary?.intel || {};

    return (
        <div style={{
            position: 'absolute', top: 'calc(var(--nav-height) - 10px)', left: '50%',
            transform: 'translateX(-50%)', width: '400px',
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--r-md)', boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            padding: 'var(--space-4)', zIndex: 1001,
            animation: 'fadeInSlideDown 0.2s ease-out',
        }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                {/* Practice Overview */}
                <div>
                    <div style={{ font: 'var(--text-label)', color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>PRACTICE</div>
                    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                        <div style={{ font: '400 12px var(--font-sans)', color: 'var(--color-text-2)' }}>
                            Typing: <span style={{ color: 'var(--color-text-1)' }}>{p.typing?.weekly_best_wpm || 0} WPM</span>
                        </div>
                        <div style={{ font: '400 12px var(--font-sans)', color: 'var(--color-text-2)' }}>
                            Reaction: <span style={{ color: 'var(--color-text-1)' }}>{p.reaction?.mean_ms_last3 || '—'} MS</span>
                        </div>
                    </div>
                </div>

                {/* Intel Overview */}
                <div>
                    <div style={{ font: 'var(--text-label)', color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>INTEL</div>
                    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                        <div style={{ font: '400 12px var(--font-sans)', color: 'var(--color-text-2)' }}>
                            Insights: <span style={{ color: 'var(--color-text-1)' }}>{intel.insights?.unread_count || 0} unread</span>
                        </div>
                        <div style={{ font: '400 12px var(--font-sans)', color: 'var(--color-text-2)' }}>
                            Mindset: <span style={{ color: 'var(--color-text-1)' }}>{intel.mindset_state?.state || '—'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
                <NavLink to="/lab" onClick={onClose} style={{
                    display: 'block', textAlign: 'center', padding: 'var(--space-2)',
                    background: 'var(--color-elevated)', borderRadius: 'var(--r-sm)',
                    color: 'var(--color-text-1)', textDecoration: 'none', font: '500 12px var(--font-sans)',
                }}>
                    Open Full Lab →
                </NavLink>
            </div>
        </div>
    );
}
