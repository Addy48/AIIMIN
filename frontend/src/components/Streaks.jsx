import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

const Streaks = ({ user }) => {
    const [streaks, setStreaks] = useState({
        gym: 0,
        learning: 0,
        rc: 0 // Reset Counter (inverse logic: days without resetting)
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchLogsAndCalculateStreaks = async () => {
            setLoading(true);
            try {
                // Fetch all historical logs ordered by date descending
                const { data: logs, error } = await supabase
                    .from('daily_logs')
                    .select('date, gym_done, learning_done, rc_count')
                    .eq('user_id', user.id)
                    .order('date', { ascending: false });

                if (error) throw error;
                if (!logs || logs.length === 0) {
                    setLoading(false);
                    return;
                }

                let gymStreak = 0;
                let learningStreak = 0;
                let rcStreak = 0;

                // Today's Date (ignoring time)
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Helper to check if a DB date string is yesterday compared to a given date
                const isDifferenceOneDay = (date1Str, date2Obj) => {
                    const d1 = new Date(date1Str);
                    d1.setHours(0, 0, 0, 0);
                    const diffTime = Math.abs(date2Obj - d1);
                    return diffTime === (1000 * 60 * 60 * 24);
                };

                // Track continuous days directly
                let currentDateGym = today;
                let currentDateLearning = today;
                let currentDateRc = today;

                let gymActive = true;
                let learningActive = true;
                let rcActive = true;

                for (let i = 0; i < logs.length; i++) {
                    const log = logs[i];
                    const logDateObj = new Date(log.date);
                    logDateObj.setHours(0, 0, 0, 0);

                    // Skip Future logs (should not exist but just in case)
                    if (logDateObj > today) continue;

                    // Gym Logic
                    if (gymActive) {
                        const isTodayLog = logDateObj.getTime() === currentDateGym.getTime();
                        const isYesterdayLog = isDifferenceOneDay(log.date, currentDateGym);

                        // If there is a skip in days, stop counting
                        if (!isTodayLog && !isYesterdayLog && logDateObj < currentDateGym) {
                            gymActive = false;
                        } else if (log.gym_done) {
                            gymStreak++;
                            currentDateGym = logDateObj;
                        } else if (isYesterdayLog) {
                            // yesterday was not logged as done, break streak
                            gymActive = false;
                        }
                    }

                    // Learning Logic
                    if (learningActive) {
                        const isTodayLog = logDateObj.getTime() === currentDateLearning.getTime();
                        const isYesterdayLog = isDifferenceOneDay(log.date, currentDateLearning);

                        if (!isTodayLog && !isYesterdayLog && logDateObj < currentDateLearning) {
                            learningActive = false;
                        } else if (log.learning_done) {
                            learningStreak++;
                            currentDateLearning = logDateObj;
                        } else if (isYesterdayLog) {
                            learningActive = false;
                        }
                    }

                    // RC (Reset Counter / Masturbation) Inverse Logic
                    // Streak increases if you did NOT log an RC (rc_count is 0 or null)
                    if (rcActive) {
                        const isTodayLog = logDateObj.getTime() === currentDateRc.getTime();
                        const isYesterdayLog = isDifferenceOneDay(log.date, currentDateRc);
                        const hasReset = log.rc_count > 0;

                        if (!isTodayLog && !isYesterdayLog && logDateObj < currentDateRc) {
                            // If user completely skipped a day, we consider it "No Reset" and streak continues 
                            // *Wait, usually app logic says if you skipped a day you didn't do it, so we add 1 for the missing day*
                            // To keep it simple: we only break RC streak if they explicitly logged an RC.
                            const daysDiff = Math.round(Math.abs(currentDateRc - logDateObj) / (1000 * 60 * 60 * 24));
                            rcStreak += daysDiff - 1; // Add missing days
                            currentDateRc = logDateObj;
                            if (hasReset) rcActive = false; // Broke streak today
                            else rcStreak++;
                        } else if (!hasReset) {
                            rcStreak++;
                            currentDateRc = logDateObj;
                        } else if (hasReset) {
                            // Reset occurred, break RC streak
                            if (isTodayLog) rcStreak = 0; // if reset today, streak is 0
                            rcActive = false;
                        }
                    }

                    // Early exit if all streaks broke
                    if (!gymActive && !learningActive && !rcActive) break;
                }

                setStreaks({ gym: gymStreak, learning: learningStreak, rc: rcStreak });
            } catch (error) {
                console.error('Error fetching streaks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogsAndCalculateStreaks();
    }, [user]);

    const MetricCard = ({ icon, label, count, activeColor, inactiveColor }) => (
        <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: count > 0 ? activeColor : inactiveColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', boxShadow: count > 0 ? '0 8px 24px rgba(0,0,0,0.1)' : 'none'
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {label}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-1px' }}>
                    {count} <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-3)' }}>days</span>
                </div>
                {count > 0 && <div style={{ fontSize: '13px', color: 'var(--success)', marginTop: '4px', fontWeight: 500 }}>🔥 Streak active</div>}
            </div>
        </div>
    );

    if (loading) {
        return <div className="p-8 text-center text-[var(--text-3)]">Loading streaks...</div>;
    }

    return (
        <div className="fade-up flex flex-col gap-4">
            <MetricCard
                icon="💪"
                label="Gym & Workout"
                count={streaks.gym}
                activeColor="rgba(245,166,35,0.2)"
                inactiveColor="var(--bg-elevated)"
            />
            <MetricCard
                icon="📚"
                label="Learning"
                count={streaks.learning}
                activeColor="rgba(93,184,122,0.2)"
                inactiveColor="var(--bg-elevated)"
            />
            <MetricCard
                icon="🚫"
                label="No Resets"
                count={streaks.rc}
                activeColor="rgba(155,138,245,0.2)"
                inactiveColor="var(--bg-elevated)"
            />
        </div>
    );
};

export default Streaks;
