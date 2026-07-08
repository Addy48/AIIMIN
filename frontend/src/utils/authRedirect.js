/**
 * Calendar/YouTube integration OAuth — separate from app login (Better Auth).
 */
import { apiGet } from './api';

export const redirectToGoogle = async ({ loginHint } = {}) => {
    try {
        const path = loginHint
            ? `/google/auth/init?login_hint=${encodeURIComponent(loginHint)}`
            : '/google/auth/init';
        const { authUrl } = await apiGet(path);
        if (authUrl) {
            window.location.href = authUrl;
        } else {
            console.error('Failed to get authUrl from server');
        }
    } catch (err) {
        console.error('Error initiating Google OAuth:', err);
        throw err;
    }
};

export const fetchGoogleIntegrationStatus = async () => {
    try {
        return await apiGet('/google/auth/status');
    } catch {
        return { connected: false };
    }
};
