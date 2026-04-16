import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * useLabSummary — single data dependency for the entire Lab page.
 * Returns { data, status, error, retry } contract (M-7 fix: no silent failures).
 */
export default function useLabSummary() {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | loading | success | empty | error
    const [error, setError] = useState(null);
    const abortRef = useRef(null);

    const fetchSummary = useCallback(async () => {
        setStatus('loading');
        setError(null);

        try {
            if (abortRef.current) abortRef.current.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE}/lab/summary`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || `HTTP ${res.status}`);
            }

            const json = await res.json();
            setData(json);

            // Distinguish empty from success
            const hasAnyData = json.practice?.typing?.weekly_best_wpm !== null
                || json.intel?.insights?.total_count > 0
                || json.audit?.belief_inventory?.completed > 0;
            setStatus(hasAnyData ? 'success' : 'empty');
        } catch (err) {
            if (err.name === 'AbortError') return;
            setError(err);
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        fetchSummary();
        return () => { if (abortRef.current) abortRef.current.abort(); };
    }, [fetchSummary]);

    return { data, status, error, retry: fetchSummary };
}
