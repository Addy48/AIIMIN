import React, { useState, useCallback } from 'react';
import { SettingsPanelSection } from '../components/system/DashboardSections';
import { useAuth } from '../hooks/useAuth';
import { apiDelete } from '../utils/api';
import toast from '../utils/toast';
import { useMockData } from '../providers/MockDataProvider';
import { exportUserData } from '../utils/exportUserData';

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

    const handleDeleteAccount = useCallback(async () => {
        if (!window.confirm('This will PERMANENTLY delete all your data. Type DELETE to confirm.')) return;
        const input = window.prompt('Type DELETE to confirm:');
        if (input !== 'DELETE') return;
        const tid = toast.loading('Deleting account...');
        try {
            await apiDelete('/account', { confirm: 'DELETE' }, { session });
            toast.update(tid, 'Account deleted', 'success');
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            toast.update(tid, 'Delete failed', 'error');
        }
    }, [session]);

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
                onDelete={handleDeleteAccount}
            />
        </div>
    );
};

export default Settings;
