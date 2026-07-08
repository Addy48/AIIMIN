import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { authClient, changePassword, changeEmail } from '../../../lib/auth-client';
import { apiPost } from '../../../utils/api';
import { redirectToGoogle, fetchGoogleIntegrationStatus } from '../../../utils/authRedirect';
import toast from '../../../utils/toast';

const cardStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--r-lg)',
    padding: '20px',
    marginBottom: '16px',
};

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-elevated)',
    color: 'var(--color-text-1)',
    fontFamily: 'var(--font-sans)',
    marginTop: '8px',
};

export default function SecuritySection({ user }) {
    const { checkSession } = useAuth();
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [calendarStatus, setCalendarStatus] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        fetchGoogleIntegrationStatus()
            .then(setCalendarStatus)
            .catch(() => setCalendarStatus({ connected: false }));
    }, []);

    const handleChangePin = async (e) => {
        e.preventDefault();
        if (!/^\d{6}$/.test(newPin)) {
            toast.error('PIN must be exactly 6 digits');
            return;
        }
        if (newPin !== confirmPin) {
            toast.error('PINs do not match');
            return;
        }
        setBusy(true);
        try {
            const result = await changePassword({
                currentPassword: currentPin,
                newPassword: newPin,
                revokeOtherSessions: false,
            });
            if (result.error) throw new Error(result.error.message);
            toast.success('PIN updated');
            setCurrentPin('');
            setNewPin('');
            setConfirmPin('');
            await checkSession();
        } catch (err) {
            toast.error(err.message || 'Could not update PIN');
        } finally {
            setBusy(false);
        }
    };

    const handleForgotPin = async () => {
        if (!user?.email) {
            toast.error('No email on file for PIN reset');
            return;
        }
        setBusy(true);
        try {
            await apiPost('/auth/request-password-reset', {
                email: user.email,
                redirectTo: `${window.location.origin}/login?reset=1`,
            }, { auth: false });
            toast.success('PIN reset email sent');
        } catch (err) {
            toast.error(err.message || 'Could not send reset email');
        } finally {
            setBusy(false);
        }
    };

    const handleChangeEmail = async (e) => {
        e.preventDefault();
        if (!newEmail.includes('@')) {
            toast.error('Enter a valid email');
            return;
        }
        setBusy(true);
        try {
            const result = await changeEmail({
                newEmail: newEmail.trim().toLowerCase(),
                callbackURL: `${window.location.origin}/account?section=privacy`,
            });
            if (result.error) throw new Error(result.error.message);
            toast.success('Check your inbox to confirm the email change');
            setNewEmail('');
        } catch (err) {
            toast.error(err.message || 'Could not start email change');
        } finally {
            setBusy(false);
        }
    };

    const handleDisconnectCalendar = async () => {
        setBusy(true);
        try {
            await apiPost('/google/auth/disconnect');
            setCalendarStatus({ connected: false });
            toast.success('Google Calendar disconnected');
        } catch (err) {
            toast.error(err.message || 'Disconnect failed');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '8px' }}>Privacy & Security</h2>
            <p style={{ color: 'var(--color-text-2)', marginBottom: '24px', fontSize: '14px' }}>
                Manage your PIN, email, calendar connection, and upcoming security features.
            </p>

            <div style={cardStyle}>
                <h3 style={{ margin: '0 0 8px', fontSize: '15px' }}>Change PIN</h3>
                <p style={{ margin: 0, color: 'var(--color-text-2)', fontSize: '13px' }}>
                    Your 6-digit PIN works with OS-ID or email login.
                </p>
                <form onSubmit={handleChangePin} style={{ marginTop: '16px', display: 'grid', gap: '10px', maxWidth: '320px' }}>
                    <input style={inputStyle} type="password" inputMode="numeric" maxLength={6} placeholder="Current PIN" value={currentPin} onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 6))} />
                    <input style={inputStyle} type="password" inputMode="numeric" maxLength={6} placeholder="New PIN" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))} />
                    <input style={inputStyle} type="password" inputMode="numeric" maxLength={6} placeholder="Confirm new PIN" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))} />
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button type="submit" disabled={busy} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                            Update PIN
                        </button>
                        <button type="button" disabled={busy} onClick={handleForgotPin} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer' }}>
                            Forgot PIN?
                        </button>
                    </div>
                </form>
            </div>

            <div style={cardStyle}>
                <h3 style={{ margin: '0 0 8px', fontSize: '15px' }}>Change email</h3>
                <p style={{ margin: 0, color: 'var(--color-text-2)', fontSize: '13px' }}>
                    Current: <strong>{user?.email || '—'}</strong>
                </p>
                <form onSubmit={handleChangeEmail} style={{ marginTop: '16px', display: 'grid', gap: '10px', maxWidth: '420px' }}>
                    <input style={inputStyle} type="email" placeholder="New email address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                    <button type="submit" disabled={busy} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 700, cursor: 'pointer', width: 'fit-content' }}>
                        Send verification
                    </button>
                </form>
            </div>

            <div style={cardStyle}>
                <h3 style={{ margin: '0 0 8px', fontSize: '15px' }}>Google Calendar</h3>
                <p style={{ margin: 0, color: 'var(--color-text-2)', fontSize: '13px' }}>
                    Connect a Google account for calendar sync. This can be a <strong>different email</strong> from your AIIMIN login.
                </p>
                {calendarStatus?.connected ? (
                    <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-text-2)' }}>
                        <div>Connected as <strong>{calendarStatus.linkedEmail || 'Google account'}</strong></div>
                        {calendarStatus.emailsDiffer && (
                            <div style={{ marginTop: '6px' }}>Login email: {calendarStatus.loginEmail}</div>
                        )}
                        {calendarStatus.error && <div style={{ color: '#ef4444', marginTop: '6px' }}>{calendarStatus.error}</div>}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                            <button type="button" disabled={busy} onClick={() => redirectToGoogle()} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
                                Reconnect
                            </button>
                            <button type="button" disabled={busy} onClick={handleDisconnectCalendar} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
                                Disconnect
                            </button>
                        </div>
                    </div>
                ) : (
                    <button type="button" disabled={busy} onClick={() => redirectToGoogle()} style={{ marginTop: '12px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                        Connect Google Calendar
                    </button>
                )}
            </div>

            <div style={{ ...cardStyle, opacity: 0.72 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '15px' }}>Two-factor authentication</h3>
                <p style={{ margin: '0 0 12px', color: 'var(--color-text-2)', fontSize: '13px' }}>
                    2FA is in development and not enabled for your account yet. We&apos;ll turn it on site-wide soon.
                </p>
                <button type="button" disabled style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-elevated)', color: 'var(--color-text-3)', cursor: 'not-allowed' }}>
                    Coming soon
                </button>
            </div>

            <div style={{ ...cardStyle, opacity: 0.72 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '15px' }}>Passkeys</h3>
                <p style={{ margin: '0 0 12px', color: 'var(--color-text-2)', fontSize: '13px' }}>
                    Optional passwordless sign-in will be available after launch. OS-ID + PIN will always work.
                </p>
                <button type="button" disabled style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-elevated)', color: 'var(--color-text-3)', cursor: 'not-allowed' }}>
                    Coming soon
                </button>
            </div>
        </div>
    );
}
