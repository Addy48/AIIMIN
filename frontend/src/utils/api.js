import axios from 'axios';
import supabase from './supabase';

export const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export const buildAuthHeaders = (extraHeaders = {}) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${typeof localStorage !== 'undefined' ? localStorage.getItem('aiimin_session_fallback') || '' : ''}`,
    ...extraHeaders,
});

export const getCurrentAccessToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || (typeof localStorage !== 'undefined' ? localStorage.getItem('aiimin_session_fallback') : '') || '';
};

const resolveHeaders = async ({ headers = {}, json = true } = {}) => {
    const token = await getCurrentAccessToken();
    const baseHeaders = json ? buildAuthHeaders(headers) : {
        ...headers,
    };
    baseHeaders.Authorization = `Bearer ${token}`;
    return baseHeaders;
};

api.interceptors.request.use(async (config) => {
    const headers = await resolveHeaders({
        headers: config.headers || {},
        json: config.json !== false,
    });

    config.headers = headers;
    return config;
});

export default api;

export const getAuthHeaders = (extraHeaders = {}) => buildAuthHeaders(extraHeaders);

export const apiRequest = async (path, options = {}) => {
    const {
        method = 'GET',
        data,
        params,
        headers,
        responseType = 'json',
    } = options;

    const response = await api.request({
        url: path,
        method,
        data,
        params,
        headers,
        responseType,
        json: options.json,
    });

    return response.data;
};

export const apiGet = (path, options = {}) => apiRequest(path, { ...options, method: 'GET' });
export const apiPost = (path, data, options = {}) => apiRequest(path, { ...options, method: 'POST', data });
export const apiPut = (path, data, options = {}) => apiRequest(path, { ...options, method: 'PUT', data });
export const apiPatch = (path, data, options = {}) => apiRequest(path, { ...options, method: 'PATCH', data });
export const apiDelete = (path, data, options = {}) => apiRequest(path, { ...options, method: 'DELETE', data });
