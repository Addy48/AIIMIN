import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { insertRow } from '../services/dbService';

const RemindersWidget = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('note'); // 'note' or 'reminder'
    const [text, setText] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [timeHour, setTimeHour] = useState('8');
    const [timeMinute, setTimeMinute] = useState('00');
    const [timePeriod, setTimePeriod] = useState('AM');
    const [isSaving, setIsSaving] = useState(false);

    // Local Draft Autosave
    useEffect(() => {
        const draft = localStorage.getItem('aiimin_draft_note');
        if (draft && !text) {
            setText(draft);
        }

        // Adaptive Nudge Logic
        const lastVisit = localStorage.getItem('aiimin_last_visit');
        const now = Date.now();
        if (lastVisit && (now - parseInt(lastVisit)) > 3 * 24 * 60 * 60 * 1000) {
            // 3+ days inactive
            const existing = JSON.parse(localStorage.getItem('aiimin_reminders') || '[]');
            const hasWelcomeBack = existing.some(r => r.text.includes("Welcome back"));
            if (!hasWelcomeBack) {
                existing.push({ id: now, text: "Welcome back! Take 5 minutes today to reconnect with your goals.", completed: false });
                localStorage.setItem('aiimin_reminders', JSON.stringify(existing));
            }
        }
        localStorage.setItem('aiimin_last_visit', now.toString());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (text) {
            localStorage.setItem('aiimin_draft_note', text);
        } else {
            localStorage.removeItem('aiimin_draft_note');
        }
    }, [text]);

    const handleSave = async () => {
        if (!text.trim()) return;
        setIsSaving(true);

        try {
            const noteData = {
                content: text.trim(),
                type: mode,
                title: text.trim().slice(0, 60),
            };

            if (mode === 'reminder' && timeHour) {
                // Convert 12h → 24h for ISO
                let hour24 = parseInt(timeHour, 10);
                if (timePeriod === 'AM' && hour24 === 12) hour24 = 0;
                if (timePeriod === 'PM' && hour24 !== 12) hour24 += 12;
                const hStr = String(hour24).padStart(2, '0');
                const today = new Date().toISOString().split('T')[0];
                noteData.reminder_time = new Date(`${today}T${hStr}:${timeMinute}:00`).toISOString();
            }

            await insertRow('notes', [{ ...noteData, user_id: user?.id }]);

            setText('');
            setReminderTime('');
            setTimeHour('8');
            setTimeMinute('00');
            setTimePeriod('AM');
            setIsOpen(false);
            localStorage.removeItem('aiimin_draft_note');
        } catch (e) {
            console.error("Save failed", e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {/* Sticky FAB */}
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed', bottom: '32px', right: '32px', zIndex: 9998,
                    width: '56px', height: '56px', borderRadius: '28px',
                    background: 'var(--accent)', color: 'white', border: 'none',
                    boxShadow: '0 8px 32px rgba(245,166,35,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'transform 0.2s',
                    transform: isOpen ? 'scale(0)' : 'scale(1)'
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                </svg>
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(4px)', zIndex: 9999,
                        animation: 'fadeIn 0.2s ease forwards'
                    }}
                />
            )}

            {/* Bottom Sheet */}
            <div style={{
                position: 'fixed', bottom: 0, left: '50%',
                width: '100%', maxWidth: '600px', background: 'var(--bg-card)',
                borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                padding: '32px', zIndex: 10000, boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border)', borderBottom: 'none',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isOpen ? 'translate(-50%, 0)' : 'translate(-50%, 100%)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)' }}>Quick Add</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Mode Toggle */}
                <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
                    <button
                        onClick={() => setMode('note')}
                        style={{
                            flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                            background: mode === 'note' ? 'var(--bg-card)' : 'transparent',
                            color: mode === 'note' ? 'var(--text-1)' : 'var(--text-3)',
                            fontWeight: mode === 'note' ? 700 : 500,
                            boxShadow: mode === 'note' ? 'var(--shadow-sm)' : 'none',
                            cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px'
                        }}
                    >
                        Note
                    </button>
                    <button
                        onClick={() => setMode('reminder')}
                        style={{
                            flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                            background: mode === 'reminder' ? 'var(--bg-card)' : 'transparent',
                            color: mode === 'reminder' ? 'var(--text-1)' : 'var(--text-3)',
                            fontWeight: mode === 'reminder' ? 700 : 500,
                            boxShadow: mode === 'reminder' ? 'var(--shadow-sm)' : 'none',
                            cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px'
                        }}
                    >
                        Reminder
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={mode === 'note' ? 'Jot down a quick thought...' : 'Remind me to...'}
                        autoFocus
                        style={{
                            width: '100%', height: '120px', padding: '16px', borderRadius: '12px',
                            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                            color: 'var(--text-1)', fontSize: '15px', resize: 'none', outline: 'none',
                            lineHeight: 1.5
                        }}
                    />

                    {mode === 'reminder' && (
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '10px', display: 'block', letterSpacing: '0.04em', textTransform: 'uppercase' }}>When?</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                {/* Hour */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textAlign: 'center', letterSpacing: '0.06em' }}>HOUR</span>
                                    <select
                                        value={timeHour}
                                        onChange={(e) => setTimeHour(e.target.value)}
                                        className="reminder-input"
                                        style={{ color: timeHour ? 'var(--text-1)' : 'var(--text-3)' }}
                                    >
                                        <option value="" disabled>--</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                                            <option key={h} value={String(h)}>{String(h).padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Minute */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textAlign: 'center', letterSpacing: '0.06em' }}>MIN</span>
                                    <select
                                        value={timeMinute}
                                        onChange={(e) => setTimeMinute(e.target.value)}
                                        className="reminder-input"
                                        style={{ color: 'var(--text-1)' }}
                                    >
                                        {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* AM / PM */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textAlign: 'center', letterSpacing: '0.06em' }}>AM/PM</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '48px', justifyContent: 'center' }}>
                                        {['AM', 'PM'].map(p => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setTimePeriod(p)}
                                                style={{
                                                    flex: 1, borderRadius: '8px', border: 'none',
                                                    background: timePeriod === p ? 'var(--accent)' : 'var(--bg-elevated)',
                                                    color: timePeriod === p ? '#fff' : 'var(--text-3)',
                                                    fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                                                    transition: 'all 0.15s'
                                                }}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Preview line */}
                            {timeHour && (
                                <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>
                                    ⏰ {String(timeHour).padStart(2, '0')}:{timeMinute} {timePeriod}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={isSaving || !text.trim()}
                        style={{
                            width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                            background: 'var(--accent)', color: 'white', fontWeight: 800, fontSize: '15px',
                            cursor: isSaving || !text.trim() ? 'not-allowed' : 'pointer',
                            opacity: isSaving || !text.trim() ? 0.5 : 1, transition: 'all 0.2s', marginTop: '8px',
                            boxShadow: '0 4px 16px rgba(245,166,35,0.25)'
                        }}
                    >
                        {isSaving ? 'Saving...' : `Save ${mode === 'note' ? 'Note' : 'Reminder'}`}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default RemindersWidget;
