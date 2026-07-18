import { createAuthClient } from 'better-auth/react';
import { dashClient } from '@better-auth/infra/client';
import { usernameClient } from 'better-auth/client/plugins';
import { twoFactorClient } from 'better-auth/client/plugins';
import { captureAuthTokenFromResponse, readAccessToken } from '../utils/authSession';

const apiRoot = (process.env.REACT_APP_API_URL || '/api').replace(/\/api\/?$/, '');
const authBaseURL = `${apiRoot || ''}/api/auth`.replace(/([^:]\/)\/+/g, '$1');

export const authClient = createAuthClient({
    baseURL: authBaseURL.startsWith('http') ? authBaseURL : `${window.location.origin}${authBaseURL}`,
    fetchOptions: {
        credentials: 'include',
        auth: {
            type: 'Bearer',
            token: () => readAccessToken() || '',
        },
        onSuccess: (ctx) => {
            captureAuthTokenFromResponse(ctx?.response);
        },
    },
    plugins: [
        dashClient(),
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
