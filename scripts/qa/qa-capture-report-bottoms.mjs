import fs from 'node:fs';

const endpoint = 'http://127.0.0.1:9222';
const outputDir = new URL('./', import.meta.url);
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
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
const rows = [];
for (const theme of ['aiimin-dark', 'aiimin-light']) {
  const prefs = JSON.stringify({ currentTheme: theme, defaultLightTheme: 'aiimin-light', defaultDarkTheme: 'aiimin-dark' });
  await send('Runtime.evaluate', { expression: `localStorage.setItem('aiimin-theme-prefs', ${JSON.stringify(prefs)})`, returnByValue: true });
  for (const tier of ['explore', 'pro', 'elite']) {
    await send('Page.navigate', { url: `http://127.0.0.1:3000/reports-demo?demo=1&tier=${tier}` });
    await new Promise((resolve) => setTimeout(resolve, 2200));
    const metrics = await send('Runtime.evaluate', { expression: `(() => { const root=document.documentElement; const footer=document.querySelector('.report-footer'); const workspace=document.querySelector('.report-workspace'); const height=Math.max(root.scrollHeight, document.body.scrollHeight); window.scrollTo(0, Math.max(0, height-window.innerHeight)); return { theme:root.getAttribute('data-theme'), tier:'${tier}', height, footerText:footer?.innerText || '', footerBottom:footer?.getBoundingClientRect().bottom || null, viewportBottom:window.innerHeight }; })()`, returnByValue: true });
    await new Promise((resolve) => setTimeout(resolve, 350));
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const name = `reports-demo-${tier}-${theme}-bottom.png`;
    fs.writeFileSync(new URL(name, outputDir), Buffer.from(shot.data, 'base64'));
    rows.push({ ...(metrics?.result?.value || {}), screenshot:name });
  }
}
console.log(JSON.stringify(rows, null, 2));
ws.close();
