/**
 * hooks/useCommitment.js
 *
 * Manages today's commitment state.
 * Fetches from /commitment/today on mount.
 * Provides updateTargets and evaluate helpers.
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const useCommitment = () => {
    const { session } = useAuth();
    const [commitment, setCommitment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getHeaders = useCallback(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
    }), [session?.access_token]);

    const fetchToday = useCallback(async () => {
        if (!session) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/commitment/today`, { headers: getHeaders() });
            if (res.ok) setCommitment(await res.json());
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [session, getHeaders]);

    const updateTargets = async (targets) => {
        const res = await fetch(`${API_URL}/commitment/targets`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ targets }),
        });
        if (res.ok) {
            const updated = await res.json();
            setCommitment(updated);
        }
    };

    const evaluate = async () => {
        const res = await fetch(`${API_URL}/commitment/evaluate`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({}),
        });
        if (res.ok) {
            const result = await res.json();
            setCommitment(prev => ({ ...prev, ...result }));
            return result;
        }
    };

    useEffect(() => { fetchToday(); }, [fetchToday]);

    return { commitment, loading, error, fetchToday, updateTargets, evaluate };
};
