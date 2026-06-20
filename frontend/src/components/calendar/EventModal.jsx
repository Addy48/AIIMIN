import React, { useState, useEffect } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { EventTagSelector } from './EventCard';
import Modal from '../ui/Modal';

/**
 * EventModal — Create/Edit event modal with Life OS system_type selector.
 * Redesigned with Nordic Calm aesthetic.
 */
const EventModal = ({ isOpen, onClose, onSave, event = null, onDelete }) => {
    const { theme } = useThemeContext();
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

    const border = 'var(--color-border)';
    const text1 = 'var(--color-text-1)';
    const text2 = 'var(--color-text-2)';
    const bg = 'var(--color-base)';
    const inputBg = 'var(--color-elevated)';

    const labelStyle = { 
        fontSize: '10px', fontWeight: 700, color: text2, 
        textTransform: 'uppercase', letterSpacing: '0.08em', 
        marginBottom: '8px', display: 'block', fontFamily: 'var(--font-sans)' 
    };

    const inputStyle = {
        width: '100%', padding: '12px 14px', borderRadius: '10px',
        border: `1px solid ${border}`, background: inputBg,
        color: text1, fontSize: '13px', outline: 'none',
        fontFamily: 'var(--font-sans)', transition: 'all 200ms var(--ease)',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'New Event'} maxWidth="520px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Row: Title */}
                    <div>
                        <label style={labelStyle}>Title</label>
                        <input 
                            value={form.title} 
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                            placeholder="Deep work session..." 
                            style={inputStyle} 
                            autoFocus 
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                            onBlur={e => e.currentTarget.style.borderColor = border}
                        />
                    </div>

                    {/* Row: Start | End */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Start</label>
                            <input 
                                type="datetime-local" 
                                value={form.start_time} 
                                onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} 
                                style={inputStyle} 
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>End</label>
                            <input 
                                type="datetime-local" 
                                value={form.end_time} 
                                onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} 
                                style={inputStyle} 
                            />
                        </div>
                    </div>

                    {/* Row: Life System */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <label style={{ ...labelStyle, marginBottom: 0 }}>Life System</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: text2, cursor: 'pointer', fontWeight: 600 }}>
                                <input 
                                    type="checkbox" 
                                    checked={form.all_day} 
                                    onChange={e => setForm(f => ({ ...f, all_day: e.target.checked }))} 
                                />
                                All day event
                            </label>
                        </div>
                        <EventTagSelector value={form.system_type} onChange={v => setForm(f => ({ ...f, system_type: v }))} />
                    </div>

                    {/* Row: Location & Description */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Location</label>
                            <input 
                                value={form.location} 
                                onChange={e => setForm(f => ({ ...f, location: e.target.value }))} 
                                placeholder="Optional" 
                                style={inputStyle} 
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea 
                                value={form.description} 
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                                placeholder="Optional notes..." 
                                rows={3}
                                style={{ ...inputStyle, resize: 'none', minHeight: '80px' }} 
                            />
                        </div>
                    </div>

                    {/* Row: Reminder | Recurrence */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Reminder (min)</label>
                            <input 
                                type="number" 
                                value={form.reminder_minutes || ''} 
                                onChange={e => setForm(f => ({ ...f, reminder_minutes: e.target.value ? parseInt(e.target.value) : null }))} 
                                placeholder="15" 
                                style={inputStyle} 
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Recurrence</label>
                            <select 
                                value={form.recurrence_rule?.freq || ''} 
                                onChange={e => {
                                    const freq = e.target.value;
                                    setForm(f => ({ ...f, recurrence_rule: freq ? { freq, interval: 1 } : null }));
                                }} 
                                style={inputStyle}
                            >
                                <option value="">None</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                        marginTop: '12px', borderTop: `1px solid ${border}`, paddingTop: '24px' 
                    }}>
                        <div>
                            {event && onDelete && (
                                <button onClick={() => onDelete(event.id)} style={{
                                    padding: '10px 16px', borderRadius: '10px', border: 'none',
                                    background: 'transparent', color: 'var(--color-rust)',
                                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                    fontFamily: 'var(--font-sans)', transition: 'background 200ms'
                                }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'} 
                                   onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Delete Event</button>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={onClose} style={{
                                padding: '10px 20px', borderRadius: '10px',
                                background: 'transparent', border: `1px solid ${border}`,
                                color: text1, fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                fontFamily: 'var(--font-sans)', transition: 'all 200ms var(--ease)'
                            }} onMouseEnter={e => e.currentTarget.style.background = 'var(--color-elevated)'}>Cancel</button>
                            <button onClick={handleSave} style={{
                                padding: '10px 28px', borderRadius: '10px',
                                background: 'var(--color-accent)', border: 'none',
                                color: theme === 'dark' ? '#000' : '#fff', fontSize: '12px', fontWeight: 700, 
                                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                                boxShadow: '0 4px 12px rgba(34,197,94,0.2)',
                                transition: 'all 200ms var(--ease)'
                            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                               onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                {event ? 'Update' : 'Create Event'}
                            </button>
                        </div>
                    </div>
            </div>
        </Modal>
    );
};

export default EventModal;
