/** Monochromatic geometric SVG illustrations for empty states (80×80) */

export function HabitsIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <rect x="8" y="20" width="64" height="12" rx="6" stroke="var(--color-border-lit)" strokeWidth="2" />
      <rect x="8" y="38" width="48" height="12" rx="6" stroke="var(--color-accent)" strokeWidth="2" opacity="0.6" />
      <rect x="8" y="56" width="56" height="12" rx="6" stroke="var(--color-border-lit)" strokeWidth="2" />
      <circle cx="64" cy="44" r="8" stroke="var(--color-accent)" strokeWidth="2" />
      <path d="M60 44 L63 47 L68 40" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GoalsIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <circle cx="40" cy="40" r="28" stroke="var(--color-border-lit)" strokeWidth="2" />
      <circle cx="40" cy="40" r="18" stroke="var(--color-accent)" strokeWidth="2" opacity="0.5" />
      <circle cx="40" cy="40" r="6" fill="var(--color-accent)" opacity="0.8" />
    </svg>
  );
}

export function FinanceIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <rect x="12" y="24" width="56" height="36" rx="8" stroke="var(--color-border-lit)" strokeWidth="2" />
      <line x1="12" y1="36" x2="68" y2="36" stroke="var(--color-border-lit)" strokeWidth="2" />
      <rect x="20" y="44" width="20" height="8" rx="2" fill="var(--color-accent)" opacity="0.4" />
      <rect x="44" y="44" width="16" height="8" rx="2" fill="var(--color-border-lit)" opacity="0.5" />
    </svg>
  );
}

export function SportsIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <polygon points="40,12 68,68 12,68" stroke="var(--color-border-lit)" strokeWidth="2" fill="none" />
      <circle cx="40" cy="48" r="10" stroke="var(--color-accent)" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}
