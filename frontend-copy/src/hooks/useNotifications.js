/**
 * hooks/useNotifications.js
 *
 * Fetches, polls, and manages in-app notifications.
 * Polls /notifications/count every 60s for the badge.
 * Full list is fetched lazily when panel opens.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { apiDelete, apiGet, apiPatch, apiPost } from '../utils/api';

export const useNotifications = () => {
    const { session } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const pollRef = useRef(null);

    const fetchCount = useCallback(async () => {
        if (!session) return;
        try {
            const { unread } = await apiGet('/notifications/count', { session });
            setUnreadCount(unread);
        } catch { /* silent */ }
    }, [session]);

    const fetchAll = useCallback(async () => {
        if (!session) return;
        setLoading(true);
        try {
            const data = await apiGet('/notifications', { session, params: { limit: 30 } });
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read_at).length);
        } catch { /* silent */ } finally {
            setLoading(false);
        }
    }, [session]);

    const markRead = useCallback(async (id) => {
        if (!session) return;
        try {
            await apiPatch(`/notifications/${id}/read`, {}, { session });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(c => Math.max(0, c - 1));
        } catch { /* silent */ }
    }, [session]);

    const markAllRead = useCallback(async () => {
        if (!session) return;
        try {
            await apiPost('/notifications/mark-all-read', {}, { session });
            setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
            setUnreadCount(0);
        } catch { /* silent */ }
    }, [session]);

    const dismiss = useCallback(async (id) => {
        if (!session) return;
        try {
            await apiDelete(`/notifications/${id}`, null, { session });
            setNotifications(prev => prev.filter(n => n.id !== id));
            setUnreadCount(prev => {
                const wasUnread = notifications.find(n => n.id === id && !n.read_at);
                return wasUnread ? Math.max(0, prev - 1) : prev;
            });
        } catch { /* silent */ }
    }, [session, notifications]);

    // Start polling on mount, stop on unmount
    useEffect(() => {
        fetchCount();
        pollRef.current = setInterval(fetchCount, 60_000);
        return () => clearInterval(pollRef.current);
    }, [fetchCount]);

    return { notifications, unreadCount, loading, fetchAll, markRead, markAllRead, dismiss };
};
