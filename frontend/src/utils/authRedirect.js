/**
 * Calendar/YouTube integration OAuth — separate from app login (Better Auth).
 */
import { apiGet } from './api';
import toast from './toast';

export const redirectToGoogle = async ({ loginHint } = {}) => {
    try {
        const path = loginHint
            ? `/google/auth/init?login_hint=${encodeURIComponent(loginHint)}`
            : '/google/auth/init';
        const { authUrl } = await apiGet(path);
        if (authUrl) {
            window.location.href = authUrl;
            return;
        }
        toast.error('Could not start Google Calendar connection. Try signing in again.');
    } catch (err) {
        console.error('Error initiating Google OAuth:', err);
        const msg = err?.message || 'Could not connect Google Calendar';
        if (msg.toLowerCase().includes('unauthorized') || err?.status === 401) {
            toast.error('Session expired — sign out and sign in again, then retry Connect Google.');
        } else {
            toast.error(msg);
        }
    }
};

export const fetchGoogleIntegrationStatus = async () => {
    try {
        return await apiGet('/google/auth/status');
    } catch {
        return { connected: false };
    }
};
