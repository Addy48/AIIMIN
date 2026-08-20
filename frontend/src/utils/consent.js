export const CONSENT_STORAGE_KEY = 'aiimin_consent_v1';

/** Returns the stored consent record, or null when the visitor has not chosen yet. */
export function readConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

/** True only when the visitor explicitly agreed to product analytics. */
export function hasAnalyticsConsent() {
  return readConsent()?.analytics === true;
}
