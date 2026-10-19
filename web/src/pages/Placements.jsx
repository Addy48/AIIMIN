import React, { useState, useEffect, useMemo, useRef } from 'react';
import '../styles/careerKanban.css';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from '../utils/toast';
import { apiGet, apiPost, apiPut, apiDelete, API_URL } from '../utils/api';
import { FileSearch, FileText } from 'lucide-react';
import ATSAnalyzer from './ATSAnalyzer';
import ApplicationIntakeModal from '../components/placements/ApplicationIntakeModal';
import ResumeArchiveModal from '../components/placements/ResumeArchiveModal';
import { useReadinessScore } from '../hooks/useReadinessScore';
import { formatDate } from '../utils/formatDate';
import { sanitizeScore } from '../utils/enumLabels';

function ResumePreview({ resume, onUpdateLink }) {
  const [broken, setBroken] = useState(false);
  const url = resume.view_url || resume.link_url;
  const isDemoOrMissing = !url
    || url.includes('/demo-')
    || /\/file\/d\/demo/i.test(url);

  if (!url || isDemoOrMissing || broken) {
    return (
      <div style={{
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 24,
        border: '1px dashed var(--border)',
        borderRadius: 8,
        background: 'var(--bg-surface, rgba(0,0,0,0.15))',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>Preview not available</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, maxWidth: 280 }}>
          Resume file not found. The Drive link for this resume has moved or been deleted. Add a new link to preview your resume here.
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
          {resume.target_role || 'General'} · Updated {formatDate(resume.updated_at || resume.created_at)}
        </div>
        {onUpdateLink && (
          <button
            type="button"
            onClick={onUpdateLink}
            style={{
              marginTop: 4,
              padding: '10px 18px',
              borderRadius: 10,
              border: 'none',
              background: '#ff6b35',
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            + Update Drive Link
          </button>
        )}
      </div>
    );
  }

  const idMatch = url.match(/\/d\/([^/]+)/);
  const previewSrc = url.includes('drive.google.com') && idMatch
    ? `https://drive.google.com/file/d/${idMatch[1]}/preview`
    : url;

  return (
    <iframe
      src={previewSrc}
      style={{ width: '100%', height: 400, border: 'none', borderRadius: 8 }}
      title={resume.title}
      onError={() => setBroken(true)}
    />
  );
}

const STATUS_CONFIG = {
  wishlist: { label: 'Wishlist', color: 'rgba(237,228,211,0.45)', icon: '📝' },
  applied: { label: 'Applied', color: '#ff6b35', icon: '📤' },
  interview: { label: 'In Interview', color: '#E8B84B', icon: '👥' },
  offer: { label: 'Offer', color: '#5FA85A', icon: '✨' },
  rejected: { label: 'Rejected', color: '#E85D5D', icon: '✖️' }
};

export default function Placements() {
  const { user: authUser } = useAuth();
  const user = authUser || { id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true };
  const [activeTab, setActiveTab] = useState('kanban'); // kanban | timeline | resources | resumes | trajectory
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [resumeViewMode, setResumeViewMode] = useState('vault'); // 'vault' | 'analyzer'
  const kanbanScrollRef = useRef(null);
  const [kanbanDot, setKanbanDot] = useState(0);
  const statusKeys = useMemo(() => Object.keys(STATUS_CONFIG), []);

  // Modals
  const [showAppModal, setShowAppModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // Trajectory Intelligence Readiness Scorecard States (Real Metrics)
  const { dsaMetrics: realDsa, communicationMetrics: realComms, systemDesignMetrics: realSys, loading: metricsLoading } = useReadinessScore(user);
  
  const [dsaMetrics, setDsaMetrics] = useState({ score: 82, desc: 'Top 5% of candidate pool' });
  const [communicationMetrics, setCommunicationMetrics] = useState({ score: 75, desc: 'Clear & articulate' });
  const [systemDesignMetrics, setSystemDesignMetrics] = useState({ score: 45, desc: 'Needs targeted review' });

  useEffect(() => {
    if (!user.isGuest && !metricsLoading) {
      if (realDsa.score > 0) setDsaMetrics(realDsa);
      if (realComms.score > 0) setCommunicationMetrics(realComms);
      if (realSys.score > 0) setSystemDesignMetrics(realSys);
    }
  }, [realDsa, realComms, realSys, user.isGuest, metricsLoading]);

  useEffect(() => {
    if (activeTab !== 'kanban') return undefined;
    const el = kanbanScrollRef.current;
    if (!el) return undefined;
    const onScroll = () => {
      const colWidth = el.querySelector('.career-kanban-column')?.offsetWidth || 320;
      const idx = Math.round(el.scrollLeft / (colWidth + 24));
      setKanbanDot(Math.max(0, Math.min(statusKeys.length - 1, idx)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [activeTab, statusKeys.length]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    if (user.isGuest) {
      // Load standard, gorgeous mock data immediately for a premium guest experience
      setApplications([
        {
          id: 'mock-1',
          company_name: 'Vercel',
          role_title: 'Solutions Architect',
          status: 'offer',
          notes: 'Completed system design interview. Received offer sheet with excellent equity options.',
          applied_at: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
          updated_at: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'mock-2',
          company_name: 'Stripe',
          role_title: 'Software Engineer',
          status: 'interview',
          notes: 'Technical screen passed. Virtual onsite scheduled for next week.',
          applied_at: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
          updated_at: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'mock-3',
          company_name: 'Google',
          role_title: 'Frontend Engineer',
          status: 'applied',
          notes: 'Applied through internal referral. Resume parsed and screening scheduled.',
          applied_at: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
          updated_at: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0]
        }
      ]);
      setResumes([
        {
          id: 'mock-res-1',
          title: 'Senior Systems & Architecture Resume',
          target_role: 'Solutions Architect',
          link_url: 'https://drive.google.com/file/d/1Xy_mock_resume_id/view',
          created_at: new Date(Date.now() - 30 * 86400000).toISOString()
        }
      ]);
      setDsaMetrics({ score: 88, desc: '94 solved problems logged' });
      setCommunicationMetrics({ score: 85, desc: 'Based on active mock monologue metrics' });
      setSystemDesignMetrics({ score: 75, desc: 'System patterns successfully structured' });
      setMomentumScore(80);
      setMomentumStatus('Peak');
      setMomentumGrowth('+18.4% vs LW');
      setMomentumText('You are maintaining a strong execution velocity. Keep completing daily modules.');
      setLoading(false);
      return;
    }
    let anySuccess = false;
    try {
      // Fetch each endpoint independently — a single missing route won't kill everything
      const [appsData, resumesData, habitsData] = await Promise.allSettled([
        apiGet('/placements/applications'),
        apiGet('/placements/resumes'),
        apiGet('/placements/habit-logs'),
      ]);

      if (appsData.status === 'fulfilled') {
        setApplications(appsData.value || []);
        anySuccess = true;
      } else {
        console.warn('[Placements] Applications endpoint unavailable:', appsData.reason);
        setApplications([]);
      }

      if (resumesData.status === 'fulfilled') {
        setResumes(resumesData.value || []);
        anySuccess = true;
      } else {
        console.warn('[Placements] Resumes endpoint unavailable:', resumesData.reason);
        setResumes([]);
      }

      const habitsRaw = habitsData.status === 'fulfilled' ? (habitsData.value || []) : [];

      // We remove the apiGet('/placements/readiness') as we now use useReadinessScore

      // Momentum calculation from habits
      const completedLogs = habitsRaw.filter(h => h.status === 'done' || h.completed_at);
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
      setMomentumGrowth((pctChange >= 0 ? '+' : '') + pctChange.toFixed(1) + '% vs last week');

      let status = 'Holding steady';
      if (calcMomentumScore >= 80) status = 'Peak';
      else if (calcMomentumScore >= 65) status = 'Accelerating';
      else if (calcMomentumScore >= 45) status = 'Building';
      setMomentumStatus(status);

      setMomentumText(
        calcMomentumScore >= 65
          ? `Your habit consistency is strong with ${last7DaysCount} checkins. Keep building momentum.`
          : 'Increase your daily habit completions and speaking practice to drive higher momentum.'
      );

    } catch (error) {
      // Only reaches here if something truly unexpected happens
      console.error('[Placements] Critical load error:', error);
      if (!anySuccess) {
        toast.error('Career data temporarily unavailable — check your connection');
      }
    } finally {
      setLoading(false);
    }
  };


  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'link'

  const handleCreateResume = async (e) => {
    e.preventDefault();
    const tid = toast.loading('Archiving resume version...');
    try {
      let key = '';
      
      if (uploadMode === 'file') {
        if (!selectedFile) {
          toast.update(tid, 'Please select a file to upload', 'error');
          return;
        }
        
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadData = await fetch(`${API_URL}/placements/resumes/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }).then(r => {
            if (!r.ok) throw new Error('Upload failed');
            return r.json();
        });
        
        key = uploadData.url;
      } else {
        key = resumeForm.link_url;
      }
      
      // 3. Confirm metadata to backend
      const data = await apiPost('/placements/resumes/confirm', {
        title: resumeForm.title,
        target_role: resumeForm.target_role,
        key
      });
      
      setResumes([data, ...resumes]);
      setShowResumeModal(false);
      setResumeForm({ title: '', target_role: '', link_url: '' });
      setSelectedFile(null);
      toast.update(tid, 'Resume archived ✓', 'success');
    } catch (err) {
      console.error('Resume upload/archive failed:', err);
      toast.update(tid, 'Archive failed', 'error');
    }
  };

  const handleSaveApplication = async (e) => {
    e.preventDefault();
    const tid = toast.loading(editingApp ? 'Updating application...' : 'Tracking application...');
    try {
      if (editingApp) {
        const data = await apiPut(`/placements/applications/${editingApp.id}`, appForm);
        setApplications(applications.map(a => a.id === data.id ? data : a));
      } else {
        const data = await apiPost('/placements/applications', {
          ...appForm,
          applied_at: appForm.applied_at || new Date().toISOString().split('T')[0]
        });
        setApplications([data, ...applications]);
      }
      
      setShowAppModal(false);
      setEditingApp(null);
      setAppForm({ company_name: '', role_title: '', status: 'wishlist', resume_id: '', linkedin_url: '', job_post_url: '', notes: '', last_contacted: '' });
      toast.update(tid, 'Application synchronized ✓', 'success');
    } catch (err) {
      console.error('Save application failed:', err);
      toast.update(tid, 'Sync failed', 'error');
    }
  };

  const updateStatus = async (id, newStatus) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    try {
      const data = await apiPut(`/placements/applications/${id}`, {
        ...app,
        status: newStatus
      });
      setApplications(applications.map(a => a.id === id ? data : a));
      toast.success(`Moved to ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error('Update status failed:', err);
      toast.error('Move failed');
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Abandon this application track?")) return;
    try {
      await apiDelete(`/placements/applications/${id}`);
      setApplications(applications.filter(a => a.id !== id));
      toast.success("Track removed");
    } catch (err) {
      console.error('Delete application failed:', err);
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
    <div className="page-container" style={{ minHeight: '100vh' }}>
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

          {/* Kanban Board — native horizontal scroll + snap (no arrow chrome) */}
          <div className="career-kanban-wrap">
            <div
              ref={kanbanScrollRef}
              className="career-kanban-scroll"
              id="career-kanban-scroll"
            >
            {statusKeys.map(statusKey => {
              const columnApps = filteredApps.filter(a => a.status === statusKey);
              const config = STATUS_CONFIG[statusKey];
              
              return (
                <div key={statusKey} className="career-kanban-column">
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
                    ) : columnApps.filter((app) => app?.company_name).map(app => (
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
                                ⏱ Last Contact: {formatDate(app.last_contacted)}
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
                             <a href={app.job_post_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: '9px', fontWeight: 800, fontFamily: 'var(--font-mono, JetBrains Mono, monospace)', textTransform: 'uppercase', color: '#ff6b35', background: 'rgba(255,107,53,0.1)', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', border: '1px solid rgba(255,107,53,0.2)' }}>
                               Posting ↗
                             </a>
                          )}
                          {app.linkedin_url && (
                             <a href={app.linkedin_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: '9px', fontWeight: 800, fontFamily: 'var(--font-mono, JetBrains Mono, monospace)', textTransform: 'uppercase', color: '#ff6b35', background: 'rgba(255,107,53,0.1)', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', border: '1px solid rgba(255,107,53,0.2)' }}>
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
            <div className="career-kanban-dots" aria-hidden>
              {statusKeys.map((key, i) => (
                <button
                  key={key}
                  type="button"
                  className={`career-kanban-dot${kanbanDot === i ? ' career-kanban-dot--active' : ''}`}
                  onClick={() => {
                    const col = kanbanScrollRef.current?.querySelectorAll('.career-kanban-column')[i];
                    col?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
                    setKanbanDot(i);
                  }}
                  aria-label={`Scroll to ${STATUS_CONFIG[key]?.label || key} column`}
                />
              ))}
            </div>
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
                    <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{formatDate(app.applied_at)}</div>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
            
            {/* Momentum Status */}
            <div className="card-hover" style={{ 
              padding: '16px', 
              background: 'linear-gradient(145deg, rgba(30,30,30,0.6), rgba(20,20,20,0.8))', 
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div>
                <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '6px' }}>Momentum Status</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-1)', fontFamily: 'var(--font-serif)' }}>{momentumStatus}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: momentumGrowth.startsWith('-') ? 'rgba(226,114,91,0.1)' : 'rgba(93,184,122,0.1)', color: momentumGrowth.startsWith('-') ? 'var(--color-rust)' : 'var(--color-success)' }}>{momentumGrowth}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-2)', marginTop: '6px', margin: 0, lineHeight: 1.4 }}>{momentumText}</p>
              </div>
              <div style={{ width: '64px', height: '64px', position: 'relative', flexShrink: 0 }}>
                 <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', dropShadow: '0 0 8px rgba(226,114,91,0.4)' }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-elevated)" strokeWidth="6" />
                    <motion.circle 
                      cx="50" cy="50" r="45" fill="none" stroke="var(--color-rust)" strokeWidth="6"
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * (momentumScore / 100)) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                 </svg>
                 <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>{momentumScore}</div>
              </div>
            </div>

            {/* Strategic Directive */}
            <div className="card-hover" style={{ 
              padding: '16px', 
              background: 'linear-gradient(145deg, rgba(226,114,91,0.05), rgba(20,20,20,0.8))', 
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-rust)', marginBottom: '8px' }}>Strategic Directive</h3>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-1)', lineHeight: '1.5', fontStyle: 'italic', marginBottom: '12px' }}>
                  "Focus on System Design and LLD. Your DSA is top-tier, but response rates drop for L5+ roles."
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-2)' }}>Next: Mock Interview v4</span>
                <span style={{ fontSize: '10px', color: 'var(--color-rust)', fontWeight: 700 }}>3 Days Left</span>
              </div>
            </div>

            {/* Compact Conversion Funnel */}
            <div className="card-hover" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(30,30,30,0.4)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '12px' }}>Conversion Funnel</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Wishlist', count: stats.wishlist, color: '#8C8C8C', pct: 100 },
                  { label: 'Applied', count: stats.applied, color: '#556B2F', pct: (stats.applied / (stats.total || 1)) * 100 },
                  { label: 'In Interview', count: stats.interviews, color: '#E8B84B', pct: (stats.interviews / (stats.total || 1)) * 100 },
                  { label: 'Offer', count: stats.offers, color: '#23503B', pct: (stats.offers / (stats.total || 1)) * 100 }
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <div style={{ width: '65px', fontSize: '10px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase' }}>{step.label}</div>
                     <div style={{ flex: 1, height: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${step.pct}%` }}
                         transition={{ duration: 1.2, delay: idx * 0.1, ease: "circOut" }}
                         style={{ height: '100%', background: step.color, opacity: 0.85 }}
                       />
                       <div style={{ position: 'absolute', right: '8px', top: '0', bottom: '0', display: 'flex', alignItems: 'center', fontSize: '10px', fontWeight: 800, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                         {step.count}
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Readiness Scorecard */}
            <div className="card-hover" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(30,30,30,0.4)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '12px' }}>Market Readiness</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'DSA/Algorithms', score: dsaMetrics.score, color: '#ff6b35' },
                  { label: 'Communication', score: communicationMetrics.score, color: '#5FA85A' },
                  { label: 'System Design', score: systemDesignMetrics.score, color: '#E8B84B' }
                ].map((m, idx) => {
                  const s = sanitizeScore(m.score);
                  const barColor = s.warning ? '#E85D5D' : m.color;
                  return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-2)' }}>{m.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '50px', height: '4px', background: 'rgba(0,0,0,0.4)', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} style={{ height: '100%', background: barColor }} />
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: barColor, minWidth: '40px', textAlign: 'right' }}>
                        {s.value != null ? `${s.display}/100` : 'N/A'}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Market Sentiment */}
            <div className="card-hover" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(30,30,30,0.4)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '12px' }}>Market Sentiment</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'AI/ML Infrastructure', trend: 'SURGING', color: '#10b981', val: '+24%' },
                  { label: 'Fintech Backend', trend: 'STABLE', color: '#E8B84B', val: '+2%' },
                  { label: 'Crypto/Web3', trend: 'VOLATILE', color: 'var(--color-rust)', val: '-12%' }
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: i < 2 ? '8px' : '0' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-1)' }}>{s.label}</div>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: s.color, marginTop: '2px', letterSpacing: '0.05em' }}>{s.trend}</div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: s.val.startsWith('+') ? '#10B981' : 'var(--color-rust)' }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Prep Quests */}
            <div className="card-hover" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(30,30,30,0.4)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '12px' }}>Active Quests</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'System Design Mock', type: 'Technical', status: 'Pending', color: 'var(--color-rust)' },
                  { label: 'Amazon LP Review', type: 'Behavioral', status: 'Reviewing', color: 'var(--color-warning)' },
                  { label: 'DSA: Graph Cycles', type: 'Algorithmic', status: 'Completed', color: 'var(--color-success)' }
                ].map((q, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '6px', borderLeft: `3px solid ${q.color}` }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-1)' }}>{q.label}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-3)', marginTop: '2px', textTransform: 'uppercase' }}>{q.type}</div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: q.color }}>{q.status}</span>
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
              <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '4px' }}>Resume Hub</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Manage your resume versions and analyze match with JD.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <button 
                  onClick={() => setResumeViewMode('vault')}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
                    background: resumeViewMode === 'vault' ? 'var(--text-1)' : 'transparent',
                    color: resumeViewMode === 'vault' ? 'var(--bg-primary)' : 'var(--text-3)',
                    transition: 'all 0.2s'
                  }}
                >
                  <FileText size={14} /> Vault
                </button>
                <button 
                  onClick={() => setResumeViewMode('analyzer')}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
                    background: resumeViewMode === 'analyzer' ? 'var(--text-1)' : 'transparent',
                    color: resumeViewMode === 'analyzer' ? 'var(--bg-primary)' : 'var(--text-3)',
                    transition: 'all 0.2s'
                  }}
                >
                  <FileSearch size={14} /> Analyzer
                </button>
              </div>
              {resumeViewMode === 'vault' && (
                <button 
                  onClick={() => { setResumeForm({ title: '', target_role: '', link_url: '' }); setShowResumeModal(true); }} 
                  style={{ background: 'var(--text-1)', color: 'var(--bg-primary)', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  + New Version
                </button>
              )}
            </div>
          </div>

          {resumeViewMode === 'analyzer' ? (
            <ATSAnalyzer />
          ) : (
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
                    <button 
                      onClick={async () => { 
                        if (window.confirm('Delete this version?')) { 
                          const tid = toast.loading('Deleting resume...');
                          try {
                            await apiDelete(`/placements/resumes/${resume.id}`);
                            setResumes(resumes.filter(r => r.id !== resume.id)); 
                            toast.update(tid, 'Resume deleted ✓', 'success');
                          } catch (err) {
                            toast.update(tid, 'Failed to delete resume', 'error');
                          }
                        } 
                      }} 
                      style={{ background: 'none', border: 'none', opacity: 0.3, cursor: 'pointer' }}
                    >
                      ❌
                    </button>
                  </div>

                  <div className="resume-preview-container">
                    <ResumePreview
                      resume={resume}
                      onUpdateLink={() => {
                        setResumeForm({
                          title: resume.title || '',
                          target_role: resume.target_role || '',
                          link_url: '',
                        });
                        setUploadMode('link');
                        setShowResumeModal(true);
                      }}
                    />
                    <div className="preview-overlay">
                      {resume.view_url && !String(resume.view_url).includes('demo') && (
                        <a href={resume.view_url} target="_blank" rel="noopener noreferrer" className="preview-btn">Open Full Document ↗</a>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Updated {formatDate(resume.updated_at || resume.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </motion.div>
      )}

      {/* Application Modal */}
      <ApplicationIntakeModal 
        showAppModal={showAppModal} 
        setShowAppModal={setShowAppModal} 
        editingApp={editingApp} 
        appForm={appForm} 
        setAppForm={setAppForm} 
        resumes={resumes} 
        handleSaveApplication={handleSaveApplication} 
      />

      {/* Resume Modal */}
      <ResumeArchiveModal 
        showResumeModal={showResumeModal} 
        setShowResumeModal={setShowResumeModal} 
        setUploadMode={setUploadMode} 
        uploadMode={uploadMode} 
        handleCreateResume={handleCreateResume} 
        resumeForm={resumeForm} 
        setResumeForm={setResumeForm} 
        selectedFile={selectedFile} 
        setSelectedFile={setSelectedFile} 
      />

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
