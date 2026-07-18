/**
 * routes/account.js
 *
 * Account Settings API:
 * Refactored for Hono / Cloudflare Workers.
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

import { decrypt, encrypt } from '../lib/crypto.js';
import { getUserProfile, patchUserProfile } from '../services/userProfileService.js';

const app = new Hono();
const USERNAME_PATTERN = /^[A-Z0-9_.-]{3,20}$/;

/**
 * GET /api/account/profile
 */
app.get('/profile', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const user = c.get('user');

        const { rows } = await pool.query(
            'SELECT id, email, full_name, username, role, onboarding_stage, timezone, avatar_url, created_at FROM users WHERE id = $1',
            [userId]
        );
        let data = rows[0] || null;

        if (!data) {
            const meta = user?.user_metadata || {};
            const { rows: newRows } = await pool.query(
                `INSERT INTO users (id, email, full_name, username, avatar_url, timezone)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (id) DO UPDATE SET
                     email = EXCLUDED.email,
                     full_name = COALESCE(users.full_name, EXCLUDED.full_name),
                     username = COALESCE(users.username, EXCLUDED.username),
                     avatar_url = COALESCE(users.avatar_url, EXCLUDED.avatar_url),
                     timezone = COALESCE(users.timezone, EXCLUDED.timezone)
                 RETURNING id, email, full_name, username, role, onboarding_stage, timezone, avatar_url, created_at`,
                [
                    userId,
                    user?.email,
                    meta.full_name || meta.name || null,
                    meta.username?.toUpperCase() || null,
                    meta.avatar_url || meta.picture || null,
                    meta.timezone || 'Asia/Kolkata'
                ]
            );
            data = newRows[0];
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
        const { full_name, username, timezone, avatar_url } = body;

        const updates = {};
        if (full_name !== undefined) updates.full_name = full_name;
        if (username !== undefined) {
            const normalizedUsername = username.trim().toUpperCase();
            if (normalizedUsername && !USERNAME_PATTERN.test(normalizedUsername)) {
                return c.json({ error: 'Username must be 3-20 uppercase letters, numbers, _, ., or -' }, 400);
            }
            updates.username = normalizedUsername || null;
        }
        if (timezone !== undefined) updates.timezone = timezone;
        if (avatar_url !== undefined) updates.avatar_url = avatar_url;

        if (Object.keys(updates).length === 0) {
            return c.json({ error: 'No valid fields to update' }, 400);
        }

        const keys = Object.keys(updates);
        const values = Object.values(updates);
        const setClauses = keys.map((key, idx) => `${key} = $${idx + 2}`).join(', ');

        const { rows } = await pool.query(
            `UPDATE users SET ${setClauses} WHERE id = $1 RETURNING id, email, full_name, username, role, onboarding_stage, timezone, avatar_url, created_at`,
            [userId, ...values]
        );

        if (rows.length === 0) {
            return c.json({ error: 'User not found' }, 404);
        }

        const data = rows[0];

        // Sync to Auth Metadata (Async, non-blocking)
        // adminSupabase.auth.admin.updateUserById(userId, {
        //     user_metadata: {
        //         ...(c.get('user')?.user_metadata || {}),
        //         ...updates
        //     }
        // }).catch(e => console.error('[account/profile] Auth sync failed:', e));

        return c.json(data);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * GET /api/account/user-profile — identity + preferences (frontend AuthContext + useUserProfile)
 */
app.get('/user-profile', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { rows } = await pool.query(
            'SELECT id, email, full_name, username, role, onboarding_stage, timezone, avatar_url, created_at FROM users WHERE id = $1',
            [userId],
        );
        const user = rows[0];
        if (!user) return c.json({ error: 'User not found' }, 404);

        const prefs = await getUserProfile(pool, userId).catch(() => null);
        return c.json({
            user_id: user.id,
            email: user.email,
            full_name: user.full_name,
            username: user.username,
            role: user.role,
            avatar_url: user.avatar_url,
            timezone: user.timezone,
            onboarding_stage: user.onboarding_stage,
            created_at: user.created_at,
            ...(prefs || {}),
            onboarding_complete: Boolean(prefs?.onboarding_complete),
        });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * PATCH /api/account/user-profile
 */
app.patch('/user-profile', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json();
        const updated = await patchUserProfile(pool, userId, body);
        const { rows } = await pool.query(
            'SELECT id, email, full_name, username, role, avatar_url FROM users WHERE id = $1',
            [userId],
        );
        return c.json({ user_id: userId, ...rows[0], ...(updated || {}) });
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

        const [userRes, dlRes, mtRes, wRes, dcRes, nRes] = await Promise.all([
            pool.query('SELECT * FROM users WHERE id = $1', [userId]),
            pool.query('SELECT * FROM daily_logs WHERE user_id = $1 ORDER BY date DESC', [userId]),
            pool.query('SELECT * FROM money_transactions WHERE user_id = $1 ORDER BY date DESC', [userId]).catch(() => ({ rows: [] })),
            pool.query('SELECT * FROM wins WHERE user_id = $1 ORDER BY date DESC', [userId]).catch(() => ({ rows: [] })),
            pool.query('SELECT * FROM daily_commitments WHERE user_id = $1 ORDER BY date DESC', [userId]).catch(() => ({ rows: [] })),
            pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]).catch(() => ({ rows: [] })),
        ]);

        const exportData = {
            export_format: 'aiimin_v1',
            exported_at: new Date().toISOString(),
            user: userRes.rows[0] || null,
            daily_logs: dlRes.rows,
            finances: mtRes.rows,
            wins: wRes.rows,
            commitments: dcRes.rows,
            notifications: nRes.rows,
        };

        return c.json(exportData, 200, {
            'Content-Disposition': `attachment; filename="aiimin-export-${userId.slice(0, 8)}.json"`
        });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * POST /api/account/wipe-life-data
 * Clears all tracked life data for the authenticated user. Keeps login / users row / OAuth.
 * Body: { confirm: "WIPE ALL DATA" }
 */
app.post('/wipe-life-data', requireAuth, async (c) => {
    try {
        const body = await c.req.json().catch(() => ({}));
        if (body.confirm !== 'WIPE ALL DATA') {
            return c.json({ error: 'Send { confirm: "WIPE ALL DATA" } to confirm' }, 400);
        }
        const userId = c.get('userId');
        if (!userId) return c.json({ error: 'Unauthorized' }, 401);

        // Order: children / logs before parents. Ignore missing-table errors.
        const tables = [
            'habit_logs', 'routine_runs', 'routines', 'habit_stacks', 'replacement_habits', 'habits',
            'daily_logs', 'daily_commitments', 'wins', 'journal_entries',
            'pomodoro_sessions', 'study_sessions', 'sessions',
            'money_transactions', 'money_lent', 'budgets', 'recurring', 'savings_goals',
            'financial_goals', 'wealth_assets', 'account_balances', 'accounts', 'money_categories',
            'net_worth_snapshots', 'financial_health_scores',
            'calendar_events', 'tasks', 'notes', 'xp_log', 'user_xp', 'achievements',
            'urge_events', 'discipline_logs', 'discipline_streaks', 'addiction_tracking',
            'goals', 'dsa_problems', 'dsa_logs', 'resumes', 'job_applications',
            'family_health', 'family_insurance', 'family_documents', 'family_finance',
            'family_reminders', 'family_emergency_contacts', 'family_vehicles',
            'family_relationships', 'family_members',
            'lab_typing_tests', 'lab_reaction_tests', 'lab_speaking_logs', 'lab_mindset_logs',
            'lab_reading_log', 'lab_personality_logs', 'lab_aptitude_scores', 'lab_pit_logs',
            'lab_system_design_logs', 'lab_decision_scenarios', 'lab_beliefs',
            'lab_correlations', 'lab_insights', 'lab_streaks', 'lab_mastery_badges',
            'sports_preferences', 'sports_favorites',
            'cbt_records', 'www_entries', 'notifications', 'voice_recall_queue', 'anchor_edges',
        ];

        const deleted = {};
        const errors = [];
        for (const table of tables) {
            try {
                const { rowCount } = await pool.query(
                    `DELETE FROM ${table} WHERE user_id = $1`,
                    [userId],
                );
                deleted[table] = rowCount ?? 0;
            } catch (err) {
                errors.push({ table, message: err.message });
            }
        }

        return c.json({
            success: true,
            message: 'Life data wiped. Account login kept.',
            deleted,
            errors: errors.length ? errors : undefined,
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

        // Revoke Google token if stored
        try {
            const { rows: tokenRows } = await pool.query(
                `SELECT access_token_enc FROM user_oauth_tokens WHERE user_id = $1 AND provider = 'google' LIMIT 1`,
                [userId]
            );
            if (tokenRows[0]?.access_token_enc) {
                const token = decrypt(tokenRows[0].access_token_enc);
                fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, { method: 'POST' }).catch(() => {});
            }
        } catch (_) {}

        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        // await adminSupabase.auth.admin.deleteUser(userId);

        return c.json({ success: true, message: 'Account permanently deleted' });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
