import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SIGNAL_NAMES } from './correlationService.js';

describe('correlationService', () => {
    it('exports signal names for UI', () => {
        assert.ok(SIGNAL_NAMES.includes('mood'));
        assert.ok(SIGNAL_NAMES.includes('sleep_hours'));
        assert.ok(SIGNAL_NAMES.includes('focus_minutes'));
    });
});
