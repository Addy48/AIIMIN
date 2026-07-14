import React, { useState, useEffect } from 'react';
import { useThemeContext } from '../../../context/ThemeContext';
import { apiPatch } from '../../../utils/api';
import { Sun, Moon, Check, Compass } from 'lucide-react';
import { THEME_META, isLightTheme } from '../../../constants/themes';
import NavPinEditor from '../../../components/settings/NavPinEditor';
import { useFontScale } from '../../../hooks/useFontScale';
import toast from '../../../utils/toast';

const AI_TONES = [
  {
    id: 'harsh',
    label: 'Direct',
    desc: 'Straight numbers. No softening.',
    sample: 'You missed 3 habits this week. Tuesday and Thursday are your weak days — fix those first.',
  },
  {
    id: 'motivating',
    label: 'Encouraging',
    desc: 'Honest but supportive.',
    sample: '3 habits missed, but you held 4 days straight on sleep. Build on that — it\'s your anchor.',
  },
  {
    id: 'scientific',
    label: 'Analytical',
    desc: 'Data, correlations, patterns.',
    sample: 'Habit completion: 71%. Sleep correlation with mood: r=0.62. Prioritise bedtime consistency first.',
  },
];

const SPORT_OPTIONS = ['Cricket', 'Football', 'Basketball', 'F1', 'Baseball', 'Hockey', 'Tennis', 'Volleyball', 'Table Tennis'];
const TEAM_PRESETS = {
  Cricket: ['India', 'RCB', 'MI', 'CSK', 'KKR', 'DC', 'GT', 'LSG'],
  Football: ['Arsenal', 'Real Madrid', 'Manchester United', 'Barcelona', 'Chelsea', 'Liverpool'],
  Basketball: ['Lakers', 'Warriors', 'Celtics', 'Heat'],
  F1: ['Verstappen', 'Hamilton', 'Leclerc', 'Norris', 'Ferrari', 'McLaren', 'Red Bull'],
  Baseball: ['Yankees', 'Dodgers', 'Red Sox', 'Astros', 'Cubs'],
  Hockey: ['India', 'Australia', 'Netherlands', 'Germany', 'Belgium'],
  Tennis: ['Alcaraz', 'Sinner', 'Djokovic', 'Swiatek', 'Sabalenka', 'Federer', 'Nadal'],
  Volleyball: ['India', 'Brazil', 'USA', 'Poland', 'Italy', 'Japan'],
  'Table Tennis': ['Harimoto', 'Fan Zhendong', 'Ma Long', 'Sathiyan', 'Manika Batra']
};

const THEME_ICON = {
  'aiimin-dark': <Moon size={16} />,
  'aiimin-light': <Sun size={16} />,
};

const FONT_SCALES = [
  { id: 'small', label: 'Small', px: '13px', ratio: 0.93, desc: 'Compact' },
  { id: 'normal', label: 'Normal', px: '15px', ratio: 1, desc: 'Default' },
  { id: 'large', label: 'Large', px: '17px', ratio: 1.12, desc: 'Accessible' },
];

export default function PersonalizationSection({ profile, onProfileUpdate }) {
  const { theme: activeTheme, setTheme } = useThemeContext();

  const [aiTone, setAiTone] = useState(profile?.ai_tone || 'motivating');
  const [favoriteSports, setFavoriteSports] = useState(profile?.favorite_sports || []);
  const [favoriteTeams, setFavoriteTeams] = useState(profile?.favorite_teams || {});
  const save = async (patch) => {
    try {
      const updated = await apiPatch('/account/user-profile', patch);
      onProfileUpdate?.(updated);
    } catch (err) {
      /* fail silently — UI already updated */
    }
  };

  const toggleSport = (sport) => {
    const next = favoriteSports.includes(sport)
      ? favoriteSports.filter((s) => s !== sport)
      : [...favoriteSports, sport];
    setFavoriteSports(next);
    save({ favorite_sports: next });
  };

  const toggleTeam = (sport, team) => {
    const current = favoriteTeams[sport] || [];
    const nextList = current.includes(team)
      ? current.filter((t) => t !== team)
      : [...current, team];
    const next = { ...favoriteTeams, [sport]: nextList };
    setFavoriteTeams(next);
    save({ favorite_teams: next });
  };

  const { fontScale, setFontScale } = useFontScale(profile?.font_scale, async (nextScale) => {
    await save({ font_scale: nextScale });
  });

  useEffect(() => {
    const onPersonaSync = (event) => {
      const patch = event?.detail;
      if (!patch) return;
      if (patch.favorite_sports) setFavoriteSports(patch.favorite_sports);
      if (patch.favorite_teams) setFavoriteTeams(patch.favorite_teams);
      save(patch);
    };
    window.addEventListener('aiimin-persona-profile-sync', onPersonaSync);
    return () => window.removeEventListener('aiimin-persona-profile-sync', onPersonaSync);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ marginBottom: 12 }}>
        <p className="text-label" style={{ color: 'var(--color-text-3)', marginBottom: 6 }}>Settings</p>
        <h1 className="text-h1" style={{ marginBottom: 8 }}>Personalization</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>
          Tune AIIMIN to match how you think and work.
        </p>
      </div>

      <section style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--r-xl)',
        padding: 20,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
      }}
      >
        <div style={{ minWidth: 0, flex: '1 1 200px' }}>
          <h2 className="text-h3" style={{ margin: '0 0 4px', color: 'var(--color-text-1)' }}>Product tour</h2>
          <p className="text-sm" style={{ margin: 0, color: 'var(--color-text-2)', maxWidth: 420 }}>
            Optional eight-stop walkthrough. If you tapped Not now, we never ask again — start it here whenever you want.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (typeof window.startProductTour === 'function') {
              window.startProductTour();
              toast.success('Tour started');
            } else {
              window.dispatchEvent(new CustomEvent('aiimin:start-tour'));
              toast.success('Starting tour…');
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            minHeight: 44,
            padding: '10px 16px',
            borderRadius: 10,
            border: '1px solid var(--color-accent)',
            background: 'color-mix(in srgb, var(--color-accent) 14%, transparent)',
            color: 'var(--color-accent)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Compass size={16} aria-hidden />
          Start product tour
        </button>
      </section>

      <NavPinEditor />

      {/* ─── Theme ─── */}
      <section style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--r-xl)', padding: '24px',
      }}>
        <h2 className="text-h3" style={{ marginBottom: 4, color: 'var(--color-text-1)' }}>Appearance</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 20 }}>
          Choose your environment. Changes apply instantly.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
        }}>
          {THEME_META.map((t) => {
            const isActive = activeTheme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={(e) => { setTheme(t.id, e); save({ theme: t.id }); }}
                style={{
                  textAlign: 'left', padding: 0,
                  border: `2px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  borderRadius: 12, cursor: 'pointer', background: 'none',
                  overflow: 'hidden', transition: 'border-color 0.15s',
                }}
              >
                {/* Mini preview swatch */}
                <div style={{
                  height: 60, background: t.preview.bg,
                  padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5,
                }}>
                  <div style={{
                    width: '40%', height: 6, borderRadius: 3,
                    background: t.preview.accent, opacity: 0.9,
                  }} />
                  <div style={{
                    width: '70%', height: 4, borderRadius: 3,
                    background: t.preview.text, opacity: 0.4,
                  }} />
                  <div style={{
                    width: '55%', height: 4, borderRadius: 3,
                    background: t.preview.text, opacity: 0.2,
                  }} />
                </div>
                {/* Label row */}
                <div style={{
                  padding: '10px 12px',
                  background: 'var(--color-surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-1)', marginBottom: 1 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {THEME_ICON[t.id]}
                        {t.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-3)' }}>{t.desc}</div>
                  </div>
                  {isActive && (
                    <Check size={14} color="var(--color-accent)" strokeWidth={3} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Font scale */}
        <div style={{ marginTop: 24 }}>
          <div className="text-label" style={{ marginBottom: 12, color: 'var(--color-text-3)' }}>
            Text size
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {FONT_SCALES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setFontScale(s.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--r-md)',
                  border: fontScale === s.id ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                  background: fontScale === s.id ? 'var(--color-accent-dim)' : 'transparent',
                  color: fontScale === s.id ? 'var(--color-accent)' : 'var(--color-text-2)',
                  fontSize: s.id === 'small' ? 11 : s.id === 'large' ? 14 : 12,
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                {s.label}
                <span style={{ display: 'block', fontSize: 9, opacity: 0.6, marginTop: 1 }}>{s.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Tone ─── */}
      <section style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--r-xl)', padding: '24px',
      }}>
        <h2 className="text-h3" style={{ marginBottom: 4, color: 'var(--color-text-1)' }}>AI voice</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 20 }}>
          How the AI talks to you across habits, journal, and discipline coaching.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AI_TONES.map((t) => {
            const isActive = aiTone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { setAiTone(t.id); save({ ai_tone: t.id }); }}
                style={{
                  textAlign: 'left', padding: '16px 18px',
                  borderRadius: 'var(--r-lg)',
                  border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: isActive ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? 'var(--color-accent)' : 'var(--color-text-1)' }}>
                    {t.label}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-3)' }}>{t.desc}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-2)', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                  "{t.sample}"
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Sports ─── */}
      <section style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--r-xl)', padding: '24px',
      }}>
        <h2 className="text-h3" style={{ marginBottom: 4, color: 'var(--color-text-1)' }}>Sports feed</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 20 }}>
          Powers your Arena. Live matches for your teams float to the top.
        </p>

        <div className="text-label" style={{ marginBottom: 10, color: 'var(--color-text-3)' }}>Sports you follow</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {SPORT_OPTIONS.map((sport) => {
            const isActive = favoriteSports.includes(sport);
            return (
              <button
                key={sport}
                type="button"
                onClick={() => toggleSport(sport)}
                style={{
                  padding: '8px 16px', borderRadius: 999,
                  border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: isActive ? 'var(--color-accent-dim)' : 'transparent',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-2)',
                  fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {isActive && <Check size={11} style={{ marginRight: 5, display: 'inline' }} />}
                {sport}
              </button>
            );
          })}
        </div>

        {favoriteSports.map((sport) => (
          <div key={sport} style={{ marginBottom: 16 }}>
            <div className="text-label" style={{ marginBottom: 8, color: 'var(--color-text-3)' }}>
              {sport} — pick your teams
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {(TEAM_PRESETS[sport] || []).map((team) => {
                const selected = (favoriteTeams[sport] || []).includes(team);
                return (
                  <button
                    key={team}
                    type="button"
                    onClick={() => toggleTeam(sport, team)}
                    style={{
                      padding: '6px 13px', borderRadius: 8,
                      border: `1px solid ${selected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: selected ? 'var(--color-accent-dim)' : 'transparent',
                      color: selected ? 'var(--color-accent)' : 'var(--color-text-2)',
                      fontWeight: 600, fontSize: 11, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {team}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
