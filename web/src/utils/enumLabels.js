/**
 * User-facing labels for DB enum / snake_case values.
 * Never show raw enums in the UI.
 */

export const DOC_TYPE_LABELS = {
  passport: 'Passport',
  aadhaar: 'Aadhaar',
  pan: 'PAN Card',
  driving_license: 'Driving Licence',
  voter_id: 'Voter ID',
  birth_certificate: 'Birth Certificate',
  other: 'Other',
};

export const DISCIPLINE_TARGET_LABELS = {
  phone_scroll: 'Phone scrolling',
  social_media: 'Social media',
  porn: 'Pornography',
  junk_food: 'Junk food',
  gaming: 'Gaming',
  nicotine: 'Nicotine',
  alcohol: 'Alcohol',
  other: 'Other',
};

export const NOTE_SOURCE_LABELS = {
  text: 'Text',
  voice: 'Voice',
  pdf: 'PDF',
  link: 'Link',
  admin_simulated: null, // never show
};

/** Map enum → label; falls back to title-cased string without underscores */
export function labelEnum(value, map = {}) {
  if (value == null || value === '') return '—';
  const key = String(value);
  if (Object.prototype.hasOwnProperty.call(map, key)) {
    const mapped = map[key];
    if (mapped == null) return null;
    return mapped;
  }
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Clamp skill / readiness scores for display.
 * Rejects Unix timestamps and other garbage (> 100 → N/A unless maxScale > 100).
 */
export function sanitizeScore(raw, { max = 100, scaleFrom = null } = {}) {
  let n = Number(raw);
  if (!Number.isFinite(n)) return { value: null, display: 'N/A', pct: 0 };
  if (scaleFrom && scaleFrom > 0 && n <= scaleFrom) {
    n = Math.round((n / scaleFrom) * max);
  }
  if (n > max || n < 0) {
    // Likely timestamp or wrong unit
    if (n > 1000) return { value: null, display: 'N/A', pct: 0 };
    n = Math.min(max, Math.max(0, n));
  }
  const rounded = Math.round(n);
  return {
    value: rounded,
    display: String(rounded),
    pct: Math.min(100, Math.max(0, (rounded / max) * 100)),
    warning: rounded < 20,
  };
}
