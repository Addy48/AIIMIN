/**
 * Tests for lib/quarter.js
 * Run: node --test backend/tests/lib/quarter.test.js
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getQuarterInfo, getCurrentQuarterAnchor } from '../../lib/quarter.js';

describe('getQuarterInfo()', () => {
    it('should return Q1 when now is within first 90 days of anchor', () => {
        const info = getQuarterInfo('2026-01-01', new Date('2026-02-15'));
        assert.equal(info.quarterLabel, 'Q1 2026');
        assert.ok(info.daysUntil > 0);
        assert.ok(info.progressPct > 0 && info.progressPct < 100);
    });

    it('should return Q2 for days 91-180', () => {
        const info = getQuarterInfo('2026-01-01', new Date('2026-05-01')); // day 120
        assert.equal(info.quarterLabel, 'Q2 2026');
    });

    it('should return Q3 for days 181-270', () => {
        const info = getQuarterInfo('2026-01-01', new Date('2026-08-01')); // day ~210
        assert.equal(info.quarterLabel, 'Q3 2026');
    });

    it('should return Q4 for days 271-360', () => {
        const info = getQuarterInfo('2026-01-01', new Date('2026-11-01')); // day ~300
        assert.equal(info.quarterLabel, 'Q4 2026');
    });

    it('should compute daysUntil correctly on anchor date itself', () => {
        const info = getQuarterInfo('2026-01-01', new Date('2026-01-01'));
        assert.equal(info.daysUntil, 90);
        assert.equal(info.progressPct, 0);
    });

    it('should handle custom non-calendar-quarter anchor', () => {
        const info = getQuarterInfo('2026-03-15', new Date('2026-03-15'));
        assert.equal(info.daysUntil, 90);
        assert.equal(info.progressPct, 0);
    });

    it('should handle leap year edge case (2028)', () => {
        const info = getQuarterInfo('2028-01-01', new Date('2028-03-01'));
        assert.ok(info.daysUntil > 0, `daysUntil should be positive: ${info.daysUntil}`);
        assert.equal(info.quarterLabel, 'Q1 2028');
    });

    it('should clamp progressPct at 100', () => {
        const info = getQuarterInfo('2026-01-01', new Date('2026-03-31T23:59:59Z'));
        assert.ok(info.progressPct <= 100);
    });
});

describe('getCurrentQuarterAnchor()', () => {
    it('should return anchor date for day within first quarter', () => {
        const anchor = getCurrentQuarterAnchor('2026-01-01', new Date('2026-02-15T12:00:00Z'));
        assert.equal(anchor, '2026-01-01');
    });

    it('should return Q2 start for day 100', () => {
        const anchor = getCurrentQuarterAnchor('2026-01-01', new Date('2026-04-11T12:00:00Z')); // day 100
        assert.equal(anchor, '2026-04-01');
    });
});
