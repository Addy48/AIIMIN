/**
 * Groq API Key Rotator for AIIMIN.
 * 
 * Supports pool of multiple Groq keys rotated every 8 hours (UTC epoch aligned).
 * Automatic failover and cooldown when a key encounters 429 (rate limit) or errors.
 */

const keyCooldowns = new Map(); // key -> cooldownUntil (ms timestamp)

export function getGroqKeys() {
    const raw = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
    return raw
        .split(',')
        .map((k) => k.replace(/^["']|["']$/g, '').trim())
        .filter(Boolean);
}

export function getRotationHours() {
    const val = parseFloat(process.env.GROQ_KEY_ROTATION_HOURS || '8');
    return Number.isFinite(val) && val > 0 ? val : 8;
}

export function getActiveKeyIndex(totalKeys, rotationHours = 8, nowMs = Date.now()) {
    if (!totalKeys || totalKeys <= 0) return 0;
    const shiftSeconds = rotationHours * 3600;
    const epochSeconds = Math.floor(nowMs / 1000);
    return Math.floor(epochSeconds / shiftSeconds) % totalKeys;
}

export function maskKey(key) {
    if (!key || typeof key !== 'string') return '';
    if (key.length <= 12) return '***';
    return `${key.slice(0, 8)}...${key.slice(-4)}`;
}

export function isKeyInCooldown(key, nowMs = Date.now()) {
    const cooldownUntil = keyCooldowns.get(key);
    if (!cooldownUntil) return false;
    if (nowMs >= cooldownUntil) {
        keyCooldowns.delete(key);
        return false;
    }
    return true;
}

export function recordKeyFailure(key, statusCode = 429, nowMs = Date.now()) {
    if (!key) return;
    // 429 rate limits get 15 min cooldown; 5xx or network get 2 min
    const cooldownMs = statusCode === 429 ? 15 * 60 * 1000 : 2 * 60 * 1000;
    keyCooldowns.set(key, nowMs + cooldownMs);
    console.warn(`[groqRotator] Key ${maskKey(key)} placed on cooldown for ${cooldownMs / 1000}s (HTTP ${statusCode})`);
}

export function recordKeySuccess(key) {
    if (key && keyCooldowns.has(key)) {
        keyCooldowns.delete(key);
    }
}

/**
 * Returns candidate keys in priority order:
 * 1. Current scheduled key for this 8-hour shift (if not in cooldown)
 * 2. Other non-cooldown keys in cyclic order
 * 3. Any cooldown keys as desperate last resort
 */
export function getOrderedGroqKeys(nowMs = Date.now()) {
    const keys = getGroqKeys();
    if (keys.length === 0) return [];
    if (keys.length === 1) return keys;

    const rotationHours = getRotationHours();
    const primaryIndex = getActiveKeyIndex(keys.length, rotationHours, nowMs);

    // Order cyclically starting from primary
    const cyclic = [];
    for (let i = 0; i < keys.length; i++) {
        cyclic.push(keys[(primaryIndex + i) % keys.length]);
    }

    const available = cyclic.filter((k) => !isKeyInCooldown(k, nowMs));
    const inCooldown = cyclic.filter((k) => isKeyInCooldown(k, nowMs));

    return available.length > 0 ? [...available, ...inCooldown] : inCooldown;
}

export function getGroqRotatorStatus(nowMs = Date.now()) {
    const keys = getGroqKeys();
    const rotationHours = getRotationHours();
    const primaryIndex = getActiveKeyIndex(keys.length, rotationHours, nowMs);
    const shiftSeconds = rotationHours * 3600;
    const epochSeconds = Math.floor(nowMs / 1000);
    const nextRotationInSeconds = shiftSeconds - (epochSeconds % shiftSeconds);

    return {
        totalKeys: keys.length,
        rotationHours,
        currentIndex: primaryIndex,
        activeKeyMasked: maskKey(keys[primaryIndex]),
        nextRotationInSeconds,
        keys: keys.map((k, idx) => ({
            index: idx,
            masked: maskKey(k),
            isCurrentShift: idx === primaryIndex,
            inCooldown: isKeyInCooldown(k, nowMs),
        })),
    };
}
