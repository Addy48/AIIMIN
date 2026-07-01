#!/usr/bin/env node
/**
 * Export AIIMIN brand assets.
 * Light Editor Pick → website favicons / PWA.
 * Dark OAuth mark → google-oauth-logo.png only.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const buildDir = join(root, 'build');

const LIGHT = {
  chipFill: '#FFFFFF',
  chipStroke: '#B8C0CC',
  arch: '#D1D5DB',
  outer: '#14171A',
  inner: '#6B7280',
  dot: '#FF6B35',
  archOpacity: 0.9,
  innerOpacity: 0.85,
};

const OAUTH = {
  chipFill: '#14171A',
  chipStroke: '#FF6B35',
  arch: '#6B7280',
  outer: '#F5F1E8',
  inner: '#D1D5DB',
  dot: '#FF6B35',
  archOpacity: 0.65,
  innerOpacity: 0.75,
};

const PATHS = {
  arch: 'M80 384 C80 192 208 112 256 112 C304 112 432 192 432 384',
  outer: 'M144 384 L256 176 L368 384',
  inner: 'M192 368 L256 272 L320 368',
};

function buildLightSvg() {
  const c = LIGHT;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="${c.chipFill}" stroke="${c.chipStroke}" stroke-width="4"/>
  <path d="${PATHS.arch}" stroke="${c.arch}" stroke-width="24" stroke-linecap="round" opacity="${c.archOpacity}"/>
  <path d="${PATHS.outer}" stroke="${c.outer}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${PATHS.inner}" stroke="${c.inner}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity="${c.innerOpacity}"/>
  <circle cx="256" cy="240" r="28" fill="${c.dot}"/>
</svg>`;
}

function buildOauthSvg() {
  const c = OAUTH;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="${c.chipFill}"/>
  <rect width="512" height="512" rx="112" fill="none" stroke="${c.chipStroke}" stroke-width="10"/>
  <g transform="translate(0,-28)">
    <path d="${PATHS.arch}" stroke="${c.arch}" stroke-width="25" stroke-linecap="round" opacity="${c.archOpacity}"/>
    <path d="${PATHS.outer}" stroke="${c.outer}" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${PATHS.inner}" stroke="${c.inner}" stroke-width="21" stroke-linecap="round" stroke-linejoin="round" opacity="${c.innerOpacity}"/>
    <circle cx="256" cy="240" r="29" fill="${c.dot}"/>
  </g>
  <text x="256" y="448" text-anchor="middle" fill="#F5F1E8" font-family="'Bodoni Moda', 'Didot', Georgia, serif" font-size="54" font-weight="700" letter-spacing="6">AIIMIN</text>
</svg>`;
}

const lightSvg = buildLightSvg();
const oauthSvg = buildOauthSvg();

for (const target of [
  join(publicDir, 'logo-symbol.svg'),
  join(publicDir, 'favicon-light.svg'),
  join(publicDir, 'favicon-dark.svg'),
  join(publicDir, 'AIIMIN_logo.svg'),
]) {
  writeFileSync(target, lightSvg);
  console.log('wrote', target);
}

writeFileSync(join(publicDir, 'google-oauth-logo.svg'), oauthSvg);
console.log('wrote', join(publicDir, 'google-oauth-logo.svg'));

async function exportPngs() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.warn('sharp missing');
    return;
  }

  mkdirSync(buildDir, { recursive: true });

  const exports = [
    { name: 'favicon-32.png', svg: lightSvg, size: 32, bg: { r: 255, g: 255, b: 255, alpha: 0 } },
    { name: 'logo192.png', svg: lightSvg, size: 192, bg: { r: 255, g: 255, b: 255, alpha: 0 } },
    { name: 'logo512.png', svg: lightSvg, size: 512, bg: { r: 255, g: 255, b: 255, alpha: 0 } },
    { name: 'google-oauth-logo.png', svg: oauthSvg, size: 120, bg: { r: 20, g: 23, b: 26, alpha: 1 } },
    { name: 'AIIMIN_logo_120x120.png', svg: oauthSvg, size: 120, bg: { r: 20, g: 23, b: 26, alpha: 1 } },
  ];

  for (const { name, svg, size, bg } of exports) {
    const png = await sharp(Buffer.from(svg), { density: 384 })
      .resize(size, size, { fit: 'contain', background: bg })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();

    writeFileSync(join(publicDir, name), png);
    console.log('wrote', join(publicDir, name));

    if (name === 'AIIMIN_logo_120x120.png') {
      writeFileSync(join(buildDir, name), png);
    }
  }
}

exportPngs().catch((err) => {
  console.error(err);
  process.exit(1);
});
