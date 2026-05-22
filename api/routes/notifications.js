/**
 * routes/notifications.js
 *
 * In-app notification system.
 * Refactored for Hono / Cloudflare Workers.
 */
import { Hono } from 'hono';
import { supabase } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

export const INTEGRATION_ERROR_CODES = {
    TOKEN_EXPIRED: 'token_expired',
    REFRESH_FAILED: 'refresh_failed',
    SCOPE_INSUFFICIENT: 'scope_insufficient',
    QUOTA_EXCEEDED: 'quota_exceeded',
    REVOKED_BY_USER: 'revoked_by_user',
    UNKNOWN: 'unknown',
};

/**
 * GET /api/notifications
 */
app.get('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const limit = Math.min(parseInt(c.req.query('limit') || 30), 100);
        const offset = parseInt(c.req.query('offset') || 0, 10);

        const { data, error } = await supabase
            .from('notifications')
            .select('id, type, title, body, action_url, read_at, created_at')
            .eq('user_id', userId)
            .is('dismissed_at', null)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return c.json(data);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * GET /api/notifications/count
 */
app.get('/count', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .is('dismissed_at', null)
            .is('read_at', null);

        if (error) throw error;
        return c.json({ unread: count || 0 });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * PATCH /api/notifications/:id/read
 */
app.patch('/:id/read', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const { data, error } = await supabase
            .from('notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', userId)
            .is('read_at', null)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) return c.json({ error: 'Already read or not found' }, 404);
        return c.json({ success: true });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * POST /api/notifications/mark-all-read
 */
app.post('/mark-all-read', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { data, error } = await supabase
            .from('notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('user_id', userId)
            .is('dismissed_at', null)
            .is('read_at', null)
            .select();

        if (error) throw error;
        return c.json({ updated: data?.length || 0 });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * DELETE /api/notifications/:id
 * Dismiss a notification (soft delete).
 */
app.delete('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const { data, error } = await supabase
            .from('notifications')
            .update({ dismissed_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', userId)
            .is('dismissed_at', null)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) return c.json({ error: 'Notification not found' }, 404);
        return c.json({ success: true });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * Internal helper
 */
export const createNotification = async (userId, type, title, body = null, actionUrl = null, dedupWindowHours = 24) => {
    const cutoff = new Date(Date.now() - (dedupWindowHours * 3600000)).toISOString();

    // De-duplication check
    const { data: existing } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('type', type)
        .eq('title', title)
        .is('dismissed_at', null)
        .gt('created_at', cutoff)
        .limit(1);

    if (existing && existing.length > 0) return;

    await supabase.from('notifications').insert({ user_id: userId, type, title, body, action_url: actionUrl });
};

export default app;
