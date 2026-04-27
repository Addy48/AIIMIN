/**
 * routes/lab.js
 * 
 * The Lab — three-pillar intelligence dashboard routes.
 * PRACTICE: typing, speaking, reaction, decisions
 * INTEL: mindset, insights, correlations
 * AUDIT: beliefs, prompts, quarterly review
 */
import express from 'express';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { cacheMiddleware } from '../lib/cache.js';
import { getQuarterInfo, getCurrentQuarterAnchor } from '../lib/quarter.js';

const router = express.Router();
const labCache = cacheMiddleware(60_000, (req) => `lab-summary:${req.userId}`);

// ─────────────────────────────────────────────────────
// Helper: update streak + check mastery
// ─────────────────────────────────────────────────────
const MASTERY_THRESHOLDS = {
    typing: { bronze: 60, silver: 90, gold: 120, platinum: 140 },
    speaking: { bronze: 60, silver: 75, gold: 85, platinum: 92 },
    reaction: { bronze: 250, silver: 220, gold: 200, platinum: 180 }, // lower is better
    decisions: { bronze: 3, silver: 5, gold: 7, platinum: 10 },
};

const MASTERY_MIN_ENTRIES = { typing: 5, speaking: 3, reaction: 3, decisions: 2 };

async function updateStreak(userId, metric) {
    const today = new Date().toISOString().slice(0, 10);
    const result = await pool.query(
        `INSERT INTO lab_streaks (user_id, metric, current_streak, longest_streak, last_logged_day, updated_at)
         VALUES ($1, $2, 1, 1, $3, NOW())
         ON CONFLICT (user_id, metric) DO UPDATE SET
           current_streak = CASE
             WHEN lab_streaks.last_logged_day = ($3::date - 1) THEN lab_streaks.current_streak + 1
             WHEN lab_streaks.last_logged_day = $3::date THEN lab_streaks.current_streak
             ELSE 1
           END,
           longest_streak = GREATEST(lab_streaks.longest_streak,
             CASE
               WHEN lab_streaks.last_logged_day = ($3::date - 1) THEN lab_streaks.current_streak + 1
               WHEN lab_streaks.last_logged_day = $3::date THEN lab_streaks.current_streak
               ELSE 1
             END
           ),
           last_logged_day = $3,
           updated_at = NOW()
         RETURNING current_streak, longest_streak`,
        [userId, metric, today]
    );
    return result.rows[0];
}

async function checkMastery(userId, metric, value) {
    const thresholds = MASTERY_THRESHOLDS[metric];
    if (!thresholds) return null;

    // Count qualifying entries
    const tableMap = {
        typing: 'lab_typing_tests', speaking: 'lab_speaking_logs',
        reaction: 'lab_reaction_tests', decisions: 'lab_decision_scenarios',
    };
    const countResult = await pool.query(
        `SELECT COUNT(*)::int AS total FROM ${tableMap[metric]} WHERE user_id = $1`,
        [userId]
    );
    const total = countResult.rows[0].total;
    const minEntries = MASTERY_MIN_ENTRIES[metric];

    if (total < minEntries) return null;

    // Determine highest earned tier
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

    // Insert if not already granted (badges never downgrade)
    const { rowCount } = await pool.query(
        `INSERT INTO lab_mastery_badges (user_id, metric, tier, granted_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, metric, tier) DO NOTHING`,
        [userId, metric, earned]
    );

    return rowCount > 0 ? earned : null; // only return if newly granted
}


// ═══════════════════════════════════════════════════════
// GET /lab/summary — the single aggregate endpoint
// ═══════════════════════════════════════════════════════
router.get('/summary', requireAuth, labCache, async (req, res) => {
    try {
        const userId = req.userId;

        const [
            typingRes, speakingRes, reactionRes, decisionsRes,
            streaksRes, badgesRes,
            mindsetRes, correlationsRes, insightsCountRes,
            beliefsRes, flagsRes,
            userRes, rcRes
        ] = await Promise.all([
            // PRACTICE: typing weekly best
            pool.query(
                `SELECT MAX(wpm) AS weekly_best FROM lab_typing_tests
                 WHERE user_id = $1 AND test_invalid = false
                   AND day_of >= CURRENT_DATE - 7`, [userId]),
            // PRACTICE: speaking latest
            pool.query(
                `SELECT confidence_score, logged_at FROM lab_speaking_logs
                 WHERE user_id = $1 ORDER BY logged_at DESC LIMIT 1`, [userId]),
            // PRACTICE: reaction mean of last 3
            pool.query(
                `SELECT mean_ms FROM lab_reaction_tests
                 WHERE user_id = $1 AND test_invalid = false
                 ORDER BY taken_at DESC LIMIT 3`, [userId]),
            // PRACTICE: decisions this week
            pool.query(
                `SELECT COUNT(*)::int AS week_count, 
                        AVG(quality_self)::numeric(3,1) AS mean_quality,
                        MODE() WITHIN GROUP (ORDER BY domain) AS dominant_domain,
                        MAX(iso_week) AS iso_week
                 FROM lab_decision_scenarios 
                 WHERE user_id = $1 AND iso_year = EXTRACT(ISOYEAR FROM NOW())::int
                   AND iso_week = EXTRACT(WEEK FROM NOW())::int`, [userId]),
            // Streaks
            pool.query(`SELECT metric, current_streak, longest_streak FROM lab_streaks WHERE user_id = $1`, [userId]),
            // Badges (highest tier per metric)
            pool.query(
                `SELECT DISTINCT ON (metric) metric, tier FROM lab_mastery_badges
                 WHERE user_id = $1 ORDER BY metric, granted_at DESC`, [userId]),
            // INTEL: mindset today
            pool.query(
                `SELECT state, logged_at FROM lab_mindset_logs
                 WHERE user_id = $1 AND day_of = CURRENT_DATE LIMIT 1`, [userId]),
            // INTEL: active correlations
            pool.query(
                `SELECT COUNT(*)::int AS active FROM lab_correlations
                 WHERE user_id = $1 AND bh_passed = true
                   AND computed_at > NOW() - INTERVAL '26 hours'`, [userId]),
            // INTEL: unread insights
            pool.query(
                `SELECT 
                    COUNT(*)::int AS total,
                    COUNT(*) FILTER (WHERE i.id NOT IN (SELECT insight_id FROM lab_insight_reads WHERE user_id = $1))::int AS unread
                 FROM lab_insights i WHERE i.user_id = $1`, [userId]),
            // AUDIT: beliefs this quarter
            pool.query(
                `SELECT u.quarterly_review_anchor FROM users u WHERE u.id = $1`, [userId]),
            // AUDIT: pattern flags
            pool.query(
                `SELECT id, rho, signal_a, signal_b FROM lab_correlations
                 WHERE user_id = $1 AND bh_passed = true AND ABS(rho) >= 0.60
                   AND computed_at > NOW() - INTERVAL '26 hours'
                 ORDER BY ABS(rho) DESC LIMIT 10`, [userId]),
            // User info
            pool.query(`SELECT quarterly_review_anchor, lab_onboarded_at FROM users WHERE id = $1`, [userId]),
            // RC sub-logger
            pool.query(
                `SELECT rc_entries FROM daily_logs
                 WHERE user_id = $1 AND deleted_at IS NULL
                 ORDER BY date DESC LIMIT 1`, [userId]),
        ]);

        // Process PRACTICE
        const streakMap = {};
        for (const row of streaksRes.rows) streakMap[row.metric] = row.current_streak;
        const badgeMap = {};
        for (const row of badgesRes.rows) badgeMap[row.metric] = row.tier;

        const reactionMsValues = reactionRes.rows.map(r => r.mean_ms);
        const reactionMeanLast3 = reactionMsValues.length > 0
            ? Math.round(reactionMsValues.reduce((a, b) => a + b, 0) / reactionMsValues.length)
            : null;

        // Process AUDIT quarter info
        const anchor = userRes.rows[0]?.quarterly_review_anchor || '2026-01-01';
        const quarterInfo = getQuarterInfo(anchor);
        const qAnchor = getCurrentQuarterAnchor(anchor);

        // Get beliefs count for this quarter
        const beliefsCountRes = await pool.query(
            `SELECT COUNT(DISTINCT domain)::int AS completed, 
                    array_agg(DISTINCT domain) AS completed_domains
             FROM lab_beliefs WHERE user_id = $1 AND quarter_anchor = $2`,
            [userId, qAnchor]
        );

        // RC sub-logger status
        let rcLastHoursAgo = null;
        let rcStatusDot = 'none';
        if (rcRes.rows[0]?.rc_entries?.length > 0) {
            const entries = rcRes.rows[0].rc_entries;
            const lastTs = entries[entries.length - 1]?.timestamp;
            if (lastTs) {
                const hoursAgo = (Date.now() - new Date(lastTs).getTime()) / (1000 * 60 * 60);
                rcLastHoursAgo = Math.round(hoursAgo);
                rcStatusDot = hoursAgo < 24 ? 'red' : hoursAgo > 168 ? 'gray' : 'none';
            }
        }

        // Latest pattern for bottom bar
        const latestPattern = await pool.query(
            `SELECT i.id, i.headline, i.rho, i.n_samples,
                    EXISTS(SELECT 1 FROM lab_insight_reads r WHERE r.insight_id = i.id AND r.user_id = $1) AS is_read
             FROM lab_insights i WHERE i.user_id = $1
             ORDER BY i.created_at DESC LIMIT 1`, [userId]
        );

        const d = decisionsRes.rows[0] || {};

        res.json({
            practice: {
                typing: {
                    weekly_best_wpm: typingRes.rows[0]?.weekly_best || null,
                    mastery: badgeMap.typing || 'unranked',
                    streak_days: streakMap.typing || 0,
                    trend: 'flat',
                },
                speaking: {
                    latest_score: speakingRes.rows[0]?.confidence_score || null,
                    mastery: badgeMap.speaking || 'unranked',
                    trend: 'flat',
                    last_logged_at: speakingRes.rows[0]?.logged_at || null,
                },
                reaction: {
                    mean_ms_last3: reactionMeanLast3,
                    mastery: badgeMap.reaction || 'unranked',
                    tests_today: 0,
                },
                decisions: {
                    week_count: d.week_count || 0,
                    iso_week: d.iso_week || null,
                    dominant_domain: d.dominant_domain || null,
                    mean_quality: d.mean_quality ? parseFloat(d.mean_quality) : null,
                },
            },
            intel: {
                growth_dashboard: { active_correlations: correlationsRes.rows[0]?.active || 0 },
                rc_sublogger: { last_entry_hours_ago: rcLastHoursAgo, status_dot: rcStatusDot },
                mindset_state: {
                    state: mindsetRes.rows[0]?.state || null,
                    logged_at_hour: mindsetRes.rows[0]?.logged_at
                        ? new Date(mindsetRes.rows[0].logged_at).getHours()
                        : null,
                },
                insights: {
                    unread_count: insightsCountRes.rows[0]?.unread || 0,
                    total_count: insightsCountRes.rows[0]?.total || 0,
                },
            },
            audit: {
                belief_inventory: {
                    current_quarter: quarterInfo.quarterLabel,
                    completed: beliefsCountRes.rows[0]?.completed || 0,
                    total: 6,
                    completed_domains: beliefsCountRes.rows[0]?.completed_domains || [],
                },
                pattern_flags: {
                    flagged_count: flagsRes.rows.length,
                    needs_review: flagsRes.rows.map(r => ({
                        id: r.id, rho: parseFloat(r.rho),
                        signal_a: r.signal_a, signal_b: r.signal_b,
                    })),
                },
                quarterly_review: {
                    next_review_date: quarterInfo.quarterEnd.toISOString(),
                    days_until: quarterInfo.daysUntil,
                    quarter_progress_pct: quarterInfo.progressPct,
                },
            },
            user: {
                lab_onboarded_at: userRes.rows[0]?.lab_onboarded_at || null,
                quarterly_review_anchor: anchor,
            },
            latest_pattern: latestPattern.rows[0] ? {
                insight_id: latestPattern.rows[0].id,
                headline: latestPattern.rows[0].headline,
                rho: parseFloat(latestPattern.rows[0].rho),
                n_samples: latestPattern.rows[0].n_samples,
                is_read: latestPattern.rows[0].is_read,
            } : null,
        });
    } catch (err) {
        console.error('[lab/summary] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});


// ═══════════════════════════════════════════════════════
// PRACTICE ENDPOINTS
// ═══════════════════════════════════════════════════════

// POST /lab/practice/typing
router.post('/practice/typing', requireAuth, async (req, res) => {
    try {
        const { wpm, accuracy_pct, duration_sec = 60 } = req.body;
        if (!wpm || accuracy_pct === undefined) {
            return res.status(400).json({ error: 'wpm and accuracy_pct required' });
        }

        const result = await pool.query(
            `INSERT INTO lab_typing_tests (user_id, wpm, accuracy_pct, duration_sec)
             VALUES ($1, $2, $3, $4) RETURNING id, test_invalid, day_of`,
            [req.userId, wpm, accuracy_pct, duration_sec]
        );

        const streak = await updateStreak(req.userId, 'typing');
        const masteryChange = await checkMastery(req.userId, 'typing', wpm);

        res.status(201).json({
            ...result.rows[0], streak_days: streak.current_streak,
            mastery_change: masteryChange,
        });
    } catch (err) {
        console.error('[lab/practice/typing] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});

// POST /lab/practice/speaking
router.post('/practice/speaking', requireAuth, async (req, res) => {
    try {
        const { confidence_score, clarity_score, pace_score, prompt_id, notes } = req.body;
        if (!confidence_score) {
            return res.status(400).json({ error: 'confidence_score required' });
        }

        const result = await pool.query(
            `INSERT INTO lab_speaking_logs (user_id, confidence_score, clarity_score, pace_score, prompt_id, notes)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, day_of`,
            [req.userId, confidence_score, clarity_score, pace_score, prompt_id, notes]
        );

        const streak = await updateStreak(req.userId, 'speaking');
        const masteryChange = await checkMastery(req.userId, 'speaking', confidence_score);

        res.status(201).json({
            ...result.rows[0], streak_days: streak.current_streak,
            mastery_change: masteryChange,
        });
    } catch (err) {
        console.error('[lab/practice/speaking] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});

// POST /lab/practice/reaction
router.post('/practice/reaction', requireAuth, async (req, res) => {
    try {
        const { trial_ms } = req.body;
        if (!trial_ms || trial_ms.length !== 5) {
            return res.status(400).json({ error: 'trial_ms array of 5 values required' });
        }

        // Compute mean of middle 3 (discard lowest and highest)
        const sorted = [...trial_ms].sort((a, b) => a - b);
        const middle3 = sorted.slice(1, 4);
        const mean_ms = Math.round(middle3.reduce((a, b) => a + b, 0) / 3);

        const result = await pool.query(
            `INSERT INTO lab_reaction_tests (user_id, trial_ms, mean_ms)
             VALUES ($1, $2, $3) RETURNING id, day_of`,
            [req.userId, trial_ms, mean_ms]
        );

        const streak = await updateStreak(req.userId, 'reaction');
        const masteryChange = await checkMastery(req.userId, 'reaction', mean_ms);

        res.status(201).json({
            ...result.rows[0], mean_ms, streak_days: streak.current_streak,
            mastery_change: masteryChange,
        });
    } catch (err) {
        console.error('[lab/practice/reaction] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});

// POST /lab/practice/decisions
router.post('/practice/decisions', requireAuth, async (req, res) => {
    try {
        const { prompt_id, domain, response_text, quality_self } = req.body;
        if (!domain || !quality_self) {
            return res.status(400).json({ error: 'domain and quality_self required' });
        }

        const result = await pool.query(
            `INSERT INTO lab_decision_scenarios (user_id, prompt_id, domain, response_text, quality_self)
             VALUES ($1, $2, $3, $4, $5) RETURNING id, iso_week, iso_year`,
            [req.userId, prompt_id, domain, response_text, quality_self]
        );

        const streak = await updateStreak(req.userId, 'decisions');

        res.status(201).json({
            ...result.rows[0], streak_days: streak.current_streak,
        });
    } catch (err) {
        console.error('[lab/practice/decisions] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});

// GET /lab/practice/:metric/history
router.get('/practice/:metric/history', requireAuth, async (req, res) => {
    try {
        const { metric } = req.params;
        const days = parseInt(req.query.days) || 30;
        const tableMap = {
            typing: 'lab_typing_tests', speaking: 'lab_speaking_logs',
            reaction: 'lab_reaction_tests', decisions: 'lab_decision_scenarios',
        };
        const table = tableMap[metric];
        if (!table) return res.status(400).json({ error: 'Invalid metric' });

        const dateCol = metric === 'decisions' ? 'responded_at' : (metric === 'speaking' ? 'logged_at' : 'taken_at');
        const result = await pool.query(
            `SELECT * FROM ${table} WHERE user_id = $1 AND ${dateCol} > NOW() - ($2 || ' days')::interval ORDER BY ${dateCol} DESC`,
            [req.userId, days]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(`[lab/practice/${req.params.metric}/history] Error:`, err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});


// ═══════════════════════════════════════════════════════
// INTEL ENDPOINTS
// ═══════════════════════════════════════════════════════

// POST /lab/mindset
router.post('/mindset', requireAuth, async (req, res) => {
    try {
        const { state, note } = req.body;
        const validStates = ['clarity', 'scarcity', 'abundance', 'fear', 'growth', 'aimlessness', 'focus', 'noise'];
        if (!state || !validStates.includes(state)) {
            return res.status(400).json({ error: `state must be one of: ${validStates.join(', ')}` });
        }

        const result = await pool.query(
            `INSERT INTO lab_mindset_logs (user_id, state, note)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, day_of) DO UPDATE SET state = $2, note = $3, logged_at = NOW()
             RETURNING id, state, day_of`,
            [req.userId, state, note]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('[lab/mindset] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});

// GET /lab/insights
router.get('/insights', requireAuth, async (req, res) => {
    try {
        const { status = 'all', limit = 20, offset = 0 } = req.query;
        let query = `
            SELECT i.*, 
                   EXISTS(SELECT 1 FROM lab_insight_reads r WHERE r.insight_id = i.id AND r.user_id = $1) AS is_read
            FROM lab_insights i WHERE i.user_id = $1`;

        if (status === 'unread') {
            query += ` AND i.id NOT IN (SELECT insight_id FROM lab_insight_reads WHERE user_id = $1)`;
        }

        query += ` ORDER BY i.created_at DESC LIMIT $2 OFFSET $3`;

        const result = await pool.query(query, [req.userId, parseInt(limit), parseInt(offset)]);
        res.json(result.rows);
    } catch (err) {
        console.error('[lab/insights] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});

// PATCH /lab/insights/:id/read
router.patch('/insights/:id/read', requireAuth, async (req, res) => {
    try {
        await pool.query(
            `INSERT INTO lab_insight_reads (user_id, insight_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [req.userId, req.params.id]
        );
        res.status(204).end();
    } catch (err) {
        console.error('[lab/insights/read] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});

// POST /lab/insights/mark-all-read
router.post('/insights/mark-all-read', requireAuth, async (req, res) => {
    try {
        await pool.query(
            `INSERT INTO lab_insight_reads (user_id, insight_id)
             SELECT $1, id FROM lab_insights WHERE user_id = $1
               AND id NOT IN (SELECT insight_id FROM lab_insight_reads WHERE user_id = $1)`,
            [req.userId]
        );
        res.status(204).end();
    } catch (err) {
        console.error('[lab/insights/mark-all-read] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});


// ═══════════════════════════════════════════════════════
// AUDIT ENDPOINTS
// ═══════════════════════════════════════════════════════

// GET /lab/beliefs
router.get('/beliefs', requireAuth, async (req, res) => {
    try {
        const userRes = await pool.query(
            `SELECT quarterly_review_anchor FROM users WHERE id = $1`, [req.userId]);
        const anchor = userRes.rows[0]?.quarterly_review_anchor || '2026-01-01';

        const quarter = req.query.quarter || 'current';
        let qAnchor;
        if (quarter === 'current') {
            qAnchor = getCurrentQuarterAnchor(anchor);
        } else if (quarter === 'previous') {
            const info = getQuarterInfo(anchor);
            const prevStart = new Date(info.quarterStart);
            prevStart.setDate(prevStart.getDate() - 90);
            qAnchor = prevStart.toISOString().slice(0, 10);
        } else {
            qAnchor = quarter; // direct date
        }

        const result = await pool.query(
            `SELECT b.domain, b.prompt_id, p.prompt_text, b.response_text, b.created_at
             FROM lab_beliefs b
             LEFT JOIN lab_belief_prompts p ON p.id = b.prompt_id
             WHERE b.user_id = $1 AND b.quarter_anchor = $2
             ORDER BY b.domain`,
            [req.userId, qAnchor]
        );

        res.json({ quarter_anchor: qAnchor, entries: result.rows });
    } catch (err) {
        console.error('[lab/beliefs] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});

// POST /lab/beliefs
router.post('/beliefs', requireAuth, async (req, res) => {
    try {
        const { domain, prompt_id, response_text } = req.body;
        const validDomains = ['money', 'opportunity', 'women', 'identity', 'society', 'fear'];
        if (!domain || !validDomains.includes(domain) || !prompt_id || !response_text) {
            return res.status(400).json({ error: 'domain, prompt_id, and response_text required' });
        }

        const userRes = await pool.query(
            `SELECT quarterly_review_anchor FROM users WHERE id = $1`, [req.userId]);
        const anchor = userRes.rows[0]?.quarterly_review_anchor || '2026-01-01';
        const qAnchor = getCurrentQuarterAnchor(anchor);

        const result = await pool.query(
            `INSERT INTO lab_beliefs (user_id, domain, prompt_id, response_text, quarter_anchor)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (user_id, domain, quarter_anchor) DO UPDATE SET
               prompt_id = $3, response_text = $4, created_at = NOW()
             RETURNING id, domain, quarter_anchor`,
            [req.userId, domain, prompt_id, response_text, qAnchor]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('[lab/beliefs] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});

// POST /lab/onboard — mark user as having seen the intro
router.post('/onboard', requireAuth, async (req, res) => {
    try {
        await pool.query(
            `UPDATE users SET lab_onboarded_at = NOW() WHERE id = $1 AND lab_onboarded_at IS NULL`,
            [req.userId]
        );
        res.status(204).end();
    } catch (err) {
        console.error('[lab/onboard] Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /lab/beliefs/prompts
router.get('/beliefs/prompts', requireAuth, async (req, res) => {
    try {
        const { domain } = req.query;
        let query = 'SELECT id, domain, prompt_text, sort_order FROM lab_belief_prompts';
        const params = [];
        if (domain) {
            query += ' WHERE domain = $1';
            params.push(domain);
        }
        query += ' ORDER BY domain, sort_order';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('[lab/beliefs/prompts] Error:', err);
        res.status(500).json({ error: err.message, correlationId: req.correlationId });
    }
});


export default router;
