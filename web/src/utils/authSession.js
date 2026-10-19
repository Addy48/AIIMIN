/**
 * Better Auth session — httpOnly cookies only (no token in localStorage).
 * Legacy bearer keys are purged on load.
 */
const LEGACY_TOKEN_KEYS = ['aiimin_bearer_token', 'access_token'];

export const purgeLegacyAuthTokens = () => {
    if (typeof window === 'undefined') return;
    try {
        for (const key of LEGACY_TOKEN_KEYS) {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        }
    } catch (_) { /* ignore */ }
};

/** @deprecated Tokens must not be stored client-side — cookies only */
export const persistAccessToken = () => {
    purgeLegacyAuthTokens();
};

/** @deprecated Always empty — session is httpOnly cookie */
export const readAccessToken = () => {
    purgeLegacyAuthTokens();
    return '';
};

export const clearAccessToken = () => {
    purgeLegacyAuthTokens();
};

/** No-op — cookies set by Better Auth response */
export const captureAuthTokenFromResponse = () => null;

/** No-op — session cookie is set by Better Auth */
export const persistSessionFromAuthResponse = async () => '';

export const authFetchOptions = {
    credentials: 'include',
};

export const isOAuthCallbackRoute = () => (
    typeof window !== 'undefined' && window.location.pathname === '/auth/callback'
);

/** API origin without /api suffix (OAuth handoff must hit API host). */
export const getApiOrigin = () => {
    const apiUrl = process.env.REACT_APP_API_URL || '/api';
    if (/^https?:\/\//i.test(apiUrl)) {
        return apiUrl.replace(/\/api\/?$/, '');
    }
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:3001';
    }
    return typeof window !== 'undefined' ? window.location.origin : '';
};

export const getOAuthHandoffUrl = () => `${getApiOrigin()}/api/auth/oauth-handoff`;

export const isCalendarIntegrationCallback = () => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return window.location.pathname === '/calendar' && params.get('integration') === 'google';
};

/** Session checks use Better Auth cookies + /auth/me — not localStorage */
export const ensureSupabaseSession = async () => '';
export const requireFreshAccessToken = async () => '';
export const isAccessTokenExpired = () => false;
export const resolveOAuthSession = async () => null;

if (typeof window !== 'undefined') {
    purgeLegacyAuthTokens();
}
