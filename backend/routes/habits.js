/**
 * routes/habits.js
 *
 * Habits CRUD — create, list, update, archive.
 * Habits are individual trackable behaviours (e.g. "Meditate 10 min").
 * They are linked to routines via the routine_habits junction table.
 */
import express from 'express';
import { pool } from '../lib/googleClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /habits — list all active habits for user
router.get('/', requireAuth, async (req, res) => {
    try {
        const { status = 'active', category } = req.query;
        const params = [req.userId];
        let query = `
            SELECT id, name, emoji, category, frequency, status, created_at
            FROM habits
            WHERE user_id = $1
        `;
        if (status) {
            params.push(status);
            query += ` AND status = $${params.length}`;
        }
        if (category) {
            params.push(category);
            query += ` AND category = $${params.length}`;
        }
        query += ` ORDER BY created_at ASC`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /habits — create a new habit
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, emoji = '🎯', category, frequency = 'daily' } = req.body;
        if (!name?.trim()) return res.status(400).json({ error: 'name is required' });

        const { rows } = await pool.query(
            `INSERT INTO habits (user_id, name, emoji, category, frequency)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [req.userId, name.trim(), emoji, category || null, frequency]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /habits/:id — update name, category, frequency, or status
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { name, emoji, category, frequency, status } = req.body;
        const validStatuses = ['active', 'paused', 'archived'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
        }

        const { rows } = await pool.query(
            `UPDATE habits
             SET name      = COALESCE($1, name),
                 emoji     = COALESCE($2, emoji),
                 category  = COALESCE($3, category),
                 frequency = COALESCE($4, frequency),
                 status    = COALESCE($5, status)
             WHERE id = $6 AND user_id = $7
             RETURNING *`,
            [name || null, emoji || null, category || null, frequency || null, status || null,
             req.params.id, req.userId]
        );
        if (!rows.length) return res.status(404).json({ error: 'Habit not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /habits/:id — hard delete (prefer status=archived for soft delete)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { rowCount } = await pool.query(
            `DELETE FROM habits WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.userId]
        );
        if (!rowCount) return res.status(404).json({ error: 'Habit not found' });
        res.json({ deleted: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /habits/:id/logs?date=YYYY-MM-DD — completion history for a habit
router.get('/:id/logs', requireAuth, async (req, res) => {
    try {
        const { date, limit = 30 } = req.query;
        const params = [req.params.id, req.userId];
        let query = `
            SELECT id, completed_at, status, session, notes
            FROM habit_logs
            WHERE habit_id = $1 AND user_id = $2
        `;
        if (date) {
            params.push(date);
            query += ` AND DATE(completed_at AT TIME ZONE 'Asia/Kolkata') = $${params.length}`;
        }
        params.push(parseInt(limit, 10));
        query += ` ORDER BY completed_at DESC LIMIT $${params.length}`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
