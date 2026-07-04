import React, { useRef } from 'react';
import { Download, Phone, Heart, AlertTriangle } from 'lucide-react';

/**
 * Emergency Card — printable one-page summary for crisis situations.
 */
export default function EmergencyCard({ members = [], emergencyContacts = [], healthRecords = [] }) {
  const printRef = useRef(null);

  const pinned = emergencyContacts.filter((c) => c.is_pinned);
  const contacts = pinned.length ? pinned : emergencyContacts.slice(0, 3);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>AIIMIN Emergency Card</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; }
        h1 { font-size: 20px; border-bottom: 2px solid #EF4444; padding-bottom: 8px; }
        h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; margin-top: 24px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: 600; }
        .critical { color: #EF4444; font-weight: 700; }
      </style></head><body>
      ${content.innerHTML}
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', background: 'rgba(239, 68, 68, 0.08)', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={20} style={{ color: '#EF4444' }} />
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-1)' }}>Emergency Card</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>Print or save as PDF for wallet / phone</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px',
            border: 'none', background: '#EF4444', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer',
          }}
        >
          <Download size={14} /> Print / PDF
        </button>
      </div>

      <div ref={printRef} style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 4px', color: 'var(--color-text-1)' }}>🚨 AIIMIN Emergency Summary</h1>
        <p style={{ fontSize: '11px', color: 'var(--color-text-3)', margin: '0 0 20px' }}>Generated {new Date().toLocaleDateString('en-IN')}</p>

        <h2 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Phone size={12} /> Emergency Contacts
        </h2>
        {contacts.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-3)' }}>No contacts added yet.</p>
        ) : (
          contacts.map((c) => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-1)' }}>{c.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>{c.relation_or_role || c.relation || c.relationship}</div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#EF4444', fontFamily: 'var(--font-mono)' }}>{c.phone}</div>
            </div>
          ))
        )}

        <h2 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', margin: '24px 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Heart size={12} /> Critical Health Info
        </h2>
        {healthRecords.length === 0 && members.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-3)' }}>Add health records in the Health tab.</p>
        ) : (
          <>
            {members.slice(0, 4).map((m) => (
              <div key={m.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{m.name} {m.blood_group && <span className="critical" style={{ color: '#EF4444' }}>({m.blood_group})</span>}</div>
                {m.allergies && <div style={{ fontSize: '12px', color: 'var(--color-text-2)' }}>Allergies: {m.allergies}</div>}
              </div>
            ))}
            {healthRecords.slice(0, 3).map((h) => (
              <div key={h.id} style={{ fontSize: '12px', color: 'var(--color-text-2)', padding: '6px 0' }}>
                {h.condition || h.title}: {h.notes || h.medication}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
