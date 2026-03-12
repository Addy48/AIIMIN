/**
 * computeMetrics.js
 * 
 * Strict numeric analytical evaluations for dashboard KPIs.
 * Handles missing data cleanly by falling back to `0`, ensuring charts and metric rings
 * never receive `NaN`, `undefined`, or `Infinity`.
 */

// Helper to reliably sum a property
const sum = (arr, fn) => arr.reduce((acc, obj) => acc + (fn(obj) || 0), 0);
const avg = (arr, fn) => arr.length ? sum(arr, fn) / arr.length : 0;

/**
 * Calculates Life Health Score (0-100) based on physical, cognitive, emotional, and financial outputs.
 */
export function computeLifeHealthScore(logs = [], txs = []) {
    if (!logs || !logs.length) return 0;

    const physical = computeMovementScore(logs);
    const cognitive = computeCognitiveScore(logs);
    const discipline = computeDisciplineScore(logs);
    const emotional = computeMoodScore(logs);
    const financial = computeFinancialHealth(txs);

    const weights = { p: 0.25, c: 0.25, d: 0.20, e: 0.20, f: 0.10 };
    const score = (physical * weights.p) + (cognitive * weights.c) + (discipline * weights.d) + (emotional * weights.e * 20 /* convert mood 0-5 to 0-100 */) + (financial * weights.f);

    return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Sleep Consistency: Measures standard deviation and target 7h hits.
 */
export function computeSleepConsistency(logs = []) {
    if (!logs || !logs.length) return 0;

    const sleepHits = logs.filter(l => l.sleep_hours >= 7).length;
    const consistency = (sleepHits / logs.length) * 100;

    return Math.min(100, Math.max(0, Math.round(consistency)));
}

/**
 * Focus Score: Based on 120min+ Pomodoro sessions.
 */
export function computeFocusScore(logs = []) {
    if (!logs || !logs.length) return 0;

    const avgFocus = avg(logs, l => l.pomodoro_minutes);
    // Assume 120 mins a day is a 100 benchmark
    const score = (avgFocus / 120) * 100;

    return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Mood Score: Averages daily mood rating (0-5)
 */
export function computeMoodScore(logs = []) {
    if (!logs || !logs.length) return 0;

    const score = avg(logs, l => l.mood);
    return Number(score.toFixed(1)); // Return 0.0 - 5.0
}

/**
 * Movement Score: Evaluates adherence to gym and 8k+ steps target
 */
export function computeMovementScore(logs = []) {
    if (!logs || !logs.length) return 0;

    const gymDays = logs.filter(l => l.gym_done).length;
    const stepDays = logs.filter(l => l.steps >= 8000).length;

    // 5 gym days a week = 100% capacity for gym metric weight
    const gymCapacity = Math.min(1.0, (gymDays / logs.length) / (5 / 7));
    const stepCapacity = Math.min(1.0, stepDays / logs.length);

    const score = ((gymCapacity * 0.6) + (stepCapacity * 0.4)) * 100;
    return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Financial Health: Derived from income vs expense stability. Minimum 0 points out of 100.
 */
export function computeFinancialHealth(txs = []) {
    if (!txs || !txs.length) return 50; // Fallback median

    const income = sum(txs.filter(t => t.type === 'income'), t => t.amount);
    const expenses = sum(txs.filter(t => t.type === 'expense'), t => t.amount);

    if (income === 0 && expenses === 0) return 50;

    // Save Rate metric
    const savingsRate = income > 0 ? (income - expenses) / income : -1;

    // Convert to 0-100 logic: 0.20+ savings rate = 100 score
    const score = Math.max(0, Math.min(100, (savingsRate + 0.1) * 250));

    return Math.round(score);
}

export function computeDisciplineScore(logs = []) {
    if (!logs || !logs.length) return 0;

    const habitHits = logs.reduce((acc, l) => {
        let dailyScore = 0;
        if (l.gym_done) dailyScore++;
        if (l.learning_done) dailyScore++;
        if (l.breakfast_done) dailyScore++;
        if (l.journal_entry && l.journal_entry.length > 5) dailyScore++;
        return acc + (dailyScore / 4); // 4 core discipline habits
    }, 0);

    const habitScore = (habitHits / logs.length) * 100;
    const focusScore = computeFocusScore(logs);

    // 80% habit consistency + 20% focus score
    const score = (habitScore * 0.8) + (focusScore * 0.2);
    return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Cognitive Score: Deep learning, reading and complex puzzle execution density.
 */
export function computeCognitiveScore(logs = []) {
    if (!logs || !logs.length) return 0;

    const brainFogInverse = avg(logs, l => (5 - (l.brain_fog || 0))) * 20; // Lower brain fog is better
    const learningRatio = (logs.filter(l => l.learning_done).length / logs.length) * 100;

    const score = (brainFogInverse * 0.4) + (learningRatio * 0.6);
    return Math.max(0, Math.min(100, Math.round(score)));
}
