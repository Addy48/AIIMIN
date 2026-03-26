import React from 'react';



export const SectionCard = ({ icon, title, complete, children }) => (
    <div style={{
        background: 'var(--bg-card)', borderRadius: '14px', padding: '16px',
        border: '1px solid var(--border)', margin: '0 16px',
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{
                fontSize: '13px', fontWeight: 700, color: 'var(--text-2)',
                textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{icon} {title}</span>
            {complete !== undefined && (
                <span style={{ fontSize: '10px', color: complete ? 'var(--success)' : 'var(--text-3)' }}>
                    {complete ? '✓ done' : '○ todo'}
                </span>
            )}
        </div>
        {children}
    </div>
);

export const ToggleRow = ({ label, active, onToggle, icon }) => (
    <div onClick={onToggle} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', borderRadius: '10px', marginBottom: '8px',
        border: active ? '1px solid rgba(245,166,35,0.25)' : '1px solid var(--border)',
        background: active ? 'rgba(245,166,35,0.08)' : 'var(--bg-elevated)',
        cursor: 'pointer',
    }}>
        <span style={{ fontSize: '14px', color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon && <span>{icon}</span>}{label}
        </span>
        <div style={{
            width: '44px', height: '24px', borderRadius: '12px',
            background: active ? 'var(--accent)' : 'var(--border-hover)',
            position: 'relative', transition: 'background 0.2s',
        }}>
            <div style={{
                position: 'absolute', width: '18px', height: '18px', borderRadius: '50%',
                background: '#fff', top: '3px', left: active ? '23px' : '3px',
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
        </div>
    </div>
);

export const Chip = ({ label, active, onClick }) => (
    <button type="button" onClick={onClick} style={{
        padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
        border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent-dim)' : 'var(--bg-elevated)',
        color: active ? 'var(--accent)' : 'var(--text-3)',
        cursor: 'pointer', minHeight: '40px',
    }}>{label}</button>
);

export const MiniChip = ({ label, active, onClick }) => (
    <button type="button" onClick={onClick} style={{
        flex: 1, padding: '4px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent-dim)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-3)', cursor: 'pointer',
    }}>{label}</button>
);

export const TaskRow = ({ task, onToggle }) => {
    const timeStr = task.start_time ? new Date(task.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
    return (
        <div onClick={() => onToggle(task.id, !task.completed)} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
            borderRadius: '8px', cursor: 'pointer',
            background: task.completed ? 'transparent' : 'var(--bg-elevated)',
        }}>
            <span style={{ fontSize: '14px' }}>{task.completed ? '☑' : '☐'}</span>
            <span style={{
                flex: 1, fontSize: '13px', fontWeight: 500,
                color: task.completed ? 'var(--text-3)' : 'var(--text-1)',
                textDecoration: task.completed ? 'line-through' : 'none',
            }}>{task.title}</span>
            {task.event_type === 'reminder' && <span style={{ fontSize: '12px' }}>🔔</span>}
            <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                {task.completed ? 'done' : timeStr}
            </span>
        </div>
    );
};

export const labelSt = { fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', display: 'block' };
export const timeInput = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', fontSize: '15px', fontWeight: 600 };
export const numInput = { padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', fontSize: '15px', fontWeight: 600 };
export const stepBtn = { width: '34px', height: '34px', borderRadius: '8px', fontSize: '16px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };

