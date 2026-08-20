import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join, extname } from 'path';

const HTML = '/Users/aaditya/Desktop/DASHBOARD PROJECT/frontend/prototypes/personal-os/v7-android-life-os.html';
const OUT = '/Users/aaditya/Desktop/DASHBOARD PROJECT/frontend/prototypes/personal-os/v7-build/gates/artifacts';
mkdirSync(OUT, { recursive: true });

const MIME = { '.html': 'text/html; charset=utf-8' };
const rootDir = dirname(HTML);
const server = createServer((req, res) => {
  const u = (req.url || '/').split('?')[0];
  const path = u === '/' ? HTML : join(rootDir, decodeURIComponent(u));
  if (!existsSync(path)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[extname(path)] || 'application/octet-stream' });
  res.end(readFileSync(path));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGE: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('CON: ' + m.text());
});

await page.addInitScript(() => {
  localStorage.setItem(
    'aiimin-v7-demo',
    JSON.stringify({ onboardComplete: true, name: 'Aaditya', theme: 'dark', firstHint: false }),
  );
});

await page.goto(`http://127.0.0.1:${port}/#today`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#view-today.active', { timeout: 8000 });
await page.waitForTimeout(400);

async function audit(tab) {
  if (tab !== 'today') {
    await page.locator(`#bnav [data-tab="${tab}"]`).click();
    await page.waitForSelector(`#view-${tab}.active`);
    await page.waitForTimeout(250);
  }
  const data = await page.evaluate((tabName) => {
    const view = document.getElementById('view-' + tabName);
    const topbar = view.querySelector('.topbar');
    const scroll = view.querySelector('.scroll');
    const tb = topbar?.getBoundingClientRect();
    const sc = scroll?.getBoundingClientRect();
    const kids = [...(scroll?.children || [])].slice(0, 8).map((el) => ({
      tag: el.tagName,
      cls: (el.className || '').toString().slice(0, 60),
      hidden: el.hidden,
      h: Math.round(el.getBoundingClientRect().height),
      y: Math.round(el.getBoundingClientRect().top),
    }));
    const problems = [];
    if (!topbar) problems.push('no topbar');
    if (tb && tb.height < 20) problems.push('topbar tiny');
    if (tb && sc && Math.abs(tb.bottom - sc.top) > 40) problems.push(`gap topbar→scroll ${Math.round(sc.top - tb.bottom)}`);
    // overlapping fixed elements
    const now = view.querySelector('.tb-now');
    if (now) {
      const nr = now.getBoundingClientRect();
      const first = view.querySelector('.tb-block');
      if (first) {
        const fr = first.getBoundingClientRect();
        if (nr.bottom > fr.top + 4) problems.push('NOW overlaps first block');
      }
    }
    // week bars zero height
    const bars = [...view.querySelectorAll('.week-bar i')].map((i) => Math.round(i.getBoundingClientRect().height));
    if (bars.length && bars.every((h) => h < 2)) problems.push('week bars zero height: ' + bars.join(','));
    // money tabs
    if (tabName === 'money') {
      const tabs = view.querySelector('#money-tabs');
      const tr = tabs?.getBoundingClientRect();
      if (!tabs) problems.push('money-tabs missing');
      else if (tr.height < 10) problems.push('money-tabs collapsed');
      const h1 = topbar?.querySelector('h1')?.textContent;
      if (h1 !== 'Money') problems.push('money title=' + h1);
    }
    return {
      title: topbar?.querySelector('h1')?.textContent || topbar?.innerText?.slice(0, 40),
      topbar: tb && `${Math.round(tb.width)}x${Math.round(tb.height)} y=${Math.round(tb.top)}`,
      scroll: sc && `${Math.round(sc.width)}x${Math.round(sc.height)} y=${Math.round(sc.top)}`,
      kids,
      problems,
      bars,
    };
  }, tab);
  await page.locator('.device').first().screenshot({ path: join(OUT, `debug-${tab}.png`) });
  return data;
}

const report = {};
for (const tab of ['today', 'capture', 'money', 'practice', 'more']) {
  report[tab] = await audit(tab);
}

writeFileSync(join(OUT, 'debug-audit.json'), JSON.stringify({ errors, report }, null, 2));
console.log(JSON.stringify({ errors, report }, null, 2));
await browser.close();
server.close();
