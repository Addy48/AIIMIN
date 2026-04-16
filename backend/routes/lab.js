/**
 * routes/lab.js
 * 
 * The Lab — three-pillar intelligence dashboard routes.
 * Refactored for Hono / Cloudflare Workers.
 */
import { Hono } from 'hono';
import { supabase } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { getQuarterInfo, getCurrentQuarterAnchor } from '../lib/quarter.js';

const app = new Hono();

// ─────────────────────────────────────────────────────
// Helper Constants
// ─────────────────────────────────────────────────────
const MASTERY_THRESHOLDS = {
    typing: { bronze: 60, silver: 90, gold: 120, platinum: 140 },
    speaking: { bronze: 60, silver: 75, gold: 85, platinum: 92 },
    reaction: { bronze: 250, silver: 220, gold: 200, platinum: 180 },
    decisions: { bronze: 3, silver: 5, gold: 7, platinum: 10 },
};

const MASTERY_MIN_ENTRIES = { typing: 5, speaking: 3, reaction: 3, decisions: 2 };

// ─────────────────────────────────────────────────────
// Helper: update streak (Refactored to JS)
// ─────────────────────────────────────────────────────
async function updateStreak(userId, metric) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    // Fetch current streak
    const { data: current, error: fetchErr } = await supabase
        .from('lab_streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('metric', metric)
        .maybeSingle();

    if (fetchErr) throw fetchErr;

    let newStreak = 1;
    let longest = current?.longest_streak || 1;

    if (current) {
        if (current.last_logged_day === todayStr) {
            newStreak = current.current_streak;
        } else if (current.last_logged_day === yesterdayStr) {
            newStreak = current.current_streak + 1;
        } else {
            newStreak = 1;
        }
        longest = Math.max(longest, newStreak);
    }

    const { data, error: upsertErr } = await supabase
        .from('lab_streaks')
        .upsert({
            user_id: userId,
            metric,
            current_streak: newStreak,
            longest_streak: longest,
            last_logged_day: todayStr,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,metric' })
        .select()
        .single();

    if (upsertErr) throw upsertErr;
    return data;
}

// ─────────────────────────────────────────────────────
// Helper: check mastery (Refactored to JS)
// ─────────────────────────────────────────────────────
async function checkMastery(userId, metric, value) {
    const thresholds = MASTERY_THRESHOLDS[metric];
    if (!thresholds) return null;

    const tableMap = {
        typing: 'lab_typing_tests', speaking: 'lab_speaking_logs',
        reaction: 'lab_reaction_tests', decisions: 'lab_decision_scenarios',
    };

    // Count entries
    const { count, error: countErr } = await supabase
        .from(tableMap[metric])
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    if (countErr) return null;
    if (count < MASTERY_MIN_ENTRIES[metric]) return null;

    const isLowerBetter = metric === 'reaction';
    let earned = null;
    for (const tier of ['platinum', 'gold', 'silver', 'bronze']) {
        const threshold = thresholds[tier];
        if (isLowerBetter ? value <= threshold : value >= threshold) {
            earned = tier;
            break;
        }
    }

    if (!earned) return null;

    const { data, error: badgeErr } = await supabase
        .from('lab_mastery_badges')
        .upsert({
            user_id: userId,
            metric: metric,
            tier: earned,
            granted_at: new Date().toISOString()
        }, { onConflict: 'user_id,metric,tier' })
        .select();

    return (badgeErr || !data) ? null : earned;
}

// ═══════════════════════════════════════════════════════
// GET /api/lab/summary
// ═══════════════════════════════════════════════════════
app.get('/summary', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const todayStr = new Date().toISOString().slice(0, 10);
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

        const [
            typingRes, speakingRes, reactionRes, decisionsRes,
            streaksRes, badgesRes, mindsetRes,
            userRes, rcRes, correlationsCountRes, insightsCountRes
        ] = await Promise.all([
            supabase.from('lab_typing_tests').select('wpm').eq('user_id', userId).eq('test_invalid', false).gte('day_of', sevenDaysAgo).order('wpm', { ascending: false }).limit(1),
            supabase.from('lab_speaking_logs').select('confidence_score, logged_at').eq('user_id', userId).order('logged_at', { ascending: false }).limit(1),
            supabase.from('lab_reaction_tests').select('mean_ms').eq('user_id', userId).eq('test_invalid', false).order('taken_at', { ascending: false }).limit(3),
            supabase.from('lab_decision_scenarios').select('quality_self, domain, iso_week').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
            supabase.from('lab_streaks').select('metric, current_streak, longest_streak').eq('user_id', userId),
            supabase.from('lab_mastery_badges').select('metric, tier').eq('user_id', userId).order('granted_at', { ascending: false }),
            supabase.from('lab_mindset_logs').select('state, logged_at').eq('user_id', userId).eq('day_of', todayStr).maybeSingle(),
            supabase.from('users').select('quarterly_review_anchor, lab_onboarded_at').eq('id', userId).single(),
            supabase.from('daily_logs').select('rc_entries').eq('user_id', userId).order('date', { ascending: false }).limit(1).maybeSingle(),
            supabase.from('lab_correlations').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('bh_passed', true).gt('computed_at', new Date(Date.now() - 26 * 3600000).toISOString()),
            supabase.from('lab_insights').select('id', { count: 'exact' }).eq('user_id', userId)
        ]);

        // Process maps
        const streakMap = {};
        (streaksRes.data || []).forEach(s => streakMap[s.metric] = s.current_streak);

        const badgeMap = {};
        (badgesRes.data || []).forEach(b => { if (!badgeMap[b.metric]) badgeMap[b.metric] = b.tier; });

        const reactionValues = (reactionRes.data || []).map(r => r.mean_ms);
        const reactionMean = reactionValues.length > 0 ? Math.round(reactionValues.reduce((a, b) => a + b, 0) / reactionValues.length) : null;

        const anchor = userRes.data?.quarterly_review_anchor || '2026-01-01';
        const quarterInfo = getQuarterInfo(anchor);
        const qAnchor = getCurrentQuarterAnchor(anchor);

        // Fetch beliefs (separate due to complexity)
        const { count: completedBeliefs } = await supabase.from('lab_beliefs').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('quarter_anchor', qAnchor);

        return c.json({
            practice: {
                typing: { weekly_best_wpm: typingRes.data?.[0]?.wpm || null, mastery: badgeMap.typing || 'unranked', streak_days: streakMap.typing || 0 },
                speaking: { latest_score: speakingRes.data?.[0]?.confidence_score || null, mastery: badgeMap.speaking || 'unranked', last_logged_at: speakingRes.data?.[0]?.logged_at || null },
                reaction: { mean_ms_last3: reactionMean, mastery: badgeMap.reaction || 'unranked' },
                decisions: { week_count: (decisionsRes.data || []).length, mean_quality: 0 }
            },
            intel: {
                growth_dashboard: { active_correlations: correlationsCountRes.count || 0 },
                mindset_state: { state: mindsetRes.data?.state || null },
                insights: { total_count: insightsCountRes.count || 0 }
            },
            audit: {
                belief_inventory: { current_quarter: quarterInfo.quarterLabel, completed: completedBeliefs || 0, total: 6 },
                quarterly_review: { next_review_date: quarterInfo.quarterEnd.toISOString(), days_until: quarterInfo.daysUntil, quarter_progress_pct: quarterInfo.progressPct }
            },
            user: { lab_onboarded_at: userRes.data?.lab_onboarded_at || null, quarterly_review_anchor: anchor }
        });
    } catch (err) {
        console.error('[lab/summary] Error:', err);
        return c.json({ error: err.message }, 500);
    }
});

/**
 * POST /api/lab/practice/:metric (Bulk handler placeholder or individual)
 */
app.post('/practice/typing', requireAuth, async (c) => {
    try {
        const { wpm, accuracy_pct, duration_sec = 60 } = await c.req.json();
        const userId = c.get('userId');
        const { data, error } = await supabase.from('lab_typing_tests').insert({ user_id: userId, wpm, accuracy_pct, duration_sec }).select().single();
        if (error) throw error;
        const streak = await updateStreak(userId, 'typing');
        const mastery = await checkMastery(userId, 'typing', wpm);
        return c.json({ ...data, streak_days: streak.current_streak, mastery_change: mastery }, 201);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.post('/practice/speaking', requireAuth, async (c) => {
    try {
        const { confidence_score, clarity_score, pace_score, prompt_id, notes } = await c.req.json();
        const userId = c.get('userId');
        const { data, error } = await supabase.from('lab_speaking_logs').insert({ user_id: userId, confidence_score, clarity_score, pace_score, prompt_id, notes }).select().single();
        if (error) throw error;
        await updateStreak(userId, 'speaking');
        return c.json(data, 201);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.post('/practice/reaction', requireAuth, async (c) => {
    try {
        const { trial_ms } = await c.req.json();
        const userId = c.get('userId');
        const sorted = [...trial_ms].sort((a, b) => a - b);
        const mean_ms = Math.round(sorted.slice(1, 4).reduce((a, b) => a + b, 0) / 3);
        const { data, error } = await supabase.from('lab_reaction_tests').insert({ user_id: userId, trial_ms, mean_ms }).select().single();
        if (error) throw error;
        await updateStreak(userId, 'reaction');
        return c.json(data, 201);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.post('/practice/decisions', requireAuth, async (c) => {
    try {
        const { prompt_id, domain, response_text, quality_self } = await c.req.json();
        const userId = c.get('userId');
        const { data, error } = await supabase.from('lab_decision_scenarios').insert({ user_id: userId, prompt_id, domain, response_text, quality_self }).select().single();
        if (error) throw error;
        await updateStreak(userId, 'decisions');
        return c.json(data, 201);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.post('/mindset', requireAuth, async (c) => {
    try {
        const { state, note } = await c.req.json();
        const userId = c.get('userId');
        const todayStr = new Date().toISOString().slice(0, 10);
        const { data, error } = await supabase.from('lab_mindset_logs').upsert({ user_id: userId, state, note, day_of: todayStr, logged_at: new Date().toISOString() }, { onConflict: 'user_id,day_of' }).select().single();
        if (error) throw error;
        return c.json(data, 201);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.get('/beliefs/prompts', requireAuth, async (c) => {
    try {
        const domain = c.req.query('domain');
        let query = supabase.from('lab_belief_prompts').select('*').order('domain').order('sort_order');
        if (domain) query = query.eq('domain', domain);
        const { data, error } = await query;
        if (error) throw error;
        return c.json(data);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.post('/beliefs', requireAuth, async (c) => {
    try {
        const { domain, prompt_id, response_text } = await c.req.json();
        const userId = c.get('userId');
        const anchorRes = await supabase.from('users').select('quarterly_review_anchor').eq('id', userId).single();
        const qAnchor = getCurrentQuarterAnchor(anchorRes.data?.quarterly_review_anchor || '2026-01-01');
        const { data, error } = await supabase.from('lab_beliefs').upsert({ user_id: userId, domain, prompt_id, response_text, quarter_anchor: qAnchor }, { onConflict: 'user_id,domain,quarter_anchor' }).select().single();
        if (error) throw error;
        return c.json(data, 201);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.post('/onboard', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        await supabase.from('users').update({ lab_onboarded_at: new Date().toISOString() }).eq('id', userId).is('lab_onboarded_at', null);
        return c.json({ success: true }, 204);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

export default app;
