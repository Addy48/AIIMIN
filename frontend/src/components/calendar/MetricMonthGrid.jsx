import React, { useState } from 'react';
import MonthlyGrid from './MonthlyGrid';

export const METRIC_SCALES = {
    steps: {
        getColor: (v) => {
            if (v === 0) return 'var(--bg-elevated)';
            if (v < 4000) return 'rgba(235,140,140,0.4)';
            if (v < 6000) return 'rgba(251,191,36,0.4)';
            if (v < 8000) return 'rgba(139,195,74,0.4)';
            if (v < 10000) return 'rgba(34,197,94,0.5)';
            return 'var(--accent)';
        },
        legend: [
            { label: '0-4k', color: 'rgba(235,140,140,0.4)' },
            { label: '4k-6k', color: 'rgba(251,191,36,0.4)' },
            { label: '6k-8k', color: 'rgba(139,195,74,0.4)' },
            { label: '8k-10k', color: 'rgba(34,197,94,0.5)' },
            { label: '10k+', color: 'var(--accent)' }
        ]
    },
    sleep: {
        getColor: (v) => {
            if (v === 0) return 'var(--bg-elevated)';
            const h = v / 60;
            if (h < 6) return 'rgba(235,140,140,0.4)';
            if (h < 7) return 'rgba(251,191,36,0.4)';
            if (h <= 8.5) return 'var(--accent)';
            if (h <= 10) return 'rgba(235,190,30,0.5)';
            return 'rgba(235,140,140,0.4)';
        },
        legend: [
            { label: '<6h', color: 'rgba(235,140,140,0.4)' },
            { label: '6-7h', color: 'rgba(251,191,36,0.4)' },
            { label: '7-8.5h', color: 'var(--accent)' },
            { label: '9-10h', color: 'rgba(235,190,30,0.5)' },
            { label: '>10h', color: 'rgba(235,140,140,0.4)' }
        ]
    },
    protein: {
        getColor: (v) => {
            if (v === 0) return 'var(--bg-elevated)';
            const pct = Math.min(v / 160, 1);
            return `rgba(var(--accent-rgb), ${Math.max(0.15, pct)})`;
        },
        legend: [
            { label: '0g', color: 'var(--bg-elevated)' },
            { label: '80g', color: 'rgba(var(--accent-rgb), 0.5)' },
            { label: '160g+', color: 'var(--accent)' }
        ]
    },
    mood: {
        getColor: (v) => {
            if (v === 0) return 'var(--bg-elevated)';
            if (v <= 3) return 'rgba(235,140,140,0.4)';
            if (v <= 5) return 'rgba(251,191,36,0.4)';
            if (v <= 7) return 'rgba(139,195,74,0.4)';
            if (v <= 9) return 'rgba(34,197,94,0.5)';
            return 'var(--accent)';
        },
        legend: [
            { label: '1-3', color: 'rgba(235,140,140,0.4)' },
            { label: '4-5', color: 'rgba(251,191,36,0.4)' },
            { label: '6-7', color: 'rgba(139,195,74,0.4)' },
            { label: '8-9', color: 'rgba(34,197,94,0.5)' },
            { label: '10', color: 'var(--accent)' }
        ]
    },
    gym: {
        getColor: (v) => {
            return v > 0 ? 'var(--accent)' : 'var(--bg-elevated)';
        },
        legend: [
            { label: 'Rest', color: 'var(--bg-elevated)' },
            { label: 'Done', color: 'var(--accent)' }
        ]
    },
    learning: {
        getColor: (v) => {
            if (v === 0) return 'var(--bg-elevated)';
            if (v < 30) return 'rgba(var(--accent-rgb), 0.2)';
            if (v < 60) return 'rgba(var(--accent-rgb), 0.4)';
            if (v < 90) return 'rgba(var(--accent-rgb), 0.7)';
            return 'var(--accent)';
        },
        legend: [
            { label: '1-29m', color: 'rgba(var(--accent-rgb), 0.2)' },
            { label: '30-59m', color: 'rgba(var(--accent-rgb), 0.4)' },
            { label: '60-89m', color: 'rgba(var(--accent-rgb), 0.7)' },
            { label: '90m+', color: 'var(--accent)' }
        ]
    },
    focus: {
        getColor: (v) => {
            if (v === 0) return 'var(--bg-elevated)';
            if (v < 51) return 'rgba(255,107,53,0.25)';   // 1-2 sessions: light orange
            if (v < 101) return 'rgba(255,107,53,0.5)';   // 3-4 sessions: medium orange
            if (v < 151) return 'rgba(255,107,53,0.75)';  // 5-6 sessions: strong orange
            return 'var(--accent)';                        // 7+ sessions: peak
        },
        legend: [
            { label: '1-2 sessions', color: 'rgba(255,107,53,0.25)' },
            { label: '3-4 sessions', color: 'rgba(255,107,53,0.5)' },
            { label: '5-6 sessions', color: 'rgba(255,107,53,0.75)' },
            { label: '7+ sessions', color: 'var(--accent)' }
        ]
    }
};

/**
 * MetricMonthGrid: The single canonical calendar renderer for all dashboard metrics.
 *
 * @param {number} year 
 * @param {number} month (1-12)
 * @param {object} data - Keyed by 'YYYY-MM-DD', contains { value, color, ... }
 * @param {string} defaultColor - CSS color variable, e.g. 'var(--accent)'
 * @param {string} metricName - Label for tooltips
 * @param {string} metricProp - Metric identifier (e.g. 'steps', 'sleep', 'gym')
 */
const MetricMonthGrid = ({ year, month, data = {}, defaultColor = 'var(--accent)', metricName = 'Score', metricProp }) => {
    const [hoveredDay, setHoveredDay] = useState(null);

    // Auto-resolve colour scale based on the requested metricProp
    const scale = METRIC_SCALES[metricProp];

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    // MetricMonthGrid's public API uses 1-based month; MonthlyGrid expects 0-based.
    const monthZeroBased = month - 1;

    return (
        <div style={{ width: '100%', position: 'relative' }}>
            <MonthlyGrid
                year={year}
                month={monthZeroBased}
                renderDay={(day, yr, mo) => {
                    // mo is 0-based from MonthlyGrid; convert back to 1-based for dateStr
                    const dateStr = `${yr}-${String(mo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayData = data[dateStr];

                    const cellDate = new Date(yr, mo, day);
                    const isToday = cellDate.getTime() === todayDate.getTime();
                    const isFuture = cellDate.getTime() > todayDate.getTime();

                    const hasValue = dayData && dayData.value !== undefined && dayData.value !== null && dayData.value > 0;

                    let bg = 'transparent';
                    if (hasValue) {
                        bg = scale?.getColor ? scale.getColor(dayData.value) : (dayData.color || defaultColor);
                    } else if (!isFuture && !isToday) {
                        bg = 'var(--bg-elevated)';
                    }

                    const isHovered = hoveredDay === day;

                    return (
                        <div
                            key={dateStr}
                            className={`day-cell ${isFuture ? 'future-day' : ''}`}
                            onMouseEnter={() => !isFuture && setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            style={{
                                background: bg,
                                border: isToday ? `2px solid ${defaultColor}` : '1px solid rgba(255,255,255,0.04)',
                                cursor: isFuture ? 'default' : 'pointer',
                                transition: 'transform 120ms ease, filter 120ms ease',
                                transform: isHovered && !isFuture ? 'scale(1.04)' : 'scale(1)',
                                filter: isHovered && !isFuture ? 'brightness(1.15)' : 'none',
                                zIndex: isHovered ? 10 : 1,
                                position: 'relative',
                                overflow: 'visible',
                            }}
                        >
                            <span className="day-number" style={{
                                position: 'absolute',
                                top: '7px',
                                left: '9px',
                                fontSize: '15px',
                                fontWeight: 700,
                                color: hasValue ? 'rgba(255,255,255,0.95)' : isToday ? defaultColor : 'var(--text-1)',
                                opacity: isFuture ? 0.45 : 1,
                                lineHeight: 1,
                            }}>
                                {day}
                            </span>
                            {!isFuture && dayData?.signal && (
                                <span className="behavior-indicator">
                                    {dayData.signal}
                                </span>
                            )}
                            {isHovered && !isFuture && (() => {
                                const hd = dayData;
                                let fv = hd?.value || 0;
                                if (metricProp === 'sleep' && fv > 0) {
                                    const hrs = Math.floor(fv / 60); const mins = fv % 60;
                                    fv = `${hrs}h ${mins}m`;
                                } else if (metricProp === 'gym') {
                                    fv = fv > 0 ? 'Yes' : 'No';
                                }
                                const hasBehavior = hd?.habitsCompleted !== undefined;
                                return (
                                    <div style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 6px)',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'var(--bg-popover, #1e1e1e)',
                                        border: '1px solid var(--border)',
                                        padding: '8px 12px',
                                        borderRadius: '10px',
                                        fontSize: '11px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                        zIndex: 100,
                                        pointerEvents: 'none',
                                        whiteSpace: 'nowrap',
                                        minWidth: '140px',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                            <span style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '12px' }}>
                                                {new Date(yr, mo, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            {hd?.signal && <span style={{ fontSize: '13px' }}>{hd.signal}</span>}
                                        </div>
                                        {hasBehavior ? (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                                    <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>Score</span>
                                                    <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{hd.value}/6</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                                    <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>Focus</span>
                                                    <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{hd.focusSessions} session{hd.focusSessions !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                                    <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>Habits</span>
                                                    <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{hd.habitsCompleted}/5</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                                    <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>Mood</span>
                                                    <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{hd.mood > 0 ? `${hd.mood}/10` : '—'}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                                <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>{metricName}</span>
                                                <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{fv}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    );
                }}
            />

            {scale && scale.legend && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginTop: '16px', flexWrap: 'wrap', paddingBottom: '4px' }}>
                    {scale.legend.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color, border: '1px solid var(--border)' }} />
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MetricMonthGrid;
