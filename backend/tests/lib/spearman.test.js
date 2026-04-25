/**
 * Tests for lib/spearman.js
 * Run: node --test backend/tests/lib/spearman.test.js
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { rank, pearson, spearman, bootstrapCI, benjaminiHochberg } from '../../lib/spearman.js';

describe('rank()', () => {
    it('should rank distinct values', () => {
        const r = rank([3, 1, 2]);
        assert.deepEqual(r, [3, 1, 2]);
    });

    it('should handle ties with mean rank', () => {
        const r = rank([10, 20, 20, 30]);
        assert.deepEqual(r, [1, 2.5, 2.5, 4]);
    });

    it('should handle all-equal values', () => {
        const r = rank([5, 5, 5]);
        assert.deepEqual(r, [2, 2, 2]);
    });
});

describe('pearson()', () => {
    it('should return ρ ≈ 1 for perfect positive correlation', () => {
        const result = pearson([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
        assert.ok(Math.abs(result.rho - 1) < 0.001, `Expected ρ ≈ 1, got ${result.rho}`);
    });

    it('should return ρ ≈ -1 for perfect negative correlation', () => {
        const result = pearson([1, 2, 3, 4, 5], [10, 8, 6, 4, 2]);
        assert.ok(Math.abs(result.rho + 1) < 0.001, `Expected ρ ≈ -1, got ${result.rho}`);
    });

    it('should return ρ = 0 for n < 3', () => {
        const result = pearson([1, 2], [3, 4]);
        assert.equal(result.rho, 0);
    });
});

describe('spearman()', () => {
    it('should return ρ ≈ 1 for monotonically increasing data', () => {
        const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const y = [2, 5, 7, 10, 13, 15, 18, 20, 23, 25];
        const result = spearman(x, y);
        assert.ok(result.rho > 0.95, `Expected ρ > 0.95, got ${result.rho}`);
        assert.ok(result.pValue < 0.01, `Expected p < 0.01, got ${result.pValue}`);
    });

    it('should handle non-linear monotonic data', () => {
        const x = [1, 2, 3, 4, 5];
        const y = [1, 4, 9, 16, 25]; // x^2
        const result = spearman(x, y);
        assert.ok(result.rho > 0.95, `Expected ρ > 0.95 for x², got ${result.rho}`);
    });

    it('should return ρ ≈ 0 for all-tied output', () => {
        const x = [1, 2, 3, 4, 5];
        const y = [5, 5, 5, 5, 5];
        const result = spearman(x, y);
        assert.equal(result.rho, 0, `Expected ρ = 0 for all-tied, got ${result.rho}`);
    });

    it('should throw for arrays of different length', () => {
        assert.throws(() => spearman([1, 2], [1, 2, 3]), /same length/);
    });

    it('should return n in result', () => {
        const result = spearman([1, 2, 3, 4, 5], [5, 4, 3, 2, 1]);
        assert.equal(result.n, 5);
    });
});

describe('bootstrapCI()', () => {
    it('should return valid CI bounds for correlated data', () => {
        const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const y = [2, 4, 5, 8, 10, 11, 14, 16, 18, 19, 22, 24];
        const ci = bootstrapCI(x, y, 500);
        assert.ok(ci.lower <= ci.upper, `CI bounds should be ordered: [${ci.lower}, ${ci.upper}]`);
        assert.ok(ci.lower >= -1 && ci.upper <= 1, 'CI bounds should be in [-1, 1]');
    });
});

describe('benjaminiHochberg()', () => {
    it('should reject all when all p-values are large', () => {
        const results = [
            { pValue: 0.5 },
            { pValue: 0.6 },
            { pValue: 0.9 },
        ];
        const passes = benjaminiHochberg(results, 0.10);
        assert.deepEqual(passes, [false, false, false]);
    });

    it('should accept significant results', () => {
        const results = [
            { pValue: 0.001 },
            { pValue: 0.01 },
            { pValue: 0.5 },
        ];
        const passes = benjaminiHochberg(results, 0.10);
        assert.ok(passes[0], 'First result (p=0.001) should pass');
        assert.ok(passes[1], 'Second result (p=0.01) should pass');
        assert.ok(!passes[2], 'Third result (p=0.5) should not pass');
    });

    it('should handle empty array', () => {
        assert.deepEqual(benjaminiHochberg([], 0.10), []);
    });
});
