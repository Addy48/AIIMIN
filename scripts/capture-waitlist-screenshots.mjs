import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'frontend/public/assets/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching Chrome for high-res UI capture...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--force-device-scale-factor=2',
      '--window-size=2880,4000'
    ]
  });

  const items = [
    { selector: '#hero-capture', filename: 'hero-command-center.png' },
    { selector: '#surface-today-capture', filename: 'surface-today.png' },
    { selector: '#surface-score-capture', filename: 'surface-score.png' },
    { selector: '#surface-money-capture', filename: 'surface-money.png' },
  ];

  for (const item of items) {
    console.log(`Navigating to capture ${item.filename}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 4000, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/dev/waitlist-studio', { waitUntil: 'networkidle2' });

    try {
      const elem = await page.waitForSelector(item.selector, { visible: true, timeout: 15000 });
      if (elem) {
        await new Promise(r => setTimeout(r, 800));
        const outPath = path.join(SCREENSHOT_DIR, item.filename);
        await elem.screenshot({
          path: outPath,
          type: 'png'
        });
        console.log(`✓ Successfully captured ${item.filename}`);
        if (item.filename === 'hero-command-center.png') {
          const heroPublicPath = path.resolve(process.cwd(), 'frontend/public/images/aiimin_dashboard_hero.png');
          fs.copyFileSync(outPath, heroPublicPath);
          console.log(`✓ Copied hero screenshot to ${heroPublicPath}`);
        }
      }
    } catch (e) {
      console.error(`✗ Element not found or timed out: ${item.selector}`, e.message);
    }
    await page.close();
  }

  await browser.close();
  console.log('ALL_SCREENSHOTS_CAPTURED_SUCCESSFULLY');
}

run().catch(err => {
  console.error('CAPTURE_FAILED:', err);
  process.exit(1);
});
