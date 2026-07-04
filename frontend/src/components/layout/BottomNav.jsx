import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Target,
  Trophy,
  Wallet,
  MoreHorizontal,
  BookOpen,
  Calendar,
  Users,
  FlaskConical,
  Focus,
  GraduationCap,
  Shield,
  LayoutGrid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import useNavPreferences from '../../hooks/useNavPreferences';

const BOTTOM_NAV_ICONS = {
  overview: Home,
  habits: Target,
  goals: Target,
  journal: BookOpen,
  finance: Wallet,
  family: Users,
  calendar: Calendar,
  placements: GraduationCap,
  sports: Trophy,
  discipline: Shield,
  focus: Focus,
  lab: FlaskConical,
};

const HIDE_ON_PATHS = [
  '/login',
  '/onboarding',
  '/auth/callback',
  '/privacy',
  '/terms',
  '/data-deletion',
  '/security',
  '/about',
  '/contact',
  '/brand',
];

const IS_WAITLIST_MODE = process.env.REACT_APP_WAITLIST_MODE === 'true';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
}

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const isMobile = useIsMobile();
  const { bottomNavEnabled, resolveForUser } = useNavPreferences();

  const { pinned, more } = useMemo(
    () => resolveForUser(!!user?.isGuest),
    [resolveForUser, user?.isGuest],
  );

  const bottomTabs = pinned.slice(0, 4);
  const moreItems = [...pinned.slice(4), ...more];

  const hiddenPath = HIDE_ON_PATHS.some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
  ) || (IS_WAITLIST_MODE && location.pathname === '/');

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  if (!isMobile || !bottomNavEnabled || hiddenPath) return null;

  const IconFor = (id) => BOTTOM_NAV_ICONS[id] || LayoutGrid;

  return (
    <>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {bottomTabs.map(({ id, to, label }) => {
          const active = location.pathname === to || location.pathname.startsWith(`${to}/`);
          const Icon = IconFor(id);
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              onClick={() => navigate(to)}
              className={`bottom-nav__tab${active ? ' bottom-nav__tab--active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          );
        })}
        {moreItems.length > 0 && (
          <button
            type="button"
            aria-label="More"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen(true)}
            className="bottom-nav__tab"
          >
            <MoreHorizontal size={20} />
            <span>More</span>
          </button>
        )}
      </nav>

      <AnimatePresence>
        {moreOpen && moreItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMoreOpen(false)}
            className="bottom-nav__overlay"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="bottom-nav__sheet"
              role="menu"
            >
              {moreItems.map(({ id, to, label }) => (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  onClick={() => { navigate(to); setMoreOpen(false); }}
                  className="bottom-nav__sheet-item"
                >
                  {label}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
