const endpoint = 'http://127.0.0.1:9222';
const pages = await (await fetch(`${endpoint}/json`)).json();
const page = pages.find((item) => item.type === 'page');
if (!page) throw new Error('No Chrome page found');
const ws = new WebSocket(page.webSocketDebuggerUrl);
let nextId = 1;
const pending = new Map();
const errors = [];
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') errors.push({ type: 'exception', text: message.params.exceptionDetails?.text || message.params.exceptionDetails?.exception?.description || 'unknown exception' });
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push({ type: 'console.error', text: message.params.args?.map((arg) => arg.value || arg.description || '').join(' ') || 'console error' });
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
await send('Log.enable');
const rows = [];
for (const theme of ['aiimin-dark', 'aiimin-light']) {
  const prefs = JSON.stringify({ currentTheme: theme, defaultLightTheme: 'aiimin-light', defaultDarkTheme: 'aiimin-dark' });
  await send('Runtime.evaluate', { expression: `localStorage.setItem('aiimin-theme-prefs', ${JSON.stringify(prefs)})`, returnByValue: true });
  for (const tier of ['explore', 'core', 'pro', 'elite']) {
    errors.length = 0;
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: `http://127.0.0.1:3000/reports-demo?demo=1&tier=${tier}` });
    await new Promise((resolve) => setTimeout(resolve, 2200));
    const probe = await send('Runtime.evaluate', { expression: `(() => { const root=document.documentElement; const workspace=document.querySelector('.report-workspace'); const footer=document.querySelector('.report-footer'); const required = { workspace:Boolean(workspace), footer:Boolean(footer), tier:'${tier}', theme:root.getAttribute('data-theme'), score:Boolean(document.querySelector('.report-score-mark')), method:'${tier}' === 'elite' ? Boolean(document.querySelector('.report-method')) : true }; return { ...required, scrollWidth:root.scrollWidth, bodyScrollWidth:document.body.scrollWidth, bodyText:(document.body.innerText||'').slice(0,120) }; })()`, returnByValue: true });
    rows.push({ theme, tier, probe:probe?.result?.value || {}, errors:[...errors] });
  }
}
console.log(JSON.stringify(rows, null, 2));
ws.close();
