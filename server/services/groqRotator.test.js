import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getActiveKeyIndex,
    maskKey,
    isKeyInCooldown,
    recordKeyFailure,
    recordKeySuccess,
    getOrderedGroqKeys,
} from '../lib/groqRotator.js';

test('getActiveKeyIndex cycles deterministically by 8-hour shift', () => {
    const shiftSeconds = 8 * 3600;
    const baseEpoch = 1700000000; // arbitrary timestamp
    const baseMs = baseEpoch * 1000;

    const idx0 = getActiveKeyIndex(3, 8, baseMs);
    const idx1 = getActiveKeyIndex(3, 8, baseMs + shiftSeconds * 1000);
    const idx2 = getActiveKeyIndex(3, 8, baseMs + shiftSeconds * 2 * 1000);
    const idx3 = getActiveKeyIndex(3, 8, baseMs + shiftSeconds * 3 * 1000);

    assert.equal(idx1, (idx0 + 1) % 3);
    assert.equal(idx2, (idx0 + 2) % 3);
    assert.equal(idx3, idx0);
});

test('maskKey obfuscates secret while showing prefix and suffix', () => {
    assert.equal(maskKey('mockkey_1234567890abcdef1234567890abcdef1234'), 'mockkey_...1234');
    assert.equal(maskKey('short'), '***');
    assert.equal(maskKey(''), '');
});

test('recordKeyFailure places key in cooldown, recordKeySuccess clears it', () => {
    const testKey = 'mockkey_test_key_cooldown_verification_123456';
    const now = 1700000000000;

    assert.equal(isKeyInCooldown(testKey, now), false);

    recordKeyFailure(testKey, 429, now);
    assert.equal(isKeyInCooldown(testKey, now + 1000), true);
    // 15 min cooldown for 429
    assert.equal(isKeyInCooldown(testKey, now + 16 * 60 * 1000), false);

    // Test explicit clear via recordKeySuccess
    recordKeyFailure(testKey, 429, now);
    assert.equal(isKeyInCooldown(testKey, now + 1000), true);
    recordKeySuccess(testKey);
    assert.equal(isKeyInCooldown(testKey, now + 1000), false);
});
