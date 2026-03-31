import React, { useState, useEffect } from 'react';

const SYSTEMS = [
    { id: 'sys-overview', icon: '⚡', label: 'Overview' },
    { id: 'sys-physical', icon: '🦾', label: 'Physical' },
    { id: 'sys-cognitive', icon: '🧠', label: 'Cognitive' },
    { id: 'sys-behavior', icon: '🔄', label: 'Behavior' },
    { id: 'sys-financial', icon: '💰', label: 'Financial' },
    { id: 'sys-reflection', icon: '👁️', label: 'Reflection' },
    { id: 'sys-insights', icon: '🔭', label: 'Insights' },
    { id: 'sys-reports', icon: '📄', label: 'Reports' },
    { id: 'sys-settings', icon: '⚙️', label: 'Settings' }
];

export default function SystemJumper() {
    const [activeSection, setActiveSection] = useState('sys-overview');

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const visibleOptions = entries.filter(e => e.isIntersecting);
            if (visibleOptions.length > 0) {
                const mostVisible = visibleOptions.reduce((prev, current) =>
                    (prev.intersectionRatio > current.intersectionRatio) ? prev : current
                );
                setActiveSection(mostVisible.target.id);
            }
        }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

        SYSTEMS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div style={{
            position: 'sticky',
            top: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid var(--border-glass)',
            borderRadius: '30px',
            padding: '16px 8px',
            zIndex: 50,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
        }}>
            {SYSTEMS.map(sys => {
                const isActive = activeSection === sys.id;
                return (
                    <a key={sys.id} href={`#${sys.id}`} title={sys.label} style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        textDecoration: 'none',
                        background: isActive ? 'var(--accent-dim)' : 'transparent',
                        border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                        color: isActive ? 'var(--text-1)' : 'var(--text-3)',
                        fontSize: isActive ? '20px' : '16px',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: isActive ? '0 0 10px rgba(212,175,55,0.2)' : 'none'
                    }}
                        onMouseEnter={e => {
                            if (!isActive) {
                                e.currentTarget.style.background = 'var(--bg-elevated)';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isActive) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.transform = 'scale(1)';
                            }
                        }}>
                        {sys.icon}
                    </a>
                )
            })}
        </div>
    );
}
