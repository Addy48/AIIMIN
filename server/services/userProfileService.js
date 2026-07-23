const safeText = (value, maxLength = 255) => (
    typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLength) : null
);

const safeUsername = (value) => {
    const username = safeText(value, 64);
    return username ? username.toUpperCase() : null;
};

const PATCHABLE_PROFILE_FIELDS = [
    'persona_tags',
    'favorite_sports',
    'favorite_teams',
    'dashboard_modules',
    'domain_priorities',
    'ai_tone',
    'ai_features_enabled',
    'ai_journal_opt_in',
    'onboarding_complete',
    'tagline',
    'location',
    'notification_prefs',
    'seen_tips',
    'prev_tier',
    'last_celebrated_milestone',
    'subscription_tier',
    'subscription_period_end',
    'stripe_customer_id',
    'stripe_subscription_id',
    'font_scale',
];

const PROFILE_SELECT = `
    user_id, persona_tags, favorite_sports, favorite_teams, dashboard_modules,
    domain_priorities, ai_tone, ai_features_enabled, ai_journal_opt_in,
    onboarding_complete, tagline, location, notification_prefs, seen_tips,
    prev_tier, last_celebrated_milestone, subscription_tier, subscription_period_end,
    stripe_customer_id, stripe_subscription_id, font_scale,
    created_at, updated_at
`;

export function profileFromAuthUser(authUser, overrides = {}) {
    const metadata = authUser?.user_metadata || {};
    const identityData = authUser?.identities?.[0]?.identity_data || {};

    return {
        id: authUser.id,
        email: safeText(authUser.email?.toLowerCase()),
        fullName: safeText(
            overrides.fullName ||
            metadata.full_name ||
            metadata.name ||
            identityData.full_name ||
            identityData.name
        ),
        username: safeUsername(overrides.username || metadata.username),
        avatarUrl: safeText(
            metadata.avatar_url ||
            metadata.picture ||
            identityData.avatar_url ||
            identityData.picture
        ),
        timezone: safeText(overrides.timezone || metadata.timezone, 64) || 'Asia/Kolkata',
    };
}

export async function ensureUserProfile(pool, authUser, overrides = {}) {
    if (!authUser?.id || !authUser?.email) {
        throw new Error('A valid Supabase auth user is required');
    }

    const profile = profileFromAuthUser(authUser, overrides);

    const { rows } = await pool.query(
        `INSERT INTO public.users (id, email, full_name, username, avatar_url, timezone)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
             email = EXCLUDED.email,
             full_name = COALESCE(public.users.full_name, EXCLUDED.full_name),
             username = COALESCE(public.users.username, EXCLUDED.username),
             avatar_url = COALESCE(public.users.avatar_url, EXCLUDED.avatar_url),
             timezone = COALESCE(public.users.timezone, EXCLUDED.timezone),
             updated_at = NOW()
         RETURNING id, email, full_name, username, role, avatar_url, timezone, onboarding_stage, created_at`,
        [
            profile.id,
            profile.email,
            profile.fullName,
            profile.username,
            profile.avatarUrl,
            profile.timezone,
        ]
    );

    return rows[0];
}

export async function getUserProfile(pool, userId) {
    try {
        const { rows } = await pool.query(
            `SELECT ${PROFILE_SELECT} FROM user_profiles WHERE user_id = $1 LIMIT 1`,
            [userId],
        );
        return rows[0] || null;
    } catch (err) {
        if (!/does not exist|column/i.test(err.message)) throw err;
        const { rows } = await pool.query(
            `SELECT user_id, tagline, onboarding_complete, subscription_tier, prev_tier,
                    subscription_period_end, font_scale, updated_at
             FROM user_profiles WHERE user_id = $1 LIMIT 1`,
            [userId],
        );
        return rows[0] || null;
    }
}

export async function patchUserProfile(pool, userId, patch = {}) {
    const sanitized = { ...patch };
    if (typeof sanitized.tagline === 'string') {
        sanitized.tagline = sanitized.tagline.trim().slice(0, 500) || null;
    }
    if (typeof sanitized.location === 'string') {
        sanitized.location = sanitized.location.trim().slice(0, 120) || null;
    }

    const entries = Object.entries(sanitized).filter(
        ([k, v]) => PATCHABLE_PROFILE_FIELDS.includes(k) && v !== undefined,
    );
    if (!entries.length) return getUserProfile(pool, userId);

    const sets = entries.map(([k], i) => `${k} = $${i + 2}`).join(', ');
    const values = entries.map(([, v]) => v);

    const { rows } = await pool.query(
        `INSERT INTO user_profiles (user_id, ${entries.map(([k]) => k).join(', ')})
         VALUES ($1, ${entries.map((_, i) => `$${i + 2}`).join(', ')})
         ON CONFLICT (user_id) DO UPDATE SET ${sets}, updated_at = NOW()
         RETURNING user_id, ${entries.map(([k]) => k).join(', ')}, updated_at`,
        [userId, ...values],
    );
    const merged = rows[0] || null;
    return merged;
}
