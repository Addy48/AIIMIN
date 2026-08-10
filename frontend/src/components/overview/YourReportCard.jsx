import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Lock, ChevronRight } from 'lucide-react';
import { apiGet } from '../../utils/api';
import { hasTier } from '../../utils/tierGating';
import IvorySnapshot from '../reports/IvorySnapshot';

/**
 * Today discoverability card for Reports.
 * Explore → locked paywall CTA · Core+ → Snapshot · Pro → Standard · Elite → Intelligence
 */
export default function YourReportCard({ user, tier = 'explore' }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const isCorePlus = hasTier(tier, 'core');
  const isProPlus = hasTier(tier, 'pro');
  const isElite = hasTier(tier, 'elite');

  useEffect(() => {
    if (!user?.id || user.isGuest || !isCorePlus) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await apiGet('/intelligence/report?days=7');
        if (!cancelled) setReport(data);
      } catch {
        if (!cancelled) setReport(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, user?.isGuest, isCorePlus]);

  if (!isCorePlus) {
    return (
      <section
        style={{
          borderRadius: 20,
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: 6 }}>
              Your Report
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-1)' }}>
              Intelligence reports unlock on Core
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--color-text-2)', lineHeight: 1.5, maxWidth: 420 }}>
              Snapshot pulse, Standard PDF, and Elite web intelligence live under Reports.
            </p>
          </div>
          <Link
            to="/account?section=subscription"
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 14px',
              borderRadius: 12,
              background: 'var(--color-accent)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            <Lock size={14} /> Upgrade
          </Link>
        </div>
        <div style={{ position: 'relative', height: 120, background: 'var(--color-elevated)' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(255,107,53,0.12), transparent 40%, rgba(255,107,53,0.08))',
            filter: 'blur(1px)',
          }}
          />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 10, letterSpacing: '0.08em',
            color: 'var(--color-accent)',
          }}
          >
            PRO PREVIEW · LOCKED
          </div>
        </div>
      </section>
    );
  }

  const ctaLabel = isElite ? 'Open Intelligence Report' : isProPlus ? 'Open Standard Report' : 'Open Snapshot';
  const ctaTo = isElite ? '/reports?view=intelligence' : '/reports?tab=snapshot';

  return (
    <section
      style={{
        borderRadius: 20,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        padding: '18px 20px 20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: 6 }}>
            Your Report
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={16} style={{ color: 'var(--color-accent)' }} />
            {isElite ? 'Intelligence Report' : isProPlus ? 'Standard + Snapshot' : 'Ivory Snapshot'}
          </div>
        </div>
        <Link
          to={ctaTo}
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '8px 12px',
            borderRadius: 10,
            border: '1px solid color-mix(in srgb, var(--color-accent) 35%, var(--color-border))',
            background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)',
            color: 'var(--color-accent)',
            fontSize: 12,
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          {ctaLabel} <ChevronRight size={14} />
        </Link>
      </div>

      {loading && (
        <div style={{ padding: 24, color: 'var(--color-text-3)', fontSize: 13 }}>Loading snapshot…</div>
      )}
      {!loading && (
        <IvorySnapshot
          report={report}
          user={user}
          showUpgrade={!isProPlus}
          showCorrelations={isProPlus}
          compact
        />
      )}
    </section>
  );
}
