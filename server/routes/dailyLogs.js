import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { BehavioralEngine } from '../utils/BehavioralEngine.js';
import { nvidiaOrGroqChat } from '../lib/aiChat.js';
import { trackExternalCall } from '../services/apiUsageService.js';

const app = new Hono();

/**
 * POST /api/daily-logs — Create or update daily log
 */
app.post('/', requireAuth, async (c) => {
    try {
        const body = await c.req.json();
        const {
            date = new Date().toISOString().split('T')[0],
            sleepStart, sleepEnd, sleepHours, rcCount,
            gymDone, gymDuration, breakfastDone, steps,
            waterBottles, learningDone, learningTopic, journalEntry,
            mood, energyLevel,
        } = body;
        const userId = c.get('userId');

        const { rows } = await pool.query(
            `INSERT INTO daily_logs (
                user_id, date, sleep_start, sleep_end, sleep_hours, rc_count,
                gym_done, gym_duration, breakfast_done, steps, water_bottles,
                learning_done, learning_topic, journal_entry, mood, energy_level
             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
             ON CONFLICT (user_id, date) DO UPDATE SET
                sleep_start = EXCLUDED.sleep_start,
                sleep_end = EXCLUDED.sleep_end,
                sleep_hours = EXCLUDED.sleep_hours,
                rc_count = EXCLUDED.rc_count,
                gym_done = EXCLUDED.gym_done,
                gym_duration = EXCLUDED.gym_duration,
                breakfast_done = EXCLUDED.breakfast_done,
                steps = EXCLUDED.steps,
                water_bottles = EXCLUDED.water_bottles,
                learning_done = EXCLUDED.learning_done,
                learning_topic = EXCLUDED.learning_topic,
                journal_entry = EXCLUDED.journal_entry,
                mood = EXCLUDED.mood,
                energy_level = EXCLUDED.energy_level,
                updated_at = NOW()
             RETURNING *`,
            [
                userId, date,
                sleepStart || null, sleepEnd || null, sleepHours || null, rcCount || 0,
                gymDone || false, gymDuration || null, breakfastDone || false, steps || 0,
                waterBottles || 0, learningDone || false, learningTopic || null,
                journalEntry || null, mood || null, energyLevel || null,
            ]
        );

        // Onboarding stage progression
        try {
            const { rows: recentLogs } = await pool.query(
                `SELECT date FROM daily_logs WHERE user_id = $1 ORDER BY date DESC LIMIT 100`,
                [userId]
            );
            let streak = 0;
            if (recentLogs.length > 0) {
                const todayStr = new Date().toISOString().split('T')[0];
                const diff = (new Date(todayStr) - new Date(recentLogs[0].date)) / 86400000;
                if (diff <= 1) {
                    streak = 1;
                    for (let i = 1; i < recentLogs.length; i++) {
                        const gap = (new Date(recentLogs[i - 1].date) - new Date(recentLogs[i].date)) / 86400000;
                        if (gap === 1) streak++; else break;
                    }
                }
            }
            const newStage = BehavioralEngine.determineOnboardingStage({ totalLogs: recentLogs.length, consecutiveDays: streak });
            const currentStage = c.get('user')?.onboarding_stage || 0;
            if (newStage > currentStage) {
                await pool.query('UPDATE users SET onboarding_stage = $1 WHERE id = $2', [newStage, userId]);
            }
        } catch (stageErr) {
            console.error('[Stage Progression]', stageErr.message);
        }

        return c.json(rows[0], 201);
    } catch (error) {
        console.error('[daily-logs POST]', error);
        return c.json({ error: error.message || 'Internal server error' }, 500);
    }
});

/**
 * GET /api/daily-logs/:userId/:date
 */
app.get('/:userId/:date', requireAuth, async (c) => {
    try {
        const { userId, date } = c.req.param();
        const sessionUserId = c.get('userId');
        if (userId !== sessionUserId) {
            return c.json({ error: 'Forbidden' }, 403);
        }
        const { rows } = await pool.query(
            'SELECT * FROM daily_logs WHERE user_id = $1 AND date = $2',
            [userId, date]
        );
        return c.json(rows[0] || {});
    } catch (error) {
        console.error('[daily-logs GET]', error);
        return c.json({ error: error.message || 'Internal server error' }, 500);
    }
});

/**
 * POST /api/daily-logs/journal/ai-analyze
 * Performs a sentiment/cognitive analysis on the journal entry using Moonshot (via NVIDIA API).
 */
app.post('/journal/ai-analyze', requireAuth, async (c) => {
    try {
        const { text, mood, energy } = await c.req.json();
        if (!text || !text.trim()) {
            return c.json({ error: 'Text is required for AI analysis' }, 400);
        }

        if (!process.env.GROQ_API_KEY && !process.env.NVIDIA_API_KEY && !process.env.KIMI_API_KEY) {
            return c.json({
                sentiment: 'reflective',
                feedback: 'AI reflection unavailable — no provider keys configured.',
                habitsAdvice: 'Maintain consistency in sleep and hydration. Consider scheduling a deep-focus block tomorrow.',
                mindsetScore: 85
            });
        }

        const prompt = `You are a high-performance cognitive advisor. Analyze the following daily journal entry to evaluate the user's focus, emotional state, and mindset.

Journal Entry:
"${text}"

Reported Mood: ${mood}/5
Reported Energy: ${energy}/5

Respond ONLY with valid JSON in this exact structure:
{
  "sentiment": "focused|positive|warning|reflective",
  "feedback": "2 sentences of deep psychological feedback highlighting strengths or potential burnout signs.",
  "habitsAdvice": "1 sentence of practical action to improve their cognitive flow tomorrow.",
  "mindsetScore": 80
}

Do not include markdown tags like \`\`\`json.`;

        const userId = c.get('userId');
        await trackExternalCall({
            userId,
            provider: 'groq',
            endpoint: '/daily-logs/journal/ai-analyze',
            units: 1,
            enforceBudget: false,
        }).catch(() => {});

        const chat = await nvidiaOrGroqChat({
            messages: [{ role: 'user', content: prompt }],
            maxTokens: 500,
            temperature: 0.7,
        });
        if (!chat.ok || !chat.text) {
            throw new Error(chat.error || 'No content returned from AI');
        }
        let rawText = chat.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiAnalysis = JSON.parse(rawText.match(/\{[\s\S]*\}/)?.[0] || rawText);
        return c.json(aiAnalysis);
    } catch (err) {
        console.error('[journal/ai-analyze] error:', err);
        return c.json({
            sentiment: 'reflective',
            feedback: 'Reflective and analytical thoughts. Keep tracking your daily momentum to see long-term patterns.',
            habitsAdvice: 'Take a break, hydrate, and maintain high standards for focus.',
            mindsetScore: 78
        });
    }
});

export default app;
