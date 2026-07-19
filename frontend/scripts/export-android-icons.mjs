#!/usr/bin/env node
/**
 * Export AIIMIN brand mark into Android launcher + splash densities.
 * Dark chip on #1A1A1A (launcher). Light chip for values-night splash optional.
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const resDir = join(root, 'android', 'app', 'src', 'main', 'res');

const PATHS = {
  arch: 'M80 384 C80 192 208 112 256 112 C304 112 432 192 432 384',
  outer: 'M144 384 L256 176 L368 384',
  inner: 'M192 368 L256 272 L320 368',
};

const DARK = {
  chipFill: '#14171A',
  chipStroke: '#2A2A2E',
  arch: '#6B7280',
  outer: '#EDE4D3',
  inner: '#B9AF9E',
  dot: '#FF6B35',
  archOpacity: 0.65,
  innerOpacity: 0.75,
};

function buildMarkSvg(c, { size = 512, pad = 0, bg = null } = {}) {
  const bgRect = bg
    ? `<rect width="${size}" height="${size}" fill="${bg}"/>`
    : '';
  const scale = (size - pad * 2) / 512;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${bgRect}
  <g transform="translate(${pad},${pad}) scale(${scale})">
    <rect width="512" height="512" rx="112" fill="${c.chipFill}" stroke="${c.chipStroke}" stroke-width="4"/>
    <path d="${PATHS.arch}" stroke="${c.arch}" stroke-width="24" stroke-linecap="round" opacity="${c.archOpacity}"/>
    <path d="${PATHS.outer}" stroke="${c.outer}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${PATHS.inner}" stroke="${c.inner}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity="${c.innerOpacity}"/>
    <circle cx="256" cy="240" r="28" fill="${c.dot}"/>
  </g>
</svg>`;
}

const DENSITIES = [
  { folder: 'mipmap-mdpi', launcher: 48, foreground: 108 },
  { folder: 'mipmap-hdpi', launcher: 72, foreground: 162 },
  { folder: 'mipmap-xhdpi', launcher: 96, foreground: 216 },
  { folder: 'mipmap-xxhdpi', launcher: 144, foreground: 324 },
  { folder: 'mipmap-xxxhdpi', launcher: 192, foreground: 432 },
];

const SPLASH = [
  { folder: 'drawable', size: 480 },
  { folder: 'drawable-port-mdpi', size: 320 },
  { folder: 'drawable-port-hdpi', size: 480 },
  { folder: 'drawable-port-xhdpi', size: 720 },
  { folder: 'drawable-port-xxhdpi', size: 1080 },
  { folder: 'drawable-port-xxxhdpi', size: 1440 },
  { folder: 'drawable-land-mdpi', size: 320 },
  { folder: 'drawable-land-hdpi', size: 480 },
  { folder: 'drawable-land-xhdpi', size: 720 },
  { folder: 'drawable-land-xxhdpi', size: 1080 },
  { folder: 'drawable-land-xxxhdpi', size: 1440 },
];

async function pngFromSvg(svg, size) {
  return sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 26, g: 26, b: 26, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function splashPng(size) {
  const markSize = Math.round(size * 0.42);
  const markSvg = buildMarkSvg(DARK, { size: markSize });
  const mark = await sharp(Buffer.from(markSvg), { density: 384 })
    .resize(markSize, markSize)
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 26, g: 26, b: 26, alpha: 1 },
    },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  // Adaptive foreground: mark inset in transparent 108dp canvas (safe zone)
  for (const d of DENSITIES) {
    const dir = join(resDir, d.folder);
    mkdirSync(dir, { recursive: true });

    const launcherSvg = buildMarkSvg(DARK, { size: d.launcher, bg: '#1A1A1A' });
    writeFileSync(join(dir, 'ic_launcher.png'), await pngFromSvg(launcherSvg, d.launcher));
    writeFileSync(join(dir, 'ic_launcher_round.png'), await pngFromSvg(launcherSvg, d.launcher));

    // Foreground for adaptive: transparent, mark ~66% of canvas
    const fgPad = Math.round(512 * 0.17);
    const fgSvg = buildMarkSvg(DARK, { size: 512, pad: fgPad });
    const fgPng = await sharp(Buffer.from(fgSvg), { density: 384 })
      .resize(d.foreground, d.foreground)
      .png({ compressionLevel: 9 })
      .toBuffer();
    writeFileSync(join(dir, 'ic_launcher_foreground.png'), fgPng);
    console.log('wrote', d.folder);
  }

  for (const s of SPLASH) {
    const dir = join(resDir, s.folder);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'splash.png'), await splashPng(s.size));
    console.log('wrote splash', s.folder);
  }

  console.log('Android icons + splash exported');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
