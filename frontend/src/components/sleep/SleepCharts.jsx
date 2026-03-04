import React from 'react';

/**
 * MiniBar — Pure CSS horizontal bar chart used in Sleep quality distribution.
 */
export const MiniBar = ({ value, max, color, height = 28 }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div style={{
            width: '100%', height: `${height}px`, borderRadius: '4px',
            background: 'var(--bg-elevated)', overflow: 'hidden',
        }}>
            <div style={{
                width: `${pct}%`, height: '100%', borderRadius: '4px',
                background: color, transition: 'width 0.4s ease',
                minWidth: pct > 0 ? '2px' : '0',
            }} />
        </div>
    );
};

/**
 * Sparkline — SVG line chart used for sleep hours and debt trends.
 */
export const Sparkline = ({ data, color, height = 40, width = '100%' }) => {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const svgW = 200;
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1 || 1)) * svgW;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${svgW} ${height}`} style={{ width, height, display: 'block' }} preserveAspectRatio="none">
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {data.length > 0 && (() => {
                const lastX = svgW;
                const lastY = height - ((data[data.length - 1] - min) / range) * (height - 4) - 2;
                return <circle cx={lastX} cy={lastY} r="3" fill={color} />;
            })()}
        </svg>
    );
};
