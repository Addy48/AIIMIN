import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import useNavPreferences from '../../hooks/useNavPreferences';

export default function NavPinEditor() {
  const {
    pinnedIds,
    activeIds,
    personaPresetId,
    maxPinned,
    minPinned,
    registry,
    personaPresets,
    togglePin,
    toggleActive,
    movePin,
    resetPins,
    applyPersonaPreset,
    setBottomNavEnabled,
    bottomNavEnabled,
  } = useNavPreferences();

  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--r-xl)',
        padding: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        <div>
          <h2 className="text-h3" style={{ marginBottom: 4, color: 'var(--color-text-1)' }}>Navigation bar</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-2)', lineHeight: 1.55, maxWidth: '52ch' }}>
            Choose which AIIMIN sections exist for you, then pin 1 to {maxPinned} destinations.
            Hidden sections disappear from navigation; unpinned active sections live under <strong>More</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={resetPins}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface-2)',
            color: 'var(--color-text-2)',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-3)', marginBottom: 16 }}>
        {activeIds.length} active · {pinnedIds.length} of {maxPinned} pinned (minimum {minPinned})
      </p>

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Sparkles size={15} color="var(--color-accent)" />
          <h3 className="text-h4" style={{ margin: 0 }}>Start from a life mode</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
          {personaPresets.map((preset) => {
            const isActive = personaPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPersonaPreset(preset.id)}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: 'var(--r-lg)',
                  border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: isActive ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
                  color: 'var(--color-text-1)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'block', fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{preset.label}</span>
                <span style={{ display: 'block', fontSize: 11, lineHeight: 1.45, color: 'var(--color-text-2)' }}>{preset.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {registry.map((item) => {
          const isActive = activeIds.includes(item.id);
          const isPinned = pinnedIds.includes(item.id);
          const pinIndex = pinnedIds.indexOf(item.id);
          const atMax = pinnedIds.length >= maxPinned && !isPinned;
          const atMin = pinnedIds.length <= minPinned && isPinned;
          const activeAtMin = activeIds.length <= minPinned && isActive;

          return (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(160px, 1fr) minmax(120px, 0.8fr) auto',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 'var(--r-lg)',
                border: `1px solid ${isPinned ? 'color-mix(in srgb, var(--color-accent) 30%, var(--color-border))' : 'var(--color-border)'}`,
                background: isPinned ? 'var(--color-accent-dim)' : isActive ? 'var(--color-surface-2)' : 'transparent',
                opacity: isActive ? 1 : 0.58,
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: activeAtMin ? 'not-allowed' : 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isActive}
                  disabled={activeAtMin}
                  onChange={() => toggleActive(item.id)}
                  style={{ accentColor: 'var(--color-accent)', width: 16, height: 16 }}
                />
                <span>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: 'var(--color-text-1)' }}>{item.label}</span>
                  <span style={{ display: 'block', fontSize: 10, color: 'var(--color-text-3)', marginTop: 2 }}>
                    {isActive ? 'Active section' : 'Hidden from your AIIMIN'}
                  </span>
                </span>
              </label>

              <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>
                {isPinned ? `Navbar slot ${pinIndex + 1}` : isActive ? 'In More menu' : 'Not shown'}
                {item.hideFromGuest ? ' · hidden for guests' : ''}
              </span>

              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                {isActive && (
                  <button
                    type="button"
                    disabled={(atMax && !isPinned) || (atMin && isPinned)}
                    onClick={() => togglePin(item.id)}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--r-md)',
                      background: isPinned ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                      color: isPinned ? 'var(--color-accent)' : 'var(--color-text-2)',
                      padding: '6px 10px',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: (atMax && !isPinned) || (atMin && isPinned) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isPinned ? 'Pinned' : 'Pin'}
                  </button>
                )}
                {isPinned && (
                  <>
                  <button
                    type="button"
                    aria-label={`Move ${item.label} left`}
                    disabled={pinIndex === 0}
                    onClick={() => movePin(item.id, 'left')}
                    className="nav-pin-editor__nudge"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${item.label} right`}
                    disabled={pinIndex === pinnedIds.length - 1}
                    onClick={() => movePin(item.id, 'right')}
                    className="nav-pin-editor__nudge"
                  >
                    <ChevronRight size={16} />
                  </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <h3 className="text-h4" style={{ marginBottom: 6 }}>Mobile bottom bar</h3>
        <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 12, lineHeight: 1.55 }}>
          On phones (&lt;768px), a bottom bar shows your first 4 pinned links for thumb reach.
          The top bar stays for brand, theme, and notifications. Desktop never shows the bottom bar.
        </p>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-text-1)' }}>
          <input
            type="checkbox"
            checked={bottomNavEnabled}
            onChange={(e) => setBottomNavEnabled(e.target.checked)}
            style={{ accentColor: 'var(--color-accent)', width: 16, height: 16 }}
          />
          Show mobile bottom navigation
        </label>
      </div>
    </section>
  );
}
