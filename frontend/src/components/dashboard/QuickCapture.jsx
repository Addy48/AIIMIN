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
                    padding: '8px 12px', borderRadius: '10px',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                }}>
                    <span style={{ fontSize: '14px' }}>{contextHint.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', lineHeight: 1.4 }}>
                        {contextHint.text}
                    </span>
                </div>
            )}

            {/* ── Input area ── */}
            <div style={{
                background: 'var(--bg-elevated)', borderRadius: '12px',
                border: '1px solid var(--border)', overflow: 'hidden',
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
                            border: 'none', outline: 'none', color: 'var(--text-1)',
                            fontSize: '13px', fontWeight: 500,
                        }}
                    />
                    <button
                        onClick={handleSave}
                        disabled={!text.trim() || saving}
                        style={{
                            padding: '8px 14px', margin: '4px', borderRadius: '8px',
                            border: 'none', cursor: text.trim() ? 'pointer' : 'default',
                            background: text.trim() ? 'var(--accent)' : 'transparent',
                            color: text.trim() ? 'white' : 'var(--text-3)',
                            fontSize: '12px', fontWeight: 700, transition: 'all 0.15s',
                            opacity: saving ? 0.6 : 1,
                        }}
                    >
                        {saving ? '...' : '↵'}
                    </button>
                </div>

                {/* Tag pills — only show when input has focus or text */}
                <div style={{
                    display: 'flex', gap: '4px', padding: '0 10px 10px',
                }}>
                    {TAG_OPTIONS.map(tag => (
                        <button
                            key={tag.key}
                            onClick={() => setActiveTag(tag.key)}
                            style={{
                                padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700,
                                border: activeTag === tag.key ? '1px solid var(--accent)' : '1px solid var(--border)',
                                background: activeTag === tag.key ? 'rgba(255,107,53,0.08)' : 'transparent',
                                color: activeTag === tag.key ? 'var(--accent)' : 'var(--text-3)',
                                cursor: 'pointer', transition: 'all 0.12s',
                                display: 'flex', alignItems: 'center', gap: '4px',
                            }}
                        >
                            <span style={{ fontSize: '11px' }}>{tag.emoji}</span>
                            {tag.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Notes feed ── */}
            {loading ? (
                <div style={{ fontSize: '11px', color: 'var(--text-3)', padding: '8px 0' }}>Loading...</div>
            ) : allDisplayed.length === 0 ? (
                <div style={{
                    padding: '16px', textAlign: 'center',
                    border: '1px dashed var(--border)', borderRadius: '10px',
                }}>
                    <div style={{ fontSize: '16px', marginBottom: '6px' }}>📝</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, lineHeight: 1.5 }}>
                        No captures yet today.<br />
                        Type above to save a thought, task, or reminder.
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {allDisplayed.map(note => {
                        const tag = getNoteTag(note);
                        const isDone = note.completed;
                        return (
                            <div
                                key={note.id}
                                onClick={() => handleToggle(note)}
                                style={{
                                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                                    padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                                    background: isDone ? 'transparent' : 'var(--bg-elevated)',
                                    border: isDone ? '1px solid transparent' : '1px solid var(--border)',
                                    opacity: isDone ? 0.5 : 1, transition: 'all 0.15s',
                                }}
                            >
                                {/* Checkbox */}
                                <div style={{
                                    width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
                                    marginTop: '1px',
                                    border: isDone ? 'none' : '2px solid var(--text-3)',
                                    background: isDone ? 'var(--accent)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.12s',
                                }}>
                                    {isDone && <span style={{ color: 'white', fontSize: '10px', fontWeight: 800 }}>✓</span>}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '12px', fontWeight: 600, color: 'var(--text-1)',
                                        textDecoration: isDone ? 'line-through' : 'none',
                                        lineHeight: 1.4, wordBreak: 'break-word',
                                    }}>
                                        {note.content}
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px',
                                    }}>
                                        <span style={{ fontSize: '10px' }}>{tag.emoji}</span>
                                        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)' }}>
                                            {tag.label}
                                        </span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>·</span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                                            {timeAgo(note.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Show more / less + Clear completed */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '2px 0' }}>
                        {notes.length > 4 && (
                            <button
                                onClick={() => setExpanded(e => !e)}
                                style={{
                                    padding: '6px', background: 'none', border: 'none',
                                    color: 'var(--accent)', fontSize: '11px', fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                {expanded ? 'Show less' : `Show ${notes.length - 4} more`}
                            </button>
                        )}
                        {notes.some(n => n.completed) && (
                            <>
                                {notes.length > 4 && <span style={{ color: 'var(--text-3)', fontSize: '10px' }}>·</span>}
                                <button
                                    onClick={handleClearCompleted}
                                    style={{
                                        padding: '6px', background: 'none', border: 'none',
                                        color: 'var(--text-3)', fontSize: '11px', fontWeight: 600,
                                        cursor: 'pointer', transition: 'color 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
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
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
                    padding: '8px 0',
                }}>
                    {[
                        { label: 'Captured', val: todayNotes.length, color: 'var(--text-1)' },
                        { label: 'Ideas', val: todayNotes.filter(n => n.linked_event_id === 'idea').length, color: '#f5a623' },
                        { label: 'Done', val: todayNotes.filter(n => n.completed).length, color: '#10b981' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: s.color }}>{s.val}</div>
                            <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Storage indicator ── */}
            {notes.length > 0 && (
                <div style={{
                    textAlign: 'center', fontSize: '10px', fontWeight: 600,
                    color: 'var(--text-3)', padding: '0 0 4px',
                }}>
                    {notes.length} note{notes.length !== 1 ? 's' : ''} loaded · completed auto-clear after 7 days
                </div>
            )}
        </div>
    );
};

export default QuickCapture;
