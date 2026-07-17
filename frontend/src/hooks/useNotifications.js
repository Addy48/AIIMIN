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
import supabase from '../utils/supabase';

export const useNotifications = () => {
    const { user, isSignedIn } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const pollRef = useRef(null);

    const fetchCount = useCallback(async () => {
        if (!isSignedIn || !user?.id) return;
        try {
            const { unread } = await apiGet('/notifications/count');
            setUnreadCount(unread);
        } catch { /* silent */ }
    }, [isSignedIn, user?.id]);

    const fetchAll = useCallback(async () => {
        if (!isSignedIn || !user?.id) return;
        setLoading(true);
        try {
            const data = await apiGet('/notifications', { params: { limit: 30 } }).catch(() => []);

            const localNotifs = [];
            const today = new Date().toLocaleDateString('en-CA');

            const { data: log } = await supabase
                .from('daily_logs')
                .select('id')
                .eq('user_id', user.id)
                .eq('date', today)
                .maybeSingle();

            if (!log) {
                localNotifs.push({
                    id: 'local_daily_log',
                    type: 'commitment_miss',
                    title: 'Daily Log Required',
                    body: 'Your daily system check-in is pending. Log your metrics to maintain system integrity.',
                    action_url: '/overview',
                    created_at: new Date().toISOString(),
                    read_at: null,
                });
            }

            const currentHour = new Date().getHours();
            if (currentHour >= 22) {
                localNotifs.push({
                    id: 'local_sleep_warning',
                    type: 'drift_alert',
                    title: 'System Wind-Down',
                    body: 'It is past 22:00. Begin your wind-down protocol to ensure optimal recovery for tomorrow.',
                    action_url: '/journal',
                    created_at: new Date().toISOString(),
                    read_at: null,
                });
            }

            const combined = [...localNotifs, ...(Array.isArray(data) ? data : [])];
            setNotifications(combined);
            setUnreadCount(combined.filter((n) => !n.read_at).length);
        } catch { /* silent */ } finally {
            setLoading(false);
        }
    }, [isSignedIn, user?.id]);

    const markRead = useCallback(async (id) => {
        if (!isSignedIn) return;
        if (id.startsWith('local_')) {
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
            setUnreadCount((c) => Math.max(0, c - 1));
            return;
        }
        try {
            await apiPatch(`/notifications/${id}/read`, {});
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)),
            );
            setUnreadCount((c) => Math.max(0, c - 1));
        } catch { /* silent */ }
    }, [isSignedIn]);

    const markAllRead = useCallback(async () => {
        if (!isSignedIn) return;
        try {
            await apiPost('/notifications/mark-all-read', {});
            setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
            setUnreadCount(0);
        } catch { /* silent */ }
    }, [isSignedIn]);

    const dismiss = useCallback(async (id) => {
        if (!isSignedIn) return;
        if (id.startsWith('local_')) {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            setUnreadCount((prev) => {
                const wasUnread = notifications.find((n) => n.id === id && !n.read_at);
                return wasUnread ? Math.max(0, prev - 1) : prev;
            });
            return;
        }
        try {
            await apiDelete(`/notifications/${id}`, null);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            setUnreadCount((prev) => {
                const wasUnread = notifications.find((n) => n.id === id && !n.read_at);
                return wasUnread ? Math.max(0, prev - 1) : prev;
            });
        } catch { /* silent */ }
    }, [isSignedIn, notifications]);

    useEffect(() => {
        fetchCount();
        pollRef.current = setInterval(fetchCount, 60_000);
        return () => clearInterval(pollRef.current);
    }, [fetchCount]);

    useEffect(() => {
        if (!isSignedIn || !user?.id) return undefined;
        const triggerWeeklyReport = async () => {
            const now = new Date();
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            startOfWeek.setHours(0, 0, 0, 0);
            const weekKey = `aiimin_weekly_report_${startOfWeek.getTime()}`;

            if (!localStorage.getItem(weekKey)) {
                try {
                    const res = await apiPost('/notifications/trigger-weekly', {});
                    if (res?.created || res?.reason === 'already_exists') {
                        localStorage.setItem(weekKey, 'true');
                        fetchCount();
                    }
                } catch { /* silent */ }
            }
        };
        triggerWeeklyReport();
        return undefined;
    }, [isSignedIn, user?.id, fetchCount]);

    return { notifications, unreadCount, loading, fetchAll, markRead, markAllRead, dismiss };
};
