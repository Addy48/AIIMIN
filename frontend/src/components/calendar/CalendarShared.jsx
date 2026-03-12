import React from 'react';

/* ─── Type config ─── */
export const TYPE_CONFIG = {
    event: { label: 'Event', color: '#9b8af5', bg: 'rgba(155,138,245,0.08)', border: 'rgba(155,138,245,0.18)', icon: '📅' },
    task: { label: 'Task', color: '#f5a623', bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.18)', icon: '☐' },
    reminder: { label: 'Reminder', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.18)', icon: '🔔' },
};

/* ─── Inline time input ─── */
export const TimeInput = ({ value, onChange, label }) => (
    <div style={{ flex: 1 }}>
        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: '4px' }}>{label}</label>
        <input
            type="time"
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{
                width: '100%', padding: '8px 10px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                color: 'var(--text-1)', fontSize: '13px', outline: 'none',
            }}
        />
    </div>
);

/* ─── Add/Edit form ─── */
export const ItemForm = ({ formData, setFormData, onSubmit, onCancel, isEditing }) => (
    <div style={{
        padding: '16px', background: 'var(--bg-elevated)', borderRadius: '12px',
        border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>
            {isEditing ? 'Edit Item' : 'New Item'}
        </div>

        {/* Title */}
        <input
            type="text"
            placeholder="What's on the schedule?"
            value={formData.title}
            onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
            autoFocus
            style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'var(--bg-primary)',
                color: 'var(--text-1)', fontSize: '14px', fontWeight: 600, outline: 'none',
            }}
            onKeyDown={e => { if (e.key === 'Enter' && formData.title.trim()) onSubmit(); }}
        />

        {/* Type selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                <button
                    key={key}
                    onClick={() => setFormData(p => ({ ...p, eventType: key }))}
                    style={{
                        flex: 1, padding: '7px 0', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                        border: formData.eventType === key ? `1px solid ${cfg.color}` : '1px solid var(--border)',
                        background: formData.eventType === key ? cfg.bg : 'transparent',
                        color: formData.eventType === key ? cfg.color : 'var(--text-3)',
                        cursor: 'pointer', transition: 'all 0.15s',
                    }}
                >
                    {cfg.icon} {cfg.label}
                </button>
            ))}
        </div>

        {/* All day toggle */}
        <div
            onClick={() => setFormData(p => ({ ...p, allDay: !p.allDay }))}
            style={{
                display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                padding: '8px 12px', borderRadius: '8px', background: formData.allDay ? 'rgba(245,166,35,0.06)' : 'transparent',
                border: '1px solid var(--border)', transition: 'all 0.15s',
            }}
        >
            <div style={{
                width: '18px', height: '18px', borderRadius: '4px',
                border: formData.allDay ? 'none' : '2px solid var(--text-3)',
                background: formData.allDay ? 'var(--accent)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
            }}>
                {formData.allDay && <span style={{ color: 'white', fontSize: '11px', fontWeight: 800 }}>✓</span>}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)' }}>All day</span>
        </div>

        {/* Time pickers — hidden if all day */}
        {!formData.allDay && (
            <div style={{ display: 'flex', gap: '10px' }}>
                <TimeInput label="Start" value={formData.startTime} onChange={v => setFormData(p => ({ ...p, startTime: v }))} />
                <TimeInput label="End" value={formData.endTime} onChange={v => setFormData(p => ({ ...p, endTime: v }))} />
            </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onCancel} style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                background: 'transparent', color: 'var(--text-3)', border: '1px solid var(--border)', cursor: 'pointer',
            }}>Cancel</button>
            <button type="button" onClick={onSubmit} style={{
                padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer',
                opacity: formData.title.trim() ? 1 : 0.5,
            }}>
                {isEditing ? 'Save' : 'Add'}
            </button>
        </div>
    </div>
);

/* ─── Single calendar item row ─── */
export const CalendarItem = ({ item, onToggle, onEdit, onDelete }) => {
    const cfg = TYPE_CONFIG[item.event_type] || TYPE_CONFIG.event;
    const startDate = new Date(item.start_time);
    const endDate = new Date(item.end_time);
    const timeStr = item.all_day ? 'All day' :
        `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
            background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '10px',
            transition: 'all 0.15s',
        }}>
            {/* Completion toggle for tasks */}
            {item.event_type === 'task' ? (
                <div
                    onClick={() => onToggle(item)}
                    style={{
                        width: '20px', height: '20px', borderRadius: '6px', cursor: 'pointer',
                        border: item.completed ? 'none' : `2px solid ${cfg.color}`,
                        background: item.completed ? cfg.color : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'all 0.15s',
                    }}
                >
                    {item.completed && <span style={{ color: 'white', fontSize: '11px', fontWeight: 800 }}>✓</span>}
                </div>
            ) : (
                <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: cfg.color, flexShrink: 0,
                }} />
            )}

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: '13px', fontWeight: 700, color: 'var(--text-1)',
                    textDecoration: item.completed ? 'line-through' : 'none',
                    opacity: item.completed ? 0.5 : 1,
                }}>
                    {item.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, marginTop: '2px' }}>
                    {timeStr}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <button onClick={() => onEdit(item)} style={{
                    width: '28px', height: '28px', borderRadius: '6px', border: 'none',
                    background: 'transparent', color: 'var(--text-3)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
                }} title="Edit">✎</button>
                <button onClick={() => onDelete(item.id)} style={{
                    width: '28px', height: '28px', borderRadius: '6px', border: 'none',
                    background: 'transparent', color: 'var(--text-3)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
                }} title="Delete">✕</button>
            </div>
        </div>
    );
};
