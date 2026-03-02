import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Section = ({ title, children }) => (
    <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            {title}
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            {children}
        </div>
    </div>
);

const Row = ({ label, children, border = true }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', gap: '10px',
        borderBottom: border ? '1px solid var(--border)' : 'none',
        flexWrap: 'wrap',
    }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)' }}>{label}</div>
        <div>{children}</div>
    </div>
);

const TIMEZONES = [
    'Asia/Kolkata', 'UTC', 'America/New_York', 'America/Chicago',
    'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney',
];

const StatusDot = ({ connected, error }) => (
    <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '2px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 700,
        background: error ? 'rgba(235,140,140,0.08)' : connected ? 'rgba(34,197,94,0.08)' : 'var(--bg-elevated)',
        border: `1px solid ${error ? 'rgba(235,140,140,0.2)' : connected ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
        color: error ? 'var(--danger)' : connected ? '#22c55e' : 'var(--text-3)',
    }}>
        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />
        {error ? 'Error' : connected ? 'Connected' : 'Not connected'}
    </div>
);

const AccountModal = ({ isOpen, onClose }) => {
    const { session, signOut } = useAuth();
    const [profile, setProfile] = useState(null);
    const [integrations, setIntegrations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [exporting, setExporting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [deleting, setDeleting] = useState(false);
    const modalRef = useRef();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
    };

    useEffect(() => {
        if (!isOpen || !session) return;
        setLoading(true);
        Promise.all([
            fetch(`${API_URL}/account/profile`, { headers }).then(r => r.json()),
            fetch(`${API_URL}/account/integrations`, { headers }).then(r => r.json()),
        ]).then(([p, integ]) => {
            setProfile(p);
            setIntegrations(integ);
        }).finally(() => setLoading(false));
    }, [isOpen, session]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleSaveProfile = async () => {
        setSaving(true);
        setSaveMsg('');
        try {
            const res = await fetch(`${API_URL}/account/profile`, {
                method: 'PATCH', headers,
                body: JSON.stringify({ full_name: profile.full_name, timezone: profile.timezone }),
            });
            if (res.ok) setSaveMsg('Saved ✓');
            else setSaveMsg('Failed to save');
        } catch { setSaveMsg('Failed to save'); }
        finally { setSaving(false); setTimeout(() => setSaveMsg(''), 3000); }
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await fetch(`${API_URL}/account/export`, { headers });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'aiimin-export.json';
            a.click();
            URL.revokeObjectURL(url);
        } catch { } finally { setExporting(false); }
    };

    const handleDelete = async () => {
        if (deleteConfirm !== 'DELETE') return;
        setDeleting(true);
        try {
            const res = await fetch(`${API_URL}/account`, {
                method: 'DELETE', headers,
                body: JSON.stringify({ confirm: 'DELETE' }),
            });
            if (res.ok) {
                signOut();
                window.location.reload();
            }
        } catch { } finally { setDeleting(false); }
    };

    const handleConnectGoogle = async () => {
        const res = await fetch(`${API_URL}/google/auth/init`, { headers });
        if (res.ok) {
            const { authUrl } = await res.json();
            window.location.href = authUrl;
        }
    };

    const handleDisconnect = async () => {
        if (!window.confirm('Disconnect Google?')) return;
        await fetch(`${API_URL}/google/auth/disconnect`, { method: 'POST', headers });
        setIntegrations(prev => ({
            google_calendar: { connected: false, error: null },
            youtube: { connected: false, error: null },
        }));
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px',
        }}>
            <div ref={modalRef} className="fade-up" style={{
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: '24px', width: '100%', maxWidth: '640px',
                maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 24px 60px rgba(0,0,0,0.3)', padding: '32px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>Account Settings</h2>
                        <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Manage your profile, integrations and data privacy</p>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-2)',
                        width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                    }}>×</button>
                </div>

                {loading ? (
                    <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '28px', height: '28px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Loading preferences...</span>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="settings-grid">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <style>{`
                                @media (max-width: 600px) {
                                    .settings-grid { grid-template-columns: 1fr !important; }
                                }
                            `}</style>
                            <Section title="User Profile">
                                <Row label="Display Name">
                                    <input
                                        value={profile?.full_name || ''}
                                        onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                                        style={{
                                            padding: '8px 12px', borderRadius: '8px', fontSize: '12px',
                                            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                                            color: 'var(--text-1)', width: '100%', outline: 'none',
                                        }}
                                    />
                                </Row>
                                <Row label="Timezone" border={false}>
                                    <select
                                        value={profile?.timezone || 'Asia/Kolkata'}
                                        onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}
                                        style={{
                                            padding: '8px 12px', borderRadius: '8px', fontSize: '12px',
                                            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                                            color: 'var(--text-1)', cursor: 'pointer', outline: 'none', width: '100%',
                                        }}
                                    >
                                        {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                    </select>
                                </Row>
                                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
                                    <button onClick={handleSaveProfile} disabled={saving} style={{
                                        flex: 1, padding: '10px', background: 'var(--accent)', color: 'white',
                                        border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 800,
                                        cursor: 'pointer', opacity: saving ? 0.7 : 1, transition: 'all 0.2s ease',
                                    }}>
                                        {saving ? 'Saving...' : 'Update Profile'}
                                    </button>
                                    {saveMsg && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 700 }}>{saveMsg}</span>}
                                </div>
                            </Section>

                            <Section title="Integrations">
                                <Row label="Identity Provider">
                                    <div style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: 600 }}>Google Auth</div>
                                </Row>
                                <Row label="Calendar & YT" border={false}>
                                    <StatusDot connected={integrations?.google_calendar?.connected} error={integrations?.google_calendar?.error} />
                                </Row>
                                <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
                                    {!integrations?.google_calendar?.connected ? (
                                        <button onClick={handleConnectGoogle} style={{
                                            width: '100%', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                                            borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: 'var(--text-1)', cursor: 'pointer',
                                        }}>
                                            Connect Google Account
                                        </button>
                                    ) : (
                                        <button onClick={handleDisconnect} style={{
                                            width: '100%', padding: '10px', background: 'none', border: '1px solid var(--border)',
                                            borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', cursor: 'pointer',
                                        }}>
                                            Disconnect Services
                                        </button>
                                    )}
                                </div>
                            </Section>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Section title="Data & Privacy">
                                <div style={{ padding: '20px' }}>
                                    <div style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 700, marginBottom: '4px' }}>Download Archive</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '16px' }}>Fetch a copy of all your tracked behavioral metrics in JSON format.</div>
                                    <button onClick={handleExport} disabled={exporting} style={{
                                        width: '100%', padding: '10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                        borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: 'var(--text-1)', cursor: 'pointer',
                                    }}>
                                        {exporting ? 'Preparing Archive...' : 'Export All Data'}
                                    </button>
                                </div>
                            </Section>

                            <Section title="Danger Zone">
                                <div style={{ padding: '20px' }}>
                                    <div style={{ fontSize: '13px', color: 'var(--danger)', fontWeight: 700, marginBottom: '4px' }}>Delete Account</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '16px' }}>Permanently remove all logs and settings. This action is irreversible.</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <input
                                            value={deleteConfirm}
                                            onChange={e => setDeleteConfirm(e.target.value)}
                                            placeholder="Type DELETE to confirm"
                                            style={{
                                                padding: '10px', borderRadius: '10px', fontSize: '12px',
                                                border: '1px solid rgba(235,140,140,0.3)', background: 'var(--bg-elevated)',
                                                color: 'var(--text-1)', width: '100%', outline: 'none',
                                            }}
                                        />
                                        <button onClick={handleDelete} disabled={deleting || deleteConfirm !== 'DELETE'} style={{
                                            width: '100%', padding: '10px', background: deleteConfirm === 'DELETE' ? 'var(--danger)' : 'transparent',
                                            border: `1px solid ${deleteConfirm === 'DELETE' ? 'var(--danger)' : 'var(--border)'}`,
                                            borderRadius: '10px', fontSize: '12px', fontWeight: 800,
                                            color: deleteConfirm === 'DELETE' ? '#fff' : 'var(--text-3)',
                                            cursor: 'pointer', opacity: (deleting || deleteConfirm !== 'DELETE') ? 0.5 : 1, transition: 'all 0.2s ease',
                                        }}>
                                            {deleting ? 'Deleting Account...' : 'Confirm Deletion'}
                                        </button>
                                    </div>
                                </div>
                            </Section>

                            <div style={{ marginTop: 'auto', padding: '10px 0' }}>
                                <button onClick={signOut} style={{
                                    width: '100%', padding: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                    borderRadius: '14px', fontSize: '14px', fontWeight: 800, color: 'var(--text-2)',
                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}>
                                    <span>🚪</span> Sign Out of AIIMIN
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountModal;
