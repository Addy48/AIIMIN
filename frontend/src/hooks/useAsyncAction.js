/**
 * hooks/useAsyncAction.js
 *
 * Centralized loading/error state for async operations.
 * Catches errors and pushes to global error log for admin visibility.
 */
import { useState, useCallback } from 'react';

const useAsyncAction = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const run = useCallback(async (fn) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fn();
            return result;
        } catch (e) {
            setError(e);
            // Push to global error log for admin console
            if (typeof window !== 'undefined' && Array.isArray(window.__AIIMIN_ERROR_LOG)) {
                window.__AIIMIN_ERROR_LOG.push({
                    message: e.message || String(e),
                    stack: e.stack,
                    timestamp: new Date().toISOString(),
                });
                // Trim to max 50 entries
                if (window.__AIIMIN_ERROR_LOG.length > 50) {
                    window.__AIIMIN_ERROR_LOG.splice(0, window.__AIIMIN_ERROR_LOG.length - 50);
                }
            }
            throw e; // Re-throw so callers can still handle
        } finally {
            setLoading(false);
        }
    }, []);

    return { run, loading, error };
};

export default useAsyncAction;
