import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Lightning, Brain, ChartBar, ChatCircleText } from '@phosphor-icons/react';

const navItems = [
    { to: '/systems/physical', icon: Lightning, label: 'Physical' },
    { to: '/systems/cognitive', icon: Brain, label: 'Cognitive' },
    { to: '/systems/behavior', icon: ChartBar, label: 'Behavior' },
    { to: '/systems/reflection', icon: ChatCircleText, label: 'Reflection' },
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
            {navItems.map(({ to, icon: IconComponent, label }) => (
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
                        textDecoration: 'none',
                        transition: 'background 0.15s ease, box-shadow 0.15s ease',
                        background: isActive ? 'var(--accent-dim)' : 'transparent',
                        boxShadow: isActive ? 'inset 0 0 0 1px var(--accent)' : 'none',
                        color: isActive ? 'var(--accent)' : 'var(--color-text-2)',
                    })}
                >
                    <IconComponent size={20} weight="duotone" />

                    {/* Tooltip */}
                    {hovered === to && (
                        <span style={{
                            position: 'absolute',
                            left: '52px',
                            whiteSpace: 'nowrap',
                            background: 'var(--surface-overlay)',
                            color: 'var(--color-text-1)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            boxShadow: 'var(--shadow-md)',
                            pointerEvents: 'none',
                            zIndex: 100,
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
