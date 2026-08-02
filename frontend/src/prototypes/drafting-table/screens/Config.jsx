import React from 'react';
import { Corners } from '../components/Blueprint';
import { SectionRule, F } from '../components/ui';

function Row({ label, value, valueColor = 'var(--muted)', onClick, last, danger, children }) {
  return (
    <div
      className={onClick ? 'tap' : undefined}
      onClick={onClick}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: last ? 'none' : '1px solid var(--hair)',
        ...F.body(13.5),
        color: danger ? 'var(--danger)' : undefined,
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      <span>{label}</span>
      {children != null ? children : value != null && <span style={{ color: valueColor }}>{value}</span>}
    </div>
  );
}

export default function Config({ vm }) {
  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px' }}>
      <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: 'var(--space-3) 0', ...F.chrome }}>
        CONFIGURATION
      </div>

      {/* Profile row → OS-ID */}
      <div
        className="tap"
        onClick={() => vm.go('osid')}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', border: '1px solid var(--hair)', padding: 'var(--space-4)', marginTop: 'var(--space-6)', cursor: 'pointer' }}
      >
        <span style={{ width: 42, height: 42, border: '1px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "600 14px 'Barlow Condensed', sans-serif", color: 'var(--color-accent)' }}>
          AU
        </span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', ...F.body(14, 500) }}>Aaditya Upadhyay</span>
          <span style={{ display: 'block', ...F.mono(10.5), color: 'var(--muted)' }}>{vm.chosenId} · {vm.tierLabel}</span>
        </span>
        <span style={{ ...F.body(14), color: 'var(--muted)' }}>›</span>
      </div>

      {/* Sync block */}
      <div style={{ position: 'relative', border: '1px solid var(--color-accent)', background: 'var(--tint)', padding: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
        <Corners />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <span style={{ display: 'block', ...F.body(13.5, 500) }}>Sync · aiimin.in</span>
            <span style={{ display: 'block', ...F.mono(10), color: 'var(--muted)', marginTop: 2 }}>{vm.syncMeta}</span>
          </span>
          <span style={{ font: "600 10px 'Barlow Condensed', sans-serif", letterSpacing: '.16em', color: 'var(--color-bg)', background: 'var(--color-accent)', padding: '3px 7px' }}>
            {vm.syncState}
          </span>
        </div>
        <div style={{ ...F.body(11.5, 400, 1.5), color: 'var(--muted)', marginTop: 'var(--space-3)', textWrap: 'pretty' }}>
          Capture here through the week. Sunday, the site opens the full drawing — charts, reports, the Lab.
        </div>
        <button
          className="tap"
          onClick={vm.syncNow}
          style={{
            marginTop: 'var(--space-3)',
            font: "600 11.5px 'Barlow Condensed', sans-serif",
            letterSpacing: '.14em',
            color: 'var(--color-accent)',
            background: 'transparent',
            border: '1px solid var(--rule)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 13px',
            cursor: 'pointer',
          }}
        >
          SYNC NOW
        </button>
      </div>

      {/* Preferences */}
      <SectionRule label="PREFERENCES" />
      <div style={{ marginTop: 'var(--space-2)' }}>
        <Row label="Appearance" value={vm.themeName} valueColor="var(--color-accent)" onClick={vm.toggleTheme} />
        <Row label="Daily minimums" value="5 set" />
        <Row label="Notifications" value="Evening only" />
        <div className="tap" onClick={vm.toggleMotion} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', ...F.body(13.5), cursor: 'pointer' }}>
          <span>Reduce motion</span>
          <span style={{ width: 36, height: 19, border: '1px solid var(--rule)', display: 'block', position: 'relative' }}>
            <i style={{ position: 'absolute', top: 2, width: 13, height: 13, display: 'block', left: vm.motionX, background: vm.motionBg }} />
          </span>
        </div>
      </div>

      {/* Data */}
      <SectionRule label="DATA" />
      <div style={{ marginTop: 'var(--space-2)' }}>
        <Row label="Connections" value="Google, HDFC, Fi" />
        <Row label="Export everything" value="JSON, CSV" />
        <Row label="Delete account" danger last onClick={() => vm.go('state')} />
      </div>

      <div style={{ textAlign: 'center', ...F.mono(10), color: 'var(--muted)', marginTop: 'var(--space-6)' }}>
        AIIMIN 2.4.0 · BUILD 1188
      </div>
    </div>
  );
}
