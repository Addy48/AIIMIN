/**
 * HabitsPage.jsx
 *
 * Main habits page with 3 subviews:
 *   1. Today's Routines (default) — execute routines, see progress
 *   2. Habit Library — browse/create/manage individual habits
 *   3. Streak Analytics — heatmap, completion %, streak data
 */
import React, { useState } from 'react';
import HabitsWidget from './HabitsWidget';
import HabitManager from './HabitManager';
import StreakAnalytics from './StreakAnalytics';
import WinsEngine from '../WinsEngine';
import useFeatureFlag from '../../hooks/useFeatureFlag';

const SUBTABS = [
    { key: 'routines', label: "Today's Routines", icon: '⚡' },
    { key: 'library',  label: 'Habit Library',    icon: '📚' },
    { key: 'streaks',  label: 'Streak Analytics',  icon: '📊' },
];

export default function HabitsPage({ user }) {
    const [activeSubtab, setActiveSubtab] = useState('routines');
    const showWinTracker = useFeatureFlag('win_tracker');

    return (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.02em' }}>
                        Habits &amp; Routines
                    </h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px', fontWeight: 500 }}>
                        Build systems, not goals.
                    </p>
                </div>
            </div>

            {/* Subtab bar */}
            <div style={{
                display: 'flex', gap: '4px',
                background: 'var(--bg-elevated)', borderRadius: '10px', padding: '4px',
            }}>
                {SUBTABS.map(({ key, label, icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveSubtab(key)}
                        style={{
                            flex: 1, padding: '8px 12px', borderRadius: '8px',
                            fontSize: '12px', fontWeight: activeSubtab === key ? 700 : 500,
                            border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                            background: activeSubtab === key ? 'var(--bg-card)' : 'transparent',
                            color: activeSubtab === key ? 'var(--text-1)' : 'var(--text-3)',
                            boxShadow: activeSubtab === key ? 'var(--shadow-sm)' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                    >
                        <span style={{ fontSize: '13px' }}>{icon}</span>
                        {label}
                    </button>
                ))}
            </div>

            {/* ── Today's Routines ── */}
            {activeSubtab === 'routines' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }} className="habits-grid">

                    {/* Left — Execute routines */}
                    <div style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--r-lg)', padding: 'var(--card-px)',
                    }}>
                        <SectionLabel>Your Routines</SectionLabel>
                        <HabitsWidget user={user} />
                    </div>

                    {/* Right — Wins */}
                    <div style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--r-lg)', padding: 'var(--card-px)',
                    }}>
                        <SectionLabel>Wins Log</SectionLabel>
                        {showWinTracker
                            ? <WinsEngine />
                            : <p style={{ fontSize: '12px', color: 'var(--text-3)', padding: '8px 0' }}>Enable Wins in feature flags.</p>
                        }
                    </div>
                </div>
            )}

            {/* ── Habit Library ── */}
            {activeSubtab === 'library' && (
                <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r-lg)', padding: 'var(--card-px)',
                }}>
                    <HabitManager user={user} />
                </div>
            )}

            {/* ── Streak Analytics ── */}
            {activeSubtab === 'streaks' && (
                <StreakAnalytics user={user} />
            )}

            <style>{`
                @media (max-width: 768px) {
                    .habits-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}

function SectionLabel({ children }) {
    return (
        <div style={{
            fontSize: '10px', fontWeight: 700, color: 'var(--text-3)',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px',
            display: 'flex', alignItems: 'center', gap: '10px',
        }}>
            {children}
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
    );
}
