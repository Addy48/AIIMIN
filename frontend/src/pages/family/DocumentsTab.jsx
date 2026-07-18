import React, { useState, useEffect } from 'react';
import { Plus, Eye, EyeOff, Trash2, Edit2 } from 'lucide-react';
import { fvApi, DOC_TYPES, CloseBtn, Field, getDaysUntil, expiryClass, expiryLabel, maskNumber } from './fvUtils';
import { formatDate } from '../../utils/formatDate';

import Modal from '../../components/ui/Modal';

/* ── Add/Edit Doc Modal ── */
const DocModal = ({ doc, members, onClose, onSave }) => {
  const isEdit = !!doc?.id;
  const [form, setForm] = useState({
    member_id: doc?.member_id || (members[0]?.id || ''),
    doc_type: doc?.doc_type || 'Aadhaar',
    doc_number: doc?.doc_number || '',
    issue_date: doc?.issue_date || '',
    expiry_date: doc?.expiry_date || '',
    issuing_country: doc?.issuing_country || 'India',
    notes: doc?.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.member_id || !form.doc_type) return;
    setSaving(true);
    try {
      const result = isEdit ? await fvApi.updateDoc(doc.id, form) : await fvApi.addDoc(form);
      onSave(result);
    } catch { } finally { setSaving(false); }
  };

  const inp = { className: 'fv-input' };
  const sel = { className: 'fv-input fv-select' };

  return (
    <Modal isOpen={true} onClose={onClose} title={isEdit ? 'Edit Document' : 'Add Document'} maxWidth="500px">
        <div className="fv-form-grid">
          <Field label="Member" full>
            <select {...sel} value={form.member_id} onChange={e => set('member_id', e.target.value)}>
              {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>)}
            </select>
          </Field>
          <Field label="Document Type">
            <select {...sel} value={form.doc_type} onChange={e => set('doc_type', e.target.value)}>
              {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Issuing Country">
            <input {...inp} placeholder="India" value={form.issuing_country} onChange={e => set('issuing_country', e.target.value)} />
          </Field>
          <Field label="Document Number" full>
            <input {...inp} placeholder="e.g. 1234 5678 9012" value={form.doc_number} onChange={e => set('doc_number', e.target.value)} />
            <div style={{ fontSize:'10px', color:'var(--color-text-3)', marginTop:'4px' }}>Stored securely. Shown masked by default.</div>
          </Field>
          <Field label="Issue Date">
            <input {...inp} type="date" value={form.issue_date} onChange={e => set('issue_date', e.target.value)} />
          </Field>
          <Field label="Expiry Date">
            <input {...inp} type="date" value={form.expiry_date} onChange={e => set('expiry_date', e.target.value)} />
          </Field>
          <Field label="Notes (optional)" full>
            <input {...inp} placeholder="e.g. stored in locker, renewal pending..." value={form.notes} onChange={e => set('notes', e.target.value)} />
          </Field>
        </div>

        <button onClick={submit} disabled={saving} style={{ marginTop:'20px', width:'100%', padding:'13px', background:'var(--color-accent)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'13px', fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Document'}
        </button>
    </Modal>
  );
};

/* ── Doc card ── */
const DocCard = ({ doc, onEdit, onDelete }) => {
  const [revealed, setRevealed] = useState(false);
  const days = getDaysUntil(doc.expiry_date);
  const cls = expiryClass(days);

  return (
    <div className="fv-card">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
            <span style={{ fontSize:'13px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--color-accent)' }}>
              {doc.doc_type}
            </span>
            {doc.expiry_date && (
              <span className={`fv-badge ${cls}`} style={{ background: cls === 'exp-ok' ? 'rgba(34,197,94,0.1)' : cls === 'exp-warn' ? 'rgba(245,158,11,0.1)' : cls === 'exp-crit' ? 'rgba(239,68,68,0.1)' : 'transparent' }}>
                {expiryLabel(days)}
              </span>
            )}
          </div>
          <div style={{ fontSize:'12px', color:'var(--color-text-3)', marginBottom:'10px' }}>
            {doc.member_name} · {doc.member_relation}
          </div>
          {doc.doc_number && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span className="fv-masked" onClick={() => setRevealed(r => !r)}>
                {revealed ? doc.doc_number : maskNumber(doc.doc_number)}
              </span>
              <button onClick={() => setRevealed(r => !r)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-3)', padding:0 }}>
                {revealed ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:'4px' }}>
          <button onClick={onEdit} className="fv-btn-ghost" style={{ padding:'6px 8px' }}><Edit2 size={12} /></button>
          <button onClick={onDelete} className="fv-btn-danger"><Trash2 size={13} /></button>
        </div>
      </div>
      {(doc.issue_date || doc.expiry_date) && (
        <div style={{ marginTop:'12px', display:'flex', gap:'20px', fontSize:'11px', color:'var(--color-text-3)' }}>
          {doc.issue_date && <span>Issued: {formatDate(doc.issue_date)}</span>}
          {doc.expiry_date && <span>Expires: {formatDate(doc.expiry_date)}</span>}
        </div>
      )}
      {doc.notes && <div style={{ marginTop:'8px', fontSize:'11px', color:'var(--color-text-3)', fontStyle:'italic' }}>{doc.notes}</div>}
    </div>
  );
};

/* ══════════════════════════════════════
   DOCUMENTS TAB
══════════════════════════════════════ */
export default function DocumentsTab() {
  const [docs, setDocs] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    Promise.all([fvApi.getDocs(), fvApi.getMembers()])
      .then(([d, m]) => { setDocs(d); setMembers(m); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (saved) => {
    setDocs(prev => {
      const idx = prev.findIndex(d => d.id === saved.id);
      if (idx >= 0) { const u = [...prev]; u[idx] = saved; return u; }
      return [saved, ...prev];
    });
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    await fvApi.deleteDoc(id);
    setDocs(p => p.filter(d => d.id !== id));
  };

  const docTypes = ['All', ...new Set(docs.map(d => d.doc_type))];
  const filtered = filter === 'All' ? docs : docs.filter(d => d.doc_type === filter);

  if (loading) return <div style={{ padding:'40px', textAlign:'center', color:'var(--color-text-3)' }}>Loading documents…</div>;

  return (
    <>
      <div className="fv-section-hdr">
        <div>
          <h2 style={{ margin:0, fontSize:'18px', fontWeight:900, color:'var(--color-text-1)' }}>Documents</h2>
          <p style={{ margin:'4px 0 0', fontSize:'12px', color:'var(--color-text-3)' }}>{docs.length} document{docs.length !== 1 ? 's' : ''} stored</p>
        </div>
        <button className="fv-btn-add" onClick={() => members.length ? setModal('add') : alert('Add a family member first.')}><Plus size={14} /> Add Document</button>
      </div>

      {/* Filter pills */}
      {docTypes.length > 1 && (
        <div style={{ display:'flex', gap:'6px', marginBottom:'20px', flexWrap:'wrap' }}>
          {docTypes.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding:'5px 14px', borderRadius:'99px', border:`1px solid ${filter===t ? 'var(--color-accent)' : 'var(--color-border)'}`,
              background: filter===t ? 'var(--color-accent)' : 'transparent',
              color: filter===t ? '#fff' : 'var(--color-text-2)',
              fontSize:'11px', fontWeight:700, cursor:'pointer', fontFamily:'inherit',
            }}>{t}</button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="fv-empty">
          <div className="fv-empty-icon">🪪</div>
          <div className="fv-empty-title">No documents yet</div>
          <div className="fv-empty-sub">Add Aadhaar, PAN, Passport, and other important documents for each family member.</div>
          {members.length > 0 && <button className="fv-btn-add" onClick={() => setModal('add')} style={{ marginTop:'8px' }}><Plus size={13} /> Add Document</button>}
          {members.length === 0 && <p style={{ fontSize:'12px', color:'var(--color-text-3)' }}>Add a family member first from the Members tab.</p>}
        </div>
      ) : (
        <div className="fv-grid">
          {filtered.map(d => (
            <DocCard key={d.id} doc={d} onEdit={() => setModal(d)} onDelete={() => handleDelete(d.id)} />
          ))}
        </div>
      )}

      {modal && (
        <DocModal
          doc={modal === 'add' ? null : modal}
          members={members}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
