import React, { useState, useEffect, useCallback, useRef } from 'react';
import MobileHeader from './MobileHeader';
import MobileSaveBar from './MobileSaveBar';
import {
    MobileSleepSection,
    MobileBodySection,
    MobileMindSection,
    MobileTaskSection,
    MobileMoneySection,
    MobileNotesSection,
    MobileWinSection,
    MobileResetSection,
} from './MobileSections';
import { upsertRow, insertRow } from '../../services/dbService';
import supabase from '../../utils/supabase';
import toast from '../../utils/toast';

const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

const DEFAULTS = {
    sleepStart: '', sleepEnd: '',
    gymDone: false, gymDuration: 0,
    breakfastDone: false,
    steps: 0,
    waterBottles: 0,
    mood: 5, energyLevel: 0,
    learningDone: false, learningTopic: '',
    journalEntry: '',
    winText: '',
};

const DRAFT_KEY = 'aiimin_mobile_draft';

function MobileApp({ user }) {
    const [data, setData] = useState({ ...DEFAULTS });
    const [isDirty, setIsDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [streak, setStreak] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const draftTimer = useRef(null);

    // Load today's log
    useEffect(() => {
        if (!user) return;
        const load = async () => {
            // 1. Fetch existing daily log
            const { data: row } = await supabase.from('daily_logs')
                .select('*').eq('user_id', user.id).eq('date', today()).maybeSingle();

            // 2. Check localStorage draft
            let draft = null;
            try {
                const raw = localStorage.getItem(DRAFT_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.date === today() && parsed.userId === user.id) draft = parsed.data;
                }
            } catch { /* ignore */ }

            if (row) {
                setData({
                    sleepStart: row.sleep_start || '',
                    sleepEnd: row.sleep_end || '',
                    gymDone: row.gym_done || false,
                    gymDuration: row.gym_duration || 0,
                    breakfastDone: row.breakfast_done || false,
                    steps: row.steps || 0,
                    waterBottles: row.water_bottles || 0,
                    mood: row.mood || 5,
                    energyLevel: row.energy_level || 0,
                    learningDone: row.learning_done || false,
                    learningTopic: row.learning_topic || '',
                    journalEntry: row.journal_entry || '',
                    winText: '',
                });
            } else if (draft) {
                setData(draft);
                setIsDirty(true);
            }
            setLoaded(true);

            // 3. Fetch streak
            const { data: logs } = await supabase.from('daily_logs')
                .select('date').eq('user_id', user.id)
                .order('date', { ascending: false }).limit(60);
            if (logs) {
                let s = 0;
                const d = new Date(); d.setDate(d.getDate() - 1);
                for (const log of logs) {
                    if (log.date === d.toLocaleDateString('en-CA')) { s++; d.setDate(d.getDate() - 1); }
                    else break;
                }
                // Include today if already logged
                if (row) s++;
                setStreak(s);
            }

            // 4. Fetch today's tasks (calendar_events)
            const startOfDay = today() + 'T00:00:00';
            const endOfDay = today() + 'T23:59:59';
            const { data: evts } = await supabase.from('calendar_events')
                .select('*').eq('user_id', user.id)
                .gte('start_time', startOfDay).lte('start_time', endOfDay)
                .is('deleted_at', null)
                .order('start_time', { ascending: true });
            if (evts) setTasks(evts);

            // 5. Fetch accounts for money section
            const { data: accts } = await supabase.from('accounts')
                .select('id, name, icon, type').eq('user_id', user.id).eq('archived', false);
            if (accts) setAccounts(accts);
        };
        load();
    }, [user]);

    // Auto-draft to localStorage every 30s when dirty
    useEffect(() => {
        if (!isDirty || !user) return;
        draftTimer.current = setInterval(() => {
            localStorage.setItem(DRAFT_KEY, JSON.stringify({
                date: today(), userId: user.id, data, ts: Date.now(),
            }));
        }, 30000);
        return () => clearInterval(draftTimer.current);
    }, [isDirty, data, user]);

    const onChange = useCallback((field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    }, []);

    // Compute sleep hours
    const sleepHours = (() => {
        if (!data.sleepStart || !data.sleepEnd) return 0;
        const s = data.sleepStart.split(':').map(Number);
        const e = data.sleepEnd.split(':').map(Number);
        let sm = s[0] * 60 + s[1], em = e[0] * 60 + e[1];
        if (em <= sm) em += 1440;
        return Number(((em - sm) / 60).toFixed(1));
    })();

    // Count completed metrics (out of 8)
    const completedCount = [
        data.sleepStart && data.sleepEnd,
        data.gymDone,
        data.breakfastDone,
        data.steps >= 1000,
        data.waterBottles >= 2,
        data.mood > 0,
        data.learningDone,
        data.journalEntry?.trim?.(),
    ].filter(Boolean).length;

    // Save handler
    const handleSave = async () => {
        if (!user || saving) return;
        setSaving(true);
        try {
            const payload = {
                user_id: user.id,
                date: today(),
                sleep_start: data.sleepStart || null,
                sleep_end: data.sleepEnd || null,
                sleep_hours: sleepHours || null,
                gym_done: data.gymDone,
                gym_duration: data.gymDone ? data.gymDuration : 0,
                breakfast_done: data.breakfastDone,
                steps: data.steps || 0,
                water_bottles: data.waterBottles || 0,
                mood: data.mood || null,
                energy_level: data.energyLevel || null,
                learning_done: data.learningDone,
                learning_topic: data.learningDone ? data.learningTopic : null,
                journal_entry: data.journalEntry?.trim() || null,
            };
            await upsertRow('daily_logs', payload, 'user_id,date');

            // Save win if entered
            if (data.winText?.trim()) {
                await insertRow('wins', {
                    user_id: user.id,
                    date: today(),
                    description: data.winText.trim(),
                });
                onChange('winText', '');
            }

            setIsDirty(false);
            localStorage.removeItem(DRAFT_KEY);
            setLastSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
            toast.success('Day log saved');
        } catch (err) {
            toast.error('Save failed: ' + err.message);
        }
        setSaving(false);
    };

    // Task handlers
    const handleAddTask = async (task) => {
        try {
            const startTime = task.time
                ? new Date(today() + 'T' + task.time).toISOString()
                : new Date().toISOString();
            const d = await insertRow('calendar_events', {
                user_id: user.id,
                title: task.title,
                start_time: startTime,
                event_type: task.type || 'task',
                source_type: 'user',
            });
            if (d?.[0]) setTasks(prev => [...prev, d[0]]);
        } catch (err) {
            toast.error('Failed to add task');
        }
    };

    const handleToggleTask = async (taskId, completed) => {
        try {
            await supabase.from('calendar_events')
                .update({ completed }).eq('id', taskId).eq('user_id', user.id);
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed } : t));
        } catch { /* silent */ }
    };

    if (!loaded) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh', background: 'var(--bg-primary)',
            maxWidth: '480px', margin: '0 auto',
            paddingBottom: '80px', // room for save bar
        }}>
            <MobileHeader completedCount={completedCount} streak={streak} lastSaved={lastSaved} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                <MobileSleepSection
                    data={data} onChange={onChange}
                    complete={!!(data.sleepStart && data.sleepEnd)}
                />
                <MobileBodySection
                    data={data} onChange={onChange}
                    complete={data.gymDone || data.breakfastDone || data.steps >= 1000 || data.waterBottles >= 2}
                />
                <MobileMindSection
                    data={data} onChange={onChange}
                    complete={data.mood > 0 || data.learningDone}
                />

                {/* Journal (inline) */}
                <div style={{
                    background: 'var(--bg-card)', borderRadius: '14px', padding: '16px',
                    border: '1px solid var(--border)', margin: '0 16px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>✍️ JOURNAL</span>
                        <span style={{ fontSize: '10px', color: data.journalEntry?.trim() ? 'var(--success)' : 'var(--text-3)' }}>
                            {data.journalEntry?.trim() ? '✓ done' : '○ todo'}
                        </span>
                    </div>
                    <textarea
                        value={data.journalEntry || ''}
                        onChange={e => onChange('journalEntry', e.target.value)}
                        placeholder="How was your day? What happened? How do you feel?"
                        rows={3}
                        style={{
                            width: '100%', padding: '12px', borderRadius: '10px',
                            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                            color: 'var(--text-1)', fontSize: '14px', lineHeight: '1.5',
                            resize: 'vertical', fontFamily: 'inherit',
                        }}
                    />
                </div>

                <MobileTaskSection tasks={tasks} onAdd={handleAddTask} onToggle={handleToggleTask} />
                <MobileMoneySection user={user} accounts={accounts} />
                <MobileNotesSection user={user} />
                <MobileWinSection data={data} onChange={onChange} />
                <MobileResetSection user={user} />
            </div>

            <MobileSaveBar onSave={handleSave} saving={saving} lastSaved={lastSaved} isDirty={isDirty} />
        </div>
    );
}

export default MobileApp;
