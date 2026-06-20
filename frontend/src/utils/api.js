import supabase from './supabase';

export const API_URL = process.env.REACT_APP_API_URL || '/api';

export const buildAuthHeaders = (extraHeaders = {}) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${typeof localStorage !== 'undefined' ? localStorage.getItem('aiimin_session_fallback') || '' : ''}`,
    ...extraHeaders,
});

/**
 * Get auth token — prefers Clerk JWT if available, falls back to
 * Supabase session for legacy compatibility during migration.
 */
export const getCurrentAccessToken = async () => {
    // If Clerk is initialised, use its JWT
    if (typeof window !== 'undefined' && typeof window.__clerk_getToken === 'function') {
        try {
            const clerkToken = await window.__clerk_getToken();
            if (clerkToken) return clerkToken;
        } catch (_) {
            // fall through to Supabase
        }
    }
    // Legacy Supabase fallback
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) return session.access_token;
    } catch (_) {}
    return (typeof localStorage !== 'undefined' ? localStorage.getItem('aiimin_session_fallback') : '') || '';
};



const resolveHeaders = async ({ headers = {}, json = true } = {}) => {
    const token = await getCurrentAccessToken();
    const baseHeaders = json ? buildAuthHeaders(headers) : {
        ...headers,
    };
    baseHeaders.Authorization = `Bearer ${token}`;
    return baseHeaders;
};

export const getAuthHeaders = (extraHeaders = {}) => buildAuthHeaders(extraHeaders);

export const apiRequest = async (path, options = {}) => {
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
    });

    const url = new URL(path.startsWith('http') ? path : `${window.location.origin}${API_URL}${path}`);
    if (params) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const fetchOptions = {
        method,
        headers: resolvedHeaders,
        ...(signal ? { signal } : {}),
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        fetchOptions.body = typeof data === 'string' ? data : JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);


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
