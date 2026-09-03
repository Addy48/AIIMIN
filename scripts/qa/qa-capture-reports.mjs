const fs = await import('node:fs/promises');
const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const page = pages.find((item) => item.type === 'page');
if (!page) throw new Error('No Chrome page found');
const ws = new WebSocket(page.webSocketDebuggerUrl); let nextId = 1; const pending = new Map();
ws.onmessage = (event) => { const message = JSON.parse(event.data); if (message.id && pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); } };
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = nextId++; pending.set(id, (message) => message.error ? reject(new Error(message.error.message)) : resolve(message.result)); ws.send(JSON.stringify({ id, method, params })); });
await new Promise((resolve) => ws.readyState === 1 ? resolve() : ws.addEventListener('open', resolve, { once: true }));
const root = '/Users/aaditya/Desktop/DASHBOARD PROJECT';
for (const tier of ['explore', 'core', 'pro', 'elite']) {
  for (const mode of [{ name: 'desktop', width: 1440, height: 1000, mobile: false }, { name: 'mobile', width: 390, height: 844, mobile: true }]) {
    await send('Emulation.setDeviceMetricsOverride', { width: mode.width, height: mode.height, deviceScaleFactor: 1, mobile: mode.mobile });
    await send('Page.navigate', { url: `http://127.0.0.1:3000/reports-demo?demo=1&tier=${tier}` });
    await new Promise((resolve) => setTimeout(resolve, 1800));
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await fs.writeFile(`${root}/reports-demo-${tier}-${mode.name}-latest.png`, Buffer.from(shot.data, 'base64'));
    console.log(`${tier} ${mode.name}`);
  }
}
ws.close();
