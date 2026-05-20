import { Hono } from 'hono';
import { pool } from '../lib/db.js';

const app = new Hono();

// Fast health check — no DB query, responds instantly
app.get('/', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Deep health check — also verifies DB connectivity
app.get('/db', async (c) => {
    console.log('[DEBUG] DB Health check hit');
    try {
        await pool.query('SELECT 1');
        return c.json({ status: 'ok', db: 'connected' });
    } catch (e) {
        console.error('[DEBUG] DB error:', e.message);
        return c.json({ status: 'error', db: 'failed', error: e.message }, 500);
    }
});

export default app;
