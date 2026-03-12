/**
 * routes/routines.js
 *
 * Routines CRUD + habit membership management + execution flow.
 *
 * Execution flow:
 *   POST /routines/:id/run          → creates routine_run, returns runId + habit list
 *   POST /routine-runs/:runId/check → marks one habit done/skipped (optimistic UI)
 *   POST /routine-runs/:runId/complete → marks run as fully complete
 */
import express from 'express';
import { pool } from '../lib/googleClient.js';
import { requireAuth } from '../middleware/auth.js';
import { getUserLocalDate } from '../lib/timezone.js';

const router = express.Router();

// ─── Routine CRUD ─────────────────────────────────────────────────────────────

// GET /routines — list user's routines with habit count
router.get('/', requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT r.id, r.name, r.time_of_day, r.created_at,
                    COUNT(rh.habit_id)::int AS habit_count
             FROM routines r
             LEFT JOIN routine_habits rh ON rh.routine_id = r.id
             WHERE r.user_id = $1
             GROUP BY r.id
             ORDER BY r.created_at ASC`,
            [req.userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /routines — create a routine
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, time_of_day } = req.body;
        if (!name?.trim()) return res.status(400).json({ error: 'name is required' });

        const { rows } = await pool.query(
            `INSERT INTO routines (user_id, name, time_of_day)
             VALUES ($1, $2, $3) RETURNING *`,
            [req.userId, name.trim(), time_of_day || null]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /routines/:id
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { name, time_of_day } = req.body;
        const { rows } = await pool.query(
            `UPDATE routines
             SET name        = COALESCE($1, name),
                 time_of_day = COALESCE($2, time_of_day)
             WHERE id = $3 AND user_id = $4
             RETURNING *`,
            [name || null, time_of_day || null, req.params.id, req.userId]
        );
        if (!rows.length) return res.status(404).json({ error: 'Routine not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /routines/:id
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { rowCount } = await pool.query(
            `DELETE FROM routines WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.userId]
        );
        if (!rowCount) return res.status(404).json({ error: 'Routine not found' });
        res.json({ deleted: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Habit membership ─────────────────────────────────────────────────────────

// GET /routines/:id/habits — list habits in a routine (ordered by position)
router.get('/:id/habits', requireAuth, async (req, res) => {
    try {
        // Verify ownership
        const { rows: rr } = await pool.query(
            `SELECT id FROM routines WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.userId]
        );
        if (!rr.length) return res.status(404).json({ error: 'Routine not found' });

        const { rows } = await pool.query(
            `SELECT h.id, h.name, h.emoji, h.category, h.frequency, rh.position
             FROM routine_habits rh
             JOIN habits h ON h.id = rh.habit_id
             WHERE rh.routine_id = $1
             ORDER BY rh.position ASC`,
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /routines/:id/habits — add a habit to this routine
router.post('/:id/habits', requireAuth, async (req, res) => {
    try {
        const { habit_id, position = 0 } = req.body;
        if (!habit_id) return res.status(400).json({ error: 'habit_id is required' });

        // Verify routine ownership
        const { rows: rr } = await pool.query(
            `SELECT id FROM routines WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.userId]
        );
        if (!rr.length) return res.status(404).json({ error: 'Routine not found' });

        // Verify habit ownership
        const { rows: hr } = await pool.query(
            `SELECT id FROM habits WHERE id = $1 AND user_id = $2`,
            [habit_id, req.userId]
        );
        if (!hr.length) return res.status(404).json({ error: 'Habit not found' });

        await pool.query(
            `INSERT INTO routine_habits (routine_id, habit_id, position)
             VALUES ($1, $2, $3)
             ON CONFLICT (routine_id, habit_id) DO UPDATE SET position = $3`,
            [req.params.id, habit_id, position]
        );
        res.status(201).json({ routine_id: req.params.id, habit_id, position });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /routines/:id/habits/:habitId — remove habit from routine
router.delete('/:id/habits/:habitId', requireAuth, async (req, res) => {
    try {
        const { rows: rr } = await pool.query(
            `SELECT id FROM routines WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.userId]
        );
        if (!rr.length) return res.status(404).json({ error: 'Routine not found' });

        await pool.query(
            `DELETE FROM routine_habits WHERE routine_id = $1 AND habit_id = $2`,
            [req.params.id, req.params.habitId]
        );
        res.json({ removed: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Execution flow ───────────────────────────────────────────────────────────

// POST /routines/:id/run — start a routine run for today
// Creates a routine_runs record. Returns runId + ordered habit list.
router.post('/:id/run', requireAuth, async (req, res) => {
    try {
        const { rows: rr } = await pool.query(
            `SELECT id, name FROM routines WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.userId]
        );
        if (!rr.length) return res.status(404).json({ error: 'Routine not found' });

        const { rows: [run] } = await pool.query(
            `INSERT INTO routine_runs (routine_id, user_id)
             VALUES ($1, $2) RETURNING *`,
            [req.params.id, req.userId]
        );

        const { rows: habits } = await pool.query(
            `SELECT h.id, h.name, h.emoji, h.category, rh.position
             FROM routine_habits rh
             JOIN habits h ON h.id = rh.habit_id
             WHERE rh.routine_id = $1
             ORDER BY rh.position ASC`,
            [req.params.id]
        );

        res.status(201).json({ run, habits });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /routines/runs/today — check if any morning routine was started today
router.get('/runs/today', requireAuth, async (req, res) => {
    try {
        const today = getUserLocalDate();
        const { rows } = await pool.query(
            `SELECT rr.id, rr.routine_id, rr.started_at, rr.completed,
                    r.name, r.time_of_day
             FROM routine_runs rr
             JOIN routines r ON r.id = rr.routine_id
             WHERE rr.user_id = $1
               AND DATE(rr.started_at AT TIME ZONE 'Asia/Kolkata') = $2
             ORDER BY rr.started_at DESC`,
            [req.userId, today]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Routine run actions (under /routine-runs prefix, registered separately) ─

export const routineRunsRouter = express.Router();

// POST /routine-runs/:runId/check — mark one habit done/skipped (optimistic UI)
routineRunsRouter.post('/:runId/check', requireAuth, async (req, res) => {
    try {
        const { habit_id, status = 'done', notes } = req.body;
        if (!habit_id) return res.status(400).json({ error: 'habit_id is required' });

        // Verify run ownership
        const { rows: rr } = await pool.query(
            `SELECT id FROM routine_runs WHERE id = $1 AND user_id = $2`,
            [req.params.runId, req.userId]
        );
        if (!rr.length) return res.status(404).json({ error: 'Run not found' });

        const { rows: [log] } = await pool.query(
            `INSERT INTO habit_logs (habit_id, user_id, status, session, notes)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [habit_id, req.userId, status, req.params.runId, notes || null]
        );
        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /routine-runs/:runId/complete — mark the run fully done
routineRunsRouter.post('/:runId/complete', requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `UPDATE routine_runs
             SET completed = true, completed_at = NOW()
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [req.params.runId, req.userId]
        );
        if (!rows.length) return res.status(404).json({ error: 'Run not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
