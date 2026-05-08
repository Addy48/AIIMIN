import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import toast from '../utils/toast';
import { apiGet } from '../utils/api';
import { X } from 'lucide-react';

const STATUS_CONFIG = {
  wishlist: { label: 'Wishlist', color: '#8C8C8C', icon: '📝' },
  applied: { label: 'Applied', color: '#556B2F', icon: '📤' },
  interview: { label: 'Interview', color: '#E2725B', icon: '👥' },
  offer: { label: 'Offer', color: '#23503B', icon: '✨' },
  rejected: { label: 'Rejected', color: '#1C1C1C', icon: '✖️' }
};

export default function Placements() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('kanban'); // kanban | timeline | resources | resumes | trajectory
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAppModal, setShowAppModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // Trajectory Intelligence Readiness Scorecard States
  const [dsaMetrics, setDsaMetrics] = useState({ score: 82, desc: 'Top 5% of candidate pool' });
  const [communicationMetrics, setCommunicationMetrics] = useState({ score: 75, desc: 'Clear & articulate' });
  const [systemDesignMetrics, setSystemDesignMetrics] = useState({ score: 45, desc: 'Needs targeted review' });

  // Momentum States
  const [momentumScore, setMomentumScore] = useState(75);
  const [momentumStatus, setMomentumStatus] = useState('Accelerating');
  const [momentumGrowth, setMomentumGrowth] = useState('+12.5% vs LW');
  const [momentumText, setMomentumText] = useState('Your application volume is up, and your response time for interview invites has improved by 4 hours on average.');

  // Forms
  const [appForm, setAppForm] = useState({ 
    company_name: '', 
    role_title: '', 
    status: 'wishlist', 
    resume_id: '', 
    linkedin_url: '', 
    job_post_url: '', 
    notes: '',
    last_contacted: ''
  });
  const [resumeForm, setResumeForm] = useState({ title: '', target_role: '', link_url: '' });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsRes, resumesRes, dsaRes, speakingRes, habitsRes] = await Promise.all([
        supabase.from('job_applications').select('*').order('applied_at', { ascending: false }),
        supabase.from('resumes').select('*').order('updated_at', { ascending: false }),
        supabase.from('dsa_logs').select('*'),
        supabase.from('lab_speaking_logs').select('*'),
        supabase.from('habit_logs').select('*')
      ]);
      setApplications(appsRes.data || []);
      setResumes(resumesRes.data || []);

      const dsaCount = dsaRes.data ? dsaRes.data.length : 0;
      const speakingLogs = speakingRes.data || [];
      const resumeCount = resumesRes.data ? resumesRes.data.length : 0;

      try {
        const readinessData = await apiGet('/placements/readiness');
        if (readinessData && readinessData.dsa) {
          setDsaMetrics(readinessData.dsa);
          setCommunicationMetrics(readinessData.communication);
          setSystemDesignMetrics(readinessData.systemDesign);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err) {
        console.warn('Failed to fetch backend readiness metrics, using client-side calculations', err);
        // Calculate DSA score
        const calculatedDsaScore = Math.min(100, Math.max(35, 35 + dsaCount * 5));
        const calculatedDsaDesc = dsaCount > 0 ? `${dsaCount} problems solved this period` : 'No solved problems logged yet';
        setDsaMetrics({ score: calculatedDsaScore, desc: calculatedDsaDesc });

        // Calculate speaking/communication score
        let calculatedCommScore = 60; // baseline
        if (speakingLogs.length > 0) {
          const totalSum = speakingLogs.reduce((acc, log) => {
            const conf = Number(log.confidence_score || 0);
            const clar = Number(log.clarity_score || 0);
            const pace = Number(log.pace_score || 0);
            return acc + (conf + clar + pace) / 3;
          }, 0);
          const rawAvg = totalSum / speakingLogs.length;
          calculatedCommScore = rawAvg <= 10 ? Math.round(rawAvg * 10) : Math.round(rawAvg);
          calculatedCommScore = Math.min(100, Math.max(0, calculatedCommScore));
        }
        const calculatedCommDesc = speakingLogs.length > 0 
          ? `Based on ${speakingLogs.length} speech logs` 
          : 'Record speaking logs to benchmark';
        setCommunicationMetrics({ score: calculatedCommScore, desc: calculatedCommDesc });

        // Calculate System Design score
        const calculatedSysScore = Math.min(100, Math.max(40, 40 + resumeCount * 15));
        const calculatedSysDesc = resumeCount > 0 
          ? `${resumeCount} active resumes mapped` 
          : 'Target key systems in resumes';
        setSystemDesignMetrics({ score: calculatedSysScore, desc: calculatedSysDesc });
      }

      // Momentum Status & Trajectory Analytics
      const completedLogs = (habitsRes.data || []).filter(h => h.status === 'done' || h.completed_at);
      const now = new Date();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const last7DaysCount = completedLogs.filter(h => {
        const logDate = new Date(h.completed_at || h.created_at);
        return (now - logDate) <= 7 * oneDayMs;
      }).length;
      const prev7DaysCount = completedLogs.filter(h => {
        const logDate = new Date(h.completed_at || h.created_at);
        const diff = now - logDate;
        return diff > 7 * oneDayMs && diff <= 14 * oneDayMs;
      }).length;

      const calcMomentumScore = last7DaysCount > 0 ? Math.min(100, 45 + last7DaysCount * 5) : 35;
      setMomentumScore(calcMomentumScore);

      let pctChange = 0;
      if (prev7DaysCount > 0) {
        pctChange = ((last7DaysCount - prev7DaysCount) / prev7DaysCount) * 100;
      } else if (last7DaysCount > 0) {
        pctChange = 100;
      }
      const pctChangeStr = (pctChange >= 0 ? '+' : '') + pctChange.toFixed(1) + '% vs LW';
      setMomentumGrowth(pctChangeStr);

      let status = 'Stagnant';
      if (calcMomentumScore >= 80) status = 'Peak';
      else if (calcMomentumScore >= 65) status = 'Accelerating';
      else if (calcMomentumScore >= 45) status = 'Building';
      setMomentumStatus(status);

      const text = calcMomentumScore >= 65 
        ? `Your habit consistency is strong with ${last7DaysCount} checkins. Keep building momentum.` 
        : "Increase your daily habit completions and speaking practice to drive higher momentum.";
      setMomentumText(text);

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
      setAppForm({ company_name: '', role_title: '', status: 'wishlist', resume_id: '', linkedin_url: '', job_post_url: '', notes: '', last_contacted: '' });
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
  
  const filteredApps = useMemo(() => {
    let filtered = applications;
    
    if (selectedRole !== 'All') {
      filtered = filtered.filter(a => a.role_title === selectedRole);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.company_name?.toLowerCase().includes(term) ||
        a.role_title?.toLowerCase().includes(term) ||
        a.notes?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [applications, selectedRole, searchTerm]);

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
              Career Architect / {activeTab === 'kanban' ? 'Application Engine' : activeTab === 'timeline' ? 'Event Timeline' : activeTab === 'resources' ? 'Resource Library' : activeTab === 'resumes' ? 'Resume Vault' : 'Trajectory Analysis'}
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
             {['kanban', 'timeline', 'resources', 'resumes', 'trajectory'].map(tab => (
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
                 {tab === 'kanban' ? 'Board' : tab === 'timeline' ? 'Timeline' : tab === 'resources' ? 'Resources' : tab === 'resumes' ? 'Vault' : 'Trajectory'}
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
                onClick={() => { setEditingApp(null); setAppForm({ company_name: '', role_title: '', status: 'wishlist', resume_id: '', linkedin_url: '', job_post_url: '', notes: '', last_contacted: '' }); setShowAppModal(true); }} 
                style={{ background: 'var(--text-1)', color: 'var(--bg-primary)', border: 'none', height: '100%', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Track New Opening
              </button>
            </div>
          </div>

          {/* Search & Filtering */}
          <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative', maxWidth: '500px' }}>
              <input 
                type="text"
                placeholder="Search companies, roles, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '14px 20px 14px 44px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  fontSize: '13px',
                  color: 'var(--text-1)',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', opacity: 0.5 }}>🔍</span>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: 0.5 }}
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Roles:</span>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', flex: 1 }}>
                {roles.map(r => (
                  <button 
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    style={{ 
                      padding: '6px 14px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: selectedRole === r ? 'var(--text-1)' : 'var(--border)',
                      background: selectedRole === r ? 'var(--text-1)' : 'var(--bg-surface)',
                      color: selectedRole === r ? 'var(--bg-primary)' : 'var(--text-2)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div style={{ 
            display: 'flex', 
            gap: '24px', 
            overflowX: 'auto', 
            paddingBottom: '32px', 
            minHeight: '60vh',
            padding: '4px',
            scrollbarWidth: 'none'
          }}>
            {Object.keys(STATUS_CONFIG).map(statusKey => {
              const columnApps = filteredApps.filter(a => a.status === statusKey);
              const config = STATUS_CONFIG[statusKey];
              
              return (
                <div key={statusKey} style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px 12px 0 0',
                    borderBottom: `2px solid ${config.color}`,
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px' }}>{config.icon}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-1)' }}>{config.label}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 800, background: 'var(--color-elevated)', padding: '2px 8px', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                      {columnApps.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {columnApps.length === 0 ? (
                      <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: '12px', color: 'var(--color-text-3)', fontSize: '12px' }}>
                        No tracks here
                      </div>
                    ) : columnApps.map(app => (
                      <motion.div 
                        layout
                        key={app.id} 
                        className="kanban-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4, borderColor: 'var(--color-text-1)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }}
                        style={{
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '12px',
                          padding: '20px',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-1)', letterSpacing: '-0.01em' }}>{app.company_name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-2)', marginTop: '4px', fontWeight: 500 }}>{app.role_title}</div>
                            {app.last_contacted && (
                              <div style={{ fontSize: '11px', color: 'var(--color-rust)', marginTop: '6px', fontWeight: 600 }}>
                                ⏱ Last Contact: {new Date(app.last_contacted).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => { setEditingApp(app); setAppForm(app); setShowAppModal(true); }}
                            style={{ background: 'none', border: 'none', opacity: 0.4, cursor: 'pointer', fontSize: '14px' }}
                          >
                            ⚙️
                          </button>
                        </div>

                        {app.notes && (
                          <p style={{ fontSize: '11px', color: 'var(--color-text-3)', marginBottom: '16px', lineHeight: '1.5', fontStyle: 'italic' }}>
                            "{app.notes.length > 60 ? app.notes.substring(0, 60) + '...' : app.notes}"
                          </p>
                        )}

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                          {app.job_post_url && (
                             <a href={app.job_post_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-2)', background: 'var(--color-elevated)', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', border: '1px solid var(--color-border)' }}>
                               Posting ↗
                             </a>
                          )}
                          {app.linkedin_url && (
                             <a href={app.linkedin_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-2)', background: 'var(--color-elevated)', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', border: '1px solid var(--color-border)' }}>
                               LinkedIn ↗
                             </a>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '6px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                          {Object.keys(STATUS_CONFIG).filter(s => s !== statusKey).map(s => (
                            <button 
                              key={s} 
                              onClick={e => { e.stopPropagation(); updateStatus(app.id, s); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', filter: 'grayscale(1)', opacity: 0.3 }}
                              title={`Move to ${s}`}
                            >
                              {STATUS_CONFIG[s].icon}
                            </button>
                          ))}
                          <div style={{ flex: 1 }} />
                          <button onClick={e => { e.stopPropagation(); deleteApplication(app.id); }} style={{ background: 'none', border: 'none', opacity: 0.3, cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      ) : activeTab === 'timeline' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '20px 0' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '32px' }}>Career Timeline</h2>
          <div style={{ position: 'relative', paddingLeft: '40px' }}>
            <div style={{ position: 'absolute', left: '11px', top: '0', bottom: '0', width: '2px', background: 'var(--border)' }} />
            
            {applications.slice(0, 5).map((app, i) => (
              <div key={app.id} style={{ position: 'relative', marginBottom: '32px' }}>
                <div style={{ position: 'absolute', left: '-40px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-surface)', border: `2px solid ${STATUS_CONFIG[app.status]?.color || 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_CONFIG[app.status]?.color || 'var(--text-3)' }} />
                </div>
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginLeft: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-1)' }}>{app.company_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{new Date(app.applied_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-2)', marginBottom: '12px' }}>{app.role_title}</div>
                  <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: `${STATUS_CONFIG[app.status]?.color}15`, color: STATUS_CONFIG[app.status]?.color }}>
                    Status: {STATUS_CONFIG[app.status]?.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : activeTab === 'resources' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-1)' }}>Resource Library</h2>
            <button className="btn-primary" style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '13px' }}>+ Add Resource</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { title: 'System Design Primer', type: 'GitHub Repo', tag: 'High Priority', url: 'https://github.com/donnemartin/system-design-primer' },
              { title: 'LeetCode Patterns', type: 'Article', tag: 'Review', url: '#' },
              { title: 'Behavioral Prep (STAR)', type: 'Google Doc', tag: 'Drafts', url: '#' },
              { title: 'Frontend Interview Guide', type: 'Website', tag: 'Reading', url: '#' }
            ].map((res, idx) => (
              <div key={idx} className="card-hover" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-1)' }}>{res.title}</div>
                  <div style={{ fontSize: '11px', padding: '4px 8px', background: 'var(--accent-dim)', color: 'var(--accent)', borderRadius: '6px', fontWeight: 600 }}>{res.tag}</div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px' }}>{res.type}</div>
                <div style={{ marginTop: 'auto' }}>
                  <a href={res.url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--color-rust)', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Open Resource ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : activeTab === 'trajectory' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px' }}>
          {/* Main Trajectory Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Career Velocity Indicator */}
            <div className="nordic-card" style={{ 
              padding: '40px', 
              background: 'var(--bg-surface)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ zIndex: 1 }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-3)', marginBottom: '12px' }}>Momentum Status</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontSize: '48px', fontWeight: 400, fontFamily: 'var(--font-serif)', color: 'var(--text-1)' }}>{momentumStatus}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: momentumGrowth.startsWith('-') ? 'var(--color-rust)' : 'var(--color-success)', background: momentumGrowth.startsWith('-') ? 'var(--color-rust)15' : 'var(--color-success)15', padding: '4px 12px', borderRadius: '20px' }}>{momentumGrowth}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '16px', maxWidth: '400px', lineHeight: '1.6' }}>
                  {momentumText}
                </p>
              </div>
              <div style={{ width: '120px', height: '120px', position: 'relative' }}>
                 <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-elevated)" strokeWidth="8" />
                    <motion.circle 
                      cx="50" cy="50" r="45" fill="none" stroke="var(--color-rust)" strokeWidth="8"
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * (momentumScore / 100)) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                 </svg>
                 <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 600 }}>{momentumScore}</div>
              </div>
              <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '200px', height: '200px', background: 'var(--color-rust)', filter: 'blur(80px)', opacity: 0.05 }} />
            </div>

            {/* Conversion Funnel */}
            <div className="nordic-card" style={{ padding: '40px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-3)' }}>Conversion Funnel Efficiency</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: 500 }}>Target: 15% Interview Rate</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Wishlist', count: stats.wishlist, color: '#8C8C8C', pct: 100 },
                  { label: 'Applied', count: stats.applied, color: '#556B2F', pct: (stats.applied / (stats.total || 1)) * 100 },
                  { label: 'Interview', count: stats.interviews, color: '#E2725B', pct: (stats.interviews / (stats.total || 1)) * 100 },
                  { label: 'Offer', count: stats.offers, color: '#23503B', pct: (stats.offers / (stats.total || 1)) * 100 }
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                     <div style={{ width: '120px', fontSize: '12px', fontWeight: 600, color: 'var(--text-2)' }}>{step.label}</div>
                     <div style={{ flex: 1, height: '54px', background: 'var(--bg-elevated)', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${step.pct}%` }}
                         transition={{ duration: 1.2, delay: idx * 0.1, ease: "circOut" }}
                         style={{ height: '100%', background: step.color, opacity: 0.85 }}
                       />
                       <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: '14px', fontWeight: 700, color: step.pct > 30 ? 'white' : 'var(--text-1)' }}>
                         {step.count} <span style={{ fontSize: '11px', opacity: 0.7, marginLeft: '10px', fontWeight: 500 }}>({step.pct.toFixed(0)}%)</span>
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Scorecard */}
            <div className="nordic-card" style={{ padding: '40px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-3)', marginBottom: '40px' }}>Market Readiness Scorecard</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                {[
                  { label: 'DSA/Algorithms', score: dsaMetrics.score, color: 'var(--color-rust)', desc: dsaMetrics.desc },
                  { label: 'Communication', score: communicationMetrics.score, color: 'var(--accent)', desc: communicationMetrics.desc },
                  { label: 'System Design', score: systemDesignMetrics.score, color: '#23503B', desc: systemDesignMetrics.desc }
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
                      <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--bg-elevated)" strokeWidth="2.5" />
                        <motion.path 
                          initial={{ strokeDasharray: '0, 100' }}
                          animate={{ strokeDasharray: `${m.score}, 100` }}
                          transition={{ duration: 1.5, delay: i * 0.2, ease: "circOut" }}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" 
                          stroke={m.color} 
                          strokeWidth="2.5" 
                          strokeLinecap="round"
                        />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 500, fontFamily: 'var(--font-serif)', color: 'var(--text-1)' }}>
                        {m.score}
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-1)', letterSpacing: '0.1em', marginBottom: '8px' }}>{m.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: '1.4' }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Career Strategy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
             <div className="nordic-card" style={{ 
                padding: '40px', 
                background: 'var(--text-1)', 
                color: 'var(--bg-primary)', 
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '32px', opacity: 0.6 }}>Strategic Directive</h3>
                  <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', lineHeight: '1.4', marginBottom: '32px' }}>
                    "Focus on <span style={{ opacity: 0.7 }}>System Design</span> and <span style={{ opacity: 0.7 }}>Low Level Design</span>. Your DSA performance is top-tier, but response rates drop for L5+ roles."
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '16px', opacity: 0.5, letterSpacing: '0.1em' }}>Next Milestone</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600 }}>Mock Interview v4</span>
                      <span style={{ fontSize: '12px', opacity: 0.6 }}>3 Days Left</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{ height: '100%', background: 'var(--color-rust)' }} 
                      />
                    </div>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '150px', height: '150px', background: 'var(--color-rust)', filter: 'blur(80px)', opacity: 0.2 }} />
              </div>

              <div className="nordic-card" style={{ padding: '40px', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-3)', marginBottom: '32px' }}>Market Sentiment</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { label: 'AI/ML Infrastructure', trend: 'SURGING', color: '#10B981', val: '+24%' },
                    { label: 'Fintech Backend', trend: 'STABLE', color: '#3B82F6', val: '+2%' },
                    { label: 'Crypto/Web3', trend: 'VOLATILE', color: 'var(--color-rust)', val: '-12%' }
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-1)' }}>{s.label}</div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: s.color, marginTop: '4px' }}>{s.trend}</div>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: s.val.startsWith('+') ? '#10B981' : 'var(--color-rust)' }}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Prep Quests */}
              <div className="nordic-card" style={{ padding: '40px', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-3)', marginBottom: '32px' }}>Interview Prep Quests</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { label: 'System Design Mock', type: 'Technical', status: 'Pending', color: 'var(--color-rust)' },
                    { label: 'Behavioral Stories (STAR)', type: 'Soft Skills', status: 'In Progress', color: '#3B82F6' },
                    { label: 'LeetCode Hard Array/String', type: 'Coding', status: 'Completed', color: '#10B981' }
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-1)' }}>{s.label}</div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', marginTop: '4px' }}>{s.type}</div>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: s.color, background: `${s.color}15`, padding: '4px 12px', borderRadius: '12px' }}>{s.status}</span>
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
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="modal-content application-intake-modal" style={{ position: 'relative' }}>
              <button type="button" onClick={() => setShowAppModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
              <div className="application-intake-layout">
                <aside className="application-intake-rail">
                  <div>
                    <div className="modal-eyebrow">Opportunity Intake</div>
                    <h2>{editingApp ? 'Update application' : 'Track opportunity'}</h2>
                    <p>Capture role, resume, source links, outreach date, and notes in one clean record.</p>
                  </div>
                  <div className="intake-summary-grid">
                    <span>Company</span><strong>{appForm.company_name || 'Not set'}</strong>
                    <span>Status</span><strong>{STATUS_CONFIG[appForm.status]?.label}</strong>
                    <span>Resume</span><strong>{appForm.resume_id ? 'Linked' : 'Unlinked'}</strong>
                  </div>
                </aside>
                <form onSubmit={handleSaveApplication} className="application-intake-form">
                  <div className="form-grid two">
                    <div className="input-group">
                      <label>Company Name</label>
                      <input required value={appForm.company_name} onChange={e => setAppForm({...appForm, company_name: e.target.value})} placeholder="e.g. Anthropic" />
                    </div>
                    <div className="input-group">
                      <label>Role Title</label>
                      <input required value={appForm.role_title} onChange={e => setAppForm({...appForm, role_title: e.target.value})} placeholder="e.g. AI Engineer" />
                    </div>
                  </div>

                  <div className="form-grid three">
                    <div className="input-group">
                      <label>Status</label>
                      <select value={appForm.status} onChange={e => setAppForm({...appForm, status: e.target.value})}>
                        {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Resume</label>
                      <select value={appForm.resume_id} onChange={e => setAppForm({...appForm, resume_id: e.target.value})}>
                        <option value="">None Linked</option>
                        {resumes.map(r => <option key={r.id} value={r.id}>{r.title} ({r.target_role})</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Last Contacted</label>
                      <input type="date" value={appForm.last_contacted || ''} onChange={e => setAppForm({...appForm, last_contacted: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-grid two">
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
                    <textarea rows={5} value={appForm.notes || ''} onChange={e => setAppForm({...appForm, notes: e.target.value})} placeholder="Recruiter names, referrals, role requirements, interview angles..." />
                  </div>

                  <div className="modal-action-row">
                    <button type="button" onClick={() => setShowAppModal(false)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Save Track</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Resume Modal */}
      <AnimatePresence>
        {showResumeModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowResumeModal(false)} style={{ position: 'absolute', inset: 0, background: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="modal-content" style={{ maxWidth: '440px', position: 'relative' }}>
              <button type="button" onClick={() => setShowResumeModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
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
          max-width: 520px;
          padding: 48px;
          background: var(--bg-surface);
          border-radius: 24px;
          border: 1px solid var(--border);
          box-shadow: var(--glass-shadow);
        }
        .application-intake-modal {
          max-width: min(1040px, 94vw);
          padding: 0;
          overflow: hidden;
        }
        .application-intake-layout {
          display: grid;
          grid-template-columns: 320px minmax(0, 1fr);
          min-height: 560px;
        }
        .application-intake-rail {
          background: var(--color-card-dark-green);
          color: white;
          padding: 36px 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
        }
        .application-intake-rail h2 {
          font-family: var(--font-serif);
          font-size: 34px;
          line-height: 1.05;
          font-weight: 500;
          margin: 12px 0 16px;
        }
        .application-intake-rail p {
          color: rgba(255,255,255,0.68);
          font-size: 13px;
          line-height: 1.65;
          margin: 0;
        }
        .modal-eyebrow {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #7DD3A7;
        }
        .intake-summary-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.12);
        }
        .intake-summary-grid span {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.45);
        }
        .intake-summary-grid strong {
          font-size: 13px;
          margin-bottom: 10px;
        }
        .application-intake-form {
          padding: 36px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-grid {
          display: grid;
          gap: 16px;
        }
        .form-grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .form-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .modal-action-row { display: flex; gap: 12px; margin-top: 8px; justify-content: flex-end; }
        .modal-action-row .btn-secondary,
        .modal-action-row .btn-primary { min-width: 150px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
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
        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus { border-color: var(--text-1); }
        
        .btn-primary { background: var(--text-1); color: var(--bg-primary); border: none; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-secondary { background: none; border: 1px solid var(--border); color: var(--text-2); padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }

        @media (max-width: 900px) {
          .application-intake-layout { grid-template-columns: 1fr; }
          .application-intake-rail { padding: 28px; }
          .form-grid.two,
          .form-grid.three { grid-template-columns: 1fr; }
        }

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
