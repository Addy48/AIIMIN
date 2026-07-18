import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';

const STATUS_CONFIG = {
  wishlist: { label: 'Wishlist', color: '#8C8C8C', icon: '📝' },
  applied: { label: 'Applied', color: '#556B2F', icon: '📤' },
  interview: { label: 'In Interview', color: '#E8B84B', icon: '👥' },
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('details'); // details, cover_letter, interview
  const [jdText, setJdText] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');

  const handleGenerateLetter = () => {
    if (!jdText) return;
    const name = user?.full_name || 'Applicant';
    const company = appForm.company_name || 'the company';
    const role = appForm.role_title || 'the open position';
    const today = formatDate(new Date());
    
    const template = `[Your Contact Information]
[Your Address]
[Your Email]
[Your Phone Number]

${today}

Hiring Manager
${company}

Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. With a proven track record of disciplined execution and a passion for continuous growth, I am confident in my ability to contribute meaningfully to your team.

${jdText ? `Having reviewed the job description, I am particularly drawn to your focus on [extract key requirement from JD: "${jdText.substring(0, 50)}..."].` : ''} My background has equipped me with the technical and collaborative skills necessary to excel in this environment. I am dedicated to maintaining high standards and iterating rapidly, principles that guide my daily work.

I would welcome the opportunity to discuss how my background, skills, and certifications will be of benefit to ${company}. Thank you for considering my application.

Sincerely,

${name}`;
    setGeneratedLetter(template);
  };

  const addQuestion = () => {
    const qs = appForm.interview_questions || [];
    setAppForm({ ...appForm, interview_questions: [...qs, { question: '', answer: '' }] });
  };

  const updateQuestion = (index, field, value) => {
    const qs = [...(appForm.interview_questions || [])];
    qs[index][field] = value;
    setAppForm({ ...appForm, interview_questions: qs });
  };

  return (
    <Modal isOpen={showAppModal} onClose={() => { setShowAppModal(false); setActiveTab('details'); setGeneratedLetter(''); setJdText(''); }} title={editingApp ? 'Update Application' : 'Opportunity Intake'} maxWidth="800px">
      {editingApp && (
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border)', marginBottom: '20px', paddingBottom: '10px' }}>
          <button onClick={() => setActiveTab('details')} style={{ background: 'none', border: 'none', color: activeTab === 'details' ? 'var(--color-accent)' : 'var(--text-2)', fontWeight: activeTab === 'details' ? 800 : 500, cursor: 'pointer', fontSize: '14px' }}>Details</button>
          <button onClick={() => setActiveTab('cover_letter')} style={{ background: 'none', border: 'none', color: activeTab === 'cover_letter' ? 'var(--color-accent)' : 'var(--text-2)', fontWeight: activeTab === 'cover_letter' ? 800 : 500, cursor: 'pointer', fontSize: '14px' }}>Cover Letter Generator</button>
          <button onClick={() => setActiveTab('interview')} style={{ background: 'none', border: 'none', color: activeTab === 'interview' ? 'var(--color-accent)' : 'var(--text-2)', fontWeight: activeTab === 'interview' ? 800 : 500, cursor: 'pointer', fontSize: '14px' }}>Interview Q&A Bank</button>
        </div>
      )}

      {activeTab === 'details' && (
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
          <form onSubmit={(e) => { e.preventDefault(); handleSaveApplication(e); }} className="application-intake-form">
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
      )}

      {activeTab === 'cover_letter' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label>Paste Job Description</label>
            <textarea rows={4} value={jdText} onChange={e => setJdText(e.target.value)} placeholder="Paste the JD here to extract key requirements..." />
          </div>
          <button type="button" onClick={handleGenerateLetter} className="btn-primary" style={{ alignSelf: 'flex-start' }}>Generate Draft</button>
          
          {generatedLetter && (
            <div className="input-group" style={{ marginTop: '16px' }}>
              <label>Generated Cover Letter Template</label>
              <textarea rows={12} value={generatedLetter} onChange={e => setGeneratedLetter(e.target.value)} style={{ fontFamily: 'monospace', lineHeight: 1.5 }} />
            </div>
          )}
        </div>
      )}

      {activeTab === 'interview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: 0 }}>Log questions you were asked to build your personal knowledge base.</p>
          {(appForm.interview_questions || []).map((q, i) => (
            <div key={i} style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div className="input-group" style={{ marginBottom: '12px' }}>
                <label>Question {i + 1}</label>
                <input value={q.question} onChange={e => updateQuestion(i, 'question', e.target.value)} placeholder="e.g. Tell me about a time you failed." />
              </div>
              <div className="input-group">
                <label>Your Answer / Strategy</label>
                <textarea rows={3} value={q.answer} onChange={e => updateQuestion(i, 'answer', e.target.value)} placeholder="e.g. Used STAR method to talk about..." />
              </div>
            </div>
          ))}
          <button type="button" onClick={addQuestion} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>+ Add Question</button>
          <div className="modal-action-row" style={{ marginTop: '24px' }}>
            <button type="button" onClick={(e) => handleSaveApplication(e)} className="btn-primary">Save Q&A</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
