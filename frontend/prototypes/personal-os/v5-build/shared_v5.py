"""Shared HTML/JS injected into all v5 opus forks."""

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
      <input placeholder="Jump to any screen…" id="cmdInp" oninput="filterCmd(this.value)"/>
      <div id="cmdList"></div>
    </div>"""

SHARED_JS = """
/* === V5 shared === */
const TIERS=[
  {id:'explore',name:'Explore',price:'₹0',note:'Forever free',badge:'',current:false,features:['Today hub','Basic habits','Journal']},
  {id:'core',name:'Core',price:'₹29/mo',note:'Complimentary at go-live for waitlist',badge:'Waitlist perk',current:false,features:['Full habits & goals','Finance basics','Focus room']},
  {id:'pro',name:'Pro',price:'₹59/mo',note:'Founding ₹49/mo × 12 months',badge:'Current plan',current:true,features:['AI insights','Discipline engine','Reports & patterns']},
  {id:'elite',name:'Elite',price:'₹99/mo',note:'Founding ₹79/mo × 12 months',badge:'',current:false,features:['Everything in Pro','Priority support','Early native features']}
];
const CMD_DEST=[
  {label:'Today',go:()=>go('today')},{label:'Tasks',go:()=>go('tasks')},{label:'Notes',go:()=>go('notes')},
  {label:'Calendar',go:()=>go('calendar')},{label:'Dashboard',go:()=>go('dashboard')},{label:'Habits',go:()=>go('habits')},
  {label:'Journal',go:()=>go('journal')},{label:'Focus',go:()=>go('focus')},{label:'Settings',go:()=>openSub('sub-settings')},
  {label:'Subscription',go:()=>openSub('sub-billing')},{label:'Vault',go:()=>openSub('sub-vault')}
];
function buildTiers(){
  const g=document.getElementById('tierGrid');if(!g)return;
  g.innerHTML=TIERS.map(t=>'<div class="tier-card'+(t.current?' current':'')+'">'+(t.badge?'<span class="badge">'+t.badge+'</span>':'')+'<h4>'+t.name+'</h4><div class="price">'+t.price+'</div><div class="note">'+t.note+'</div><ul>'+t.features.map(f=>'<li>'+f+'</li>').join('')+'</ul></div>').join('');
}
function filterCmd(q){
  q=(q||'').toLowerCase();
  const list=document.getElementById('cmdList');if(!list)return;
  list.innerHTML=CMD_DEST.filter(d=>d.label.toLowerCase().includes(q)).map(d=>'<div class="cmd-item" onclick="cmdJump(\\''+d.label+'\\')">'+d.label+'</div>').join('');
}
function cmdJump(label){const d=CMD_DEST.find(x=>x.label===label);closeAll();if(d)d.go();}
function renderCmdList(){filterCmd('');}
function startFocusV3(){toast('Focus session started');}
window.addEventListener('load',()=>{buildTiers();renderCmdList();});
"""
