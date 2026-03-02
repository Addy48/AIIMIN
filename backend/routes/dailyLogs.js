import express from 'express';
import supabase from '../supabase.js';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware to mock/extract local user (since it's an MVP)
const requireAuth = (req, res, next) => {
    const userId = req.headers['x-user-id'] || req.query.userId || req.body.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: missing user id' });
    }
    req.userId = userId;
    next();
};

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
            proteinGrams,
            learningDone,
            learningTopic,
            journalEntry
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
                protein_grams: proteinGrams || 0,
                learning_done: learningDone || false,
                learning_topic: learningTopic || null,
                journal_entry: journalEntry || null
            }, {
                onConflict: 'user_id,date'
            })
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Error saving daily log:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

router.get('/:userId/:date', async (req, res) => {
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
