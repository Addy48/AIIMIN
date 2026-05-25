const safeText = (value, maxLength = 255) => (
    typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLength) : null
);

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
        username: safeText(overrides.username || metadata.username, 64),
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
