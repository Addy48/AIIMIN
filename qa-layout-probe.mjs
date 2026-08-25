const endpoint = process.argv[2] || 'http://127.0.0.1:9222';
const targetUrl = process.argv[3] || 'http://127.0.0.1:3000/reports-demo?demo=1&tier=explore';
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
await send('Emulation.setDeviceMetricsOverride', { width:390, height:844, deviceScaleFactor:1, mobile:true });
await send('Page.navigate', { url: targetUrl });
await new Promise((resolve) => setTimeout(resolve, 4000));
const expression = `(() => {
  const pick = (selector) => [...document.querySelectorAll(selector)].map((node) => { const r = node.getBoundingClientRect(); const s = getComputedStyle(node); return { selector, text: (node.innerText || '').slice(0,180), rect: {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}, display:s.display, width:s.width, minWidth:s.minWidth, maxWidth:s.maxWidth, overflow:s.overflow, overflowX:s.overflowX, whiteSpace:s.whiteSpace, flexDirection:s.flexDirection, gridTemplateColumns:s.gridTemplateColumns, reportAccent:s.getPropertyValue('--report-accent').trim(), reportSpark:s.getPropertyValue('--report-spark').trim(), background:s.background, color:s.color }; });
  return JSON.stringify({ viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio}, scroll:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}, body:{width:document.body.getBoundingClientRect().width, scrollWidth:document.body.scrollWidth}, nodes:[...pick('.report-demo-banner'), ...pick('.report-workspace'), ...pick('.report-hero'), ...pick('.report-hero > div:first-child'), ...pick('.report-hero h1'), ...pick('.report-hero p'), ...pick('.report-score-mark'), ...pick('.report-coverage')] });
})()`;
const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
console.log(JSON.stringify(result));
ws.close();
