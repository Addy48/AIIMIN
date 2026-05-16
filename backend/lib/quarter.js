/**
 * lib/quarter.js
 * 
 * Quarter anchor math for the belief inventory system.
 * Computes quarter boundaries, days-until-next, progress percentage
 * from a user's quarterly_review_anchor date.
 */

const QUARTER_DAYS = 90;

/**
 * Compute the current quarter boundaries for a user.
 * @param {string|Date} anchor - The user's quarterly_review_anchor (e.g. '2026-01-01')
 * @param {Date} [now] - Current date (defaults to NOW, injectable for testing)
 * @returns {{ quarterStart: Date, quarterEnd: Date, daysUntil: number, progressPct: number, quarterLabel: string }}
 */
export function getQuarterInfo(anchor, now = new Date()) {
    // Parse anchor as UTC midnight
    const [ay, am, ad] = String(anchor).split('T')[0].split('-').map(Number);
    const anchorUtc = Date.UTC(ay, am - 1, ad);

    const today = new Date(now);
    const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

    const diffMs = todayUtc - anchorUtc;
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    // Which quarter cycle are we in?
    const quarterIndex = Math.floor(diffDays / QUARTER_DAYS);

    const quarterStartMs = anchorUtc + (quarterIndex * QUARTER_DAYS * 24 * 60 * 60 * 1000);
    const quarterEndMs = quarterStartMs + (QUARTER_DAYS * 24 * 60 * 60 * 1000);

    const quarterStart = new Date(quarterStartMs);
    const quarterEnd = new Date(quarterEndMs);

    const daysIntoQuarter = Math.floor((todayUtc - quarterStartMs) / (24 * 60 * 60 * 1000));
    const daysUntil = QUARTER_DAYS - daysIntoQuarter;
    const progressPct = Math.round((daysIntoQuarter / QUARTER_DAYS) * 100);

    // Label like "Q1 2026"
    const qNum = (quarterIndex % 4) + 1;
    const year = quarterStart.getUTCFullYear();
    const quarterLabel = `Q${qNum} ${year}`;

    return {
        quarterStart,
        quarterEnd,
        daysUntil,
        progressPct: Math.min(progressPct, 100),
        quarterLabel,
        quarterAnchorDate: quarterStart, // the start IS the anchor for this quarter
    };
}

/**
 * Get quarter anchor date (the start of current quarter) for use in DB queries
 */
export function getCurrentQuarterAnchor(anchor, now = new Date()) {
    const info = getQuarterInfo(anchor, now);
    return info.quarterStart.toISOString().slice(0, 10);
}

export default { getQuarterInfo, getCurrentQuarterAnchor };
