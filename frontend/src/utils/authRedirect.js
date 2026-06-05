/**
 * utils/authRedirect.js
 *
 * Single authoritative function for all Google OAuth redirects.
 *
 * Usage:
 *   redirectToGoogle('login')    → /google/auth/login  (account sign-in)
 *   redirectToGoogle('calendar') → /auth/google?scope=calendar  (calendar connect)
 */
import { apiGet } from './api';

// Used only for Calendar/YouTube integration (not login — login uses Supabase native OAuth)
export const redirectToGoogle = async () => {
    try {
        const { authUrl } = await apiGet('/google/auth/init');
        if (authUrl) {
            window.location.href = authUrl;
        } else {
            console.error('Failed to get authUrl from server');
        }
    } catch (err) {
        console.error('Error initiating Google OAuth:', err);
    }
};
