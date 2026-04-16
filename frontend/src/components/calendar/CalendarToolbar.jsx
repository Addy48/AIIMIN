import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const VIEWS = [
    { key: 'month', label: 'Month', icon: '📅' },
    { key: 'week', label: 'Week', icon: '📆' },
    { key: 'day', label: 'Day', icon: '📋' },
    { key: 'agenda', label: 'Agenda', icon: '📝' },
];

/**
 * CalendarToolbar — View switcher, date navigation, quick-add trigger.
 */
const CalendarToolbar = ({ view, onViewChange, currentDate, onDateChange, onNewEvent }) => {
    const d = new Date(currentDate);

    const navigate = (direction) => {
        const next = new Date(d);
        if (view === 'month') next.setMonth(d.getMonth() + direction);
        else if (view === 'week') next.setDate(d.getDate() + 7 * direction);
        else next.setDate(d.getDate() + direction);
        onDateChange(next.toISOString());
    };

    const goToday = () => onDateChange(new Date().toISOString());

    const title = view === 'month'
        ? d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : view === 'week'
            ? `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', background: 'var(--bg-card)',
            border: '1px solid var(--border)', borderRadius: '14px',
        }}>
            {/* Left: Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => navigate(-1)} style={arrowBtnStyle}>←</button>
                <button onClick={goToday} style={todayBtnStyle}>Today</button>
                <button onClick={() => navigate(1)} style={arrowBtnStyle}>→</button>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-1)', marginLeft: '8px' }}>{title}</span>
            </div>

            {/* Right: View switcher + Add */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '2px', padding: '3px', borderRadius: '10px', background: 'var(--bg-elevated)' }}>
                    {VIEWS.map(v => (
                        <button key={v.key} onClick={() => onViewChange(v.key)} style={{
                            padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            fontSize: '11px', fontWeight: 700,
                            background: view === v.key ? 'var(--bg-card)' : 'transparent',
                            color: view === v.key ? 'var(--text-1)' : 'var(--text-3)',
                            boxShadow: view === v.key ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.15s',
                        }}>
                            {v.label}
                        </button>
                    ))}
                </div>
                <button onClick={onNewEvent} style={{
                    padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, var(--accent) 0%, #e05c2a 100%)',
                    color: '#fff', fontSize: '12px', fontWeight: 700,
                }}>+ New</button>
            </div>
        </div>
    );
};

const arrowBtnStyle = {
    width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)',
    background: 'var(--bg-elevated)', color: 'var(--text-2)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
    transition: 'all 0.2s', ':hover': { background: 'var(--border)' }
};

const todayBtnStyle = {
    padding: '8px 18px', borderRadius: '999px', border: '1px solid var(--border)',
    background: 'var(--bg-elevated)', color: 'var(--text-1)', cursor: 'pointer',
    fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', ':hover': { background: 'var(--border)' }
};

export default CalendarToolbar;
