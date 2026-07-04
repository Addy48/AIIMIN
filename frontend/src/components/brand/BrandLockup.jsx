import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext';
import { isLightTheme } from '../../constants/themes';
import { ArchBracketMark, EDITOR_PICK } from './archBracketMark';
import Wordmark from './Wordmark';

const NAV_ICON_SIZE = 34;
const NAV_WORDMARK_SIZE = 26;

/** Soft paper chip on light nav - no sticker effect */
const NAV_CHIP_LIGHT = {
  chipFill: '#FAFAF8',
  chipStroke: '#D1D5DB',
  arch: '#D1D5DB',
  outer: '#14171A',
  inner: '#6B7280',
  dot: '#E85A24',
  archOpacity: 0.9,
  innerOpacity: 0.85,
};

const NAV_CHIP_DARK = { ...EDITOR_PICK };

/**
 * Navbar brand lockup — unified click to /overview
 */
export default function BrandLockup({
  to = '/overview',
  iconSize = NAV_ICON_SIZE,
  wordmarkSize = NAV_WORDMARK_SIZE,
  style = {},
  staticPreview = false,
}) {
  const { theme } = useThemeContext();
  const isLight = useMemo(() => isLightTheme(theme), [theme]);

  const shellClass = [
    'brand-lockup',
    isLight ? 'brand-lockup--light' : 'brand-lockup--dark',
    staticPreview ? 'brand-lockup--static' : '',
  ].filter(Boolean).join(' ');

  const content = (
    <>
      <ArchBracketMark
        size={iconSize}
        withChip
        density="nav"
        colors={isLight ? NAV_CHIP_LIGHT : NAV_CHIP_DARK}
        className="brand-lockup__mark"
      />
      <Wordmark
        size={wordmarkSize}
        weight={700}
        className="brand-lockup__wordmark"
      />
    </>
  );

  return (
    <div className={shellClass} style={style} data-theme={theme}>
      {staticPreview ? (
        <span className="brand-lockup__unified">{content}</span>
      ) : (
        <Link to={to} className="brand-lockup__unified" aria-label="AIIMIN home">
          {content}
        </Link>
      )}
    </div>
  );
}
