/**
 * Sleep analytics helper functions — time conversion, circular statistics.
 */

export const fmt = n => Number(n).toFixed(1);

export const timeToMinutes = (t) => {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
};

export const minutesToTime = (mins) => {
    const h = Math.floor(((mins % 1440) + 1440) % 1440 / 60);
    const m = Math.round(((mins % 1440) + 1440) % 1440 % 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

/** Circular mean for times (handles midnight wraparound) */
export const circularMeanMinutes = (minutes) => {
    if (!minutes.length) return 0;
    const radians = minutes.map(m => (m / 1440) * 2 * Math.PI);
    const sinSum = radians.reduce((a, r) => a + Math.sin(r), 0) / radians.length;
    const cosSum = radians.reduce((a, r) => a + Math.cos(r), 0) / radians.length;
    let mean = Math.atan2(sinSum, cosSum) / (2 * Math.PI) * 1440;
    if (mean < 0) mean += 1440;
    return Math.round(mean);
};

/** Circular deviation (in minutes) from a mean */
export const circularDeviation = (minutes, mean) => {
    if (!minutes.length) return 0;
    const diffs = minutes.map(m => {
        let d = Math.abs(m - mean);
        if (d > 720) d = 1440 - d;
        return d * d;
    });
    return Math.sqrt(diffs.reduce((a, b) => a + b, 0) / diffs.length);
};
