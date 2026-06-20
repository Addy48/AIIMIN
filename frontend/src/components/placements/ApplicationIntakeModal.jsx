import React from 'react';
import Modal from '../ui/Modal';

const STATUS_CONFIG = {
  wishlist: { label: 'Wishlist', color: '#8C8C8C', icon: '📝' },
  applied: { label: 'Applied', color: '#556B2F', icon: '📤' },
  interview: { label: 'Interview', color: '#E2725B', icon: '👥' },
  offer: { label: 'Offer', color: '#23503B', icon: '✨' },
  rejected: { label: 'Rejected', color: '#1C1C1C', icon: '✖️' }
};

export default function ApplicationIntakeModal({ 
  showAppModal, 
  setShowAppModal, 
  editingApp, 
  appForm, 
  setAppForm, 
  resumes, 
  handleSaveApplication 
}) {
  return (
    <Modal isOpen={showAppModal} onClose={() => setShowAppModal(false)} title={editingApp ? 'Update Application' : 'Opportunity Intake'} maxWidth="800px">
          <div className="application-intake-layout">
            <aside className="application-intake-rail">
              <div>
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
                  <input required value={appForm.company_name} onChange={e => setAppForm({...appForm, company_name: e.target.value})} placeholder="e.g. TechCorp" />
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
    </Modal>
  );
}
