"""Production-fidelity layer: onboarding, tour, sync, OS-ID, real logs."""

LOGO_MARK = """<svg class="logo-mark" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect width="512" height="512" rx="112" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-opacity="0.15" stroke-width="4"/>
  <path d="M80 384 C80 192 208 112 256 112 C304 112 432 192 432 384" stroke="currentColor" stroke-opacity="0.25" stroke-width="24" stroke-linecap="round"/>
  <path d="M144 384 L256 176 L368 384" stroke="currentColor" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M192 368 L256 272 L320 368" stroke="currentColor" stroke-opacity="0.55" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="256" cy="240" r="28" fill="#FF6B35"/>
</svg>"""

PROD_CSS = """
.prod-flows{position:absolute;inset:0;z-index:500;background:var(--bg);background-image:var(--bg-grad);}
.prod-flows .flow{position:absolute;inset:0;display:none;flex-direction:column;overflow-y:auto;padding:20px 20px 32px;}
.prod-flows .flow.active{display:flex;}
.ob-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.ob-skip{font-size:13px;font-weight:600;color:var(--text-3);padding:8px;}
.ob-progress{display:flex;gap:6px;justify-content:center;margin:16px 0 28px;}
.ob-progress i{height:8px;width:8px;border-radius:99px;background:var(--border);transition:all .28s var(--ease);}
.ob-progress i.on{width:28px;background:var(--accent);}
.ob-step{flex:1;display:flex;flex-direction:column;max-width:400px;margin:0 auto;width:100%}
.ob-step h2{font-family:var(--font-display);font-size:26px;font-weight:700;letter-spacing:-.02em;margin:0 0 8px;color:var(--text-1);}
.ob-step p.sub{font-size:14px;color:var(--text-2);line-height:1.5;margin:0 0 20px;}
.ob-field{width:100%;padding:14px 16px;border-radius:14px;border:1px solid var(--border);background:var(--surface);color:var(--text-1);font-size:16px;margin-bottom:12px;}
.ob-err{font-size:13px;color:#f43f5e;margin:0 0 12px;}
.osid-card{margin:12px 0;padding:14px 16px;border-radius:14px;border:1px dashed var(--accent-line);background:var(--accent-soft);}
.osid-card .lbl{font-size:10px;font-weight:700;letter-spacing:.14em;color:var(--text-3);text-transform:uppercase;}
.osid-card .val{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:22px;font-weight:700;color:var(--accent);margin-top:6px;letter-spacing:.06em;}
.osid-status{font-size:12px;font-weight:600;margin-top:6px;color:var(--done);}
.osid-status.checking{color:var(--text-3)}.osid-status.taken{color:#f43f5e}
.pin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:280px;margin:0 auto;}
.pin-key{height:58px;border-radius:14px;border:1px solid var(--border);background:var(--surface);font-size:20px;font-weight:700;}
.pin-dots{display:flex;gap:12px;justify-content:center;margin:20px 0 28px;}
.pin-dots i{width:14px;height:14px;border-radius:50%;border:2px solid var(--border);transition:all .15s;}
.pin-dots i.f{background:var(--accent);border-color:var(--accent);}
.pick-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
.pick-card{padding:14px;border-radius:14px;border:1px solid var(--border);background:var(--surface);text-align:left;font-size:13px;font-weight:600;color:var(--text-2);min-height:72px;}
.pick-card.on{border-color:var(--accent);background:var(--accent-soft);color:var(--accent);}
.persona-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
.persona-chip{padding:10px 14px;border-radius:999px;border:1px solid var(--border);font-size:12px;font-weight:700;color:var(--text-2);}
.persona-chip.on{background:var(--accent);border-color:var(--accent);color:#fff;}
.summary-card{padding:16px;border-radius:16px;border:1px solid var(--border);background:var(--surface);margin-bottom:12px;font-size:13px;line-height:1.6;color:var(--text-2);}
.summary-card b{color:var(--text-1)}
.splash-prod{
  align-items:center;justify-content:center;text-align:center;padding:0!important;overflow:hidden;
}
.splash-bg{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.splash-glow{
  position:absolute;left:50%;top:38%;width:min(92vw,360px);height:min(92vw,360px);
  transform:translate(-50%,-50%);
  background:radial-gradient(circle,rgba(255,107,53,.22) 0%,rgba(255,107,53,.06) 38%,transparent 68%);
  animation:splashBreath 3.2s ease-in-out infinite;
}
.splash-ring{
  position:absolute;left:50%;top:38%;width:168px;height:168px;transform:translate(-50%,-50%);
  border-radius:50%;border:1px solid rgba(255,107,53,.18);
  box-shadow:0 0 0 1px rgba(255,255,255,.03) inset;
  animation:splashRing 2.8s ease-in-out infinite;
}
.splash-grid{
  position:absolute;inset:0;opacity:.35;
  background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
  background-size:28px 28px;
  mask-image:radial-gradient(ellipse 70% 55% at 50% 38%,#000 20%,transparent 72%);
}
@keyframes splashBreath{0%,100%{opacity:.75;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}}
@keyframes splashRing{0%,100%{opacity:.45;transform:translate(-50%,-50%) scale(.96)}50%{opacity:.9;transform:translate(-50%,-50%) scale(1.04)}}
.splash-core{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:0;padding:0 28px;max-width:320px;}
.splash-logo-wrap{
  width:104px;height:104px;border-radius:28px;display:grid;place-items:center;
  background:linear-gradient(145deg,rgba(255,107,53,.14),rgba(255,255,255,.04));
  border:1px solid rgba(255,107,53,.22);box-shadow:0 20px 50px -20px rgba(255,107,53,.45);
  animation:splashLogoIn .7s cubic-bezier(.22,1,.36,1) both;
}
.splash-prod .logo-mark{width:72px;height:72px;color:var(--text-1);}
.splash-brand{margin-top:22px;animation:splashBrandIn .65s .12s cubic-bezier(.22,1,.36,1) both;}
.splash-prod .word{
  display:block;font-family:var(--font-display);font-size:42px;font-weight:800;
  letter-spacing:-.04em;line-height:1;
  background:linear-gradient(135deg,#ffb088 0%,#ff6b35 48%,#e85a28 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
}
.splash-prod .tag{
  display:block;margin-top:10px;font-size:10px;font-weight:700;letter-spacing:.28em;
  color:var(--text-3);text-transform:uppercase;
}
.splash-status{
  margin:18px 0 0;font-size:13px;font-weight:600;color:var(--text-2);min-height:20px;
  animation:splashBrandIn .5s .28s cubic-bezier(.22,1,.36,1) both;
}
.splash-progress{
  width:min(220px,72vw);height:3px;border-radius:99px;background:rgba(255,255,255,.06);
  margin-top:22px;overflow:hidden;animation:splashBrandIn .5s .36s cubic-bezier(.22,1,.36,1) both;
}
.splash-progress-bar{
  height:100%;width:0;border-radius:99px;
  background:linear-gradient(90deg,#ff8c5f,#ff6b35);
  box-shadow:0 0 12px rgba(255,107,53,.55);
  transition:width .12s linear;
}
.splash-skip{
  position:absolute;bottom:max(28px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);
  z-index:3;border:none;background:transparent;color:var(--text-3);font-size:12px;font-weight:600;
  letter-spacing:.04em;padding:10px 16px;opacity:0;animation:splashSkipIn .4s 1.1s ease both;
}
.splash-skip:active{color:var(--accent);transform:translateX(-50%) scale(.97);}
@keyframes splashLogoIn{from{opacity:0;transform:translateY(16px) scale(.92)}to{opacity:1;transform:none}}
@keyframes splashBrandIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes splashSkipIn{from{opacity:0}to{opacity:.85}}
.auth-hero{text-align:center;margin:40px 0 28px;animation:flowIn .45s var(--ease-out) both;}
.auth-logo{
  width:80px;height:80px;margin:0 auto 18px;border-radius:22px;display:grid;place-items:center;
  background:linear-gradient(145deg,rgba(255,107,53,.12),rgba(255,255,255,.03));
  border:1px solid rgba(255,107,53,.18);
}
.auth-hero h2{font-family:var(--font-display);font-size:26px;margin:0;letter-spacing:-.02em;}
.auth-hero p{color:var(--text-2);font-size:14px;margin-top:8px;line-height:1.45;}
.auth-btn{width:100%;margin-bottom:10px;}
.auth-field{margin-top:8px;}
.auth-field label{font-size:12px;font-weight:600;color:var(--text-3);}
.auth-field .inp{margin-top:6px;}
.auth-foot{text-align:center;margin-top:auto;font-size:12px;color:var(--text-3);padding:24px 0 8px;}
.sync-banner{display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:12px;font-weight:600;border-bottom:1px solid var(--border);flex-shrink:0;}
.sync-banner.syncing{background:rgba(255,107,53,.12);color:var(--accent);}
.sync-banner.ok{background:var(--surface-2);color:var(--text-3);}
.sync-banner.warn{background:rgba(250,204,21,.15);color:#ca8a04;}
.sync-banner .spin{width:14px;height:14px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.sync-panel{padding:14px 16px;border-radius:14px;border:1px solid var(--border);background:var(--surface);margin-bottom:14px;font-size:12px;color:var(--text-2);line-height:1.55;}
.sync-panel code{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent);word-break:break-all;}
.activity-sync{margin-top:8px;padding:12px 14px;border-radius:12px;background:var(--surface-2);border:1px solid var(--border);font-size:12px;color:var(--text-2);}
.ptour-invite{position:absolute;left:16px;right:16px;bottom:96px;z-index:180;background:var(--elevated);border:1px solid var(--border);border-radius:18px;padding:16px;box-shadow:var(--shadow-pop);}
.ptour-invite .k{font-size:10px;font-weight:700;letter-spacing:.12em;color:var(--accent);text-transform:uppercase;}
.ptour-invite h3{font-family:var(--font-display);font-size:17px;margin:6px 0;}
.ptour-invite p{font-size:13px;color:var(--text-2);line-height:1.45;margin:0 0 14px;}
.ptour-layer{position:absolute;inset:0;z-index:190;display:flex;align-items:flex-end;padding:16px 16px 100px;}
.ptour-scrim{position:absolute;inset:0;background:var(--scrim);border:none;}
.ptour-card{position:relative;width:100%;background:var(--elevated);border:1px solid var(--border);border-radius:18px;padding:18px;box-shadow:var(--shadow-pop);}
.ptour-meta{display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:var(--text-3);margin-bottom:10px;}
.ptour-progress{height:4px;background:var(--chart-track);border-radius:99px;margin-bottom:14px;overflow:hidden;}
.ptour-progress i{display:block;height:100%;background:var(--accent);border-radius:99px;transition:width .25s;}
"""

PRODUCTION_FLOWS = f"""
    <div class="prod-flows" id="prodFlows">
      <div class="flow active splash-prod" id="flow-splash" onclick="splashContinue(event)">
        <div class="splash-bg" aria-hidden="true">
          <div class="splash-glow"></div>
          <div class="splash-ring"></div>
          <div class="splash-grid"></div>
        </div>
        <div class="splash-core">
          <div class="splash-logo-wrap">{LOGO_MARK}</div>
          <div class="splash-brand">
            <span class="word">AIIMIN</span>
            <span class="tag">Personal OS</span>
          </div>
          <p class="splash-status" id="splashStatus">Human momentum, one device</p>
          <div class="splash-progress" aria-hidden="true"><div class="splash-progress-bar" id="splashBar"></div></div>
        </div>
        <button class="splash-skip" type="button" onclick="splashContinue(event)">Tap to continue</button>
      </div>

      <div class="flow" id="flow-auth">
        <div class="auth-hero">
          <div class="auth-logo">{LOGO_MARK.replace('class="logo-mark"','class="logo-mark" style="width:56px;height:56px"')}</div>
          <h2>Welcome back</h2>
          <p>Same account on web and native</p>
        </div>
        <button class="btn btn-primary auth-btn" onclick="startOnboarding()">Continue with Google</button>
        <div class="field auth-field">
          <label>OS-ID or email</label>
          <div class="inp"><input type="text" value="aaditya@aiimin.in" /></div>
        </div>
        <button class="btn btn-soft auth-btn" onclick="startOnboarding()">Sign in</button>
        <p class="auth-foot">Waitlist OS-ID carries over at launch</p>
      </div>

      <div class="flow" id="flow-onboarding">
        <div class="ob-top">
          <span style="font-size:12px;font-weight:700;color:var(--text-3)" id="obStepLabel">Step 1 of 10</span>
          <button class="ob-skip" type="button" onclick="skipOnboarding()">Skip</button>
        </div>
        <div class="ob-progress" id="obProgress"></div>
        <div class="ob-step" id="obStepHost"></div>
      </div>

      <div class="flow" id="flow-success" style="align-items:center;justify-content:center;text-align:center">
        <div style="width:72px;height:72px;border-radius:50%;background:var(--done-soft);color:var(--done);display:grid;place-items:center;margin-bottom:20px">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 style="font-family:var(--font-display);font-size:26px;margin:0 0 8px">You're in</h2>
        <p style="color:var(--text-2);font-size:14px;max-width:280px;line-height:1.5">Student mode applied. Habits and goals synced to your web Life OS.</p>
        <div class="osid-card" style="max-width:320px;width:100%;margin-top:20px">
          <div class="lbl">Your OS-ID</div>
          <div class="val" id="successOsid">AADITYA@</div>
        </div>
        <p style="font-size:12px;color:var(--text-3);margin-top:16px" id="successSync">Pulling bootstrap from api.aiimin.in…</p>
      </div>
    </div>
"""

SYNC_BANNER = """
      <div class="sync-banner ok" id="syncBanner">
        <span id="syncBannerText">Last synced just now · web + native</span>
        <button class="btn btn-soft" style="padding:6px 12px;font-size:11px;height:auto" onclick="simulateSync(true)">Sync</button>
      </div>"""

SYNC_SETTINGS_BLOCK = """
        <div class="dgroup" style="padding-left:2px">Data &amp; Sync</div>
        <div class="sync-panel" id="syncPanel">
          <div style="font-weight:700;color:var(--text-1);margin-bottom:8px">Mobile bootstrap</div>
          <div>Endpoint: <code>GET /api/mobile/bootstrap</code></div>
          <div style="margin-top:6px">syncCursor: <code id="syncCursorVal">—</code></div>
          <div>serverTime: <code id="serverTimeVal">—</code></div>
          <div style="margin-top:10px">Pending batch: <code id="outboxVal">0 ops</code></div>
          <div class="activity-sync" id="syncActivity">Native log → web Today appears within one sync cycle.</div>
          <button class="btn btn-soft" style="width:100%;margin-top:12px" onclick="simulateSync(true)">Retry sync</button>
        </div>"""

PRODUCT_TOUR_HTML = """
    <div class="ptour-invite" id="tourInvite" style="display:none">
      <div class="k">New here?</div>
      <h3>Eight stops. Real modules only.</h3>
      <p>Today → habits → journal → notes → discipline → focus → reports → account. Skip anytime.</p>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" style="flex:1" onclick="startProductTour()">Start tour</button>
        <button class="btn btn-soft" style="flex:1" onclick="dismissTourInvite()">Not now</button>
      </div>
    </div>
    <div class="ptour-layer" id="tourLayer" style="display:none">
      <button class="ptour-scrim" onclick="endTour(false)"></button>
      <div class="ptour-card">
        <div class="ptour-meta"><span id="tourChapter">Home base</span><span id="tourCount">1 / 8</span></div>
        <div class="ptour-progress"><i id="tourBar" style="width:12.5%"></i></div>
        <h3 id="tourTitle" style="font-family:var(--font-display);font-size:20px;margin:0 0 8px">Today is the hub</h3>
        <p id="tourBody" style="font-size:14px;color:var(--text-2);line-height:1.5;margin:0 0 16px"></p>
        <div style="display:flex;justify-content:space-between;gap:10px">
          <button class="btn btn-soft" onclick="endTour(true)">Skip</button>
          <div style="display:flex;gap:8px">
            <button class="btn btn-soft" id="tourBack" onclick="tourPrev()">Back</button>
            <button class="btn btn-primary" id="tourNext" onclick="tourNext()">Next</button>
          </div>
        </div>
      </div>
    </div>"""

PRODUCTION_JS = """
/* ========== Production onboarding (steps 0–10) ========== */
const OB_KEY='aiimin_onboarding_complete';
const TOUR_KEY='aiimin_tour_v2_completed';
const SYNC_KEY='aiimin_sync_state';
let obStep=0;
const OB_TOTAL=10;
const obState={
  name:'Aaditya Upadhyay', osid:'AADITYA@', pin:'', pin2:'',
  goals:['career','skills'], habits:['code','journal','water'],
  lifeArc:'Build Human Momentum — ship AIIMIN while staying healthy at MUJ.',
  wake:'07:00', persona:'student'
};
const GOALS=[
  {id:'career',label:'Land a Top Job'},{id:'health',label:'Get in Shape'},
  {id:'finance',label:'Financial Freedom'},{id:'skills',label:'Master New Skills'},
  {id:'peace',label:'Mental Peace'}
];
const HABITS=[
  {id:'workout',label:'Morning Workout'},{id:'read',label:'Read 10 Pages'},
  {id:'code',label:'Code / DSA'},{id:'journal',label:'Journaling'},
  {id:'meditate',label:'Meditation'},{id:'water',label:'Drink Water'}
];
const PERSONAS=[
  {id:'student',label:'Student'},{id:'professional',label:'Professional'},
  {id:'founder',label:'Founder'},{id:'family',label:'Family'},
  {id:'athlete',label:'Athlete'},{id:'custom',label:'Custom'}
];
const TOUR_STEPS=[
  {ch:'Home base',title:'Today is the hub',body:'Log the day, scan commitments, and jump into tools from one canvas.',go:'today'},
  {ch:'Consistency',title:'Habits compound',body:'Track routines you actually keep. Completions feed Later analytics.',go:'habits'},
  {ch:'Reflection',title:'Journal stays yours',body:'Capture mood and long-form without a second productivity cult.',go:'journal'},
  {ch:'Sources',title:'Notes = references',body:'PDFs, lecture paste, AIIMIN roadmap — link sources to habits.',go:'notes'},
  {ch:'Friction',title:'Urge surf, not streak shame',body:'Ride the timer and log outcome. Recovery tone only.',go:'discipline'},
  {ch:'Deep work',title:'Focus room',body:'Pomodoro blocks when you need locked-in DSA time.',go:'focus'},
  {ch:'Intelligence',title:'Reports + Patterns',body:'Period telemetry and behavioral patterns in one place.',go:'dashboard'},
  {ch:'You',title:'Account & restarts',body:'Plan and personalization live here. Restart tour anytime in Settings.',go:'profile'}
];
let tourIdx=0;
let syncState={cursor:'c_8f2a91',serverTime:null,pending:0,lastSync:Date.now()};

let splashTimer=null;
function showFlow(id){
  document.querySelectorAll('#prodFlows .flow').forEach(f=>f.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}
function splashContinue(e){
  if(e){e.stopPropagation();e.preventDefault();}
  if(splashTimer){clearInterval(splashTimer);splashTimer=null;}
  showFlow('flow-auth');
}
function runSplashSequence(){
  const bar=document.getElementById('splashBar');
  const status=document.getElementById('splashStatus');
  const lines=['Warming up your OS…','Loading your palette…','Ready'];
  let p=0;
  if(bar)bar.style.width='0%';
  splashTimer=setInterval(()=>{
    p+=4;
    if(bar)bar.style.width=Math.min(p,100)+'%';
    if(p===36&&status)status.textContent=lines[1];
    if(p===72&&status)status.textContent=lines[2];
    if(p>=100){clearInterval(splashTimer);splashTimer=null;showFlow('flow-auth');}
  },42);
}
function renderObProgress(){
  const el=document.getElementById('obProgress');
  if(!el)return;
  el.innerHTML=Array.from({length:OB_TOTAL},(_,i)=>'<i class="'+(i<=obStep?'on':'')+'"></i>').join('');
  const lbl=document.getElementById('obStepLabel');
  if(lbl)lbl.textContent='Step '+(obStep+1)+' of '+OB_TOTAL;
}
function obErr(msg){const h=document.getElementById('obStepHost');const e=h?.querySelector('.ob-err');if(e)e.textContent=msg||'';}
function renderObStep(){
  renderObProgress();
  const h=document.getElementById('obStepHost');
  if(!h)return;
  let html='';
  if(obStep===0){
    html='<h2>What\\'s your name?</h2><p class="sub">This appears on your dashboard and profile.</p><input class="ob-field" id="obName" value="'+obState.name+'" placeholder="Full name"><p class="ob-err"></p><button class="btn btn-primary" style="width:100%" onclick="obNext()">Continue</button>';
  } else if(obStep===1){
    html='<h2>Choose your OS-ID</h2><p class="sub">Exactly 8 characters. Login with OS-ID or email. Max 4 digits.</p><div class="osid-card"><div class="lbl">Reserved handle</div><input class="ob-field" id="obOsid" value="'+obState.osid+'" maxlength="8" style="font-family:JetBrains Mono,monospace;text-transform:uppercase" oninput="checkOsidLive()"><div class="osid-status available" id="osidStatus">AADITYA@ available (waitlist reserved)</div></div><p class="ob-err"></p><button class="btn btn-primary" style="width:100%" onclick="obNext()">Continue</button>';
  } else if(obStep===2){
    html='<h2>Set device PIN</h2><p class="sub">6 digits for quick unlock on this phone.</p><div class="pin-dots" id="pinDots">'+Array(6).fill('<i></i>').join('')+'</div><div class="pin-grid">'+['1','2','3','4','5','6','7','8','9','','0','Del'].map(k=>'<button type="button" class="pin-key" onclick="pinTap(\\''+k+'\\')">'+(k||'')+'</button>').join('')+'</div><p class="ob-err"></p>';
  } else if(obStep===3){
    html='<h2>Confirm PIN</h2><p class="sub">Re-enter the same 6 digits.</p><div class="pin-dots" id="pinDots2">'+Array(6).fill('<i></i>').join('')+'</div><div class="pin-grid">'+['1','2','3','4','5','6','7','8','9','','0','Del'].map(k=>'<button type="button" class="pin-key" onclick="pinTap2(\\''+k+'\\')">'+(k||'')+'</button>').join('')+'</div><p class="ob-err"></p>';
  } else if(obStep===4){
    html='<h2>What are you building toward?</h2><p class="sub">Pick at least one goal.</p><div class="pick-grid">'+GOALS.map(g=>'<button type="button" class="pick-card'+(obState.goals.includes(g.id)?' on':'')+'" onclick="toggleGoal(\\''+g.id+'\\')">'+g.label+'</button>').join('')+'</div><p class="ob-err"></p><button class="btn btn-primary" style="width:100%" onclick="obNext()">Continue</button>';
  } else if(obStep===5){
    html='<h2>Life Arc</h2><p class="sub">Your North Star sentence — mandatory in production.</p><textarea class="ob-field" id="obArc" rows="4" style="resize:none">'+obState.lifeArc+'</textarea><p class="ob-err"></p><button class="btn btn-primary" style="width:100%" onclick="obNext()">Continue</button>';
  } else if(obStep===6){
    html='<h2>Starter habits</h2><p class="sub">We\\'ll create these on web + native.</p><div class="pick-grid">'+HABITS.map(g=>'<button type="button" class="pick-card'+(obState.habits.includes(g.id)?' on':'')+'" onclick="toggleHabitOb(\\''+g.id+'\\')">'+g.label+'</button>').join('')+'</div><p class="ob-err"></p><button class="btn btn-primary" style="width:100%" onclick="obNext()">Continue</button>';
  } else if(obStep===7){
    html='<h2>Wake time</h2><p class="sub">Default 07:00 — used for morning loop.</p><input class="ob-field" type="time" id="obWake" value="'+obState.wake+'"><p class="ob-err"></p><button class="btn btn-primary" style="width:100%" onclick="obNext()">Continue</button>';
  } else if(obStep===8){
    html='<h2>Life mode</h2><p class="sub">Pins your nav preset on web.</p><div class="persona-row">'+PERSONAS.map(p=>'<button type="button" class="persona-chip'+(obState.persona===p.id?' on':'')+'" onclick="pickPersona(\\''+p.id+'\\')">'+p.label+'</button>').join('')+'</div><p class="ob-err"></p><button class="btn btn-primary" style="width:100%" onclick="obNext()">Continue</button>';
  } else if(obStep===9){
    html='<h2>Ready to commit</h2><p class="sub">Summary before we sync your account.</p><div class="summary-card"><b>'+obState.name+'</b><br>OS-ID <code style="font-family:JetBrains Mono">'+obState.osid+'</code><br>Life Arc: '+obState.lifeArc+'<br>Goals: '+obState.goals.length+' · Habits: '+obState.habits.length+'<br>Wake '+obState.wake+' · '+obState.persona+' mode</div><p class="ob-err"></p><button class="btn btn-primary" style="width:100%" onclick="finishOnboarding()">Complete setup</button>';
  }
  h.innerHTML=html;
}
function checkOsidLive(){
  const v=(document.getElementById('obOsid')?.value||'').toUpperCase();
  obState.osid=v;
  const st=document.getElementById('osidStatus');
  if(!st)return;
  if(v.length!==8){st.textContent='Need exactly 8 characters';st.className='osid-status checking';return;}
  if((v.match(/[0-9]/g)||[]).length>4){st.textContent='Max 4 digits';st.className='osid-status taken';return;}
  st.textContent=v==='AADITYA@'?'AADITYA@ available (waitlist reserved)':'Checking availability…';
  st.className='osid-status checking';
  setTimeout(()=>{if(st&&v.length===8&&v!=='TAKEN__'){st.textContent=v+' available';st.className='osid-status available';}},400);
}
let pinBuf='',pinBuf2='';
function pinTap(k){if(k==='Del')pinBuf=pinBuf.slice(0,-1);else if(k&&pinBuf.length<6)pinBuf+=k;document.querySelectorAll('#pinDots i').forEach((d,i)=>d.classList.toggle('f',i<pinBuf.length));if(pinBuf.length===6){obState.pin=pinBuf;setTimeout(()=>{obStep++;renderObStep();},200);}}
function pinTap2(k){if(k==='Del')pinBuf2=pinBuf2.slice(0,-1);else if(k&&pinBuf2.length<6)pinBuf2+=k;document.querySelectorAll('#pinDots2 i').forEach((d,i)=>d.classList.toggle('f',i<pinBuf2.length));if(pinBuf2.length===6){if(pinBuf2!==obState.pin){obErr('PINs do not match');pinBuf2='';document.querySelectorAll('#pinDots2 i').forEach(d=>d.classList.remove('f'));return;}setTimeout(()=>{obStep++;renderObStep();},200);}}
function toggleGoal(id){obState.goals=obState.goals.includes(id)?obState.goals.filter(x=>x!==id):[...obState.goals,id];renderObStep();}
function toggleHabitOb(id){obState.habits=obState.habits.includes(id)?obState.habits.filter(x=>x!==id):[...obState.habits,id];renderObStep();}
function pickPersona(id){obState.persona=id;renderObStep();}
function obNext(){
  obErr('');
  if(obStep===0){obState.name=document.getElementById('obName')?.value.trim()||'';if(!obState.name){obErr('Please enter your name');return;}}
  if(obStep===1){const v=(document.getElementById('obOsid')?.value||'').toUpperCase();if(v.length!==8){obErr('OS-ID must be exactly 8 characters');return;}obState.osid=v;}
  if(obStep===4&&obState.goals.length<1){obErr('Select at least one goal');return;}
  if(obStep===5){obState.lifeArc=document.getElementById('obArc')?.value.trim()||'';if(obState.lifeArc.length<8){obErr('Set your Life Arc — at least a short sentence.');return;}}
  if(obStep===6&&obState.habits.length<1){obErr('Select at least one habit');return;}
  if(obStep===7){obState.wake=document.getElementById('obWake')?.value||'07:00';}
  if(obStep===8&&!obState.persona){obErr('Pick a life mode');return;}
  if(obStep<OB_TOTAL-1){obStep++;renderObStep();}
}
function startOnboarding(){showFlow('flow-onboarding');obStep=0;pinBuf='';pinBuf2='';renderObStep();}
function skipOnboarding(){sessionStorage.setItem('aiimin_onb','1');localStorage.setItem(OB_KEY,'true');finishOnboarding(true);}
function finishOnboarding(skipped){
  sessionStorage.setItem('aiimin_onb','1');
  localStorage.setItem(OB_KEY,'true');
  document.getElementById('successOsid').textContent=obState.osid;
  showFlow('flow-success');
  simulateBootstrap().then(()=>{
    setTimeout(()=>{
      document.getElementById('prodFlows').style.display='none';
      enterAppProduction();
      if(!skipped&&!localStorage.getItem(TOUR_KEY))setTimeout(()=>{document.getElementById('tourInvite').style.display='block';},1200);
    },skipped?400:1800);
  });
}
async function simulateBootstrap(){
  const el=document.getElementById('successSync');
  if(el)el.textContent='GET /api/mobile/bootstrap…';
  setSyncBanner('syncing','Syncing with your account…');
  await new Promise(r=>setTimeout(r,900));
  syncState.cursor='c_'+Math.random().toString(16).slice(2,10);
  syncState.serverTime=new Date().toISOString();
  syncState.lastSync=Date.now();
  localStorage.setItem(SYNC_KEY,JSON.stringify(syncState));
  updateSyncPanel();
  if(el)el.textContent='Bootstrap OK · Life Score 62 · 5/8 habits';
  setSyncBanner('ok','Last synced just now · same user_id as web');
  appendSyncActivity('Bootstrap pulled profile, today summary, habit strip.');
}
function enterAppProduction(){
  ['splash','onboarding','auth'].forEach(x=>{const e=document.getElementById(x);if(e)e.classList.remove('active');});
  document.getElementById('app')?.classList.add('active');
  if(typeof go==='function')go('today');
  injectOsidEverywhere();
}
function injectOsidEverywhere(){
  document.querySelectorAll('.drawer-head .em').forEach(e=>{e.innerHTML='aaditya@aiimin.in<br><span class="osid">OS-ID '+obState.osid+'</span>';});
  const ph=document.querySelector('.profile-hero .em');if(ph)ph.innerHTML='aaditya@aiimin.in · Pro · till 10 Aug 2026<div class="osid">OS-ID '+obState.osid+'</div>';
}
function setSyncBanner(mode,text){
  const b=document.getElementById('syncBanner');const t=document.getElementById('syncBannerText');
  if(!b||!t)return;
  b.className='sync-banner '+mode;
  t.textContent=text;
  b.querySelector('.spin')?.remove();
  if(mode==='syncing')b.insertAdjacentHTML('afterbegin','<span class="spin"></span>');
}
function updateSyncPanel(){
  const c=document.getElementById('syncCursorVal');if(c)c.textContent=syncState.cursor||'—';
  const s=document.getElementById('serverTimeVal');if(s)s.textContent=syncState.serverTime||'—';
  const o=document.getElementById('outboxVal');if(o)o.textContent=syncState.pending+' ops';
}
function appendSyncActivity(msg){
  const a=document.getElementById('syncActivity');
  if(a)a.innerHTML='<div style="margin-bottom:6px;color:var(--done)">'+new Date().toLocaleTimeString()+' · '+msg+'</div>'+a.innerHTML;
}
async function simulateSync(manual){
  setSyncBanner('syncing','Syncing with your account…');
  if(manual)syncState.pending=Math.max(0,syncState.pending-1);
  await new Promise(r=>setTimeout(r,700));
  syncState.lastSync=Date.now();
  syncState.cursor='c_'+Math.random().toString(16).slice(2,10);
  syncState.serverTime=new Date().toISOString();
  localStorage.setItem(SYNC_KEY,JSON.stringify(syncState));
  updateSyncPanel();
  setSyncBanner('ok','Last synced just now · web Today updated');
  appendSyncActivity(manual?'Batch POST /api/mobile/sync/batch applied.':'Background sync complete.');
  toast('Synced with web Life OS');
}
function queueNativeLog(label){
  syncState.pending=(syncState.pending||0)+1;
  updateSyncPanel();
  setSyncBanner('warn',syncState.pending+' change(s) queued — will sync when online');
  appendSyncActivity('Queued: '+label);
  setTimeout(()=>simulateSync(false),1500);
}
/* Product tour */
function startProductTour(){document.getElementById('tourInvite').style.display='none';tourIdx=0;renderTour();document.getElementById('tourLayer').style.display='flex';localStorage.setItem(TOUR_KEY,'dismissed');}
function dismissTourInvite(){document.getElementById('tourInvite').style.display='none';localStorage.setItem(TOUR_KEY,'dismissed');}
function renderTour(){
  const s=TOUR_STEPS[tourIdx];
  document.getElementById('tourChapter').textContent=s.ch;
  document.getElementById('tourCount').textContent=(tourIdx+1)+' / '+TOUR_STEPS.length;
  document.getElementById('tourTitle').textContent=s.title;
  document.getElementById('tourBody').textContent=s.body;
  document.getElementById('tourBar').style.width=((tourIdx+1)/TOUR_STEPS.length*100)+'%';
  document.getElementById('tourBack').style.visibility=tourIdx>0?'visible':'hidden';
  document.getElementById('tourNext').textContent=tourIdx===TOUR_STEPS.length-1?'Finish':'Next';
  if(s.go==='profile')openSub('sub-profile');
  else if(s.go==='discipline')toast('Discipline opens on web — native shows recovery tone');
  else if(s.go==='habits'||s.go==='journal'||s.go==='focus'){if(typeof drawerGo==='function')drawerGo(s.go);else if(typeof go==='function')go(s.go==='habits'?'today':s.go);}
  else if(typeof go==='function')go(s.go);
}
function tourNext(){if(tourIdx<TOUR_STEPS.length-1){tourIdx++;renderTour();}else endTour(true);}
function tourPrev(){if(tourIdx>0){tourIdx--;renderTour();}}
function endTour(done){document.getElementById('tourLayer').style.display='none';localStorage.setItem(TOUR_KEY,done?'true':'dismissed');toast(done?'Tour complete':'Tour dismissed');}
/* Boot override */
(function patchBoot(){
  const origLoad=window.onload;
  window.addEventListener('load',()=>{
    try{const s=JSON.parse(localStorage.getItem(SYNC_KEY)||'null');if(s)syncState={...syncState,...s};}catch(e){}
    updateSyncPanel();
    if(localStorage.getItem(OB_KEY)==='true'||sessionStorage.getItem('aiimin_onb')==='1'){
      document.getElementById('prodFlows').style.display='none';
      document.getElementById('app')?.classList.add('active');
      injectOsidEverywhere();
      updateSyncPanel();
      setSyncBanner('ok','Last synced just now · web + native');
      if(typeof go==='function')go('today');
    } else {
      runSplashSequence();
    }
    renderObStep();
  });
})();
const _toggleTaskOrig=typeof toggleTask==='function'?toggleTask:null;
function toggleTask(row){if(_toggleTaskOrig)_toggleTaskOrig(row);if(row.classList.contains('done'))queueNativeLog('Task completed on native');}
const _doSaveWrap=()=>{const b=document.querySelector('[onclick*="toast(\\'Journal saved\\')"]');/* noop hook */};
"""

REAL_ACTIVITY_ROWS = """
            <div class="row" onclick="toast('Synced from native · 2m ago')">
              <div class="thumb ic-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12h16M4 6h8"/></svg></div>
              <div class="row-body"><div class="row-title">Morning review logged</div><div class="row-meta">Native → web Today · sync batch</div></div>
            </div>
            <div class="row">
              <div class="thumb ic-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 4h14v16H5z"/></svg></div>
              <div class="row-body"><div class="row-title">AIIMIN Product Roadmap</div><div class="row-meta">Note · updated 2h ago</div></div>
            </div>
            <div class="row">
              <div class="thumb ic-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4M12 18v4"/></svg></div>
              <div class="row-body"><div class="row-title">Swiggy · Rs 340</div><div class="row-meta">Finance · yesterday · Food</div></div>
            </div>
            <div class="row">
              <div class="thumb ic-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/></svg></div>
              <div class="row-body"><div class="row-title">DSA Trees and Graphs</div><div class="row-meta">Focus block · 16:00 · 45 min</div></div>
            </div>
"""

REAL_FINANCE_TXNS = """
            <div class="row"><div class="thumb ic-orange"><span style="font-size:10px;font-weight:800">FD</span></div><div class="row-body"><div class="row-title">Swiggy order</div><div class="row-meta">Yesterday · Food</div></div><div class="row-right" style="color:var(--text-1)">-Rs 340</div></div>
            <div class="row"><div class="thumb ic-green"><span style="font-size:10px;font-weight:800">GR</span></div><div class="row-body"><div class="row-title">DMart groceries</div><div class="row-meta">Jul 17 · Grocery</div></div><div class="row-right">-Rs 1,240</div></div>
            <div class="row"><div class="thumb ic-amber"><span style="font-size:10px;font-weight:800">ED</span></div><div class="row-body"><div class="row-title">Udemy — System Design</div><div class="row-meta">Jul 16 · Education</div></div><div class="row-right">-Rs 799</div></div>
            <div class="row"><div class="thumb ic-blue"><span style="font-size:10px;font-weight:800">TR</span></div><div class="row-body"><div class="row-title">Ola cab · MUJ campus</div><div class="row-meta">Jul 15 · Transport</div></div><div class="row-right">-Rs 180</div></div>
"""
