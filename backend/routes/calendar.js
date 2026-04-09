/**
 * routes/calendar.js
 *
 * Unified Life OS Calendar — native Supabase CRUD + recurring event expansion.
 * Replaces Google Calendar dependency (Phase 10).
 * Preserves the /heatmap endpoint from the original implementation.
 */
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { pool } from '../lib/googleClient.js';

const router = express.Router();

const SYSTEM_TYPES = ['physical', 'cognitive', 'behavior', 'finance', 'reflection', 'general'];

/* ── GET /calendar/events?start=ISO&end=ISO ─────────────────────────────── */
router.get('/events', requireAuth, async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) return res.status(400).json({ error: 'start and end query params required' });

        const result = await pool.query(
            `SELECT * FROM calendar_events
             WHERE user_id = $1
               AND start_time >= $2
               AND start_time <= $3
               AND deleted_at IS NULL
             ORDER BY start_time ASC`,
            [req.userId, start, end]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('[calendar/events]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/* ── GET /calendar/day/:date ─────────────────────────────────────────────── */
router.get('/day/:date', requireAuth, async (req, res) => {
    try {
        const { date } = req.params;
        const startOfDay = `${date}T00:00:00.000Z`;
        const endOfDay = `${date}T23:59:59.999Z`;

        const result = await pool.query(
            `SELECT * FROM calendar_events
             WHERE user_id = $1
               AND start_time >= $2
               AND start_time <= $3
               AND deleted_at IS NULL
             ORDER BY start_time ASC`,
            [req.userId, startOfDay, endOfDay]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ── GET /calendar/week/:date ────────────────────────────────────────────── */
router.get('/week/:date', requireAuth, async (req, res) => {
    try {
        const d = new Date(req.params.date);
        const day = d.getDay();
        const mondayOffset = day === 0 ? 6 : day - 1;
        const monday = new Date(d);
        monday.setDate(d.getDate() - mondayOffset);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const result = await pool.query(
            `SELECT * FROM calendar_events
             WHERE user_id = $1
               AND start_time >= $2
               AND start_time <= $3
               AND deleted_at IS NULL
             ORDER BY start_time ASC`,
            [req.userId, monday.toISOString(), new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate(), 23, 59, 59).toISOString()]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ── GET /calendar/month/:date ───────────────────────────────────────────── */
router.get('/month/:date', requireAuth, async (req, res) => {
    try {
        const d = new Date(req.params.date);
        const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
        const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

        const result = await pool.query(
            `SELECT * FROM calendar_events
             WHERE user_id = $1
               AND start_time >= $2
               AND start_time <= $3
               AND deleted_at IS NULL
             ORDER BY start_time ASC`,
            [req.userId, firstDay.toISOString(), lastDay.toISOString()]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ── POST /calendar/events ───────────────────────────────────────────────── */
router.post('/events', requireAuth, async (req, res) => {
    try {
        const { title, description, start_time, end_time, all_day, system_type, tags, color, location, reminder_minutes, recurrence_rule, event_type } = req.body;

        if (!title || !start_time) return res.status(400).json({ error: 'title and start_time required' });
        if (system_type && !SYSTEM_TYPES.includes(system_type)) {
            return res.status(400).json({ error: `Invalid system_type. Must be one of: ${SYSTEM_TYPES.join(', ')}` });
        }

        const result = await pool.query(
            `INSERT INTO calendar_events
             (user_id, title, description, start_time, end_time, all_day, system_type, tags, color, location, reminder_minutes, recurrence_rule, event_type, source_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'user')
             RETURNING *`,
            [
                req.userId,
                title,
                description || null,
                start_time,
                end_time || start_time,
                all_day || false,
                system_type || 'general',
                tags || [],
                color || null,
                location || null,
                reminder_minutes || null,
                recurrence_rule ? JSON.stringify(recurrence_rule) : null,
                event_type || 'event',
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('[calendar/events POST]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/* ── PATCH /calendar/events/:id ──────────────────────────────────────────── */
router.patch('/events/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const allowedFields = ['title', 'description', 'start_time', 'end_time', 'all_day', 'system_type', 'tags', 'color', 'location', 'reminder_minutes', 'recurrence_rule', 'event_type', 'completed'];

        const updates = [];
        const values = [req.userId, id];
        let paramIndex = 3;

        for (const [key, val] of Object.entries(req.body)) {
            if (allowedFields.includes(key)) {
                const dbVal = key === 'recurrence_rule' && val ? JSON.stringify(val) : val;
                updates.push(`${key} = $${paramIndex}`);
                values.push(dbVal);
                paramIndex++;
            }
        }

        if (!updates.length) return res.status(400).json({ error: 'No valid fields to update' });
        updates.push(`updated_at = NOW()`);

        const result = await pool.query(
            `UPDATE calendar_events SET ${updates.join(', ')}
             WHERE user_id = $1 AND id = $2 AND deleted_at IS NULL
             RETURNING *`,
            values
        );

        if (!result.rows.length) return res.status(404).json({ error: 'Event not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('[calendar/events PATCH]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/* ── DELETE /calendar/events/:id ─────────────────────────────────────────── */
router.delete('/events/:id', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE calendar_events SET deleted_at = NOW()
             WHERE user_id = $1 AND id = $2 AND deleted_at IS NULL
             RETURNING id`,
            [req.userId, req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Event not found' });
        res.json({ deleted: true, id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ── POST /calendar/expand-recurring ─────────────────────────────────────── */
router.post('/expand-recurring', requireAuth, async (req, res) => {
    try {
        const { start, end } = req.body;
        if (!start || !end) return res.status(400).json({ error: 'start and end required' });

        const rangeStart = new Date(start);
        const rangeEnd = new Date(end);

        // Fetch all recurring parent events for this user
        const { rows: parents } = await pool.query(
            `SELECT * FROM calendar_events
             WHERE user_id = $1 AND recurrence_rule IS NOT NULL AND deleted_at IS NULL`,
            [req.userId]
        );

        const expanded = [];
        for (const parent of parents) {
            const rule = parent.recurrence_rule;
            if (!rule || !rule.freq) continue;

            const eventStart = new Date(parent.start_time);
            const eventEnd = new Date(parent.end_time || parent.start_time);
            const duration = eventEnd - eventStart;

            let current = new Date(eventStart);
            const maxOccurrences = rule.count || 365;
            let count = 0;

            while (current <= rangeEnd && count < maxOccurrences) {
                if (current >= rangeStart) {
                    expanded.push({
                        ...parent,
                        id: `${parent.id}_${current.toISOString()}`,
                        recurrence_parent_id: parent.id,
                        start_time: current.toISOString(),
                        end_time: new Date(current.getTime() + duration).toISOString(),
                        is_recurring_instance: true,
                    });
                }

                // Advance by frequency
                switch (rule.freq) {
                    case 'daily': current.setDate(current.getDate() + (rule.interval || 1)); break;
                    case 'weekly': current.setDate(current.getDate() + 7 * (rule.interval || 1)); break;
                    case 'monthly': current.setMonth(current.getMonth() + (rule.interval || 1)); break;
                    case 'yearly': current.setFullYear(current.getFullYear() + (rule.interval || 1)); break;
                    default: count = maxOccurrences; // Stop if unknown freq
                }
                count++;
            }
        }

        res.json(expanded);
    } catch (err) {
        console.error('[calendar/expand-recurring]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/* ── GET /calendar/heatmap — preserved from Phase 4 ──────────────────────── */
router.get('/heatmap', requireAuth, async (req, res) => {
    try {
        const year = parseInt(req.query.year || new Date().getFullYear(), 10);
        const month = parseInt(req.query.month || new Date().getMonth() + 1, 10);

        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({ error: 'Invalid year or month' });
        }

        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

        const result = await pool.query(
            `SELECT
                dl.date::text AS date,
                COALESCE(ps.cycles_completed, 0) AS session_count,
                COALESCE(ps.total_focus_minutes, 0) AS focus_minutes,
                COALESCE(dc.fulfillment_pct, 0) AS commitment_pct,
                ROUND((COALESCE(dl.mood_before,0) + COALESCE(dl.mood_after,0))::numeric
                      / NULLIF((CASE WHEN dl.mood_before IS NOT NULL THEN 1 ELSE 0 END
                              + CASE WHEN dl.mood_after IS NOT NULL THEN 1 ELSE 0 END), 0), 1)
                                                                       AS mood_avg
             FROM daily_logs dl
             LEFT JOIN pomodoro_sessions ps ON ps.user_id = dl.user_id AND ps.date = dl.date
             LEFT JOIN daily_commitments dc ON dc.user_id = dl.user_id AND dc.date = dl.date
             WHERE dl.user_id = $1 AND dl.date BETWEEN $2 AND $3
             ORDER BY dl.date`,
            [req.userId, startDate, endDate]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('[calendar/heatmap]', err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;
