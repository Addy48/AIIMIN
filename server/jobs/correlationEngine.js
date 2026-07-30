/**
 * jobs/correlationEngine.js
 * 
 * Spearman correlation computation for AIIMIN intelligence.
 * Refactored for Cloudflare Workers (uses Supabase client).
 */
import { spearman, benjaminiHochberg } from '../lib/spearman.js';

const MIN_SAMPLES = 7;

function generateHeadline(signalA, signalB, rho) {
    const direction = rho > 0 ? 'higher' : 'lower';
    const pctImpact = Math.round(Math.abs(rho) * 100);
    return `When ${signalA.replace(/_/g, ' ')} is ${direction}, ${signalB.replace(/_/g, ' ')} trends ${rho > 0 ? 'up' : 'down'} by ~${pctImpact}%`;
}

async function fetchSignal(supabase, userId, name, thirtyDaysAgo) {
    let query;
    switch (name) {
        case 'mood':
            query = supabase.from('daily_logs').select('date, mood').eq('user_id', userId).not('mood', 'is', null).gt('date', thirtyDaysAgo).is('deleted_at', null);
            break;
        case 'sleep_hours':
            query = supabase.from('daily_logs').select('date, sleep_hours').eq('user_id', userId).not('sleep_hours', 'is', null).gt('date', thirtyDaysAgo).is('deleted_at', null);
            break;
        case 'focus_score':
            query = supabase.from('daily_logs').select('date, focus_score').eq('user_id', userId).gt('focus_score', 0).gt('date', thirtyDaysAgo).is('deleted_at', null);
            break;
        case 'rc_count':
            query = supabase.from('daily_logs').select('date, rc_count').eq('user_id', userId).gt('date', thirtyDaysAgo).is('deleted_at', null);
            break;
        case 'gym_done':
            query = supabase.from('daily_logs').select('date, gym_done').eq('user_id', userId).gt('date', thirtyDaysAgo).is('deleted_at', null);
            break;
        case 'steps':
            query = supabase.from('daily_logs').select('date, steps').eq('user_id', userId).gt('date', thirtyDaysAgo).is('deleted_at', null);
            break;
        case 'water_bottles':
            query = supabase.from('daily_logs').select('date, water_bottles').eq('user_id', userId).gt('date', thirtyDaysAgo).is('deleted_at', null);
            break;
        case 'typing_wpm':
            query = supabase.from('lab_typing_tests').select('day_of, wpm').eq('user_id', userId).eq('test_invalid', false).gt('day_of', thirtyDaysAgo);
            break;
        case 'reaction_ms':
            query = supabase.from('lab_reaction_tests').select('day_of, mean_ms').eq('user_id', userId).eq('test_invalid', false).gt('day_of', thirtyDaysAgo);
            break;
        case 'speaking_score':
            query = supabase.from('lab_speaking_logs').select('logged_at, confidence_score').eq('user_id', userId).gt('logged_at', thirtyDaysAgo);
            break;
        default: return new Map();
    }

    const { data, error } = await query;
    if (error || !data) return new Map();

    const result = new Map();
    data.forEach(r => {
        const date = (r.date || r.day_of || r.logged_at).slice(0, 10);
        const val = r.mood ?? r.sleep_hours ?? r.focus_score ?? r.rc_count ?? (r.gym_done ? 1.0 : 0.0) ?? r.steps ?? r.water_bottles ?? r.wpm ?? r.mean_ms ?? r.confidence_score;

        // Handle max/min group logic in JS
        if (!result.has(date) ||
            (name === 'reaction_ms' && val < result.get(date)) ||
            (name !== 'reaction_ms' && val > result.get(date))) {
            result.set(date, val);
        }
    });
    return result;
}

const SIGNAL_NAMES = ['mood', 'sleep_hours', 'focus_score', 'rc_count', 'gym_done', 'steps', 'water_bottles', 'typing_wpm', 'reaction_ms', 'speaking_score'];

async function processUser(supabase, userId) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    const signalData = {};

    for (const name of SIGNAL_NAMES) {
        signalData[name] = await fetchSignal(supabase, userId, name, thirtyDaysAgo);
    }

    const results = [];
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        for (let j = i + 1; j < SIGNAL_NAMES.length; j++) {
            const a = SIGNAL_NAMES[i];
            const b = SIGNAL_NAMES[j];
            const mapA = signalData[a];
            const mapB = signalData[b];

            const commonDates = [...mapA.keys()].filter(d => mapB.has(d));
            if (commonDates.length < MIN_SAMPLES) continue;

            const xVals = commonDates.map(d => mapA.get(d));
            const yVals = commonDates.map(d => mapB.get(d));

            const { rho, pValue, n } = spearman(xVals, yVals);
            results.push({ signalA: a, signalB: b, rho, pValue, n });
        }
    }

    if (results.length === 0) return 0;

    const passes = benjaminiHochberg(results, 0.10);
    let insightCount = 0;

    for (let k = 0; k < results.length; k++) {
        const r = results[k];
        const bhPassed = passes[k];

        const { data: corr, error: corrErr } = await supabase
            .from('lab_correlations')
            .insert({ user_id: userId, signal_a: r.signalA, signal_b: r.signalB, rho: r.rho, p_value: r.pValue, bh_passed: bhPassed, n_samples: r.n })
            .select()
            .single();

        if (corrErr) continue;

        if (bhPassed && Math.abs(r.rho) >= 0.35) {
            const headline = generateHeadline(r.signalA, r.signalB, r.rho);
            const severity = Math.abs(r.rho) >= 0.60 ? 'flag' : 'surface';

            await supabase.from('lab_insights').insert({
                user_id: userId, correlation_id: corr.id, headline, effect_pct: Math.round(Math.abs(r.rho) * 100), n_samples: r.n, rho: r.rho, severity
            });
            insightCount++;
        }
    }

    return insightCount;
}

/**
 * Goal × linked-habit consistency pass (AnchorEdge habit→goal).
 * Plain-language headlines only — no rho shown by default to clients.
 */
async function processGoalHabitLinks(supabase, userId) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

    const { data: edges } = await supabase
        .from('anchor_edges')
        .select('source_id, target_id, relationship, confirmed')
        .eq('user_id', userId)
        .eq('source_type', 'habit')
        .eq('target_type', 'goal')
        .eq('confirmed', true);

    if (!edges?.length) return 0;

    let made = 0;
    for (const edge of edges) {
        const habitId = edge.source_id;
        const goalId = edge.target_id;

        const { data: logs } = await supabase
            .from('habit_logs')
            .select('completed_at')
            .eq('user_id', userId)
            .eq('habit_id', habitId)
            .gte('completed_at', thirtyDaysAgo);

        const daysWithLog = new Set(
            (logs || []).map((l) => String(l.completed_at).slice(0, 10))
        ).size;
        const consistency = daysWithLog / 30;

        if (consistency >= 0.3) continue;

        const headline = `A linked habit for one of your goals dropped below 30% consistency in the last 30 days — check the habit before pushing the goal harder.`;
        try {
            await supabase.from('lab_insights').insert({
                user_id: userId,
                headline,
                effect_pct: Math.round((1 - consistency) * 100),
                n_samples: daysWithLog,
                severity: 'surface',
            });
            made++;
        } catch {
            /* schema variance — skip */
        }
    }
    return made;
}

export async function runCorrelationEngine(supabase) {
    console.log('[CorrelationEngine] Starting...');
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

    // Get users with 14+ logs
    const { data: users, error } = await supabase
        .from('daily_logs')
        .select('user_id')
        .gt('date', thirtyDaysAgo)
        .is('deleted_at', null);

    if (error || !users) return;

    const userCounts = {};
    users.forEach(u => userCounts[u.user_id] = (userCounts[u.user_id] || 0) + 1);
    const targetUsers = Object.keys(userCounts).filter(uid => userCounts[uid] >= 14);

    console.log(`[CorrelationEngine] Processing ${targetUsers.length} users...`);

    let totalInsights = 0;
    for (const userId of targetUsers) {
        try {
            const count = await processUser(supabase, userId);
            const linkCount = await processGoalHabitLinks(supabase, userId);
            totalInsights += count + linkCount;
        } catch (err) {
            console.error(`[CorrelationEngine] Error for user ${userId}:`, err);
        }
    }
    console.log(`[CorrelationEngine] Done. ${totalInsights} insights generated.`);
}
