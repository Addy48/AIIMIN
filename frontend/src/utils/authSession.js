/**
 * Token storage for Better Auth bearer sessions (SPA ↔ API on different ports).
 */
const TOKEN_KEY = 'aiimin_bearer_token';

export const persistAccessToken = (token) => {
    if (!token) return;
    try {
        localStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(TOKEN_KEY, token);
    } catch (_) { /* ignore */ }
};

export const readAccessToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';
    } catch (_) {
        return '';
    }
};

export const clearAccessToken = () => {
    try {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
    } catch (_) { /* ignore */ }
};

export const captureAuthTokenFromResponse = (response) => {
    const token = response?.headers?.get?.('set-auth-token');
    if (token) persistAccessToken(token);
    return token;
};

export const authFetchOptions = {
    onSuccess: (ctx) => {
        captureAuthTokenFromResponse(ctx?.response);
    },
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

/** @deprecated Supabase-only — no-op under Better Auth */
export const ensureSupabaseSession = async () => readAccessToken();
/** @deprecated */
export const requireFreshAccessToken = async () => readAccessToken();
/** @deprecated */
export const isAccessTokenExpired = () => false;
/** @deprecated */
export const resolveOAuthSession = async () => null;
