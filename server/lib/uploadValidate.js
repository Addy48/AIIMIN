/**
 * File upload validation (SEC-11) — magic-byte checks, size limits.
 */
import crypto from 'crypto';

const MAX_BYTES = 10 * 1024 * 1024;

const SIGNATURES = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47]],
};

const ALLOWED_MIMES = Object.keys(SIGNATURES);

function matchesSignature(buffer, sig) {
  if (buffer.length < sig.length) return false;
  return sig.every((byte, i) => buffer[i] === byte);
}

export function validateUploadBuffer(buffer, declaredMime) {
  if (!buffer || buffer.length === 0) {
    return { ok: false, error: 'Empty file' };
  }
  if (buffer.length > MAX_BYTES) {
    return { ok: false, error: 'File exceeds 10MB limit' };
  }

  const mime = declaredMime || 'application/octet-stream';
  if (!ALLOWED_MIMES.includes(mime)) {
    return { ok: false, error: 'File type not allowed. Use PDF, JPEG, or PNG.' };
  }

  const sigs = SIGNATURES[mime] || [];
  const valid = sigs.some((sig) => matchesSignature(buffer, sig));
  if (!valid) {
    return { ok: false, error: 'File content does not match declared type' };
  }

  return { ok: true, mime };
}

export function safeUploadFilename(originalName = 'file') {
  const ext = originalName.includes('.') ? originalName.split('.').pop().toLowerCase().slice(0, 8) : '';
  const allowedExt = ['pdf', 'jpg', 'jpeg', 'png'];
  const safeExt = allowedExt.includes(ext) ? ext : 'bin';
  return `${crypto.randomUUID()}.${safeExt}`;
}
