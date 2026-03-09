import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const PrincipleCard = ({ icon, title, desc }) => (
    <div style={{
        background: 'var(--bg-card)', borderRadius: '24px', padding: '32px',
        border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column', gap: '16px',
        position: 'relative', overflow: 'hidden'
    }}
        title="AIIMIN Principle"
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'var(--text-3)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
        <div style={{ fontSize: '28px', background: 'var(--bg-elevated)', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', flexShrink: 0 }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{title}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.7, fontWeight: 500 }}>{desc}</div>
        </div>
    </div>
);

const SectionHeading = ({ pre, title, desc }) => (
    <div style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '800px', margin: '0 auto 60px' }}>
        <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '16px' }}>
            {pre}
        </div>
        <h2 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text-1)', margin: '0 0 20px 0' }}>
            {title}
        </h2>
        {desc && <p style={{ fontSize: '18px', color: 'var(--text-3)', lineHeight: 1.6, fontWeight: 500 }}>{desc}</p>}
    </div>
);

const Brand = () => {
    const principles = [
        { icon: '🎯', title: 'Absolute Precision', desc: 'Every interaction is minimal and intentional. No feature bloat, no decorative elements. Just extreme utility.' },
        { icon: '🔁', title: 'Feedback Loops', desc: 'Every input produces immediate, visible output. Log behavior → Score momentum → Extract insight → Take Action.' },
        { icon: '🧠', title: 'Behavioral Intelligence', desc: 'Surface deep, invisible patterns. We predict your mental drift before it compounds into regression.' },
        { icon: '🔒', title: 'Data Sovereignty', desc: 'Your behavioral archive never leaves your control. Full export capabilities, full ownership, zero harvesting.' },
        { icon: '⚡', title: 'Momentum Engineering', desc: 'Systems designed specifically to compound consistency through intelligent streaks, contextual scores, and ritual reinforcement.' },
        { icon: '🌙', title: 'Deep Mode State', desc: 'When intense focus begins, the noise disappears. No sidebar, no notifications. Just you and the work.' },
        { icon: '📊', title: 'Dimensional Analysis', desc: 'Correlate sleep cycles, deep focus hours, mood variance, and spending into one unified behavioral intelligence layer.' },
        { icon: '🏗️', title: 'Disciplined Growth', desc: 'We ship incredibly stable foundations first. Every feature must earn its place through validated user momentum generation.' },
        { icon: '🌊', title: 'Adaptive Interventions', desc: 'The system evolves alongside your habits. It pushes when you have high momentum and catches you when you inevitably drift.' },
    ];

    return (
        <div style={{
            minHeight: '100vh', backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-1)', padding: '60px 20px 120px',
            fontFamily: '"Inter", sans-serif',
            overflowX: 'hidden'
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <nav style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{
                        display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none',
                        color: 'var(--text-1)', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.02em'
                    }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-elevated)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)',
                            transition: 'all 0.2s ease', cursor: 'pointer'
                        }} className="back-btn">
                            ←
                        </div>
                        Back to Dashboard
                    </Link>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <a href="mailto:aaditya.upadhyay05@gmail.com" style={{ textDecoration: 'none', color: 'var(--text-2)', fontSize: '14px', fontWeight: 600 }}>Contact</a>
                        <Link to="/login" style={{ background: 'var(--text-1)', color: 'var(--bg-primary)', padding: '10px 20px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Enter System</Link>
                    </div>
                </nav>

                {/* Hero */}
                <header style={{ marginBottom: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Link to="/" style={{
                        padding: '16px', background: 'var(--bg-elevated)', borderRadius: '32px', marginBottom: '40px',
                        border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.08)',
                        display: 'block', textDecoration: 'none', cursor: 'pointer'
                    }}>
                        <Logo style={{ height: '120px', borderRadius: '28px', justifyContent: 'center' }} />
                    </Link>
                    <h1 style={{
                        fontSize: '72px', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.05, marginBottom: '24px',
                        color: 'var(--text-1)', maxWidth: '900px'
                    }}>
                        The Infrastructure For<br />
                        <span style={{
                            backgroundImage: 'linear-gradient(135deg, var(--accent), #c27814)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            Human Momentum.
                        </span>
                    </h1>
                    <p style={{ fontSize: '22px', color: 'var(--text-3)', lineHeight: 1.6, fontWeight: 500, maxWidth: '700px' }}>
                        Not just another dashboard. AIIMIN is a behavioral operating system that shapes reality through intelligent feedback loops, extreme privacy, and ritual-based design.
                    </p>
                </header>

                {/* The Problem / Solution */}
                <section style={{ marginBottom: '140px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '60px', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '16px' }}>The Core Problem</div>
                            <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text-1)', marginBottom: '24px', lineHeight: 1.1 }}>
                                Modern software optimizes for engagement. We optimize for intent.
                            </h2>
                            <p style={{ fontSize: '16px', color: 'var(--text-3)', lineHeight: 1.7, fontWeight: 500, marginBottom: '24px' }}>
                                The average professional loses 3.2 hours a day to context switching, low-friction entertainment, and interface traps.
                                Current productivity tools are passive—they hold data but don't shape behavior. They act as filing cabinets when what you actually need is an engine.
                            </p>
                            <p style={{ fontSize: '16px', color: 'var(--text-1)', lineHeight: 1.7, fontWeight: 700 }}>
                                AIIMIN flips the paradigm. Every pixel is designed to enforce constraints, visualize momentum, and eliminate friction between thought and action.
                            </p>
                        </div>
                        <div style={{ background: 'var(--bg-card)', borderRadius: '32px', padding: '40px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {[
                                    { metric: '90+', label: 'Minute Deep Sessions' },
                                    { metric: 'Zero', label: 'Algorithmic Distractions' },
                                    { metric: '100%', label: 'Private & Encrypted' }
                                ].map((stat, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: i !== 2 ? '24px' : '0', borderBottom: i !== 2 ? '1px solid var(--border)' : 'none' }}>
                                        <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--accent)', width: '100px' }}>{stat.metric}</div>
                                        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-1)' }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Design Principles Grid */}
                <section style={{ marginBottom: '140px' }}>
                    <SectionHeading
                        pre="Core Thesis"
                        title="Nine pillars of momentum."
                        desc="We don't follow standard UX conventions. We follow psychological principles. Every feature must pass the momentum test."
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                        {principles.map((p, i) => <PrincipleCard key={i} {...p} />)}
                    </div>
                </section>

                {/* Strategic Positioning */}
                <section style={{ marginBottom: '140px' }}>
                    <SectionHeading
                        pre="Roadmap"
                        title="The trajectory."
                    />
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px',
                        background: 'var(--bg-card)', padding: '60px', borderRadius: '32px', border: '1px solid var(--border)'
                    }}>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-elevated)', padding: '6px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: 800, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', border: '1px solid var(--border)' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} /> Phase 1: Foundation
                            </div>
                            <h3 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '20px', color: 'var(--text-1)', letterSpacing: '-1px' }}>Behavioral Aggregation</h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-3)', lineHeight: 1.8, fontWeight: 500 }}>
                                A high-performance behavior-tracking OS seamlessly unifying focus sessions, streak management, mood journaling, and financial tracking. Powered by a commitment engine and weekly intelligence reports, it integrates smoothly with Google Calendar and YouTube for perfect contextual awareness.
                            </p>
                        </div>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-elevated)', padding: '6px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: 800, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', border: '1px solid var(--border)' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-3)' }} /> Phase 2: Horizons
                            </div>
                            <h3 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '20px', color: 'var(--text-1)', letterSpacing: '-1px' }}>Proactive Intelligence</h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-3)', lineHeight: 1.8, fontWeight: 500 }}>
                                Evolving into proactive behavioral drift detection. AIIMIN will accurately predict setbacks before they happen and issue contextual interventions based on your unique biometric and activity signatures, supported by cross-device ritual sync and a robust offline-first architecture.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Architecture Overview */}
                <section style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: '32px' }}>
                        Technical Infrastructure
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {[
                            { layer: 'Frontend Layer', tech: 'React + CSS Variables', detail: 'Edge-rendered via Vercel for zero-latency UI' },
                            { layer: 'Compute Engine', tech: 'Express + Node.js Context', detail: 'De-coupled API hosted on Railway for scale' },
                            { layer: 'Data Sovereignty', tech: 'Supabase Postgres DB', detail: 'Row-level security ensuring strict privacy' },
                        ].map((s, i) => (
                            <div key={i} style={{ padding: '32px', background: 'var(--bg-elevated)', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'left' }}>
                                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: '12px' }}>{s.layer}</div>
                                <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{s.tech}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6, fontWeight: 500 }}>{s.detail}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer style={{ marginTop: '100px', paddingTop: '40px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Logo style={{ height: '32px', opacity: 0.8 }} />
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-2)', letterSpacing: '-0.02em' }}>AIIMIN SYSTEM</span>
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0 }}>
                        Behavioral OS · © 2026
                    </p>
                </footer>
            </div>
            <style>{`
                .back-btn:hover { background: var(--border) !important; transform: translateX(-4px); }
            `}</style>
        </div>
    );
};

export default Brand;
