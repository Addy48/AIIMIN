import fs from 'node:fs';

const root = new URL('./', import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), 'utf8');
const checks = [
  ['Overview reminder CTA', read('./frontend/src/pages/Overview.jsx').includes('openFamilyReminder') && read('./frontend/src/pages/Overview.jsx').includes('/family?tab=reminders&reminder='), 'Today urgent reminders route to the Family Reminders tab with a selected reminder ID'],
  ['Family deep link', read('./frontend/src/pages/Family.jsx').includes('useSearchParams') && read('./frontend/src/pages/Family.jsx').includes('data-family-reminder-id'), 'Family reads the reminder query and marks the selected row'],
  ['Notification CTA', read('./frontend/src/components/Navbar.jsx').includes('notificationActionLabel') && read('./frontend/src/components/Navbar.jsx').includes('openNotification'), 'Notification rows expose explicit actions and internal navigation'],
  ['Keyboard activation', read('./frontend/src/components/Navbar.jsx').includes("event.key === 'Enter'") && read('./frontend/src/components/Navbar.jsx').includes("event.key === ' '"), 'Actionable notification rows support Enter and Space'],
  ['Urgent visual state', read('./frontend/src/components/Navbar.jsx').includes('isUrgentNotification') && read('./frontend/src/index.css').includes('.nav-notif-dropdown__item.is-urgent'), 'Urgent notifications receive red bell/dropdown treatment'],
  ['Preference save feedback', read('./frontend/src/pages/account/sections/NotificationsSection.jsx').includes('Could not save this preference') && read('./frontend/src/pages/account/sections/NotificationsSection.jsx').includes('aria-label={label}'), 'Notification settings expose save failure feedback and accessible switches'],
];
const failed = checks.filter(([, pass]) => !pass);
for (const [name, pass, detail] of checks) console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | ${detail}`);
if (failed.length) process.exit(1);

const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const page = pages.find((item) => item.type === 'page');
if (!page) throw new Error('No Chrome page found');
const ws = new WebSocket(page.webSocketDebuggerUrl);
let nextId = 1;
const pending = new Map();
const errors = [];
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails?.text || 'exception');
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args?.map((arg) => arg.value || arg.description || '').join(' ') || 'console.error');
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
await send('Page.navigate', { url: 'http://127.0.0.1:3000/reports-demo?demo=1&tier=elite' });
await new Promise((resolve) => setTimeout(resolve, 2200));
const probe = await send('Runtime.evaluate', { expression: `(() => ({ title:document.title, workspace:Boolean(document.querySelector('.report-workspace')), footer:Boolean(document.querySelector('.report-footer')), width:document.documentElement.scrollWidth }))()`, returnByValue: true });
console.log(JSON.stringify({ runtime:probe?.result?.value || {}, consoleErrors:errors }, null, 2));
if (errors.length || !probe?.result?.value?.workspace || !probe?.result?.value?.footer) process.exitCode = 1;
ws.close();
