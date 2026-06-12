import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ResumeArchiveModal({ 
  showResumeModal, 
  setShowResumeModal, 
  setUploadMode, 
  uploadMode, 
  handleCreateResume, 
  resumeForm, 
  setResumeForm, 
  selectedFile, 
  setSelectedFile 
}) {
  if (!showResumeModal) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowResumeModal(false)} style={{ position: 'absolute', inset: 0, background: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }} />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="modal-content" style={{ maxWidth: '440px', position: 'relative' }}>
          <button type="button" onClick={() => setShowResumeModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
          <h2 style={{ fontSize: '28px', fontWeight: 500, fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>Archive Version</h2>
          
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px', gap: '16px' }}>
            <button 
              type="button" 
              onClick={() => setUploadMode('file')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: 'none',
                fontSize: '13px',
                fontWeight: 600,
                color: uploadMode === 'file' ? 'var(--color-rust)' : 'var(--text-3)',
                borderBottom: uploadMode === 'file' ? '2px solid var(--color-rust)' : 'none',
                cursor: 'pointer'
              }}
            >
              📁 Upload PDF File
            </button>
            <button 
              type="button" 
              onClick={() => setUploadMode('link')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: 'none',
                fontSize: '13px',
                fontWeight: 600,
                color: uploadMode === 'link' ? 'var(--color-rust)' : 'var(--text-3)',
                borderBottom: uploadMode === 'link' ? '2px solid var(--color-rust)' : 'none',
                cursor: 'pointer'
              }}
            >
              🔗 Shareable Link
            </button>
          </div>

          <form onSubmit={handleCreateResume} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="input-group">
              <label>Version Descriptor</label>
              <input required value={resumeForm.title} onChange={e => setResumeForm({...resumeForm, title: e.target.value})} placeholder="e.g. Fintech SDE - v2" />
            </div>
            <div className="input-group">
              <label>Target Role / Industry</label>
              <input required value={resumeForm.target_role} onChange={e => setResumeForm({...resumeForm, target_role: e.target.value})} placeholder="e.g. Web3, Backend, Product" />
            </div>

            {uploadMode === 'file' ? (
              <div className="input-group">
                <label>PDF Document</label>
                <div style={{
                  border: '2px dashed var(--border)',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: 'var(--bg-elevated)',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    required={uploadMode === 'file'}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedFile(file);
                        if (!resumeForm.title || resumeForm.title === '') {
                          const baseName = file.name.replace(/\.[^/.]+$/, "");
                          setResumeForm(prev => ({ ...prev, title: baseName }));
                        }
                      }
                    }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📄</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)', display: 'block' }}>
                    {selectedFile ? selectedFile.name : 'Select or drop resume PDF'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-3)', display: 'block', marginTop: '4px' }}>
                    {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF only, max 10MB'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label>Google Drive Share Link</label>
                <input required={uploadMode === 'link'} value={resumeForm.link_url} onChange={e => setResumeForm({...resumeForm, link_url: e.target.value})} placeholder="https://drive.google.com/..." />
                <p style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '6px' }}>Ensure link is set to "Anyone with the link can view" for the preview to work.</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button type="button" onClick={() => { setShowResumeModal(false); setSelectedFile(null); }} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Archive to Vault</button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
