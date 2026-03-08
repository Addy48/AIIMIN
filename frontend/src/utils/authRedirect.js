/**
 * utils/authRedirect.js
 *
 * Single authoritative function for all Google OAuth redirects.
 *
 * Usage:
 *   redirectToGoogle('login')    → /google/auth/login  (account sign-in)
 *   redirectToGoogle('calendar') → /auth/google?scope=calendar  (calendar connect)
 */
import { API_URL } from './api';

export const redirectToGoogle = (scope = 'login') => {
    if (scope === 'calendar') {
        window.location.href = `${API_URL}/auth/google?scope=calendar`;
    } else {
        window.location.href = `${API_URL}/auth/google`;
    }
};
