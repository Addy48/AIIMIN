import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../utils/supabase';
import PageHeader from '../components/layout/PageHeader';
import { Plus, X, Shield, FileText, Heart, Activity, Clock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'members', label: 'Members', icon: Shield },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'insurance', label: 'Insurance', icon: Heart },
  { id: 'health', label: 'Health', icon: Activity },
  { id: 'reminders', label: 'Reminders', icon: Clock },
  { id: 'emergency', label: 'Emergency', icon: AlertTriangle }
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
  const [reminders, setReminders] = useState([]);
  const [emergency, setEmergency] = useState([]);

  // Modal States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isInsModalOpen, setIsInsModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
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
        supabase.from('family_reminders').select('*').order('due_date', { ascending: true }),
        supabase.from('family_emergency_contacts').select('*').order('is_pinned', { ascending: false })
      ]);

      const [m, d, i, h, r, e] = await Promise.race([fetchPromise, timeoutPromise]);
      setMembers(m.data || []);
      setDocuments(d.data || []);
      setInsurance(i.data || []);
      setHealth(h.data || []);
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


      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '32px', scrollbarWidth: 'none' }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              background: active ? 'var(--color-text-1)' : 'transparent',
              color: active ? 'var(--color-base)' : 'var(--color-text-2)',
              border: active ? '1px solid var(--color-text-1)' : '1px solid transparent',
              borderRadius: '99px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}>
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
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
                    <div><strong style={{ color: 'var(--color-text-1)' }}>DOB:</strong> <br/>{m.dob || '—'}</div>
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
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '16px' }}>{d.doc_type}</div>
                    
                    <div style={{ fontSize: '13px', color: 'var(--color-text-2)', marginBottom: '12px' }}>
                      <strong style={{ color: 'var(--color-text-1)', display: 'block', marginBottom: '4px' }}>Document No:</strong>
                      <MaskedText text={d.doc_number} />
                    </div>
                    {d.expiry_date && (
                      <div style={{ fontSize: '13px', color: isExpiring ? '#EF4444' : 'var(--color-text-2)' }}>
                        <strong style={{ color: isExpiring ? '#EF4444' : 'var(--color-text-1)' }}>Expiry:</strong> {d.expiry_date}
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
                      <div><strong style={{ color: 'var(--color-text-1)' }}>Premium:</strong> <br/>{i.premium_amount ? `$${i.premium_amount}` : '—'}</div>
                      <div style={{ color: isExpiring ? '#EF4444' : 'inherit' }}><strong style={{ color: isExpiring ? '#EF4444' : 'var(--color-text-1)' }}>Renewal:</strong> <br/>{i.renewal_date || '—'}</div>
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
                      <div style={{ fontSize: '13px', fontWeight: 700, color: isOverdue && !r.completed ? '#EF4444' : 'var(--color-text-2)' }}>{r.due_date}</div>
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
