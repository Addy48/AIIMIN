/**
 * Better Auth — AIIMIN identity provider (replaces Supabase Auth).
 */
import { betterAuth } from 'better-auth';
import { bearer } from 'better-auth/plugins/bearer';
import { username } from 'better-auth/plugins/username';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { getPool } from './db.js';
import { sendEmail } from './email.js';
import { ensureUserProfile } from '../services/userProfileService.js';

const PIN_PATTERN = /^\d{6}$/;
const OS_ID_PATTERN = /^[A-Z0-9@,._\-=+*^$#!]+$/;

const validateOsId = (value) => {
    const username = String(value || '').trim().toUpperCase();
    if (username.length !== 8) return 'OS-ID must be exactly 8 characters long.';
    if (!OS_ID_PATTERN.test(username)) return 'Only letters, numbers, and @,._-=+*^$#! are allowed.';
    const digits = (username.match(/[0-9]/g) || []).length;
    if (digits > 4) return 'OS-ID can have at most 4 numbers';
    return null;
};

const validatePin = (password) => {
    if (!PIN_PATTERN.test(String(password || ''))) {
        throw new Error('PIN must be exactly 6 digits');
    }
};

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const authBaseUrl = process.env.BETTER_AUTH_URL
    || process.env.API_URL
    || (process.env.NODE_ENV === 'production' ? 'https://api.aiimin.in' : 'http://localhost:3001');

async function sendAuthEmail(to, subject, text, html) {
    try {
        if (process.env.RESEND_API_KEY) {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);
            const from = process.env.RESEND_FROM || `${process.env.RESEND_FROM_NAME || 'AIIMIN'} <${process.env.RESEND_FROM_EMAIL || 'noreply@admin.aiimin.in'}>`;
            await resend.emails.send({ from, to, subject, text, html });
            return;
        }
    } catch (err) {
        console.warn('[auth] Resend email failed, logging link:', err.message);
    }
    console.log(`[auth-email] to=${to} subject=${subject}\n${text}`);
}

export const auth = betterAuth({
    appName: 'AIIMIN',
    baseURL: authBaseUrl,
    basePath: '/api/auth',
    secret: process.env.BETTER_AUTH_SECRET,
    database: getPool(),

    trustedOrigins: [
        frontendUrl,
        'http://localhost:3000',
        'http://localhost:3001',
        'https://aiimin.in',
        'https://www.aiimin.in',
        'https://api.aiimin.in',
    ],

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
        maxPasswordLength: 6,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendAuthEmail(
                user.email,
                'Reset your AIIMIN PIN',
                `Click to reset your PIN: ${url}`,
                `<p>Click to reset your PIN:</p><p><a href="${url}">${url}</a></p>`,
            );
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            if (user.email?.toLowerCase().endsWith('@aiimin.com')) return;
            await sendAuthEmail(
                user.email,
                'Verify your AIIMIN email',
                `Verify your email: ${url}`,
                `<p>Verify your email:</p><p><a href="${url}">${url}</a></p>`,
            );
        },
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_LOGIN_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
            redirectURI: `${authBaseUrl}/api/auth/callback/google`,
        },
    },

    user: {
        changeEmail: { enabled: true },
        deleteUser: { enabled: true },
        additionalFields: {
            onboardingStage: {
                type: 'number',
                required: false,
                defaultValue: 0,
                fieldName: 'onboarding_stage',
            },
            fullName: {
                type: 'string',
                required: false,
                fieldName: 'full_name',
            },
        },
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },

    advanced: {
        useSecureCookies: process.env.NODE_ENV === 'production',
        crossSubDomainCookies: process.env.NODE_ENV === 'production'
            ? { enabled: true, domain: 'aiimin.in' }
            : undefined,
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    if (user.password) validatePin(user.password);
                    if (user.username) {
                        const err = validateOsId(user.username);
                        if (err) throw new Error(err);
                        user.username = user.username.trim().toUpperCase();
                    }
                    return { data: user };
                },
                after: async (user) => {
                    try {
                        const pool = getPool();
                        const email = user.email?.toLowerCase() || '';
                        if (email.endsWith('@aiimin.com')) {
                            await pool.query('UPDATE "user" SET "emailVerified" = true WHERE id = $1', [user.id]);
                        }
                        await ensureUserProfile(pool, {
                            id: user.id,
                            email: user.email,
                            user_metadata: {
                                full_name: user.name || user.fullName || '',
                                username: user.username || '',
                            },
                        });
                        await pool.query(
                            `UPDATE public.users SET onboarding_stage = COALESCE(onboarding_stage, 0) WHERE id = $1`,
                            [user.id],
                        );
                    } catch (err) {
                        console.error('[auth] user.create.after profile sync failed:', err.message);
                    }
                },
            },
            update: {
                before: async (user) => {
                    if (user.password) validatePin(user.password);
                    if (user.username) {
                        const err = validateOsId(user.username);
                        if (err) throw new Error(err);
                        user.username = user.username.trim().toUpperCase();
                    }
                    return { data: user };
                },
            },
        },
    },

    plugins: [
        bearer(),
        username({
            minUsernameLength: 8,
            maxUsernameLength: 8,
            usernameValidator: (value) => !validateOsId(value),
        }),
        twoFactor({
            issuer: 'AIIMIN',
        }),
    ],
});

export { validateOsId, validatePin, PIN_PATTERN };
