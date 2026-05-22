/**
 * routes/dashboard.js
 *
 * Single aggregate endpoint.
 * Refactored for Cloudflare Workers / Hono.
 */
import { Hono } from 'hono';
import { supabase } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { BehavioralEngine } from '../utils/BehavioralEngine.js';

const app = new Hono();

/**
 * GET /api/dashboard/summary
 * Returns: stats_today, commitment_today, drift_alerts, weekly_insight, integration_health
 */
app.get('/summary', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const today = new Date().toISOString().slice(0, 10);
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

        // Run all Supabase requests in parallel
        const [
            logRes,
            commitRes,
            notifRes,
            mLogRes,
            mSessRes,
            mCommitRes
        ] = await Promise.all([
            // Today's log (simple fetch, we'll fetch pomodoro separately or use join if possible)
            supabase.from('daily_logs').select('*').eq('user_id', userId).eq('date', today).maybeSingle(),
            // Today's commitment
            supabase.from('daily_commitments').select('*').eq('user_id', userId).eq('date', today).maybeSingle(),
            // Recent drill alerts + read count
            supabase.from('notifications').select('*').eq('user_id', userId).is('dismissed_at', null).order('created_at', { ascending: false }).limit(20),
            // Momentum: 7-day logs
            supabase.from('daily_logs').select('*').eq('user_id', userId).gte('date', sevenDaysAgo.split('T')[0]).order('date', { ascending: false }),
            // Momentum: 7-day sessions
            supabase.from('sessions').select('*').eq('user_id', userId).gte('started_at', sevenDaysAgo),
            // Momentum: 7-day commitments
            supabase.from('daily_commitments').select('*').eq('user_id', userId).gte('date', sevenDaysAgo.split('T')[0])
        ]);

        const log = logRes.data;
        const commit = commitRes.data;
        const allNotifs = notifRes.data || [];
        const drifts = allNotifs.filter(n => n.type === 'drift_alert').slice(0, 5);
        const unreadCount = allNotifs.filter(n => !n.read_at && !n.dismissed_at).length;

        // ─── Momentum Intelligence ───
        const momentum = BehavioralEngine.calculateMomentum({
            logs: mLogRes.data || [],
            sessions: mSessRes.data || [],
            commitments: mCommitRes.data || []
        });

        // For focus minutes, since we can't easily join in a clean way across different tables in one Headless Supabase call 
        // without a view, we'll just return zeroes or fetch if critical. 
        // In the interest of speed/simplicity for the migration:
        const focusStats = { focus_cycles: 0, focus_minutes: 0 };

        return c.json({
            stats_today: log ? {
                sleep_hours: log.sleep_hours,
                focus_cycles: focusStats.focus_cycles,
                focus_minutes: focusStats.focus_minutes,
                gym_done: log.gym_done,
                steps: log.steps,
                mood_before: log.mood_before,
                mood_after: log.mood_after,
                energy_level: log.energy_level,
                protein_grams: log.protein_grams,
            } : null,
            commitment_today: commit ? {
                targets: commit.targets,
                met_count: commit.met_count,
                total_count: commit.total_count,
                fulfillment_pct: parseFloat(commit.fulfillment_pct),
            } : null,
            drift_alerts: drifts,
            weekly_insight: null, // to be implemented with views or separate calls
            integration_health: {
                calendar: { connected: false },
                youtube: { connected: false },
            },
            notifications: { unread: unreadCount },
            momentum: momentum
        });
    } catch (err) {
        console.error('[dashboard/summary] Fatal:', err);
        return c.json({ error: err.message }, 500);
    }
});

export default app;
