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

// Used only for Calendar/YouTube integration (not login — login uses Supabase native OAuth)
export const redirectToGoogle = (scope = 'calendar') => {
    window.location.href = `${API_URL}/auth/init`;
};
