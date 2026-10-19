import React from 'react';
import { Palette, Bell, Gauge, ListChecks, Plug, Download, Trash2, ChevronRight, RefreshCw } from 'lucide-react';
import BrandMark from '../components/BrandMark';
import { SectionRule, F } from '../components/ui';
import { LIFE_MODES, IDENTITY } from '../data';

function Row({ icon: Icon, label, value, valueColor = 'var(--muted)', onClick, last, danger, control }) {
  return (
    <div
      className={onClick ? 'tap' : undefined}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: '12px 0',
        borderBottom: last ? 'none' : '1px solid var(--hair)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {Icon && <Icon size={16} strokeWidth={1.5} color={danger ? 'var(--danger)' : 'var(--muted)'} />}
      <span style={{ ...F.body(13.5), flex: 1, color: danger ? 'var(--danger)' : 'var(--color-text)' }}>{label}</span>
      {control}
      {value != null && <span style={{ ...F.body(13), color: valueColor }}>{value}</span>}
    </div>
  );
}

export default function Config({ vm }) {
  const id = IDENTITY;
  const xpPct = Math.round((id.xp / (id.xp + id.xpToNext)) * 100);

  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px' }}>
      <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: 'var(--space-3) 0', ...F.chrome }}>
        CONFIGURATION
      </div>

      {/* Profile hero */}
      <div
        className="tap"
        onClick={() => vm.go('osid')}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', border: '1px solid var(--hair)', padding: 'var(--space-4)', marginTop: 'var(--space-6)', cursor: 'pointer' }}
      >
        <BrandMark size={40} tile />
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', ...F.body(15, 500) }}>{id.name}</span>
          <span style={{ display: 'block', ...F.mono(10.5), color: 'var(--muted)', marginTop: 2 }}>{vm.chosenId} · {vm.tierLabel}</span>
        </span>
        <ChevronRight size={18} strokeWidth={1.5} color="var(--muted)" />
      </div>

      {/* Rank / XP strip */}
      <div style={{ border: '1px solid var(--hair)', borderTop: 'none', padding: 'var(--space-3) var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ font: "600 10px 'Barlow Condensed', sans-serif", letterSpacing: '.16em', color: 'var(--color-accent)' }}>
            RANK {id.rankNo}/{id.rankTotal} · {id.rank}
          </span>
          <span style={{ ...F.mono(11, 500) }}>{id.xp.toLocaleString('en-IN')} <span style={{ color: 'var(--muted)' }}>XP</span></span>
        </div>
        <div style={{ height: 2, background: 'var(--hair)', marginTop: 8 }}>
          <i style={{ display: 'block', height: '100%', width: `${xpPct}%`, background: 'var(--color-accent)' }} />
        </div>
        <div style={{ ...F.mono(9.5), color: 'var(--muted)', marginTop: 5 }}>{id.xpToNext.toLocaleString('en-IN')} XP TO {id.nextRank}</div>
      </div>

      {/* Life Arc (approved, minimal) */}
      <div style={{ borderLeft: '3px solid var(--color-accent)', background: 'var(--tint)', padding: 'var(--space-3) var(--space-4)', marginTop: 'var(--space-4)' }}>
        <div style={{ font: "600 9.5px 'Barlow Condensed', sans-serif", letterSpacing: '.2em', color: 'var(--color-accent)' }}>LIFE ARC</div>
        <div style={{ ...F.body(13, 400, 1.45), marginTop: 4, textWrap: 'pretty' }}>{id.arc}</div>
      </div>

      {/* Life mode switcher (approved) */}
      <SectionRule label="LIFE MODE" />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${LIFE_MODES.length}, 1fr)`, border: '1px solid var(--hair)', borderRight: 'none', marginTop: 'var(--space-3)' }}>
        {LIFE_MODES.map((m) => {
          const on = vm.lifeMode === m;
          return (
            <button
              key={m}
              className="tap"
              onClick={() => vm.setLifeMode(m)}
              style={{
                border: 'none',
                borderRight: '1px solid var(--hair)',
                padding: '9px 0',
                font: "600 10px 'Barlow Condensed', sans-serif",
                letterSpacing: '.12em',
                cursor: 'pointer',
                background: on ? 'var(--tint)' : 'transparent',
                color: on ? 'var(--color-accent)' : 'var(--muted)',
              }}
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* Sync */}
      <SectionRule label="SYNC" value={vm.syncState} valueColor={vm.synced ? 'var(--color-accent)' : 'var(--muted)'} />
      <div style={{ border: '1px solid var(--hair)', padding: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <span style={{ display: 'block', ...F.body(13.5, 500) }}>aiimin.in</span>
            <span style={{ display: 'block', ...F.mono(10), color: 'var(--muted)', marginTop: 2 }}>{vm.syncMeta}</span>
          </span>
          <button
            className="tap"
            onClick={vm.syncNow}
            style={{ display: 'flex', alignItems: 'center', gap: 6, font: "600 11px 'Barlow Condensed', sans-serif", letterSpacing: '.14em', color: 'var(--color-accent)', background: 'transparent', border: '1px solid var(--rule)', borderRadius: 'var(--radius-md)', padding: '7px 12px', cursor: 'pointer' }}
          >
            <RefreshCw size={13} strokeWidth={1.5} /> SYNC
          </button>
        </div>
        <div style={{ ...F.body(11.5, 400, 1.5), color: 'var(--muted)', marginTop: 'var(--space-3)', textWrap: 'pretty' }}>
          Capture through the week on the phone. Sunday, the site opens the full drawing — charts, reports, the Lab.
        </div>
      </div>

      {/* Preferences */}
      <SectionRule label="PREFERENCES" />
      <div style={{ marginTop: 'var(--space-2)' }}>
        <Row icon={Palette} label="Appearance" value={vm.themeName} valueColor="var(--color-accent)" onClick={vm.toggleTheme} />
        <Row icon={Gauge} label="Reduce motion" control={
          <span onClick={(e) => { e.stopPropagation(); vm.toggleMotion(); }} className="tap" style={{ width: 36, height: 19, border: '1px solid var(--rule)', display: 'block', position: 'relative', cursor: 'pointer' }}>
            <i style={{ position: 'absolute', top: 2, width: 13, height: 13, display: 'block', left: vm.motionX, background: vm.motionBg, transition: 'left 180ms cubic-bezier(.22,1,.36,1)' }} />
          </span>
        } />
        <Row icon={Bell} label="Notifications" value="Evening only" />
        <Row icon={ListChecks} label="Daily minimums" value="5 set" last />
      </div>

      {/* Data */}
      <SectionRule label="DATA" />
      <div style={{ marginTop: 'var(--space-2)' }}>
        <Row icon={Plug} label="Connections" value="Google, HDFC, Fi" />
        <Row icon={Download} label="Export everything" value="JSON, CSV" />
        <Row icon={Trash2} label="Delete account" danger last onClick={() => vm.go('state')} />
      </div>

      <div style={{ textAlign: 'center', ...F.mono(10), color: 'var(--muted)', marginTop: 'var(--space-6)' }}>
        AIIMIN 2.4.0 · BUILD 1188
      </div>
    </div>
  );
}
