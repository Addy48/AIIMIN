"""v5 direction homes — opus-quality, hand-authored blocks."""

HOME_A = """
        <section class="screen active" id="screen-today">
          <div class="hero" style="margin-bottom:4px">
            <div class="greet">
              <h1 style="font-size:26px">Mission Control</h1>
              <p>Sunday · Life Score 62 · Pro till Aug 10</p>
            </div>
            <button class="icon-btn" onclick="openPalette()" title="Command palette (⌘K)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg></button>
          </div>
          <div class="mission-metric">
            <div class="stat" onclick="toast('Life Score history')">
              <div class="ring"><svg width="56" height="56"><circle cx="28" cy="28" r="24" fill="none" stroke="var(--chart-track)" stroke-width="6"/><circle cx="28" cy="28" r="24" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" stroke-dasharray="150.8" stroke-dashoffset="58"/></svg><span class="pct">62</span></div>
              <div><div class="lbl">Life Score</div><div class="val">62</div><div class="cap">Up from 58</div></div>
            </div>
            <div class="stat"><div class="flame-stat">14</div><div><div class="lbl">Streak</div><div class="val">14</div><div class="cap">Days logged</div></div></div>
          </div>
          <div class="mission-metric" style="margin-top:10px">
            <div class="stat" onclick="go('tasks')"><div><div class="lbl">Tasks</div><div class="val">5<small>/8</small></div><div class="cap">2 due today</div></div></div>
            <div class="stat" onclick="go('habits')"><div><div class="lbl">Habits</div><div class="val">5<small>/8</small></div><div class="cap">Morning review done</div></div></div>
          </div>
          <div class="sec-head"><span class="sec-title">Execution window</span><a class="sec-link" onclick="go('calendar')">Calendar</a></div>
          <div class="card plan">
            <div class="plan-row done" onclick="toggleTask(this)"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg></div><div class="plan-body"><div class="p-title">Morning review</div><div class="p-meta"><span class="p-tag tag-focus">Habit</span> Streak 14</div></div><div class="p-time">Done</div></div>
            <div class="plan-row" onclick="toggleTask(this)"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg></div><div class="plan-body"><div class="p-title">DSA Trees and Graphs</div><div class="p-meta"><span class="p-tag tag-work">Focus</span> 16:00 · 45 min</div></div><div class="p-time">16:00</div></div>
            <div class="plan-row" onclick="toggleTask(this)"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg></div><div class="plan-body"><div class="p-title">Sam call prep</div><div class="p-meta"><span class="p-tag tag-work">Career</span> Reports notes</div></div><div class="p-time">18:30</div></div>
          </div>
          <div class="sec-head"><span class="sec-title">Quick jump</span></div>
          <div class="qa-grid">
            <button class="qa" onclick="go('journal')"><span class="ico ic-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></svg></span><span>Journal</span></button>
            <button class="qa" onclick="go('notes')"><span class="ico ic-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 4h14v16H5z"/></svg></span><span>Notes</span></button>
            <button class="qa" onclick="openSub('sub-vault')"><span class="ico ic-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="10" width="16" height="10" rx="2"/></svg></span><span>Vault</span></button>
            <button class="qa" onclick="openSub('sub-billing')"><span class="ico ic-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2"/></svg></span><span>Plans</span></button>
          </div>
          <div class="sec-head"><span class="sec-title">Recent activity</span><a class="sec-link" onclick="go('dashboard')">Dashboard</a></div>
          <div class="card list">
            <div class="row" onclick="toast('Synced from native')"><div class="thumb ic-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12h16"/></svg></div><div class="row-body"><div class="row-title">Morning review logged</div><div class="row-meta">2m ago · Habits</div></div><svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></div>
            <div class="row"><div class="thumb ic-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4"/></svg></div><div class="row-body"><div class="row-title">Swiggy · Rs 340</div><div class="row-meta">Yesterday · Food</div></div><svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></div>
          </div>
          <p style="font-size:11px;color:var(--text-3);text-align:center;margin-top:14px">⌘K / Ctrl+K · command palette</p>
        </section>"""

HOME_B = """
        <section class="screen active" id="screen-today" style="display:flex;flex-direction:column;padding-bottom:72px">
          <div class="page-head" style="padding-bottom:8px"><div class="page-title">Good afternoon, Aaditya</div><div class="page-sub">One screen. Every day.</div></div>
          <div class="chips" style="margin-bottom:12px">
            <button class="chip active" onclick="setChip(this)">Plan</button>
            <button class="chip" onclick="setChip(this);go('notes')">Notes</button>
            <button class="chip" onclick="setChip(this);openSub('sub-billing')">Finance</button>
            <button class="chip" onclick="setChip(this);openDrawer()">More</button>
          </div>
          <div class="chat-shell">
            <div class="chat-thread" id="chatThread">
              <div class="msg ai"><div class="ava">AI</div><div class="bubble">Life Score is 62. DSA at 16:00, journal still open. Want me to plan the afternoon?</div></div>
              <div class="msg me"><div class="ava">AU</div><div class="bubble">Log morning review done. Snooze evening run.</div></div>
              <div class="msg ai"><div class="ava">AI</div><div class="bubble">Done. Streak stays at 14. Run moved to tomorrow 06:30.</div></div>
            </div>
            <div class="ai-suggest" style="padding:8px 12px 0">
              <button class="chip" onclick="chatSend('Plan my afternoon')">Plan afternoon</button>
              <button class="chip" onclick="go('journal')">Journal prompt</button>
              <button class="chip" onclick="go('tasks')">Show tasks</button>
            </div>
            <div class="ai-input" style="margin:12px">
              <input id="chatInp" placeholder="Tell AIIMIN what to file…" onkeydown="if(event.key==='Enter')chatSend()"/>
              <button class="ai-send" onclick="chatSend()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12l16-8-6 16-2-6-8-2z"/></svg></button>
            </div>
          </div>
        </section>"""

HOME_C = """
        <section class="screen active" id="screen-today">
          <div class="page-head"><div class="page-title">Workspace</div><div class="page-sub">Drag cards · Now / Next / Pin</div></div>
          <div class="layout-switch">
            <button class="chip active" onclick="setLayout(this,'board')">Board</button>
            <button class="chip" onclick="setLayout(this,'list')">List</button>
            <button class="chip" onclick="setLayout(this,'focus')">Focus</button>
          </div>
          <div id="boardView" class="board-cols">
            <div class="board-col" data-col="now" ondragover="event.preventDefault()" ondrop="dropCard(event)">
              <div class="board-col-h">Now <span>2</span></div>
              <div class="board-card" draggable="true" ondragstart="dragCard(event)"><b>DSA Trees</b><p>16:00 · 45 min focus</p></div>
              <div class="board-card" draggable="true" ondragstart="dragCard(event)"><b>Journal</b><p>What moved you today?</p></div>
            </div>
            <div class="board-col" data-col="next" ondragover="event.preventDefault()" ondrop="dropCard(event)">
              <div class="board-col-h">Next <span>2</span></div>
              <div class="board-card" draggable="true" ondragstart="dragCard(event)"><b>Sam call prep</b><p>Reports module</p></div>
              <div class="board-card" draggable="true" ondragstart="dragCard(event)"><b>Evening 5K</b><p>Streak 6</p></div>
            </div>
            <div class="board-col" data-col="pin" ondragover="event.preventDefault()" ondrop="dropCard(event)">
              <div class="board-col-h">Pin <span>1</span></div>
              <div class="board-card pinned" draggable="true" ondragstart="dragCard(event)"><b>Launch AIIMIN v1.0</b><p>Aug 15 · 78%</p></div>
            </div>
          </div>
          <div id="listView" style="display:none" class="card plan">
            <div class="plan-row"><div class="plan-body"><div class="p-title">DSA Trees and Graphs</div><div class="p-meta">Now</div></div></div>
            <div class="plan-row"><div class="plan-body"><div class="p-title">Journal prompt</div><div class="p-meta">Now</div></div></div>
            <div class="plan-row"><div class="plan-body"><div class="p-title">Sam call prep</div><div class="p-meta">Next</div></div></div>
          </div>
          <div id="focusView" style="display:none;text-align:center;padding:40px 20px">
            <div class="page-title" style="font-size:48px;font-family:var(--font-display)">25:00</div>
            <p style="color:var(--text-2);margin:12px 0 20px">DSA Trees and Graphs</p>
            <button class="btn btn-primary" onclick="startFocusV3()">Start block</button>
          </div>
        </section>"""

HOME_D = """
        <section class="screen active screen-timeline" id="screen-today" style="padding-bottom:100px">
          <div class="timeline-nav">
            <button class="chip active">Flow</button>
            <button class="chip" onclick="go('calendar')">Week</button>
            <button class="chip" onclick="openSub('sub-notifications')">Inbox</button>
          </div>
          <div class="timeline-spine" id="timelineSpine">
            <div class="tl-now"><span class="pulse-dot"></span>Now · 13:42</div>
            <div class="tl-block done"><time>07:00</time><div class="tl-card"><b>Morning review</b><p>Habit · streak 14</p></div></div>
            <div class="tl-block done"><time>09:30</time><div class="tl-card"><b>AIIMIN auth review</b><p>Task completed</p></div></div>
            <div class="tl-block now"><time>16:00</time><div class="tl-card accent"><b>DSA Trees and Graphs</b><p>Focus · 45 min · Lab notes ready</p><button class="btn btn-primary" style="margin-top:10px;width:100%" onclick="startFocusV3()">Start</button></div></div>
            <div class="tl-block"><time>18:30</time><div class="tl-card"><b>Sam call</b><p>Career · prep Reports</p></div></div>
            <div class="tl-block"><time>21:00</time><div class="tl-card"><b>Journal</b><p>What moved you today?</p></div></div>
            <div class="tl-block locked" onclick="openSub('sub-billing')"><time>—</time><div class="tl-card"><b>Discipline pledge</b><p>Core · Day 9 locked</p></div></div>
          </div>
        </section>"""

HOME_E = """
        <section class="screen active" id="screen-today" style="padding:0;display:flex;flex-direction:column;overflow:hidden">
          <div class="spatial-toolbar">
            <button class="icon-btn" onclick="zoomCanvas(-0.1)">−</button>
            <button class="icon-btn" onclick="zoomCanvas(0.1)">+</button>
            <span style="font-size:12px;color:var(--text-3);margin-left:auto">Drag canvas · tap a node</span>
          </div>
          <div class="spatial-wrap" id="spatialWrap">
            <div class="spatial-canvas" id="spatialCanvas">
              <div class="s-node" style="left:50%;top:16%;transform:translate(-50%,0)" onclick="nodeTap('work')"><span>Work</span><small>DSA · Sam</small></div>
              <div class="s-node" style="left:18%;top:42%" onclick="nodeTap('health')"><span>Health</span><small>Run · Water</small></div>
              <div class="s-node" style="left:76%;top:44%" onclick="nodeTap('money')"><span>Money</span><small>73% budget</small></div>
              <div class="s-node" style="left:32%;top:70%" onclick="nodeTap('family')"><span>Family</span><small>4 members</small></div>
              <div class="s-node core" style="left:62%;top:66%" onclick="nodeTap('you')"><span>You</span><small>Score 62</small></div>
              <svg class="s-edges" viewBox="0 0 400 600"><path d="M200 90 L72 250 M200 90 L328 265 M200 90 L128 420 M200 90 L248 400" stroke="var(--accent-line)" fill="none" stroke-width="1.5" opacity=".45"/></svg>
            </div>
          </div>
          <div class="spatial-minimap"></div>
        </section>"""

NAV_A = """
      <nav class="bottomnav bottomnav-4">
        <button class="navitem active" data-screen="today" onclick="go('today')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg><span>Control</span></button>
        <button class="navitem" data-screen="tasks" onclick="go('tasks')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11l3 3L22 4"/></svg><span>Tasks</span></button>
        <button class="navitem" onclick="openSub('sub-vault')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="10" width="16" height="10" rx="2"/></svg><span>Vault</span></button>
        <button class="navitem" onclick="openDrawer()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg><span>More</span></button>
      </nav>"""

NAV_B = """
      <div class="hub-bar">
        <button class="hub-btn on" onclick="go('today')">Today</button>
        <button class="hub-btn" onclick="go('journal')">Journal</button>
        <button class="hub-btn" onclick="go('notes')">Notes</button>
        <button class="hub-btn" onclick="openSub('sub-vault')">Vault</button>
        <button class="hub-btn" onclick="openDrawer()">More</button>
      </div>"""

NAV_C = """
      <nav class="bottomnav bottomnav-4">
        <button class="navitem active" onclick="go('today')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></svg><span>Board</span></button>
        <button class="navitem" onclick="go('journal')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/></svg><span>Journal</span></button>
        <button class="navitem" onclick="openSub('sub-vault')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="10" width="16" height="10" rx="2"/></svg><span>Vault</span></button>
        <button class="navitem" onclick="openDrawer()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="1"/></svg><span>More</span></button>
      </nav>"""

NAV_D = """
      <div class="rail-actions-v3">
        <button class="btn btn-primary" style="flex:1" onclick="go('log')">Log</button>
        <button class="btn btn-soft" style="flex:1" onclick="go('focus')">Focus</button>
      </div>"""

NAV_E = """
      <div class="pulse-tabs-v3">
        <button class="on" onclick="go('today')">Today</button>
        <button onclick="openDrawer()">More</button>
      </div>"""

JS_A = """
const navScreens=['today','tasks','habits','journal','focus','log','notes','calendar','dashboard'];
function openPalette(){document.getElementById('cmdPalette')?.classList.add('show');document.getElementById('scrim')?.classList.add('show');}
function closePalette(){document.getElementById('cmdPalette')?.classList.remove('show');}
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openPalette();}});
"""

JS_B = """
const navScreens=['today','notes','tasks','journal','family'];
function chatSend(txt){const inp=document.getElementById('chatInp');const t=txt||inp?.value||'';if(!t)return;const th=document.getElementById('chatThread');th.insertAdjacentHTML('beforeend','<div class="msg me"><div class="ava">AU</div><div class="bubble">'+t.replace(/</g,'&lt;')+'</div></div>');if(inp)inp.value='';setTimeout(()=>{th.insertAdjacentHTML('beforeend','<div class="msg ai"><div class="ava">AI</div><div class="bubble">Filed to Today. Streak stays at 14.</div></div>');th.scrollTop=th.scrollHeight;toast('Logged');},480);th.scrollTop=th.scrollHeight;}
"""

JS_C = """
const navScreens=['today','journal','focus'];
let dragEl=null;
function dragCard(e){dragEl=e.target.closest('.board-card');e.dataTransfer.effectAllowed='move';}
function dropCard(e){e.preventDefault();if(!dragEl)return;e.currentTarget.appendChild(dragEl);dragEl=null;toast('Card moved');}
function setLayout(btn,mode){btn.parentElement.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));btn.classList.add('active');['board','list','focus'].forEach(m=>{const el=document.getElementById(m+'View');if(el)el.style.display=m===mode?'':'none';});}
"""

JS_D = """
const navScreens=['today','calendar','log','focus'];
"""

JS_E = """
const navScreens=['today','tasks','family'];
let zScale=1,panX=0,panY=0;
function zoomCanvas(d){zScale=Math.max(.7,Math.min(1.4,zScale+d));applyCanvas();}
function applyCanvas(){const c=document.getElementById('spatialCanvas');if(c)c.style.transform='translate('+panX+'px,'+panY+'px) scale('+zScale+')';}
function nodeTap(id){const m={work:'tasks',health:'habits',money:'dashboard',family:'family',you:'today'};if(m[id]==='habits')go('habits');else go(m[id]||'today');toast(id.charAt(0).toUpperCase()+id.slice(1));}
(function(){const w=document.getElementById('spatialWrap');if(!w)return;let sx,sy,ox,oy;w.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;ox=panX;oy=panY},{passive:true});w.addEventListener('touchmove',e=>{panX=ox+(e.touches[0].clientX-sx);panY=oy+(e.touches[0].clientY-sy);applyCanvas();},{passive:true});})();
"""

DIRS = {
    "prototype-a-mission-control.html": {
        "title": "A · Mission Control",
        "hint": "Direction A · Mission Control · ⌘K palette",
        "home": HOME_A,
        "nav": NAV_A,
        "js": JS_A,
        "cmd": True,
    },
    "prototype-b-ai-companion.html": {
        "title": "B · AI Companion",
        "hint": "Direction B · AI Companion · chat home",
        "home": HOME_B,
        "nav": NAV_B,
        "js": JS_B,
        "cmd": False,
    },
    "prototype-c-card-workspace.html": {
        "title": "C · Card Workspace",
        "hint": "Direction C · Card Workspace · drag board",
        "home": HOME_C,
        "nav": NAV_C,
        "js": JS_C,
        "cmd": False,
    },
    "prototype-d-timeline-os.html": {
        "title": "D · Timeline OS",
        "hint": "Direction D · Timeline OS · day spine",
        "home": HOME_D,
        "nav": NAV_D,
        "js": JS_D,
        "cmd": False,
    },
    "prototype-e-spatial-brain.html": {
        "title": "E · Spatial Brain",
        "hint": "Direction E · Spatial Brain · pan/zoom graph",
        "home": HOME_E,
        "nav": NAV_E,
        "js": JS_E,
        "cmd": False,
    },
}
