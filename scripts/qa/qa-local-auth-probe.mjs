const endpoint = 'http://127.0.0.1:9222';
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
const result = [];
for (const route of ['/overview', '/reports']) {
  await send('Page.navigate', { url: `http://127.0.0.1:3000${route}` });
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const probe = await send('Runtime.evaluate', { expression: `(() => { const root=document.documentElement; const os=document.querySelector('.ivory-snap__name'); const workspace=document.querySelector('.report-workspace'); const bodyText=(document.body.innerText||'').slice(0,1000); const style=os ? getComputedStyle(os) : null; return { route:'${route}', theme:root.getAttribute('data-theme'), title:document.title, bodyText, osId:os ? { text:os.innerText, className:os.className, fontFamily:style.fontFamily, fontSize:style.fontSize, fontWeight:style.fontWeight, letterSpacing:style.letterSpacing } : null, report:workspace ? { className:workspace.className, background:getComputedStyle(workspace).backgroundColor, accent:getComputedStyle(workspace).getPropertyValue('--report-accent').trim() } : null }; })()`, returnByValue: true });
  result.push(probe?.result?.value || {});
}
console.log(JSON.stringify(result, null, 2));
ws.close();
