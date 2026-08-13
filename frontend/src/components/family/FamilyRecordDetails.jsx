import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { formatDate, formatINR } from '../../utils/formatDate';
import { labelEnum, DOC_TYPE_LABELS } from '../../utils/enumLabels';

function Row({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-3)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color: 'var(--color-text-1)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
        {value}
      </div>
    </div>
  );
}

function buildRows(kind, item, getMemberName) {
  switch (kind) {
    case 'member':
      return [
        ['Name', item.name],
        ['Relation', item.relation],
        ['Date of Birth', formatDate(item.dob)],
        ['Blood Group', item.blood_group],
        ['Phone', item.phone],
      ];
    case 'document':
      return [
        ['Member', getMemberName(item.member_id)],
        ['Document Type', labelEnum(item.doc_type, DOC_TYPE_LABELS)],
        ['Document Number', item.doc_number],
        ['Expiry', formatDate(item.expiry_date)],
      ];
    case 'insurance':
      return [
        ['Member', getMemberName(item.member_id)],
        ['Policy', item.policy_name],
        ['Provider', item.provider],
        ['Policy Number', item.policy_number],
        ['Premium', formatINR(item.premium_amount)],
        ['Renewal', formatDate(item.renewal_date)],
        ['Nominee', item.nominee],
      ];
    case 'health':
      return [
        ['Member', getMemberName(item.member_id)],
        ['Allergies', item.allergies || 'None'],
        ['Conditions', item.conditions || 'None'],
        ['Medications', item.medications || 'None'],
        ['Doctor', [item.doctor_name, item.doctor_phone].filter(Boolean).join(' · ')],
      ];
    case 'vehicle':
      return [
        ['Make & Model', item.make_model],
        ['Registration', item.registration_number],
        ['Insurance Provider', item.insurance_provider],
        ['Insurance Expiry', formatDate(item.insurance_expiry)],
        ['PUC Expiry', formatDate(item.puc_expiry)],
        ['Service Due', formatDate(item.service_due_date)],
      ];
    case 'finance':
      return [
        ['Member', item.member_id ? getMemberName(item.member_id) : '—'],
        ['Institution', item.institution_name],
        ['Account Type', item.account_type],
        ['Account Number', item.account_number],
        ['Balance', formatINR(item.current_balance)],
        ['Notes', item.notes],
      ];
    case 'relationship':
      return [
        ['Name', item.name],
        ['Relationship', item.relation_type],
        ['Birthday', formatDate(item.birthday)],
        ['Anniversary', formatDate(item.anniversary_date)],
        ['Notes', item.notes],
      ];
    case 'reminder':
      return [
        ['Title', item.title],
        ['Description', item.description],
        ['Due Date', formatDate(item.due_date)],
        ['Status', item.completed ? 'Completed' : 'Active'],
        ['Auto-generated', item.is_auto_generated ? 'Yes' : 'No'],
      ];
    case 'emergency':
      return [
        ['Name', item.name],
        ['Role', item.relation_or_role],
        ['Phone', item.phone],
        ['Pinned', item.is_pinned ? 'Yes' : 'No'],
        ['Notes', item.notes],
      ];
    default:
      return [];
  }
}

const TITLES = {
  member: 'Member Details',
  document: 'Document Details',
  insurance: 'Insurance Details',
  health: 'Health Profile',
  vehicle: 'Vehicle Details',
  finance: 'Finance Record',
  relationship: 'Relationship Details',
  reminder: 'Reminder Details',
  emergency: 'Emergency Contact',
};

export default function FamilyRecordDetails({ view, onClose, getMemberName }) {
  if (!view) return null;

  const { kind, item } = view;
  const rows = buildRows(kind, item, getMemberName);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="family-detail-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: 20,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24,
            padding: 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-1)', margin: 0 }}>{TITLES[kind]}</h2>
            <button type="button" onClick={onClose} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-2)' }}>
              <X size={16} />
            </button>
          </div>
          {rows.map(([label, value]) => (
            <Row key={label} label={label} value={value} />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
