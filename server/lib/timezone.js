/**
 * lib/timezone.js
 *
 * Timezone helpers for AIIMIN — all streak/schedule logic must
 * use these functions instead of raw UTC Date operations.
 *
 * User timezone: Asia/Kolkata (IST, UTC+5:30)
 */
import { DateTime } from 'luxon';

export const USER_TZ = 'Asia/Kolkata';

/**
 * getUserLocalDate(timezone?)
 * Returns 'YYYY-MM-DD' for the current date in the user's timezone.
 * Use this for daily streak calculations and routine completion checks.
 */
export function getUserLocalDate(timezone = USER_TZ) {
    return DateTime.now().setZone(timezone).toISODate();
}

/**
 * toLocalDate(utcTimestamp, timezone?)
 * Converts any UTC timestamp to a local date string 'YYYY-MM-DD'.
 * Use this when reading timestamps from the DB before date comparison.
 */
export function toLocalDate(utcTimestamp, timezone = USER_TZ) {
    return DateTime.fromJSDate(new Date(utcTimestamp)).setZone(timezone).toISODate();
}

/**
 * startOfLocalDay(timezone?)
 * Returns a JS Date representing midnight in the user's timezone (UTC equivalent).
 * Use as the lower bound for DB range queries (>= startOfLocalDay()).
 */
export function startOfLocalDay(timezone = USER_TZ) {
    return DateTime.now().setZone(timezone).startOf('day').toUTC().toJSDate();
}

/**
 * startOfLocalMonth(timezone?)
 * Returns a JS Date representing the start of the current month in user timezone.
 * Use for monthly financial aggregations and month boundary calculations.
 */
export function startOfLocalMonth(timezone = USER_TZ) {
    return DateTime.now().setZone(timezone).startOf('month').toUTC().toJSDate();
}

/**
 * getLocalHour(timezone?)
 * Returns the current hour (0-23) in the user's timezone.
 * Use this for reminder trigger logic (e.g. if hour >= 9 → morning banner).
 */
export function getLocalHour(timezone = USER_TZ) {
    return DateTime.now().setZone(timezone).hour;
}

/**
 * isSameLocalDay(timestampA, timestampB, timezone?)
 * Returns true if both timestamps fall on the same calendar day in user timezone.
 * Use for streak continuity checks.
 */
export function isSameLocalDay(timestampA, timestampB, timezone = USER_TZ) {
    const a = DateTime.fromJSDate(new Date(timestampA)).setZone(timezone).toISODate();
    const b = DateTime.fromJSDate(new Date(timestampB)).setZone(timezone).toISODate();
    return a === b;
}
