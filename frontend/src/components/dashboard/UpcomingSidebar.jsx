import React from 'react';
import supabaseClient from '../../utils/supabase';

const UpcomingSidebar = () => {
    const [items, setItems] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const now = new Date();
                const todayStr = now.toISOString().split('T')[0];
                const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

                const newItems = [];

                // 1) Active Focus Session
                if (localStorage.getItem('aiimin_pomodoro_active') === 'true') {
                    newItems.push({
                        label: 'Focus Session in Progress',
                        time: 'Now',
                        color: 'var(--accent)',
                        type: 'focus'
                    });
                }

                // 2) Unmet Daily Commitments
                const { data: commitments } = await supabaseClient
                    .from('daily_commitments')
                    .select('targets, met_count')
                    .eq('date', todayStr)
                    .maybeSingle();

                if (commitments && commitments.targets) {
                    const parsedTargets = typeof commitments.targets === 'string'
                        ? JSON.parse(commitments.targets)
                        : commitments.targets;
                    const unmetCount = parsedTargets.length - (commitments.met_count || 0);
                    if (unmetCount > 0) {
                        newItems.push({
                            label: `${unmetCount} Commitment${unmetCount > 1 ? 's' : ''} Remaining`,
                            time: 'Today',
                            color: 'var(--success)',
                            type: 'commitment'
                        });
                    }
                }

                // 3) Reminders due within 2 hours
                const { data: reminders } = await supabaseClient
                    .from('notes')
                    .select('id, title, content, reminder_time, type')
                    .eq('type', 'reminder')
                    .eq('completed', false)
                    .gte('reminder_time', now.toISOString())
                    .lte('reminder_time', twoHoursLater.toISOString())
                    .order('reminder_time', { ascending: true })
                    .limit(3);

                const mappedReminders = (reminders || []).map(r => ({
                    label: r.title || r.content?.slice(0, 40) || 'Reminder',
                    time: new Date(r.reminder_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    color: 'var(--success)',
                    type: 'reminder',
                }));

                newItems.push(...mappedReminders);
                setItems(newItems.slice(0, 4));
            } catch (_) {
                setItems([]);
            } finally {
                setLoaded(true);
            }
        };

        fetchUpcoming();
        const interval = setInterval(fetchUpcoming, 60000);

        const handleStorage = () => fetchUpcoming();
        window.addEventListener('storage', handleStorage);
        window.addEventListener('aiimin_pomodoro_toggled', handleStorage);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('aiimin_pomodoro_toggled', handleStorage);
        };
    }, []);

    if (!loaded) return <div style={{ fontSize: '11px', color: 'var(--text-3)', padding: '8px 0' }}>Loading...</div>;

    if (items.length === 0) {
        return (
            <div style={{ padding: '12px 0', fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, lineHeight: 1.5 }}>
                Clear schedule — perfect for deep work ✨
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', opacity: i === 0 ? 1 : 0.6 }}>
                    <div style={{ width: '3px', height: '24px', background: item.color, borderRadius: '4px' }} />
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>{item.label}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>{item.time}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UpcomingSidebar;
