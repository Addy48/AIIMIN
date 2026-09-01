import React from 'react';
import { Link } from 'react-router-dom';
import Wordmark from '../../brand/Wordmark';
import { ArchBracketMark, pickMarkColors } from '../../brand/archBracketMark';
import useTheme from '../../../hooks/useTheme';
import { isLightTheme } from '../../../constants/themes';

/** Reads active theme from ThemeContext — never mount a second waitlist theme state. */
export default function HeroBrandLockup({ markSize = 32, wordmarkSize = 28 }) {
  const { theme } = useTheme();
  const isLight = isLightTheme(theme);
  const colors = pickMarkColors(isLight);

  return (
    <Link to="/brand" className="hero-brand-lockup" aria-label="Explore AIIMIN brand guidelines">
      <ArchBracketMark size={markSize} withChip colors={colors} className="hero-brand-mark" />
      <Wordmark size={wordmarkSize} color="var(--color-text-1)" />
    </Link>
  );
}
