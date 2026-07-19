import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../utils/supabase';
import PageHeader from '../components/layout/PageHeader';
import FamilyCardMenu from '../components/family/FamilyCardMenu';
import FamilyRecordDetails from '../components/family/FamilyRecordDetails';
import { Plus, X, Shield, FileText, Heart, Activity, Clock, AlertTriangle, Eye, EyeOff, Car, Wallet, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatDate, formatINR } from '../utils/formatDate';
import { DOC_TYPE_LABELS, labelEnum } from '../utils/enumLabels';

const TAB_CLUSTERS = [
  {
    id: 'people',
    label: 'People',
    tabs: [
      { id: 'members', label: 'Members', icon: Shield },
      { id: 'relationships', label: 'Relationships', icon: Users },
      { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
    ],
  },
  {
    id: 'records',
    label: 'Records',
    tabs: [
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'insurance', label: 'Insurance', icon: Heart },
      { id: 'health', label: 'Health', icon: Activity },
      { id: 'vehicles', label: 'Vehicles', icon: Car },
      { id: 'finance', label: 'Finance', icon: Wallet },
      { id: 'reminders', label: 'Reminders', icon: Clock },
    ],
  },
];

const archiveStorageKey = (userId) => `aiimin_family_archived_${userId}`;

const loadArchivedKeys = (userId) => {
  if (!userId) return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(archiveStorageKey(userId)) || '[]'));
  } catch {
    return new Set();
  }
};

const saveArchivedKeys = (userId, keys) => {
  if (!userId) return;
  localStorage.setItem(archiveStorageKey(userId), JSON.stringify([...keys]));
};

/* ── Generic Modal ── */
const Modal = ({ isOpen, onClose, title, children }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key={`modal-overlay-${title}`}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999,
            padding: '20px'
          }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px',
              padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px var(--border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-1)', margin: 0 }}>{title}</h2>
              <button onClick={onClose} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-2)', transition: 'all 0.2s' }}>
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

/* ── Masked Text ── */
const MaskedText = ({ text }) => {
  const [revealed, setRevealed] = useState(false);
  if (!text) return null;
  
  let masked = text;
  if (text.length > 4) {
    masked = text.slice(0, -4).replace(/./g, 'X') + text.slice(-4);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono)' }}>
        {revealed ? text : masked}
      </span>
      <button onClick={() => setRevealed(!revealed)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-3)', padding: 0 }}>
        {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
};


const EmptyState = ({ icon: Icon, title, description, buttonText, onAction }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'var(--color-surface)', borderRadius: '24px', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
    <div style={{ width: '64px', height: '64px', background: 'var(--color-elevated)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-text-2)' }}>
      <Icon size={32} />
    </div>
    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', margin: '0 0 8px 0' }}>{title}</h3>
    <p style={{ fontSize: '14px', color: 'var(--color-text-3)', maxWidth: '400px', lineHeight: 1.6, margin: '0 0 24px 0' }}>{description}</p>
    <button onClick={onAction} style={{ background: 'var(--color-text-1)', color: 'var(--color-base)', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Plus size={16} /> {buttonText}
    </button>
  </div>
);

export default function FamilyPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('members');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [members, setMembers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [health, setHealth] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [finance, setFinance] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [emergency, setEmergency] = useState([]);

  // Modal States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isInsModalOpen, setIsInsModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const [editMember, setEditMember] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [editIns, setEditIns] = useState(null);
  const [editHealth, setEditHealth] = useState(null);
  const [editVehicle, setEditVehicle] = useState(null);
  const [editFinance, setEditFinance] = useState(null);
  const [editRelationship, setEditRelationship] = useState(null);
  const [editReminder, setEditReminder] = useState(null);
  const [editEmergency, setEditEmergency] = useState(null);
  const [detailView, setDetailView] = useState(null);
  const [archivedKeys, setArchivedKeys] = useState(() => loadArchivedKeys(user?.id));

  useEffect(() => {
    setArchivedKeys(loadArchivedKeys(user?.id));
  }, [user?.id]);

  const isArchived = useCallback((table, id) => archivedKeys.has(`${table}:${id}`), [archivedKeys]);

  const filterVisible = useCallback((table, rows) => (
    (rows || []).filter((row) => !isArchived(table, row.id))
  ), [isArchived]);

  const visibleMembers = useMemo(() => filterVisible('family_members', members), [filterVisible, members]);
  const visibleDocuments = useMemo(() => filterVisible('family_documents', documents), [filterVisible, documents]);
  const visibleInsurance = useMemo(() => filterVisible('family_insurance', insurance), [filterVisible, insurance]);
  const visibleHealth = useMemo(() => filterVisible('family_health', health), [filterVisible, health]);
  const visibleVehicles = useMemo(() => filterVisible('family_vehicles', vehicles), [filterVisible, vehicles]);
  const visibleFinance = useMemo(() => filterVisible('family_finance', finance), [filterVisible, finance]);
  const visibleRelationships = useMemo(() => filterVisible('family_relationships', relationships), [filterVisible, relationships]);
  const visibleReminders = useMemo(() => filterVisible('family_reminders', reminders), [filterVisible, reminders]);
  const visibleEmergency = useMemo(() => filterVisible('family_emergency_contacts', emergency), [filterVisible, emergency]);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000));
      const fetchPromise = Promise.all([
        supabase.from('family_members').select('*').order('created_at', { ascending: true }),
        supabase.from('family_documents').select('*').order('created_at', { ascending: false }),
        supabase.from('family_insurance').select('*').order('created_at', { ascending: false }),
        supabase.from('family_health').select('*').order('created_at', { ascending: false }),
        supabase.from('family_vehicles').select('*').order('created_at', { ascending: false }),
        supabase.from('family_finance').select('*').order('created_at', { ascending: false }),
        supabase.from('family_relationships').select('*').order('created_at', { ascending: false }),
        supabase.from('family_reminders').select('*').order('due_date', { ascending: true }),
        supabase.from('family_emergency_contacts').select('*').order('is_pinned', { ascending: false })
      ]);

      const [m, d, i, h, v, f, rel, r, e] = await Promise.race([fetchPromise, timeoutPromise]);
      setMembers(m.data || []);
      setDocuments(d.data || []);
      setInsurance(i.data || []);
      setHealth(h.data || []);
      setVehicles(v.data || []);
      setFinance(f.data || []);
      setRelationships(rel.data || []);
      setReminders(r.data || []);
      setEmergency(e.data || []);
    } catch (error) {
      console.error('Error fetching family data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const autoCreateReminder = async (title, dueDate, sourceType, sourceId) => {
    if (!dueDate) return;
    // Reminder 30 days before due date
    const targetDate = new Date(dueDate);
    targetDate.setDate(targetDate.getDate() - 30);

    const { error } = await supabase.from('family_reminders').insert({
      user_id: user.id,
      title: `Upcoming: ${title}`,
      description: `Auto-generated reminder for 30 days prior to expiry/renewal.`,
      due_date: targetDate.toISOString().split('T')[0],
      is_auto_generated: true,
      source_type: sourceType,
      source_id: sourceId
    });
    if (error) console.error('Failed to auto-create reminder:', error);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get('name'),
      relation: fd.get('relation'),
      dob: fd.get('dob') || null,
      blood_group: fd.get('blood_group'),
      phone: fd.get('phone'),
    };
    const { error } = editMember
      ? await supabase.from('family_members').update(payload).eq('id', editMember.id)
      : await supabase.from('family_members').insert({ user_id: user.id, ...payload }).select();
    if (error) toast.error(editMember ? 'Failed to update member' : 'Failed to add member');
    else {
      toast.success(editMember ? 'Member updated' : 'Member added');
      closeModal(setIsMemberModalOpen, setEditMember);
      fetchData();
    }
  };

  const handleAddDoc = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      member_id: fd.get('member_id'),
      doc_type: fd.get('doc_type'),
      doc_number: fd.get('doc_number'),
      expiry_date: fd.get('expiry_date') || null,
    };
    if (editDoc) {
      const { error } = await supabase.from('family_documents').update(payload).eq('id', editDoc.id);
      if (error) toast.error('Failed to update document');
      else { toast.success('Document updated'); closeModal(setIsDocModalOpen, setEditDoc); fetchData(); }
      return;
    }
    const { data, error } = await supabase.from('family_documents').insert({ user_id: user.id, ...payload }).select();
    if (error) toast.error('Failed to add document');
    else { 
      toast.success('Document added'); 
      if (fd.get('expiry_date')) {
        await autoCreateReminder(`${fd.get('doc_type')} Expiry`, fd.get('expiry_date'), 'document_expiry', data[0].id);
      }
      closeModal(setIsDocModalOpen, setEditDoc);
      fetchData(); 
    }
  };

  const handleAddIns = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      member_id: fd.get('member_id'),
      policy_name: fd.get('policy_name'),
      provider: fd.get('provider'),
      policy_number: fd.get('policy_number'),
      premium_amount: fd.get('premium_amount') ? parseFloat(fd.get('premium_amount')) : null,
      renewal_date: fd.get('renewal_date') || null,
      nominee: fd.get('nominee'),
    };
    if (editIns) {
      const { error } = await supabase.from('family_insurance').update(payload).eq('id', editIns.id);
      if (error) toast.error('Failed to update insurance');
      else { toast.success('Insurance updated'); closeModal(setIsInsModalOpen, setEditIns); fetchData(); }
      return;
    }
    const { data, error } = await supabase.from('family_insurance').insert({ user_id: user.id, ...payload }).select();
    if (error) toast.error('Failed to add insurance');
    else { 
      toast.success('Insurance added'); 
      if (fd.get('renewal_date')) {
        await autoCreateReminder(`${fd.get('policy_name')} Premium`, fd.get('renewal_date'), 'insurance_renewal', data[0].id);
      }
      closeModal(setIsInsModalOpen, setEditIns);
      fetchData(); 
    }
  };

  const handleAddHealth = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      member_id: fd.get('member_id'),
      allergies: fd.get('allergies'),
      conditions: fd.get('conditions'),
      medications: fd.get('medications'),
      doctor_name: fd.get('doctor_name'),
      doctor_phone: fd.get('doctor_phone'),
    };
    const { error } = editHealth
      ? await supabase.from('family_health').update(payload).eq('id', editHealth.id)
      : await supabase.from('family_health').insert({ user_id: user.id, ...payload });
    if (error) toast.error(editHealth ? 'Failed to update health profile' : 'Failed to add health profile');
    else {
      toast.success(editHealth ? 'Health profile updated' : 'Health profile added');
      closeModal(setIsHealthModalOpen, setEditHealth);
      fetchData();
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      make_model: fd.get('make_model'),
      registration_number: fd.get('registration_number'),
      insurance_provider: fd.get('insurance_provider'),
      insurance_expiry: fd.get('insurance_expiry') || null,
      puc_expiry: fd.get('puc_expiry') || null,
      service_due_date: fd.get('service_due_date') || null,
    };
    if (editVehicle) {
      const { error } = await supabase.from('family_vehicles').update(payload).eq('id', editVehicle.id);
      if (error) toast.error('Failed to update vehicle');
      else { toast.success('Vehicle updated'); closeModal(setIsVehicleModalOpen, setEditVehicle); fetchData(); }
      return;
    }
    const { data, error } = await supabase.from('family_vehicles').insert({ user_id: user.id, ...payload }).select();
    if (error) toast.error('Failed to add vehicle');
    else {
      toast.success('Vehicle added');
      if (fd.get('insurance_expiry')) {
        await autoCreateReminder(`${fd.get('registration_number')} Insurance Exp`, fd.get('insurance_expiry'), 'vehicle_insurance', data[0].id);
      }
      if (fd.get('puc_expiry')) {
        await autoCreateReminder(`${fd.get('registration_number')} PUC Exp`, fd.get('puc_expiry'), 'vehicle_puc', data[0].id);
      }
      closeModal(setIsVehicleModalOpen, setEditVehicle);
      fetchData();
    }
  };

  const handleAddFinance = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      member_id: fd.get('member_id') || null,
      account_type: fd.get('account_type'),
      institution_name: fd.get('institution_name'),
      account_number: fd.get('account_number'),
      current_balance: fd.get('current_balance') ? parseFloat(fd.get('current_balance')) : null,
      notes: fd.get('notes'),
    };
    const { error } = editFinance
      ? await supabase.from('family_finance').update(payload).eq('id', editFinance.id)
      : await supabase.from('family_finance').insert({ user_id: user.id, ...payload });
    if (error) toast.error(editFinance ? 'Failed to update finance record' : 'Failed to add finance record');
    else {
      toast.success(editFinance ? 'Finance record updated' : 'Finance record added');
      closeModal(setIsFinanceModalOpen, setEditFinance);
      fetchData();
    }
  };

  const handleAddRelationship = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get('name'),
      relation_type: fd.get('relation_type'),
      anniversary_date: fd.get('anniversary_date') || null,
      birthday: fd.get('birthday') || null,
      notes: fd.get('notes'),
    };
    const { error } = editRelationship
      ? await supabase.from('family_relationships').update(payload).eq('id', editRelationship.id)
      : await supabase.from('family_relationships').insert({ user_id: user.id, ...payload });
    if (error) toast.error(editRelationship ? 'Failed to update relationship' : 'Failed to add relationship record');
    else {
      toast.success(editRelationship ? 'Relationship updated' : 'Relationship record added');
      closeModal(setIsRelationshipModalOpen, setEditRelationship);
      fetchData();
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      title: fd.get('title'),
      description: fd.get('description'),
      due_date: fd.get('due_date'),
    };
    const { error } = editReminder
      ? await supabase.from('family_reminders').update(payload).eq('id', editReminder.id)
      : await supabase.from('family_reminders').insert({ user_id: user.id, ...payload });
    if (error) toast.error(editReminder ? 'Failed to update reminder' : 'Failed to add reminder');
    else {
      toast.success(editReminder ? 'Reminder updated' : 'Reminder added');
      closeModal(setIsReminderModalOpen, setEditReminder);
      fetchData();
    }
  };

  const handleAddEmergency = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get('name'),
      relation_or_role: fd.get('relation_or_role'),
      phone: fd.get('phone'),
      notes: fd.get('notes'),
      is_pinned: fd.get('is_pinned') === 'on',
    };
    const { error } = editEmergency
      ? await supabase.from('family_emergency_contacts').update(payload).eq('id', editEmergency.id)
      : await supabase.from('family_emergency_contacts').insert({ user_id: user.id, ...payload });
    if (error) toast.error(editEmergency ? 'Failed to update contact' : 'Failed to add contact');
    else {
      toast.success(editEmergency ? 'Contact updated' : 'Contact added');
      closeModal(setIsEmergencyModalOpen, setEditEmergency);
      fetchData();
    }
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else {
      toast.success('Deleted');
      const next = new Set(archivedKeys);
      next.delete(`${table}:${id}`);
      setArchivedKeys(next);
      saveArchivedKeys(user?.id, next);
      fetchData();
    }
  };

  const handleArchive = (table, id) => {
    const next = new Set(archivedKeys);
    next.add(`${table}:${id}`);
    setArchivedKeys(next);
    saveArchivedKeys(user?.id, next);
    toast.success('Archived');
  };

  const handleDuplicate = async (table, item, patch = {}) => {
    const { id, created_at, updated_at, user_id, ...rest } = item;
    const { error } = await supabase.from(table).insert({
      ...rest,
      ...patch,
      user_id: user.id,
    });
    if (error) toast.error('Failed to duplicate');
    else {
      toast.success('Duplicated');
      fetchData();
    }
  };

  const openAdd = (setter, clearEdit) => {
    clearEdit(null);
    setter(true);
  };

  const openEdit = (setter, setEdit, item) => {
    setEdit(item);
    setter(true);
  };

  const closeModal = (setter, clearEdit) => {
    setter(false);
    clearEdit(null);
  };

  const getMemberName = (id) => members.find(m => m.id === id)?.name || 'Unknown';

  const duplicatePatch = (kind, item) => {
    if (kind === 'member') return { name: `${item.name} (Copy)` };
    if (kind === 'relationship') return { name: `${item.name} (Copy)` };
    if (kind === 'reminder') return { title: `${item.title} (Copy)` };
    if (kind === 'emergency') return { name: `${item.name} (Copy)` };
    if (kind === 'finance') return { institution_name: `${item.institution_name} (Copy)` };
    if (kind === 'vehicle') return { registration_number: `${item.registration_number}-COPY` };
    if (kind === 'insurance') return { policy_name: `${item.policy_name} (Copy)` };
    return {};
  };

  if (loading) {
    return (
      <div className="page-container" style={{ opacity: 0.7, pointerEvents: 'none' }}>
        <PageHeader title="Family Vault." subtitle="Secure, centralized record of your family's vital information." />
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ width: '120px', height: '40px', background: 'var(--color-surface)', borderRadius: '12px', animation: 'aiimin-pulse 1.5s infinite' }} />
            ))}
          </div>
          <div style={{ 
            width: '100%', height: '400px', background: 'var(--color-surface)', 
            borderRadius: '24px', border: '1px solid var(--color-border)', 
            animation: 'aiimin-pulse 1.5s infinite' 
          }} />
        </div>
        <style>{`
          @keyframes aiimin-pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-container">
      <style>{`
        .family-input {
          width: 100%;
          padding: 12px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          color: var(--color-text-1);
          font-size: 14px;
          margin-bottom: 16px;
          transition: all 0.2s ease;
        }
        .family-input:focus {
          outline: none;
          border-color: var(--color-text-1);
          box-shadow: 0 0 0 2px var(--color-base), 0 0 0 4px var(--color-text-1);
        }
        .family-btn {
          width: 100%;
          padding: 14px;
          background: var(--color-text-1);
          color: var(--color-base);
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          margin-top: 8px;
          transition: transform 0.1s, opacity 0.2s;
        }
        .family-btn:hover {
          opacity: 0.9;
        }
        .family-btn:active {
          transform: scale(0.98);
        }
        .family-card-menu-trigger {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-elevated);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          color: var(--color-text-2);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .family-card-menu-trigger:hover {
          border-color: color-mix(in srgb, var(--color-accent) 40%, var(--color-border));
          color: var(--color-text-1);
        }
        .family-card-menu-panel {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 188px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 6px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.35);
          z-index: 20;
        }
        .family-card-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: none;
          background: transparent;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: background 0.12s;
        }
        .family-card-menu-item:hover {
          background: var(--color-elevated);
        }
      `}</style>
      <PageHeader 
        title="Family Vault." 
        subtitle="Secure central repository for family documents, insurance, and health."
      />

      {/* Family Overview Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.02) 100%)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '20px', borderRadius: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-2)', fontWeight: 600, marginBottom: '8px' }}>Total Members</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-1)' }}>{members.length}</div>
        </div>
        <div style={{ background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '20px', borderRadius: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-2)', fontWeight: 600, marginBottom: '8px' }}>Active Policies</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-1)' }}>{insurance.length}</div>
        </div>
        <div style={{ background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.02) 100%)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '20px', borderRadius: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-2)', fontWeight: 600, marginBottom: '8px' }}>Reminders</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-1)' }}>{reminders.length}</div>
        </div>
      </div>


      {/* Tabs — People / Records clusters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--color-border)', paddingBottom: 16, marginBottom: 32 }}>
        {TAB_CLUSTERS.map((cluster, ci) => (
          <div key={cluster.id} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-3)', minWidth: 56 }}>
              {cluster.label}
            </span>
            {ci > 0 && (
              <span aria-hidden style={{ width: 1, height: 22, background: 'var(--color-border)', marginRight: 4 }} />
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
              {cluster.tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                      background: active ? 'var(--color-text-1)' : 'transparent',
                      color: active ? 'var(--color-base)' : 'var(--color-text-2)',
                      border: active ? '1px solid var(--color-text-1)' : '1px solid var(--color-border)',
                      borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon size={16} /> {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          
          {/* MEMBERS TAB */}
          {activeTab === 'members' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => openAdd(setIsMemberModalOpen, setEditMember)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Member</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {visibleMembers.map(m => (
                <div key={m.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px', position: 'relative' }}>
                  <FamilyCardMenu
                    style={{ position: 'absolute', top: '24px', right: '24px' }}
                    onView={() => setDetailView({ kind: 'member', item: m })}
                    onEdit={() => openEdit(setIsMemberModalOpen, setEditMember, m)}
                    onDuplicate={() => handleDuplicate('family_members', m, duplicatePatch('member', m))}
                    onArchive={() => handleArchive('family_members', m.id)}
                    onDelete={() => handleDelete('family_members', m.id)}
                  />
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>{m.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{m.relation}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: 'var(--color-text-2)' }}>
                    <div><strong style={{ color: 'var(--color-text-1)' }}>DOB:</strong> <br/>{formatDate(m.dob)}</div>
                    <div><strong style={{ color: 'var(--color-text-1)' }}>Blood:</strong> <br/>{m.blood_group || '—'}</div>
                    <div style={{ gridColumn: 'span 2' }}><strong style={{ color: 'var(--color-text-1)' }}>Phone:</strong> <br/>{m.phone || '—'}</div>
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <EmptyState 
                  icon={Shield} 
                  title="No Family Members" 
                  description="Add family members to securely manage their documents, health records, and insurance policies in one place." 
                  buttonText="Add Member" 
                  onAction={() => setIsMemberModalOpen(true)} 
                />
              )}
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => openAdd(setIsDocModalOpen, setEditDoc)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Document</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {visibleDocuments.map(d => {
                const isExpiring = d.expiry_date && new Date(d.expiry_date) < new Date(Date.now() + 30 * 86400000);
                return (
                  <div key={d.id} style={{ background: 'var(--color-surface)', border: `1px solid ${isExpiring ? '#EF4444' : 'var(--color-border)'}`, borderRadius: '24px', padding: '24px', position: 'relative' }}>
                    <FamilyCardMenu
                      style={{ position: 'absolute', top: '24px', right: '24px' }}
                      onView={() => setDetailView({ kind: 'document', item: d })}
                      onEdit={() => openEdit(setIsDocModalOpen, setEditDoc, d)}
                      onDuplicate={() => handleDuplicate('family_documents', d)}
                      onArchive={() => handleArchive('family_documents', d.id)}
                      onDelete={() => handleDelete('family_documents', d.id)}
                    />
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{getMemberName(d.member_id)}</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '16px' }}>{labelEnum(d.doc_type, DOC_TYPE_LABELS)}</div>
                    
                    <div style={{ fontSize: '13px', color: 'var(--color-text-2)', marginBottom: '12px' }}>
                      <strong style={{ color: 'var(--color-text-1)', display: 'block', marginBottom: '4px' }}>Document No:</strong>
                      <MaskedText text={d.doc_number} />
                    </div>
                    {d.expiry_date && (
                      <div style={{ fontSize: '13px', color: isExpiring ? '#EF4444' : 'var(--color-text-2)' }}>
                        <strong style={{ color: isExpiring ? '#EF4444' : 'var(--color-text-1)' }}>Expiry:</strong> {formatDate(d.expiry_date)}
                      </div>
                    )}
                  </div>
                );
              })}
              {documents.length === 0 && (
                <EmptyState 
                  icon={FileText} 
                  title="No Documents Uploaded" 
                  description="Securely store passports, driver's licenses, and IDs. AIIMIN will remind you before they expire." 
                  buttonText="Add Document" 
                  onAction={() => setIsDocModalOpen(true)} 
                />
              )}
            </div>
          </div>
        )}

        {/* INSURANCE TAB */}
        {activeTab === 'insurance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => openAdd(setIsInsModalOpen, setEditIns)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Insurance</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {visibleInsurance.map(i => {
                const isExpiring = i.renewal_date && new Date(i.renewal_date) < new Date(Date.now() + 30 * 86400000);
                return (
                  <div key={i.id} style={{ background: 'var(--color-surface)', border: `1px solid ${isExpiring ? '#EF4444' : 'var(--color-border)'}`, borderRadius: '24px', padding: '24px', position: 'relative' }}>
                    <FamilyCardMenu
                      style={{ position: 'absolute', top: '24px', right: '24px' }}
                      onView={() => setDetailView({ kind: 'insurance', item: i })}
                      onEdit={() => openEdit(setIsInsModalOpen, setEditIns, i)}
                      onDuplicate={() => handleDuplicate('family_insurance', i, duplicatePatch('insurance', i))}
                      onArchive={() => handleArchive('family_insurance', i.id)}
                      onDelete={() => handleDelete('family_insurance', i.id)}
                    />
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{getMemberName(i.member_id)}</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>{i.policy_name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-2)', marginBottom: '16px' }}>{i.provider} • <MaskedText text={i.policy_number} /></div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: 'var(--color-text-2)' }}>
                      <div><strong style={{ color: 'var(--color-text-1)' }}>Premium:</strong> <br/>{formatINR(i.premium_amount)}</div>
                      <div style={{ color: isExpiring ? '#EF4444' : 'inherit' }}><strong style={{ color: isExpiring ? '#EF4444' : 'var(--color-text-1)' }}>Renewal:</strong> <br/>{formatDate(i.renewal_date)}</div>
                      <div style={{ gridColumn: 'span 2' }}><strong style={{ color: 'var(--color-text-1)' }}>Nominee:</strong> <br/>{i.nominee || '—'}</div>
                    </div>
                  </div>
                );
              })}
              {insurance.length === 0 && (
                <EmptyState 
                  icon={Heart} 
                  title="No Insurance Policies" 
                  description="Track your life, health, and vehicle insurance policies. Never miss a premium payment." 
                  buttonText="Add Policy" 
                  onAction={() => setIsInsModalOpen(true)} 
                />
              )}
            </div>
          </div>
        )}

        {/* HEALTH TAB */}
        {activeTab === 'health' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => openAdd(setIsHealthModalOpen, setEditHealth)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Health Info</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {visibleHealth.map(h => (
                <div key={h.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px', position: 'relative' }}>
                  <FamilyCardMenu
                    style={{ position: 'absolute', top: '24px', right: '24px' }}
                    onView={() => setDetailView({ kind: 'health', item: h })}
                    onEdit={() => openEdit(setIsHealthModalOpen, setEditHealth, h)}
                    onDuplicate={() => handleDuplicate('family_health', h)}
                    onArchive={() => handleArchive('family_health', h.id)}
                    onDelete={() => handleDelete('family_health', h.id)}
                  />
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '16px' }}>{getMemberName(h.member_id)}</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--color-text-2)' }}>
                    <div><strong style={{ color: '#EF4444' }}>Allergies:</strong> {h.allergies || 'None'}</div>
                    <div><strong style={{ color: 'var(--color-text-1)' }}>Conditions:</strong> {h.conditions || 'None'}</div>
                    <div><strong style={{ color: 'var(--color-text-1)' }}>Medications:</strong> {h.medications || 'None'}</div>
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
                      <strong style={{ color: 'var(--color-text-1)' }}>Primary Doctor:</strong> {h.doctor_name || '—'} {h.doctor_phone ? `(${h.doctor_phone})` : ''}
                    </div>
                  </div>
                </div>
              ))}
              {health.length === 0 && (
                <EmptyState 
                  icon={Activity} 
                  title="No Health Records" 
                  description="Log allergies, blood groups, and ongoing medications so emergency responders have instant access when it matters." 
                  buttonText="Add Health Profile" 
                  onAction={() => setIsHealthModalOpen(true)} 
                />
              )}
            </div>
          </div>
        )}

        {/* VEHICLES TAB */}
        {activeTab === 'vehicles' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => openAdd(setIsVehicleModalOpen, setEditVehicle)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Vehicle</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {visibleVehicles.map(v => {
                const isInsExpiring = v.insurance_expiry && new Date(v.insurance_expiry) < new Date(Date.now() + 30 * 86400000);
                const isPucExpiring = v.puc_expiry && new Date(v.puc_expiry) < new Date(Date.now() + 30 * 86400000);
                return (
                  <div key={v.id} style={{ background: 'var(--color-surface)', border: `1px solid ${isInsExpiring || isPucExpiring ? '#EF4444' : 'var(--color-border)'}`, borderRadius: '24px', padding: '24px', position: 'relative' }}>
                    <FamilyCardMenu
                      style={{ position: 'absolute', top: '24px', right: '24px' }}
                      onView={() => setDetailView({ kind: 'vehicle', item: v })}
                      onEdit={() => openEdit(setIsVehicleModalOpen, setEditVehicle, v)}
                      onDuplicate={() => handleDuplicate('family_vehicles', v, duplicatePatch('vehicle', v))}
                      onArchive={() => handleArchive('family_vehicles', v.id)}
                      onDelete={() => handleDelete('family_vehicles', v.id)}
                    />
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>{v.make_model}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-2)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>{v.registration_number}</div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: 'var(--color-text-2)' }}>
                      <div><strong style={{ color: 'var(--color-text-1)' }}>Insurance:</strong> <br/>{v.insurance_provider || '—'}</div>
                      <div style={{ color: isInsExpiring ? '#EF4444' : 'inherit' }}><strong style={{ color: isInsExpiring ? '#EF4444' : 'var(--color-text-1)' }}>Ins Exp:</strong> <br/>{formatDate(v.insurance_expiry)}</div>
                      <div style={{ color: isPucExpiring ? '#EF4444' : 'inherit' }}><strong style={{ color: isPucExpiring ? '#EF4444' : 'var(--color-text-1)' }}>PUC Exp:</strong> <br/>{formatDate(v.puc_expiry)}</div>
                      <div><strong style={{ color: 'var(--color-text-1)' }}>Service Due:</strong> <br/>{formatDate(v.service_due_date)}</div>
                    </div>
                  </div>
                );
              })}
              {vehicles.length === 0 && (
                <EmptyState 
                  icon={Car} 
                  title="No Vehicles Added" 
                  description="Track your family's cars and bikes. We'll remind you before insurance or PUC expires." 
                  buttonText="Add Vehicle" 
                  onAction={() => setIsVehicleModalOpen(true)} 
                />
              )}
            </div>
          </div>
        )}

        {/* FINANCE TAB */}
        {activeTab === 'finance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => openAdd(setIsFinanceModalOpen, setEditFinance)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Finance Record</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {visibleFinance.map(f => (
                <div key={f.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px', position: 'relative' }}>
                  <FamilyCardMenu
                    style={{ position: 'absolute', top: '24px', right: '24px' }}
                    onView={() => setDetailView({ kind: 'finance', item: f })}
                    onEdit={() => openEdit(setIsFinanceModalOpen, setEditFinance, f)}
                    onDuplicate={() => handleDuplicate('family_finance', f, duplicatePatch('finance', f))}
                    onArchive={() => handleArchive('family_finance', f.id)}
                    onDelete={() => handleDelete('family_finance', f.id)}
                  />
                  {f.member_id && <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{getMemberName(f.member_id)}</div>}
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>{f.institution_name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-2)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{f.account_type}</div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: 'var(--color-text-2)' }}>
                    <div>
                      <strong style={{ color: 'var(--color-text-1)', display: 'block', marginBottom: '4px' }}>Account No:</strong>
                      <MaskedText text={f.account_number} />
                    </div>
                    <div><strong style={{ color: 'var(--color-text-1)' }}>Balance:</strong> <br/>{formatINR(f.current_balance)}</div>
                  </div>
                  {f.notes && <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-text-2)', background: 'var(--color-elevated)', padding: '12px', borderRadius: '8px' }}>{f.notes}</div>}
                </div>
              ))}
              {finance.length === 0 && (
                <EmptyState 
                  icon={Wallet} 
                  title="No Finance Records" 
                  description="Track bank accounts, mutual funds, FDs, and loans securely in one place." 
                  buttonText="Add Finance Record" 
                  onAction={() => setIsFinanceModalOpen(true)} 
                />
              )}
            </div>
          </div>
        )}

        {/* RELATIONSHIPS TAB */}
        {activeTab === 'relationships' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => openAdd(setIsRelationshipModalOpen, setEditRelationship)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Relationship</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {visibleRelationships.map(rel => (
                <div key={rel.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px', position: 'relative' }}>
                  <FamilyCardMenu
                    style={{ position: 'absolute', top: '24px', right: '24px' }}
                    onView={() => setDetailView({ kind: 'relationship', item: rel })}
                    onEdit={() => openEdit(setIsRelationshipModalOpen, setEditRelationship, rel)}
                    onDuplicate={() => handleDuplicate('family_relationships', rel, duplicatePatch('relationship', rel))}
                    onArchive={() => handleArchive('family_relationships', rel.id)}
                    onDelete={() => handleDelete('family_relationships', rel.id)}
                  />
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>{rel.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{rel.relation_type}</div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: 'var(--color-text-2)' }}>
                    {rel.birthday && <div><strong style={{ color: 'var(--color-text-1)' }}>Birthday:</strong> <br/>{formatDate(rel.birthday)}</div>}
                    {rel.anniversary_date && <div><strong style={{ color: 'var(--color-text-1)' }}>Anniversary:</strong> <br/>{formatDate(rel.anniversary_date)}</div>}
                  </div>
                  {rel.notes && <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-text-2)', background: 'var(--color-elevated)', padding: '12px', borderRadius: '8px' }}>{rel.notes}</div>}
                </div>
              ))}
              {relationships.length === 0 && (
                <EmptyState 
                  icon={Users} 
                  title="No Relationships Tracked" 
                  description="Keep track of extended family and friends' important dates and preferences." 
                  buttonText="Add Relationship" 
                  onAction={() => setIsRelationshipModalOpen(true)} 
                />
              )}
            </div>
          </div>
        )}

        {/* REMINDERS TAB */}
        {activeTab === 'reminders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => openAdd(setIsReminderModalOpen, setEditReminder)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Reminder</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {visibleReminders.map(r => {
                const isOverdue = new Date(r.due_date) < new Date();
                return (
                  <div key={r.id} style={{ background: 'var(--color-surface)', border: `1px solid ${isOverdue && !r.completed ? '#EF4444' : 'var(--color-border)'}`, borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: r.completed ? 0.5 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <input type="checkbox" checked={r.completed} onChange={async () => {
                        await supabase.from('family_reminders').update({ completed: !r.completed }).eq('id', r.id);
                        fetchData();
                      }} style={{ width: '20px', height: '20px', accentColor: 'var(--color-accent)', cursor: 'pointer' }} />
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-1)', textDecoration: r.completed ? 'line-through' : 'none' }}>{r.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-2)', marginTop: '4px' }}>{r.description}</div>
                        {r.is_auto_generated && <div style={{ fontSize: '10px', color: 'var(--color-accent)', marginTop: '4px', fontWeight: 700 }}>⚡ AUTO-GENERATED</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: isOverdue && !r.completed ? '#EF4444' : 'var(--color-text-2)' }}>{formatDate(r.due_date)}</div>
                      <FamilyCardMenu
                        onView={() => setDetailView({ kind: 'reminder', item: r })}
                        onEdit={() => openEdit(setIsReminderModalOpen, setEditReminder, r)}
                        onDuplicate={() => handleDuplicate('family_reminders', r, duplicatePatch('reminder', r))}
                        onArchive={() => handleArchive('family_reminders', r.id)}
                        onDelete={() => handleDelete('family_reminders', r.id)}
                      />
                    </div>
                  </div>
                );
              })}
              {reminders.length === 0 && (
                <EmptyState 
                  icon={Clock} 
                  title="No Active Reminders" 
                  description="Set custom reminders for family events or let AIIMIN automatically generate them for expiring documents and policies." 
                  buttonText="Add Reminder" 
                  onAction={() => setIsReminderModalOpen(true)} 
                />
              )}
            </div>
          </div>
        )}

        {/* EMERGENCY TAB */}
        {activeTab === 'emergency' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => openAdd(setIsEmergencyModalOpen, setEditEmergency)} style={{ background: '#EF4444', border: 'none', padding: '10px 20px', borderRadius: '12px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Emergency Contact</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {visibleEmergency.map(e => (
                <div key={e.id} style={{ background: e.is_pinned ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-surface)', border: `1px solid ${e.is_pinned ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-border)'}`, borderRadius: '24px', padding: '24px', position: 'relative' }}>
                  <FamilyCardMenu
                    style={{ position: 'absolute', top: '24px', right: '24px' }}
                    onView={() => setDetailView({ kind: 'emergency', item: e })}
                    onEdit={() => openEdit(setIsEmergencyModalOpen, setEditEmergency, e)}
                    onDuplicate={() => handleDuplicate('family_emergency_contacts', e, duplicatePatch('emergency', e))}
                    onArchive={() => handleArchive('family_emergency_contacts', e.id)}
                    onDelete={() => handleDelete('family_emergency_contacts', e.id)}
                  />
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>{e.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{e.relation_or_role}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>{e.phone}</div>
                  {e.notes && <div style={{ fontSize: '13px', color: 'var(--color-text-2)', background: 'var(--color-elevated)', padding: '12px', borderRadius: '8px' }}>{e.notes}</div>}
                </div>
              ))}
              {emergency.length === 0 && (
                <EmptyState 
                  icon={AlertTriangle} 
                  title="No Emergency Contacts" 
                  description="Add doctors, hospitals, and close relatives. Pinned contacts are accessible immediately during a crisis." 
                  buttonText="Add Emergency Contact" 
                  onAction={() => setIsEmergencyModalOpen(true)} 
                />
              )}
            </div>
          </div>
        )}

        </motion.div>
      </AnimatePresence>

      {/* MODALS */}
      <FamilyRecordDetails view={detailView} onClose={() => setDetailView(null)} getMemberName={getMemberName} />

      <Modal isOpen={isMemberModalOpen} onClose={() => closeModal(setIsMemberModalOpen, setEditMember)} title={editMember ? 'Edit Family Member' : 'Add Family Member'}>
        <form key={editMember?.id || 'new-member'} onSubmit={handleAddMember}>
          <input name="name" placeholder="Full Name" required className="family-input" defaultValue={editMember?.name || ''} />
          <input name="relation" placeholder="Relation (e.g., Spouse, Child)" required className="family-input" defaultValue={editMember?.relation || ''} />
          <input name="dob" type="date" placeholder="Date of Birth" className="family-input" defaultValue={editMember?.dob || ''} />
          <input name="blood_group" placeholder="Blood Group (e.g., O+)" className="family-input" defaultValue={editMember?.blood_group || ''} />
          <input name="phone" placeholder="Phone Number" className="family-input" defaultValue={editMember?.phone || ''} />
          <button type="submit" className="family-btn">{editMember ? 'Save Changes' : 'Save Member'}</button>
        </form>
      </Modal>

      <Modal isOpen={isDocModalOpen} onClose={() => closeModal(setIsDocModalOpen, setEditDoc)} title={editDoc ? 'Edit Document' : 'Add Document'}>
        <form key={editDoc?.id || 'new-doc'} onSubmit={handleAddDoc}>
          <select name="member_id" required className="family-input" defaultValue={editDoc?.member_id || ''}>
            <option value="">Select Member...</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input name="doc_type" placeholder="Document Type (e.g., Passport, PAN)" required className="family-input" defaultValue={editDoc?.doc_type || ''} />
          <input name="doc_number" placeholder="Document Number" required className="family-input" defaultValue={editDoc?.doc_number || ''} />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Expiry Date (optional)</label>
          <input name="expiry_date" type="date" className="family-input" defaultValue={editDoc?.expiry_date || ''} />
          <button type="submit" className="family-btn">{editDoc ? 'Save Changes' : 'Save Document'}</button>
        </form>
      </Modal>

      <Modal isOpen={isInsModalOpen} onClose={() => closeModal(setIsInsModalOpen, setEditIns)} title={editIns ? 'Edit Insurance Policy' : 'Add Insurance Policy'}>
        <form key={editIns?.id || 'new-ins'} onSubmit={handleAddIns}>
          <select name="member_id" required className="family-input" defaultValue={editIns?.member_id || ''}>
            <option value="">Select Member...</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input name="policy_name" placeholder="Policy Name (e.g., Health, Life)" required className="family-input" defaultValue={editIns?.policy_name || ''} />
          <input name="provider" placeholder="Provider (e.g., LIC, Star Health)" className="family-input" defaultValue={editIns?.provider || ''} />
          <input name="policy_number" placeholder="Policy Number" className="family-input" defaultValue={editIns?.policy_number || ''} />
          <input name="premium_amount" type="number" step="0.01" placeholder="Premium Amount" className="family-input" defaultValue={editIns?.premium_amount ?? ''} />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Renewal Date</label>
          <input name="renewal_date" type="date" className="family-input" defaultValue={editIns?.renewal_date || ''} />
          <input name="nominee" placeholder="Nominee Name" className="family-input" defaultValue={editIns?.nominee || ''} />
          <button type="submit" className="family-btn">{editIns ? 'Save Changes' : 'Save Policy'}</button>
        </form>
      </Modal>

      <Modal isOpen={isHealthModalOpen} onClose={() => closeModal(setIsHealthModalOpen, setEditHealth)} title={editHealth ? 'Edit Health Info' : 'Add Health Info'}>
        <form key={editHealth?.id || 'new-health'} onSubmit={handleAddHealth}>
          <select name="member_id" required className="family-input" defaultValue={editHealth?.member_id || ''}>
            <option value="">Select Member...</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <textarea name="allergies" placeholder="Allergies (comma separated)" className="family-input" style={{ height: '80px', resize: 'none' }} defaultValue={editHealth?.allergies || ''} />
          <textarea name="conditions" placeholder="Pre-existing Conditions" className="family-input" style={{ height: '80px', resize: 'none' }} defaultValue={editHealth?.conditions || ''} />
          <textarea name="medications" placeholder="Current Medications" className="family-input" style={{ height: '80px', resize: 'none' }} defaultValue={editHealth?.medications || ''} />
          <input name="doctor_name" placeholder="Primary Doctor Name" className="family-input" defaultValue={editHealth?.doctor_name || ''} />
          <input name="doctor_phone" placeholder="Doctor Phone" className="family-input" defaultValue={editHealth?.doctor_phone || ''} />
          <button type="submit" className="family-btn">{editHealth ? 'Save Changes' : 'Save Health Profile'}</button>
        </form>
      </Modal>

      <Modal isOpen={isReminderModalOpen} onClose={() => closeModal(setIsReminderModalOpen, setEditReminder)} title={editReminder ? 'Edit Reminder' : 'Add Custom Reminder'}>
        <form key={editReminder?.id || 'new-reminder'} onSubmit={handleAddReminder}>
          <input name="title" placeholder="Reminder Title" required className="family-input" defaultValue={editReminder?.title || ''} />
          <textarea name="description" placeholder="Description" className="family-input" style={{ height: '80px', resize: 'none' }} defaultValue={editReminder?.description || ''} />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Due Date</label>
          <input name="due_date" type="date" required className="family-input" defaultValue={editReminder?.due_date || ''} />
          <button type="submit" className="family-btn">{editReminder ? 'Save Changes' : 'Save Reminder'}</button>
        </form>
      </Modal>

      <Modal isOpen={isVehicleModalOpen} onClose={() => closeModal(setIsVehicleModalOpen, setEditVehicle)} title={editVehicle ? 'Edit Vehicle' : 'Add Vehicle'}>
        <form key={editVehicle?.id || 'new-vehicle'} onSubmit={handleAddVehicle}>
          <input name="make_model" placeholder="Make & Model (e.g., Honda City)" required className="family-input" defaultValue={editVehicle?.make_model || ''} />
          <input name="registration_number" placeholder="Registration No. (e.g., MH01AB1234)" required className="family-input" defaultValue={editVehicle?.registration_number || ''} />
          <input name="insurance_provider" placeholder="Insurance Provider" className="family-input" defaultValue={editVehicle?.insurance_provider || ''} />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Insurance Expiry Date</label>
          <input name="insurance_expiry" type="date" className="family-input" defaultValue={editVehicle?.insurance_expiry || ''} />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>PUC Expiry Date</label>
          <input name="puc_expiry" type="date" className="family-input" defaultValue={editVehicle?.puc_expiry || ''} />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Service Due Date</label>
          <input name="service_due_date" type="date" className="family-input" defaultValue={editVehicle?.service_due_date || ''} />
          <button type="submit" className="family-btn">{editVehicle ? 'Save Changes' : 'Save Vehicle'}</button>
        </form>
      </Modal>

      <Modal isOpen={isFinanceModalOpen} onClose={() => closeModal(setIsFinanceModalOpen, setEditFinance)} title={editFinance ? 'Edit Finance Record' : 'Add Finance Record'}>
        <form key={editFinance?.id || 'new-finance'} onSubmit={handleAddFinance}>
          <select name="member_id" className="family-input" defaultValue={editFinance?.member_id || ''}>
            <option value="">Select Member (Optional)...</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input name="account_type" placeholder="Type (e.g., Bank Account, Mutual Fund, Loan)" required className="family-input" defaultValue={editFinance?.account_type || ''} />
          <input name="institution_name" placeholder="Institution Name (e.g., HDFC Bank, Zerodha)" required className="family-input" defaultValue={editFinance?.institution_name || ''} />
          <input name="account_number" placeholder="Account Number / Folio Number" className="family-input" defaultValue={editFinance?.account_number || ''} />
          <input name="current_balance" type="number" step="0.01" placeholder="Current Balance / Amount" className="family-input" defaultValue={editFinance?.current_balance ?? ''} />
          <textarea name="notes" placeholder="Notes (e.g., Nominee details, purpose)" className="family-input" style={{ height: '80px', resize: 'none' }} defaultValue={editFinance?.notes || ''} />
          <button type="submit" className="family-btn">{editFinance ? 'Save Changes' : 'Save Record'}</button>
        </form>
      </Modal>

      <Modal isOpen={isRelationshipModalOpen} onClose={() => closeModal(setIsRelationshipModalOpen, setEditRelationship)} title={editRelationship ? 'Edit Relationship' : 'Add Relationship'}>
        <form key={editRelationship?.id || 'new-rel'} onSubmit={handleAddRelationship}>
          <input name="name" placeholder="Name" required className="family-input" defaultValue={editRelationship?.name || ''} />
          <input name="relation_type" placeholder="Relationship (e.g., Uncle, Friend, Colleague)" required className="family-input" defaultValue={editRelationship?.relation_type || ''} />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Birthday</label>
          <input name="birthday" type="date" className="family-input" defaultValue={editRelationship?.birthday || ''} />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Anniversary</label>
          <input name="anniversary_date" type="date" className="family-input" defaultValue={editRelationship?.anniversary_date || ''} />
          <textarea name="notes" placeholder="Notes (e.g., Gift preferences, recent events)" className="family-input" style={{ height: '80px', resize: 'none' }} defaultValue={editRelationship?.notes || ''} />
          <button type="submit" className="family-btn">{editRelationship ? 'Save Changes' : 'Save Relationship'}</button>
        </form>
      </Modal>

      <Modal isOpen={isEmergencyModalOpen} onClose={() => closeModal(setIsEmergencyModalOpen, setEditEmergency)} title={editEmergency ? 'Edit Emergency Contact' : 'Add Emergency Contact'}>
        <form key={editEmergency?.id || 'new-emergency'} onSubmit={handleAddEmergency}>
          <input name="name" placeholder="Contact Name / Hospital Name" required className="family-input" defaultValue={editEmergency?.name || ''} />
          <input name="relation_or_role" placeholder="Relation or Role (e.g., Ambulance, Uncle)" required className="family-input" defaultValue={editEmergency?.relation_or_role || ''} />
          <input name="phone" placeholder="Phone Number" required className="family-input" defaultValue={editEmergency?.phone || ''} />
          <textarea name="notes" placeholder="Additional Notes" className="family-input" style={{ height: '80px', resize: 'none' }} defaultValue={editEmergency?.notes || ''} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-1)', marginBottom: '16px', cursor: 'pointer' }}>
            <input name="is_pinned" type="checkbox" defaultChecked={!!editEmergency?.is_pinned} style={{ width: '18px', height: '18px', accentColor: '#EF4444' }} />
            Pin this contact to the top
          </label>
          <button type="submit" className="family-btn">{editEmergency ? 'Save Changes' : 'Save Contact'}</button>
        </form>
      </Modal>

    </div>
  );
}
