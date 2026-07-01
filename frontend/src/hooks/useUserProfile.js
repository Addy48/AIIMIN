/**
 * useUserProfile.js
 *
 * Hook for managing user_profile (persona, sports prefs, AI tone, dashboard modules).
 * Reads from /api/account/user-profile and patches via PATCH.
 */
import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPatch } from '../utils/api';
import { applyFontScaleToRoot, normalizeFontScale } from './useFontScale';

const DEFAULT_PROFILE = {
    user_id: null,
    persona_tags: [],
    favorite_sports: [],
    favorite_teams: {},
    dashboard_modules: [],
    ai_tone: 'motivating',
    font_scale: 'normal',
    ai_features_enabled: true,
    onboarding_complete: false,
    seen_tips: [],
    prev_tier: 'explore',
    subscription_tier: 'explore',
    last_celebrated_milestone: 0,
    created_at: null,
    updated_at: null,
};

export function useUserProfile() {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch the user_profile from the backend.
     */
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiGet('/account/user-profile');
            setProfile(data || DEFAULT_PROFILE);
        } catch (err) {
            console.error('[useUserProfile] Failed to fetch profile:', err);
            setError(err.message || 'Failed to load profile');
            setProfile(DEFAULT_PROFILE);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Patch specific fields of the user_profile.
     * @param {Object} fields - Partial profile object to update
     * @returns {Promise<Object>} Updated profile
     */
    const updateProfile = useCallback(async (fields) => {
        setError(null);
        try {
            const updated = await apiPatch('/account/user-profile', fields);
            setProfile(prev => ({ ...prev, ...updated }));
            return updated;
        } catch (err) {
            console.error('[useUserProfile] Failed to update profile:', err);
            setError(err.message || 'Failed to update profile');
            throw err;
        }
    }, []);

    /**
     * Initialize or complete onboarding.
     * @param {Object} data - Full profile data from onboarding flow
     */
    const completeOnboarding = useCallback(async (data) => {
        const fields = {
            persona_tags: data.persona_tags || [],
            favorite_sports: data.favorite_sports || [],
            favorite_teams: data.favorite_teams || {},
            dashboard_modules: data.dashboard_modules || [],
            ai_tone: data.ai_tone || 'motivating',
            onboarding_complete: true,
        };
        return updateProfile(fields);
    }, [updateProfile]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile?.font_scale) {
            applyFontScaleToRoot(normalizeFontScale(profile.font_scale));
        }
    }, [profile?.font_scale]);

    return {
        profile,
        loading,
        error,
        refresh: fetchProfile,
        update: updateProfile,
        completeOnboarding,
    };
}