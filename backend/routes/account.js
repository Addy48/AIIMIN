/**
 * routes/account.js
 *
 * Account Settings API:
 * Refactored for Hono / Cloudflare Workers.
 */
import { Hono } from 'hono';
import { supabase } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin as adminSupabase } from '../supabase.js';
import { decrypt, encrypt } from '../lib/crypto.js';

const app = new Hono();

/**
 * GET /api/account/profile
 */
app.get('/profile', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const user = c.get('user');

        let { data, error } = await supabase
            .from('users')
            .select('id, email, full_name, username, role, onboarding_stage, timezone, avatar_url, created_at')
            .eq('id', userId)
            .maybeSingle();

        if (!data) {
            const meta = user?.user_metadata || {};
            const { data: newData, error: insertErr } = await supabase
                .from('users')
                .upsert({
                    id: userId,
                    email: user?.email,
                    full_name: meta.full_name || meta.name || null,
                    username: meta.username || null,
                    avatar_url: meta.avatar_url || meta.picture || null,
                    timezone: meta.timezone || 'Asia/Kolkata'
                }, { onConflict: 'id' })
                .select()
                .single();

            if (insertErr) throw insertErr;
            data = newData;
        }

        return c.json(data);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * PATCH /api/account/profile
 */
app.patch('/profile', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json();
        const { full_name, timezone, avatar_url } = body;

        const updates = {};
        if (full_name !== undefined) updates.full_name = full_name;
        if (timezone !== undefined) updates.timezone = timezone;
        if (avatar_url !== undefined) updates.avatar_url = avatar_url;

        if (Object.keys(updates).length === 0) {
            return c.json({ error: 'No valid fields to update' }, 400);
        }

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        // Sync to Auth Metadata (Async, non-blocking)
        adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                ...(c.get('user')?.user_metadata || {}),
                ...updates
            }
        }).catch(e => console.error('[account/profile] Auth sync failed:', e));

        return c.json(data);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * GET /api/account/export
 */
app.get('/export', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');

        const [p, dl, pg, ps, mt, w, dc, ws, n] = await Promise.all([
            supabase.from('users').select('*').eq('id', userId).single(),
            supabase.from('daily_logs').select('*').eq('user_id', userId).order('date', { ascending: false }),
            supabase.from('personal_goals').select('*').eq('user_id', userId),
            supabase.from('pomodoro_sessions').select('*').eq('user_id', userId).order('date', { ascending: false }),
            supabase.from('money_transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
            supabase.from('wins').select('*').eq('user_id', userId).order('date', { ascending: false }),
            supabase.from('daily_commitments').select('*').eq('user_id', userId).order('date', { ascending: false }),
            supabase.from('weekly_summaries').select('*').eq('user_id', userId).order('week_start', { ascending: false }),
            supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        ]);

        const exportData = {
            export_format: 'aiimin_v1',
            exported_at: new Date().toISOString(),
            user: p.data,
            daily_logs: dl.data,
            goals: pg.data,
            pomodoro: ps.data,
            finances: mt.data,
            wins: w.data,
            commitments: dc.data,
            weekly_summaries: ws.data,
            notifications: n.data
        };

        return c.json(exportData, 200, {
            'Content-Disposition': `attachment; filename="aiimin-export-${userId.slice(0, 8)}.json"`
        });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * DELETE /api/account
 */
app.delete('/', requireAuth, async (c) => {
    try {
        const body = await c.req.json();
        if (body.confirm !== 'DELETE') {
            return c.json({ error: 'Send { confirm: "DELETE" } to confirm' }, 400);
        }
        const userId = c.get('userId');

        // Revoke Google (simplified)
        const { data: tokenRes } = await supabase.from('user_oauth_tokens').select('access_token_enc').eq('user_id', userId).eq('provider', 'google').maybeSingle();
        if (tokenRes?.access_token_enc) {
            const token = decrypt(tokenRes.access_token_enc);
            fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, { method: 'POST' }).catch(() => { });
        }

        await supabase.from('users').delete().eq('id', userId);
        await adminSupabase.auth.admin.deleteUser(userId);

        return c.json({ success: true, message: 'Account permanently deleted' });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
