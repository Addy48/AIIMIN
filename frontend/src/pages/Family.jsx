import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../utils/supabase';
import PageHeader from '../components/layout/PageHeader';
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
    const { error } = await supabase.from('family_members').insert({
      user_id: user.id,
      name: fd.get('name'),
      relation: fd.get('relation'),
      dob: fd.get('dob') || null,
      blood_group: fd.get('blood_group'),
      phone: fd.get('phone')
    }).select();
    if (error) toast.error('Failed to add member');
    else { toast.success('Member added'); setIsMemberModalOpen(false); fetchData(); }
  };

  const handleAddDoc = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { data, error } = await supabase.from('family_documents').insert({
      user_id: user.id,
      member_id: fd.get('member_id'),
      doc_type: fd.get('doc_type'),
      doc_number: fd.get('doc_number'),
      expiry_date: fd.get('expiry_date') || null
    }).select();
    if (error) toast.error('Failed to add document');
    else { 
      toast.success('Document added'); 
      if (fd.get('expiry_date')) {
        await autoCreateReminder(`${fd.get('doc_type')} Expiry`, fd.get('expiry_date'), 'document_expiry', data[0].id);
      }
      setIsDocModalOpen(false); fetchData(); 
    }
  };

  const handleAddIns = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { data, error } = await supabase.from('family_insurance').insert({
      user_id: user.id,
      member_id: fd.get('member_id'),
      policy_name: fd.get('policy_name'),
      provider: fd.get('provider'),
      policy_number: fd.get('policy_number'),
      premium_amount: fd.get('premium_amount') ? parseFloat(fd.get('premium_amount')) : null,
      renewal_date: fd.get('renewal_date') || null,
      nominee: fd.get('nominee')
    }).select();
    if (error) toast.error('Failed to add insurance');
    else { 
      toast.success('Insurance added'); 
      if (fd.get('renewal_date')) {
        await autoCreateReminder(`${fd.get('policy_name')} Premium`, fd.get('renewal_date'), 'insurance_renewal', data[0].id);
      }
      setIsInsModalOpen(false); fetchData(); 
    }
  };

  const handleAddHealth = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { error } = await supabase.from('family_health').insert({
      user_id: user.id,
      member_id: fd.get('member_id'),
      allergies: fd.get('allergies'),
      conditions: fd.get('conditions'),
      medications: fd.get('medications'),
      doctor_name: fd.get('doctor_name'),
      doctor_phone: fd.get('doctor_phone')
    });
    if (error) toast.error('Failed to add health profile');
    else { toast.success('Health profile added'); setIsHealthModalOpen(false); fetchData(); }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { data, error } = await supabase.from('family_vehicles').insert({
      user_id: user.id,
      make_model: fd.get('make_model'),
      registration_number: fd.get('registration_number'),
      insurance_provider: fd.get('insurance_provider'),
      insurance_expiry: fd.get('insurance_expiry') || null,
      puc_expiry: fd.get('puc_expiry') || null,
      service_due_date: fd.get('service_due_date') || null
    }).select();
    if (error) toast.error('Failed to add vehicle');
    else {
      toast.success('Vehicle added');
      if (fd.get('insurance_expiry')) {
        await autoCreateReminder(`${fd.get('registration_number')} Insurance Exp`, fd.get('insurance_expiry'), 'vehicle_insurance', data[0].id);
      }
      if (fd.get('puc_expiry')) {
        await autoCreateReminder(`${fd.get('registration_number')} PUC Exp`, fd.get('puc_expiry'), 'vehicle_puc', data[0].id);
      }
      setIsVehicleModalOpen(false); fetchData();
    }
  };

  const handleAddFinance = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { error } = await supabase.from('family_finance').insert({
      user_id: user.id,
      member_id: fd.get('member_id') || null,
      account_type: fd.get('account_type'),
      institution_name: fd.get('institution_name'),
      account_number: fd.get('account_number'),
      current_balance: fd.get('current_balance') ? parseFloat(fd.get('current_balance')) : null,
      notes: fd.get('notes')
    });
    if (error) toast.error('Failed to add finance record');
    else { toast.success('Finance record added'); setIsFinanceModalOpen(false); fetchData(); }
  };

  const handleAddRelationship = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { error } = await supabase.from('family_relationships').insert({
      user_id: user.id,
      name: fd.get('name'),
      relation_type: fd.get('relation_type'),
      anniversary_date: fd.get('anniversary_date') || null,
      birthday: fd.get('birthday') || null,
      notes: fd.get('notes')
    });
    if (error) toast.error('Failed to add relationship record');
    else { toast.success('Relationship record added'); setIsRelationshipModalOpen(false); fetchData(); }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { error } = await supabase.from('family_reminders').insert({
      user_id: user.id,
      title: fd.get('title'),
      description: fd.get('description'),
      due_date: fd.get('due_date')
    });
    if (error) toast.error('Failed to add reminder');
    else { toast.success('Reminder added'); setIsReminderModalOpen(false); fetchData(); }
  };

  const handleAddEmergency = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { error } = await supabase.from('family_emergency_contacts').insert({
      user_id: user.id,
      name: fd.get('name'),
      relation_or_role: fd.get('relation_or_role'),
      phone: fd.get('phone'),
      notes: fd.get('notes'),
      is_pinned: fd.get('is_pinned') === 'on'
    });
    if (error) toast.error('Failed to add contact');
    else { toast.success('Contact added'); setIsEmergencyModalOpen(false); fetchData(); }
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else fetchData();
  };

  const getMemberName = (id) => members.find(m => m.id === id)?.name || 'Unknown';

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
              <button onClick={() => setIsMemberModalOpen(true)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Member</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {members.map(m => (
                <div key={m.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px', position: 'relative' }}>
                  <button onClick={() => handleDelete('family_members', m.id)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}><X size={16}/></button>
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
              <button onClick={() => setIsDocModalOpen(true)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Document</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {documents.map(d => {
                const isExpiring = d.expiry_date && new Date(d.expiry_date) < new Date(Date.now() + 30 * 86400000);
                return (
                  <div key={d.id} style={{ background: 'var(--color-surface)', border: `1px solid ${isExpiring ? '#EF4444' : 'var(--color-border)'}`, borderRadius: '24px', padding: '24px', position: 'relative' }}>
                    <button onClick={() => handleDelete('family_documents', d.id)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}><X size={16}/></button>
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
              <button onClick={() => setIsInsModalOpen(true)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Insurance</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {insurance.map(i => {
                const isExpiring = i.renewal_date && new Date(i.renewal_date) < new Date(Date.now() + 30 * 86400000);
                return (
                  <div key={i.id} style={{ background: 'var(--color-surface)', border: `1px solid ${isExpiring ? '#EF4444' : 'var(--color-border)'}`, borderRadius: '24px', padding: '24px', position: 'relative' }}>
                    <button onClick={() => handleDelete('family_insurance', i.id)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}><X size={16}/></button>
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
              <button onClick={() => setIsHealthModalOpen(true)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Health Info</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {health.map(h => (
                <div key={h.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px', position: 'relative' }}>
                  <button onClick={() => handleDelete('family_health', h.id)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}><X size={16}/></button>
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
              <button onClick={() => setIsVehicleModalOpen(true)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Vehicle</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {vehicles.map(v => {
                const isInsExpiring = v.insurance_expiry && new Date(v.insurance_expiry) < new Date(Date.now() + 30 * 86400000);
                const isPucExpiring = v.puc_expiry && new Date(v.puc_expiry) < new Date(Date.now() + 30 * 86400000);
                return (
                  <div key={v.id} style={{ background: 'var(--color-surface)', border: `1px solid ${isInsExpiring || isPucExpiring ? '#EF4444' : 'var(--color-border)'}`, borderRadius: '24px', padding: '24px', position: 'relative' }}>
                    <button onClick={() => handleDelete('family_vehicles', v.id)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}><X size={16}/></button>
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
              <button onClick={() => setIsFinanceModalOpen(true)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Finance Record</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {finance.map(f => (
                <div key={f.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px', position: 'relative' }}>
                  <button onClick={() => handleDelete('family_finance', f.id)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}><X size={16}/></button>
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
              <button onClick={() => setIsRelationshipModalOpen(true)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Relationship</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {relationships.map(rel => (
                <div key={rel.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px', position: 'relative' }}>
                  <button onClick={() => handleDelete('family_relationships', rel.id)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}><X size={16}/></button>
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
              <button onClick={() => setIsReminderModalOpen(true)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Reminder</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reminders.map(r => {
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
                      <button onClick={() => handleDelete('family_reminders', r.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}><X size={16}/></button>
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
              <button onClick={() => setIsEmergencyModalOpen(true)} style={{ background: '#EF4444', border: 'none', padding: '10px 20px', borderRadius: '12px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Emergency Contact</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {emergency.map(e => (
                <div key={e.id} style={{ background: e.is_pinned ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-surface)', border: `1px solid ${e.is_pinned ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-border)'}`, borderRadius: '24px', padding: '24px', position: 'relative' }}>
                  <button onClick={() => handleDelete('family_emergency_contacts', e.id)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}><X size={16}/></button>
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
      <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title="Add Family Member">
        <form onSubmit={handleAddMember}>
          <input name="name" placeholder="Full Name" required className="family-input" />
          <input name="relation" placeholder="Relation (e.g., Spouse, Child)" required className="family-input" />
          <input name="dob" type="date" placeholder="Date of Birth" className="family-input" />
          <input name="blood_group" placeholder="Blood Group (e.g., O+)" className="family-input" />
          <input name="phone" placeholder="Phone Number" className="family-input" />
          <button type="submit" className="family-btn">Save Member</button>
        </form>
      </Modal>

      <Modal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} title="Add Document">
        <form onSubmit={handleAddDoc}>
          <select name="member_id" required className="family-input">
            <option value="">Select Member...</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input name="doc_type" placeholder="Document Type (e.g., Passport, PAN)" required className="family-input" />
          <input name="doc_number" placeholder="Document Number" required className="family-input" />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Expiry Date (optional)</label>
          <input name="expiry_date" type="date" className="family-input" />
          <button type="submit" className="family-btn">Save Document</button>
        </form>
      </Modal>

      <Modal isOpen={isInsModalOpen} onClose={() => setIsInsModalOpen(false)} title="Add Insurance Policy">
        <form onSubmit={handleAddIns}>
          <select name="member_id" required className="family-input">
            <option value="">Select Member...</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input name="policy_name" placeholder="Policy Name (e.g., Health, Life)" required className="family-input" />
          <input name="provider" placeholder="Provider (e.g., LIC, Star Health)" className="family-input" />
          <input name="policy_number" placeholder="Policy Number" className="family-input" />
          <input name="premium_amount" type="number" step="0.01" placeholder="Premium Amount" className="family-input" />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Renewal Date</label>
          <input name="renewal_date" type="date" className="family-input" />
          <input name="nominee" placeholder="Nominee Name" className="family-input" />
          <button type="submit" className="family-btn">Save Policy</button>
        </form>
      </Modal>

      <Modal isOpen={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} title="Add Health Info">
        <form onSubmit={handleAddHealth}>
          <select name="member_id" required className="family-input">
            <option value="">Select Member...</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <textarea name="allergies" placeholder="Allergies (comma separated)" className="family-input" style={{ height: '80px', resize: 'none' }} />
          <textarea name="conditions" placeholder="Pre-existing Conditions" className="family-input" style={{ height: '80px', resize: 'none' }} />
          <textarea name="medications" placeholder="Current Medications" className="family-input" style={{ height: '80px', resize: 'none' }} />
          <input name="doctor_name" placeholder="Primary Doctor Name" className="family-input" />
          <input name="doctor_phone" placeholder="Doctor Phone" className="family-input" />
          <button type="submit" className="family-btn">Save Health Profile</button>
        </form>
      </Modal>

      <Modal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} title="Add Custom Reminder">
        <form onSubmit={handleAddReminder}>
          <input name="title" placeholder="Reminder Title" required className="family-input" />
          <textarea name="description" placeholder="Description" className="family-input" style={{ height: '80px', resize: 'none' }} />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Due Date</label>
          <input name="due_date" type="date" required className="family-input" />
          <button type="submit" className="family-btn">Save Reminder</button>
        </form>
      </Modal>

      <Modal isOpen={isVehicleModalOpen} onClose={() => setIsVehicleModalOpen(false)} title="Add Vehicle">
        <form onSubmit={handleAddVehicle}>
          <input name="make_model" placeholder="Make & Model (e.g., Honda City)" required className="family-input" />
          <input name="registration_number" placeholder="Registration No. (e.g., MH01AB1234)" required className="family-input" />
          <input name="insurance_provider" placeholder="Insurance Provider" className="family-input" />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Insurance Expiry Date</label>
          <input name="insurance_expiry" type="date" className="family-input" />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>PUC Expiry Date</label>
          <input name="puc_expiry" type="date" className="family-input" />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Service Due Date</label>
          <input name="service_due_date" type="date" className="family-input" />
          <button type="submit" className="family-btn">Save Vehicle</button>
        </form>
      </Modal>

      <Modal isOpen={isFinanceModalOpen} onClose={() => setIsFinanceModalOpen(false)} title="Add Finance Record">
        <form onSubmit={handleAddFinance}>
          <select name="member_id" className="family-input">
            <option value="">Select Member (Optional)...</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input name="account_type" placeholder="Type (e.g., Bank Account, Mutual Fund, Loan)" required className="family-input" />
          <input name="institution_name" placeholder="Institution Name (e.g., HDFC Bank, Zerodha)" required className="family-input" />
          <input name="account_number" placeholder="Account Number / Folio Number" className="family-input" />
          <input name="current_balance" type="number" step="0.01" placeholder="Current Balance / Amount" className="family-input" />
          <textarea name="notes" placeholder="Notes (e.g., Nominee details, purpose)" className="family-input" style={{ height: '80px', resize: 'none' }} />
          <button type="submit" className="family-btn">Save Record</button>
        </form>
      </Modal>

      <Modal isOpen={isRelationshipModalOpen} onClose={() => setIsRelationshipModalOpen(false)} title="Add Relationship">
        <form onSubmit={handleAddRelationship}>
          <input name="name" placeholder="Name" required className="family-input" />
          <input name="relation_type" placeholder="Relationship (e.g., Uncle, Friend, Colleague)" required className="family-input" />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Birthday</label>
          <input name="birthday" type="date" className="family-input" />
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-2)', marginBottom: '4px' }}>Anniversary</label>
          <input name="anniversary_date" type="date" className="family-input" />
          <textarea name="notes" placeholder="Notes (e.g., Gift preferences, recent events)" className="family-input" style={{ height: '80px', resize: 'none' }} />
          <button type="submit" className="family-btn">Save Relationship</button>
        </form>
      </Modal>

      <Modal isOpen={isEmergencyModalOpen} onClose={() => setIsEmergencyModalOpen(false)} title="Add Emergency Contact">
        <form onSubmit={handleAddEmergency}>
          <input name="name" placeholder="Contact Name / Hospital Name" required className="family-input" />
          <input name="relation_or_role" placeholder="Relation or Role (e.g., Ambulance, Uncle)" required className="family-input" />
          <input name="phone" placeholder="Phone Number" required className="family-input" />
          <textarea name="notes" placeholder="Additional Notes" className="family-input" style={{ height: '80px', resize: 'none' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-1)', marginBottom: '16px', cursor: 'pointer' }}>
            <input name="is_pinned" type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#EF4444' }} />
            Pin this contact to the top
          </label>
          <button type="submit" className="family-btn">Save Contact</button>
        </form>
      </Modal>

    </div>
  );
}
