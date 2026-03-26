import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import MobileHeader from './MobileHeader';
import MobileSaveBar from './MobileSaveBar';
import DailyQuests from './DailyQuests';
import LevelUpModal from './LevelUpModal';
import AchievementUnlock from './AchievementUnlock';
import AchievementsGallery from './AchievementsGallery';
import MobileStreaks from './MobileStreaks';
import MobileGoals from './MobileGoals';
import YearlyHeatmap from './YearlyHeatmap';
import {
    MobileSleepSection,
    MobileBodySection,
    MobileMindSection,
    MobileTaskSection,
    MobileMoneySection,
    MobileNotesSection,
    MobileWinSection,
    MobileResetSection,
    MobileDSASection,
} from './MobileSections';
import MobileIntention from './MobileIntention';
import { upsertRow, insertRow } from '../../services/dbService';
import supabase from '../../utils/supabase';
import toast from '../../utils/toast';
import { calculateDailyXP, getRank, checkAchievements } from '../../utils/xpEngine';
import { playXP } from '../../utils/soundEngine';

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
    brainFog: 0,    // 1=foggy, 2=okay, 3=sharp
    headache: false,
    sleepTags: [],
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
    const [xpData, setXpData] = useState({ total_xp: 0, current_rank: 1, clean_streak: 0 });
    const [levelUpRank, setLevelUpRank] = useState(null);
    const [xpToast, setXpToast] = useState(null);
    const [achievementQueue, setAchievementQueue] = useState([]);
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
                    brainFog: row.brain_fog || 0,
                    headache: row.headache || false,
                    sleepTags: [],
                });
                // Load sleep quality tags
                const { data: sqt } = await supabase.from('sleep_quality_tags')
                    .select('tags').eq('daily_log_id', row.id).maybeSingle();
                if (sqt?.tags) setData(prev => ({ ...prev, sleepTags: sqt.tags }));
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

            // 6. Fetch XP data
            const { data: xp } = await supabase.from('user_xp')
                .select('*').eq('user_id', user.id).maybeSingle();
            if (xp) {
                setXpData(xp);
            } else {
                // Initialize XP row for new user
                const newXp = { user_id: user.id, total_xp: 0, current_rank: 1, power_level: 0, clean_streak: 0, longest_streak: 0 };
                await supabase.from('user_xp').insert(newXp).select().maybeSingle();
                setXpData(newXp);
            }
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

    // Build log-shaped data for XP calculation (live preview)
    const logSnapshot = useMemo(() => ({
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
        journal_entry: data.journalEntry?.trim() || null,
        win_logged: !!(data.winText?.trim()),
        brain_fog: data.brainFog || 0,
    }), [data, sleepHours]);

    const estimatedXP = useMemo(
        () => calculateDailyXP(logSnapshot, streak, xpData.clean_streak || 0).totalXP,
        [logSnapshot, streak, xpData.clean_streak]
    );

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
                brain_fog: data.brainFog || null,
                headache: data.headache || false,
            };
            await upsertRow('daily_logs', payload, 'user_id,date');

            // Save sleep quality tags
            if (data.sleepTags?.length > 0) {
                const { data: logRow } = await supabase.from('daily_logs')
                    .select('id').eq('user_id', user.id).eq('date', today()).single();
                if (logRow?.id) {
                    await upsertRow('sleep_quality_tags', {
                        daily_log_id: logRow.id,
                        tags: data.sleepTags,
                    }, 'daily_log_id');
                }
            }

            // Save win if entered
            let winLogged = false;
            if (data.winText?.trim()) {
                await insertRow('wins', {
                    user_id: user.id,
                    date: today(),
                    description: data.winText.trim(),
                });
                onChange('winText', '');
                winLogged = true;
            }

            // ── XP PROCESSING ──────────────────────
            // Check if today is a clean day (no resets)
            const { data: todayLog } = await supabase.from('daily_logs')
                .select('rc_count').eq('user_id', user.id).eq('date', today()).maybeSingle();
            const isCleanDay = !todayLog?.rc_count || todayLog.rc_count === 0;
            const currentClean = xpData.clean_streak || 0;
            const newCleanStreak = isCleanDay ? currentClean + 1 : 0;

            const xpPayload = { ...logSnapshot, win_logged: winLogged || logSnapshot.win_logged };
            const xpResult = calculateDailyXP(xpPayload, streak, newCleanStreak);
            const newTotalXP = (xpData.total_xp || 0) + xpResult.totalXP;
            const oldRank = getRank(xpData.total_xp || 0);
            const newRank = getRank(newTotalXP);

            // Update user_xp
            const newLongest = Math.max(xpData.longest_streak || 0, streak);
            await upsertRow('user_xp', {
                user_id: user.id,
                total_xp: newTotalXP,
                current_rank: newRank.rank,
                power_level: newTotalXP,
                longest_streak: newLongest,
                clean_streak: newCleanStreak,
                last_xp_date: today(),
                updated_at: new Date().toISOString(),
            }, 'user_id');

            // Log daily XP
            await upsertRow('xp_log', {
                user_id: user.id,
                date: today(),
                xp_earned: xpResult.totalXP,
                breakdown: xpResult.breakdown,
                multiplier: xpResult.multiplier,
            }, 'user_id,date');

            // Update local state
            setXpData(prev => ({ ...prev, total_xp: newTotalXP, current_rank: newRank.rank, longest_streak: newLongest, clean_streak: newCleanStreak }));

            // XP sound + toast
            playXP();
            const parts = Object.entries(xpResult.breakdown).map(([k, v]) => `${k} +${v}`).join(' · ');
            const multi = xpResult.multiplier > 1 ? ` (${xpResult.multiplier}× streak)` : '';
            setXpToast({ xp: xpResult.totalXP, parts, multi });
            setTimeout(() => setXpToast(null), 4000);

            // Level up check
            if (newRank.rank > oldRank.rank) {
                setTimeout(() => setLevelUpRank(newRank), 500);
            }

            // ── ACHIEVEMENT CHECK ──────────────────
            (async () => {
                try {
                    // Fetch recent logs for achievement evaluation
                    const { data: recentLogs } = await supabase.from('daily_logs')
                        .select('*').eq('user_id', user.id)
                        .order('date', { ascending: false }).limit(90);
                    // Fetch already unlocked
                    const { data: unlocked } = await supabase.from('achievements')
                        .select('achievement_id').eq('user_id', user.id);
                    const unlockedSet = new Set((unlocked || []).map(a => a.achievement_id));
                    // Fetch pomodoro count
                    const { count: pomoCycles } = await supabase.from('pomodoro_sessions')
                        .select('id', { count: 'exact', head: true }).eq('user_id', user.id);
                    // Fetch money transaction count
                    const { count: txCount } = await supabase.from('money_transactions')
                        .select('id', { count: 'exact', head: true }).eq('user_id', user.id);

                    const newAchs = checkAchievements({
                        streak, cleanStreak: xpData.clean_streak || 0,
                        totalXp: newTotalXP, rank: newRank.rank,
                        pomoCycles: pomoCycles || 0, txCount: txCount || 0,
                        logs: recentLogs || [],
                    }, unlockedSet);

                    if (newAchs.length > 0) {
                        // Save to DB and award XP
                        let bonusXp = 0;
                        for (const ach of newAchs) {
                            await insertRow('achievements', {
                                user_id: user.id, achievement_id: ach.id, xp_granted: ach.xp,
                            });
                            bonusXp += ach.xp;
                        }
                        if (bonusXp > 0) {
                            const achTotal = newTotalXP + bonusXp;
                            await upsertRow('user_xp', {
                                user_id: user.id, total_xp: achTotal, updated_at: new Date().toISOString(),
                            }, 'user_id');
                            setXpData(prev => ({ ...prev, total_xp: achTotal }));
                        }
                        // Queue modals (show one at a time)
                        setAchievementQueue(newAchs);
                    }
                } catch { /* silent — achievements are non-critical */ }
            })();

            // Dynamic tab title
            document.title = `✓ +${xpResult.totalXP} XP — AIIMIN`;
            setTimeout(() => { document.title = `🔥 Day ${streak} — AIIMIN`; }, 5000);

            setIsDirty(false);
            localStorage.removeItem(DRAFT_KEY);
            setLastSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
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
            <MobileHeader completedCount={completedCount} streak={streak} lastSaved={lastSaved} xpData={xpData} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                {/* Daily Quests */}
                <DailyQuests dateStr={today()} logData={logSnapshot} />

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

                {/* Daily Intention (lightweight mobile version) */}
                <MobileIntention />

                <MobileTaskSection tasks={tasks} onAdd={handleAddTask} onToggle={handleToggleTask} />
                <MobileMoneySection user={user} accounts={accounts} />
                <MobileNotesSection user={user} />
                <MobileWinSection data={data} onChange={onChange} />
                <MobileDSASection user={user} />
                <MobileStreaks user={user} />
                <MobileGoals user={user} />
                <YearlyHeatmap user={user} />
                <AchievementsGallery user={user} />
                <MobileResetSection user={user} />
            </div>

            <MobileSaveBar onSave={handleSave} saving={saving} lastSaved={lastSaved} isDirty={isDirty} estimatedXP={estimatedXP} />

            {/* XP Toast */}
            {xpToast && (
                <div style={{
                    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, var(--accent), var(--gold))', color: '#fff',
                    padding: '12px 20px', borderRadius: '12px', zIndex: 9998,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    animation: 'xpToastIn 0.4s ease-out',
                    textAlign: 'center', maxWidth: '340px',
                    border: '1px solid rgba(255,255,255,0.2)',
                }}>
                    <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '0.02em' }}>⚡ +{xpToast.xp} XP</div>
                    <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px', fontWeight: 600 }}>{xpToast.parts}{xpToast.multi}</div>
                </div>
            )}

            {/* Level Up Modal */}
            {levelUpRank && <LevelUpModal rank={levelUpRank} onDismiss={() => setLevelUpRank(null)} />}

            {/* Achievement Unlock */}
            {achievementQueue.length > 0 && (
                <AchievementUnlock
                    achievement={achievementQueue[0]}
                    onDismiss={() => setAchievementQueue(prev => prev.slice(1))}
                />
            )}

            <style>{`
                @keyframes xpToastIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.9); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}

export default MobileApp;
