import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { apiDelete } from '../utils/api';
import toast from '../utils/toast';
import { useMockData } from '../providers/MockDataProvider';
import { exportUserData } from '../utils/exportUserData';
import { supabase } from '../utils/supabase';
import {
  User, Palette, Bell, Shield, Database, Activity,
  Globe, Lock, ChevronRight, Check, X, Edit2,
  Download, Trash2, Eye, EyeOff
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';



// ── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children, accent }) => (
  <div style={{
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '24px',
    overflow: 'hidden',
  }}>
    <div style={{
      padding: '20px 24px',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex', alignItems: 'center', gap: '12px',
      background: 'var(--color-elevated)',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: `${accent || 'var(--color-accent)'}18`,
        color: accent || 'var(--color-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} />
      </div>
      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-1)', letterSpacing: '-0.01em' }}>{title}</div>
    </div>
    <div style={{ padding: '24px' }}>{children}</div>
  </div>
);

// ── Row inside a section ─────────────────────────────────────────────────────
const Row = ({ label, desc, control, danger }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 0', borderBottom: '1px solid var(--color-border)',
    gap: '16px',
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '14px', fontWeight: 700, color: danger ? '#ef4444' : 'var(--color-text-1)', marginBottom: '2px' }}>{label}</div>
      {desc && <div style={{ fontSize: '12px', color: 'var(--color-text-3)', lineHeight: 1.4 }}>{desc}</div>}
    </div>
    <div style={{ flexShrink: 0 }}>{control}</div>
  </div>
);

const TogglePill = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} style={{
    width: '46px', height: '26px', borderRadius: '13px',
    background: checked ? 'var(--color-accent)' : 'var(--color-border)',
    border: 'none', cursor: 'pointer', position: 'relative',
    transition: 'background 0.2s',
  }}>
    <div style={{
      width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
      position: 'absolute', top: '3px',
      left: checked ? '23px' : '3px',
      transition: 'left 0.2s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    }} />
  </button>
);

// ── Stat mini card ───────────────────────────────────────────────────────────
const StatMini = ({ icon, value, label, color }) => (
  <div style={{
    background: 'var(--color-elevated)', borderRadius: '16px', padding: '16px',
    display: 'flex', flexDirection: 'column', gap: '6px',
    border: '1px solid var(--color-border)',
  }}>
    <div style={{ fontSize: '20px' }}>{icon}</div>
    <div style={{ fontSize: '22px', fontWeight: 900, color: color || 'var(--color-text-1)', letterSpacing: '-0.02em' }}>{value}</div>
    <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-3)' }}>{label}</div>
  </div>
);

const THEMES = [
  { id: 'normal', label: 'Normal', colors: ['#FAFAF9', '#1A1A1A', '#1E5C3A'], dark: false },
  { id: 'dark', label: 'Dark', colors: ['#0A0A0A', '#EDEDED', '#22C55E'], dark: true },
  { id: 'notion', label: 'Notion', colors: ['#FFFFFF', '#37352F', '#EBEBEA'], dark: false },
  { id: 'internet', label: 'Internet', colors: ['#0A0D10', '#00F0FF', '#161B22'], dark: true },
];

/**
 * Settings/Account Page — Full featured with profile, themes, stats, integrations, privacy.
 */
const Settings = () => {
  const { user, session } = useAuth();
  const { theme, setTheme } = useThemeContext();
  const [notifReminders, setNotifReminders] = useState(() => localStorage.getItem('aiimin_notif_reminders') === 'true');
  const [notifInsights, setNotifInsights] = useState(() => localStorage.getItem('aiimin_notif_insights') === 'true');
  const [notifSports, setNotifSports] = useState(() => localStorage.getItem('aiimin_notif_sports') === 'true');
  const { isUsingMock, mockData } = useMockData() || {};

  // Password change
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Username editing
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState((user?.user_metadata?.username || user?.email?.split('@')[0] || 'User').toUpperCase());

  // Account stats (simulated from localStorage + session)
  const focusMins = parseInt(localStorage.getItem('aiimin_focus_mins') || '0', 10);
  const focusSessions = parseInt(localStorage.getItem('aiimin_focus_today') || '0', 10);

  const joinedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const daysSinceJoin = user?.created_at ? Math.floor((Date.now() - new Date(user.created_at)) / 86400000) : 0;

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
    } catch {
      toast.update(tid, 'Export failed', 'error');
    }
  }, [session, isUsingMock, mockData]);

    // Password updates are now handled by Clerk
    const handleNameSave = () => {
        toast.error("Please update your name via your profile avatar.");
    };
  const handleDeleteAllData = useCallback(async () => {
    if (!window.confirm('This will wipe all your tracked data but KEEP your account. Proceed?')) return;
    const input = window.prompt('Type "wipe data" to confirm:');
    if (input !== 'wipe data') { toast.error('Deletion cancelled.'); return; }
    const tid = toast.loading('Deleting all data...');
    try {
      const userId = user.id;
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
      toast.update(tid, 'All data deleted', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.update(tid, 'Failed: ' + err.message, 'error');
    }
  }, [user]);

  const handleDeleteAccount = useCallback(async () => {
    if (!window.confirm('This will PERMANENTLY delete everything. Proceed?')) return;
    const input = window.prompt(`Type "delete ${user.email}" to confirm:`);
    if (input !== `delete ${user.email}`) { toast.error('Cancelled.'); return; }
    const tid = toast.loading('Deleting account...');
    try {
      await apiDelete('/account', { confirm: 'DELETE' }, { session });
      toast.update(tid, 'Account deleted', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast.update(tid, 'Delete failed', 'error');
    }
  }, [session, user]);

  if (!user) return null;

  return (
    <div className="page-container">
      {/* Header */}
      <PageHeader 
        title={nameVal}
        subtitle="Account Settings"
        rightContent={
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px',
            background: 'linear-gradient(135deg, var(--color-accent), #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: 900, color: '#fff',
            flexShrink: 0,
            boxShadow: 'var(--shadow-md)'
          }}>
            {(nameVal?.[0] || 'A').toUpperCase()}
          </div>
        }
      />

      {/* Account Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <StatMini icon="📅" value={joinedDate.split(' ')[2] || '2026'} label="Member Since" color="var(--color-accent)" />
        <StatMini icon="⚡" value={`${daysSinceJoin}d`} label="Days Active" color="#F59E0B" />
        <StatMini icon="🎯" value={`${focusMins}m`} label="Focus Time" color="#3B82F6" />
        <StatMini icon="🔥" value={focusSessions} label="Sessions" color="#EF4444" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Profile ─────────────────────────────────────────────────────── */}
        <Section icon={User} title="Profile" accent="#10B981">
          <Row
            label="Display Name"
            desc="Your name shown across the dashboard"
            control={
              editingName ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input value={nameVal} onChange={e => setNameVal(e.target.value.toUpperCase().replace(/[^A-Z0-9_.-]/g, '').slice(0, 20))} autoFocus
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-accent)', background: 'var(--color-elevated)', color: 'var(--color-text-1)', fontSize: '13px', outline: 'none', fontFamily: 'inherit', width: '160px' }}
                    onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                  />
                  <button onClick={handleNameSave} style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--color-accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Save</button>
                  <button onClick={() => setEditingName(false)} style={{ padding: '6px', borderRadius: '8px', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', cursor: 'pointer', color: 'var(--color-text-3)' }}><X size={14} /></button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-2)' }}>{nameVal}</span>
                  <button onClick={() => setEditingName(true)} style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', cursor: 'pointer', color: 'var(--color-text-2)', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Edit2 size={12} /> Edit
                  </button>
                </div>
              )
            }
          />
          <Row
            label="Email"
            desc="Your Supabase account email"
            control={<span style={{ fontSize: '13px', color: 'var(--color-text-3)', fontWeight: 600 }}>{user.email}</span>}
          />
          <Row
            label="Account Type"
            desc={isAdmin ? 'Full admin access to all system controls' : 'Personal account with full feature access'}
            control={
              <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 800, background: isAdmin ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.12)', color: isAdmin ? '#F59E0B' : 'var(--color-accent)' }}>
                {isAdmin ? '⚡ Admin' : '✓ Member'}
              </span>
            }
          />
          <Row
            label="Guided Introduction"
            desc="Take a guided walkthrough of the whole website and its key features"
            control={
              <button 
                onClick={() => {
                  localStorage.removeItem('aiimin_tour_completed');
                  toast.success('Onboarding tour reset! Starting from Overview...');
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('aiimin:goto', { detail: '/overview' }));
                    window.location.reload();
                  }, 1000);
                }} 
                style={{ 
                  padding: '8px 14px', 
                  borderRadius: '10px', 
                  background: 'var(--color-elevated)', 
                  color: 'var(--color-accent)', 
                  border: '1px solid var(--color-border)', 
                  fontSize: '12px', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                Take Tour Again
              </button>
            }
          />
          <div style={{ paddingTop: '24px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.5, marginBottom: '20px' }}>
              Security and authentication are now powered by Clerk. To update your password, email, or linked accounts, click your profile avatar in the navigation bar.
            </p>
          </div>
        </Section>

        {/* ── Appearance ──────────────────────────────────────────────────── */}
        <Section icon={Palette} title="Appearance" accent="#8B5CF6">
          <div style={{ fontSize: '12px', color: 'var(--color-text-3)', marginBottom: '16px' }}>
            Choose a theme. Applied instantly across the entire dashboard.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {THEMES.map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)} style={{
                border: `2px solid ${theme === t.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: '16px', padding: '14px', cursor: 'pointer',
                background: theme === t.id ? 'var(--color-accent-dim)' : 'var(--color-elevated)',
                transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start',
              }}>
                {/* Color swatches */}
                <div style={{ display: 'flex', gap: '5px' }}>
                  {t.colors.map((c, ci) => (
                    <div key={ci} style={{ width: '18px', height: '18px', borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.15)' }} />
                  ))}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-1)', textAlign: 'left' }}>{t.label}</div>
                {theme === t.id && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={11} color="#fff" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Notifications ────────────────────────────────────────────────── */}
        <Section icon={Bell} title="Notifications" accent="#F59E0B">
          <Row
            label="Daily Reminders"
            desc="Morning check-in prompts and evening reflection nudges"
            control={<TogglePill checked={notifReminders} onChange={saveAndSet('aiimin_notif_reminders', setNotifReminders)} />}
          />
          <Row
            label="Weekly Insight Digest"
            desc="Summary of behavioral patterns delivered Sunday evening"
            control={<TogglePill checked={notifInsights} onChange={saveAndSet('aiimin_notif_insights', setNotifInsights)} />}
          />
          <Row
            label="Sports Score Alerts"
            desc="Get notified when live matches update for your tracked sports"
            control={<TogglePill checked={notifSports} onChange={saveAndSet('aiimin_notif_sports', setNotifSports)} />}
          />
        </Section>

        {/* ── Integrations ─────────────────────────────────────────────────── */}
        <Section icon={Globe} title="Integrations" accent="#3B82F6">
          {[
            {
              icon: '📅',
              name: 'Google Calendar',
              desc: 'Sync your events and deadlines from Google Calendar',
              status: 'Connect via Calendar page → Connect Google',
              color: '#3B82F6',
              action: null,
            },
            {
              icon: '🏏',
              name: 'ESPN Sports Data',
              desc: 'Live cricket, football, F1, and basketball scores',
              status: 'Active',
              color: '#10B981',
              active: true,
            },
            {
              icon: '🗄️',
              name: 'Supabase PostgreSQL',
              desc: 'All data stored securely in your personal database',
              status: 'Connected',
              color: '#10B981',
              active: true,
            },
            {
              icon: '☁️',
              name: 'Vercel Functions',
              desc: 'Serverless backend for all API calls',
              status: 'Production · Active',
              color: '#F59E0B',
              active: true,
            },
          ].map((int, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${int.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                {int.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-1)' }}>{int.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-3)', marginTop: '2px' }}>{int.desc}</div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '99px',
                background: int.active ? 'rgba(16,185,129,0.12)' : 'var(--color-elevated)',
                color: int.active ? '#10B981' : 'var(--color-text-3)',
                border: `1px solid ${int.active ? 'rgba(16,185,129,0.2)' : 'var(--color-border)'}`,
                whiteSpace: 'nowrap',
              }}>
                {int.status}
              </span>
            </div>
          ))}
        </Section>

        {/* ── Data & Reports ───────────────────────────────────────────────── */}
        <Section icon={Database} title="Data & Reports" accent="#10B981">
          <Row
            label="Export All Data"
            desc="Download a complete JSON backup of your logs, finances, sessions, and settings"
            control={
              <button onClick={handleExport} style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={13} /> Export
              </button>
            }
          />
          <Row
            label="View Analytics Report"
            desc="Behavioral analysis, spending trends, focus patterns, and quarterly reviews"
            control={
              <button onClick={() => window.dispatchEvent(new CustomEvent('aiimin:goto', { detail: '/analytics' }))} style={{ padding: '8px 16px', borderRadius: '10px', background: 'var(--color-elevated)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={13} /> Reports <ChevronRight size={12} />
              </button>
            }
          />
        </Section>

        {/* ── Security & Privacy ───────────────────────────────────────────── */}
        <Section icon={Shield} title="Security & Privacy" accent="#EF4444">
          <div style={{ padding: '14px', background: 'rgba(16,185,129,0.06)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.15)', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>
              <strong style={{ color: 'var(--color-text-1)' }}>Your data is secure.</strong> All traffic is encrypted (HTTPS/TLS). Passwords are hashed by Supabase Auth and never stored in plaintext.
            </div>
          </div>
          <Row
            label="Wipe All Tracked Data"
            desc="Deletes logs, finance, sessions, habits — keeps your account intact"
            danger
            control={
              <button onClick={handleDeleteAllData} style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trash2 size={13} /> Wipe Data
              </button>
            }
          />
          <div style={{ paddingTop: '4px' }}>
            <Row
              label="Delete Account"
              desc="Permanently removes your account and all associated data. This cannot be undone."
              danger
              control={
                <button onClick={handleDeleteAccount} style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <X size={13} /> Delete Account
                </button>
              }
            />
          </div>
        </Section>

        {/* ── System Info ─────────────────────────────────────────────────── */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'App Version', value: 'AIIMIN v3.1' },
            { label: 'Backend', value: 'Vercel · Hono' },
            { label: 'Database', value: 'Supabase PostgreSQL' },
          ].map((info, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-3)', marginBottom: '4px' }}>{info.label}</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-2)' }}>{info.value}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Settings;
