import React from 'react';

/**
 * AIIMIN Arch Bracket palettes.
 * EDITOR_PICK — light logo for website, navbar, favicons.
 * BRAND_IDENTITY — dark + ember ring for Google OAuth assets only.
 */

/** Website / app — Editor Pick (light) */
export const EDITOR_PICK = {
  chipFill: '#FFFFFF',
  chipStroke: '#B8C0CC',
  arch: '#D1D5DB',
  outer: '#14171A',
  inner: '#6B7280',
  dot: '#FF6B35',
  archOpacity: 0.9,
  innerOpacity: 0.85,
};

/** Google OAuth verification only */
export const BRAND_IDENTITY = {
  chipFill: '#14171A',
  chipStroke: '#FF6B35',
  arch: '#6B7280',
  outer: '#F5F1E8',
  inner: '#D1D5DB',
  dot: '#FF6B35',
  archOpacity: 0.65,
  innerOpacity: 0.75,
  emberRing: true,
};

export const VIEWBOX = 512;
export const CHIP_RX = 112;

export const ARCH_BRACKET_PATHS = {
  arch: 'M80 384 C80 192 208 112 256 112 C304 112 432 192 432 384',
  outer: 'M144 384 L256 176 L368 384',
  inner: 'M192 368 L256 272 L320 368',
  dot: { cx: 256, cy: 240, r: 28 },
};

export const ARCH_BRACKET_STROKES = {
  arch: 24,
  outer: 24,
  inner: 18,
  emberRing: true,
};

/** Dark theme — app / waitlist / email (Route Y) */
export const DARK_PICK = {
  chipFill: '#14171A',
  chipStroke: '#2A2A2E',
  arch: '#6B7280',
  outer: '#EDE4D3',
  inner: '#B9AF9E',
  dot: '#FF6B35',
  archOpacity: 0.65,
  innerOpacity: 0.75,
};

/** Navbar light — soft paper chip */
export const NAV_CHIP_LIGHT = {
  chipFill: '#FAFAF8',
  chipStroke: '#D1D5DB',
  arch: '#D1D5DB',
  outer: '#14171A',
  inner: '#6B7280',
  dot: '#E85A24',
  archOpacity: 0.9,
  innerOpacity: 0.85,
};

/** Pick mark palette for light/dark surfaces */
export function pickMarkColors(isLight, { density = 'default' } = {}) {
  if (!isLight) return DARK_PICK;
  return density === 'nav' ? NAV_CHIP_LIGHT : EDITOR_PICK;
}

const NAV_VIEWBOX = '48 48 416 416';
const NAV_STROKE_SCALE = 1.18;

function markSvgElements(colors, strokeScale = 1) {
  const emberRing = colors.emberRing;
  const chip = emberRing
    ? `<rect width="${VIEWBOX}" height="${VIEWBOX}" rx="${CHIP_RX}" fill="${colors.chipFill}"/>
       <rect width="${VIEWBOX}" height="${VIEWBOX}" rx="${CHIP_RX}" fill="none" stroke="${colors.chipStroke}" stroke-width="10"/>`
    : `<rect width="${VIEWBOX}" height="${VIEWBOX}" rx="${CHIP_RX}" fill="${colors.chipFill}" stroke="${colors.chipStroke}" stroke-width="4"/>`;

  return {
    chip,
    arch: `<path d="${ARCH_BRACKET_PATHS.arch}" stroke="${colors.arch}" stroke-width="${ARCH_BRACKET_STROKES.arch * strokeScale}" stroke-linecap="round" opacity="${colors.archOpacity}"/>`,
    outer: `<path d="${ARCH_BRACKET_PATHS.outer}" stroke="${colors.outer}" stroke-width="${ARCH_BRACKET_STROKES.outer * strokeScale}" stroke-linecap="round" stroke-linejoin="round"/>`,
    inner: `<path d="${ARCH_BRACKET_PATHS.inner}" stroke="${colors.inner}" stroke-width="${ARCH_BRACKET_STROKES.inner * strokeScale}" stroke-linecap="round" stroke-linejoin="round" opacity="${colors.innerOpacity}"/>`,
    dot: `<circle cx="${ARCH_BRACKET_PATHS.dot.cx}" cy="${ARCH_BRACKET_PATHS.dot.cy}" r="${ARCH_BRACKET_PATHS.dot.r * (strokeScale > 1 ? 1.06 : 1)}" fill="${colors.dot}"/>`,
  };
}

export function buildArchBracketSvg({
  colors = EDITOR_PICK,
  withChip = true,
  width = VIEWBOX,
  height = VIEWBOX,
} = {}) {
  const { chip, arch, outer, inner, dot } = markSvgElements(colors);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${withChip ? chip : ''}
  ${arch}${outer}${inner}${dot}
</svg>`;
}

export function buildOauthBrandSvg({ width = VIEWBOX, height = VIEWBOX } = {}) {
  const { chip, arch, outer, inner, dot } = markSvgElements(BRAND_IDENTITY, 1.05);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${chip}
  <g transform="translate(0,-28)">${arch}${outer}${inner}${dot}</g>
  <text x="256" y="448" text-anchor="middle" fill="#F5F1E8" font-family="'Bodoni Moda', 'Didot', Georgia, serif" font-size="54" font-weight="700" letter-spacing="6">AIIMIN</text>
</svg>`;
}

function ChipBackground({ colors, isNav }) {
  if (colors.emberRing) {
    return (
      <>
        <rect width={VIEWBOX} height={VIEWBOX} rx={CHIP_RX} fill={colors.chipFill} />
        <rect
          width={VIEWBOX}
          height={VIEWBOX}
          rx={CHIP_RX}
          fill="none"
          stroke={colors.chipStroke}
          strokeWidth={isNav ? 9 : 10}
        />
      </>
    );
  }
  return (
    <rect
      width={VIEWBOX}
      height={VIEWBOX}
      rx={CHIP_RX}
      fill={colors.chipFill}
      stroke={colors.chipStroke}
      strokeWidth={isNav ? 5 : 4}
    />
  );
}

export function ArchBracketMark({
  size = 36,
  withChip = true,
  colors = EDITOR_PICK,
  density = 'default',
  style = {},
  className,
}) {
  const isNav = density === 'nav';
  const strokeScale = isNav ? NAV_STROKE_SCALE : 1;
  const viewBox = isNav ? NAV_VIEWBOX : `0 0 ${VIEWBOX} ${VIEWBOX}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      {withChip && <ChipBackground colors={colors} isNav={isNav} />}
      <path
        d={ARCH_BRACKET_PATHS.arch}
        stroke={colors.arch}
        strokeWidth={ARCH_BRACKET_STROKES.arch * strokeScale}
        strokeLinecap="round"
        opacity={colors.archOpacity}
      />
      <path
        d={ARCH_BRACKET_PATHS.outer}
        stroke={colors.outer}
        strokeWidth={ARCH_BRACKET_STROKES.outer * strokeScale}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={ARCH_BRACKET_PATHS.inner}
        stroke={colors.inner}
        strokeWidth={ARCH_BRACKET_STROKES.inner * strokeScale}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={colors.innerOpacity}
      />
      <circle
        cx={ARCH_BRACKET_PATHS.dot.cx}
        cy={ARCH_BRACKET_PATHS.dot.cy}
        r={ARCH_BRACKET_PATHS.dot.r * (isNav ? 1.06 : 1)}
        fill={colors.dot}
      />
    </svg>
  );
}
