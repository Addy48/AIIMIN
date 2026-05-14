import { Hono } from 'hono';
import { supabase, pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { BehavioralEngine } from '../utils/BehavioralEngine.js';

const app = new Hono();

/**
 * POST /api/daily-logs
 * Create or update daily log
 */
app.post('/', requireAuth, async (c) => {
    try {
        const body = await c.req.json();
        const {
            date = new Date().toISOString().split('T')[0],
            sleepStart,
            sleepEnd,
            sleepHours,
            rcCount,
            gymDone,
            gymDuration,
            breakfastDone,
            steps,
            proteinGrams,
            waterBottles,
            learningDone,
            learningTopic,
            journalEntry,
            mood,
            moodBefore,
            moodAfter,
            energyLevel,
        } = body;
        const userId = c.get('userId');

        const { data, error } = await supabase
            .from('daily_logs')
            .upsert({
                user_id: userId,
                date: date,
                sleep_start: sleepStart || null,
                sleep_end: sleepEnd || null,
                sleep_hours: sleepHours || null,
                rc_count: rcCount || 0,
                gym_done: gymDone || false,
                gym_duration: gymDuration || null,
                breakfast_done: breakfastDone || false,
                steps: steps || 0,
                protein_grams: proteinGrams || 0,
                water_bottles: waterBottles || 0,
                learning_done: learningDone || false,
                learning_topic: learningTopic || null,
                journal_entry: journalEntry || null,
                mood: mood || null,
                mood_before: moodBefore || null,
                mood_after: moodAfter || null,
                energy_level: energyLevel || null,
            }, {
                onConflict: 'user_id,date'
            })
            .select();

        if (error) throw error;

        // ─── Automated Stage Progression (Refactored to JS for Workers) ───
        try {
            // Fetch recent logs to calculate streak in memory
            const { data: recentLogs } = await supabase
                .from('daily_logs')
                .select('date')
                .eq('user_id', userId)
                .is('deleted_at', null)
                .order('date', { ascending: false })
                .limit(100);

            let streak = 0;
            if (recentLogs && recentLogs.length > 0) {
                const todayStr = new Date().toISOString().split('T')[0];
                const lastLogDate = recentLogs[0].date;

                // If the latest log is today or yesterday, streak continues
                const diff = (new Date(todayStr) - new Date(lastLogDate)) / (1000 * 60 * 60 * 24);

                if (diff <= 1) {
                    streak = 1;
                    for (let i = 1; i < recentLogs.length; i++) {
                        const prev = new Date(recentLogs[i - 1].date);
                        const curr = new Date(recentLogs[i].date);
                        const gap = (prev - curr) / (1000 * 60 * 60 * 24);
                        if (gap === 1) streak++;
                        else break;
                    }
                }
            }

            const { count: totalLogs } = await supabase
                .from('daily_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .is('deleted_at', null);

            const newStage = BehavioralEngine.determineOnboardingStage({
                totalLogs: totalLogs || 0,
                consecutiveDays: streak
            });

            const currentStage = c.get('user')?.onboarding_stage || 0;
            if (newStage > currentStage) {
                await pool.query(
                    'UPDATE public.users SET onboarding_stage = $1, updated_at = $2 WHERE id = $3',
                    [newStage, new Date().toISOString(), userId]
                );
            }
        } catch (stageErr) {
            console.error('[Stage Progression Error]', stageErr);
        }

        return c.json(data[0], 201);
    } catch (error) {
        console.error('Error saving daily log:', error);
        return c.json({ error: error.message || 'Internal server error' }, 500);
    }
});

/**
 * GET /api/daily-logs/:userId/:date
 */
app.get('/:userId/:date', requireAuth, async (c) => {
    try {
        const { userId, date } = c.req.param();
        const { data, error } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', userId)
            .eq('date', date)
            .maybeSingle();

        if (error) throw error;
        return c.json(data || {});
    } catch (error) {
        console.error('Error fetching daily log:', error);
        return c.json({ error: error.message || 'Internal server error' }, 500);
    }
});

export default app;
