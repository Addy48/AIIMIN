import fs from 'node:fs';

const endpoint = 'http://127.0.0.1:9222';
const pages = await (await fetch(`${endpoint}/json`)).json();
const page = pages.find((item) => item.type === 'page');
if (!page) throw new Error('No Chrome page found');
const cssPath = fs.readdirSync(new URL('./frontend/build/static/css/', import.meta.url)).find((name) => name.startsWith('417.') && name.endsWith('.chunk.css'));
if (!cssPath) throw new Error('Compiled IvorySnapshot CSS chunk not found');
const cssText = fs.readFileSync(new URL(`./frontend/build/static/css/${cssPath}`, import.meta.url), 'utf8');
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
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://127.0.0.1:3000/reports-demo?demo=1&tier=core' });
await new Promise((resolve) => setTimeout(resolve, 2200));
await send('Runtime.evaluate', { expression: `(() => { const style=document.createElement('style'); style.textContent=${JSON.stringify(cssText)}; document.head.appendChild(style); return style.textContent.length; })()`, returnByValue: true });
await new Promise((resolve) => setTimeout(resolve, 100));
const probe = await send('Runtime.evaluate', { expression: `(() => { const wrapper = document.createElement('div'); wrapper.className = 'ivory-snap is-light'; wrapper.style.cssText = 'position:fixed;left:-9999px;top:-9999px'; const make = (className, text) => { const node = document.createElement('div'); node.className = className; node.textContent = text; wrapper.appendChild(node); return node; }; const osNode = make('ivory-snap__name ivory-snap__name--os-id', 'AADI0837'); const normalNode = make('ivory-snap__name', 'Aaditya'); document.body.appendChild(wrapper); const os = getComputedStyle(osNode); const normal = getComputedStyle(normalNode); const result = { osId: { text:osNode.textContent, fontFamily:os.fontFamily, fontSize:os.fontSize, fontWeight:os.fontWeight, letterSpacing:os.letterSpacing }, normalName: { text:normalNode.textContent, fontFamily:normal.fontFamily, fontSize:normal.fontSize, fontWeight:normal.fontWeight, letterSpacing:normal.letterSpacing } }; wrapper.remove(); result.scopedDifference = result.osId.fontFamily !== result.normalName.fontFamily || result.osId.fontWeight !== result.normalName.fontWeight || result.osId.letterSpacing !== result.normalName.letterSpacing; return result; })()`, returnByValue: true });
const value = probe?.result?.value || {};
console.log(JSON.stringify(value, null, 2));
if (!value.scopedDifference) process.exitCode = 1;
ws.close();
