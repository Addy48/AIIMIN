/**
 * routes/db.js
 * Authenticated generic table access for frontend dbService.
 * All queries are scoped to the authenticated user's UUID.
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

const USER_SCOPED_TABLES = new Set([
    'daily_logs', 'habits', 'habit_logs', 'goals', 'tasks', 'dsa_problems', 'dsa_logs',
    'notes', 'calendar_events', 'accounts', 'money_transactions', 'money_lent', 'user_xp',
    'xp_log', 'achievements', 'notifications', 'pomodoro_sessions',
    'family_members', 'family_documents', 'family_insurance', 'family_health',
    'family_vehicles', 'family_finance', 'family_relationships',
    'family_reminders', 'family_emergency_contacts',
    'journal_entries', 'wins', 'savings_goals', 'budgets', 'routines',
    'discipline_streaks', 'discipline_logs', 'replacement_habits', 'addiction_tracking',
    'urge_events', 'anchor_edges', 'voice_recall_queue',
    'lab_typing_tests', 'lab_mindset_logs', 'lab_reading_log', 'lab_speaking_logs',
    'lab_reaction_tests', 'lab_personality_logs', 'lab_pit_logs', 'lab_aptitude_scores',
    'lab_system_design_logs', 'lab_streaks', 'lab_correlations', 'lab_insights',
    'sports_preferences', 'sports_favorites', 'job_applications', 'resumes',
    'wealth_assets', 'financial_health_scores', 'cognitive_benchmarks',
    'cbt_records', 'www_entries', 'user_feedback',
]);

const NO_USER_SCOPE = new Set(['routine_habits']);

function assertTable(table) {
    if (!USER_SCOPED_TABLES.has(table) && !NO_USER_SCOPE.has(table)) {
        throw new Error(`Table not allowed: ${table}`);
    }
}

async function verifyRoutineOwnership(userId, routineId) {
    const { rows } = await pool.query(
        'SELECT id FROM routines WHERE id = $1 AND user_id = $2',
        [routineId, userId]
    );
    if (!rows.length) throw new Error('Routine not found or unauthorized');
}

async function verifyHabitOwnership(userId, habitId) {
    const { rows } = await pool.query(
        'SELECT id FROM habits WHERE id = $1 AND user_id = $2',
        [habitId, userId]
    );
    if (!rows.length) throw new Error('Habit not found or unauthorized');
}

/**
 * GET /api/db/:table
 * Query params: orderCol, ascending, eq (JSON), gte (JSON), lte (JSON), neq (JSON), limit, maybeSingle, count
 */
app.get('/:table', requireAuth, async (c) => {
    try {
        const table = c.req.param('table');
        assertTable(table);
        const userId = c.get('userId');

        const orderCol = c.req.query('orderCol') || 'created_at';
        const ascending = c.req.query('ascending') === 'true';
        const limit = c.req.query('limit') ? parseInt(c.req.query('limit'), 10) : null;
        const maybeSingle = c.req.query('maybeSingle') === 'true';
        const countOnly = c.req.query('count') === 'true';

        const safeOrderCol = /^[a-z_][a-z0-9_]*$/i.test(orderCol) ? orderCol : 'created_at';

        let q = countOnly ? `SELECT COUNT(*)::int AS count FROM ${table}` : `SELECT * FROM ${table}`;
        const params = [];
        const where = [];

        if (USER_SCOPED_TABLES.has(table)) {
            params.push(userId);
            where.push(`user_id = $${params.length}`);
        }

        const parseJson = (raw) => {
            if (!raw) return null;
            try { return JSON.parse(raw); } catch { return null; }
        };

        for (const [filter, op] of [
            [parseJson(c.req.query('eq')), '='],
            [parseJson(c.req.query('gte')), '>='],
            [parseJson(c.req.query('lte')), '<='],
            [parseJson(c.req.query('neq')), '!='],
        ]) {
            if (!filter) continue;
            Object.entries(filter).forEach(([col, val]) => {
                if (!/^[a-z_][a-z0-9_]*$/i.test(col)) return;
                if (col === 'user_id' && USER_SCOPED_TABLES.has(table)) return;
                params.push(val);
                where.push(`${col} ${op} $${params.length}`);
            });
        }

        if (where.length) q += ` WHERE ${where.join(' AND ')}`;
        if (!countOnly) q += ` ORDER BY ${safeOrderCol} ${ascending ? 'ASC' : 'DESC'}`;
        if (!countOnly && limit) q += ` LIMIT ${limit}`;

        const { rows } = await pool.query(q, params);

        if (countOnly) return c.json({ count: rows[0]?.count || 0 });
        if (maybeSingle) return c.json(rows[0] || null);
        return c.json(rows);
    } catch (err) {
        return c.json({ error: err.message }, 400);
    }
});

/**
 * POST /api/db/:table — insert one or more rows
 */
app.post('/:table', requireAuth, async (c) => {
    try {
        const table = c.req.param('table');
        assertTable(table);
        const userId = c.get('userId');
        const body = await c.req.json();
        const rows = Array.isArray(body) ? body : [body];
        if (!rows.length) return c.json({ error: 'Empty payload' }, 400);

        const inserted = [];
        for (const row of rows) {
            const payload = { ...row };
            if (USER_SCOPED_TABLES.has(table)) {
                payload.user_id = userId;
            }
            if (table === 'routine_habits') {
                await verifyRoutineOwnership(userId, payload.routine_id);
                await verifyHabitOwnership(userId, payload.habit_id);
            }

            const cols = Object.keys(payload);
            const vals = Object.values(payload);
            const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
            const { rows: res } = await pool.query(
                `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`,
                vals
            );
            inserted.push(res[0]);
        }
        return c.json(inserted, 201);
    } catch (err) {
        console.error(`[db POST ${c.req.param('table')}]`, err.message);
        return c.json({ error: err.message }, 400);
    }
});

/**
 * POST /api/db/:table/upsert
 */
app.post('/:table/upsert', requireAuth, async (c) => {
    try {
        const table = c.req.param('table');
        assertTable(table);
        const userId = c.get('userId');
        const { payload, onConflict } = await c.req.json();
        const rows = Array.isArray(payload) ? payload : [payload];
        const conflict = onConflict || 'id';

        const upserted = [];
        for (const row of rows) {
            const data = { ...row };
            if (USER_SCOPED_TABLES.has(table)) data.user_id = userId;

            const cols = Object.keys(data);
            const vals = Object.values(data);
            const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
            const updates = cols.filter((c) => c !== conflict.split(',')[0].trim())
                .map((col) => `${col} = EXCLUDED.${col}`)
                .join(', ');

            const { rows: res } = await pool.query(
                `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})
                 ON CONFLICT (${conflict}) DO UPDATE SET ${updates || `${cols[0]} = EXCLUDED.${cols[0]}`}
                 RETURNING *`,
                vals
            );
            upserted.push(res[0]);
        }
        return c.json(upserted);
    } catch (err) {
        return c.json({ error: err.message }, 400);
    }
});

/**
 * PATCH /api/db/:table — update rows matching filters
 */
app.patch('/:table', requireAuth, async (c) => {
    try {
        const table = c.req.param('table');
        assertTable(table);
        const userId = c.get('userId');
        const { payload, where = {} } = await c.req.json();
        if (!payload || !Object.keys(where).length) {
            return c.json({ error: 'payload and where required' }, 400);
        }

        const sets = [];
        const params = [];
        Object.entries(payload).forEach(([col, val]) => {
            params.push(val);
            sets.push(`${col} = $${params.length}`);
        });

        const filters = [];
        if (USER_SCOPED_TABLES.has(table)) {
            params.push(userId);
            filters.push(`user_id = $${params.length}`);
        }
        Object.entries(where).forEach(([col, val]) => {
            if (col === 'user_id' && USER_SCOPED_TABLES.has(table)) return;
            params.push(val);
            filters.push(`${col} = $${params.length}`);
        });

        const { rows } = await pool.query(
            `UPDATE ${table} SET ${sets.join(', ')} WHERE ${filters.join(' AND ')} RETURNING *`,
            params
        );
        return c.json(rows);
    } catch (err) {
        return c.json({ error: err.message }, 400);
    }
});

/**
 * DELETE /api/db/:table — delete rows matching filters
 */
app.delete('/:table', requireAuth, async (c) => {
    try {
        const table = c.req.param('table');
        assertTable(table);
        const userId = c.get('userId');
        const { where = {}, all = false } = await c.req.json();
        if (!all && !Object.keys(where).length) return c.json({ error: 'where required' }, 400);

        const filters = [];
        const params = [];
        if (USER_SCOPED_TABLES.has(table)) {
            params.push(userId);
            filters.push(`user_id = $${params.length}`);
        }
        Object.entries(where).forEach(([col, val]) => {
            if (col === 'user_id' && USER_SCOPED_TABLES.has(table)) return;
            params.push(val);
            filters.push(`${col} = $${params.length}`);
        });

        await pool.query(`DELETE FROM ${table} WHERE ${filters.join(' AND ')}`, params);
        return c.json({ deleted: true });
    } catch (err) {
        return c.json({ error: err.message }, 400);
    }
});

export default app;
