import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const PrincipleCard = ({ icon, title, desc }) => (
    <div style={{
        background: 'var(--bg-card)', borderRadius: '16px', padding: '28px',
        border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'; }}
    >
        <div style={{ fontSize: '24px', marginBottom: '12px' }}>{icon}</div>
        <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-1)' }}>{title}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6 }}>{desc}</div>
    </div>
);

const CompetitorRow = ({ name, focus, privacy, behavioral, ritual }) => (
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
        <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '14px', color: 'var(--text-1)' }}>{name}</td>
        <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center', color: 'var(--text-2)' }}>{focus}</td>
        <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center', color: 'var(--text-2)' }}>{privacy}</td>
        <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center', color: 'var(--text-2)' }}>{behavioral}</td>
        <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center', color: 'var(--text-2)' }}>{ritual}</td>
    </tr>
);

const Brand = () => {
    const principles = [
        { icon: '🎯', title: 'Precision', desc: 'Every interaction is minimal and intentional. No feature bloat, no decorative elements.' },
        { icon: '🔁', title: 'Feedback Loops', desc: 'Every input produces visible output. Log → Score → Insight → Action → Log.' },
        { icon: '🧠', title: 'Behavioral Intelligence', desc: 'Surface patterns, not just data. Predict drift before it compounds.' },
        { icon: '🔒', title: 'Data Sovereignty', desc: 'Your data never leaves your control. Full export, full ownership, no harvesting.' },
        { icon: '⚡', title: 'Momentum Architecture', desc: 'Systems designed to compound consistency. Streaks, scores, and ritual reinforcement.' },
        { icon: '🌙', title: 'Deep Mode Philosophy', desc: 'When focus begins, everything else disappears. No sidebar, no notifications.' },
        { icon: '📊', title: 'Dimensional Analysis', desc: 'Correlate sleep, focus, mood, and spending into unified behavioral intelligence.' },
        { icon: '🏗️', title: 'Disciplined Growth', desc: 'Ship stable foundations first. Every feature must earn its place through user value.' },
        { icon: '🌊', title: 'Adaptive Interventions', desc: 'The system evolves with your behavior. It pushes when you have momentum and catches you when you drift.' },
    ];

    return (
        <div style={{
            minHeight: '100vh', backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-1)', padding: '80px 20px',
            fontFamily: '"Inter", sans-serif'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <Link to="/" style={{
                    color: 'var(--accent)', textDecoration: 'none', fontSize: '14px',
                    fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '60px'
                }}>
                    ← Back to Dashboard
                </Link>

                {/* Hero */}
                <header style={{ marginBottom: '80px' }}>
                    <Logo size={64} style={{ marginBottom: '24px' }} />
                    <h1 style={{
                        fontSize: '56px', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '24px',
                        backgroundImage: 'linear-gradient(135deg, #c27814, var(--accent))',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        AIIMIN: The Behavioral OS.
                    </h1>
                    <p style={{ fontSize: '20px', color: 'var(--text-2)', lineHeight: 1.6, fontWeight: 500, maxWidth: '600px' }}>
                        We are building the infrastructure for human momentum. Not a dashboard — a system that shapes behavior through intelligent feedback loops and ritual-based interaction design.
                    </p>
                </header>

                {/* Product Philosophy */}
                <section style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px', color: 'var(--text-1)' }}>Product Philosophy</h2>
                    <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '16px' }}>
                        AIIMIN operates on a simple thesis: <strong>consistency is the only metric that matters</strong>.
                        Revenue, health, focus — all downstream effects of behavioral consistency.
                        We don't optimize for engagement. We optimize for momentum.
                    </p>
                    <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8 }}>
                        Every surface in AIIMIN is designed to either <em>reinforce a loop</em> or <em>surface an insight</em>.
                        If it does neither, it gets removed.
                    </p>
                </section>

                {/* Design Principles */}
                <section style={{ marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '28px', color: 'var(--text-1)' }}>Design Principles</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {principles.map((p, i) => <PrincipleCard key={i} {...p} />)}
                    </div>
                </section>

                {/* Positioning */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '80px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: 'var(--text-1)' }}>Current Scope</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.7 }}>
                            Behavior-tracking OS: focus sessions, streak management, mood journaling,
                            financial tracking, commitment engine, and weekly intelligence reports.
                            Integrates with Google Calendar and YouTube for contextual awareness.
                        </p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: 'var(--text-1)' }}>Future Direction</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.7 }}>
                            Proactive behavioral drift detection. Predict setbacks before they happen.
                            Contextual interventions based on unique biometric and activity signatures.
                            Cross-device ritual sync and offline-first architecture.
                        </p>
                    </div>
                </div>

                {/* Competitive Landscape */}
                <section style={{
                    padding: '40px', background: 'var(--bg-card)', borderRadius: '24px',
                    border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    marginBottom: '60px', overflowX: 'auto',
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-1)' }}>Competitive Landscape</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)' }}>Product</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)' }}>Focus</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)' }}>Privacy</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)' }}>Behavioral</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)' }}>Ritual</th>
                            </tr>
                        </thead>
                        <tbody>
                            <CompetitorRow name="AIIMIN" focus="✅ Deep" privacy="✅ Full" behavioral="✅ Loops" ritual="✅ Native" />
                            <CompetitorRow name="Notion" focus="❌" privacy="⚠️ Cloud" behavioral="❌" ritual="❌" />
                            <CompetitorRow name="Forest" focus="✅ Timer" privacy="✅" behavioral="❌" ritual="⚠️ Gamified" />
                            <CompetitorRow name="Daylio" focus="❌" privacy="⚠️" behavioral="⚠️ Mood" ritual="❌" />
                            <CompetitorRow name="Habitica" focus="❌" privacy="⚠️" behavioral="⚠️ Habits" ritual="⚠️ Game" />
                        </tbody>
                    </table>
                </section>

                {/* Architecture Overview */}
                <section style={{
                    padding: '40px', background: 'var(--bg-card)', borderRadius: '24px',
                    border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    marginBottom: '80px',
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-1)' }}>Architecture</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {[
                            { layer: 'Frontend', tech: 'React + CSS Variables', detail: 'Vercel' },
                            { layer: 'Backend', tech: 'Express + Node.js', detail: 'Railway' },
                            { layer: 'Database', tech: 'Supabase (Postgres)', detail: 'RLS + Auth' },
                        ].map((s, i) => (
                            <div key={i} style={{ padding: '20px', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: '8px' }}>{s.layer}</div>
                                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-1)' }}>{s.tech}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{s.detail}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer style={{ marginTop: '100px', borderTop: '1px solid var(--border)', paddingTop: '40px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        AIIMIN Behavioral OS · 2026
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Brand;
