// Shared utilities for Family Vault tabs
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';

export const BASE = '/family';

export const fvApi = {
  // Members
  getMembers: () => apiGet(`${BASE}/members`),
  addMember: (d) => apiPost(`${BASE}/members`, d),
  updateMember: (id, d) => apiPut(`${BASE}/members/${id}`, d),
  deleteMember: (id) => apiDelete(`${BASE}/members/${id}`),

  // Documents
  getDocs: () => apiGet(`${BASE}/documents`),
  addDoc: (d) => apiPost(`${BASE}/documents`, d),
  updateDoc: (id, d) => apiPut(`${BASE}/documents/${id}`, d),
  deleteDoc: (id) => apiDelete(`${BASE}/documents/${id}`),

  // Insurance
  getInsurance: () => apiGet(`${BASE}/insurance`),
  addInsurance: (d) => apiPost(`${BASE}/insurance`, d),
  updateInsurance: (id, d) => apiPut(`${BASE}/insurance/${id}`, d),
  deleteInsurance: (id) => apiDelete(`${BASE}/insurance/${id}`),

  // Health
  getHealth: () => apiGet(`${BASE}/health-records`),
  saveHealth: (d) => apiPost(`${BASE}/health-records`, d),

  // Reminders
  getReminders: (done = false) => apiGet(`${BASE}/reminders?done=${done}`),
  addReminder: (d) => apiPost(`${BASE}/reminders`, d),
  toggleReminder: (id, is_done) => fetch(`/api${BASE}/reminders/${id}/done`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_done }), credentials: 'include' }).then(r => r.json()),
  deleteReminder: (id) => apiDelete(`${BASE}/reminders/${id}`),

  // Emergency
  getEmergency: () => apiGet(`${BASE}/emergency`),
  addEmergency: (d) => apiPost(`${BASE}/emergency`, d),
  pinEmergency: (id, is_pinned) => fetch(`/api${BASE}/emergency/${id}/pin`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_pinned }), credentials: 'include' }).then(r => r.json()),
  deleteEmergency: (id) => apiDelete(`${BASE}/emergency/${id}`),
};

/* ── Helpers ── */
export const getDaysUntil = (dateStr) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
};

export const expiryClass = (days) => {
  if (days === null) return 'exp-none';
  if (days < 0) return 'exp-crit';
  if (days <= 30) return 'exp-crit';
  if (days <= 90) return 'exp-warn';
  return 'exp-ok';
};

export const expiryLabel = (days) => {
  if (days === null) return '—';
  if (days < 0) return `Expired ${Math.abs(days)}d ago`;
  if (days === 0) return 'Expires today!';
  if (days <= 30) return `Expires in ${days}d`;
  if (days <= 90) return `${Math.floor(days / 30)}mo ${days % 30}d`;
  return new Date(Date.now() + days * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
};

export const maskNumber = (num) => {
  if (!num) return '—';
  const s = String(num).replace(/\s/g, '');
  if (s.length <= 4) return s;
  return '•'.repeat(s.length - 4) + s.slice(-4);
};

export const RELATIONS = ['Father','Mother','Spouse','Son','Daughter','Brother','Sister','Self','Other'];
export const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
export const DOC_TYPES = ['Aadhaar','PAN','Passport','Driving Licence','Voter ID','Birth Certificate','Property Document','Other'];
export const INS_TYPES = ['life','health','vehicle','term','pension','property','other'];
export const AVATAR_COLORS = ['#3B82F6','#22C55E','#F59E0B','#EC4899','#8B5CF6','#06B6D4','#EF4444','#F97316'];

/* ── Close Button ── */
export const CloseBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-3)', padding:'4px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  </button>
);

/* ── Field wrapper ── */
export const Field = ({ label, children, full }) => (
  <div style={full ? { gridColumn: '1/-1' } : {}}>
    <label className="fv-label">{label}</label>
    {children}
  </div>
);
