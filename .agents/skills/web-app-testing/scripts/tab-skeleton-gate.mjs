#!/usr/bin/env node
/**
 * Tab skeleton uniqueness gate (Playwright).
 * Screenshots each bottom-nav tab, extracts structural signatures, pairwise diffs.
 * Exit 1 if similarity / contract rules fail.
 */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs';
import { dirname, join, extname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '../../../..');
const HTML = join(REPO, 'frontend/prototypes/personal-os/v8-android-life-os.html');
const OUT = join(REPO, 'frontend/prototypes/personal-os/v8-build/gates/artifacts');

const TABS = ['today', 'capture', 'money', 'practice', 'more'];
const REQUIRED = {
  today: {
    skeleton: 'TIME_BLOCK_TIMELINE',
    sig: ['header', 'ambient_depth', 'timeblock_timeline', 'trailer'],
  },
  capture: {
    skeleton: 'COMPOSER_STAGE',
    sig: ['header', 'composer_stage', 'mode_rail', 'destination_tiles'],
  },
  money: {
    skeleton: 'SPEND_CHART',
    sig: ['header', 'period_strip', 'spend_viz', 'alert_pills'],
  },
  practice: {
    skeleton: 'MASTERY_HEAT',
    sig: ['header', 'streak_banner', 'heat_calendar', 'skill_orbit'],
  },
  more: {
    skeleton: 'SEARCH_DIRECTORY',
    sig: ['header', 'search_field', 'soft_group_index'],
  },
};

const MAX_JACCARD = 0.42;
const BANNED_HSL_MAX = 1;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  const uni = A.size + B.size - inter;
  return uni === 0 ? 0 : inter / uni;
}

function bagKeys(counts) {
  const keys = [];
  for (const [k, v] of Object.entries(counts)) {
    for (let i = 0; i < Math.min(v, 8); i += 1) keys.push(k);
  }
  return keys;
}

function serveStatic(rootFile) {
  const rootDir = dirname(rootFile);
  const server = createServer((req, res) => {
    const url = (req.url || '/').split('?')[0];
    let path = url === '/' ? rootFile : join(rootDir, decodeURIComponent(url));
    if (!existsSync(path) || statSync(path).isDirectory()) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    const body = readFileSync(path);
    res.writeHead(200, { 'Content-Type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(body);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

async function extractSignature(page, tab) {
  return page.evaluate((tabName) => {
    const view = document.getElementById('view-' + tabName);
    if (!view) return { error: 'missing view' };
    const scroll = view.querySelector('.scroll') || view;
    const skeleton = view.getAttribute('data-skeleton') || '';
    const sig = [...view.querySelectorAll('[data-sig]')].map((el) => el.getAttribute('data-sig'));
    const q = (sel) =>
      [...scroll.querySelectorAll(sel)].filter((el) => {
        // ignore hidden money/family panels and [hidden]
        if (el.closest('[hidden]')) return false;
        let n = el;
        while (n && n !== scroll) {
          if (n.hidden) return false;
          n = n.parentElement;
        }
        return true;
      }).length;
    const counts = {
      c_row: q('.c-row'),
      habit: q('.habit'),
      progress: q('.progress'),
      tb_block: q('.tb-block'),
      week_bar: q('.week-bar'),
      donut: q('.donut'),
      heat: q('.heat'),
      composer: q('.composer-stage'),
      mode_pill: q('.mode-pill'),
      c_tile: q('.c-tile'),
      dir_cell: q('.dir-cell'),
      alert_pill: q('.alert-pill'),
      orbit_chip: q('.orbit-chip'),
      streak: q('.streak-banner'),
      search: q('[data-sig="search_field"]'),
      list_shell: q('.habit-list'),
    };
    const hasHeader = sig[0] === 'header' || !!view.querySelector('.topbar');
    const hasStat = !!view.querySelector('[data-sig="stat_block"], .money-io, .c-panel-title');
    const hasList = counts.c_row >= 3 || counts.habit >= 3 || counts.list_shell >= 1;
    // Banned HSL: classic header + numeric/stat hero + row list without unique viz
    const hasUniqueViz =
      counts.tb_block >= 3 ||
      counts.week_bar >= 4 ||
      counts.donut >= 1 ||
      counts.heat >= 1 ||
      counts.composer >= 1 ||
      counts.dir_cell >= 4;
    const bannedHsl = hasHeader && hasStat && hasList && !hasUniqueViz;
    return {
      tab: tabName,
      skeleton,
      sig,
      sigJoined: sig.join(' > '),
      counts,
      bannedHsl,
      active: view.classList.contains('active'),
    };
  }, tab);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  if (!existsSync(HTML)) {
    console.error('FAIL: missing HTML', HTML);
    process.exit(1);
  }

  const { server, origin } = await serveStatic(HTML);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem(
      'aiimin-v8-demo',
      JSON.stringify({
        onboardComplete: true,
        name: 'Aaditya',
        osid: 'aadityau',
        theme: 'dark',
        firstHint: false,
      }),
    );
  });

  const signatures = [];
  const failures = [];

  // Boot once into Today (hash boot only). Later tabs via bottom nav clicks.
  await page.goto(`${origin}/#today`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#view-today.active', { timeout: 10000 });
  await page.evaluate(() => {
    const map = document.getElementById('map-panel');
    if (map) map.style.display = 'none';
    const fab = document.getElementById('btn-map');
    if (fab) fab.style.display = 'none';
  });

  for (const tab of TABS) {
    if (tab !== 'today') {
      const nav = page.locator(`#bnav [data-tab="${tab}"]`);
      await nav.click();
      await page.waitForSelector(`#view-${tab}.active`, { timeout: 8000 });
    }
    const shot = join(OUT, `tab-${tab}.png`);
    const device = page.locator('.device, .phone-frame, [data-device="galaxy"] .shell, .shell');
    if (await device.count()) {
      await device.first().screenshot({ path: shot });
    } else {
      await page.screenshot({ path: shot, fullPage: false });
    }
    const sig = await extractSignature(page, tab);
    signatures.push(sig);

    const req = REQUIRED[tab];
    if (sig.skeleton !== req.skeleton) {
      failures.push(`${tab}: skeleton got "${sig.skeleton}" want "${req.skeleton}"`);
    }
    if (sig.sigJoined !== req.sig.join(' > ')) {
      failures.push(`${tab}: sig got "${sig.sigJoined}" want "${req.sig.join(' > ')}"`);
    }
    if (tab === 'today' && sig.counts.tb_block < 4) {
      failures.push(`${tab}: need ≥4 time blocks, got ${sig.counts.tb_block}`);
    }
    if (tab === 'today' && sig.counts.habit >= 3) {
      failures.push(`${tab}: checklist habit rows still primary (${sig.counts.habit})`);
    }
    if (tab === 'money' && sig.counts.week_bar < 4 && sig.counts.donut < 1) {
      failures.push(`${tab}: missing spend viz (bars/donut)`);
    }
    if (tab === 'money' && sig.counts.progress >= 3) {
      failures.push(`${tab}: progress-bar list still primary (${sig.counts.progress})`);
    }
    if (tab === 'practice' && sig.counts.heat < 1) {
      failures.push(`${tab}: missing heat calendar`);
    }
    if (tab === 'practice' && sig.counts.c_row >= 3) {
      failures.push(`${tab}: c-row room list still primary (${sig.counts.c_row})`);
    }
    if (tab === 'capture' && sig.counts.composer < 1) {
      failures.push(`${tab}: missing composer stage`);
    }
    if (tab === 'more' && sig.counts.dir_cell < 4) {
      failures.push(`${tab}: directory cells too few (${sig.counts.dir_cell})`);
    }
  }

  // uniqueness
  const skeletons = signatures.map((s) => s.skeleton);
  const uniqSkel = new Set(skeletons);
  if (uniqSkel.size !== skeletons.length) {
    failures.push(`duplicate skeletons: ${skeletons.join(', ')}`);
  }
  const seqs = signatures.map((s) => s.sigJoined);
  const uniqSeq = new Set(seqs);
  if (uniqSeq.size !== seqs.length) {
    failures.push(`duplicate sig sequences: ${seqs.join(' || ')}`);
  }

  const matrix = {};
  for (let i = 0; i < signatures.length; i += 1) {
    for (let j = i + 1; j < signatures.length; j += 1) {
      const a = signatures[i];
      const b = signatures[j];
      const score = jaccard(bagKeys(a.counts), bagKeys(b.counts));
      const key = `${a.tab}|${b.tab}`;
      matrix[key] = Number(score.toFixed(3));
      if (score > MAX_JACCARD) {
        failures.push(`jaccard ${key} = ${score.toFixed(3)} > ${MAX_JACCARD}`);
      }
    }
  }

  const bannedCount = signatures.filter((s) => s.bannedHsl).length;
  if (bannedCount > BANNED_HSL_MAX) {
    failures.push(`banned header+stat+list on ${bannedCount} tabs (max ${BANNED_HSL_MAX})`);
  }

  const report = {
    ok: failures.length === 0,
    maxJaccard: MAX_JACCARD,
    failures,
    signatures,
    matrix,
    screenshots: TABS.map((t) => `tab-${t}.png`),
  };

  writeFileSync(join(OUT, 'signatures.json'), JSON.stringify(report, null, 2));
  const md = [
    '# Tab skeleton gate',
    '',
    `Status: **${report.ok ? 'PASSED' : 'FAILED'}**`,
    `Threshold MAX_JACCARD=${MAX_JACCARD}`,
    '',
    '## Signatures',
    ...signatures.map(
      (s) =>
        `- **${s.tab}**: \`${s.skeleton}\` · \`${s.sigJoined}\` · bannedHsl=${s.bannedHsl}`,
    ),
    '',
    '## Pairwise Jaccard',
    ...Object.entries(matrix).map(([k, v]) => `- ${k}: ${v}`),
    '',
    '## Failures',
    ...(failures.length ? failures.map((f) => `- ${f}`) : ['- none']),
    '',
  ].join('\n');
  writeFileSync(join(OUT, 'gate-report.md'), md);

  await browser.close();
  server.close();

  console.log(md);
  console.log(`artifacts: ${OUT}`);
  process.exit(report.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
