import React, { useState, useEffect, useRef, useCallback } from 'react';
import supabase from '../../utils/supabase';
import { insertRow, updateRow } from '../../services/dbService';
import toast from '../../utils/toast';

/* ── Context-aware prompts based on time of day ── */
const getPlaceholder = () => {
    const h = new Date().getHours();
    if (h < 6)  return 'Late night thought...';
    if (h < 10) return "What's your #1 focus today?";
    if (h < 14) return 'Quick thought or task...';
    if (h < 18) return 'Capture before you forget...';
    if (h < 21) return 'How did today go?';
    return 'Anything on your mind before bed?';
};

const getContextHint = (hasFocus, todayCount, pendingReminders) => {
    const h = new Date().getHours();
    if (hasFocus) return { icon: '🎯', text: 'Focus session active — capture without breaking flow' };
    if (h < 10 && todayCount === 0) return { icon: '🌅', text: 'Start your day with an intention' };
    if (h >= 21 && todayCount > 0) return { icon: '🌙', text: `${todayCount} captures today — nice journaling` };
    if (pendingReminders > 0) return { icon: '🔔', text: `${pendingReminders} reminder${pendingReminders > 1 ? 's' : ''} pending` };
    if (todayCount === 0) return { icon: '✏️', text: 'Your thought parking lot — dump ideas here' };
    return null;
};

const TAG_OPTIONS = [
    { key: 'idea',       emoji: '💡', label: 'Idea' },
    { key: 'todo',       emoji: '☐',  label: 'To-do' },
    { key: 'reflection', emoji: '🪞', label: 'Reflect' },
    { key: 'reminder',   emoji: '🔔', label: 'Remind' },
];

const QuickCapture = ({ user }) => {
    const [notes, setNotes] = useState([]);
    const [text, setText] = useState('');
    const [activeTag, setActiveTag] = useState('idea');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const inputRef = useRef(null);

    const hasFocus = localStorage.getItem('aiimin_pomodoro_active') === 'true';

    /* ── Fetch today's notes + pending reminders ── */
    const fetchNotes = useCallback(async () => {
        if (!user?.id) return;
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Auto-cleanup: delete completed notes older than 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        supabase
            .from('notes')
            .delete()
            .eq('user_id', user.id)
            .eq('completed', true)
            .lt('created_at', sevenDaysAgo.toISOString())
            .then(() => {}); // fire-and-forget

        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id)
            .or(`created_at.gte.${todayStart.toISOString()},and(type.eq.reminder,completed.eq.false)`)
            .order('created_at', { ascending: false })
            .limit(20);

        if (!error) setNotes(data || []);
        setLoading(false);
    }, [user?.id]);

    useEffect(() => { fetchNotes(); }, [fetchNotes]);

    // Listen for pomodoro toggle
    useEffect(() => {
        const handler = () => fetchNotes();
        window.addEventListener('aiimin_pomodoro_toggled', handler);
        return () => window.removeEventListener('aiimin_pomodoro_toggled', handler);
    }, [fetchNotes]);

    /* ── Derived data ── */
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayNotes = notes.filter(n => new Date(n.created_at) >= todayStart);
    const pendingReminders = notes.filter(n => n.type === 'reminder' && !n.completed);
    const allDisplayed = expanded ? notes : notes.slice(0, 4);
    const contextHint = getContextHint(hasFocus, todayNotes.length, pendingReminders.length);

    /* ── Save ── */
    const handleSave = async () => {
        if (!text.trim() || !user?.id) return;
        setSaving(true);
        try {
            const isReminder = activeTag === 'reminder';
            const noteData = {
                user_id: user.id,
                content: text.trim(),
                title: text.trim().slice(0, 80),
                type: isReminder ? 'reminder' : 'note',
            };

            // For reminders, set reminder_time to 1 hour from now
            if (isReminder) {
                const reminderTime = new Date(Date.now() + 60 * 60 * 1000);
                noteData.reminder_time = reminderTime.toISOString();
            }

            // Store the tag in linked_event_id field (repurposed as tag)
            if (!isReminder) {
                noteData.linked_event_id = activeTag;
            }

            await insertRow('notes', noteData);
            setText('');
            toast.success('Captured');
            fetchNotes();
        } catch {
            toast.error('Save failed');
        } finally {
            setSaving(false);
        }
    };

    /* ── Toggle complete ── */
    const handleToggle = async (note) => {
        try {
            await updateRow('notes', { completed: !note.completed }, 'id', note.id);
            fetchNotes();
        } catch {
            toast.error('Update failed');
        }
    };

    /* ── Clear all completed notes ── */
    const handleClearCompleted = async () => {
        const completed = notes.filter(n => n.completed);
        if (completed.length === 0) return;
        try {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('user_id', user.id)
                .eq('completed', true);
            if (error) throw error;
            toast.success(`Cleared ${completed.length} note${completed.length > 1 ? 's' : ''}`);
            fetchNotes();
        } catch {
            toast.error('Clear failed');
        }
    };

    /* ── Tag/type display helper ── */
    const getNoteTag = (note) => {
        if (note.type === 'reminder') return TAG_OPTIONS.find(t => t.key === 'reminder');
        const tag = TAG_OPTIONS.find(t => t.key === note.linked_event_id);
        return tag || TAG_OPTIONS[0]; // default to idea
    };

    const timeAgo = (dateStr) => {
        const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* ── Context hint ── */}
            {contextHint && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 12px', borderRadius: 'var(--r-sm)',
                    background: 'var(--color-elevated)', border: '1px solid var(--color-border)',
                }}>
                    <span style={{ fontSize: '12px' }}>{contextHint.icon}</span>
                    <span className="text-subtext" style={{ color: 'var(--color-text-3)' }}>
                        {contextHint.text}
                    </span>
                </div>
            )}

            {/* ── Input area ── */}
            <div style={{
                background: 'var(--color-elevated)',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder={getPlaceholder()}
                        onKeyDown={e => { if (e.key === 'Enter' && text.trim()) handleSave(); }}
                        style={{
                            flex: 1, padding: '12px 14px', background: 'transparent',
                            border: 'none', outline: 'none', color: 'var(--color-text-1)',
                            font: 'var(--text-body)',
                        }}
                    />
                    <button
                        onClick={handleSave}
                        disabled={!text.trim() || saving}
                        style={{
                            padding: '7px 14px', margin: '4px', borderRadius: 'var(--r-sm)',
                            border: text.trim() ? '1px solid var(--color-accent)' : '1px solid transparent',
                            cursor: text.trim() ? 'pointer' : 'default',
                            background: 'transparent',
                            color: text.trim() ? 'var(--color-accent)' : 'var(--color-text-3)',
                            font: '500 10px/1 var(--font-mono)',
                            letterSpacing: '0.06em',
                            transition: `all var(--dur-enter) var(--ease)`,
                            opacity: saving ? 0.6 : 1,
                        }}
                    >
                        {saving ? '...' : 'Save'}
                    </button>
                </div>

                {/* Tag pills */}
                <div style={{ display: 'flex', gap: '4px', padding: '0 10px 10px' }}>
                    {TAG_OPTIONS.map(tag => (
                        <button
                            key={tag.key}
                            onClick={() => setActiveTag(tag.key)}
                            style={{
                                padding: '3px 10px',
                                borderRadius: 'var(--r-pill)',
                                font: '500 10px/1 var(--font-mono)',
                                letterSpacing: '0.04em',
                                border: activeTag === tag.key
                                    ? '1px solid var(--color-accent)'
                                    : '1px solid var(--color-border)',
                                background: activeTag === tag.key
                                    ? 'var(--color-accent-dim)'
                                    : 'transparent',
                                color: activeTag === tag.key
                                    ? 'var(--color-accent)'
                                    : 'var(--color-text-3)',
                                cursor: 'pointer',
                                transition: `all var(--dur-fast) var(--ease)`,
                                display: 'flex', alignItems: 'center', gap: '4px',
                            }}
                        >
                            <span>{tag.emoji}</span>
                            {tag.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Notes feed ── */}
            {loading ? (
                <span className="text-subtext" style={{ padding: '8px 0', color: 'var(--color-text-3)' }}>Loading...</span>
            ) : allDisplayed.length === 0 ? (
                <div style={{
                    padding: '20px', textAlign: 'center',
                    border: '1px dashed var(--color-border)',
                    borderRadius: 'var(--r-md)',
                }}>
                    <span className="text-subtext" style={{ color: 'var(--color-text-3)' }}>
                        No captures yet today. Type above.
                    </span>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {allDisplayed.map(note => {
                        const tag = getNoteTag(note);
                        const isDone = note.completed;
                        return (
                            <div
                                key={note.id}
                                onClick={() => handleToggle(note)}
                                style={{
                                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                                    padding: '10px 12px',
                                    borderRadius: 'var(--r-sm)',
                                    cursor: 'pointer',
                                    background: isDone ? 'transparent' : 'var(--color-elevated)',
                                    border: isDone ? '1px solid transparent' : '1px solid var(--color-border)',
                                    opacity: isDone ? 0.45 : 1,
                                    transition: `all var(--dur-enter) var(--ease)`,
                                }}
                            >
                                {/* Checkbox */}
                                <div style={{
                                    width: '14px', height: '14px',
                                    borderRadius: 'var(--r-none)',
                                    flexShrink: 0, marginTop: '1px',
                                    border: isDone ? 'none' : '1.5px solid var(--color-text-3)',
                                    background: isDone ? 'var(--color-accent)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: `all var(--dur-fast) var(--ease)`,
                                }}>
                                    {isDone && (
                                        <svg width="8" height="6" viewBox="0 0 9 7" fill="none">
                                            <path d="M1 3L3.5 5.5L8 1" stroke="var(--color-base)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        font: 'var(--text-body)',
                                        color: 'var(--color-text-1)',
                                        textDecoration: isDone ? 'line-through' : 'none',
                                        wordBreak: 'break-word',
                                    }}>
                                        {note.content}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                                        <span style={{ font: '500 9px/1 var(--font-mono)', color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            {tag.label}
                                        </span>
                                        <span className="text-subtext" style={{ color: 'var(--color-text-3)' }}>·</span>
                                        <span className="text-subtext" style={{ color: 'var(--color-text-3)' }}>
                                            {timeAgo(note.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Show more / less + Clear completed */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '4px 0' }}>
                        {notes.length > 4 && (
                            <button
                                onClick={() => setExpanded(e => !e)}
                                style={{
                                    padding: '4px', background: 'none', border: 'none',
                                    color: 'var(--color-accent)',
                                    font: '500 10px/1 var(--font-mono)',
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                }}
                            >
                                {expanded ? 'Show less' : `+${notes.length - 4} more`}
                            </button>
                        )}
                        {notes.some(n => n.completed) && (
                            <>
                                {notes.length > 4 && <span className="text-subtext" style={{ color: 'var(--color-text-3)' }}>·</span>}
                                <button
                                    onClick={handleClearCompleted}
                                    style={{
                                        padding: '4px', background: 'none', border: 'none',
                                        color: 'var(--color-text-3)',
                                        font: '300 10px/1 var(--font-sans)',
                                        cursor: 'pointer', transition: `color var(--dur-fast) var(--ease)`,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-alert-red)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-3)'}
                                >
                                    Clear done ({notes.filter(n => n.completed).length})
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── Today's pulse ── */}
            {todayNotes.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '4px 0' }}>
                    {[
                        { label: 'Captured', val: todayNotes.length, color: 'var(--color-text-1)' },
                        { label: 'Ideas', val: todayNotes.filter(n => n.linked_event_id === 'idea').length, color: 'var(--color-warning)' },
                        { label: 'Done', val: todayNotes.filter(n => n.completed).length, color: 'var(--color-accent)' },
                    ].map(stat => (
                        <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ font: '300 16px/1 var(--font-sans)', color: stat.color }}>{stat.val}</span>
                            <span className="text-label" style={{ color: 'var(--color-text-3)' }}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Storage indicator ── */}
            {notes.length > 0 && (
                <span className="text-subtext" style={{ color: 'var(--color-text-3)', paddingBottom: '4px' }}>
                    {notes.length} note{notes.length !== 1 ? 's' : ''} — completed auto-clear after 7 days
                </span>
            )}
        </div>
    );
};

export default QuickCapture;
