/**
 * lib/crypto.js
 *
 * AES-256-GCM symmetric encryption for OAuth token storage.
 * Key is loaded from TOKEN_ENCRYPTION_KEY env var (64 hex chars = 32 bytes).
 * Stored format: "<iv_hex>:<authTag_hex>:<ciphertext_hex>"
 */
import crypto from 'crypto';

const ALGO = 'aes-256-gcm';

const getKey = () => {
    const keyHex = process.env.TOKEN_ENCRYPTION_KEY;
    if (!keyHex || keyHex.length !== 64) {
        throw new Error('TOKEN_ENCRYPTION_KEY must be a 64-character hex string (32 bytes). Generate: openssl rand -hex 32');
    }
    return Buffer.from(keyHex, 'hex');
};

/**
 * Encrypt a plaintext string.
 * @param {string} plaintext
 * @returns {string} "<iv>:<authTag>:<ciphertext>" all hex-encoded
 */
export const encrypt = (plaintext) => {
    if (!plaintext) return null;
    const key = getKey();
    const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
};

/**
 * Decrypt a value encrypted with encrypt().
 * @param {string} encryptedStr
 * @returns {string} plaintext
 */
export const decrypt = (encryptedStr) => {
    if (!encryptedStr) return null;
    const key = getKey();
    const [ivHex, authTagHex, ciphertextHex] = encryptedStr.split(':');
    if (!ivHex || !authTagHex || !ciphertextHex) {
        throw new Error('Invalid encrypted token format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const ciphertext = Buffer.from(ciphertextHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
};
