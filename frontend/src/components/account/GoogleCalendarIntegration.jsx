import React from 'react';
import { redirectToGoogle } from '../../utils/authRedirect';

const GoogleCalendarIntegration = ({ user }) => {
    const isConnected = user?.google_calendar_connected || false;

    const connectGoogleCalendar = () => {
        redirectToGoogle('calendar');
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {isConnected ? (
                <div style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></span>
                    Connected
                </div>
            ) : (
                <button
                    onClick={connectGoogleCalendar}
                    style={{
                        fontSize: '11px', color: 'var(--text-1)', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                        padding: '4px 12px', borderRadius: '99px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                    Connect Google Calendar
                </button>
            )}
        </div>
    );
};

export default GoogleCalendarIntegration;
