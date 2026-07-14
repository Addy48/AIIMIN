import supabase from './supabase';
import { isOAuthCallbackRoute, persistAccessToken, readAccessToken, ensureSupabaseSession, requireFreshAccessToken, isAccessTokenExpired } from './authSession';

export const API_URL = process.env.REACT_APP_API_URL || '/api';

export const buildAuthHeaders = (extraHeaders = {}) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${readAccessToken()}`,
    ...extraHeaders,
});

/**
 * Build a request URL for relative or absolute API_URL values.
 */
export const buildApiUrl = (path, params) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const base = API_URL || '/api';

    let url;
    if (/^https?:\/\//i.test(base)) {
        url = new URL(`${base.replace(/\/$/, '')}${normalizedPath}`);
    } else if (path.startsWith('http')) {
        url = new URL(path);
    } else {
        const apiBase = base.startsWith('/') ? base : `/${base}`;
        url = new URL(`${apiBase}${normalizedPath}`, window.location.origin);
    }

    if (params) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    return url;
};

/**
 * Get a valid access token — refresh from Supabase when possible.
 * On OAuth callback route only, prefer cached token to avoid deadlock.
 */
export const getCurrentAccessToken = async () => {
    if (isOAuthCallbackRoute()) {
        const cached = readAccessToken();
        if (cached && !isAccessTokenExpired(cached)) return cached;
    }

    try {
        return await requireFreshAccessToken(supabase);
    } catch (_) {
        return '';
    }
};

const resolveHeaders = async ({ headers = {}, json = true, auth = true } = {}) => {
    const baseHeaders = json ? buildAuthHeaders(headers) : { ...headers };
    if (auth) {
        const token = await getCurrentAccessToken();
        baseHeaders.Authorization = `Bearer ${token}`;
    }
    return baseHeaders;
};

export const getAuthHeaders = (extraHeaders = {}) => buildAuthHeaders(extraHeaders);

export const apiRequest = async (path, options = {}, retried = false) => {
    const {
        method = 'GET',
        data,
        params,
        headers,
        responseType = 'json',
        signal,
    } = options;

    const resolvedHeaders = await resolveHeaders({
        headers: headers || {},
        json: options.json !== false,
        auth: options.auth !== false,
    });

    const url = buildApiUrl(path, params);

    const fetchOptions = {
        method,
        headers: resolvedHeaders,
        ...(signal ? { signal } : {}),
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        fetchOptions.body = typeof data === 'string' ? data : JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);

    if (response.status === 401 && !retried && options.auth !== false) {
        try {
            const { data: { session } } = await supabase.auth.refreshSession();
            if (session?.access_token) {
                persistAccessToken(session.access_token);
                return apiRequest(path, options, true);
            }
        } catch (_) { /* retry below */ }
    }

    if (!response.ok) {
        let errMsg = `Request failed (${response.status})`;
        try {
            const errBody = await response.json();
            errMsg = errBody.error || errBody.message || errMsg;
        } catch (_) {
            try { errMsg = await response.text() || errMsg; } catch (_2) {}
        }
        const err = new Error(errMsg);
        err.status = response.status;
        throw err;
    }

    if (responseType === 'json') {
        return await response.json();
    } else if (responseType === 'text') {
        return await response.text();
    } else if (responseType === 'blob') {
        return await response.blob();
    } else if (responseType === 'arraybuffer') {
        return await response.arrayBuffer();
    }

    return response;
};

export const apiGet = (path, options = {}) => apiRequest(path, { ...options, method: 'GET' });
export const apiPost = (path, data, options = {}) => apiRequest(path, { ...options, method: 'POST', data });
export const apiPut = (path, data, options = {}) => apiRequest(path, { ...options, method: 'PUT', data });
export const apiPatch = (path, data, options = {}) => apiRequest(path, { ...options, method: 'PATCH', data });
export const apiDelete = (path, data, options = {}) => apiRequest(path, { ...options, method: 'DELETE', data });
