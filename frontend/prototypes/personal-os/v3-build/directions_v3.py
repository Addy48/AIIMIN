"""Per-direction home screens, nav, and interaction JS for v3 full mobile prototypes."""

HOME_A = """
        <section class="screen active" id="screen-today">
          <div class="page-head" style="display:flex;align-items:flex-end;justify-content:space-between">
            <div><div class="page-title">Mission Control</div><div class="page-sub">Sunday · Pro till 10 Aug 2026</div></div>
            <button class="icon-btn" onclick="openPalette()" title="Command palette"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg></button>
          </div>
          <div class="stat-grid" style="margin-top:4px">
            <div class="stat" onclick="toast('Life Score history')">
              <div class="ring"><svg width="56" height="56"><circle cx="28" cy="28" r="24" fill="none" stroke="var(--chart-track)" stroke-width="6"/><circle id="lsRing" cx="28" cy="28" r="24" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" stroke-dasharray="150.8" stroke-dashoffset="58"/></svg><span class="pct" id="lsPct">62</span></div>
              <div><div class="lbl">Life Score</div><div class="val">62</div><div class="cap">Up from 58</div></div>
            </div>
            <div class="stat"><div class="flame-stat">14</div><div><div class="lbl">Streak</div><div class="val">14</div><div class="cap">Days logged</div></div></div>
          </div>
          <div class="stat-grid" style="margin-top:14px">
            <div class="stat" onclick="go('tasks')"><div><div class="lbl">Tasks</div><div class="val">5<small>/8</small></div></div></div>
            <div class="stat" onclick="drawerGo('habits')"><div><div class="lbl">Habits</div><div class="val">5<small>/8</small></div></div></div>
            <div class="stat" onclick="drawerGo('focus')"><div><div class="lbl">Focus</div><div class="val">3h<small>45m</small></div></div></div>
            <div class="stat" onclick="openSub('sub-billing')"><div><div class="lbl">Spend</div><div class="val">73<small>%</small></div></div></div>
          </div>
          <div class="sec-head"><span class="sec-title">Execution window</span><span class="sec-link" onclick="go('calendar')">Calendar</span></div>
          <div class="card plan" id="planList">
            <div class="plan-row done" onclick="toggleTask(this)"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg></div><div class="plan-body"><div class="p-title">Morning review</div><div class="p-meta"><span class="p-tag tag-focus">Habit</span> Streak 14</div></div><div class="p-time">Done</div></div>
            <div class="plan-row" onclick="toggleTask(this)"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg></div><div class="plan-body"><div class="p-title">DSA Trees and Graphs</div><div class="p-meta"><span class="p-tag tag-work">Focus</span> 16:00 · 45 min</div></div><div class="p-time">16:00</div></div>
            <div class="plan-row" onclick="toggleTask(this)"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg></div><div class="plan-body"><div class="p-title">Sam call prep</div><div class="p-meta"><span class="p-tag tag-work">Career</span> Reports notes</div></div><div class="p-time">18:30</div></div>
            <div class="plan-row" onclick="openSub('sub-billing')"><div class="check"></div><div class="plan-body"><div class="p-title">Discipline check</div><div class="p-meta"><span class="p-tag tag-focus">Core</span> Locked · Day 9 pledge</div></div><div class="p-time">Core</div></div>
          </div>
          <div class="sec-head"><span class="sec-title">Quick jump</span></div>
          <div class="qa-grid">
            <button class="qa" onclick="drawerGo('journal')"><span class="ico ic-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></svg></span><span>Journal</span></button>
            <button class="qa" onclick="go('notes')"><span class="ico ic-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 4h14v16H5z"/></svg></span><span>Notes</span></button>
            <button class="qa" onclick="drawerSub('sub-vault')"><span class="ico ic-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="10" width="16" height="10" rx="2"/></svg></span><span>Vault</span></button>
            <button class="qa" onclick="openSub('sub-billing')"><span class="ico ic-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2"/></svg></span><span>Plans</span></button>
          </div>
          <p style="font-size:11px;color:var(--text-3);text-align:center;margin-top:16px">⌘K / Ctrl+K · command palette</p>
        </section>"""

NAV_A = """
      <nav class="bottomnav bottomnav-4">
        <button class="navitem active" data-screen="today" onclick="go('today')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg><span>Control</span></button>
        <button class="navitem" data-screen="tasks" onclick="go('tasks')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11l3 3L22 4"/></svg><span>Tasks</span></button>
        <button class="navitem" onclick="drawerSub('sub-vault')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="10" width="16" height="10" rx="2"/></svg><span>Vault</span></button>
        <button class="navitem" onclick="openDrawer()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg><span>More</span></button>
      </nav>"""

JS_A = """
const navScreens=['today','tasks'];
function openPalette(){document.getElementById('cmdPalette')?.classList.add('show');document.getElementById('scrim')?.classList.add('show');}
function closePalette(){document.getElementById('cmdPalette')?.classList.remove('show');}
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openPalette();}});
"""

HOME_B = """
        <section class="screen active" id="screen-today" style="display:flex;flex-direction:column;padding-bottom:0">
          <div class="page-head" style="padding-bottom:8px"><div class="page-title">Today</div><div class="page-sub">One screen. Every day.</div></div>
          <div class="chips" style="margin-bottom:12px">
            <button class="chip active" onclick="setChip(this)">Plan</button>
            <button class="chip" onclick="go('notes')">Notes</button>
            <button class="chip" onclick="openSub('sub-billing')">Finance</button>
            <button class="chip" onclick="openDrawer()">More</button>
          </div>
          <div class="card" style="flex:1;display:flex;flex-direction:column;min-height:0;margin-bottom:0;padding:0;overflow:hidden">
            <div style="flex:1;overflow-y:auto;padding:14px 16px" id="chatThread">
              <div class="msg ai"><div class="ava">AI</div><div class="bubble">Good afternoon, Aaditya. Life Score is 62. You have DSA at 16:00 and journal still open.</div></div>
              <div class="msg me"><div class="ava">AU</div><div class="bubble">Log morning review done. Snooze evening run.</div></div>
              <div class="msg ai"><div class="ava">AI</div><div class="bubble">Logged. Streak stays at 14. Run moved to tomorrow 06:30.</div></div>
            </div>
            <div class="ai-suggest" style="padding:8px 12px 0;flex-wrap:wrap">
              <button class="chip" onclick="chatSend('Plan my afternoon')">Plan afternoon</button>
              <button class="chip" onclick="drawerGo('journal')">Journal prompt</button>
              <button class="chip" onclick="go('tasks')">Show tasks</button>
            </div>
            <div class="ai-input" style="position:relative;bottom:0;margin:12px;border-radius:var(--r-md);border:1px solid var(--border)">
              <input id="chatInp" placeholder="Tell AIIMIN what to file…" onkeydown="if(event.key==='Enter')chatSend()"/>
              <button class="ai-send" onclick="chatSend()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12l16-8-6 16-2-6-8-2z"/></svg></button>
            </div>
          </div>
        </section>"""

NAV_B = """
      <div class="hub-bar">
        <button class="hub-btn on" onclick="go('today')">Today</button>
        <button class="hub-btn" onclick="drawerGo('journal')">Journal</button>
        <button class="hub-btn" onclick="go('notes')">Notes</button>
        <button class="hub-btn" onclick="drawerSub('sub-vault')">Vault</button>
        <button class="hub-btn" onclick="openDrawer()">More</button>
      </div>"""

JS_B = """
const navScreens=['today','notes','tasks','family'];
function chatSend(txt){const inp=document.getElementById('chatInp');const t=txt||inp?.value||'';if(!t)return;const th=document.getElementById('chatThread');th.insertAdjacentHTML('beforeend','<div class="msg me"><div class="ava">AU</div><div class="bubble">'+t.replace(/</g,'&lt;')+'</div></div>');if(inp)inp.value='';setTimeout(()=>{th.insertAdjacentHTML('beforeend','<div class="msg ai"><div class="ava">AI</div><div class="bubble">Filed to Today. Life Score +1.</div></div>');th.scrollTop=th.scrollHeight;toast('Logged');},500);th.scrollTop=th.scrollHeight;}
"""

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
            <div class="page-title" style="font-size:42px">25:00</div>
            <p style="color:var(--text-2);margin:12px 0 20px">DSA Trees and Graphs</p>
            <button class="btn btn-primary" onclick="toast('Focus started')">Start block</button>
          </div>
        </section>"""

NAV_C = """
      <nav class="bottomnav bottomnav-4">
        <button class="navitem active" onclick="go('today')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></svg><span>Board</span></button>
        <button class="navitem" onclick="drawerGo('journal')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/></svg><span>Journal</span></button>
        <button class="navitem" onclick="drawerSub('sub-vault')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="10" width="16" height="10" rx="2"/></svg><span>Vault</span></button>
        <button class="navitem" onclick="openDrawer()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="1"/></svg><span>More</span></button>
      </nav>"""

JS_C = """
const navScreens=['today'];
let dragEl=null;
function dragCard(e){dragEl=e.target.closest('.board-card');e.dataTransfer.effectAllowed='move';}
function dropCard(e){e.preventDefault();if(!dragEl)return;e.currentTarget.appendChild(dragEl);dragEl=null;toast('Card moved');}
function setLayout(btn,mode){btn.parentElement.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));btn.classList.add('active');['board','list','focus'].forEach(m=>{const el=document.getElementById(m+'View');if(el)el.style.display=m===mode?'':'none';});}
"""

HOME_D = """
        <section class="screen active" id="screen-today" style="padding-bottom:120px">
          <div class="timeline-nav">
            <button class="chip active">Flow</button>
            <button class="chip" onclick="go('calendar')">Week</button>
            <button class="chip" onclick="drawerSub('sub-notifications')">Inbox</button>
          </div>
          <div class="timeline-spine" id="timelineSpine">
            <div class="tl-now"><span class="pulse-dot"></span>Now · 13:42</div>
            <div class="tl-block done"><time>07:00</time><div class="tl-card"><b>Morning review</b><p>Habit · streak 14</p></div></div>
            <div class="tl-block done"><time>09:30</time><div class="tl-card"><b>AIIMIN auth review</b><p>Task completed</p></div></div>
            <div class="tl-block now"><time>16:00</time><div class="tl-card accent"><b>DSA Trees and Graphs</b><p>Focus · 45 min · Lab notes ready</p><button class="btn btn-primary" style="margin-top:10px;width:100%" onclick="toast('Focus started')">Start</button></div></div>
            <div class="tl-block"><time>18:30</time><div class="tl-card"><b>Sam call</b><p>Career · prep Reports</p></div></div>
            <div class="tl-block"><time>21:00</time><div class="tl-card"><b>Journal</b><p>What moved you today?</p></div></div>
            <div class="tl-block locked" onclick="openSub('sub-billing')"><time>—</time><div class="tl-card"><b>Discipline pledge</b><p>Core · Day 9 locked</p></div></div>
          </div>
        </section>"""

NAV_D = """
      <div class="rail-actions-v3">
        <button class="btn btn-primary" style="flex:1" onclick="drawerGo('log')">Log</button>
        <button class="btn btn-soft" style="flex:1" onclick="drawerGo('focus')">Focus</button>
      </div>"""

JS_D = """
const navScreens=['today','calendar'];
document.querySelector('.bottomnav')?.remove();
"""

HOME_E = """
        <section class="screen active" id="screen-today" style="padding:0;overflow:hidden">
          <div class="spatial-toolbar">
            <button class="icon-btn" onclick="zoomCanvas(-0.1)">−</button>
            <button class="icon-btn" onclick="zoomCanvas(0.1)">+</button>
            <span style="font-size:12px;color:var(--text-3);margin-left:auto">Pinch or drag canvas</span>
          </div>
          <div class="spatial-wrap" id="spatialWrap">
            <div class="spatial-canvas" id="spatialCanvas">
              <div class="s-node" style="left:50%;top:18%;transform:translate(-50%,-50%)" onclick="nodeTap('work')"><span>Work</span><small>DSA · Sam</small></div>
              <div class="s-node" style="left:22%;top:42%" onclick="nodeTap('health')"><span>Health</span><small>Run · Water</small></div>
              <div class="s-node" style="left:78%;top:44%" onclick="nodeTap('money')"><span>Money</span><small>73% budget</small></div>
              <div class="s-node" style="left:35%;top:72%" onclick="nodeTap('family')"><span>Family</span><small>4 members</small></div>
              <div class="s-node core" style="left:62%;top:68%" onclick="nodeTap('you')"><span>You</span><small>Score 62</small></div>
              <svg class="s-edges" viewBox="0 0 400 600"><path d="M200 100 L88 250 M200 100 L312 265 M200 100 L140 430 M200 100 L248 410" stroke="var(--accent-line)" fill="none" stroke-width="1.5" opacity=".5"/></svg>
            </div>
          </div>
          <div class="spatial-minimap"></div>
        </section>"""

NAV_E = """
      <div class="pulse-tabs-v3">
        <button class="on" onclick="go('today')">Today</button>
        <button onclick="openDrawer()">More</button>
      </div>"""

JS_E = """
const navScreens=['today'];
let zScale=1,panX=0,panY=0;
function zoomCanvas(d){zScale=Math.max(.7,Math.min(1.4,zScale+d));applyCanvas();}
function applyCanvas(){const c=document.getElementById('spatialCanvas');if(c)c.style.transform='translate('+panX+'px,'+panY+'px) scale('+zScale+')';}
function nodeTap(id){const map={work:'tasks',health:'habits',money:'finance',family:'family',you:'today'};if(map[id]==='habits')drawerGo('habits');else if(map[id])go(map[id]);toast(id.charAt(0).toUpperCase()+id.slice(1));}
(function(){const w=document.getElementById('spatialWrap');let sx,sy,ox,oy;w?.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;ox=panX;oy=panY});w?.addEventListener('touchmove',e=>{panX=ox+(e.touches[0].clientX-sx);panY=oy+(e.touches[0].clientY-sy);applyCanvas();});})();
document.querySelector('.bottomnav')?.remove();
"""

EXTRA_SCREENS = """
        <section class="screen" id="screen-habits">
          <div class="page-head"><div class="page-title">Habits</div><div class="page-sub">5 of 8 today · streak matrix</div></div>
          <div class="card plan">
            <div class="plan-row done" onclick="toggleTask(this)"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg></div><div class="plan-body"><div class="p-title">Morning review</div><div class="p-meta">Streak 14</div></div></div>
            <div class="plan-row done" onclick="toggleTask(this)"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg></div><div class="plan-body"><div class="p-title">Water 3L</div><div class="p-meta">Streak 9</div></div></div>
            <div class="plan-row" onclick="toggleTask(this)"><div class="check"></div><div class="plan-body"><div class="p-title">Evening run 5K</div><div class="p-meta">Streak 6</div></div></div>
            <div class="plan-row done" onclick="toggleTask(this)"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg></div><div class="plan-body"><div class="p-title">Code 2h · DSA</div><div class="p-meta">Streak 21</div></div></div>
          </div>
        </section>
        <section class="screen" id="screen-journal">
          <div class="page-head"><div class="page-title">Journal</div><div class="page-sub">Reflect mode</div></div>
          <div class="chips"><button class="chip active">Reflect</button><button class="chip">Gratitude</button><button class="chip">Free</button></div>
          <div class="card" style="padding:16px;margin-top:8px"><p style="color:var(--text-2);font-size:14px;margin-bottom:12px">What moved you today? What slowed you down?</p><textarea style="width:100%;min-height:120px;border:1px solid var(--border);border-radius:12px;padding:12px;background:var(--surface-2);color:var(--text-1);resize:none" placeholder="One honest paragraph…"></textarea><button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="toast('Journal saved')">Save entry</button></div>
        </section>
        <section class="screen" id="screen-focus">
          <div class="page-head"><div class="page-title">Focus</div><div class="page-sub">Pomodoro · 3h 45m today</div></div>
          <div class="card" style="padding:24px;text-align:center"><div style="font-family:var(--font-display);font-size:56px;font-weight:700" id="focusTimer">25:00</div><p style="margin:12px 0 20px;color:var(--text-2)">DSA Trees and Graphs</p><button class="btn btn-primary" onclick="startFocusV3()">Start session</button></div>
        </section>
        <section class="screen" id="screen-log">
          <div class="page-head"><div class="page-title">Daily Log</div><div class="page-sub">Sleep · mood · gym · water</div></div>
          <div class="card" style="padding:16px"><label class="sec-title">Sleep hours</label><input type="range" min="4" max="10" value="7" style="width:100%;accent-color:var(--accent)" onchange="toast('Sleep logged')"><div class="chips" style="margin-top:16px"><button class="chip active">Calm</button><button class="chip">Focused</button><button class="chip">Tired</button></div><button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="toast('Daily log saved')">Save log</button></div>
        </section>
"""

BILLING_SUB = """
      <div class="subscreen" id="sub-billing">
        <button class="back-btn" onclick="closeSub('sub-billing')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 6l-6 6 6 6"/></svg>Back</button>
        <div class="sub-head"><h2>Subscription</h2><p>Four tiers · founding rates</p></div>
        <div id="tierGrid"></div>
      </div>"""

CMD_PALETTE = """
    <div class="cmd-palette" id="cmdPalette">
      <input placeholder="Jump to…" id="cmdInp" oninput="filterCmd(this.value)"/>
      <div id="cmdList"></div>
    </div>"""

DIRS = {
    "aiimin-a-mission-control.html": {"title": "A · Mission Control", "home": HOME_A, "nav": NAV_A, "js": JS_A},
    "aiimin-b-companion.html": {"title": "B · Companion", "home": HOME_B, "nav": NAV_B, "js": JS_B},
    "aiimin-c-workspace.html": {"title": "C · Workspace", "home": HOME_C, "nav": NAV_C, "js": JS_C},
    "aiimin-d-timeline.html": {"title": "D · Timeline", "home": HOME_D, "nav": NAV_D, "js": JS_D},
    "aiimin-e-spatial.html": {"title": "E · Spatial", "home": HOME_E, "nav": NAV_E, "js": JS_E},
}
