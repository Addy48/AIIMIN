const endpoint = 'http://127.0.0.1:9222';
const targets = await (await fetch(`${endpoint}/json/list`)).json();
const page = targets.find((item) => item.type === 'page' && item.url.startsWith('http://127.0.0.1:3000/'));
if (!page) throw new Error('No local application page found');
const ws = new WebSocket(page.webSocketDebuggerUrl);
let nextId = 1;
const pending = new Map();
const runtimeErrors = [];
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push({ type: 'exception', text: message.params.exceptionDetails?.text || message.params.exceptionDetails?.exception?.description || 'unknown exception' });
  if (message.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(message.params.type)) runtimeErrors.push({ type: `console.${message.params.type}`, text: message.params.args?.map((arg) => arg.value || arg.description || '').join(' ') || message.params.type });
  if (message.id && pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
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
await send('Page.navigate', { url: 'http://127.0.0.1:3000/overview' });
await new Promise((resolve) => setTimeout(resolve, 5000));
const probe = await send('Runtime.evaluate', { expression: `(() => ({ url:location.href, title:document.title, bodyText:(document.body.innerText||'').slice(0,1200), errorHeading:[...document.querySelectorAll('h1,h2,h3')].map((node)=>node.innerText).find((text)=>/application encountered|something went wrong|error/i.test(text)) || null }))()`, returnByValue: true });
console.log(JSON.stringify({ pageTarget:page.url, result:probe?.result?.value || {}, runtimeErrors }, null, 2));
ws.close();
