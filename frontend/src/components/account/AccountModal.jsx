import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // Added for Portal
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from '../../utils/toast';
import supabase from '../../utils/supabase';
import { apiDelete, apiGet, apiPatch } from '../../utils/api';
import { useThemeContext } from '../../context/ThemeContext';


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

const ChangePassword = () => {
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [msg, setMsg] = useState('');
    const [saving, setSaving] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    const handleChange = async () => {
        if (newPw.length < 6) { setMsg('Min 6 characters'); return; }
        if (newPw !== confirmPw) { setMsg('Passwords do not match'); return; }
        setSaving(true);
        setMsg('');
        const { error } = await supabase.auth.updateUser({ password: newPw });
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

    const eyeBtn = (show, toggle) => (
        <button type="button" onClick={toggle} tabIndex={-1} style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-3)', fontSize: '16px', padding: 0,
            display: 'flex', alignItems: 'center', lineHeight: 1, userSelect: 'none',
        }} aria-label={show ? 'Hide' : 'Show'}>
            {show ? '🙈' : '👁'}
        </button>
    );

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
                <input type={showNewPw ? 'text' : 'password'} placeholder="New password" value={newPw} onChange={e => setNewPw(e.target.value)} style={{ ...inputStyle, paddingRight: '40px' }} />
                {eyeBtn(showNewPw, () => setShowNewPw(p => !p))}
            </div>
            <div style={{ position: 'relative' }}>
                <input type={showConfirmPw ? 'text' : 'password'} placeholder="Confirm new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} style={{ ...inputStyle, paddingRight: '40px' }} />
                {eyeBtn(showConfirmPw, () => setShowConfirmPw(p => !p))}
            </div>
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
    const { theme, setTheme } = useThemeContext();
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
        apiGet('/account/profile', { session }).then((p) => {
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
            const savedProfile = await apiPatch('/account/profile', { full_name: draftProfile.full_name }, { session });
            setProfile(savedProfile);
            setDraftProfile(savedProfile);
            setIsEditingProfile(false);
            setSaveMsg('Saved ✓');
            toast.success('Profile saved');
        } catch (err) {
            setSaveMsg('Failed to save');
            toast.error(err.response?.data?.error || err.message || 'Profile save failed');
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
            const blob = await apiGet('/account/export', { session, responseType: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aiimin-export-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Data exported successfully');
        } catch (err) { toast.error(err.message || 'Export failed'); } finally { setExporting(false); }
    };

    const handleDelete = async () => {
        if (deleteConfirm !== 'DELETE') return;
        setDeleting(true);
        try {
            await apiDelete('/account', { confirm: 'DELETE' }, { session });
            await signOut();
            window.location.reload();
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
                .settings-grid { display: block; }
                .settings-panel-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 1fr); gap: 24px; align-items: start; }
                @media (max-width: 800px) {
                    .settings-panel-grid { grid-template-columns: 1fr; }
                }
            `}</style>
            <div ref={modalRef} className="no-scrollbar" style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '28px',
                width: 'min(1080px, 94vw)',
                maxWidth: '94vw',
                maxHeight: '88vh',
                overflowY: 'auto',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
                padding: '34px',
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
                    <div className="settings-grid">
                        <div className="settings-panel-grid">
                            <Section title="Profile">
                                <Row label="Name" border={false}>
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

                            <Section title="Appearance">
                                <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                                    {[
                                        { id: 'light', label: 'Nordic', colors: ['#F0EDE8', '#FAFAF9', '#1E5C3A'], darkText: true },
                                        { id: 'dark', label: 'Vercel', colors: ['#0A0A0A', '#111111', '#22C55E'] },
                                        { id: 'notion', label: 'Studio', colors: ['#FFFFFF', '#F7F6F3', '#37352F'], darkText: true },
                                        { id: 'midnight', label: 'Midnight', colors: ['#0B1120', '#0F172A', '#38BDF8'] },
                                        { id: 'solarized', label: 'Solar', colors: ['#002B36', '#073642', '#2AA198'] },
                                        { id: 'cyberpunk', label: 'Neon', colors: ['#09090B', '#18181B', '#F43F5E'] },
                                        { id: 'monokai', label: 'Monokai', colors: ['#272822', '#3E3D32', '#A6E22E'] },
                                        { id: 'graphite', label: 'Graphite', colors: ['#151515', '#242424', '#D4AF37'] },
                                        { id: 'sakura', label: 'Sakura', colors: ['#FFF7F8', '#FCE7EB', '#BE3455'], darkText: true }
                                    ].map(t => (
                                        <div 
                                            key={t.id}
                                            onClick={() => setTheme(t.id)}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '12px',
                                                background: t.colors[0],
                                                border: `2px solid ${theme === t.id ? 'var(--color-accent)' : 'var(--border)'}`,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '10px',
                                                transition: 'all 0.2s ease',
                                                opacity: theme === t.id ? 1 : 0.82,
                                                boxShadow: theme === t.id ? '0 0 0 2px var(--color-surface)' : 'none'
                                            }}
                                        >
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', height: '28px' }}>
                                                {t.colors.map(color => <span key={color} style={{ background: color, borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)' }} />)}
                                            </div>
                                            <span style={{ fontSize: '12px', fontWeight: 800, color: t.darkText ? '#151515' : '#EEE' }}>{t.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            <Section title="Reports &amp; Analytics">
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5, fontWeight: 500 }}>
                                        View your behavioral reports, spending analysis, and quarterly reviews.
                                    </div>
                                    <Link
                                        to="/reports"
                                        onClick={onClose}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '14px 16px',
                                            background: 'var(--bg-elevated)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '12px',
                                            textDecoration: 'none',
                                            color: 'var(--text-1)',
                                            fontWeight: 700,
                                            fontSize: '14px',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <span style={{ fontSize: '18px' }}>📊</span>
                                        View Reports &amp; Analytics
                                        <span style={{ marginLeft: 'auto', color: 'var(--text-3)', fontSize: '12px' }}>→</span>
                                    </Link>
                                </div>
                            </Section>

                            <Section title="Change Password">
                                <ChangePassword />
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
                                padding: '12px 0 20px',
                                gridColumn: '1 / -1'
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
                                    Account settings · Theme saved locally · Secure session active
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
