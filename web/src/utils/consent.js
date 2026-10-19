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

/**
 * Optional tracking exists only when GA4 or Sentry is built in; without either
 * there is nothing to consent to, so no banner is shown.
 */
export function analyticsConfigured() {
  return Boolean(process.env.REACT_APP_GA_MEASUREMENT_ID || process.env.REACT_APP_SENTRY_DSN);
}

/**
 * Ask only when there is something optional to ask about, and only once per
 * policy version: a stored choice under the current version is final.
 */
export function needsConsentPrompt(record, { configured, version }) {
  if (!configured) return false;
  if (!record) return true;
  return record.version !== version;
}

export function writeConsent(analytics, version) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
      analytics,
      version,
      at: new Date().toISOString(),
    }));
  } catch {
    /* storage unavailable */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aiimin:consent-updated', { detail: { analytics } }));
  }
}

/** Forget the choice so the visitor can make it again (withdrawal must be as easy as giving). */
export function clearConsent() {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aiimin:consent-reopen'));
  }
}
