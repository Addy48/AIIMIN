/**
 * Shared waitlist signup persistence — all WaitlistForm instances must stay in sync.
 * Storage key stays `aiimin_waitlist` (Cookies policy).
 */
export const WAITLIST_STORAGE_KEY = 'aiimin_waitlist';
export const WAITLIST_REFERRAL_KEY = 'aiimin_waitlist_ref';
export const WAITLIST_SIGNUP_EVENT = 'aiimin:waitlist-signup';
export const WAITLIST_RESET_EVENT = 'aiimin:waitlist-reset';

export function readStoredSignup() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(WAITLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function persistSignup(data) {
  if (typeof window === 'undefined') return;
  const payload = {
    email: data.email || '',
    name: data.name || '',
    referralCode: data.referralCode || '',
    referralCount: data.referralCount ?? 0,
    reservedId: data.reservedId || '',
    confirmationEmailSent: data.confirmationEmailSent,
    signedUpAt: data.signedUpAt || new Date().toISOString(),
  };
  localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(WAITLIST_SIGNUP_EVENT, { detail: payload }));
}

export function clearStoredSignup() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(WAITLIST_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(WAITLIST_RESET_EVENT));
}

export function captureReferralFromUrl() {
  if (typeof window === 'undefined') return '';
  const ref = new URLSearchParams(window.location.search).get('ref');
  if (ref) {
    sessionStorage.setItem(WAITLIST_REFERRAL_KEY, ref.trim().toUpperCase());
    return ref.trim().toUpperCase();
  }
  return sessionStorage.getItem(WAITLIST_REFERRAL_KEY) || '';
}
