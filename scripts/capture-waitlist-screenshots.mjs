#!/usr/bin/env node
/**
 * Capture real dashboard screenshots for waitlist landing previews.
 * Usage: node scripts/capture-waitlist-screenshots.mjs
 * Requires: frontend on :3000, API on :3001
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../frontend/public/images');
const BASE = process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';
const MOCK_USER = {
  user_id: '88888888-8888-4888-8888-888888888888',
  id: '88888888-8888-4888-8888-888888888888',
  email: 'aadityaupadhyay10@gmail.com',
  full_name: 'Aaditya Upadhyay',
  username: 'AADITYA',
  role: 'dev',
  display_name: 'Aaditya Upadhyay',
};

const today = new Date().toISOString().split('T')[0];

function seedLocalStorage() {
  const habits = [
    { id: 'h1', name: 'Morning workout', emoji: '💪', color: '#22C55E' },
    { id: 'h2', name: 'Deep work block', emoji: '🎯', color: '#3B82F6' },
    { id: 'h3', name: 'Read 30 pages', emoji: '📚', color: '#8B5CF6' },
  ];
  const habitLogs = {};
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    habitLogs[key] = { h1: true, h2: i < 10, h3: i < 12 };
  }
  const sleepLogs = {};
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    sleepLogs[key] = { duration: 6.8 + (i % 3) * 0.4, bedtime: '23:15', quality: 4 };
  }
  return {
    aiimin_session_fallback: 'mock-test-token',
    'aiimin-waitlist-theme': 'nordic',
    [`aiimin_cmd_priorities_${today}`]: JSON.stringify([
      { id: 1, text: 'Complete LeetCode daily', done: true },
      { id: 2, text: 'Gym session 45min', done: true },
      { id: 3, text: 'Review weekly goals', done: false },
    ]),
    aiimin_habits_v3: JSON.stringify(habits),
    aiimin_habits_logs_v3: JSON.stringify(habitLogs),
    aiimin_sleep_logs: JSON.stringify(sleepLogs),
    aiimin_execution_target: '2026-07-26',
    aiimin_guest_tour_done: 'true',
    aiimin_product_tour_done: 'true',
  };
}

async function setupPage(context) {
  const page = await context.newPage();

  await page.route('**/api/account/user-profile**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) }),
  );
  await page.route('**/api/auth/access**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ canAccessApp: true, role: 'dev', tier: 'elite' }),
    }),
  );
  await page.route('**/api/account/profile**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) }),
  );

  await page.addInitScript((storage) => {
    Object.entries(storage).forEach(([k, v]) => localStorage.setItem(k, v));
  }, seedLocalStorage());

  await page.addStyleTag({
    content: `
      .guest-banner-wrapper,
      [class*="feedback"],
      [class*="Feedback"],
      .product-tour-overlay,
      [data-testid="guest-tour"] { display: none !important; }
    `,
  }).catch(() => {});

  return page;
}

async function waitForDashboard(page) {
  await page.goto(`${BASE}/overview`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForSelector('text=Day Control', { timeout: 60000 });
  await page.waitForTimeout(3000);
}

async function screenshotElement(page, selector, outPath, fallbackClip) {
  const el = page.locator(selector).first();
  if (await el.count()) {
    await el.screenshot({ path: outPath, type: 'png' });
    return true;
  }
  if (fallbackClip) {
    await page.screenshot({ path: outPath, type: 'png', clip: fallbackClip });
    return true;
  }
  return false;
}

async function tryConvertToWebp(pngPath) {
  const webpPath = pngPath.replace(/\.png$/, '.webp');
  try {
    const sharp = (await import('sharp')).default;
    await sharp(pngPath).webp({ quality: 88 }).toFile(webpPath);
    return webpPath;
  } catch {
    return pngPath;
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
  });

  const page = await setupPage(context);
  const results = [];

  try {
    await waitForDashboard(page);

    // Hide nav clutter for cleaner marketing crops
    await page.evaluate(() => {
      document.querySelectorAll('nav, aside, [class*="sidebar"], [class*="Sidebar"]').forEach((n) => {
        if (n) n.style.visibility = 'hidden';
      });
    });

    const pngLifescore = path.join(OUT_DIR, 'preview-lifescore.png');
    const lifeLocator = page.locator('text=Life Score').first();
    if (await lifeLocator.count()) {
      const box = await lifeLocator.boundingBox({ timeout: 10000 }).catch(() => null);
      if (box) {
        await page.screenshot({
          path: pngLifescore,
          clip: {
            x: Math.max(0, box.x - 40),
            y: Math.max(0, box.y - 60),
            width: Math.min(1120, 520),
            height: Math.min(700, 380),
          },
        });
      }
    }
    if (!existsSync(pngLifescore)) {
      await page.screenshot({ path: pngLifescore, clip: { x: 0, y: 80, width: 1120, height: 700 } });
    }
    results.push({ file: await tryConvertToWebp(pngLifescore), label: 'lifescore' });

    // Daily board — left column overview
    await page.evaluate(() => {
      document.querySelectorAll('nav, aside, [class*="sidebar"], [class*="Sidebar"]').forEach((n) => {
        if (n) n.style.visibility = 'hidden';
      });
    });
    const pngDaily = path.join(OUT_DIR, 'preview-daily-board.png');
    await page.screenshot({
      path: pngDaily,
      clip: { x: 0, y: 60, width: 1120, height: 700 },
    });
    results.push({ file: await tryConvertToWebp(pngDaily), label: 'daily-board' });

    // Patterns — insights tab
    await page.goto(`${BASE}/insights`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(1500);
    const insightsTab = page.getByRole('button', { name: /Insights/i });
    if (await insightsTab.count()) await insightsTab.click();
    await page.waitForTimeout(2000);

    await page.evaluate(() => {
      document.querySelectorAll('nav, aside, [class*="sidebar"], [class*="Sidebar"]').forEach((n) => {
        if (n) n.style.visibility = 'hidden';
      });
    });
    const pngPatterns = path.join(OUT_DIR, 'preview-patterns.png');
    await page.screenshot({
      path: pngPatterns,
      clip: { x: 0, y: 60, width: 1120, height: 700 },
    });
    results.push({ file: await tryConvertToWebp(pngPatterns), label: 'patterns' });

    // Mobile daily board crop
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/overview`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(2000);
    const pngMobile = path.join(OUT_DIR, 'preview-daily-board-mobile.png');
    await page.screenshot({
      path: pngMobile,
      clip: { x: 0, y: 0, width: 335, height: 420 },
    });
    results.push({ file: await tryConvertToWebp(pngMobile), label: 'mobile' });

    // OG image from daily board crop
    const ogPng = path.join(__dirname, '../frontend/public/og-image-v2-capture.png');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/overview`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: ogPng,
      clip: { x: 80, y: 80, width: 1200, height: 630 },
    });
    const ogWebp = ogPng.replace('.png', '.webp');
    try {
      const sharp = (await import('sharp')).default;
      await sharp(ogPng).png().toFile(path.join(__dirname, '../frontend/public/og-image-v2.png'));
    } catch {
      // keep png capture only
    }

    const manifest = [];
    for (const r of results) {
      let dims = { w: 0, h: 0 };
      try {
        const sharp = (await import('sharp')).default;
        const meta = await sharp(r.file).metadata();
        dims = { w: meta.width, h: meta.height };
      } catch { /* ignore */ }
      manifest.push({ ...r, ...dims, exists: existsSync(r.file) });
    }

    await writeFile(path.join(OUT_DIR, 'screenshot-manifest.json'), JSON.stringify(manifest, null, 2));
    console.log(JSON.stringify(manifest, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
