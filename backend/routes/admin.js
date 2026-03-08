import express from 'express';
import { pool } from '../lib/googleClient.js';
import { requireAuth } from '../middleware/auth.js';
import logger from '../lib/logger.js';

const router = express.Router();

/**
 * Middleware: enforce admin by email match only.
 * No role checks — email is the single source of truth.
 */
const requireAdmin = (req, res, next) => {
    const devEmail = process.env.DEV_EMAIL;
    if (!devEmail || req.user.email !== devEmail) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
};

/**
 * GET /admin/tables
 * List all public schema tables.
 */
router.get('/tables', requireAuth, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT table_name FROM information_schema.tables
             WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
             ORDER BY table_name`
        );
        res.json(result.rows.map(r => r.table_name));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /admin/tables/:table
 * Read any table without user_id filter. Limited to 200 rows.
 */
router.get('/tables/:table', requireAuth, requireAdmin, async (req, res) => {
    const { table } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);

    // Whitelist: only allow known tables
    const allowed = [
        'users', 'daily_logs', 'goals', 'pomodoro_sessions',
        'money_transactions', 'wins', 'daily_commitments',
        'weekly_summaries', 'notifications', 'user_oauth_tokens',
        'resets', 'admin_action_log'
    ];

    if (!allowed.includes(table)) {
        return res.status(400).json({ error: `Table "${table}" is not browseable` });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM "${table}" ORDER BY created_at DESC NULLS LAST LIMIT $1`,
            [limit]
        );
        res.json({ table, count: result.rows.length, rows: result.rows });
    } catch (err) {
        // Fallback if created_at doesn't exist
        try {
            const result = await pool.query(`SELECT * FROM "${table}" LIMIT $1`, [limit]);
            res.json({ table, count: result.rows.length, rows: result.rows });
        } catch (innerErr) {
            res.status(500).json({ error: innerErr.message });
        }
    }
});

/**
 * POST /admin/wipe/:table
 * Wipe data from a table. Optionally filter by user_id.
 * Body: { userId?: string }
 */
router.post('/wipe/:table', requireAuth, requireAdmin, async (req, res) => {
    const { table } = req.params;
    const { userId } = req.body;

    const wipeable = [
        'daily_logs', 'pomodoro_sessions', 'money_transactions',
        'wins', 'daily_commitments', 'weekly_summaries',
        'notifications', 'resets'
    ];

    if (!wipeable.includes(table)) {
        return res.status(400).json({ error: `Cannot wipe "${table}"` });
    }

    try {
        let result;
        if (userId) {
            result = await pool.query(`DELETE FROM "${table}" WHERE user_id = $1`, [userId]);
        } else {
            result = await pool.query(`DELETE FROM "${table}"`);
        }
        res.json({ success: true, deleted: result.rowCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /admin/simulate
 * Inject synthetic behavioral data.
 */
router.post('/simulate', requireAuth, requireAdmin, async (req, res) => {
    const { presetId, userId } = req.body;
    const adminId = req.user.id;

    if (!userId) {
        return res.status(400).json({ error: 'Target userId is required' });
    }

    try {
        // Audit log
        try {
            await pool.query(
                'INSERT INTO admin_action_log (admin_user_id, action_type, target_user_id, payload) VALUES ($1, $2, $3, $4)',
                [adminId, 'DATA_SIMULATION', userId, { presetId }]
            );
        } catch (auditErr) {
            console.warn('[admin] audit log failed (table may not exist):', auditErr.message);
        }

        // Generate last 30 days
        const days = 30;
        const now = new Date();

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

            await pool.query(
                `INSERT INTO daily_logs (user_id, date, sleep_hours, steps, gym_done, mood_before, source_type)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (user_id, date) DO UPDATE
                 SET sleep_hours = EXCLUDED.sleep_hours, steps = EXCLUDED.steps, gym_done = EXCLUDED.gym_done, source_type = EXCLUDED.source_type`,
                [userId, dateStr, logData.sleep, logData.steps, logData.gym, logData.mood, 'admin_simulated']
            );
        }

        res.json({ success: true, message: `Simulation ${presetId} completed for user ${userId}` });
    } catch (error) {
        console.error('[Admin API Simulation Error]', error);
        res.status(500).json({ error: 'Simulation failed: ' + error.message });
    }
});

/**
 * GET /admin/requests
 * Returns the last 50 request log entries from the in-memory buffer.
 * Only accessible to DEV_EMAIL user.
 */
const logBuffer = [];
const MAX_LOG_ENTRIES = 50;

// Attach a listener to the global logger to capture logs
logger.on('data', (log) => {
    if (log.message && log.message.startsWith('[REQUEST API')) {
        try {
            // Keep actual meta parsing
            const meta = log.correlationId ? log : (log.meta || log);

            logBuffer.push({
                timestamp: log.timestamp,
                level: log.level,
                message: log.message,
                correlationId: meta.correlationId,
                status: meta.status,
                method: meta.method,
                path: meta.path,
                latency: meta.latency,
                origin: meta.origin,
                'user-agent': meta['user-agent']
            });
            if (logBuffer.length > MAX_LOG_ENTRIES) logBuffer.shift();
        } catch (e) {
            // ignore JSON parse errors via logger intercept
        }
    }
});

router.get('/requests', requireAuth, requireAdmin, (req, res) => {
    res.json({
        count: logBuffer.length,
        requests: [...logBuffer].reverse(),
    });
});

/**
 * GET /admin/errors
 * Returns the last 50 persisted API errors from the DB.
 */
router.get('/errors', requireAuth, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM api_errors ORDER BY created_at DESC LIMIT 50'
        );
        res.json({
            count: result.rowCount,
            errors: result.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
