import express from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Middleware to enforce super_admin role
const requireSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Forbidden: Super Admin access required' });
    }
    next();
};

/**
 * POST /api/admin/simulate
 * Inject synthetic behavioral data
 */
router.post('/simulate', requireAuth, requireSuperAdmin, async (req, res) => {
    const { presetId, userId } = req.body;
    const adminId = req.user.id;

    if (!userId) {
        return res.status(400).json({ error: 'Target userId is required' });
    }

    try {
        // 1. Audit Log the action
        await pool.query(
            'INSERT INTO admin_action_log (admin_user_id, action_type, target_user_id, payload) VALUES ($1, $2, $3, $4)',
            [adminId, 'DATA_SIMULATION', userId, { presetId }]
        );

        // 2. Generate Data (Last 30 days)
        const days = 30;
        const now = new Date();

        // Clean existing simulated data for this user to avoid duplication
        await pool.query('DELETE FROM daily_logs WHERE user_id = $1 AND source_type = $2', [userId, 'admin_simulated']);
        await pool.query('DELETE FROM sessions WHERE user_id = $1 AND source_type = $2', [userId, 'admin_simulated']);

        for (let i = 0; i < days; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            let logData = { sleep: 8, steps: 10000, gym: true, mood: 5 };

            if (presetId === 'drift') {
                logData = { sleep: 5, steps: 2000, gym: false, mood: 2 };
            } else if (presetId === 'recovery') {
                logData = i < 5 ? { sleep: 8, steps: 10000, gym: true, mood: 5 } : { sleep: 5, steps: 3000, gym: false, mood: 2 };
            } else if (presetId === 'zero') {
                logData = { sleep: 0, steps: 0, gym: false, mood: 1 };
            }

            // Insert Daily Log
            await pool.query(
                `INSERT INTO daily_logs (user_id, date, sleep_hours, steps, gym_done, mood_before, source_type)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (user_id, date) DO UPDATE 
                 SET sleep_hours = EXCLUDED.sleep_hours, steps = EXCLUDED.steps, gym_done = EXCLUDED.gym_done, source_type = EXCLUDED.source_type`,
                [userId, dateStr, logData.sleep, logData.steps, logData.gym, logData.mood, 'admin_simulated']
            );

            // Insert matching sessions if not zero
            if (presetId !== 'zero' && (presetId !== 'drift' || i % 3 === 0)) {
                const sessionCount = presetId === 'high_discipline' ? 4 : 1;
                for (let j = 0; j < sessionCount; j++) {
                    const startedAt = new Date(date);
                    startedAt.setHours(9 + j * 3, 0, 0, 0);
                    const endedAt = new Date(startedAt);
                    endedAt.setMinutes(endedAt.getMinutes() + 50);

                    await pool.query(
                        `INSERT INTO sessions (user_id, started_at, ended_at, duration_minutes, source_type)
                         VALUES ($1, $2, $3, $4, $5)`,
                        [userId, startedAt, endedAt, 50, 'admin_simulated']
                    );
                }
            }
        }

        res.json({ success: true, message: `Simulation ${presetId} completed for user ${userId}` });
    } catch (error) {
        console.error('[Admin API Simulation Error]', error);
        res.status(500).json({ error: 'Simulation failed: ' + error.message });
    }
});

export default router;
