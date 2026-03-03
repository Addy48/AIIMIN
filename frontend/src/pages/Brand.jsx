import React from 'react';
import { Link } from 'react-router-dom';

const Brand = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f0e8', // matching system secondary
            color: '#1a1a1a',
            padding: '80px 20px',
            fontFamily: '"Inter", sans-serif'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/" style={{
                    color: '#e05c2a',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '60px'
                }}>
                    ← Back to Dashboard
                </Link>

                <header style={{ marginBottom: '80px' }}>
                    <h1 style={{
                        fontSize: '56px',
                        fontWeight: 900,
                        letterSpacing: '-1.5px',
                        lineHeight: 1.1,
                        marginBottom: '24px',
                        backgroundImage: 'linear-gradient(135deg, #c27814, #e05c2a)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        AIIMIN: The Behavioral OS.
                    </h1>
                    <p style={{ fontSize: '20px', color: '#666', lineHeight: 1.6, fontWeight: 500 }}>
                        We are building more than a dashboard. We are building the infrastructure for human momentum.
                    </p>
                </header>

                <section style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>Our Mission</h2>
                    <p style={{ fontSize: '16px', color: '#444', lineHeight: 1.8 }}>
                        In an era of digital friction and fragmentation, AIIMIN exists to bridge the gap between intention and action.
                        Our mission is to provide an integrated environment where behavioral patterns are not just tracked, but shaped through
                        intelligent feedback loops and localized data sovereignty.
                    </p>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '80px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>Scope</h3>
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>
                            Currently a behavior-tracking OS focusing on focus sessions, streak management, and mood journaling.
                            AIIMIN integrates with your existing workflows (Google Calendar, YouTube) to minimize context switching.
                        </p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>Future</h3>
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>
                            We are moving towards proactive behavioral drift detection. AIIMIN will eventually predict setbacks
                            before they happen, offering contextual interventions based on your unique biometric and activity signatures.
                        </p>
                    </div>
                </div>

                <section style={{
                    padding: '40px',
                    background: 'white',
                    borderRadius: '24px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>Use Cases</h2>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { title: 'High-Performance focus', desc: 'Syncing your schedule with focus music to achieve peak state.' },
                            { title: 'Behavioral Recovery', desc: 'Logging urges and resets to identify environmental triggers.' },
                            { title: 'Data Sovereignty', desc: 'Owning every single log you create, with full exportability.' }
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', gap: '12px' }}>
                                <span style={{ color: '#e05c2a', fontWeight: 900 }}>✓</span>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '15px' }}>{item.title}</div>
                                    <div style={{ fontSize: '13px', color: '#777' }}>{item.desc}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <footer style={{ marginTop: '100px', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '40px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#666', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        AIIMIN Behavioral OS · 2026
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Brand;
