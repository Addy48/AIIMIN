import React, { useState, useCallback } from 'react';
import { SettingsPanelSection } from '../components/system/DashboardSections';
import { useAuth } from '../hooks/useAuth';
import { apiDelete } from '../utils/api';
import toast from '../utils/toast';
import { useMockData } from '../providers/MockDataProvider';
import { exportUserData } from '../utils/exportUserData';
import { supabase } from '../utils/supabase';

/**
 * Settings Page — Account + preferences.
 */
const Settings = () => {
    const { user, session } = useAuth();
    const [notifReminders, setNotifReminders] = useState(() => localStorage.getItem('aiimin_notif_reminders') === 'true');
    const [notifInsights, setNotifInsights] = useState(() => localStorage.getItem('aiimin_notif_insights') === 'true');
    const { isUsingMock, mockData } = useMockData() || {};

    const devEmail = process.env.REACT_APP_DEV_EMAIL;
    const isAdmin = !!(devEmail && user?.email === devEmail);

    const saveAndSet = (key, setter) => (val) => {
        setter(val);
        localStorage.setItem(key, String(val));
    };

    const handleExport = useCallback(async () => {
        const tid = toast.loading('Exporting data...');
        try {
            await exportUserData(session, isUsingMock, mockData);
            toast.update(tid, 'Downloaded JSON ✓', 'success');
        } catch (err) {
            toast.update(tid, 'Export failed', 'error');
        }
    }, [session, isUsingMock, mockData]);

    const handleDeleteAllData = useCallback(async () => {
        if (!window.confirm('This will wipe all your tracked data (Logs, Finance, Placements, Typing) but KEEP your account. Proceed?')) return;
        const confirmText = `wipe data`;
        const input = window.prompt(`Type "${confirmText}" to confirm:`);
        if (input !== confirmText) {
            toast.error('Deletion cancelled. Input did not match exactly.');
            return;
        }
        const tid = toast.loading('Deleting all data...');
        try {
            const userId = user.id;
            
            // Delete in order of dependencies if any, though most are flat linked to user_id
            await supabase.from('daily_logs').delete().eq('user_id', userId);
            await supabase.from('lab_typing_tests').delete().eq('user_id', userId);
            await supabase.from('money_transactions').delete().eq('user_id', userId);
            await supabase.from('wealth_assets').delete().eq('user_id', userId);
            await supabase.from('accounts').delete().eq('user_id', userId);
            await supabase.from('job_applications').delete().eq('user_id', userId);
            await supabase.from('resumes').delete().eq('user_id', userId);
            await supabase.from('pomodoro_sessions').delete().eq('user_id', userId);
            await supabase.from('budgets').delete().eq('user_id', userId);
            await supabase.from('habits').delete().eq('user_id', userId);
            await supabase.from('notes').delete().eq('user_id', userId);
            
            toast.update(tid, 'All data deleted successfully', 'success');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            console.error('Data deletion error:', err);
            toast.update(tid, 'Failed to delete data', 'error');
        }
    }, [user]);

    const handleDeleteAccount = useCallback(async () => {
        if (!window.confirm('This will PERMANENTLY delete all your data AND your account. Proceed to second confirmation?')) return;
        const confirmText = `delete ${user.email}`;
        const input = window.prompt(`Type "${confirmText}" to confirm:`);
        if (input !== confirmText) {
            toast.error('Deletion cancelled. Input did not match exactly.');
            return;
        }
        const tid = toast.loading('Deleting account...');
        try {
            await apiDelete('/account', { confirm: 'DELETE' }, { session });
            toast.update(tid, 'Account deleted', 'success');
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            toast.update(tid, 'Delete failed', 'error');
        }
    }, [session, user]);

    if (!user) return null;

    return (
        <div>
            <h1 className="text-section" style={{ marginBottom: 'var(--space-6)' }}>Settings</h1>
            <SettingsPanelSection
                user={user}
                isAdmin={isAdmin}
                session={session}
                notifReminders={notifReminders}
                notifInsights={notifInsights}
                onRemindersChange={saveAndSet('aiimin_notif_reminders', setNotifReminders)}
                onInsightsChange={saveAndSet('aiimin_notif_insights', setNotifInsights)}
                onExport={handleExport}
                onDeleteData={handleDeleteAllData}
                onDelete={handleDeleteAccount}
            />
        </div>
    );
};

export default Settings;
