import express from 'express';
import supabase from '../supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { BehavioralEngine } from '../utils/BehavioralEngine.js';
import { pool } from '../lib/googleClient.js';
import { cacheInvalidate } from '../lib/cache.js';

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
            masturbationCount,
            gymDone,
            gymDuration,
            breakfastDone,
            steps,
            waterBottles,
            learningDone,
            learningTopic,
            journalEntry,
            mood,
            energyLevel,
            brainFog,
            headache
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
                masturbation_count: masturbationCount || 0,
                gym_done: gymDone || false,
                gym_duration: gymDuration || null,
                breakfast_done: breakfastDone || false,
                steps: steps || 0,
                water_bottles: waterBottles || 0,
                learning_done: learningDone || false,
                learning_topic: learningTopic || null,
                journal_entry: journalEntry || null,
                mood: mood || null,
                energy_level: energyLevel || null,
                brain_fog: brainFog || null,
                headache: headache || false
            }, {
                onConflict: 'user_id,date'
            })
            .select();

        if (error) throw error;

        const savedLog = data[0];

        // Invalidate dashboard cache so desktop reflects mobile save immediately
        cacheInvalidate(`dashboard-summary:${userId}`);

        // ─── Automated Stage Progression ───
        try {
            // 1. Get user statistics
            const stats = await pool.query(
                `SELECT
                    COUNT(*) as total_logs,
                    COUNT(*) FILTER (WHERE date >= NOW() - INTERVAL '7 days') as recent_logs
                 FROM daily_logs WHERE user_id = $1`,
                [userId]
            );

            // 2. Determine new stage
            const totalLogs = parseInt(stats.rows[0].total_logs);
            const newStage = BehavioralEngine.determineOnboardingStage({
                totalLogs,
                consecutiveDays: totalLogs // Simplified
            });

            // 3. Update if progressive
            if (newStage > (req.user.onboarding_stage || 0)) {
                await pool.query(
                    'UPDATE users SET onboarding_stage = $1 WHERE id = $2',
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
