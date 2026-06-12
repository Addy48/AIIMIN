import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from '../utils/toast';
import supabase from '../utils/supabase';
import { apiDelete, apiGet, apiPatch } from '../utils/api';
import { useThemeContext } from '../context/ThemeContext';
import PageHeader from '../components/layout/PageHeader';

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

const UnauthenticatedView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--bg-elevated)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '32px' }}>🔒</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '12px' }}>Authentication Required</h2>
        <p style={{ fontSize: '15px', color: 'var(--text-3)', maxWidth: '400px', lineHeight: 1.6, marginBottom: '32px', fontWeight: 500 }}>
            You need to be logged in to view and manage your account settings, themes, and data exports.
        </p>
        <Link to="/login" style={{
            padding: '14px 32px',
            background: 'var(--text-1)',
            color: 'var(--bg-primary)',
            textDecoration: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 800,
            transition: 'transform 0.2s, opacity 0.2s',
        }}>
            Sign In to AIIMIN
        </Link>
    </div>
);

export default function AccountPage() {
    const { session, signOut } = useAuth();
    const { theme, userTheme, defaultLightTheme, defaultDarkTheme, setTheme, setDefaultLightTheme, setDefaultDarkTheme } = useThemeContext();
    const [profile, setProfile] = useState(null);
    const [draftProfile, setDraftProfile] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [exporting, setExporting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [execWindow, setExecWindow] = useState(() => {
        return Number(localStorage.getItem('aiimin_execution_window')) || 61;
    });

    useEffect(() => {
        if (!session) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000));
        const fetchPromise = apiGet('/account/profile', { session });

        Promise.race([fetchPromise, timeoutPromise]).then((p) => {
            const fallbackName = p?.full_name || p?.username || session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'User';
            const fallbackTimezone = p?.timezone || session?.user?.user_metadata?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
            const normalizedProfile = { ...p, full_name: fallbackName, username: p?.username || '', timezone: fallbackTimezone };
            setProfile(normalizedProfile);
            setDraftProfile(normalizedProfile);
        }).catch(err => {
            console.warn('[AccountPage] fetch error/timeout:', err);
            const fallbackName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'User';
            const fallbackTimezone = session?.user?.user_metadata?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
            const normalizedProfile = { full_name: fallbackName, username: '', timezone: fallbackTimezone };
            setProfile(normalizedProfile);
            setDraftProfile(normalizedProfile);
        }).finally(() => setLoading(false));
    }, [session]);

    const handleSaveProfile = async () => {
        if (!draftProfile) return;
        setSaving(true);
        setSaveMsg('');
        try {
            const savedProfile = await apiPatch('/account/profile', { full_name: draftProfile.full_name, username: draftProfile.username, timezone: draftProfile.timezone }, { session });
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

    return (
        <div className="page-container">
            <style>{`
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

            <PageHeader 
                title="Account" 
                subtitle="System focus & identity control"
            />

            {loading ? (
                <div style={{ padding: '100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '32px', height: '32px', border: '3.5px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: 600 }}>Loading state...</span>
                </div>
            ) : !session ? (
                <UnauthenticatedView />
            ) : (
                <div className="settings-grid">
                    {/* Account Overview Dashboard */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        <div style={{ background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.02) 100%)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '20px', borderRadius: '24px' }}>
                            <div style={{ fontSize: '13px', color: 'var(--color-text-2)', fontWeight: 600, marginBottom: '8px' }}>Execution Window</div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-1)' }}>{execWindow} <span style={{fontSize: '14px', color:'var(--color-text-3)'}}>Days</span></div>
                        </div>
                        <div style={{ background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '20px', borderRadius: '24px' }}>
                            <div style={{ fontSize: '13px', color: 'var(--color-text-2)', fontWeight: 600, marginBottom: '8px' }}>Security Status</div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={24} color="#3b82f6"/> Protected
                            </div>
                        </div>
                        <div style={{ background: 'linear-gradient(145deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.02) 100%)', border: '1px solid rgba(168, 85, 247, 0.2)', padding: '20px', borderRadius: '24px' }}>
                            <div style={{ fontSize: '13px', color: 'var(--color-text-2)', fontWeight: 600, marginBottom: '8px' }}>Timezone</div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-1)' }}>{profile?.timezone || 'Auto'}</div>
                        </div>
                    </div>

                    <div className="settings-panel-grid">
                        <Section title="Profile">
                            <Row label="Name" border={true}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>
                                        {profile?.full_name || profile?.username || session?.user?.email?.split('@')[0] || 'User'}
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
                            <Row label="Username" border={true}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)' }}>
                                    {profile?.username ? `@${profile.username}` : 'Not set'}
                                </span>
                            </Row>
                            <Row label="Timezone" border={true}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)' }}>
                                    {profile?.timezone || 'Auto-detected'}
                                </span>
                            </Row>
                            <Row label="Execution Timeline" border={false}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max="365"
                                        value={execWindow} 
                                        onChange={e => {
                                            const val = Math.max(1, Math.min(365, Number(e.target.value) || 61));
                                            setExecWindow(val);
                                            localStorage.setItem('aiimin_execution_window', val.toString());
                                            window.dispatchEvent(new Event('storage'));
                                        }}
                                        style={{
                                            width: '60px',
                                            padding: '6px 10px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--bg-elevated)',
                                            color: 'var(--text-1)',
                                            textAlign: 'center',
                                            fontWeight: 700,
                                            fontSize: '13px',
                                            outline: 'none'
                                        }}
                                    />
                                    <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600 }}>Days</span>
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
                                    <input
                                        value={draftProfile?.username || ''}
                                        onChange={e => setDraftProfile(p => ({ ...p, username: e.target.value.toUpperCase().replace(/[^A-Z0-9_.-]/g, '').slice(0, 20) }))}
                                        placeholder="Username (e.g. HASMAT99)"
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
                                            color: 'var(--text-1)', width: '100%', outline: 'none', fontWeight: 600,
                                            appearance: 'none'
                                        }}
                                    >
                                        <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>System Default ({Intl.DateTimeFormat().resolvedOptions().timeZone})</option>
                                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                        <option value="America/New_York">America/New_York (EST/EDT)</option>
                                        <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                                        <option value="Europe/London">Europe/London (GMT/BST)</option>
                                        <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                                        <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                        <option value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</option>
                                    </select>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
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
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                
                                {/* Current Theme */}
                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-2)' }}>Current Theme</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                                        {[
                                            { id: 'nordic', label: 'Nordic', colors: ['#F0EDE8', '#FAFAF9', '#1E5C3A'], darkText: true },
                                            { id: 'vercel', label: 'Vercel', colors: ['#0A0A0A', '#111111', '#22C55E'] },
                                            { id: 'studio', label: 'Studio', colors: ['#FFFFFF', '#F7F6F3', '#37352F'], darkText: true },
                                            { id: 'midnight', label: 'Midnight', colors: ['#0B1120', '#0F172A', '#38BDF8'] }
                                        ].map(t => (
                                            <div 
                                                key={t.id}
                                                onClick={() => setTheme(t.id)}
                                                style={{
                                                    padding: '16px',
                                                    borderRadius: '16px',
                                                    background: t.colors[0],
                                                    border: `2px solid ${userTheme === t.id ? 'var(--color-accent)' : 'var(--border)'}`,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '12px',
                                                    transition: 'all 0.2s ease',
                                                    opacity: userTheme === t.id ? 1 : 0.82,
                                                    boxShadow: userTheme === t.id ? '0 0 0 4px var(--color-surface)' : 'none'
                                                }}
                                            >
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', height: '36px' }}>
                                                    {t.colors.map(color => <span key={color} style={{ background: color, borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }} />)}
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: 800, color: t.darkText ? '#151515' : '#EEE' }}>{t.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Default Light Theme */}
                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-2)' }}>Default Light Theme</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                                        {[
                                            { id: 'nordic', label: 'Nordic', colors: ['#F0EDE8', '#FAFAF9', '#1E5C3A'], darkText: true },
                                            { id: 'studio', label: 'Studio', colors: ['#FFFFFF', '#F7F6F3', '#37352F'], darkText: true }
                                        ].map(t => (
                                            <div 
                                                key={`light-${t.id}`}
                                                onClick={() => setDefaultLightTheme(t.id)}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    background: t.colors[0],
                                                    border: `2px solid ${defaultLightTheme === t.id ? 'var(--color-accent)' : 'var(--border)'}`,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    transition: 'all 0.2s ease',
                                                    opacity: defaultLightTheme === t.id ? 1 : 0.7
                                                }}
                                            >
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <span style={{ width: '16px', height: '16px', background: t.colors[2], borderRadius: '4px' }} />
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: 700, color: t.darkText ? '#151515' : '#EEE' }}>{t.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Default Dark Theme */}
                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-2)' }}>Default Dark Theme</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                                        {[
                                            { id: 'vercel', label: 'Vercel', colors: ['#0A0A0A', '#111111', '#22C55E'] },
                                            { id: 'midnight', label: 'Midnight', colors: ['#0B1120', '#0F172A', '#38BDF8'] }
                                        ].map(t => (
                                            <div 
                                                key={`dark-${t.id}`}
                                                onClick={() => setDefaultDarkTheme(t.id)}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    background: t.colors[0],
                                                    border: `2px solid ${defaultDarkTheme === t.id ? 'var(--color-accent)' : 'var(--border)'}`,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    transition: 'all 0.2s ease',
                                                    opacity: defaultDarkTheme === t.id ? 1 : 0.7
                                                }}
                                            >
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <span style={{ width: '16px', height: '16px', background: t.colors[2], borderRadius: '4px' }} />
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#EEE' }}>{t.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="Reports &amp; Analytics">
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5, fontWeight: 500 }}>
                                    View your behavioral reports, spending analysis, and quarterly reviews.
                                </div>
                                <Link
                                    to="/reports"
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

                        <Section title="Preferences & Notifications">
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>Daily Summary Email</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Get a morning brief of your goals and schedule.</div>
                                    </div>
                                    <div style={{ width: '40px', height: '24px', background: 'var(--color-accent)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                                        <div style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%' }} />
                                    </div>
                                </div>
                                <div style={{ height: '1px', background: 'var(--border)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>Push Notifications</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Real-time alerts for habits and meetings.</div>
                                    </div>
                                    <div style={{ width: '40px', height: '24px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                                        <div style={{ position: 'absolute', top: '1px', left: '2px', width: '18px', height: '18px', background: 'var(--text-3)', borderRadius: '50%' }} />
                                    </div>
                                </div>
                                <div style={{ height: '1px', background: 'var(--border)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>24-Hour Time Format</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Use 24-hour clock (e.g. 14:00) instead of AM/PM.</div>
                                    </div>
                                    <div style={{ width: '40px', height: '24px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                                        <div style={{ position: 'absolute', top: '1px', left: '2px', width: '18px', height: '18px', background: 'var(--text-3)', borderRadius: '50%' }} />
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="Storage Usage">
                            <div style={{ padding: '24px', background: 'var(--bg-elevated)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>1.2 GB / 5.0 GB Used</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>24%</div>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                                    <div style={{ width: '24%', height: '100%', background: 'var(--color-accent)', borderRadius: '4px' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-3)' }}>
                                    <span>Documents: 800 MB</span>
                                    <span>Photos: 350 MB</span>
                                    <span>Other: 50 MB</span>
                                </div>
                            </div>
                        </Section>

                        <Section title="Active Sessions">
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-elevated)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ fontSize: '24px' }}>💻</div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>MacBook Pro (Mac OS)</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Chrome • New York, USA</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '8px' }}>
                                        Current Session
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-elevated)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ fontSize: '24px' }}>📱</div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>iPhone 14 Pro (iOS)</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Safari • New York, USA</div>
                                        </div>
                                    </div>
                                    <button style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-2)', background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                                        Revoke
                                    </button>
                                </div>
                            </div>
                        </Section>

                        <Section title="Subscription & Billing">
                            <div style={{ padding: '24px', background: 'var(--bg-elevated)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px' }}>
                                            ✦
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-1)' }}>Free Tier</div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '2px', fontWeight: 500 }}>Basic access to AIIMIN features.</div>
                                        </div>
                                    </div>
                                    <div style={{ background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 800, color: 'var(--color-accent)', border: '1px solid var(--border)' }}>
                                        Active
                                    </div>
                                </div>
                                <button onClick={() => setShowPricingModal(true)} style={{
                                    width: '100%', padding: '14px', background: 'var(--text-1)', color: 'var(--bg-primary)',
                                    border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}>
                                    Upgrade to PRO
                                </button>
                            </div>
                        </Section>

                        <Section title="Connected Accounts">
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-elevated)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>Google</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>Connected</div>
                                        </div>
                                    </div>
                                    <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-2)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Disconnect</button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-surface)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', background: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>Facebook</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>Not connected</div>
                                        </div>
                                    </div>
                                    <button style={{ padding: '8px 16px', background: 'var(--text-1)', border: 'none', borderRadius: '8px', color: 'var(--bg-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Connect</button>
                                </div>
                            </div>
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

                        {profile?.username === 'AU48' && (
                            <Section title="Admin: Release Versions">
                                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[
                                        { version: 'v1.0.4', build: 'Build 4810', date: 'June 12, 2026', changes: ['Fixed OS-ID validation rules', 'Resolved back button duplication', 'Enhanced typing practice'] },
                                        { version: 'v1.0.3', build: 'Build 4792', date: 'June 11, 2026', changes: ['Implemented split-layout login', 'Added onboarding flow', 'Fixed auth redirects'] },
                                        { version: 'v1.0.2', build: 'Build 4621', date: 'June 05, 2026', changes: ['Added 24-hour time format', 'Updated storage visualizer', 'Bug fixes in Focus Room'] },
                                        { version: 'v1.0.1', build: 'Build 4510', date: 'May 30, 2026', changes: ['Initial Beta Release', 'Core modules integrated', 'Identity & Habits stable'] }
                                    ].map((release, i) => (
                                        <div key={i} style={{ padding: '16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>{release.version}</span>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-alpha)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--accent)' }}>{release.build}</span>
                                                </div>
                                                <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{release.date}</span>
                                            </div>
                                            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-2)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                {release.changes.map((change, j) => <li key={j}>{change}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
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
                                Account settings · Theme saved locally · Secure session active<br/>
                                <span style={{ marginTop: '8px', display: 'block', color: 'var(--text-3)', opacity: 0.7 }}>AIIMIN v1.0.4 (Build 4810)</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {showPricingModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px', animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: '24px', width: '100%', maxWidth: '440px',
                        padding: '32px', position: 'relative', 
                        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
                        overflow: 'hidden', margin: 'auto'
                    }}>
                        {/* Background glow effects */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '120px', background: 'linear-gradient(180deg, var(--accent-alpha) 0%, transparent 100%)', zIndex: 0, pointerEvents: 'none', opacity: 0.5 }} />

                        <button 
                            onClick={() => setShowPricingModal(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-2)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'all 0.2s', fontSize: '14px' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-2)'; }}
                        >✕</button>
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '99px', color: 'var(--text-1)', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--accent)' }}>✦</span> AIIMIN PRO
                                </div>
                                <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '8px', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Elevate Your System</h2>
                                <p style={{ fontSize: '14px', color: 'var(--text-3)', margin: '0 auto', lineHeight: 1.5, fontWeight: 500 }}>Unlock unbounded data, deep AI analytics, and premium integrations to maximize your potential.</p>
                            </div>

                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '28px' }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {[
                                        { title: 'Unlimited Workspaces', desc: 'Create as many projects and goals as you need.' },
                                        { title: 'Advanced AI Analytics', desc: 'Get deep insights into your habits and performance.' },
                                        { title: '1TB Cloud Vault', desc: 'Secure, encrypted storage for your files and data.' },
                                        { title: 'Custom Workflows', desc: 'Automate your daily routines and systems.' },
                                        { title: 'Priority Support', desc: '24/7 dedicated assistance from our team.' }
                                    ].map((item, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <div style={{ color: 'var(--accent)', marginTop: '2px', background: 'var(--accent-alpha)', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div> 
                                            <div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 700, marginBottom: '2px' }}>{item.title}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{item.desc}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button onClick={() => toast.info('Coming soon! Premium subscriptions are disabled in this build.')} style={{ width: '100%', padding: '16px', background: 'var(--text-1)', border: 'none', color: 'var(--bg-primary)', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}>
                                    Upgrade to Pro — $40 / yr
                                </button>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => toast.info('Coming soon! Premium subscriptions are disabled in this build.')} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-1)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}>Monthly ($5)</button>
                                    <button onClick={() => toast.info('Coming soon! Premium subscriptions are disabled in this build.')} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-1)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}>Lifetime ($85)</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
