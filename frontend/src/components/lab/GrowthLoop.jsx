import React from 'react';
import { motion } from 'framer-motion';
import { Target, Brain, Activity, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Growth Engine — product loop (not marketing waterfall).
 * Design read: Life OS product UI, calm/precise, AIIMIN palette, VARIANCE 5 / MOTION 3 / DENSITY 4.
 */
const nodes = [
  { id: 'goals', step: '01', label: 'Set Goal', desc: 'Name the arc', icon: Target, route: '/goals', accent: '#ff6b35' },
  { id: 'decision', step: '02', label: 'Strategize', desc: 'Mental models', icon: Brain, route: '?module=decision', accent: '#6b7280' },
  { id: 'habits', step: '03', label: 'Build Habit', desc: 'Daily reps', icon: Activity, route: '/habits', accent: '#10b981' },
  { id: 'focus', step: '04', label: 'Deep Work', desc: 'Protect blocks', icon: Zap, route: '/focus', accent: '#ff6b35' },
  { id: 'discipline', step: '05', label: 'Maintain', desc: 'Surf the urge', icon: Shield, route: '/discipline', accent: '#14171A' },
];

export default function GrowthLoop() {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    if (route.startsWith('?')) {
      const newUrl = new URL(window.location.href);
      const params = new URLSearchParams(route);
      newUrl.searchParams.set('module', params.get('module'));
      window.history.pushState({}, '', newUrl);
      window.dispatchEvent(new Event('popstate'));
    } else {
      navigate(route);
    }
  };

  return (
    <section
      aria-label="Growth Engine"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 28,
        padding: '36px 36px 40px',
        marginBottom: 40,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soft atmosphere — locked palette only */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 0% 0%, rgba(255,107,53,0.08), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(16,185,129,0.06), transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: 10 }}>
          Compounding loop
        </div>
        <h2 style={{
          fontSize: 'clamp(22px, 3vw, 30px)',
          fontWeight: 800,
          color: 'var(--color-text-1)',
          margin: '0 0 10px',
          letterSpacing: '-0.03em',
          fontFamily: 'var(--font-serif)',
          textWrap: 'balance',
        }}>
          The Growth Engine
        </h2>
        <p style={{
          color: 'var(--color-text-2)',
          fontSize: 14,
          lineHeight: 1.55,
          margin: '0 0 32px',
          maxWidth: 560,
        }}>
          Five linked moves. Click any stage to jump in — goals, models, habits, focus, discipline.
        </p>

        {/* Desktop: horizontal stages with connectors */}
        <div
          className="growth-engine-track"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gap: 12,
            alignItems: 'stretch',
          }}
        >
          {nodes.map((node, i) => (
            <motion.button
              key={node.id}
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigate(node.route)}
              style={{
                position: 'relative',
                textAlign: 'left',
                padding: '20px 18px',
                borderRadius: 18,
                border: '1px solid var(--color-border)',
                background: 'var(--color-elevated)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                minHeight: 148,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {i < nodes.length - 1 && (
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 34,
                    right: -10,
                    width: 16,
                    height: 2,
                    background: 'linear-gradient(90deg, var(--color-border), transparent)',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                  className="growth-engine-connector"
                />
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `color-mix(in srgb, ${node.accent} 14%, transparent)`,
                  color: node.accent === '#14171A' ? 'var(--color-text-1)' : node.accent,
                }}>
                  <node.icon size={20} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-text-3)', letterSpacing: '0.08em' }}>{node.step}</span>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text-1)', letterSpacing: '-0.02em', marginBottom: 4 }}>{node.label}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-3)', fontWeight: 500, lineHeight: 1.4 }}>{node.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .growth-engine-track {
            grid-template-columns: 1fr !important;
          }
          .growth-engine-connector {
            display: none !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .growth-engine-track button {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
