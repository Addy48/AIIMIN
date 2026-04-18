import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8787/api';

const fetchWithToken = async (url, token, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export default function Placements() {
  const { session } = useAuth();
  const token = session?.access_token;
  
  const [activeTab, setActiveTab] = useState('kanban'); // kanban | resumes
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kanban State
  const [showAppModal, setShowAppModal] = useState(false);
  const [appForm, setAppForm] = useState({ company_name: '', role_title: '', status: 'wishlist', resume_id: '', linkedin_url: '', job_post_url: '', notes: '' });

  // Resume State
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeForm, setResumeForm] = useState({ title: '', target_role: '', link_url: '' });

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsData, resumesData] = await Promise.all([
        fetchWithToken('/placements/applications', token),
        fetchWithToken('/placements/resumes', token)
      ]);
      setApplications(appsData);
      setResumes(resumesData);
    } catch (error) {
      console.error("Failed to load placements data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async (e) => {
    e.preventDefault();
    try {
      const newResume = await fetchWithToken('/placements/resumes', token, {
        method: 'POST',
        body: JSON.stringify(resumeForm)
      });
      setResumes([newResume, ...resumes]);
      setShowResumeModal(false);
      setResumeForm({ title: '', target_role: '', link_url: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateApplication = async (e) => {
    e.preventDefault();
    try {
      const newApp = await fetchWithToken('/placements/applications', token, {
        method: 'POST',
        body: JSON.stringify(appForm)
      });
      setApplications([newApp, ...applications]);
      setShowAppModal(false);
      setAppForm({ company_name: '', role_title: '', status: 'wishlist', resume_id: '', linkedin_url: '', job_post_url: '', notes: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const updateApplicationStatus = async (id, newStatus) => {
    try {
      const updated = await fetchWithToken(`/placements/applications/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      setApplications(applications.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const statuses = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

  const getStatusColor = (status) => {
    const colors = {
      wishlist: 'var(--text-3)',
      applied: 'var(--color-steps)',
      interview: 'var(--color-warning)',
      offer: 'var(--color-success)',
      rejected: 'var(--color-alert-red)'
    };
    return colors[status] || colors.wishlist;
  };

  return (
    <div className="page-container" style={{ padding: 'var(--content-pad)', maxWidth: 'var(--content-max)', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ font: 'var(--text-hero)', marginBottom: 'var(--space-2)' }}>Career & Placements</h1>
          <p style={{ font: 'var(--text-body)', color: 'var(--text-2)' }}>Track applications and manage targeted resumes.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-2)', background: 'var(--glass-bg)', padding: '4px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--glass-border)' }}>
          <button 
            onClick={() => setActiveTab('kanban')}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)', font: 'var(--text-heading)', fontSize: '14px', background: activeTab === 'kanban' ? 'var(--text-1)' : 'transparent', color: activeTab === 'kanban' ? 'var(--bg-primary)' : 'var(--text-2)', border: 'none', cursor: 'pointer', transition: 'all var(--dur-normal) var(--ease)' }}
          >
            Applications
          </button>
          <button 
            onClick={() => setActiveTab('resumes')}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)', font: 'var(--text-heading)', fontSize: '14px', background: activeTab === 'resumes' ? 'var(--text-1)' : 'transparent', color: activeTab === 'resumes' ? 'var(--bg-primary)' : 'var(--text-2)', border: 'none', cursor: 'pointer', transition: 'all var(--dur-normal) var(--ease)' }}
          >
            Resume Vault
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-2)', font: 'var(--text-body)' }}>Loading data...</div>
      ) : activeTab === 'kanban' ? (
        <div className="kanban-board">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
            <button 
              onClick={() => setShowAppModal(true)}
              style={{ background: 'var(--text-1)', color: 'var(--bg-primary)', padding: '10px 20px', borderRadius: 'var(--radius-pill)', font: 'var(--text-heading)', fontSize: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              + New Application
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-4)', overflowX: 'auto', paddingBottom: 'var(--space-4)', minHeight: '600px' }}>
            {statuses.map(status => (
              <div key={status} style={{ flex: '0 0 320px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-modal)', padding: 'var(--space-4)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: getStatusColor(status) }} />
                  <h3 style={{ font: 'var(--text-heading)', textTransform: 'capitalize' }}>{status}</h3>
                  <span style={{ marginLeft: 'auto', font: 'var(--text-label)', color: 'var(--text-3)' }}>
                    {applications.filter(a => a.status === status).length}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {applications.filter(a => a.status === status).map(app => (
                    <motion.div 
                      layoutId={app.id}
                      key={app.id} 
                      style={{ background: 'var(--bg-card)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'grab' }}
                    >
                      <h4 style={{ font: 'var(--text-heading)', marginBottom: '4px' }}>{app.role_title}</h4>
                      <div style={{ font: 'var(--text-body)', color: 'var(--text-2)', marginBottom: 'var(--space-3)' }}>{app.company_name}</div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'var(--space-3)' }}>
                        {statuses.filter(s => s !== status).map(s => (
                          <button 
                            key={s} 
                            onClick={() => updateApplicationStatus(app.id, s)}
                            style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--text-3)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer' }}
                          >
                            Move to {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="resume-vault">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ font: 'var(--text-metric)' }}>Your Resumes</h2>
            <button 
              onClick={() => setShowResumeModal(true)}
              style={{ background: 'var(--text-1)', color: 'var(--bg-primary)', padding: '10px 20px', borderRadius: 'var(--radius-pill)', font: 'var(--text-heading)', fontSize: '14px', border: 'none', cursor: 'pointer' }}
            >
              + Add Resume
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {resumes.map(resume => (
              <div key={resume.id} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-modal)', padding: 'var(--space-5)' }}>
                <h3 style={{ font: 'var(--text-heading)', marginBottom: '8px' }}>{resume.title}</h3>
                <p style={{ font: 'var(--text-body)', color: 'var(--text-2)', marginBottom: 'var(--space-4)' }}>Target: {resume.target_role || 'General'}</p>
                <a 
                  href={resume.link_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', background: 'var(--bg-elevated)', color: 'var(--text-1)', textDecoration: 'none', padding: '8px 16px', borderRadius: 'var(--radius-pill)', fontSize: '13px', border: '1px solid var(--color-border)' }}
                >
                  Open Link
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* App Modal */}
      <AnimatePresence>
        {showAppModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: 'var(--bg-primary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-modal)', border: '1px solid var(--glass-border)', width: '100%', maxWidth: '500px' }}
            >
              <h2 style={{ font: 'var(--text-metric)', marginBottom: 'var(--space-5)' }}>New Application</h2>
              <form onSubmit={handleCreateApplication} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', font: 'var(--text-label)', color: 'var(--text-2)', marginBottom: '8px' }}>Company</label>
                  <input required value={appForm.company_name} onChange={e => setAppForm({...appForm, company_name: e.target.value})} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--text-1)', padding: '12px', borderRadius: 'var(--radius-md)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', font: 'var(--text-label)', color: 'var(--text-2)', marginBottom: '8px' }}>Role</label>
                  <input required value={appForm.role_title} onChange={e => setAppForm({...appForm, role_title: e.target.value})} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--text-1)', padding: '12px', borderRadius: 'var(--radius-md)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', font: 'var(--text-label)', color: 'var(--text-2)', marginBottom: '8px' }}>Resume Used</label>
                  <select value={appForm.resume_id} onChange={e => setAppForm({...appForm, resume_id: e.target.value})} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--text-1)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                    <option value="">-- None --</option>
                    {resumes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <button type="button" onClick={() => setShowAppModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--text-1)', borderRadius: 'var(--radius-pill)', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--text-1)', border: 'none', color: 'var(--bg-primary)', borderRadius: 'var(--radius-pill)', cursor: 'pointer', font: 'var(--text-heading)' }}>Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Modal */}
      <AnimatePresence>
        {showResumeModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: 'var(--bg-primary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-modal)', border: '1px solid var(--glass-border)', width: '100%', maxWidth: '500px' }}
            >
              <h2 style={{ font: 'var(--text-metric)', marginBottom: 'var(--space-5)' }}>Add Resume</h2>
              <form onSubmit={handleCreateResume} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', font: 'var(--text-label)', color: 'var(--text-2)', marginBottom: '8px' }}>Title (e.g. "Software Eng v2")</label>
                  <input required value={resumeForm.title} onChange={e => setResumeForm({...resumeForm, title: e.target.value})} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--text-1)', padding: '12px', borderRadius: 'var(--radius-md)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', font: 'var(--text-label)', color: 'var(--text-2)', marginBottom: '8px' }}>Target Role (Optional)</label>
                  <input value={resumeForm.target_role} onChange={e => setResumeForm({...resumeForm, target_role: e.target.value})} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--text-1)', padding: '12px', borderRadius: 'var(--radius-md)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', font: 'var(--text-label)', color: 'var(--text-2)', marginBottom: '8px' }}>Link URL (Drive, Notion, etc)</label>
                  <input required type="url" value={resumeForm.link_url} onChange={e => setResumeForm({...resumeForm, link_url: e.target.value})} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--text-1)', padding: '12px', borderRadius: 'var(--radius-md)' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <button type="button" onClick={() => setShowResumeModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--text-1)', borderRadius: 'var(--radius-pill)', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--text-1)', border: 'none', color: 'var(--bg-primary)', borderRadius: 'var(--radius-pill)', cursor: 'pointer', font: 'var(--text-heading)' }}>Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
