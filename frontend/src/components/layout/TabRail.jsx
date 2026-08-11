import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Target,
  BookOpen,
  Wallet,
  Focus,
  Calendar,
  GraduationCap,
  Trophy,
  Shield,
  FlaskConical,
  Users,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import useNavPreferences from '../../hooks/useNavPreferences';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { useThemeContext } from '../../context/ThemeContext';
import { isLightTheme } from '../../constants/themes';
import { ArchBracketMark, pickMarkColors } from '../brand/archBracketMark';
import '../../styles/tabRail.css';

const RAIL_ICONS = {
  overview: Home,
  habits: Target,
  goals: Target,
  journal: BookOpen,
  notes: BookOpen,
  finance: Wallet,
  family: Users,
  calendar: Calendar,
  placements: GraduationCap,
  sports: Trophy,
  discipline: Shield,
  focus: Focus,
  lab: FlaskConical,
  reports: LayoutGrid,
};

const PRIMARY_RAIL_IDS = [
  'overview', 'habits', 'goals', 'journal', 'notes', 'finance', 'reports', 'focus',
];

const RAIL_WIDTH_KEY = 'aiimin_rail_expanded';

function IconFor(id) {
  return RAIL_ICONS[id] || LayoutGrid;
}

export default function TabRail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const isLight = isLightTheme(theme);
  const markColors = pickMarkColors(isLight, { density: 'nav' });
  const { isTablet } = useDeviceTier();
  const { resolveForUser } = useNavPreferences();
  const [expanded, setExpanded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(RAIL_WIDTH_KEY) === '1';
  });
  const [moreOpen, setMoreOpen] = useState(false);

  const { pinned, more } = useMemo(
    () => resolveForUser(!!user?.isGuest),
    [resolveForUser, user?.isGuest],
  );

  const allActive = useMemo(() => {
    const map = new Map();
    [...pinned, ...more].forEach((item) => map.set(item.id, item));
    return map;
  }, [pinned, more]);

  const primaryItems = useMemo(
    () => PRIMARY_RAIL_IDS
      .map((id) => allActive.get(id))
      .filter(Boolean),
    [allActive],
  );

  const secondaryItems = useMemo(
    () => [...pinned, ...more].filter(
      (item, index, arr) => (
        !PRIMARY_RAIL_IDS.includes(item.id)
        && arr.findIndex((x) => x.id === item.id) === index
      ),
    ),
    [pinned, more],
  );

  const railWidth = expanded ? '240px' : '64px';

  const applyRailWidth = useCallback((isExpanded) => {
    const w = isExpanded ? '240px' : '64px';
    document.documentElement.style.setProperty('--rail-width', w);
  }, []);

  useEffect(() => {
    if (!isTablet) {
      document.documentElement.style.removeProperty('--rail-width');
      return undefined;
    }
    applyRailWidth(expanded);
    return () => document.documentElement.style.removeProperty('--rail-width');
  }, [isTablet, expanded, applyRailWidth]);

  useEffect(() => {
    if (!isTablet) return undefined;

    let touchStartX = 0;
    const onStart = (e) => { touchStartX = e.touches[0].clientX; };
    const onEnd = (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (touchStartX < 30 && dx > 60) {
        setExpanded(true);
        localStorage.setItem(RAIL_WIDTH_KEY, '1');
      }
      if (touchStartX < 280 && dx < -60) {
        setExpanded(false);
        localStorage.setItem(RAIL_WIDTH_KEY, '0');
      }
    };

    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchend', onEnd);
    };
  }, [isTablet]);

  const toggleExpanded = () => {
    setExpanded((v) => {
      const next = !v;
      localStorage.setItem(RAIL_WIDTH_KEY, next ? '1' : '0');
      return next;
    });
  };

  if (!isTablet) return null;

  return (
    <aside
      className={`tab-rail${expanded ? ' tab-rail--expanded' : ''}`}
      style={{ width: railWidth }}
      aria-label="Tablet navigation"
    >
      <div className="tab-rail__brand">
        <button type="button" className="tab-rail__brand-btn" onClick={toggleExpanded} aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}>
          <ArchBracketMark size={28} {...markColors} />
          {expanded && <span className="tab-rail__brand-word">AIIMIN</span>}
        </button>
        {expanded && (
          <button type="button" className="tab-rail__chevron" onClick={toggleExpanded} aria-label="Collapse navigation">
            <ChevronLeft size={18} />
          </button>
        )}
        {!expanded && (
          <button type="button" className="tab-rail__chevron tab-rail__chevron--peek" onClick={toggleExpanded} aria-label="Expand navigation">
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <nav className="tab-rail__primary">
        {primaryItems.map(({ id, to, label }) => {
          const Icon = IconFor(id);
          return (
            <NavLink
              key={id}
              to={to}
              className={({ isActive }) => `tab-rail__link${isActive ? ' tab-rail__link--active' : ''}`}
              title={label}
            >
              <Icon size={20} aria-hidden />
              {expanded && <span>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {secondaryItems.length > 0 && (
        <div className="tab-rail__more-block">
          <button
            type="button"
            className={`tab-rail__link tab-rail__more-toggle${moreOpen ? ' tab-rail__link--active' : ''}`}
            onClick={() => setMoreOpen((o) => !o)}
            aria-expanded={moreOpen}
          >
            <LayoutGrid size={20} aria-hidden />
            {expanded && <span>More{moreOpen ? '' : ` (${secondaryItems.length})`}</span>}
          </button>
          {moreOpen && expanded && (
            <div className="tab-rail__more-panel">
              {secondaryItems.map(({ id, to, label }) => (
                <NavLink
                  key={id}
                  to={to}
                  className={({ isActive }) => `tab-rail__sublink${isActive ? ' tab-rail__sublink--active' : ''}`}
                  onClick={() => setMoreOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="tab-rail__footer">
        <button
          type="button"
          className="tab-rail__link"
          onClick={() => window.dispatchEvent(new CustomEvent('aiimin:open-command-palette'))}
          title="Search / commands"
        >
            <Search size={20} aria-hidden />
            {expanded && <span>Search</span>}
          </button>
        <button
          type="button"
          className="tab-rail__avatar"
          onClick={() => navigate('/account')}
          title="Account"
          aria-label="Account settings"
        >
          {(user?.full_name || user?.email || 'A').charAt(0).toUpperCase()}
        </button>
      </div>
    </aside>
  );
}
