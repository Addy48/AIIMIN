import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from '../../utils/toast';
import supabase from '../../utils/supabase';
import { apiDelete, apiGet, apiPatch } from '../../utils/api';

const Section = ({ title, children }) => (
    <div style={{ marginBottom: '20px' }}>
        <div style={{
            font: '500 11px/1 var(--font-mono)',
            color: 'var(--color-text-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '10px',
            paddingLeft: '2px',
        }}>
            {title}
        </div>
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--r-md)',
            overflow: 'hidden',
        }}>
            {children}
        </div>
    </div>
);

const Row = ({ label, children, border = true }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', gap: '12px',
        borderBottom: border ? '1px solid var(--color-border)' : 'none',
        flexWrap: 'wrap',
    }}>
        <div style={{ font: '400 13px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{children}</div>
    </div>
);

const inputStyle = {
    padding: '10px 14px',
    borderRadius: 'var(--r-md)',
    font: '400 13px/1 var(--font-sans)',
    border: '1px solid var(--color-border)',
    background: 'var(--color-elevated)',
    color: 'var(--color-text-1)',
    width: '100%',
    outline: 'none',
};

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
        else { setMsg('Password updated'); setNewPw(''); setConfirmPw(''); }
        setSaving(false);
        setTimeout(() => setMsg(''), 4000);
    };

    const EyeBtn = ({ show, toggle }) => (
        <button type="button" onClick={toggle} tabIndex={-1} style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-3)', padding: 0,
            display: 'flex', alignItems: 'center', lineHeight: 1, userSelect: 'none',
        }} aria-label={show ? 'Hide' : 'Show'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {show
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                }
            </svg>
        </button>
    );

    return (
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
                <input type={showNewPw ? 'text' : 'password'} placeholder="New password" value={newPw} onChange={e => setNewPw(e.target.value)} style={{ ...inputStyle, paddingRight: '40px' }} />
                <EyeBtn show={showNewPw} toggle={() => setShowNewPw(p => !p)} />
            </div>
            <div style={{ position: 'relative' }}>
                <input type={showConfirmPw ? 'text' : 'password'} placeholder="Confirm new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} style={{ ...inputStyle, paddingRight: '40px' }} />
                <EyeBtn show={showConfirmPw} toggle={() => setShowConfirmPw(p => !p)} />
            </div>
            {msg && (
                <div style={{
                    font: '400 12px/1 var(--font-sans)',
                    color: msg.includes('updated') ? 'var(--color-accent)' : 'var(--color-alert-red)',
                }}>{msg}</div>
            )}
            <button onClick={handleChange} disabled={saving || !newPw || !confirmPw} style={{
                padding: '11px', background: 'var(--color-accent)', color: 'var(--color-base)', border: 'none',
                borderRadius: 'var(--r-md)', font: '500 13px/1 var(--font-sans)', cursor: 'pointer',
                opacity: (saving || !newPw || !confirmPw) ? 0.5 : 1,
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
        apiGet('/account/profile', { session }).then((p) => {
            const fallbackName = p?.full_name || session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || '';
            const fallbackTimezone = p?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
            setProfile({ ...p, full_name: fallbackName, timezone: fallbackTimezone });
            setDraftProfile({ ...p, full_name: fallbackName, timezone: fallbackTimezone });
        }).catch(err => console.error('[AccountModal] fetch error:', err))
          .finally(() => setLoading(false));
    }, [isOpen, session]);

    useEffect(() => {
        if (isOpen) {
            const orig = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = orig; };
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleSaveProfile = async () => {
        if (!draftProfile) return;
        setSaving(true); setSaveMsg('');
        try {
            const saved = await apiPatch('/account/profile', { full_name: draftProfile.full_name }, { session });
            setProfile(saved); setDraftProfile(saved);
            setIsEditingProfile(false); setSaveMsg('Saved');
            toast.success('Profile saved');
        } catch (err) {
            setSaveMsg('Failed to save');
            toast.error(err.message || 'Profile save failed');
        } finally { setSaving(false); setTimeout(() => setSaveMsg(''), 3000); }
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
            toast.success('Data exported');
        } catch (err) { toast.error('Export failed'); } finally { setExporting(false); }
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
            position: 'fixed', inset: 0,
            background: 'rgba(10,12,10,0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000000, padding: '20px',
            animation: 'fadeIn 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}>
            <style>{`
                @keyframes modalEntry {
                    0% { transform: scale(0.97) translateY(12px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            <div ref={modalRef} className="no-scrollbar" style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-lit)',
                borderRadius: 'var(--r-md)',
                width: '440px',
                maxWidth: '92vw',
                maxHeight: '88vh',
                overflowY: 'auto',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                padding: '32px',
                animation: 'modalEntry 0.4s cubic-bezier(0.16,1,0.3,1)',
                position: 'relative',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
                    <div>
                        <div style={{ font: '300 24px/1 var(--font-sans)', color: 'var(--color-text-1)', letterSpacing: '-0.02em' }}>
                            Account<span style={{ color: 'var(--color-accent)' }}>.</span>
                        </div>
                        <div style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--color-text-3)', marginTop: '6px' }}>
                            {session?.user?.email}
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'var(--color-elevated)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-2)',
                        width: '28px', height: '28px',
                        borderRadius: 'var(--r-sm)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        font: '400 16px/1 var(--font-sans)',
                    }}>×</button>
                </div>

                {loading ? (
                    <div style={{ padding: '80px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '24px', height: '24px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <Section title="Profile">
                            <Row label="Name" border={false}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ font: '400 13px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>
                                        {profile?.full_name || session?.user?.email?.split('@')[0] || '—'}
                                    </span>
                                    {!isEditingProfile && (
                                        <button onClick={() => { setDraftProfile(profile); setIsEditingProfile(true); setSaveMsg(''); }}
                                            style={{
                                                width: '26px', height: '26px',
                                                borderRadius: 'var(--r-sm)',
                                                border: '1px solid var(--color-border)',
                                                background: 'var(--color-elevated)',
                                                color: 'var(--color-text-2)',
                                                cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }} aria-label="Edit name">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </Row>
                            {isEditingProfile && (
                                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--color-border)' }}>
                                    <input
                                        value={draftProfile?.full_name || ''}
                                        onChange={e => setDraftProfile(p => ({ ...p, full_name: e.target.value }))}
                                        placeholder="Full name"
                                        style={inputStyle}
                                    />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={handleSaveProfile} disabled={saving} style={{
                                            flex: 1, padding: '10px',
                                            background: 'var(--color-accent)', color: 'var(--color-base)',
                                            border: 'none', borderRadius: 'var(--r-md)',
                                            font: '500 12px/1 var(--font-sans)', cursor: 'pointer',
                                            opacity: saving ? 0.7 : 1,
                                        }}>{saving ? 'Saving...' : 'Save'}</button>
                                        <button onClick={() => { setDraftProfile(profile); setIsEditingProfile(false); setSaveMsg(''); }} style={{
                                            padding: '10px 16px',
                                            background: 'var(--color-elevated)', color: 'var(--color-text-2)',
                                            border: '1px solid var(--color-border)', borderRadius: 'var(--r-md)',
                                            font: '400 12px/1 var(--font-sans)', cursor: 'pointer',
                                        }}>Cancel</button>
                                    </div>
                                    {saveMsg && (
                                        <div style={{ font: '400 11px/1 var(--font-sans)', color: saveMsg.includes('fail') ? 'var(--color-alert-red)' : 'var(--color-accent)' }}>{saveMsg}</div>
                                    )}
                                </div>
                            )}
                        </Section>

                        <Section title="Password">
                            <ChangePassword />
                        </Section>

                        <Section title="Data">
                            <div style={{ padding: '18px' }}>
                                <div style={{ font: '400 13px/1 var(--font-sans)', color: 'var(--color-text-1)', marginBottom: '4px' }}>Export your data</div>
                                <div style={{ font: '400 12px/1.5 var(--font-sans)', color: 'var(--color-text-3)', marginBottom: '14px' }}>Download a complete JSON snapshot of all your logs and history.</div>
                                <button onClick={handleExport} disabled={exporting} style={{
                                    width: '100%', padding: '10px',
                                    background: 'var(--color-elevated)',
                                    border: '1px solid var(--color-border-lit)',
                                    borderRadius: 'var(--r-md)',
                                    font: '500 11px/1 var(--font-mono)', color: 'var(--color-text-1)',
                                    cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em',
                                }}>
                                    {exporting ? 'Exporting...' : 'Export All Data'}
                                </button>
                            </div>
                        </Section>

                        <Section title="Danger Zone">
                            <div style={{ padding: '18px' }}>
                                <div style={{ font: '400 13px/1 var(--font-sans)', color: 'var(--color-alert-red)', marginBottom: '4px' }}>Delete account</div>
                                <div style={{ font: '400 12px/1.5 var(--font-sans)', color: 'var(--color-text-3)', marginBottom: '14px' }}>Permanently removes all data. Cannot be undone.</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <input
                                        value={deleteConfirm}
                                        onChange={e => setDeleteConfirm(e.target.value)}
                                        placeholder="Type DELETE to confirm"
                                        style={{
                                            ...inputStyle,
                                            border: '1px solid rgba(224,90,90,0.3)',
                                            letterSpacing: '0.06em',
                                        }}
                                    />
                                    <button onClick={handleDelete} disabled={deleting || deleteConfirm !== 'DELETE'} style={{
                                        width: '100%', padding: '11px',
                                        background: deleteConfirm === 'DELETE' ? 'var(--color-alert-red)' : 'transparent',
                                        border: `1px solid ${deleteConfirm === 'DELETE' ? 'var(--color-alert-red)' : 'var(--color-border)'}`,
                                        borderRadius: 'var(--r-md)',
                                        font: '500 12px/1 var(--font-mono)',
                                        color: deleteConfirm === 'DELETE' ? '#fff' : 'var(--color-text-3)',
                                        cursor: 'pointer',
                                        opacity: (deleting || deleteConfirm !== 'DELETE') ? 0.5 : 1,
                                        textTransform: 'uppercase', letterSpacing: '0.06em',
                                        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                                    }}>
                                        {deleting ? 'Deleting...' : 'Delete Account'}
                                    </button>
                                </div>
                            </div>
                        </Section>

                        <button onClick={signOut} style={{
                            width: '100%', padding: '12px',
                            background: 'var(--color-elevated)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--r-md)',
                            font: '500 11px/1 var(--font-mono)',
                            color: 'var(--color-text-2)',
                            cursor: 'pointer',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                        }}>Sign Out</button>

                        <div style={{ textAlign: 'center', font: '400 10px/1 var(--font-mono)', color: 'var(--color-text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            AIIMIN v2.1 · Life OS
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default AccountModal;
