/* AIIMIN Living Momentum — app logic */
const TITLES = {
  today: 'Today',
  knowledge: 'Knowledge',
  timeline: 'Timeline',
  family: 'Family',
  finance: 'Finance',
  documents: 'Documents',
  ai: 'AI'
};

const SHEETS = {
  capture: {
    title: 'Capture',
    sub: 'One utterance. System structures.',
    actions: [
      { id: 'habit', t: 'Log habit', m: 'Mark or create a habit', go: null, toast: 'Habit logged' },
      { id: 'journal', t: 'Journal line', m: 'Capture mood + thought', go: 'knowledge', toast: 'Opening journal' },
      { id: 'spend', t: 'Log spend', m: 'e.g. spent 240 coffee', go: 'finance', toast: 'Chip confirm: Food ₹240' },
      { id: 'note', t: 'Quick note', m: 'No title required', go: 'knowledge', toast: 'Note captured' },
      { id: 'event', t: 'Time block', m: 'Adds to Timeline', go: 'timeline', toast: 'Block added' }
    ]
  },
  habit: {
    title: 'Add habit',
    sub: 'Keep it tiny. Structure later.',
    actions: [
      { id: 'h1', t: 'Evening wind-down', m: 'Discipline · 10 min', toast: 'Habit added' },
      { id: 'h2', t: 'Inbox zero pass', m: 'Work · daily', toast: 'Habit added' }
    ]
  },
  spend: {
    title: 'Log spend',
    sub: 'Infer category · chip to confirm',
    actions: [
      { id: 's1', t: '₹180 coffee', m: 'Food', toast: 'Logged ₹180 · Food' },
      { id: 's2', t: '₹60 metro', m: 'Transit', toast: 'Logged ₹60 · Transit' },
      { id: 's3', t: 'Custom…', m: 'Type in production', toast: 'Capture ready' }
    ]
  },
  doc: {
    title: 'Upload',
    sub: 'Files land in Documents · vault if sensitive',
    actions: [
      { id: 'd1', t: 'From photos', m: 'Image or PDF', toast: 'Upload queued' },
      { id: 'd2', t: 'Scan document', m: 'Camera', toast: 'Scanner open' },
      { id: 'd3', t: 'To private vault', m: 'Requires PIN', toast: 'Move to vault' }
    ]
  }
};

let obStep = 0;
let pin = '';
let toastT;

window.addEventListener('load', () => {
  buildSpark();
  setTimeout(() => transitionFlow('splash', 'onboarding'), 2100);
});

function toggleTheme(e) {
  if (e) e.stopPropagation();
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.body.setAttribute('data-viewer', next);
  const label = document.getElementById('themeLabel');
  if (label) label.textContent = next.charAt(0).toUpperCase() + next.slice(1);
  const apVal = document.getElementById('apVal');
  if (apVal) apVal.textContent = next.charAt(0).toUpperCase() + next.slice(1);
  const apT = document.getElementById('apToggle');
  if (apT) apT.classList.toggle('on', next === 'dark');
}

function transitionFlow(from, to) {
  const f = document.getElementById(from);
  const t = document.getElementById(to);
  if (f) f.classList.remove('active');
  if (t) t.classList.add('active');
}

function obAdvance() {
  if (obStep < 2) {
    obStep += 1;
    updateOb();
  } else {
    goAuth();
  }
}

function updateOb() {
  document.querySelectorAll('#obSlides .ob-slide').forEach((s, i) => s.classList.toggle('active', i === obStep));
  document.querySelectorAll('#obDots i').forEach((d, i) => d.classList.toggle('active', i === obStep));
  const btn = document.getElementById('obNext');
  if (btn) btn.textContent = obStep === 2 ? 'Begin' : 'Continue';
}

function goAuth() {
  ['splash', 'onboarding'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  document.getElementById('auth').classList.add('active');
}

function enterApp() {
  ['splash', 'onboarding', 'auth'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  document.getElementById('app').classList.add('active');
  go('today');
}

function signOut() {
  closeAll();
  document.querySelectorAll('.subscreen').forEach((s) => s.classList.remove('active'));
  document.getElementById('app').classList.remove('active');
  document.getElementById('auth').classList.add('active');
}

function go(name) {
  if (name === 'more') {
    openMore();
    return;
  }
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) {
    el.classList.add('active');
    el.scrollTop = 0;
  }
  const primary = ['today', 'knowledge', 'timeline'];
  const onPrimary = primary.includes(name);
  document.querySelectorAll('.navitem').forEach((n) => {
    const screen = n.dataset.screen;
    if (screen === 'more') {
      n.classList.toggle('active', !onPrimary);
    } else {
      n.classList.toggle('active', screen === name);
    }
  });
  const sub = document.getElementById('topSub');
  if (sub) sub.textContent = TITLES[name] || 'AIIMIN';
  closeAll();
}

function openMore() {
  openDrawer();
  document.querySelectorAll('.navitem').forEach((n) => n.classList.toggle('active', n.dataset.screen === 'more'));
}

function drawerGo(name) {
  go(name);
}

function drawerSub(id) {
  closeAll();
  setTimeout(() => openSub(id), 120);
}

function openSub(id) {
  document.getElementById(id).classList.add('active');
}

function closeSub(id) {
  document.getElementById(id).classList.remove('active');
}

function openDrawer() {
  document.getElementById('drawer').classList.add('show');
  document.getElementById('scrim').classList.add('show');
}

function openSheet(kind) {
  const conf = SHEETS[kind] || SHEETS.capture;
  document.getElementById('sheetTitle').textContent = conf.title;
  document.getElementById('sheetSub').textContent = conf.sub;
  const grid = document.getElementById('sheetGrid');
  grid.innerHTML = conf.actions
    .map(
      (a) => `<button type="button" class="sheet-act" onclick="sheetAct('${a.go || ''}','${a.toast.replace(/'/g, "\\'")}')">
      <span class="thumb ic-orange">+</span>
      <span><div class="t">${a.t}</div><div class="m">${a.m}</div></span>
    </button>`
    )
    .join('');
  document.getElementById('sheet').classList.add('show');
  document.getElementById('scrim').classList.add('show');
}

function sheetAct(goTo, msg) {
  closeAll();
  toast(msg);
  if (goTo) {
    if (goTo === 'knowledge') setKnowTab('journal');
    setTimeout(() => go(goTo), 180);
  }
}

function closeAll() {
  ['drawer', 'sheet'].forEach((id) => document.getElementById(id).classList.remove('show'));
  document.getElementById('scrim').classList.remove('show');
}

function toggleHabit(row) {
  row.classList.toggle('done');
  toast(row.classList.contains('done') ? 'Habit completed' : 'Habit reopened');
}

function setChip(btn) {
  btn.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
  btn.classList.add('active');
}

function setKnowTab(name) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
  document.getElementById('pane-journal').classList.toggle('active', name === 'journal');
  document.getElementById('pane-notes').classList.toggle('active', name === 'notes');
}

function saveJournal() {
  const v = document.getElementById('journalInput').value.trim();
  if (!v) {
    toast('Write a line first');
    return;
  }
  document.getElementById('journalInput').value = '';
  toast('Entry saved · Timeline updated');
}

function filterNotes(q) {
  q = q.toLowerCase();
  document.querySelectorAll('#notesGrid .note-card').forEach((c) => {
    c.style.display = c.dataset.title.toLowerCase().includes(q) ? '' : 'none';
  });
}

function filterSearch(q) {
  q = q.toLowerCase();
  document.querySelectorAll('#searchResults .row').forEach((r) => {
    const hay = (r.dataset.q || '') + ' ' + r.textContent;
    r.style.display = hay.toLowerCase().includes(q) ? '' : 'none';
  });
}

function markAllRead() {
  document.querySelectorAll('#notifList .notif').forEach((n) => n.classList.remove('unread'));
  toast('All caught up');
}

function sendAI(e) {
  e.preventDefault();
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) return false;
  appendAI('user', text);
  input.value = '';
  setTimeout(() => {
    appendAI(
      'bot',
      'Noted. I can draft a focus block or a spend chip — pick one. Coaching only; no clinical labels.'
    );
  }, 450);
  return false;
}

function aiChip(text) {
  appendAI('user', text);
  setTimeout(() => {
    appendAI('bot', 'Scheduled a 45-minute deep-work block after breakfast. You can change it from Today.');
    toast('Block suggested on Today');
  }, 400);
}

function appendAI(kind, text) {
  const thread = document.getElementById('aiThread');
  const div = document.createElement('div');
  div.className = 'ai-msg ' + kind;
  div.innerHTML = `<p>${text}</p>`;
  thread.appendChild(div);
  thread.scrollTop = thread.scrollHeight;
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 1800);
}

function pinPress(n) {
  if (pin.length >= 4) return;
  pin += n;
  updatePin();
  if (pin.length === 4) {
    setTimeout(() => {
      document.getElementById('vaultLocked').hidden = true;
      document.getElementById('vaultUnlocked').hidden = false;
      toast('Vault unlocked');
    }, 220);
  }
}

function pinDelete() {
  pin = pin.slice(0, -1);
  updatePin();
}

function updatePin() {
  document.querySelectorAll('#pinDots i').forEach((d, i) => d.classList.toggle('filled', i < pin.length));
}

function buildSpark() {
  const el = document.getElementById('spark');
  if (!el) return;
  const vals = [40, 65, 50, 80, 55, 90, 70];
  el.innerHTML = vals.map((v, i) => `<span style="height:${v}%;animation-delay:${i * 60}ms"></span>`).join('');
}
