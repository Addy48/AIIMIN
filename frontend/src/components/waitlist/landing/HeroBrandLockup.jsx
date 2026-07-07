import React from 'react';
import { Link } from 'react-router-dom';
import Wordmark from '../../brand/Wordmark';
import { ArchBracketMark, EDITOR_PICK } from '../../brand/archBracketMark';

export default function HeroBrandLockup({ markSize = 32, wordmarkSize = 28 }) {
  return (
    <Link to="/brand" className="hero-brand-lockup" aria-label="Explore AIIMIN brand guidelines">
      <ArchBracketMark size={markSize} withChip colors={EDITOR_PICK} className="hero-brand-mark" />
      <Wordmark size={wordmarkSize} color="var(--color-text-1)" />
    </Link>
  );
}
