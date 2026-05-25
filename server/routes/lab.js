/**
 * routes/lab.js
 * The Lab — intelligence dashboard routes.
 * Uses pool.query() against Supabase PostgreSQL.
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

const MASTERY_THRESHOLDS = {
    typing:    { bronze: 60, silver: 90, gold: 120, platinum: 140 },
    speaking:  { bronze: 60, silver: 75, gold: 85,  platinum: 92 },
    reaction:  { bronze: 250, silver: 220, gold: 200, platinum: 180 },
    decisions: { bronze: 3,  silver: 5,  gold: 7,   platinum: 10 },
};
const MASTERY_MIN_ENTRIES = { typing: 5, speaking: 3, reaction: 3, decisions: 2 };

async function updateStreak(userId, metric) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const { rows } = await pool.query(
        'SELECT * FROM lab_streaks WHERE user_id = $1 AND metric = $2',
        [userId, metric]
    );
    const current = rows[0] || null;

    let newStreak = 1;
    let longest = current?.longest_streak || 1;
    if (current) {
        if (current.last_logged_day === todayStr) {
            newStreak = current.current_streak;
        } else if (current.last_logged_day === yesterdayStr) {
            newStreak = current.current_streak + 1;
        }
        longest = Math.max(longest, newStreak);
    }

    const { rows: updated } = await pool.query(
        `INSERT INTO lab_streaks (user_id, metric, current_streak, longest_streak, last_logged_day, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (user_id, metric)
         DO UPDATE SET current_streak = $3, longest_streak = $4, last_logged_day = $5, updated_at = NOW()
         RETURNING *`,
        [userId, metric, newStreak, longest, todayStr]
    );
    return updated[0];
}

async function checkMastery(userId, metric, value) {
    const thresholds = MASTERY_THRESHOLDS[metric];
    if (!thresholds) return null;

    const tableMap = {
        typing: 'lab_typing_tests', speaking: 'lab_speaking_logs',
        reaction: 'lab_reaction_tests', decisions: 'lab_decision_scenarios',
    };

    const { rows: countRows } = await pool.query(
        `SELECT COUNT(*) AS cnt FROM ${tableMap[metric]} WHERE user_id = $1`,
        [userId]
    );
    const cnt = parseInt(countRows[0]?.cnt || '0');
    if (cnt < MASTERY_MIN_ENTRIES[metric]) return null;

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

    await pool.query(
        `INSERT INTO lab_mastery_badges (user_id, metric, tier, granted_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, metric, tier) DO NOTHING`,
        [userId, metric, earned]
    );
    return earned;
}

// ═══════════════════════════════════════════════════════
// GET /api/lab/summary
// ═══════════════════════════════════════════════════════
app.get('/summary', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const todayStr = new Date().toISOString().slice(0, 10);
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

        const [typingRes, speakingRes, reactionRes, streaksRes, badgesRes, mindsetRes, userRes] = await Promise.all([
            pool.query(`SELECT wpm FROM lab_typing_tests WHERE user_id = $1 AND test_invalid = false AND day_of >= $2 ORDER BY wpm DESC LIMIT 1`, [userId, sevenDaysAgo]).catch(() => ({ rows: [] })),
            pool.query(`SELECT confidence_score, logged_at FROM lab_speaking_logs WHERE user_id = $1 ORDER BY logged_at DESC LIMIT 1`, [userId]).catch(() => ({ rows: [] })),
            pool.query(`SELECT mean_ms FROM lab_reaction_tests WHERE user_id = $1 AND test_invalid = false ORDER BY taken_at DESC LIMIT 3`, [userId]).catch(() => ({ rows: [] })),
            pool.query(`SELECT metric, current_streak, longest_streak FROM lab_streaks WHERE user_id = $1`, [userId]).catch(() => ({ rows: [] })),
            pool.query(`SELECT metric, tier FROM lab_mastery_badges WHERE user_id = $1 ORDER BY granted_at DESC`, [userId]).catch(() => ({ rows: [] })),
            pool.query(`SELECT state, logged_at FROM lab_mindset_logs WHERE user_id = $1 AND day_of = $2 LIMIT 1`, [userId, todayStr]).catch(() => ({ rows: [] })),
            pool.query(`SELECT lab_onboarded_at FROM users WHERE id = $1`, [userId]).catch(() => ({ rows: [] })),
        ]);

        const streakMap = {};
        (streaksRes.rows || []).forEach(s => streakMap[s.metric] = s.current_streak);

        const badgeMap = {};
        (badgesRes.rows || []).forEach(b => { if (!badgeMap[b.metric]) badgeMap[b.metric] = b.tier; });

        const reactionValues = (reactionRes.rows || []).map(r => r.mean_ms);
        const reactionMean = reactionValues.length > 0
            ? Math.round(reactionValues.reduce((a, b) => a + b, 0) / reactionValues.length)
            : null;

        return c.json({
            practice: {
                typing:    { weekly_best_wpm: typingRes.rows[0]?.wpm || null, mastery: badgeMap.typing || 'unranked', streak_days: streakMap.typing || 0 },
                speaking:  { latest_score: speakingRes.rows[0]?.confidence_score || null, mastery: badgeMap.speaking || 'unranked' },
                reaction:  { mean_ms_last3: reactionMean, mastery: badgeMap.reaction || 'unranked' },
                decisions: { mastery: badgeMap.decisions || 'unranked' },
            },
            intel: {
                mindset_state: { state: mindsetRes.rows[0]?.state || null },
            },
            user: { lab_onboarded_at: userRes.rows[0]?.lab_onboarded_at || null },
        });
    } catch (err) {
        console.error('[lab/summary] Error:', err);
        return c.json({ error: err.message }, 500);
    }
});

app.post('/practice/typing', requireAuth, async (c) => {
    try {
        const { wpm, accuracy_pct, duration_sec = 60 } = await c.req.json();
        const userId = c.get('userId');
        const { rows } = await pool.query(
            `INSERT INTO lab_typing_tests (user_id, wpm, accuracy_pct, duration_sec) VALUES ($1,$2,$3,$4) RETURNING *`,
            [userId, wpm, accuracy_pct, duration_sec]
        );
        const streak = await updateStreak(userId, 'typing');
        const mastery = await checkMastery(userId, 'typing', wpm);
        return c.json({ ...rows[0], streak_days: streak.current_streak, mastery_change: mastery }, 201);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.post('/practice/speaking', requireAuth, async (c) => {
    try {
        const { confidence_score, clarity_score, pace_score, prompt_id, notes } = await c.req.json();
        const userId = c.get('userId');
        const { rows } = await pool.query(
            `INSERT INTO lab_speaking_logs (user_id, confidence_score, clarity_score, pace_score, prompt_id, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [userId, confidence_score, clarity_score, pace_score, prompt_id, notes]
        );
        await updateStreak(userId, 'speaking');
        return c.json(rows[0], 201);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.post('/practice/reaction', requireAuth, async (c) => {
    try {
        const { trial_ms } = await c.req.json();
        const userId = c.get('userId');
        const sorted = [...trial_ms].sort((a, b) => a - b);
        const mean_ms = Math.round(sorted.slice(1, 4).reduce((a, b) => a + b, 0) / 3);
        const { rows } = await pool.query(
            `INSERT INTO lab_reaction_tests (user_id, trial_ms, mean_ms) VALUES ($1,$2,$3) RETURNING *`,
            [userId, JSON.stringify(trial_ms), mean_ms]
        );
        await updateStreak(userId, 'reaction');
        return c.json(rows[0], 201);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.post('/practice/decisions', requireAuth, async (c) => {
    try {
        const { prompt_id, domain, response_text, quality_self } = await c.req.json();
        const userId = c.get('userId');
        const { rows } = await pool.query(
            `INSERT INTO lab_decision_scenarios (user_id, prompt_id, domain, response_text, quality_self) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [userId, prompt_id, domain, response_text, quality_self]
        );
        await updateStreak(userId, 'decisions');
        return c.json(rows[0], 201);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.post('/mindset', requireAuth, async (c) => {
    try {
        const { state, note } = await c.req.json();
        const userId = c.get('userId');
        const todayStr = new Date().toISOString().slice(0, 10);
        const { rows } = await pool.query(
            `INSERT INTO lab_mindset_logs (user_id, state, note, day_of, logged_at)
             VALUES ($1,$2,$3,$4,NOW())
             ON CONFLICT (user_id, day_of) DO UPDATE SET state=$2, note=$3, logged_at=NOW()
             RETURNING *`,
            [userId, state, note, todayStr]
        );
        return c.json(rows[0], 201);
    } catch (err) { return c.json({ error: err.message }, 500); }
});

app.post('/onboard', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        await pool.query(
            `UPDATE users SET lab_onboarded_at = NOW() WHERE id = $1 AND lab_onboarded_at IS NULL`,
            [userId]
        );
        return c.json({ success: true });
    } catch (err) { return c.json({ error: err.message }, 500); }
});

export default app;
