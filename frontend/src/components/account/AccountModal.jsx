import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // Added for Portal
import { useAuth } from '../../hooks/useAuth';
import toast from '../../utils/toast';
import { getAuthHeaders, API_URL } from '../../utils/api';

const Section = ({ title, children }) => (
    <div style={{ marginBottom: '24px' }}>
        <div style={{
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--text-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '14px',
            paddingLeft: '4px'
        }}>
            {title}
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            {children}
        </div>
    </div>
);

const Row = ({ label, children, border = true }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', gap: '12px',
        borderBottom: border ? '1px solid var(--border)' : 'none',
        flexWrap: 'wrap',
    }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{children}</div>
    </div>
);

const TIMEZONES = [
    'Asia/Kolkata', 'UTC', 'America/New_York', 'America/Chicago',
    'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney',
];

const StatusDot = ({ connected, error }) => (
    <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700,
        background: error ? 'rgba(235,140,140,0.1)' : connected ? 'rgba(34,197,94,0.1)' : 'var(--bg-elevated)',
        border: `1px solid ${error ? 'rgba(235,140,140,0.2)' : connected ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
        color: error ? 'var(--danger)' : connected ? '#22c55e' : 'var(--text-3)',
    }}>
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
        {error ? 'Error' : connected ? 'Connected' : 'Not connected'}
    </div>
);

const ChangePassword = ({ session }) => {
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [msg, setMsg] = useState('');
    const [saving, setSaving] = useState(false);

    const handleChange = async () => {
        if (newPw.length < 6) { setMsg('Min 6 characters'); return; }
        if (newPw !== confirmPw) { setMsg('Passwords do not match'); return; }
        setSaving(true);
        setMsg('');
        const { createClient } = await import('@supabase/supabase-js');
        const client = createClient(
            process.env.REACT_APP_SUPABASE_URL,
            process.env.REACT_APP_SUPABASE_ANON_KEY,
            { global: { headers: { Authorization: `Bearer ${session?.access_token}` } } }
        );
        const { error } = await client.auth.updateUser({ password: newPw });
        if (error) { setMsg(error.message); }
        else { setMsg('Password updated ✓'); setNewPw(''); setConfirmPw(''); }
        setSaving(false);
        setTimeout(() => setMsg(''), 4000);
    };

    const inputStyle = {
        padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
        border: '1px solid var(--border)', background: 'var(--bg-elevated)',
        color: 'var(--text-1)', width: '100%', outline: 'none', fontWeight: 600
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="password" placeholder="New password" value={newPw} onChange={e => setNewPw(e.target.value)} style={inputStyle} />
            <input type="password" placeholder="Confirm new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} style={inputStyle} />
            {msg && <div style={{ fontSize: '12px', color: msg.includes('✓') ? '#22c55e' : 'var(--danger)', fontWeight: 700 }}>{msg}</div>}
            <button onClick={handleChange} disabled={saving || !newPw || !confirmPw} style={{
                padding: '12px', background: 'var(--accent)', color: 'white', border: 'none',
                borderRadius: '12px', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                opacity: (saving || !newPw || !confirmPw) ? 0.5 : 1
            }}>{saving ? 'Saving...' : 'Update Password'}</button>
        </div>
    );
};

const AccountModal = ({ isOpen, onClose }) => {
    const { session, signOut } = useAuth();
    const [profile, setProfile] = useState(null);
    const [draftProfile, setDraftProfile] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [exporting, setExporting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [deleting, setDeleting] = useState(false);
    const modalRef = useRef();

    useEffect(() => {
        if (!isOpen || !session) return;
        setLoading(true);
        const headers = getAuthHeaders(session);
        fetch(`${API_URL}/account/profile`, { headers }).then(r => r.ok ? r.json() : Promise.reject('Profile load failed'))
        .then(p => {
            const fallbackName = p?.full_name || session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || '';
            const fallbackTimezone = p?.timezone || session?.user?.user_metadata?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
            const normalizedProfile = { ...p, full_name: fallbackName, timezone: fallbackTimezone };
            setProfile(normalizedProfile);
            setDraftProfile(normalizedProfile);
        }).catch(err => {
            console.error('[AccountModal] fetch error:', err);
        }).finally(() => setLoading(false));
    }, [isOpen, session]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

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
        if (!draftProfile) return;
        setSaving(true);
        setSaveMsg('');
        try {
            const res = await fetch(`${API_URL}/account/profile`, {
                method: 'PATCH', headers: getAuthHeaders(session),
                body: JSON.stringify({ full_name: draftProfile.full_name, timezone: draftProfile.timezone }),
            });
            if (res.ok) {
                const savedProfile = await res.json();
                setProfile(savedProfile);
                setDraftProfile(savedProfile);
                setIsEditingProfile(false);
                setSaveMsg('Saved ✓');
                toast.success('Profile saved');
            }
            else {
                const body = await res.json().catch(() => ({}));
                setSaveMsg('Save failed');
                toast.error(body.error || 'Profile save failed');
            }
        } catch (err) {
            setSaveMsg('Failed to save');
            toast.error(err.message || 'Profile save failed');
        }
        finally { setSaving(false); setTimeout(() => setSaveMsg(''), 3000); }
    };

    const handleEditProfile = () => {
        setDraftProfile(profile);
        setIsEditingProfile(true);
        setSaveMsg('');
    };

    const handleCancelEdit = () => {
        setDraftProfile(profile);
        setIsEditingProfile(false);
        setSaveMsg('');
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await fetch(`${API_URL}/account/export`, { headers: getAuthHeaders(session) });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'aiimin-export.json';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) { toast.error('Export failed'); } finally { setExporting(false); }
    };

    const handleDelete = async () => {
        if (deleteConfirm !== 'DELETE') return;
        setDeleting(true);
        try {
            const res = await fetch(`${API_URL}/account`, {
                method: 'DELETE', headers: getAuthHeaders(session),
                body: JSON.stringify({ confirm: 'DELETE' }),
            });
            if (res.ok) {
                signOut();
                window.location.reload();
            }
        } catch (err) { toast.error('Delete failed'); } finally { setDeleting(false); }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 12, 10, 0.75)', // Darker backdrop
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000000, // Highest z-index
            padding: '20px',
            animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <style>{`
                @keyframes modalEntry {
                    0% { transform: scale(0.96) translateY(20px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
                @media (max-width: 800px) {
                    .settings-grid { grid-template-columns: 1fr; gap: 24px; }
                }
            `}</style>
            <div ref={modalRef} className="no-scrollbar" style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '32px',
                width: '480px', // Fixed width as requested
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflowY: 'auto',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
                padding: '40px',
                animation: 'modalEntry 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div>
                        <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.02em' }}>Account</h2>
                        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '6px', fontWeight: 500 }}>System focus & identity control</p>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-2)',
                        width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                        transition: 'all 0.2s ease'
                    }}>×</button>
                </div>

                {loading ? (
                    <div style={{ padding: '100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '32px', height: '32px', border: '3.5px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <span style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: 600 }}>Loading state...</span>
                    </div>
                ) : (
                    <div className="settings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <Section title="Profile">
                                <Row label="Name">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>
                                            {profile?.full_name || session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'Unnamed'}
                                        </span>
                                        {!isEditingProfile && (
                                            <button
                                                type="button"
                                                onClick={handleEditProfile}
                                                style={{
                                                    width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border)',
                                                    background: 'var(--bg-elevated)', color: 'var(--text-2)', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                                                }}
                                                aria-label="Edit profile"
                                            >
                                                ✎
                                            </button>
                                        )}
                                    </div>
                                </Row>
                                <Row label="Timezone" border={false}>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>
                                        {profile?.timezone || session?.user?.user_metadata?.timezone || 'Asia/Kolkata'}
                                    </span>
                                </Row>
                                {isEditingProfile && (
                                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.1)', borderTop: '1px solid var(--border)' }}>
                                        <input
                                            value={draftProfile?.full_name || ''}
                                            onChange={e => setDraftProfile(p => ({ ...p, full_name: e.target.value }))}
                                            placeholder="Full name"
                                            style={{
                                                padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
                                                border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                                                color: 'var(--text-1)', width: '100%', outline: 'none', fontWeight: 600
                                            }}
                                        />
                                        <select
                                            value={draftProfile?.timezone || 'Asia/Kolkata'}
                                            onChange={e => setDraftProfile(p => ({ ...p, timezone: e.target.value }))}
                                            style={{
                                                padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
                                                border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                                                color: 'var(--text-1)', cursor: 'pointer', outline: 'none', width: '100%', fontWeight: 600
                                            }}
                                        >
                                            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                        </select>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <button onClick={handleSaveProfile} disabled={saving} style={{
                                                flex: 1, padding: '12px', background: 'var(--accent)', color: 'white',
                                                border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 800,
                                                cursor: 'pointer', opacity: saving ? 0.7 : 1
                                            }}>
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button onClick={handleCancelEdit} disabled={saving} style={{
                                                padding: '12px 14px', background: 'var(--bg-elevated)', color: 'var(--text-2)',
                                                border: '1px solid var(--border)', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                                                cursor: 'pointer'
                                            }}>
                                                Cancel
                                            </button>
                                            {saveMsg && <span style={{ fontSize: '13px', color: saveMsg.includes('fail') ? 'var(--danger)' : '#22c55e', fontWeight: 700 }}>{saveMsg}</span>}
                                        </div>
                                    </div>
                                )}
                            </Section>

                            <Section title="Change Password">
                                <ChangePassword session={session} />
                            </Section>

                            <Section title="Data Strategy">
                                <div style={{ padding: '24px' }}>
                                    <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 800, marginBottom: '6px' }}>Behavioral Archive</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '20px', lineHeight: 1.5, fontWeight: 500 }}>Download a complete high-fidelity JSON snapshot of your behavioral history.</div>
                                    <button onClick={handleExport} disabled={exporting} style={{
                                        width: '100%', padding: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                        borderRadius: '12px', fontSize: '13px', fontWeight: 800, color: 'var(--text-1)', cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        {exporting ? 'Compiling JSON...' : 'Export All Data'}
                                    </button>
                                </div>
                            </Section>

                            <Section title="Danger Zone">
                                <div style={{ padding: '24px' }}>
                                    <div style={{ fontSize: '14px', color: 'var(--danger)', fontWeight: 800, marginBottom: '6px' }}>Terminate Account</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '20px', lineHeight: 1.5, fontWeight: 500 }}>Permanently purge all identity and behavior data. This is irreversible.</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <input
                                            value={deleteConfirm}
                                            onChange={e => setDeleteConfirm(e.target.value)}
                                            placeholder="Type DELETE to purge"
                                            style={{
                                                padding: '12px', borderRadius: '12px', fontSize: '13px',
                                                border: '1px solid rgba(235,140,140,0.4)', background: 'var(--bg-elevated)',
                                                color: 'var(--text-1)', width: '100%', outline: 'none',
                                                fontWeight: 800, letterSpacing: '0.05em'
                                            }}
                                            className="delete-input"
                                        />
                                        <button onClick={handleDelete} disabled={deleting || deleteConfirm !== 'DELETE'} style={{
                                            width: '100%', padding: '14px', background: deleteConfirm === 'DELETE' ? 'var(--danger)' : 'transparent',
                                            border: `1px solid ${deleteConfirm === 'DELETE' ? 'var(--danger)' : 'var(--border)'}`,
                                            borderRadius: '12px', fontSize: '14px', fontWeight: 900,
                                            color: deleteConfirm === 'DELETE' ? '#fff' : 'var(--text-3)',
                                            cursor: 'pointer', opacity: (deleting || deleteConfirm !== 'DELETE') ? 0.5 : 1, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}>
                                            {deleting ? 'Purging Identity...' : 'Confirm Destruction'}
                                        </button>
                                    </div>
                                </div>
                            </Section>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px', // 16px spacing as requested
                                marginTop: '16px',
                                padding: '12px 0 20px'
                            }}>
                                <button onClick={signOut} style={{
                                    width: '100%', padding: '16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                    borderRadius: '16px', fontSize: '15px', fontWeight: 900, color: 'var(--text-2)',
                                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <span style={{ fontSize: '18px' }}>🚪</span> Sign Out of AIIMIN
                                </button>

                                <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    AIIMIN OS v1.0.4 — Behavior Shaping System
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body // Portal target
    );
};

export default AccountModal;

