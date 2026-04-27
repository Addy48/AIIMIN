import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/systems/physical', icon: '⚡', label: 'Physical' },
    { to: '/systems/cognitive', icon: '🧠', label: 'Cognitive' },
    { to: '/systems/behavior', icon: '📊', label: 'Behavior' },
    { to: '/systems/reflection', icon: '💭', label: 'Reflection' },
];

/**
 * Sidebar — Floating vertical left-rail navigation.
 * Visible only within /systems/* pages.
 * Icon-only with hover tooltip labels.
 */
const Sidebar = () => {
    const [hovered, setHovered] = useState(null);

    return (
        <nav
            className="glass-surface"
            style={{
                position: 'sticky',
                top: '96px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '8px',
                borderRadius: '16px',
                width: '56px',
            }}
        >
            {navItems.map(({ to, icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    onMouseEnter={() => setHovered(to)}
                    onMouseLeave={() => setHovered(null)}
                    style={({ isActive }) => ({
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        fontSize: '18px',
                        textDecoration: 'none',
                        transition: 'background 0.15s ease, box-shadow 0.15s ease',
                        background: isActive ? 'var(--accent-dim)' : 'transparent',
                        boxShadow: isActive ? 'inset 0 0 0 1px var(--accent)' : 'none',
                    })}
                >
                    <span>{icon}</span>

                    {/* Tooltip */}
                    {hovered === to && (
                        <span style={{
                            position: 'absolute',
                            left: '52px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-1)',
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            whiteSpace: 'nowrap',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: 100,
                            pointerEvents: 'none',
                            opacity: 1,
                        }}>
                            {label}
                        </span>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default Sidebar;
