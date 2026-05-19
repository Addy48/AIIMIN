import { Hono } from 'hono';
import { pool } from '../lib/db.js';

const app = new Hono();

app.get('/', async (c) => {
    console.log('[DEBUG] Health check hit');
    try {
        await pool.query('SELECT 1');
        return c.json({ status: 'ok', db: 'connected' });
    } catch (e) {
        console.error('[DEBUG] DB error:', e);
        return c.json({ status: 'error', db: 'failed' }, 500);
    }
});

export default app;
