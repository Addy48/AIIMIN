import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { fvApi, RELATIONS, BLOOD_GROUPS, AVATAR_COLORS, CloseBtn, Field, maskNumber } from './fvUtils';

/* ── Avatar ── */
const Avatar = ({ member }) => (
  <div style={{
    width:'48px', height:'48px', borderRadius:'50%',
    background: member.avatar_color || '#3B82F6',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'20px', fontWeight:900, color:'#fff', flexShrink:0,
    boxShadow:`0 0 0 2px ${member.avatar_color || '#3B82F6'}33`,
  }}>
    {(member.name||'?').charAt(0).toUpperCase()}
  </div>
);

/* ── Add/Edit Modal ── */
const MemberModal = ({ member, onClose, onSave }) => {
  const isEdit = !!member?.id;
  const [form, setForm] = useState({
    name: member?.name || '',
    relation: member?.relation || 'Self',
    dob: member?.dob || '',
    phone: member?.phone || '',
    email: member?.email || '',
    blood_group: member?.blood_group || '',
    profile_note: member?.profile_note || '',
    avatar_color: member?.avatar_color || '#3B82F6',
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const result = isEdit ? await fvApi.updateMember(member.id, form) : await fvApi.addMember(form);
      onSave(result);
    } catch { } finally { setSaving(false); }
  };

  const inp = { className: 'fv-input' };
  const sel = { className: 'fv-input fv-select' };

  return (
    <div className="fv-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fv-modal">
        <div className="fv-modal-hdr">
          <h3 className="fv-modal-title">{isEdit ? 'Edit Member' : 'Add Family Member'}</h3>
          <CloseBtn onClick={onClose} />
        </div>

        {/* Avatar color picker */}
        <div style={{ marginBottom:'20px' }}>
          <label className="fv-label">Avatar Color</label>
          <div style={{ display:'flex', gap:'8px', marginTop:'6px' }}>
            {AVATAR_COLORS.map(c => (
              <button key={c} onClick={() => set('avatar_color', c)} style={{
                width:'30px', height:'30px', borderRadius:'50%', background:c, border:'none',
                outline: form.avatar_color === c ? `3px solid ${c}` : 'none',
                outlineOffset:'2px', cursor:'pointer', boxShadow: form.avatar_color === c ? `0 0 0 2px var(--color-bg)` : 'none',
              }} />
            ))}
          </div>
          {/* Preview */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginTop:'12px' }}>
            <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:form.avatar_color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:900, color:'#fff' }}>
              {(form.name||'?').charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize:'13px', color:'var(--color-text-2)', fontWeight:600 }}>{form.name || 'Preview'}</span>
          </div>
        </div>

        <div className="fv-form-grid">
          <Field label="Full Name"><input {...inp} placeholder="e.g. Rahul Kumar" value={form.name} onChange={e => set('name', e.target.value)} /></Field>
          <Field label="Relation">
            <select {...sel} value={form.relation} onChange={e => set('relation', e.target.value)}>
              {RELATIONS.map(r => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Date of Birth"><input {...inp} type="date" value={form.dob} onChange={e => set('dob', e.target.value)} /></Field>
          <Field label="Blood Group">
            <select {...sel} value={form.blood_group} onChange={e => set('blood_group', e.target.value)}>
              <option value="">Unknown</option>
              {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Phone"><input {...inp} placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} /></Field>
          <Field label="Email (optional)"><input {...inp} type="email" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} /></Field>
          <Field label="Note (optional)" full><input {...inp} placeholder="Any important note about this member..." value={form.profile_note} onChange={e => set('profile_note', e.target.value)} /></Field>
        </div>

        <button onClick={submit} disabled={!form.name.trim() || saving} style={{ marginTop:'20px', width:'100%', padding:'13px', background:'var(--color-accent)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'13px', fontWeight:800, cursor:'pointer', fontFamily:'inherit', opacity: form.name.trim() ? 1 : 0.5 }}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Member'}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   MEMBERS TAB
══════════════════════════════════════ */
export default function MembersTab() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | member-object

  useEffect(() => {
    fvApi.getMembers().then(setMembers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = (saved) => {
    setMembers(prev => {
      const idx = prev.findIndex(m => m.id === saved.id);
      if (idx >= 0) { const u = [...prev]; u[idx] = saved; return u; }
      return [saved, ...prev];
    });
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this member? This will also delete their linked documents.')) return;
    await fvApi.deleteMember(id);
    setMembers(p => p.filter(m => m.id !== id));
  };

  const today = new Date();
  const getAge = (dob) => {
    if (!dob) return null;
    const d = new Date(dob);
    let age = today.getFullYear() - d.getFullYear();
    if (today.getMonth() < d.getMonth() || (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())) age--;
    return age;
  };

  const isBirthday = (dob) => {
    if (!dob) return false;
    const d = new Date(dob);
    return d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  };

  if (loading) return <div style={{ padding:'40px', textAlign:'center', color:'var(--color-text-3)' }}>Loading members…</div>;

  return (
    <>
      <div className="fv-section-hdr">
        <div>
          <h2 style={{ margin:0, fontSize:'18px', fontWeight:900, color:'var(--color-text-1)' }}>Family Members</h2>
          <p style={{ margin:'4px 0 0', fontSize:'12px', color:'var(--color-text-3)' }}>{members.length} member{members.length !== 1 ? 's' : ''} in your vault</p>
        </div>
        <button className="fv-btn-add" onClick={() => setModal('add')}>
          <Plus size={14} /> Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="fv-empty">
          <div className="fv-empty-icon">👨‍👩‍👧</div>
          <div className="fv-empty-title">No members yet</div>
          <div className="fv-empty-sub">Add your family members to start tracking documents, health records, and insurance in one place.</div>
          <button className="fv-btn-add" onClick={() => setModal('add')} style={{ marginTop:'8px' }}><Plus size={13} /> Add First Member</button>
        </div>
      ) : (
        <div className="fv-grid">
          {members.map(m => {
            const age = getAge(m.dob);
            const birthday = isBirthday(m.dob);
            return (
              <div key={m.id} className="fv-card">
                <div style={{ display:'flex', gap:'14px', alignItems:'flex-start' }}>
                  <Avatar member={m} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'15px', fontWeight:800, color:'var(--color-text-1)' }}>{m.name}</span>
                      {birthday && <span style={{ fontSize:'11px' }}>🎂 Birthday!</span>}
                    </div>
                    <div style={{ fontSize:'11px', color:'var(--color-text-3)', marginTop:'2px' }}>
                      {m.relation}{age !== null ? ` · ${age} yrs` : ''}{m.blood_group ? ` · ${m.blood_group}` : ''}
                    </div>
                    {m.phone && <div style={{ fontSize:'12px', color:'var(--color-text-2)', marginTop:'8px', fontFamily:'var(--font-mono, monospace)' }}>{m.phone}</div>}
                    {m.email && <div style={{ fontSize:'11px', color:'var(--color-text-3)', marginTop:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.email}</div>}
                    {m.profile_note && <div style={{ fontSize:'11px', color:'var(--color-text-3)', marginTop:'6px', fontStyle:'italic' }}>{m.profile_note}</div>}
                  </div>
                  <div style={{ display:'flex', gap:'4px', flexShrink:0 }}>
                    <button onClick={() => setModal(m)} className="fv-btn-ghost" style={{ padding:'6px 8px' }}><Edit2 size={12} /></button>
                    <button onClick={() => handleDelete(m.id)} className="fv-btn-danger"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <MemberModal
          member={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
