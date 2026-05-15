/**
 * lib/spearman.js
 * 
 * Pure JS Spearman rank correlation with:
 * - Rank computation (with tie handling via mean rank)
 * - Pearson on ranks
 * - Bootstrap 95% CI
 * - Benjamini-Hochberg FDR correction
 */

/**
 * Compute ranks of an array (handles ties with mean rank).
 */
export function rank(arr) {
    const indexed = arr.map((v, i) => ({ v, i }));
    indexed.sort((a, b) => a.v - b.v);

    const ranks = new Array(arr.length);
    let i = 0;

    while (i < indexed.length) {
        let j = i;
        // Find extent of tie group
        while (j < indexed.length && indexed[j].v === indexed[i].v) j++;
        // Mean rank for tied values (1-indexed)
        const meanRank = (i + 1 + j) / 2;
        for (let k = i; k < j; k++) {
            ranks[indexed[k].i] = meanRank;
        }
        i = j;
    }

    return ranks;
}

/**
 * Pearson correlation coefficient
 */
export function pearson(x, y) {
    const n = x.length;
    if (n < 3) return { rho: 0, pValue: 1 };

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumX2 += x[i] * x[i];
        sumY2 += y[i] * y[i];
    }

    const denom = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    if (denom === 0) return { rho: 0, pValue: 1 };

    const rho = (n * sumXY - sumX * sumY) / denom;

    // Approximate p-value using t-distribution with n-2 df
    const t = rho * Math.sqrt((n - 2) / (1 - rho * rho + 1e-10));
    // Use a rough beta incomplete function approximation for p-value
    const df = n - 2;
    const pValue = tDistPValue(Math.abs(t), df) * 2; // two-tailed

    return { rho: Math.max(-1, Math.min(1, rho)), pValue: Math.min(1, pValue) };
}

/**
 * Rough p-value from t-distribution (good enough for our N=14-30 range)
 */
function tDistPValue(t, df) {
    // Approximation from Abramowitz & Stegun
    const x = df / (df + t * t);
    if (df <= 0 || t <= 0) return 0.5;
    // Beta regularized approximation
    return 0.5 * Math.pow(x, df / 2);
}

/**
 * Spearman rank correlation.
 * @param {number[]} x
 * @param {number[]} y
 * @returns {{ rho: number, pValue: number }}
 */
export function spearman(x, y) {
    if (x.length !== y.length) throw new Error('Arrays must be same length');
    if (x.length < 3) return { rho: 0, pValue: 1, n: x.length };

    const rx = rank(x);
    const ry = rank(y);
    const result = pearson(rx, ry);

    return {
        rho: Number(result.rho.toFixed(3)),
        pValue: Number(result.pValue.toFixed(6)),
        n: x.length,
    };
}

/**
 * Bootstrap 95% confidence interval for Spearman rho.
 * @param {number[]} x
 * @param {number[]} y
 * @param {number} nResamples - number of bootstrap iterations (default 1000)
 * @returns {{ lower: number, upper: number }}
 */
export function bootstrapCI(x, y, nResamples = 1000) {
    const n = x.length;
    const rhos = [];

    for (let b = 0; b < nResamples; b++) {
        const indices = Array.from({ length: n }, () => Math.floor(Math.random() * n));
        const bx = indices.map(i => x[i]);
        const by = indices.map(i => y[i]);
        const { rho } = spearman(bx, by);
        rhos.push(rho);
    }

    rhos.sort((a, b) => a - b);
    const lower = rhos[Math.floor(0.025 * nResamples)];
    const upper = rhos[Math.floor(0.975 * nResamples)];

    return { lower: Number(lower.toFixed(3)), upper: Number(upper.toFixed(3)) };
}

/**
 * Benjamini-Hochberg FDR correction.
 * @param {{ pValue: number }[]} results - array of correlation results with pValue
 * @param {number} alpha - FDR threshold (default 0.10)
 * @returns {boolean[]} - whether each result passes the BH threshold
 */
export function benjaminiHochberg(results, alpha = 0.10) {
    const m = results.length;
    if (m === 0) return [];

    // Sort by p-value, keep original indices
    const sorted = results
        .map((r, i) => ({ pValue: r.pValue, idx: i }))
        .sort((a, b) => a.pValue - b.pValue);

    const passes = new Array(m).fill(false);

    // Find the largest k where p(k) <= (k/m) * alpha
    let lastPass = -1;
    for (let k = 0; k < m; k++) {
        const bhThreshold = ((k + 1) / m) * alpha;
        if (sorted[k].pValue <= bhThreshold) {
            lastPass = k;
        }
    }

    // All results up to lastPass pass the threshold
    for (let k = 0; k <= lastPass; k++) {
        passes[sorted[k].idx] = true;
    }

    return passes;
}

export default { rank, pearson, spearman, bootstrapCI, benjaminiHochberg };
