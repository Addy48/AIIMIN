import React, { useState } from 'react';
import { SectionCard, TaskRow } from './Shared';
import { numInput, timeInput } from "../MobileUI";
import { Chip } from "../MobileComponents";

const MobileTaskSection = ({ tasks, onAdd, onToggle }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('task');
    const [time, setTime] = useState('');

    const handleAdd = () => {
        if (!title.trim()) return;
        onAdd({ title: title.trim(), type, time: time || null });
        setTitle(''); setTime('');
    };

    const pending = tasks.filter(t => !t.completed);
    const done = tasks.filter(t => t.completed);

    return (
        <SectionCard icon="📋" title="TASKS & REMINDERS">
            <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="What needs to be done?" onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    style={{ ...numInput, width: '100%', marginBottom: '8px', fontSize: '14px' }} />
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    {['task', 'reminder', 'todo'].map(t => (
                        <Chip key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} active={type === t}
                            onClick={() => setType(t)} />
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)}
                        style={{ ...timeInput, flex: 1 }} />
                    <button onClick={handleAdd} disabled={!title.trim()}
                        style={{
                            padding: '10px 16px', borderRadius: '8px', border: 'none',
                            background: title.trim() ? 'var(--accent)' : 'var(--bg-card)',
                            color: title.trim() ? '#fff' : 'var(--text-3)',
                            fontWeight: 700, fontSize: '13px', cursor: title.trim() ? 'pointer' : 'default',
                            minHeight: '44px',
                        }}>Add ✓</button>
                </div>
            </div>
            {pending.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {pending.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
                </div>
            )}
            {done.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {done.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
                </div>
            )}
            {tasks.length === 0 && (
                <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '8px' }}>
                    No tasks today. Add one above.
                </p>
            )}
        </SectionCard>
    );
};

export default MobileTaskSection;
