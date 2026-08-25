import fs from 'node:fs/promises';

const endpoint = 'http://127.0.0.1:9222';
const root = '/Users/aaditya/Desktop/DASHBOARD PROJECT';
const pages = await (await fetch(`${endpoint}/json`)).json();
const page = pages.find((item) => item.type === 'page');
if (!page) throw new Error('No Chrome page found');
const ws = new WebSocket(page.webSocketDebuggerUrl);
let nextId = 1;
const pending = new Map();
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
};
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = nextId++;
  pending.set(id, (message) => message.error ? reject(new Error(message.error.message)) : resolve(message.result));
  ws.send(JSON.stringify({ id, method, params }));
});
await new Promise((resolve) => ws.readyState === 1 ? resolve() : ws.addEventListener('open', resolve, { once: true }));
await send('Page.enable');
await send('Runtime.enable');
const rows = [];
for (const theme of ['aiimin-dark', 'aiimin-light']) {
  const prefs = JSON.stringify({ currentTheme: theme, defaultLightTheme: 'aiimin-light', defaultDarkTheme: 'aiimin-dark' });
  await send('Runtime.evaluate', { expression: `localStorage.setItem('aiimin-theme-prefs', ${JSON.stringify(prefs)})`, returnByValue: true });
  for (const tier of ['explore', 'core', 'pro', 'elite']) {
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: `http://127.0.0.1:3000/reports-demo?demo=1&tier=${tier}` });
    await new Promise((resolve) => setTimeout(resolve, 2200));
    const probe = await send('Runtime.evaluate', { expression: `(() => { const root = document.documentElement; const workspace = document.querySelector('.report-workspace'); const footer = document.querySelector('.report-footer'); const rail = document.querySelector('.elite-room__rail'); const r = (node) => { if (!node) return null; const box = node.getBoundingClientRect(); return { x:box.x, width:box.width, right:box.right, bottom:box.bottom }; }; return { theme:root.getAttribute('data-theme'), tier:'${tier}', innerWidth, scrollWidth:root.scrollWidth, bodyScrollWidth:document.body.scrollWidth, workspace:r(workspace), footer:r(footer), rail:r(rail), heading:document.querySelector('.report-hero h1, .elite-room__head h1')?.innerText || null }; })()`, returnByValue: true });
    const data = probe?.result?.value || {};
    rows.push(data);
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await fs.writeFile(`${root}/reports-theme-${theme}-${tier}-mobile.png`, Buffer.from(shot.data, 'base64'));
  }
}
await fs.writeFile(`${root}/qa-report-theme-mobile-probe.json`, `${JSON.stringify(rows, null, 2)}\n`);
console.log(JSON.stringify(rows, null, 2));
ws.close();
