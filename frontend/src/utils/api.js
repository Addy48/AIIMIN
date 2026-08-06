export const API_URL = process.env.REACT_APP_API_URL || '/api';

export const buildAuthHeaders = (extraHeaders = {}) => ({
    'Content-Type': 'application/json',
    ...extraHeaders,
});

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
        Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    }

    return url;
};

const resolveHeaders = async ({ headers = {}, json = true } = {}) => (
    json ? buildAuthHeaders(headers) : { ...headers }
);

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
    });

    const url = buildApiUrl(path, params);

    const fetchOptions = {
        method,
        headers: resolvedHeaders,
        credentials: 'include',
        ...(signal ? { signal } : {}),
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
        fetchOptions.body = typeof data === 'string' ? data : JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);

    if (response.status === 401 && !retried && options.auth !== false) {
        const { authClient } = await import('../lib/auth-client');
        const refreshed = await authClient.getSession({ fetchOptions: { credentials: 'include' } });
        if (refreshed?.data?.session) {
            return apiRequest(path, options, true);
        }
    }

    if (!response.ok) {
        let errMsg = `Request failed (${response.status})`;
        let errCode;
        try {
            const errBody = await response.json();
            errMsg = errBody.error || errBody.message || errMsg;
            errCode = errBody.code;
        } catch (_) {
            try { errMsg = await response.text() || errMsg; } catch (_2) { /* ignore */ }
        }
        const err = new Error(errMsg);
        err.status = response.status;
        err.code = errCode;
        throw err;
    }

    if (responseType === 'json') {
        return await response.json();
    }
    if (responseType === 'text') return await response.text();
    if (responseType === 'blob') return await response.blob();
    if (responseType === 'arraybuffer') return await response.arrayBuffer();

    return response;
};

export const apiGet = (path, options = {}) => apiRequest(path, { ...options, method: 'GET' });
export const apiPost = (path, data, options = {}) => apiRequest(path, { ...options, method: 'POST', data });
export const apiPut = (path, data, options = {}) => apiRequest(path, { ...options, method: 'PUT', data });
export const apiPatch = (path, data, options = {}) => apiRequest(path, { ...options, method: 'PATCH', data });
export const apiDelete = (path, data, options = {}) => apiRequest(path, { ...options, method: 'DELETE', data });
