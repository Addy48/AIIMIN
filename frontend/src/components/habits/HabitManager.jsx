/**
 * HabitManager.jsx
 *
 * Create, browse, and archive individual habits.
 * Each habit has a user-picked emoji, name, and frequency.
 * Habits can then be added to routines via HabitsWidget.
 */
import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../../utils/supabase';
import { insertRow, updateRow } from '../../services/dbService';
import toast from '../../utils/toast';

// ─── Emoji picker options ──────────────────────────────────────────────────────
const EMOJI_OPTIONS = [
    '🏋️‍♂️', '🏃‍♂️', '🧘‍♂️', '🚴‍♂️', '🏊‍♂️', '🤸‍♂️', '🚶‍♂️', '💊',
    '💧', '🥗', '🥩', '😴', '📚', '✍️', '💻', '🧠',
    '🎯', '🔥', '🌅', '🌿', '🎵', '📝', '⏰', '💆‍♂️',
];

const EMOJI_LABELS = {
    '🏋️‍♂️': 'Weightlifting',
    '🏃‍♂️': 'Running',
    '🧘‍♂️': 'Meditation',
    '🚴‍♂️': 'Cycling',
    '🏊‍♂️': 'Swimming',
    '🤸‍♂️': 'Gymnastics',
    '🚶‍♂️': 'Walking',
    '💊':   'Medicine',
    '💧':   'Hydration',
    '🥗':   'Healthy Eating',
    '🥩':   'Protein',
    '😴':   'Sleep',
    '📚':   'Reading',
    '✍️':   'Journaling',
    '💻':   'Coding',
    '🧠':   'Mental Health',
    '🎯':   'Goal / Focus',
    '🔥':   'Streak',
    '🌅':   'Morning Routine',
    '🌿':   'Mindfulness',
    '🎵':   'Music',
    '📝':   'Notes',
    '⏰':   'Schedule',
    '💆‍♂️': 'Relaxation',
};

const CATEGORIES = [
    { key: 'fitness',      label: 'Fitness',      icon: '🏋️' },
    { key: 'skincare',     label: 'Skincare',     icon: '🧴' },
    { key: 'learning',     label: 'Learning',     icon: '📚' },
    { key: 'health',       label: 'Health',       icon: '💊' },
    { key: 'mental',       label: 'Mental',       icon: '🧠' },
    { key: 'productivity', label: 'Productivity', icon: '⚡' },
    { key: 'general',      label: 'General',      icon: '🎯' },
];

const FREQUENCIES = [
    { key: 'morning',        label: 'Morning' },
    { key: 'night',          label: 'Night' },
    { key: 'morning+night',  label: 'Morning + Night' },
    { key: 'daily',          label: 'Daily' },
    { key: 'weekdays',       label: 'Weekdays' },
    { key: '3x/week',        label: '3x / week' },
    { key: 'weekly',         label: 'Weekly' },
    { key: 'custom',         label: 'Custom' },
];

const CATEGORY_FILTER_ALL = '__all__';

export default function HabitManager({ user }) {
    const [habits, setHabits]       = useState([]);
    const [routines, setRoutines]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [showForm, setShowForm]   = useState(false);
    const [filterCat, setFilterCat] = useState(CATEGORY_FILTER_ALL);

    // Form state
    const [name, setName]           = useState('');
    const [emoji, setEmoji]         = useState('🎯');
    const [category, setCategory]   = useState('general');
    const [frequency, setFrequency] = useState('daily');
    const [saving, setSaving]       = useState(false);
    // Step 2: routine assignment
    const [step, setStep]           = useState(1);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [hoveredEmoji, setHoveredEmoji]       = useState(null);

    const fetchHabits = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const [habitsRes, routinesRes] = await Promise.all([
            supabase.from('habits')
                .select('id, name, emoji, category, frequency, created_at')
                .eq('user_id', user.id).eq('status', 'active')
                .order('created_at', { ascending: true }),
            supabase.from('routines')
                .select('id, name, time_of_day')
                .eq('user_id', user.id).order('created_at', { ascending: true }),
        ]);
        setHabits(habitsRes.data || []);
        setRoutines(routinesRes.data || []);
        setLoading(false);
    }, [user]);

    useEffect(() => { fetchHabits(); }, [fetchHabits]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        // Step 1 → Move to routine assignment step
        if (step === 1 && routines.length > 0) {
            setStep(2);
            return;
        }

        setSaving(true);
        try {
            const data = await insertRow('habits', [{
                user_id:   user.id,
                name:      name.trim(),
                emoji,
                frequency: frequency,
                category,
            }]);
            if (data?.[0]) {
                // If routine selected, add habit to that routine
                if (selectedRoutine && data[0].id) {
                    await insertRow('routine_habits', [{
                        routine_id: selectedRoutine,
                        habit_id:   data[0].id,
                        position:   999, // append at end
                    }]);
                }
                setHabits(prev => [...prev, data[0]]);
                resetForm();
            }
        } catch (err) {
            toast.error('Failed to save habit: ' + err.message);
        }
        setSaving(false);
    };

    const resetForm = () => {
        setName(''); setEmoji('🎯'); setCategory('general');
        setFrequency('daily'); setShowForm(false);
        setStep(1); setSelectedRoutine(null);
    };

    const handleArchive = async (id) => {
        await updateRow('habits', { status: 'archived' }, 'id', id, 'user_id', user.id);
        setHabits(prev => prev.filter(h => h.id !== id));
    };

    if (!user) return null;

    const filteredHabits = filterCat === CATEGORY_FILTER_ALL
        ? habits
        : habits.filter(h => h.category === filterCat);

    const getCatMeta = (key) => CATEGORIES.find(c => c.key === key) || CATEGORIES[CATEGORIES.length - 1];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* ── Category filter pills ── */}
            {habits.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <button
                        onClick={() => setFilterCat(CATEGORY_FILTER_ALL)}
                        style={{
                            padding: '4px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 600,
                            border: `1px solid ${filterCat === CATEGORY_FILTER_ALL ? 'var(--accent)' : 'var(--border)'}`,
                            background: filterCat === CATEGORY_FILTER_ALL ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)',
                            color: filterCat === CATEGORY_FILTER_ALL ? 'var(--accent)' : 'var(--text-3)',
                            cursor: 'pointer', transition: 'all 0.15s',
                        }}
                    >
                        All ({habits.length})
                    </button>
                    {CATEGORIES.filter(c => habits.some(h => h.category === c.key)).map(c => (
                        <button
                            key={c.key}
                            onClick={() => setFilterCat(c.key)}
                            style={{
                                padding: '4px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 600,
                                border: `1px solid ${filterCat === c.key ? 'var(--accent)' : 'var(--border)'}`,
                                background: filterCat === c.key ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)',
                                color: filterCat === c.key ? 'var(--accent)' : 'var(--text-3)',
                                cursor: 'pointer', transition: 'all 0.15s',
                                display: 'flex', alignItems: 'center', gap: '3px',
                            }}
                        >
                            <span style={{ fontSize: '11px' }}>{c.icon}</span> {c.label}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Habits list ── */}
            {loading ? (
                <p style={{ fontSize: '12px', color: 'var(--text-3)', padding: '8px 0' }}>Loading…</p>
            ) : filteredHabits.length === 0 && !showForm ? (
                <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>
                    {habits.length === 0 ? 'No habits yet — add your first one below.' : 'No habits in this category.'}
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filteredHabits.map(h => {
                        const catMeta = getCatMeta(h.category);
                        return (
                            <div
                                key={h.id}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '10px 14px', borderRadius: '12px',
                                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                    transition: 'border-color 0.15s',
                                }}
                            >
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '18px', flexShrink: 0,
                                }}>
                                    {h.emoji || '🎯'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>
                                        {h.name}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                        <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 500, textTransform: 'capitalize' }}>
                                            {h.frequency}
                                        </span>
                                        <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>·</span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span style={{ fontSize: '10px' }}>{catMeta.icon}</span> {catMeta.label}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleArchive(h.id)}
                                    title="Archive habit"
                                    style={{
                                        fontSize: '12px', color: 'var(--text-3)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: '4px 8px', borderRadius: '6px',
                                        transition: 'color 0.15s',
                                    }}
                                    onMouseEnter={e => e.target.style.color = 'var(--danger)'}
                                    onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Create form ── */}
            {showForm ? (
                <div style={{
                    background: 'var(--bg-card)', borderRadius: '14px',
                    padding: '20px', border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '16px' }}>
                        {step === 1 ? 'New Habit' : 'Add to Routine?'}
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleCreate}>
                            {/* ── Two-column layout ── */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 240px',
                                gap: '20px',
                                alignItems: 'start',
                            }}>
                                {/* LEFT: name / category / frequency */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                                    {/* Habit name — visually dominant */}
                                    <div>
                                        <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                                            Habit Name
                                        </label>
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="e.g. Morning workout, Read 20 pages"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            required
                                            style={{
                                                width: '100%', padding: '10px 14px', borderRadius: '8px', boxSizing: 'border-box',
                                                border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                                                color: 'var(--text-1)', fontSize: '16px', fontWeight: 600,
                                                outline: 'none',
                                            }}
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                                            Category
                                        </label>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {CATEGORIES.map(c => (
                                                <button
                                                    key={c.key}
                                                    type="button"
                                                    onClick={() => setCategory(c.key)}
                                                    style={{
                                                        padding: '5px 12px', borderRadius: '99px',
                                                        fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                                                        border: `1px solid ${category === c.key ? 'var(--accent)' : 'var(--border)'}`,
                                                        background: category === c.key ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)',
                                                        color: category === c.key ? 'var(--accent)' : 'var(--text-3)',
                                                        transition: 'all 0.15s',
                                                        display: 'flex', alignItems: 'center', gap: '4px',
                                                    }}
                                                >
                                                    <span style={{ fontSize: '12px' }}>{c.icon}</span> {c.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Frequency chips */}
                                    <div>
                                        <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                                            Frequency
                                        </label>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {FREQUENCIES.map(f => (
                                                <button
                                                    key={f.key}
                                                    type="button"
                                                    onClick={() => setFrequency(f.key)}
                                                    style={{
                                                        padding: '5px 14px', borderRadius: '99px',
                                                        fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                                                        border: `1px solid ${frequency === f.key ? 'var(--accent)' : 'var(--border)'}`,
                                                        background: frequency === f.key ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)',
                                                        color: frequency === f.key ? 'var(--accent)' : 'var(--text-3)',
                                                        transition: 'all 0.15s',
                                                    }}
                                                >
                                                    {f.label}
                                                </button>
                                    ))}
                                </div>
                            </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            type="submit"
                                            disabled={saving || !name.trim()}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '8px',
                                                background: 'var(--accent)', color: '#fff',
                                                fontWeight: 700, fontSize: '13px', border: 'none',
                                                cursor: (saving || !name.trim()) ? 'not-allowed' : 'pointer',
                                                opacity: (saving || !name.trim()) ? 0.6 : 1,
                                            }}
                                        >
                                            {routines.length > 0 ? 'Next →' : (saving ? 'Saving…' : `${emoji} Add Habit`)}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            style={{
                                                padding: '10px 18px', borderRadius: '8px',
                                                background: 'var(--bg-elevated)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-3)', fontWeight: 600, fontSize: '13px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>{/* END left column */}

                                {/* RIGHT: compact emoji picker */}
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                                        Icon
                                    </label>
                                    {/* Selected preview / hover label */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        marginBottom: '8px', padding: '6px 10px', borderRadius: '8px',
                                        background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)',
                                        minHeight: '36px',
                                    }}>
                                        <span style={{ fontSize: '22px', lineHeight: 1 }}>{hoveredEmoji || emoji}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500 }}>
                                            {hoveredEmoji ? (EMOJI_LABELS[hoveredEmoji] || hoveredEmoji) : 'selected'}
                                        </span>
                                    </div>
                                    {/* Compact grid */}
                                    <div style={{
                                        maxHeight: '320px',
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        paddingRight: '2px',
                                    }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                                            gap: '6px',
                                        }}>
                                            {EMOJI_OPTIONS.map(em => (
                                                <button
                                                    key={em}
                                                    type="button"
                                                    onClick={() => setEmoji(em)}
                                                        onMouseEnter={e => {
                                                            setHoveredEmoji(em);
                                                            if (emoji !== em) e.currentTarget.style.background = 'var(--bg-card)';
                                                        }}
                                                        onMouseLeave={e => {
                                                            setHoveredEmoji(null);
                                                            if (emoji !== em) e.currentTarget.style.background = 'var(--bg-elevated)';
                                                        }}
                                                    style={{
                                                        width: '40px', height: '40px',
                                                        fontSize: '18px', borderRadius: '8px',
                                                        border: `2px solid ${emoji === em ? 'var(--accent)' : 'transparent'}`,
                                                        background: emoji === em ? 'rgba(255,107,53,0.12)' : 'var(--bg-elevated)',
                                                        cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'all 0.12s',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {em}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>{/* END right column */}
                            </div>{/* END two-column grid */}
                        </form>
                    ) : (
                        /* Step 2: Routine assignment */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: 500 }}>
                                Add <strong>{emoji} {name}</strong> to a routine?
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <button
                                    onClick={() => setSelectedRoutine(null)}
                                    style={{
                                        padding: '10px 14px', borderRadius: '10px', textAlign: 'left',
                                        border: `1px solid ${selectedRoutine === null ? 'var(--accent)' : 'var(--border)'}`,
                                        background: selectedRoutine === null ? 'rgba(255,107,53,0.08)' : 'var(--bg-elevated)',
                                        color: selectedRoutine === null ? 'var(--accent)' : 'var(--text-2)',
                                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                    }}
                                >
                                    Skip — don't add to routine
                                </button>
                                {routines.map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => setSelectedRoutine(r.id)}
                                        style={{
                                            padding: '10px 14px', borderRadius: '10px', textAlign: 'left',
                                            border: `1px solid ${selectedRoutine === r.id ? 'var(--accent)' : 'var(--border)'}`,
                                            background: selectedRoutine === r.id ? 'rgba(255,107,53,0.08)' : 'var(--bg-elevated)',
                                            color: selectedRoutine === r.id ? 'var(--accent)' : 'var(--text-1)',
                                            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                        }}
                                    >
                                        {r.name}
                                        {r.time_of_day && (
                                            <span style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'capitalize' }}>
                                                · {r.time_of_day}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <button
                                    onClick={handleCreate}
                                    disabled={saving}
                                    style={{
                                        flex: 1, padding: '10px', borderRadius: '8px',
                                        background: 'var(--accent)', color: '#fff',
                                        fontWeight: 700, fontSize: '13px', border: 'none',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        opacity: saving ? 0.6 : 1,
                                    }}
                                >
                                    {saving ? 'Saving…' : `${emoji} Create Habit`}
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    style={{
                                        padding: '10px 18px', borderRadius: '8px',
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-3)', fontWeight: 600, fontSize: '13px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ← Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => { setShowForm(true); setStep(1); setSelectedRoutine(null); }}
                    style={{
                        width: '100%', padding: '10px', borderRadius: '10px',
                        border: '1px dashed var(--border-hover)',
                        background: 'transparent', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        fontSize: '12px', fontWeight: 600, color: 'var(--text-3)',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-3)'; }}
                >
                    <span style={{ fontSize: '16px' }}>+</span> Add Habit
                </button>
            )}
        </div>
    );
}
