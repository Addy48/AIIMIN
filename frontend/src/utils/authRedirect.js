/**
 * utils/authRedirect.js
 *
 * Single authoritative function for all Google OAuth redirects.
 *
 * Usage:
 *   redirectToGoogle('login')    → /google/auth/login  (account sign-in)
 *   redirectToGoogle('calendar') → /auth/google?scope=calendar  (calendar connect)
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const redirectToGoogle = (scope = 'login') => {
    if (scope === 'calendar') {
        window.location.href = `${API_URL}/auth/google?scope=calendar`;
    } else {
        window.location.href = `${API_URL}/auth/google`;
    }
};
