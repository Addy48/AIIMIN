import React, { useState, useEffect } from 'react';
import { EventTagSelector } from './EventCard';

/**
 * EventModal — Create/Edit event modal with Life OS system_type selector.
 */
const EventModal = ({ isOpen, onClose, onSave, event = null }) => {
    const [form, setForm] = useState({
        title: '', description: '', start_time: '', end_time: '',
        all_day: false, system_type: 'general', tags: [],
        color: '', location: '', reminder_minutes: null,
        recurrence_rule: null, event_type: 'event',
    });

    useEffect(() => {
        if (event) {
            const st = event.start_time ? new Date(event.start_time) : new Date();
            const et = event.end_time ? new Date(event.end_time) : new Date(st.getTime() + 3600000);
            setForm({
                title: event.title || '',
                description: event.description || '',
                start_time: st.toISOString().slice(0, 16),
                end_time: et.toISOString().slice(0, 16),
                all_day: event.all_day || false,
                system_type: event.system_type || 'general',
                tags: event.tags || [],
                color: event.color || '',
                location: event.location || '',
                reminder_minutes: event.reminder_minutes || null,
                recurrence_rule: event.recurrence_rule || null,
                event_type: event.event_type || 'event',
            });
        } else {
            const now = new Date();
            now.setMinutes(0, 0, 0);
            const end = new Date(now.getTime() + 3600000);
            setForm(f => ({
                ...f, title: '', description: '', location: '',
                start_time: now.toISOString().slice(0, 16),
                end_time: end.toISOString().slice(0, 16),
                all_day: false, system_type: 'general', recurrence_rule: null,
            }));
        }
    }, [event, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!form.title.trim()) return;
        onSave({
            ...form,
            start_time: new Date(form.start_time).toISOString(),
            end_time: new Date(form.end_time).toISOString(),
        });
        onClose();
    };

    const inputStyle = {
        width: '100%', padding: '10px 12px', borderRadius: '8px',
        border: '1px solid var(--border)', background: 'var(--bg-elevated)',
        color: 'var(--text-1)', fontSize: '13px', outline: 'none',
    };
    const labelStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', display: 'block' };

    return (
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.6)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)'
        }}>
            <div onClick={e => e.stopPropagation()} className="glass-panel" style={{
                width: '640px', maxHeight: '85vh', overflow: 'auto',
                borderRadius: '20px', padding: '32px',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
                        {event ? 'Edit Event' : 'New Event'}
                    </h3>
                    <button onClick={onClose} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* Row: Title (Full Width) */}
                    <div>
                        <label style={labelStyle}>Title</label>
                        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Deep work session..." style={inputStyle} autoFocus />
                    </div>

                    {/* Row 1: Start | End */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Start</label>
                            <input type="datetime-local" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>End</label>
                            <input type="datetime-local" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} style={inputStyle} />
                        </div>
                    </div>

                    {/* Row 2: Life System */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={labelStyle}>Life System</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-2)', cursor: 'pointer', marginBottom: '6px' }}>
                                <input type="checkbox" checked={form.all_day} onChange={e => setForm(f => ({ ...f, all_day: e.target.checked }))} />
                                All day event
                            </label>
                        </div>
                        <EventTagSelector value={form.system_type} onChange={v => setForm(f => ({ ...f, system_type: v }))} />
                    </div>

                    {/* Row 3: Location */}
                    <div>
                        <label style={labelStyle}>Location</label>
                        <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Optional" style={inputStyle} />
                    </div>

                    {/* Row 4: Description */}
                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional notes..." rows={3}
                            style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} />
                    </div>

                    {/* Row 5: Reminder | Recurrence */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Reminder (min)</label>
                            <input type="number" value={form.reminder_minutes || ''} onChange={e => setForm(f => ({ ...f, reminder_minutes: e.target.value ? parseInt(e.target.value) : null }))} placeholder="15" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Recurrence</label>
                            <select value={form.recurrence_rule?.freq || ''} onChange={e => {
                                const freq = e.target.value;
                                setForm(f => ({ ...f, recurrence_rule: freq ? { freq, interval: 1 } : null }));
                            }} style={inputStyle}>
                                <option value="">None</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 6: Cancel | Save (Right Aligned) */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={onClose} style={{
                            padding: '12px 24px', borderRadius: '10px',
                            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                            color: 'var(--text-2)', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        }}>Cancel</button>
                        <button onClick={handleSave} style={{
                            padding: '12px 32px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--accent) 0%, #e05c2a 100%)',
                            border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        }}>{event ? 'Update' : 'Create'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
