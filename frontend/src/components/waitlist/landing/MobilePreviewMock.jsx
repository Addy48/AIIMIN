import React from 'react';
import { CheckCircle2, ShieldCheck, Flame, Lightning } from 'lucide-react';
import { ArchBracketMark, DARK_PICK } from '../../brand/archBracketMark';
import { Fingerprint } from '@phosphor-icons/react';

export default function MobilePreviewMock() {
  return (
    <div className="mobile-preview-mock" aria-label="Mobile companion capture preview mockup" style={{ background: '#12141a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '14px', boxShadow: '0 20px 48px rgba(0, 0, 0, 0.8)' }}>
      {/* Tactical OS-ID Header */}
      <div className="mobile-mock-header" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px', padding: '8px 10px', background: 'linear-gradient(145deg, #181B22 0%, #101217 100%)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B981' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.08em', color: '#A1A8B8' }}>OPERATOR // ADTY·SYS·01</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '7px', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1px 4px', borderRadius: '3px' }}>
            <Fingerprint size={8} weight="bold" />
            <span>TEE</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: 'linear-gradient(135deg, #242933 0%, #161920 100%)', border: '1px solid rgba(255, 255, 255, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ArchBracketMark size={12} pick={DARK_PICK} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#f8fafc' }}>Aaditya Upadhyay</span>
                <span style={{ fontSize: '6.5px', fontWeight: 800, color: '#ff6b35', background: 'rgba(255, 107, 53, 0.15)', border: '1px solid rgba(255, 107, 53, 0.3)', padding: '0 3px', borderRadius: '2px' }}>FOUNDER</span>
              </div>
              <span style={{ fontSize: '7.5px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>0x8F3D…41C7 · SQLite 100%</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' }}>
            <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.14)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1px 5px', borderRadius: '4px' }}>
              84 LHS
            </span>
            <span style={{ fontSize: '7px', fontWeight: 700, color: '#ff6b35' }}>+14% DEPTH</span>
          </div>
        </div>
      </div>

      <div className="mobile-mock-rows" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
        <div className="mobile-mock-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 9px', background: '#1a1d24', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <div className="mobile-mock-row-info">
            <span className="mobile-mock-label" style={{ fontSize: '11px', fontWeight: 600, color: '#f8fafc' }}>Morning Gym Minimum</span>
            <span className="mobile-mock-sub" style={{ fontSize: '9px', color: '#94a3b8' }}>45m Strength · Logged 06:30</span>
          </div>
          <span className="mobile-mock-check">
            <CheckCircle2 size={14} color="#10b981" />
          </span>
        </div>

        <div className="mobile-mock-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 9px', background: '#1a1d24', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <div className="mobile-mock-row-info">
            <span className="mobile-mock-label" style={{ fontSize: '11px', fontWeight: 600, color: '#f8fafc' }}>Deep Work Block</span>
            <span className="mobile-mock-sub" style={{ fontSize: '9px', color: '#94a3b8' }}>3h 15m Monorepo Code</span>
          </div>
          <span className="mobile-mock-check">
            <CheckCircle2 size={14} color="#10b981" />
          </span>
        </div>

        <div className="mobile-mock-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 9px', background: '#1a1d24', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <div className="mobile-mock-row-info">
            <span className="mobile-mock-label" style={{ fontSize: '11px', fontWeight: 600, color: '#f8fafc' }}>UPI Reimbursement</span>
            <span className="mobile-mock-sub" style={{ fontSize: '9px', color: '#94a3b8' }}>Lent Rahul ₹500 (Linked)</span>
          </div>
          <span style={{ fontSize: '8px', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '2px 5px', borderRadius: '3px' }}>
            LINKED
          </span>
        </div>

        <div className="mobile-mock-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 9px', background: '#1a1d24', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <div className="mobile-mock-row-info">
            <span className="mobile-mock-label" style={{ fontSize: '11px', fontWeight: 600, color: '#f8fafc' }}>Evening Debrief</span>
            <span className="mobile-mock-sub" style={{ fontSize: '9px', color: '#94a3b8' }}>Journal & Ledger Synced</span>
          </div>
          <span className="mobile-mock-check">
            <CheckCircle2 size={14} color="#10b981" />
          </span>
        </div>
      </div>

      <div
        className="mobile-mock-save"
        style={{
          padding: '8px',
          borderRadius: '8px',
          background: 'linear-gradient(180deg, #ff6b35 0%, #ea580c 100%)',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 800,
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
        }}
      >
        Settle to Offline SQLite Graph
      </div>
    </div>
  );
}
