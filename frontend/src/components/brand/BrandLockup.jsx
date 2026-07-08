import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext';
import { isLightTheme } from '../../constants/themes';
import { ArchBracketMark, pickMarkColors } from './archBracketMark';
import Wordmark from './Wordmark';

const NAV_ICON_SIZE = 34;
const NAV_WORDMARK_SIZE = 26;

/**
 * Navbar brand lockup — unified click to /overview
 */
export default function BrandLockup({
  to = '/overview',
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

  const content = (
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
  );

  return (
    <div className={shellClass} style={{ display: 'flex', alignItems: 'center', ...style }} data-theme={theme}>
      {staticPreview ? (
        <span className="brand-lockup__unified" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{content}</span>
      ) : (
        <Link
          to={to}
          className="brand-lockup__unified"
          aria-label="AIIMIN home"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            navigate(to);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
        >
          {content}
        </Link>
      )}
    </div>
  );
}
