import React, { useState, useEffect, useCallback, useRef } from 'react';
import supabase from '../utils/supabase';
import { insertRow, updateRow } from '../services/dbService';
import toast from '../utils/toast';

/* ─── Type config ─── */
const TYPE_CONFIG = {
    event:    { label: 'Event',    color: '#9b8af5', bg: 'rgba(155,138,245,0.08)', border: 'rgba(155,138,245,0.18)', icon: '📅' },
    task:     { label: 'Task',     color: '#f5a623', bg: 'rgba(245,166,35,0.08)',  border: 'rgba(245,166,35,0.18)',  icon: '☐' },
    reminder: { label: 'Reminder', color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.18)', icon: '🔔' },
};

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ─── Inline time input ─── */
const TimeInput = ({ value, onChange, label }) => (
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
const ItemForm = ({ formData, setFormData, onSubmit, onCancel, isEditing }) => (
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
            <button onClick={onCancel} style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                background: 'transparent', color: 'var(--text-3)', border: '1px solid var(--border)', cursor: 'pointer',
            }}>Cancel</button>
            <button onClick={onSubmit} style={{
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
const CalendarItem = ({ item, onToggle, onEdit, onDelete }) => {
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

/* ─── Main Personal Calendar ─── */
const PersonalCalendar = ({ user }) => {
    const now = new Date();


    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-based
    const [selectedDay, setSelectedDay] = useState(null);
    const [items, setItems] = useState([]);
    const [, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerYear, setPickerYear] = useState(now.getFullYear());
    const pickerRef = useRef(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', eventType: 'event', startTime: '09:00', endTime: '10:00', allDay: false,
    });

    const dayPanelRef = useRef(null);

    /* ── Fetch month's items ── */
    const fetchItems = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        const startDate = new Date(viewYear, viewMonth, 1).toISOString();
        const endDate = new Date(viewYear, viewMonth + 1, 0, 23, 59, 59).toISOString();

        const { data, error } = await supabase
            .from('calendar_events')
            .select('*')
            .eq('user_id', user.id)
            .is('deleted_at', null)
            .gte('start_time', startDate)
            .lte('start_time', endDate)
            .order('start_time', { ascending: true });

        if (!error) setItems(data || []);
        setLoading(false);
    }, [user?.id, viewYear, viewMonth]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    /* ── Close month picker on outside click ── */
    useEffect(() => {
        const handler = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false);
        };
        if (showPicker) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showPicker]);

    /* ── Calendar math ── */
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // Monday-first offset
    let firstDayOffset = new Date(viewYear, viewMonth, 1).getDay() - 1;
    if (firstDayOffset < 0) firstDayOffset = 6;

    const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
    const today = now.getDate();

    /* ── Items grouped by day ── */
    const itemsByDay = {};
    items.forEach(item => {
        const d = new Date(item.start_time).getDate();
        if (!itemsByDay[d]) itemsByDay[d] = [];
        itemsByDay[d].push(item);
    });

    /* ── Navigation ── */
    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
        setSelectedDay(null); setShowForm(false);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
        setSelectedDay(null); setShowForm(false);
    };
    const goToToday = () => {
        setViewYear(now.getFullYear()); setViewMonth(now.getMonth()); setSelectedDay(now.getDate());
    };

    /* ── CRUD ── */
    const resetForm = () => {
        setFormData({ title: '', eventType: 'event', startTime: '09:00', endTime: '10:00', allDay: false });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) { toast.error('Title is required'); return; }
        const day = selectedDay || today;

        const [sh, sm] = formData.startTime.split(':').map(Number);
        const [eh, em] = formData.endTime.split(':').map(Number);

        const startTime = formData.allDay
            ? new Date(viewYear, viewMonth, day, 0, 0).toISOString()
            : new Date(viewYear, viewMonth, day, sh, sm).toISOString();
        const endTime = formData.allDay
            ? new Date(viewYear, viewMonth, day, 23, 59).toISOString()
            : new Date(viewYear, viewMonth, day, eh, em).toISOString();

        try {
            if (editingId) {
                await updateRow('calendar_events',
                    { title: formData.title, event_type: formData.eventType, start_time: startTime, end_time: endTime, all_day: formData.allDay },
                    'id', editingId
                );
            } else {
                await insertRow('calendar_events', {
                    user_id: user.id,
                    title: formData.title,
                    event_type: formData.eventType,
                    start_time: startTime,
                    end_time: endTime,
                    all_day: formData.allDay,
                    source_type: 'user',
                });
            }
            toast.success(editingId ? 'Updated' : 'Added to calendar');
            resetForm();
            fetchItems();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            // Soft delete
            await updateRow('calendar_events', { deleted_at: new Date().toISOString() }, 'id', id);
            toast.success('Removed');
            fetchItems();
        } catch (err) { toast.error(err.message); }
    };

    const handleToggleComplete = async (item) => {
        try {
            await updateRow('calendar_events', { completed: !item.completed }, 'id', item.id);
            fetchItems();
        } catch (err) { toast.error(err.message); }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        const st = new Date(item.start_time);
        const et = new Date(item.end_time);
        setFormData({
            title: item.title,
            eventType: item.event_type || 'event',
            startTime: `${String(st.getHours()).padStart(2, '0')}:${String(st.getMinutes()).padStart(2, '0')}`,
            endTime: `${String(et.getHours()).padStart(2, '0')}:${String(et.getMinutes()).padStart(2, '0')}`,
            allDay: item.all_day || false,
        });
        setShowForm(true);
    };

    const handleDayClick = (day) => {
        setSelectedDay(day === selectedDay ? null : day);
        setShowForm(false);
        setEditingId(null);
    };

    const selectedItems = selectedDay ? (itemsByDay[selectedDay] || []) : [];
    const monthLabel = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

    /* ── Upcoming items (next 7 days) ── */
    const upcomingItems = items.filter(item => {
        const itemDate = new Date(item.start_time);
        const diff = (itemDate - now) / 86400000;
        return diff >= 0 && diff <= 7 && !item.completed;
    }).slice(0, 5);

    /* ── Stats ── */
    const totalEvents = items.filter(i => i.event_type === 'event').length;
    const totalTasks = items.filter(i => i.event_type === 'task').length;
    const completedTasks = items.filter(i => i.event_type === 'task' && i.completed).length;
    const totalReminders = items.filter(i => i.event_type === 'reminder').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── Header card ── */}
            <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '20px 22px', boxShadow: 'var(--shadow-sm)',
            }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '34px', height: '34px', background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)', borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                        }}>📅</div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>Calendar</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 500 }}>
                                Events, tasks &amp; reminders
                            </div>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {[
                            { label: 'Events', val: totalEvents, color: TYPE_CONFIG.event.color },
                            { label: 'Tasks', val: `${completedTasks}/${totalTasks}`, color: TYPE_CONFIG.task.color },
                            { label: 'Reminders', val: totalReminders, color: TYPE_CONFIG.reminder.color },
                        ].map(s => (
                            <div key={s.label} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '15px', fontWeight: 800, color: s.color }}>{s.val}</div>
                                <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Month nav */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 0',
                }}>
                    <button onClick={prevMonth} style={{
                        width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)',
                        background: 'var(--bg-elevated)', color: 'var(--text-2)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                    }}>←</button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }} ref={pickerRef}>
                        <button
                            onClick={() => { setPickerYear(viewYear); setShowPicker(p => !p); }}
                            style={{
                                fontSize: '15px', fontWeight: 800, color: 'var(--text-1)',
                                background: 'none', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '4px', padding: 0,
                            }}
                        >
                            {monthLabel}
                            <span style={{ fontSize: '10px', color: 'var(--text-3)', transition: 'transform 0.15s', transform: showPicker ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                        </button>
                        {!isCurrentMonth && (
                            <button onClick={goToToday} style={{
                                padding: '3px 10px', borderRadius: '99px', border: '1px solid var(--border)',
                                background: 'var(--bg-elevated)', color: 'var(--accent)',
                                fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                            }}>Today</button>
                        )}

                        {/* ── Month/Year Picker Dropdown ── */}
                        {showPicker && (
                            <div style={{
                                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                                marginTop: '8px', zIndex: 50, width: '260px',
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                padding: '14px', animation: 'fadeIn 0.12s ease-out',
                            }}>
                                {/* Year row */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <button onClick={() => setPickerYear(y => y - 1)} style={{
                                        width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)',
                                        background: 'var(--bg-elevated)', color: 'var(--text-2)', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                                    }}>←</button>
                                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>{pickerYear}</span>
                                    <button onClick={() => setPickerYear(y => y + 1)} style={{
                                        width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)',
                                        background: 'var(--bg-elevated)', color: 'var(--text-2)', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                                    }}>→</button>
                                </div>

                                {/* 4x3 Month grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                                    {Array.from({ length: 12 }, (_, m) => {
                                        const isActive = m === viewMonth && pickerYear === viewYear;
                                        const isCurrent = m === now.getMonth() && pickerYear === now.getFullYear();
                                        const label = new Date(2000, m).toLocaleString('default', { month: 'short' });
                                        return (
                                            <button
                                                key={m}
                                                onClick={() => {
                                                    setViewYear(pickerYear); setViewMonth(m);
                                                    setSelectedDay(null); setShowForm(false);
                                                    setShowPicker(false);
                                                }}
                                                style={{
                                                    padding: '8px 4px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                                                    border: isCurrent && !isActive ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent',
                                                    background: isActive ? 'var(--accent)' : 'transparent',
                                                    color: isActive ? 'white' : isCurrent ? 'var(--accent)' : 'var(--text-2)',
                                                    cursor: 'pointer', transition: 'all 0.12s',
                                                }}
                                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={nextMonth} style={{
                        width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)',
                        background: 'var(--bg-elevated)', color: 'var(--text-2)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                    }}>→</button>
                </div>
            </div>

            {/* ── Month Grid ── */}
            <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)',
            }}>
                {/* Weekday headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '6px' }}>
                    {WEEKDAYS.map(d => (
                        <div key={d} style={{
                            textAlign: 'center', fontSize: '10px', fontWeight: 700,
                            color: 'var(--text-3)', textTransform: 'uppercase', padding: '4px 0',
                            letterSpacing: '0.06em',
                        }}>{d}</div>
                    ))}
                </div>

                {/* Day cells */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
                    {/* Leading padding */}
                    {Array.from({ length: firstDayOffset }, (_, i) => (
                        <div key={`pad-${i}`} style={{ padding: '14px 0' }} />
                    ))}

                    {/* Actual days */}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const isToday = isCurrentMonth && day === today;
                        const isSelected = day === selectedDay;
                        const isFuture = isCurrentMonth && day > today;
                        const dayItems = itemsByDay[day] || [];
                        const hasItems = dayItems.length > 0;

                        // Get unique types present this day for dot indicators
                        const typesPresent = [...new Set(dayItems.map(it => it.event_type || 'event'))];

                        return (
                            <div
                                key={day}
                                onClick={() => handleDayClick(day)}
                                style={{
                                    padding: '10px 0', borderRadius: '8px',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', gap: '3px',
                                    cursor: 'pointer',
                                    background: isSelected ? 'var(--accent)' : isToday ? 'rgba(245,166,35,0.12)' : 'transparent',
                                    border: isToday && !isSelected ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent',
                                    color: isSelected ? 'white' : isFuture ? 'var(--text-3)' : 'var(--text-1)',
                                    fontWeight: isToday || isSelected ? 800 : 500,
                                    fontSize: '12px',
                                    opacity: isFuture ? 0.65 : 1,
                                    transition: 'all 0.12s',
                                    position: 'relative',
                                }}
                                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                                onMouseLeave={e => {
                                    if (!isSelected) e.currentTarget.style.background = isToday ? 'rgba(245,166,35,0.12)' : 'transparent';
                                }}
                            >
                                {day}
                                {/* Item dots */}
                                {hasItems && (
                                    <div style={{ display: 'flex', gap: '2px', position: 'absolute', bottom: '3px' }}>
                                        {typesPresent.slice(0, 3).map(type => (
                                            <div key={type} style={{
                                                width: '4px', height: '4px', borderRadius: '50%',
                                                background: isSelected ? 'rgba(255,255,255,0.8)' : (TYPE_CONFIG[type]?.color || '#888'),
                                            }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Day Detail Panel ── */}
            {selectedDay && (
                <div ref={dayPanelRef} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: '16px', padding: '20px 22px', boxShadow: 'var(--shadow-sm)',
                }}>
                    {/* Day header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>
                            {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('en-US', {
                                weekday: 'long', month: 'short', day: 'numeric'
                            })}
                        </div>
                        <button
                            onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: '', eventType: 'event', startTime: '09:00', endTime: '10:00', allDay: false }); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                                background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer',
                            }}
                        >
                            <span style={{ fontSize: '14px' }}>+</span> Add
                        </button>
                    </div>

                    {/* Items list */}
                    {selectedItems.length === 0 && !showForm ? (
                        <div style={{
                            padding: '32px 20px', textAlign: 'center',
                            border: '1px dashed var(--border)', borderRadius: '12px',
                        }}>
                            <div style={{ fontSize: '20px', marginBottom: '8px' }}>📭</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)' }}>Nothing scheduled</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' }}>
                                Click + Add to create an event, task, or reminder
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {selectedItems.map(item => (
                                <CalendarItem
                                    key={item.id}
                                    item={item}
                                    onToggle={handleToggleComplete}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}

                    {/* Add/Edit form */}
                    {showForm && (
                        <div style={{ marginTop: selectedItems.length ? '12px' : '0' }}>
                            <ItemForm
                                formData={formData}
                                setFormData={setFormData}
                                onSubmit={handleSubmit}
                                onCancel={resetForm}
                                isEditing={!!editingId}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* ── Upcoming Strip ── */}
            {upcomingItems.length > 0 && !selectedDay && (
                <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: '16px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)',
                }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '12px' }}>
                        Upcoming
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {upcomingItems.map(item => {
                            const cfg = TYPE_CONFIG[item.event_type] || TYPE_CONFIG.event;
                            const dt = new Date(item.start_time);
                            const dateLabel = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            const timeLabel = item.all_day ? 'All day' : dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                                <div key={item.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '8px 12px', borderRadius: '8px',
                                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                                }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.title}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, flexShrink: 0, textAlign: 'right' }}>
                                        <div>{dateLabel}</div>
                                        <div>{timeLabel}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Quick add (when no day selected) ── */}
            {!selectedDay && (
                <div style={{
                    background: 'var(--bg-card)', border: '1px dashed var(--border)',
                    borderRadius: '16px', padding: '20px', textAlign: 'center',
                }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600 }}>
                        Select a day on the calendar to view details or add items
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalCalendar;
