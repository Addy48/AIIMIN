import { createAuthClient } from 'better-auth/react';
import { usernameClient } from 'better-auth/client/plugins';
import { twoFactorClient } from 'better-auth/client/plugins';

const apiRoot = (process.env.REACT_APP_API_URL || '/api').replace(/\/api\/?$/, '');
const authBaseURL = `${apiRoot || ''}/api/auth`.replace(/([^:]\/)\/+/g, '$1');

export const authClient = createAuthClient({
    baseURL: authBaseURL.startsWith('http') ? authBaseURL : `${window.location.origin}${authBaseURL}`,
    fetchOptions: {
        credentials: 'include',
    },
    plugins: [
        usernameClient(),
        twoFactorClient({
            onTwoFactorRedirect() {
                window.location.href = '/login?step=2fa';
            },
        }),
    ],
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
    changePassword,
    changeEmail,
} = authClient;

export function getBearerTokenFromSession(session) {
    return session?.session?.token || session?.token || null;
}
