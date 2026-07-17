import React from 'react';
import { Link } from 'react-router-dom';
import Wordmark from '../../brand/Wordmark';
import { ArchBracketMark, pickMarkColors } from '../../brand/archBracketMark';
import useWaitlistSurfaceTheme from '../../../hooks/useWaitlistSurfaceTheme';

export default function HeroBrandLockup({ markSize = 32, wordmarkSize = 28 }) {
  const { isLight } = useWaitlistSurfaceTheme();
  const colors = pickMarkColors(isLight, { variant: 'light' });

  return (
    <Link to="/brand" className="hero-brand-lockup" aria-label="Explore AIIMIN brand guidelines">
      <ArchBracketMark size={markSize} withChip colors={colors} className="hero-brand-mark" />
      <Wordmark size={wordmarkSize} color="var(--color-text-1)" />
    </Link>
  );
}
