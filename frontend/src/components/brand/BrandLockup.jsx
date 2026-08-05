import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext';
import { isLightTheme } from '../../constants/themes';
import { ArchBracketMark, pickMarkColors } from './archBracketMark';
import Wordmark from './Wordmark';

const NAV_ICON_SIZE = 34;
const NAV_WORDMARK_SIZE = 26;

/**
 * Navbar brand lockup — LOCKED split targets (do not unify again without explicit user ask):
 * - Logo mark  → `/brand`  (Human Momentum brand page)
 * - AIIMIN text → `/overview` (Today)
 */
export default function BrandLockup({
  markTo = '/brand',
  wordmarkTo = '/overview',
  iconSize = NAV_ICON_SIZE,
  wordmarkSize = NAV_WORDMARK_SIZE,
  style = {},
  staticPreview = false,
  isLight: isLightOverride,
}) {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const isLight = isLightOverride ?? isLightTheme(theme);

  const shellClass = [
    'brand-lockup',
    isLight ? 'brand-lockup--light' : 'brand-lockup--dark',
    staticPreview ? 'brand-lockup--static' : '',
  ].filter(Boolean).join(' ');

  const markColors = useMemo(
    () => pickMarkColors(isLight, { density: 'nav' }),
    [isLight],
  );

  const go = (e, path) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className={shellClass} style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }} data-theme={theme}>
      {staticPreview ? (
        <>
          <ArchBracketMark
            size={iconSize}
            withChip
            density="nav"
            colors={markColors}
            className="brand-lockup__mark"
          />
          <Wordmark
            size={wordmarkSize}
            weight={700}
            className="brand-lockup__wordmark"
          />
        </>
      ) : (
        <>
          <Link
            to={markTo}
            className="brand-lockup__mark-link"
            aria-label="AIIMIN brand"
            onClick={(e) => go(e, markTo)}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <ArchBracketMark
              size={iconSize}
              withChip
              density="nav"
              colors={markColors}
              className="brand-lockup__mark"
            />
          </Link>
          <Link
            to={wordmarkTo}
            className="brand-lockup__wordmark-link"
            aria-label="AIIMIN Today"
            onClick={(e) => go(e, wordmarkTo)}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Wordmark
              size={wordmarkSize}
              weight={700}
              className="brand-lockup__wordmark"
            />
          </Link>
        </>
      )}
    </div>
  );
}
