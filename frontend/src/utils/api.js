import axios from 'axios';
import supabase from './supabase';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

export const buildAuthHeaders = (session, extraHeaders = {}) => ({
    'Content-Type': 'application/json',
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    ...extraHeaders,
});

export const getCurrentSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session ?? null;
};

const resolveHeaders = async ({ auth = true, session = null, headers = {}, json = true } = {}) => {
    const authSession = auth ? (session ?? await getCurrentSession()) : session;
    const baseHeaders = json ? buildAuthHeaders(authSession, headers) : {
        ...(authSession?.access_token ? { Authorization: `Bearer ${authSession.access_token}` } : {}),
        ...headers,
    };
    return baseHeaders;
};

api.interceptors.request.use(async (config) => {
    const headers = await resolveHeaders({
        auth: config.auth !== false,
        session: config.session ?? null,
        headers: config.headers || {},
        json: config.json !== false,
    });

    config.headers = headers;
    return config;
});

export default api;

export const getAuthHeaders = (session, extraHeaders = {}) => buildAuthHeaders(session, extraHeaders);

export const apiRequest = async (path, options = {}) => {
    const {
        method = 'GET',
        data,
        params,
        headers,
        auth = true,
        session = null,
        responseType = 'json',
    } = options;

    const response = await api.request({
        url: path,
        method,
        data,
        params,
        headers,
        auth,
        session,
        responseType,
    });

    return response.data;
};

export const apiGet = (path, options = {}) => apiRequest(path, { ...options, method: 'GET' });
export const apiPost = (path, data, options = {}) => apiRequest(path, { ...options, method: 'POST', data });
export const apiPatch = (path, data, options = {}) => apiRequest(path, { ...options, method: 'PATCH', data });
export const apiDelete = (path, data, options = {}) => apiRequest(path, { ...options, method: 'DELETE', data });
