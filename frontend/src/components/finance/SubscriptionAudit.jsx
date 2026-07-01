import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Repeat, AlertTriangle, Scissors } from 'lucide-react';
import { apiGet } from '../../utils/api';
import AnimatedNumber from '../ui/AnimatedNumber';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

/**
 * Subscription Audit — surfaces recurring drains from transaction patterns.
 */
export default function SubscriptionAudit({ transactions = [], formatCurrency }) {
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!transactions.length) {
      setLoading(false);
      return;
    }
    apiGet('/wealth/subscription-audit')
      .then(setAudit)
      .catch(() => {
        // Client-side fallback: simple keyword scan
        const subs = [];
        const seen = new Set();
        transactions.filter((t) => t.type === 'expense').forEach((t) => {
          const desc = (t.description || t.category || '').toLowerCase();
          if ((desc.includes('netflix') || desc.includes('spotify') || desc.includes('subscription')) && !seen.has(desc)) {
            seen.add(desc);
            subs.push({ name: t.description || t.category, amount: Math.abs(Number(t.amount)), monthlyCost: Math.abs(Number(t.amount)), frequency: 'monthly', confidence: 'medium' });
          }
        });
        setAudit({ subscriptions: subs, totalMonthly: subs.reduce((s, x) => s + x.monthlyCost, 0), count: subs.length });
      })
      .finally(() => setLoading(false));
  }, [transactions.length]);

  const format = formatCurrency || fmt;

  if (loading) {
    return (
      <div style={{ padding: '28px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '24px', minHeight: 120, opacity: 0.6 }}>
        Scanning transaction patterns…
      </div>
    );
  }

  if (!audit || audit.count === 0) {
    return (
      <div style={{ padding: '28px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Repeat size={18} style={{ color: '#10B981' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Subscription Audit</h3>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--color-text-3)', margin: 0 }}>No recurring charges detected yet. Log more transactions to enable pattern matching.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '28px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Repeat size={18} style={{ color: 'var(--color-accent)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>Subscription Audit</h3>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--color-text-3)', margin: 0 }}>
            {audit.count} recurring charge{audit.count !== 1 ? 's' : ''} detected from your ledger
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-3)' }}>Est. Monthly</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#EF4444', fontFamily: 'var(--font-mono)' }}>
            <AnimatedNumber value={audit.totalMonthly} duration={0.5} prefix="₹" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: 220, overflowY: 'auto' }}>
        {audit.subscriptions.map((sub, i) => (
          <div
            key={`${sub.name}-${i}`}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 14px', borderRadius: '12px',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {sub.name}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-3)', marginTop: '2px' }}>
                {sub.frequency} · {sub.confidence} confidence
                {sub.lastCharge && ` · last ${sub.lastCharge}`}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-1)', fontFamily: 'var(--font-mono)' }}>
                {format(sub.amount)}
              </div>
              <div style={{ fontSize: '10px', color: '#EF4444', fontWeight: 600 }}>
                ≈ {format(sub.monthlyCost)}/mo
              </div>
            </div>
          </div>
        ))}
      </div>

      {audit.totalMonthly > 2000 && (
        <div style={{
          marginTop: '16px', padding: '12px 14px', borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)',
          display: 'flex', gap: '10px', alignItems: 'flex-start',
        }}>
          <AlertTriangle size={16} style={{ color: '#EF4444', flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '11px', color: 'var(--color-text-2)', lineHeight: 1.5 }}>
            <Scissors size={12} style={{ display: 'inline', marginRight: 4 }} />
            You&apos;re spending ~{format(audit.totalMonthly)}/month on subscriptions.
            Cutting 2 unused services could free {format(Math.round(audit.totalMonthly * 0.3))}/month for SIP.
          </div>
        </div>
      )}
    </motion.div>
  );
}
