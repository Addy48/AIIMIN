import express from 'express';
import supabase from '../supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { BehavioralEngine } from '../utils/BehavioralEngine.js';
import { pool } from '../lib/db.js';

const router = express.Router();

/**
 * Create or update daily log
 */
router.post('/', requireAuth, async (req, res) => {
    try {
        const {
            date = new Date().toISOString().split('T')[0],
            sleepStart,
            sleepEnd,
            sleepHours,
            rcCount,              // renamed from masturbationCount (C-2 consolidation)
            gymDone,
            gymDuration,
            breakfastDone,
            steps,
            proteinGrams,
            waterBottles,
            learningDone,
            learningTopic,
            journalEntry,
            mood,                 // now 1-5 scale (C-4)
            moodBefore,
            moodAfter,
            energyLevel,
        } = req.body;
        const userId = req.userId;

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

        const savedLog = data[0];

        // ─── Automated Stage Progression (C-6 fix: real consecutive days) ───
        try {
            // Use window function to compute actual consecutive streak
            const streakResult = await pool.query(
                `WITH ordered_dates AS (
                    SELECT date,
                           date - (ROW_NUMBER() OVER (ORDER BY date))::int AS streak_grp
                    FROM daily_logs
                    WHERE user_id = $1 AND deleted_at IS NULL
                ),
                current_streak AS (
                    SELECT COUNT(*) AS days
                    FROM ordered_dates
                    WHERE streak_grp = (
                        SELECT streak_grp FROM ordered_dates ORDER BY date DESC LIMIT 1
                    )
                )
                SELECT
                    (SELECT COUNT(*) FROM daily_logs WHERE user_id = $1 AND deleted_at IS NULL) AS total,
                    (SELECT days FROM current_streak) AS streak`,
                [userId]
            );

            const { total, streak } = streakResult.rows[0];
            const newStage = BehavioralEngine.determineOnboardingStage({
                totalLogs: parseInt(total),
                consecutiveDays: parseInt(streak)
            });

            // Update if progressive
            const currentStage = req.user?.onboarding_stage || 0;
            if (newStage > currentStage) {
                await pool.query(
                    'UPDATE users SET onboarding_stage = $1, updated_at = NOW() WHERE id = $2',
                    [newStage, userId]
                );
            }
        } catch (stageErr) {
            console.error('[Stage Progression Error]', stageErr);
        }

        res.status(201).json(savedLog);
    } catch (error) {
        console.error('Error saving daily log:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

router.get('/:userId/:date', requireAuth, async (req, res) => {
    try {
        const { userId, date } = req.params;
        const { data, error } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', userId)
            .eq('date', date)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Rows not found"

        res.json(data || {});
    } catch (error) {
        console.error('Error fetching daily log:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

export default router;
