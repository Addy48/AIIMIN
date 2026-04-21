import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import toast from '../utils/toast';

const STATUS_CONFIG = {
  wishlist: { label: 'Wishlist', color: '#8C8C8C', icon: '📝' },
  applied: { label: 'Applied', color: '#556B2F', icon: '📤' },
  interview: { label: 'Interview', color: '#E2725B', icon: '👥' },
  offer: { label: 'Offer', color: '#23503B', icon: '✨' },
  rejected: { label: 'Rejected', color: '#1C1C1C', icon: '✖️' }
};

export default function Placements() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('kanban'); // kanban | resumes | trajectory
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('All');

  // Modals
  const [showAppModal, setShowAppModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // Forms
  const [appForm, setAppForm] = useState({ 
    company_name: '', 
    role_title: '', 
    status: 'wishlist', 
    resume_id: '', 
    linkedin_url: '', 
    job_post_url: '', 
    notes: '' 
  });
  const [resumeForm, setResumeForm] = useState({ title: '', target_role: '', link_url: '' });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsRes, resumesRes] = await Promise.all([
        supabase.from('job_applications').select('*').order('applied_at', { ascending: false }),
        supabase.from('resumes').select('*').order('updated_at', { ascending: false })
      ]);
      setApplications(appsRes.data || []);
      setResumes(resumesRes.data || []);
    } catch (error) {
      console.error("Placements Load Error:", error);
      toast.error("Failed to load career data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async (e) => {
    e.preventDefault();
    const tid = toast.loading('Archiving resume version...');
    try {
      const { data, error } = await supabase.from('resumes').insert([{
        user_id: user.id,
        ...resumeForm
      }]).select().single();
      
      if (error) throw error;
      setResumes([data, ...resumes]);
      setShowResumeModal(false);
      setResumeForm({ title: '', target_role: '', link_url: '' });
      toast.update(tid, 'Resume archived ✓', 'success');
    } catch (err) {
      toast.update(tid, 'Archive failed', 'error');
    }
  };

  const handleSaveApplication = async (e) => {
    e.preventDefault();
    const tid = toast.loading(editingApp ? 'Updating application...' : 'Tracking application...');
    try {
      if (editingApp) {
        const { data, error } = await supabase.from('job_applications')
          .update(appForm)
          .eq('id', editingApp.id)
          .select().single();
        if (error) throw error;
        setApplications(applications.map(a => a.id === data.id ? data : a));
      } else {
        const { data, error } = await supabase.from('job_applications').insert([{
          user_id: user.id,
          ...appForm,
          applied_at: new Date().toISOString().split('T')[0]
        }]).select().single();
        if (error) throw error;
        setApplications([data, ...applications]);
      }
      
      setShowAppModal(false);
      setEditingApp(null);
      setAppForm({ company_name: '', role_title: '', status: 'wishlist', resume_id: '', linkedin_url: '', job_post_url: '', notes: '' });
      toast.update(tid, 'Application synchronized ✓', 'success');
    } catch (err) {
      toast.update(tid, 'Sync failed', 'error');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('job_applications').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setApplications(applications.map(a => a.id === id ? { ...a, status: newStatus } : a));
      toast.success(`Moved to ${newStatus.toUpperCase()}`);
    } catch (err) {
      toast.error('Move failed');
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Abandon this application track?")) return;
    try {
      await supabase.from('job_applications').delete().eq('id', id);
      setApplications(applications.filter(a => a.id !== id));
      toast.success("Track removed");
    } catch (err) {
      toast.error("Removal failed");
    }
  };

  const roles = useMemo(() => ['All', ...new Set(applications.map(a => a.role_title))].filter(Boolean), [applications]);
  const filteredApps = useMemo(() => 
    selectedRole === 'All' ? applications : applications.filter(a => a.role_title === selectedRole)
  , [applications, selectedRole]);

  const stats = useMemo(() => {
    const total = applications.length;
    const wishlist = applications.filter(a => a.status === 'wishlist').length;
    const applied = applications.filter(a => a.status === 'applied').length;
    const interviews = applications.filter(a => a.status === 'interview').length;
    const offers = applications.filter(a => a.status === 'offer').length;
    return {
      total,
      wishlist,
      applied,
      interviews,
      offers,
      interviewRate: total > 0 ? ((interviews / (applied || 1)) * 100).toFixed(0) : 0,
      offerYield: total > 0 ? ((offers / (interviews || 1)) * 100).toFixed(0) : 0
    };
  }, [applications]);

  // Helper to format Google Drive links for iframe preview
  const getDrivePreviewUrl = (url) => {
    if (!url) return null;
    if (url.includes('drive.google.com')) {
      const idMatch = url.match(/\/d\/(.+?)\//);
      if (idMatch) return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
    return url;
  };

  return (
    <div style={{ padding: 'var(--content-pad)', maxWidth: 'var(--content-max)', margin: '0 auto', minHeight: '100vh' }}>
      {/* Header Section */}
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-rust)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>
              Career Architect / {activeTab === 'kanban' ? 'Application Engine' : activeTab === 'resumes' ? 'Resume Vault' : 'Trajectory Analysis'}
            </div>
            <h1 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'min(64px, 12vw)', 
              fontWeight: 400, 
              color: 'var(--text-1)', 
              lineHeight: '0.9',
              margin: 0,
              letterSpacing: '-0.03em'
            }}>
              Master your <span style={{ fontStyle: 'italic', color: 'var(--text-2)' }}>trajectory.</span>
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
             {['kanban', 'resumes', 'trajectory'].map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                style={{ 
                  padding: '10px 24px', 
                  borderRadius: '8px', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  background: activeTab === tab ? 'var(--text-1)' : 'transparent', 
                  color: activeTab === tab ? 'var(--bg-primary)' : 'var(--text-3)', 
                  border: 'none', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textTransform: 'capitalize'
                }}
               >
                 {tab === 'kanban' ? 'Board' : tab === 'resumes' ? 'Vault' : 'Trajectory'}
               </button>
             ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><div className="spinner" /></div>
      ) : activeTab === 'kanban' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Analytics Hub */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: 'var(--space-8)' }}>
            <div className="career-stat-card">
              <span className="stat-label">Total Applications</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="career-stat-card">
              <span className="stat-label">Interview Conversion</span>
              <span className="stat-value">{stats.interviewRate}%</span>
              <div className="stat-bar"><div style={{ width: `${stats.interviewRate}%`, background: 'var(--color-rust)' }} /></div>
            </div>
            <div className="career-stat-card">
              <span className="stat-label">Offer Yield</span>
              <span className="stat-value">{stats.offerYield}%</span>
              <div className="stat-bar"><div style={{ width: `${stats.offerYield}%`, background: 'var(--color-success)' }} /></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <button 
                onClick={() => { setEditingApp(null); setAppForm({ company_name: '', role_title: '', status: 'wishlist', resume_id: '', linkedin_url: '', job_post_url: '', notes: '' }); setShowAppModal(true); }} 
                style={{ background: 'var(--text-1)', color: 'var(--bg-primary)', border: 'none', height: '100%', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Track New Opening
              </button>
            </div>
          </div>

          {/* Filtering */}
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>Filter by Role:</span>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
              {roles.map(r => (
                <button 
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  style={{ 
                    padding: '6px 14px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    border: '1px solid',
                    borderColor: selectedRole === r ? 'var(--text-1)' : 'var(--border)',
                    background: selectedRole === r ? 'var(--text-1)' : 'var(--bg-surface)',
                    color: selectedRole === r ? 'var(--bg-primary)' : 'var(--text-2)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Kanban Board */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            overflowX: 'auto', 
            paddingBottom: '32px', 
            minHeight: '60vh',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--border) transparent'
          }}>
            {Object.keys(STATUS_CONFIG).map(statusKey => {
              const columnApps = filteredApps.filter(a => a.status === statusKey);
              const config = STATUS_CONFIG[statusKey];
              
              return (
                <div key={statusKey} style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: `2px solid ${config.color}`,
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>{config.icon}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{config.label}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: '10px' }}>
                      {columnApps.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {columnApps.map(app => (
                      <motion.div 
                        layout
                        key={app.id} 
                        className="kanban-card"
                        whileHover={{ y: -4 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-1)' }}>{app.company_name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: '2px' }}>{app.role_title}</div>
                          </div>
                          <button 
                            onClick={() => { setEditingApp(app); setAppForm(app); setShowAppModal(true); }}
                            style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }}
                          >
                            ⚙️
                          </button>
                        </div>

                        {app.notes && (
                          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '16px', fontStyle: 'italic', lineHeight: '1.4' }}>
                            "{app.notes.length > 80 ? app.notes.substring(0, 80) + '...' : app.notes}"
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                          {app.linkedin_url && <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="app-link">LinkedIn</a>}
                          {app.job_post_url && <a href={app.job_post_url} target="_blank" rel="noreferrer" className="app-link">Posting</a>}
                        </div>

                        <div className="card-actions">
                          {Object.keys(STATUS_CONFIG).filter(s => s !== statusKey).map(s => (
                            <button 
                              key={s} 
                              onClick={() => updateStatus(app.id, s)}
                              style={{ color: STATUS_CONFIG[s].color }}
                              title={`Move to ${s}`}
                            >
                              {STATUS_CONFIG[s].icon}
                            </button>
                          ))}
                          <div style={{ flex: 1 }} />
                          <button onClick={() => deleteApplication(app.id)} style={{ color: 'var(--color-rust)', opacity: 0.5 }}>🗑️</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      ) : activeTab === 'trajectory' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
          {/* Main Trajectory Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Conversion Funnel */}
            <div className="nordic-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '32px', color: 'var(--text-3)' }}>Conversion Funnel</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Wishlist', count: stats.wishlist, color: '#8C8C8C', pct: 100 },
                  { label: 'Applied', count: stats.applied, color: '#556B2F', pct: (stats.applied / (stats.total || 1)) * 100 },
                  { label: 'Interview', count: stats.interviews, color: '#E2725B', pct: (stats.interviews / (stats.total || 1)) * 100 },
                  { label: 'Offer', count: stats.offers, color: '#23503B', pct: (stats.offers / (stats.total || 1)) * 100 }
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '100px', fontSize: '12px', fontWeight: 600, color: 'var(--text-2)' }}>{step.label}</div>
                    <div style={{ flex: 1, height: '48px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${step.pct}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        style={{ height: '100%', background: step.color, opacity: 0.8 }}
                      />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: '14px', fontWeight: 700, color: step.pct > 20 ? 'white' : 'var(--text-1)' }}>
                        {step.count} <span style={{ fontSize: '10px', opacity: 0.8, marginLeft: '8px' }}>({step.pct.toFixed(0)}%)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-3)', fontStyle: 'italic' }}>
                Your current funnel efficiency from <b>Applied → Interview</b> is <b>{stats.interviewRate}%</b>. Industry average for your target roles is ~15%.
              </p>
            </div>

            {/* Preparation Scorecard */}
            <div className="nordic-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '32px', color: 'var(--text-3)' }}>Preparation Scorecard</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {[
                  { label: 'DSA/LeetCode', score: 82, color: 'var(--color-rust)' },
                  { label: 'Communication', score: 75, color: 'var(--accent)' },
                  { label: 'System Design', score: 45, color: '#23503B' }
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 16px' }}>
                      <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--bg-elevated)" strokeWidth="3" />
                        <motion.path 
                          initial={{ strokeDasharray: '0, 100' }}
                          animate={{ strokeDasharray: `${m.score}, 100` }}
                          transition={{ duration: 1.5, delay: i * 0.2 }}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" 
                          stroke={m.color} 
                          strokeWidth="3" 
                        />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: 'var(--text-1)' }}>
                        {m.score}
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-2)' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Career Strategy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
             <div className="nordic-card" style={{ 
                padding: '32px', 
                background: 'var(--color-card-dark-green)', 
                color: 'white', 
                border: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', opacity: 0.8 }}>Strategic Directive</h3>
                  <div style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', lineHeight: '1.5', marginBottom: '24px' }}>
                    "Focus on <b>System Design</b> and <b>Low Level Design</b>. Your DSA performance is top-tier, but response rates drop for Senior/L5 roles."
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px', opacity: 0.6 }}>Next Milestone</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>Mock Interview v4</span>
                      <span style={{ fontSize: '11px', opacity: 0.8 }}>3 Days Left</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '65%', height: '100%', background: 'var(--accent)' }} />
                    </div>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--accent)', filter: 'blur(60px)', opacity: 0.3 }} />
              </div>

              <div className="nordic-card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '24px' }}>Market Sentiment</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'AI/ML Roles', trend: 'UP', color: '#10B981' },
                    { label: 'Fintech Backend', trend: 'STABLE', color: '#3B82F6' },
                    { label: 'Crypto/Web3', trend: 'DOWN', color: 'var(--color-rust)' }
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{s.label}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: s.color, background: `${s.color}15`, padding: '4px 8px', borderRadius: '4px' }}>{s.trend}</span>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '4px' }}>Resume Iterations</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Targeted versions for specific roles and industries.</p>
            </div>
            <button 
              onClick={() => { setResumeForm({ title: '', target_role: '', link_url: '' }); setShowResumeModal(true); }} 
              style={{ background: 'var(--text-1)', color: 'var(--bg-primary)', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              + New Version
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
            {resumes.map(resume => (
              <div key={resume.id} className="resume-card">
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-1)', margin: 0 }}>{resume.title}</h3>
                      <div style={{ display: 'inline-block', marginTop: '8px', padding: '4px 10px', background: 'var(--accent-dim)', color: 'var(--accent)', borderRadius: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                        {resume.target_role || 'General'}
                      </div>
                    </div>
                    <button onClick={async () => { if(window.confirm('Delete this version?')){ await supabase.from('resumes').delete().eq('id', resume.id); setResumes(resumes.filter(r => r.id !== resume.id)); }}} style={{ background: 'none', border: 'none', opacity: 0.3, cursor: 'pointer' }}>❌</button>
                  </div>

                  <div className="resume-preview-container">
                    {resume.link_url ? (
                      <iframe 
                        src={getDrivePreviewUrl(resume.link_url)} 
                        style={{ width: '100%', height: '400px', border: 'none', borderRadius: '8px' }} 
                        title={resume.title}
                      />
                    ) : (
                      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '12px', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                        No Link Provided
                      </div>
                    )}
                    <div className="preview-overlay">
                      <a href={resume.link_url} target="_blank" rel="noopener noreferrer" className="preview-btn">Open Full Document ↗</a>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Updated {new Date(resume.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Application Modal */}
      <AnimatePresence>
        {showAppModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAppModal(false)} style={{ position: 'absolute', inset: 0, background: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="modal-content">
              <h2 style={{ fontSize: '28px', fontWeight: 500, fontFamily: 'var(--font-serif)', marginBottom: '32px' }}>{editingApp ? 'Update Application' : 'Track Opportunity'}</h2>
              <form onSubmit={handleSaveApplication} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label>Company Name</label>
                    <input required value={appForm.company_name} onChange={e => setAppForm({...appForm, company_name: e.target.value})} placeholder="e.g. Anthropic" />
                  </div>
                  <div className="input-group">
                    <label>Role Title</label>
                    <input required value={appForm.role_title} onChange={e => setAppForm({...appForm, role_title: e.target.value})} placeholder="e.g. AI Engineer" />
                  </div>
                </div>

                <div className="input-group">
                  <label>Status</label>
                  <select value={appForm.status} onChange={e => setAppForm({...appForm, status: e.target.value})}>
                    {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label>Associated Resume</label>
                  <select value={appForm.resume_id} onChange={e => setAppForm({...appForm, resume_id: e.target.value})}>
                    <option value="">None Linked</option>
                    {resumes.map(r => <option key={r.id} value={r.id}>{r.title} ({r.target_role})</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label>LinkedIn URL</label>
                    <input value={appForm.linkedin_url || ''} onChange={e => setAppForm({...appForm, linkedin_url: e.target.value})} placeholder="https://..." />
                  </div>
                  <div className="input-group">
                    <label>Job Post URL</label>
                    <input value={appForm.job_post_url || ''} onChange={e => setAppForm({...appForm, job_post_url: e.target.value})} placeholder="https://..." />
                  </div>
                </div>

                <div className="input-group">
                  <label>Strategy Notes</label>
                  <textarea rows={3} value={appForm.notes || ''} onChange={e => setAppForm({...appForm, notes: e.target.value})} placeholder="Key points to mention, research notes..." />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button type="button" onClick={() => setShowAppModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Synchronize Track</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Resume Modal */}
      <AnimatePresence>
        {showResumeModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowResumeModal(false)} style={{ position: 'absolute', inset: 0, background: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="modal-content" style={{ maxWidth: '440px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 500, fontFamily: 'var(--font-serif)', marginBottom: '32px' }}>Archive Version</h2>
              <form onSubmit={handleCreateResume} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="input-group">
                  <label>Version Descriptor</label>
                  <input required value={resumeForm.title} onChange={e => setResumeForm({...resumeForm, title: e.target.value})} placeholder="e.g. Fintech SDE - v2" />
                </div>
                <div className="input-group">
                  <label>Target Role / Industry</label>
                  <input required value={resumeForm.target_role} onChange={e => setResumeForm({...resumeForm, target_role: e.target.value})} placeholder="e.g. Web3, Backend, Product" />
                </div>
                <div className="input-group">
                  <label>Google Drive Share Link</label>
                  <input required value={resumeForm.link_url} onChange={e => setResumeForm({...resumeForm, link_url: e.target.value})} placeholder="https://drive.google.com/..." />
                  <p style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '6px' }}>Ensure link is set to "Anyone with the link can view" for the preview to work.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setShowResumeModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Archive to Vault</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .career-stat-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          padding: 24px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-label { font-size: 11px; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.1em; }
        .stat-value { font-size: 32px; font-weight: 400; color: var(--text-1); font-family: var(--font-serif); }
        .stat-bar { height: 4px; background: var(--bg-elevated); border-radius: 2px; overflow: hidden; margin-top: 8px; }
        .stat-bar div { height: 100%; transition: width 1s ease-out; }

        .kanban-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          padding: 20px;
          border-radius: 12px;
          transition: all 0.3s var(--ease);
          cursor: default;
        }
        .app-link {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-2);
          text-decoration: none;
          background: var(--bg-elevated);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid var(--border);
        }
        .app-link:hover { border-color: var(--text-1); color: var(--text-1); }
        .card-actions {
          display: flex;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }
        .card-actions button { background: none; border: none; cursor: pointer; padding: 4px; font-size: 16px; transition: transform 0.2s; }
        .card-actions button:hover { transform: scale(1.2); }

        .resume-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          transition: border-color 0.3s;
        }
        .resume-card:hover { border-color: var(--text-1); }
        .resume-preview-container {
          position: relative;
          background: var(--color-base);
          border-radius: 12px;
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .preview-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--color-base), transparent 40%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 20px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .resume-preview-container:hover .preview-overlay { opacity: 1; }
        .preview-btn {
          background: var(--text-1);
          color: var(--bg-primary);
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
        }

        .modal-content {
          position: relative;
          width: 100%;
          maxWidth: 520px;
          padding: 48px;
          background: var(--bg-surface);
          border-radius: 24px;
          border: 1px solid var(--border);
          box-shadow: var(--glass-shadow);
        }
        .input-group { display: flex; flexDirection: column; gap: 8px; }
        .input-group label { font-size: 11px; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.1em; }
        .input-group input, .input-group select, .input-group textarea {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          color: var(--text-1);
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-group input:focus { border-color: var(--text-1); }
        
        .btn-primary { background: var(--text-1); color: var(--bg-primary); border: none; padding: 14px; borderRadius: 12px; fontSize: 14px; fontWeight: 600; cursor: pointer; }
        .btn-secondary { background: none; border: 1px solid var(--border); color: var(--text-2); padding: 14px; borderRadius: 12px; fontSize: 14px; fontWeight: 600; cursor: pointer; }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border);
          border-top-color: var(--color-rust);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
