"""Direction-specific HTML/JS for 5 native prototypes."""
from generate import shell, OUT

STACK_CSS = """
.stack-home{position:absolute;inset:0;display:flex;flex-direction:column;padding:0 16px 16px}
.stack-card{flex:1;background:var(--sf);border:1px solid var(--br);border-radius:20px;margin-top:8px;display:flex;flex-direction:column;padding:20px;box-shadow:var(--cs);touch-action:none;user-select:none;position:relative}
.stack-pips{display:flex;gap:6px;justify-content:center;padding:12px 0}
.stack-pips i{width:8px;height:8px;border-radius:50%;background:var(--br)}
.stack-pips i.on{background:var(--brand);width:20px;border-radius:4px}
.stack-actions{display:flex;gap:10px;margin-top:auto}
.stack-actions .btn{flex:1}
.stack-flame{position:absolute;top:16px;right:16px;font-size:12px;font-weight:800;color:var(--brand);display:flex;align-items:center;gap:4px}
.stack-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}
"""

STACK_HOME = """
<div class="sc on" id="sc-home"><div class="stack-home">
<div style="display:flex;align-items:center;justify-content:space-between;padding-top:4px"><div><div class="sl">Stack</div><div style="font-family:var(--FD);font-size:20px;font-weight:800">Good morning, Aaditya</div></div><span class="b bo">Pro · till 10 Aug 2026</span></div>
<div class="stack-pips" id="stackPips"></div>
<div class="stack-card" id="stackCard"></div>
<div class="stack-actions"><button class="btn" onclick="stackLater()">Later</button><button class="btn primary" onclick="stackDone()">Done</button></div>
</div></div>
<div class="sc" id="sc-more"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">More</div></div>
<div class="c"><div class="tr" onclick="goto('habits')"><div class="tri"><div class="trn">Habits</div></div></div>
<div class="tr" onclick="goto('journal')"><div class="tri"><div class="trn">Journal</div></div></div>
<div class="tr" onclick="goto('focus')"><div class="tri"><div class="trn">Focus stats</div></div></div>
<div class="tr" onclick="goto('discipline')"><div class="tri"><div class="trn">Discipline</div><div class="trm">Core</div></div></div>
<div class="tr" onclick="goto('goals')"><div class="tri"><div class="trn">Goals</div></div></div>
<div class="tr" onclick="goto('finance')"><div class="tri"><div class="trn">Finance</div></div></div>
<div class="tr" onclick="goto('family')"><div class="tri"><div class="trn">Family</div></div></div>
<div class="tr" onclick="goto('reports')"><div class="tri"><div class="trn">Reports</div></div></div>
<div class="tr" onclick="goto('calendar')"><div class="tri"><div class="trn">Calendar</div></div></div>
<div class="tr" onclick="goto('career')"><div class="tri"><div class="trn">Career</div></div></div>
<div class="tr" onclick="goto('sports')"><div class="tri"><div class="trn">Sports</div></div></div>
<div class="tr" onclick="goto('lab')"><div class="tri"><div class="trn">Lab</div></div></div>
<div class="tr" onclick="goto('settings')"><div class="tri"><div class="trn">Settings</div></div></div>
<div class="tr" onclick="openSheet('<div class=shtit>Universal Logger</div><textarea id=logText style=width:100%;height:100px;background:var(--el);border:1px solid var(--br);border-radius:12px;padding:12px;color:var(--t1) placeholder=ran 5km></textarea><button class=btn primary style=width:100%;margin-top:12px onclick=routeLog()>File entry</button>')"><div class="tri"><div class="trn">Quick capture</div></div></div></div></div>
"""

STACK_NAV = """
<div class="bn"><div class="ni on" id="ni-home" onclick="goto('home')"><div class="niw"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg></div><span>Stack</span></div>
<div class="ni" id="ni-vault" onclick="goto('vault')"><div class="niw"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div><span>Vault</span></div>
<div class="ni" id="ni-more" onclick="goto('more')"><div class="niw"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></div><span>More</span></div></div>
"""

STACK_JS = r"""
let stackItems=[
 {id:'life',t:'Life Score',b:'62 today, up from 58 yesterday.',locked:false,type:'score'},
 {id:'habit',t:'Morning review',b:'Tick before your first meeting.',locked:false,type:'habit',streak:14},
 {id:'focus',t:'DSA Trees and Graphs',b:'Focus block at 16:00 · 45 min',locked:false,type:'focus'},
 {id:'journal',t:'Journal prompt',b:'What moved you today?',locked:false,type:'journal'},
 {id:'disc',t:'Discipline check',b:'14-day pledge · day 9',locked:true,type:'discipline'}
],stackIdx=0;
function bootHome(){loadStack();renderStack()}
function loadStack(){const s=localStorage.getItem(NS+'-stack');if(s){try{stackItems=JSON.parse(s)}catch(e){}}}
function saveStack(){localStorage.setItem(NS+'-stack',JSON.stringify(stackItems))}
function renderStack(){
 const left=stackItems.filter(x=>!x.done);
 if(!left.length){document.getElementById('stackCard').innerHTML='<div class="stack-empty">'+ringHTML(lifeScore)+'<h2 style="font-family:var(--FD);margin-top:16px">All done</h2><p style="color:var(--t2);font-size:13px;margin-top:8px">Stack cleared. Discipline tracking needs Core.</p><button class="btn" style="margin-top:16px" onclick="openUpgrade()">Unlock Core</button></div>';document.getElementById('stackPips').innerHTML='';return}
 const c=left[0];
 document.getElementById('stackPips').innerHTML=left.map((_,i)=>'<i class="'+(i===0?'on':'')+'"></i>').join('');
 let inner=ringHTML(lifeScore)+'<div style="margin-top:16px"><div class="sl">'+c.t+'</div><h2 style="font-family:var(--FD);font-size:22px;margin:8px 0">'+c.b+'</h2></div>';
 if(c.streak)inner+='<div class="stack-flame"><svg width="14" height="14" stroke="var(--brand)" fill="none"><path d="M12 2c1 3 4 4 4 8a4 4 0 01-8 0c0-2 2-3 4-5z"/></svg>'+c.streak+'</div>';
 if(c.locked)inner+='<div class="lock-box" style="margin-top:auto"><span class="b bo">Core</span><button class="btn primary sm" onclick="openUpgrade()">Unlock in Core</button></div>';
 document.getElementById('stackCard').innerHTML=inner;
 if(c.locked){document.querySelector('.stack-actions').innerHTML='<button class="btn primary" style="width:100%" onclick="openUpgrade()">Unlock in Core</button>'}
 else document.querySelector('.stack-actions').innerHTML='<button class="btn" onclick="stackLater()">Later</button><button class="btn primary" onclick="stackDone()">Done</button>';
 setupSwipe();
}
function stackDone(){const left=stackItems.filter(x=>!x.done);if(!left.length)return;if(left[0].locked){openUpgrade();return}left[0].done=true;lifeScore=Math.min(98,lifeScore+2);saveStack();toast('Done');renderStack()}
function stackLater(){const i=stackItems.findIndex(x=>!x.done);if(i<0)return;const[it]=stackItems.splice(i,1);stackItems.push(it);saveStack();toast('Snoozed to later');renderStack()}
function setupSwipe(){const card=document.getElementById('stackCard');let sy=0;card.ontouchstart=e=>{sy=e.touches[0].clientY};card.ontouchend=e=>{const dy=e.changedTouches[0].clientY-sy;if(dy<-50)stackDone();if(dy>50)stackLater()}}
"""

STRIP_CSS = """
.strip-score{padding:12px 16px;display:flex;align-items:center;gap:14px;cursor:pointer}
.strip{border-top:1px solid var(--brs);padding:12px 16px}
.strip-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;cursor:pointer;min-height:44px}
.strip-h svg{width:16px;height:16px;stroke:var(--t3);fill:none}
.hab-pills{display:flex;gap:8px;overflow-x:auto;padding:4px 0}
.hpill{height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--br);background:var(--el);font-size:12px;font-weight:700;white-space:nowrap;flex-shrink:0}
.hpill.on{background:var(--brand);border-color:var(--brand);color:#fff}
.spark{display:flex;gap:3px;align-items:flex-end;height:32px;margin-top:6px}
.spark i{flex:1;background:var(--brand);border-radius:2px;opacity:.7}
.strip.lock{opacity:.55;position:relative}
"""

STRIP_HOME = """
<div class="sc on" id="sc-home">
<div class="strip-score" onclick="toast('Life Score history')"><span id="stripRing"></span><div><div class="sl">Life Score</div><div style="font-family:var(--FD);font-size:18px;font-weight:800">62 · streak 14</div><div style="font-size:12px;color:var(--t3)">Up from 58 yesterday</div></div></div>
<div class="c" style="margin-top:0">
<div class="strip"><div class="strip-h" onclick="goto('habits')"><span class="sl">Habits</span><svg viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg></div>
<div class="hab-pills"><button class="hpill on" onclick="toggleHp(this)">Review</button><button class="hpill on" onclick="toggleHp(this)">Water</button><button class="hpill" onclick="toggleHp(this)">Run</button><button class="hpill on" onclick="toggleHp(this)">Code</button><button class="hpill" onclick="toggleHp(this)">Read</button></div></div>
<div class="strip"><div class="strip-h" onclick="goto('focus')"><span class="sl">Focus</span><svg viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg></div><div style="font-size:14px;font-weight:700">3h 45m today</div><div class="spark"><i style="height:40%"></i><i style="height:65%"></i><i style="height:50%"></i><i style="height:80%"></i><i style="height:55%"></i><i style="height:70%"></i><i style="height:45%"></i></div></div>
<div class="strip lock" onclick="openUpgrade()"><div class="strip-h"><span class="sl">Discipline · Core</span><span class="b bo">Locked</span></div><div style="filter:blur(4px);font-size:14px">████████ streak</div></div>
<div class="strip"><div class="strip-h" onclick="goto('journal')"><span class="sl">Journal</span><svg viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg></div><div style="font-size:13px;color:var(--t2)">What moved you today?</div></div>
</div>
<button class="btn primary" style="margin:12px 16px;width:calc(100% - 32px)" onclick="openSheet('<div class=shtit>Universal Logger</div><textarea id=logText style=width:100%;height:90px;background:var(--el);border:1px solid var(--br);border-radius:12px;padding:12px;color:var(--t1)></textarea><button class=btn primary style=width:100%;margin-top:12px onclick=routeLog()>File entry</button>')">Quick capture</button>
</div>
<div class="sc" id="sc-more"><div class="ph"><div class="pht">More</div></div>
<div class="c"><div class="tr" onclick="goto('goals')"><div class="tri"><div class="trn">Goals</div></div></div>
<div class="tr" onclick="goto('finance')"><div class="tri"><div class="trn">Finance</div></div></div>
<div class="tr" onclick="goto('family')"><div class="tri"><div class="trn">Family</div></div></div>
<div class="tr" onclick="goto('reports')"><div class="tri"><div class="trn">Reports</div></div></div>
<div class="tr" onclick="goto('calendar')"><div class="tri"><div class="trn">Calendar</div></div></div>
<div class="tr" onclick="goto('career')"><div class="tri"><div class="trn">Career</div></div></div>
<div class="tr" onclick="goto('sports')"><div class="tri"><div class="trn">Sports</div></div></div>
<div class="tr" onclick="goto('lab')"><div class="tri"><div class="trn">Lab</div></div></div>
<div class="tr" onclick="goto('settings')"><div class="tri"><div class="trn">Settings</div></div></div>
<div class="tr" onclick="goto('profile')"><div class="tri"><div class="trn">Account · OS-ID AADITYA8</div></div></div></div></div>
"""

STRIP_NAV = """
<div class="bn"><div class="ni on" id="ni-home" onclick="goto('home')"><div class="niw"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div><span>Today</span></div>
<div class="ni" id="ni-journal" onclick="goto('journal')"><div class="niw"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></svg></div><span>Journal</span></div>
<div class="ni" id="ni-notes" onclick="goto('notes')"><div class="niw"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg></div><span>Notes</span></div>
<div class="ni" id="ni-vault" onclick="goto('vault')"><div class="niw"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div><span>Vault</span></div>
<div class="ni" id="ni-more" onclick="goto('more')"><div class="niw"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></div><span>More</span></div></div>
"""

STRIP_JS = r"""
function bootHome(){const r=document.getElementById('stripRing');if(r)r.outerHTML=ringHTML(62)}
function toggleHp(el){el.classList.toggle('on');toast(el.classList.contains('on')?'Habit done':'Habit undone');lifeScore=Math.min(98,lifeScore+(el.classList.contains('on')?1:-1))}
"""

LOOP_CSS = """
.loop-wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}
.loop-arc{position:absolute;top:16px;right:16px;width:48px;height:48px}
.loop-dash{position:absolute;inset:0;border:3px solid var(--el);border-top-color:var(--brand);border-radius:50%;animation:spin 1.2s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.hpill{height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--br);background:var(--el);font-size:12px;font-weight:700;white-space:nowrap}
.hpill.on{background:var(--brand);border-color:var(--brand);color:#fff}
.hab-pills{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.dash-compact{padding:12px 16px}
.dash-row{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--brs);font-size:13px}
.bn.hidden{display:none}
"""

LOOP_HOME = """
<div class="sc on" id="sc-home"><div id="loopView"></div></div>
<div class="sc" id="sc-more"><div class="ph"><div class="pht">More</div></div>
<div class="c"><div class="tr" onclick="goto('habits')"><div class="tri"><div class="trn">Habits</div></div></div>
<div class="tr" onclick="goto('notes')"><div class="tri"><div class="trn">Notes</div></div></div>
<div class="tr" onclick="goto('vault')"><div class="tri"><div class="trn">Vault</div></div></div>
<div class="tr" onclick="goto('settings')"><div class="tri"><div class="trn">Settings</div></div></div>
<div class="tr" onclick="goto('goals')"><div class="tri"><div class="trn">Goals</div></div></div>
<div class="tr" onclick="goto('finance')"><div class="tri"><div class="trn">Finance</div></div></div>
<div class="tr" onclick="goto('reports')"><div class="tri"><div class="trn">Reports</div></div></div></div></div>
"""

LOOP_NAV = """
<div class="bn hidden" id="mainNav"><div class="ni on" id="ni-home" onclick="goto('home')"><div class="niw"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div><span>Today</span></div>
<div class="ni" id="ni-journal" onclick="goto('journal')"><div class="niw"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></svg></div><span>Journal</span></div>
<div class="ni" id="ni-vault" onclick="goto('vault')"><div class="niw"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/></svg></div><span>Vault</span></div>
<div class="ni" id="ni-more" onclick="goto('more')"><div class="niw"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></div><span>More</span></div></div>
"""

LOOP_JS = r"""
const loopSteps=['score','habits','focus','journal'];
let loopStep=0,loopResolved=false,loopStartScore=58;
function bootHome(){loopStep=parseInt(localStorage.getItem(NS+'-loop-step')||'0',10);loopResolved=localStorage.getItem(NS+'-loop-done')==='true';renderLoop()}
function renderLoop(){
 const v=document.getElementById('loopView'),nav=document.getElementById('mainNav');
 if(loopResolved){nav?.classList.remove('hidden');v.innerHTML='<div class="dash-compact"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">'+ringHTML(lifeScore)+'<div><div class="sl">Loop complete</div><div style="font-size:13px;color:var(--t2)">Started at '+loopStartScore+' · now '+lifeScore+'</div></div></div><div class="c pad"><div class="dash-row"><span>Habits</span><span class="b bg">5/8</span></div><div class="dash-row"><span>Focus</span><span>DSA 16:00</span></div><div class="dash-row"><span>Journal</span><span>Saved</span></div><div class="dash-row" style="border:0"><span>Discipline</span><span style="color:var(--t3)">Needs Core</span></div></div><div style="display:flex;gap:8px;margin-top:12px"><button class="btn" style="flex:1" onclick="goto('notes')">Notes</button><button class="btn" style="flex:1" onclick="goto('vault')">Vault</button></div></div>';return}
 nav?.classList.add('hidden');
 const step=loopSteps[loopStep]||'score';
 const pct=Math.round((loopStep/loopSteps.length)*100);
 let body='';
 if(step==='score')body=ringHTML(loopStartScore)+'<h2 style="font-family:var(--FD);margin:16px 0 8px">Life Score glance</h2><p style="color:var(--t2);font-size:14px">62 today. Habits and focus can push it higher.</p>';
 if(step==='habits')body='<h2 style="font-family:var(--FD);font-size:22px">Habits due</h2><p style="color:var(--t2);margin:12px 0">Tick any due today.</p><div class="hab-pills" style="justify-content:center;flex-wrap:wrap"><button class="hpill on" onclick="toggleHp(this)">Review</button><button class="hpill" onclick="toggleHp(this)">Run</button><button class="hpill on" onclick="toggleHp(this)">Water</button></div>';
 if(step==='focus')body='<h2 style="font-family:var(--FD);font-size:22px">Focus block</h2><p style="color:var(--t2);margin:12px 0">DSA Trees and Graphs at 16:00</p><button class="btn primary" onclick="toast(\'Focus scheduled\')">Start block</button><button class="btn" style="margin-top:8px" onclick="loopSkip()">Skip</button>';
 if(step==='journal')body='<h2 style="font-family:var(--FD);font-size:22px">Journal</h2><input style="width:100%;height:44px;border:1px solid var(--br);border-radius:12px;background:var(--sf);padding:0 12px;color:var(--t1);margin:12px 0" placeholder="One line: what matters today?"><p style="font-size:12px;color:var(--t3)">Discipline tracking needs Core — skipped from loop.</p>';
 v.innerHTML='<div class="loop-wrap"><div class="loop-arc"><div class="loop-dash" style="animation-duration:'+(loopStep?'.8s':'0s')+'"></div></div>'+body+'<div style="display:flex;gap:10px;margin-top:24px;width:100%"><button class="btn" style="flex:1" onclick="loopBack()">Back</button><button class="btn primary" style="flex:1" onclick="loopNext()">'+(loopStep===loopSteps.length-1?'Finish':'Next')+'</button></div><button class="btn" style="margin-top:8px;width:100%" onclick="loopSkip()">Skip</button></div>';
}
function loopNext(){lifeScore=Math.min(98,lifeScore+3);loopStep++;localStorage.setItem(NS+'-loop-step',loopStep);if(loopStep>=loopSteps.length){loopResolved=true;localStorage.setItem(NS+'-loop-done','true');toast('Loop complete')}renderLoop()}
function loopSkip(){loopStep++;localStorage.setItem(NS+'-loop-step',loopStep);if(loopStep>=loopSteps.length){loopResolved=true;localStorage.setItem(NS+'-loop-done','true')}renderLoop()}
function loopBack(){if(loopStep>0){loopStep--;localStorage.setItem(NS+'-loop-step',loopStep);renderLoop()}}
function toggleHp(el){el.classList.toggle('on')}
"""

RAIL_CSS = """
.rail{position:absolute;left:0;top:48px;bottom:0;width:28px;background:var(--sf);border-right:1px solid var(--br);z-index:30;display:flex;flex-direction:column;align-items:center;padding:12px 0;gap:14px;transition:width .26s var(--ease)}
.rail.exp{width:200px;align-items:flex-start;padding:12px}
.rail-dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--brand);background:transparent;cursor:pointer;flex-shrink:0;margin-left:8px}
.rail.exp .rail-dot{margin-left:12px}
.rail-dot.on{background:var(--brand)}
.rail-dot.lock{border-style:dashed;opacity:.6}
.rail-label{display:none;font-size:12px;font-weight:700;margin-left:10px;color:var(--t2)}
.rail.exp .rail-label{display:inline}
.rail-item{display:flex;align-items:center;width:100%;min-height:44px;cursor:pointer}
.rail-main{margin-left:28px;padding:0 16px 80px;min-height:100%}
.rail-bottom{position:absolute;left:28px;right:0;bottom:0;height:64px;display:flex;gap:10px;padding:10px 16px;background:color-mix(in srgb,var(--sf) 92%,transparent);border-top:1px solid var(--brs);z-index:25}
.rail-bottom .btn{flex:1}
.swipe-zone{position:absolute;left:0;top:0;bottom:0;width:24px;z-index:29}
"""

RAIL_HOME = """
<div class="swipe-zone" id="swipeZone"></div>
<div class="rail" id="rail"></div>
<div class="sc on" id="sc-home"><div class="rail-main" id="railMain"></div></div>
"""

RAIL_NAV = """
<div class="rail-bottom"><button class="btn primary" onclick="goto('log')">Log</button><button class="btn" onclick="goto('focus')">Focus</button></div>
"""

RAIL_JS = r"""
const railDomains=[{id:'home',l:'Today'},{id:'habits',l:'Habits',badge:'5'},{id:'journal',l:'Journal'},{id:'discipline',l:'Discipline',lock:true},{id:'focus',l:'Focus'},{id:'vault',l:'Vault'},{id:'more',l:'More'}];
let railOpen=false;
function bootHome(){renderRail();renderRailToday()}
function renderRail(){document.getElementById('rail').innerHTML=railDomains.map(d=>'<div class="rail-item" onclick="railTap(\''+d.id+'\')"><div class="rail-dot'+(d.id==='home'?' on':'')+(d.lock?' lock':'')+'"></div><span class="rail-label">'+d.l+(d.badge?' <span class="b bo">'+d.badge+'</span>':'')+'</span></div>').join('');setupRailSwipe()}
function renderRailToday(){document.getElementById('railMain').innerHTML='<div class="ph"><div class="pht">Today</div><div class="phs">Compact dashboard</div></div><div class="c pad" style="display:flex;gap:14px;align-items:center">'+ringHTML(62)+'<div><div style="font-family:var(--FD);font-size:28px;font-weight:800;color:var(--t1)">62</div><div style="font-size:12px;color:var(--t3)">7-day trend up</div><div style="display:flex;gap:3px;height:24px;margin-top:8px;align-items:flex-end"><i style="flex:1;height:40%;background:var(--brand);border-radius:2px"></i><i style="flex:1;height:55%;background:var(--brand);border-radius:2px"></i><i style="flex:1;height:70%;background:var(--brand);border-radius:2px"></i></div></div></div><div class="c"><div class="tr" onclick="goto(\'habits\')"><div class="tri"><div class="trn">Habits</div><div class="trm">5/8 done</div></div></div><div class="tr" onclick="goto(\'journal\')"><div class="tri"><div class="trn">Journal</div><div class="trm">Prompt ready</div></div></div><div class="tr" onclick="openUpgrade()"><div class="tri"><div class="trn">Discipline</div><div class="trm">Core locked</div></div></div><div class="tr" onclick="goto(\'focus\')"><div class="tri"><div class="trn">Focus</div><div class="trm">3h 45m</div></div></div></div>'}
function railTap(id){const d=railDomains.find(x=>x.id===id);if(d?.lock){openUpgrade();return}if(id==='more'){goto('settings');return}goto(id==='home'?'home':id);toggleRail(true)}
function toggleRail(open){railOpen=open!==undefined?open:!railOpen;document.getElementById('rail').classList.toggle('exp',railOpen)}
function setupRailSwipe(){let sx=0;const z=document.getElementById('swipeZone');z.ontouchstart=e=>{sx=e.touches[0].clientX};z.ontouchend=e=>{if(e.changedTouches[0].clientX-sx>40)toggleRail(true)};document.getElementById('pi').addEventListener('click',e=>{if(railOpen&&!e.target.closest('.rail'))toggleRail(false)})}
"""

PULSE_CSS = """
.pulse-top{display:flex;align-items:center;justify-content:space-between;padding:8px 16px}
.pill-nav{display:flex;background:var(--el);border-radius:999px;padding:3px;margin:0 16px 12px;border:1px solid var(--br)}
.pill-nav button{flex:1;height:40px;border-radius:999px;font-size:13px;font-weight:800;color:var(--t3)}
.pill-nav button.on{background:var(--brand);color:#fff}
.pulse-row{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--brs);min-height:52px;transition:opacity .16s ease,max-height .16s ease}
.pulse-row.out{opacity:0;max-height:0;padding:0 16px;overflow:hidden}
.pulse-score{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--brs);cursor:pointer}
.pulse-score b{font-family:var(--FD);font-size:22px;color:var(--t1)}
.pulse-empty{padding:40px 24px;text-align:center}
"""

PULSE_HOME = """
<div class="sc on" id="sc-home">
<div class="pill-nav"><button class="on" id="pill-today" onclick="pulseTab('today')">Today</button><button id="pill-more" onclick="goto('more')">More</button></div>
<div class="pulse-score" onclick="toast('Life Score '+lifeScore)"><b id="pulseScore">62</b><span style="font-size:12px;color:var(--t3)">Life Score · tap to expand</span></div>
<div id="pulseList"></div>
</div>
<div class="sc" id="sc-more"><div class="bk" onclick="goto('home')"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">More</div></div>
<div class="c"><div class="tr" onclick="goto('journal')"><div class="tri"><div class="trn">Journal</div></div></div>
<div class="tr" onclick="goto('notes')"><div class="tri"><div class="trn">Notes</div></div></div>
<div class="tr" onclick="goto('vault')"><div class="tri"><div class="trn">Vault</div></div></div>
<div class="tr" onclick="goto('habits')"><div class="tri"><div class="trn">Habits</div></div></div>
<div class="tr" onclick="goto('focus')"><div class="tri"><div class="trn">Focus stats</div></div></div>
<div class="tr" onclick="goto('discipline')"><div class="tri"><div class="trn">Discipline</div></div></div>
<div class="tr" onclick="goto('settings')"><div class="tri"><div class="trn">Settings</div></div></div>
<div class="tr" onclick="goto('goals')"><div class="tri"><div class="trn">Goals</div></div></div>
<div class="tr" onclick="goto('finance')"><div class="tri"><div class="trn">Finance</div></div></div>
<div class="tr" onclick="goto('reports')"><div class="tri"><div class="trn">Reports</div></div></div></div></div>
"""

PULSE_NAV = ""

PULSE_JS = r"""
// Time-sensitivity ordering: habits (midnight reset) > focus (scheduled) > journal > discipline
let pulseItems=[
 {id:'h1',t:'Morning review',sub:'Resets midnight · streak 14',urgency:1,type:'habit'},
 {id:'f1',t:'DSA Trees and Graphs',sub:'Scheduled 16:00',urgency:2,type:'focus'},
 {id:'j1',t:'Journal prompt',sub:'What moved you today?',urgency:3,type:'journal'},
 {id:'d1',t:'Discipline check',sub:'Day 9 of pledge',urgency:4,type:'discipline',hidden:true}
];
function bootHome(){renderPulse()}
function renderPulse(){
 const pending=pulseItems.filter(x=>!x.done&&!x.hidden).sort((a,b)=>a.urgency-b.urgency);
 const el=document.getElementById('pulseList');
 document.getElementById('pulseScore').textContent=lifeScore;
 if(!pending.length){el.innerHTML='<div class="pulse-empty"><h2 style="font-family:var(--FD)">All clear</h2><p style="color:var(--t2);font-size:13px;margin-top:8px">Nothing urgent left. Discipline tracking is on Core.</p><p style="font-size:12px;color:var(--t3);margin-top:12px">Streak 14 · habits cleared</p></div>';return}
 el.innerHTML=pending.map(p=>'<div class="pulse-row" id="pr-'+p.id+'" onclick="pulseTap(\''+p.id+'\')"><div class="ck" onclick="event.stopPropagation();pulseDone(\''+p.id+'\')"><svg viewBox="0 0 12 12"><polyline points="1,6 4.5,9.5 11,2.5"/></svg></div><div class="tri"><div class="trn">'+p.t+'</div><div class="trm">'+p.sub+'</div></div></div>').join('');
}
function pulseDone(id){const row=document.getElementById('pr-'+id);row?.classList.add('out');setTimeout(()=>{const it=pulseItems.find(x=>x.id===id);if(it)it.done=true;lifeScore=Math.min(98,lifeScore+2);renderPulse();toast('Cleared')},160)}
function pulseTap(id){const it=pulseItems.find(x=>x.id===id);if(it?.type==='focus')goto('focus');else if(it?.type==='habit')toast('Logged inline');else if(it?.type==='journal')goto('journal')}
function pulseTab(t){document.getElementById('pill-today').classList.toggle('on',t==='today');if(t==='today')goto('home')}
"""

DIRECTIONS = [
 ("aiimin-a-mission-control.html", "A · Stack", "STACK — swipe-through daily deck",
  STACK_CSS, STACK_HOME, STACK_NAV, STACK_JS, "aiimin-stack",
  "stack-home:done | habits:done | journal:done | notes:done | vault:done | focus:done | discipline:done | settings:done | onboarding:done | swipe:done"),
 ("aiimin-b-companion.html", "B · Strip", "STRIP — glanceable widget rows",
  STRIP_CSS, STRIP_HOME, STRIP_NAV, STRIP_JS, "aiimin-strip",
  "today-strips:done | inline-habits:done | bottom-nav:done | all-screens:done"),
 ("aiimin-c-workspace.html", "C · Loop", "LOOP — guided check-in to dashboard",
  LOOP_CSS, LOOP_HOME, LOOP_NAV, LOOP_JS, "aiimin-loop",
  "loop-steps:done | resumable:done | resolved-dashboard:done | nav-after-loop:done"),
 ("aiimin-d-timeline.html", "D · Rail", "RAIL — edge rail, no bottom tabs",
  RAIL_CSS, RAIL_HOME, RAIL_NAV, RAIL_JS, "aiimin-rail",
  "rail-peek:done | swipe-expand:done | log-focus-bar:done | no-bottom-tabs:done"),
 ("aiimin-e-spatial.html", "E · Pulse", "PULSE — urgency list shrinks to zero",
  PULSE_CSS, PULSE_HOME, PULSE_NAV, PULSE_JS, "aiimin-pulse",
  "urgency-sort:done | collapse-on-done:done | empty-state:done | today-more-pill:done"),
]

def build_all():
    OUT.mkdir(parents=True, exist_ok=True)
    links = []
    for fname, title, thesis, css, home, nav, js, ns, manifest in DIRECTIONS:
        html = shell(manifest, title, css, home, nav, js, ns)
        (OUT / fname).write_text(html, encoding="utf-8")
        links.append((fname, thesis))
        print(f"Wrote {fname} ({len(html)} bytes)")
    index = """<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AIIMIN v2 Directions</title>
<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@700;800&family=Figtree:wght@400;600&display=swap" rel="stylesheet">
<style>body{font-family:Figtree,sans-serif;background:#1a1a1a;color:#f3f2ef;padding:40px 24px;max-width:720px;margin:0 auto}
h1{font-family:'Familjen Grotesk',sans-serif;color:#ff6b35;font-size:32px}
.card{display:block;background:#2d2d2d;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:18px 20px;margin:12px 0;text-decoration:none;color:inherit;transition:border-color .2s}
.card:hover{border-color:#ff6b35}
.card b{font-family:'Familjen Grotesk',sans-serif;font-size:18px;color:#ff6b35}
.card p{margin:6px 0 0;font-size:14px;color:#b5b0aa}</style></head><body>
<h1>AIIMIN Native Directions</h1><p style="color:#6b7280;margin-bottom:24px">Five distinct IA models · locked palette · light/dark in each file</p>
""" + "\n".join(f'<a class="card" href="{f}"><b>{f}</b><p>{t}</p></a>' for f, t in links) + """
<p style="margin-top:32px;font-size:12px;color:#6b7280">Note: Framer Motion not used — CSS transitions + vanilla JS per brief. Android frame, not iPhone.</p>
</body></html>"""
    (OUT / "index.html").write_text(index, encoding="utf-8")
    print("Wrote index.html")

if __name__ == "__main__":
    build_all()
