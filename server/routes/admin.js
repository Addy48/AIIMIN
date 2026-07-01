/**
 * routes/admin.js — dev/owner admin tooling (no secrets in responses).
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDevOrOwner } from '../middleware/requireDev.js';
import {
  getAllProviderBudgets,
  getUsageSummary,
} from '../services/apiUsageService.js';

const app = new Hono();

const recentRequestLogs = [];
const MAX_RECENT_LOGS = 100;

export function pushAdminRequestLog(entry) {
  recentRequestLogs.unshift({
    ...entry,
    timestamp: Date.now(),
  });
  if (recentRequestLogs.length > MAX_RECENT_LOGS) {
    recentRequestLogs.length = MAX_RECENT_LOGS;
  }
}

app.use('*', requireAuth, requireDevOrOwner);

/**
 * GET /admin/api-usage — summary by provider, by user, today's counts
 */
app.get('/api-usage', async (c) => {
  try {
    const summary = await getUsageSummary();
    return c.json(summary);
  } catch (err) {
    console.error('[admin/api-usage]', err.message);
    return c.json({ error: 'Failed to load API usage summary' }, 500);
  }
});

/**
 * GET /admin/api-usage/providers — budget status (hits remaining)
 */
app.get('/api-usage/providers', async (c) => {
  try {
    const providers = await getAllProviderBudgets();
    return c.json({ providers });
  } catch (err) {
    console.error('[admin/api-usage/providers]', err.message);
    return c.json({ error: 'Failed to load provider budgets' }, 500);
  }
});

/**
 * GET /admin/recent-logs — last HTTP requests (in-memory ring buffer)
 */
app.get('/recent-logs', async (c) => {
  return c.json({ logs: recentRequestLogs.slice(0, 20) });
});

/**
 * GET /admin/tables — list public tables (dev tooling)
 */
app.get('/tables', async (c) => {
  try {
    const { rows } = await pool.query(
      `SELECT tablename FROM pg_tables
       WHERE schemaname = 'public'
       ORDER BY tablename`,
    );
    return c.json(rows.map((r) => r.tablename));
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

/**
 * GET /admin/tables/:name — sample rows (dev tooling, capped)
 */
app.get('/tables/:name', async (c) => {
  const table = c.req.param('name');
  if (!/^[a-z_][a-z0-9_]*$/i.test(table)) {
    return c.json({ error: 'Invalid table name' }, 400);
  }
  const limit = Math.min(parseInt(c.req.query('limit') || '50', 10), 100);
  try {
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*)::int AS count FROM ${table}`,
    );
    const { rows } = await pool.query(
      `SELECT * FROM ${table} ORDER BY 1 DESC LIMIT $1`,
      [limit],
    );
    return c.json({ table, count: countRows[0]?.count ?? rows.length, rows });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

/**
 * POST /admin/simulate — placeholder simulation hook
 */
app.post('/simulate', async (c) => {
  const userId = c.get('userId');
  const { presetId } = await c.req.json();
  if (!presetId) return c.json({ error: 'presetId required' }, 400);
  return c.json({
    success: true,
    presetId,
    userId,
    message: 'Simulation preset acknowledged (no synthetic rows inserted in this build).',
  });
});

/**
 * POST /admin/wipe/:table — wipe current user's rows from allowed tables
 */
app.post('/wipe/:table', async (c) => {
  const table = c.req.param('table');
  const allowed = new Set([
    'daily_logs', 'pomodoro_sessions', 'money_transactions',
    'wins', 'notifications', 'resets',
  ]);
  if (!allowed.has(table)) {
    return c.json({ error: 'Table not allowed for wipe' }, 400);
  }
  const userId = c.get('userId');
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM ${table} WHERE user_id = $1`,
      [userId],
    );
    return c.json({ success: true, deleted: rowCount ?? 0, table });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;
