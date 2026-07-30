#!/usr/bin/env python3
"""Generate AIIMIN v2-direction native prototypes A-E + index.html"""
from pathlib import Path

OUT = Path("/Users/aaditya/Downloads/Prototyps-APP/v2-directions")

BASE_CSS = r"""
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
button,input,textarea,select{font-family:inherit;cursor:pointer;border:none;background:none;outline:none;color:inherit}
:root{--brand:#ff6b35;--done:#10b981;--muted:#6b7280;--glow:rgba(255,107,53,.28);
--FD:'Familjen Grotesk',sans-serif;--FB:'Figtree',sans-serif;--FM:'JetBrains Mono',monospace;
--ease:cubic-bezier(.22,1,.36,1);--sheet:cubic-bezier(.32,.72,0,1);
--work:#d97706;--health:#10b981;--finance:#f59e0b;--social:#3b82f6;--reflection:#8a6b4f;
--pdf:#dc4a3d;--doc:#3b82f6;--xls:#10b981;--zip:#6b7280}
.TL{--bg:#f9f9f9;--sf:#ffffff;--el:#f0f0f0;--br:rgba(26,26,26,.1);--brs:rgba(26,26,26,.06);--hl:rgba(255,255,255,.9);
--t1:#1a1a1a;--t2:#525252;--t3:#6b7280;--soft:rgba(255,107,53,.1);
--cs:0 1px 3px rgba(26,26,26,.06),0 8px 22px -12px rgba(26,26,26,.12)}
.TD{--bg:#1a1a1a;--sf:#2d2d2d;--el:#262626;--br:rgba(255,255,255,.08);--brs:rgba(255,255,255,.04);--hl:rgba(255,255,255,.05);
--t1:#f3f2ef;--t2:#b5b0aa;--t3:#6b7280;--soft:rgba(255,107,53,.12);
--cs:0 1px 2px rgba(0,0,0,.4),0 16px 32px -16px rgba(0,0,0,.6)}
body{background:#0e0e0e;font-family:var(--FB);min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:20px 12px 48px}
.vbar{width:390px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.vlogo{font-family:var(--FD);font-size:17px;font-weight:800;color:var(--brand)}
.vlogo small{display:block;font-size:9px;font-weight:600;color:#6b7280;letter-spacing:.06em;margin-top:1px}
.tpill{display:flex;background:#1e1e1e;border:1px solid rgba(255,255,255,.08);border-radius:40px;padding:3px;gap:2px}
.topt{font-size:11px;font-weight:700;padding:5px 12px;border-radius:40px;color:#6b7280;transition:all .2s}
.topt.on{background:var(--brand);color:#fff}
.pf{width:390px;height:844px;border-radius:28px;background:#121212;padding:10px;box-shadow:0 40px 100px -20px rgba(0,0,0,.9),inset 0 0 0 1px rgba(255,255,255,.06);position:relative;flex-shrink:0}
.pf::before{content:'';position:absolute;top:16px;left:50%;transform:translateX(-50%);width:8px;height:8px;border-radius:50%;background:#1a1a1a;border:1px solid #333;z-index:300}
.pi{width:100%;height:100%;border-radius:22px;overflow:hidden;position:relative;display:flex;flex-direction:column;background:var(--bg);color:var(--t1);transition:background .35s ease,color .35s ease}
.sb{height:48px;display:flex;align-items:flex-end;justify-content:space-between;padding:0 20px 8px;flex-shrink:0;font-size:13px;font-weight:700}
.sbi{display:flex;align-items:center;gap:6px}
.bat{width:20px;height:11px;border:1.5px solid var(--t1);border-radius:2px;padding:1.5px;opacity:.85}
.batf{height:100%;width:70%;background:var(--t1);border-radius:1px}
.sw{flex:1;position:relative;overflow:hidden;min-height:0}
.sc{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;display:none;-webkit-overflow-scrolling:touch;padding-bottom:88px}
.sc.on{display:block;animation:push .22s var(--ease) both}
.sc.flex.on{display:flex;flex-direction:column}
@keyframes push{from{opacity:.3;transform:translateX(14px)}to{opacity:1;transform:none}}
.bk{display:flex;align-items:center;gap:4px;font-size:14px;font-weight:700;color:var(--brand);padding:12px 16px 4px;min-height:44px}
.bk svg{width:18px;height:18px;stroke:var(--brand);fill:none;stroke-width:2.2;stroke-linecap:round}
.ph{padding:8px 16px 12px}
.pht{font-family:var(--FD);font-size:24px;font-weight:800;letter-spacing:-.02em}
.phs{font-size:13px;color:var(--t3);margin-top:2px}
.c{background:var(--sf);border:1px solid var(--br);border-radius:14px;box-shadow:var(--cs);margin:0 16px 12px}
.pad{padding:14px 16px}
.sh{display:flex;align-items:center;justify-content:space-between;padding:0 16px;margin-bottom:8px}
.sl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.4px;color:var(--t3)}
.sla{font-size:12px;font-weight:700;color:var(--brand)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:0 16px;border-radius:12px;font-size:13px;font-weight:700;border:1px solid var(--br);background:var(--el);color:var(--t2)}
.btn.primary{background:var(--brand);border-color:var(--brand);color:#fff;box-shadow:0 8px 22px -8px var(--glow)}
.btn.sm{min-height:36px;padding:0 12px;font-size:12px}
.chips{display:flex;gap:6px;padding:4px 16px 12px;overflow-x:auto;scrollbar-width:none}
.chip{font-size:12px;font-weight:700;padding:8px 14px;border-radius:40px;border:1px solid var(--br);background:var(--el);color:var(--t2);white-space:nowrap;flex-shrink:0}
.chip.on{background:var(--brand);border-color:var(--brand);color:#fff}
.ck{width:22px;height:22px;border-radius:50%;border:2px solid var(--br);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s ease-out}
.ck.on{background:var(--brand);border-color:var(--brand)}
.ck svg{width:11px;height:11px;stroke:#fff;fill:none;stroke-width:2.5;opacity:0;transition:opacity .15s}
.ck.on svg{opacity:1}
.tr{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--brs);min-height:44px}
.tr:last-child{border-bottom:none}
.tri{flex:1}
.trn{font-size:14px;font-weight:600;color:var(--t1)}
.trm{font-size:11px;color:var(--t3);margin-top:2px}
.tg{width:48px;height:28px;border-radius:40px;position:relative;background:var(--el);border:1px solid var(--br);flex-shrink:0}
.tg.on{background:var(--brand);border-color:var(--brand)}
.tgk{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.2);transition:transform .2s}
.tg.on .tgk{transform:translateX(20px)}
.ring-wrap{position:relative;width:88px;height:88px;flex-shrink:0}
.ring-svg{width:88px;height:88px;transform:rotate(-90deg)}
.ring-num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ring-num b{font-family:var(--FD);font-size:26px;font-weight:800;color:var(--t1)}
.ring-num small{font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase}
.pt{height:4px;background:var(--el);border-radius:2px;overflow:hidden}
.pf2{height:100%;background:var(--brand);border-radius:2px;width:0;transition:width .7s ease-out}
.b{display:inline-flex;font-size:10px;font-weight:700;padding:2px 8px;border-radius:40px}
.bo{background:var(--soft);color:var(--brand);border:1px solid rgba(255,107,53,.2)}
.bg{background:rgba(16,185,129,.1);color:var(--done);border:1px solid rgba(16,185,129,.2)}
.bn2{background:var(--el);color:var(--t3);border:1px solid var(--br)}
.ov{position:absolute;inset:0;background:rgba(0,0,0,0);z-index:100;display:none;align-items:flex-end;transition:background .28s}
.ov.on{display:flex;background:rgba(0,0,0,.55)}
.sheet{width:100%;background:var(--sf);border-radius:24px 24px 0 0;border-top:1px solid var(--br);padding:0 20px 32px;animation:sup .28s var(--sheet)}
@keyframes sup{from{transform:translateY(100%)}to{transform:translateY(0)}}
.shdl{width:36px;height:4px;border-radius:2px;background:var(--br);margin:12px auto 16px}
.shtit{font-family:var(--FD);font-size:17px;font-weight:800;margin-bottom:12px}
.spl{position:absolute;inset:0;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:500;transition:opacity .5s}
.spl.out{opacity:0;pointer-events:none}
.splo{font-family:var(--FD);font-size:48px;font-weight:800;color:var(--brand)}
.splt{font-size:12px;color:var(--t3);margin-top:6px;letter-spacing:.08em}
.bn{height:68px;flex-shrink:0;display:flex;align-items:center;padding:0 4px 10px;background:color-mix(in srgb,var(--sf) 90%,transparent);backdrop-filter:blur(20px);border-top:1px solid var(--brs);z-index:50}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:44px;padding:4px 0}
.niw{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center}
.ni svg{width:20px;height:20px;stroke:var(--t3);fill:none;stroke-width:1.8;stroke-linecap:round}
.ni>span{font-size:9px;font-weight:700;color:var(--t3)}
.ni.on .niw{background:var(--soft)}
.ni.on svg,.ni.on>span{color:var(--brand);stroke:var(--brand)}
.toast{position:absolute;left:50%;bottom:90px;transform:translate(-50%,8px);background:var(--sf);border:1px solid var(--br);border-radius:999px;padding:10px 16px;font-size:12px;font-weight:700;opacity:0;pointer-events:none;transition:.25s ease;z-index:200;white-space:nowrap}
.toast.on{opacity:1;transform:translate(-50%,0)}
.setgrp{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.4px;color:var(--t3);padding:16px 16px 6px}
.setrow{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--brs);min-height:52px;cursor:pointer}
.setrow:last-child{border-bottom:none}
.setico{width:36px;height:36px;border-radius:10px;background:var(--el);border:1px solid var(--br);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.setico svg{width:17px;height:17px;stroke:var(--brand);fill:none;stroke-width:1.9}
.setgrow{flex:1}
.setlbl{font-size:14px;font-weight:600}
.setval{font-size:12px;color:var(--t3)}
.tier-card{padding:14px;border-radius:14px;border:1px solid var(--br);background:var(--el);margin-bottom:10px}
.tier-card.rec{border-color:var(--brand);box-shadow:inset 0 0 0 1px var(--brand)}
.tier-card h3{font-family:var(--FD);font-size:18px;margin:4px 0}
.lock-box{border:1px dashed var(--br);border-radius:12px;padding:16px;text-align:center;margin:12px 16px;background:var(--el)}
.doc-ico{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.doc-ico svg{width:18px;height:18px;fill:none;stroke-width:1.8}
.doc-ico.pdf{background:rgba(220,74,61,.14)}.doc-ico.pdf svg{stroke:var(--pdf)}
.doc-ico.docx{background:rgba(59,130,246,.14)}.doc-ico.docx svg{stroke:var(--doc)}
.doc-ico.xlsx{background:rgba(16,185,129,.14)}.doc-ico.xlsx svg{stroke:var(--xls)}
.doc-ico.zip{background:var(--el)}.doc-ico.zip svg{stroke:var(--zip)}
.pin-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:16px}
.pin-key{height:52px;border-radius:14px;background:var(--el);border:1px solid var(--br);font-size:20px;font-weight:700}
.pin-dots{display:flex;gap:12px;justify-content:center;padding:20px}
.pin-dots i{width:12px;height:12px;border-radius:50%;border:2px solid var(--br);transition:background .15s}
.pin-dots i.f{background:var(--brand);border-color:var(--brand)}
.ob-slide{position:absolute;inset:0;background:var(--bg);z-index:400;display:none;flex-direction:column;padding:32px 24px;justify-content:center}
.ob-slide.on{display:flex}
.ob-word{font-family:var(--FD);font-size:42px;font-weight:800;color:var(--brand);margin-bottom:12px}
.ob-body{font-size:15px;color:var(--t2);line-height:1.5;margin-bottom:24px}
.ob-field{width:100%;height:44px;border:1px solid var(--br);border-radius:12px;background:var(--sf);padding:0 14px;color:var(--t1);margin:8px 0}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:1ms!important;transition-duration:1ms!important;backdrop-filter:none!important}}
"""

SHARED_JS = r"""
const TIER='Explore';
const OSID='AADITYA8';
const DOCS=[
 {n:'AIIMIN Product Roadmap.pdf',s:'2.4 MB',u:'2 hours ago',t:'pdf'},
 {n:'Semester Notes.docx',s:'1.3 MB',u:'Yesterday',t:'docx'},
 {n:'Budget Tracker.xlsx',s:'520 KB',u:'2 days ago',t:'xlsx'},
 {n:'Design Inspirations.zip',s:'12.6 MB',u:'3 days ago',t:'zip'}
];
let stack=['home'],lifeScore=62,pinBuf='';

function setTheme(t){
 localStorage.setItem('aiimin-theme',t);
 const pi=document.getElementById('pi');
 if(pi){pi.classList.remove('TL','TD');pi.classList.add(t==='dark'?'TD':'TL')}
 document.querySelectorAll('.topt').forEach((o,i)=>o.classList.toggle('on',(t==='dark'&&i===1)||(t==='light'&&i===0)));
 const av=document.getElementById('appval');if(av)av.textContent=t==='dark'?'Dark':'Light';
}
function toast(m){const t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove('on'),2200)}
function showScreen(id){
 document.querySelectorAll('.sc').forEach(s=>s.classList.remove('on'));
 const sc=document.getElementById('sc-'+id);
 if(sc){sc.classList.add('on');sc.scrollTop=0}
 document.querySelectorAll('.ni').forEach(n=>n.classList.remove('on'));
 const ni=document.getElementById('ni-'+id);if(ni)ni.classList.add('on');
 if(typeof onScreen==='function')onScreen(id);
}
function goto(id){
 if(['home','journal','notes','vault','more','stack','today'].includes(id))stack=[id];
 else{const i=stack.indexOf(id);if(i>-1)stack.splice(i,1);stack.push(id)}
 showScreen(id);closeSheet();
}
function goBack(){if(stack.length>1){stack.pop();showScreen(stack[stack.length-1])}}
function toggleCk(el){el.classList.toggle('on');const row=el.closest('.tr');if(row){const n=row.querySelector('.trn');if(n)n.style.textDecoration=el.classList.contains('on')?'line-through':'none';n.style.color=el.classList.contains('on')?'var(--t3)':'var(--t1)'}}
function toggleTg(el){el.classList.toggle('on');toast(el.classList.contains('on')?'On':'Off')}
function setChip(el){el.closest('.chips')?.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));el.classList.add('on')}
function openSheet(html){const ov=document.getElementById('fabov'),sh=document.getElementById('sheetbody');if(ov&&sh){sh.innerHTML=html;ov.classList.add('on')}}
function closeSheet(e){if(e&&e.target!==document.getElementById('fabov'))return;document.getElementById('fabov')?.classList.remove('on')}
function openUpgrade(){openSheet('<div class="shtit">Upgrade to Core</div><p style="color:var(--t2);font-size:13px;margin-bottom:12px">Habits and Discipline need Core. Complimentary at go-live.</p>'+billingHTML()+'<button class="btn primary" style="width:100%;margin-top:12px" onclick="celebrate()">Upgrade</button>')}
function celebrate(){toast('Core unlocked');setTimeout(()=>toast('Reports, habits, discipline now active'),1200)}
function billingHTML(){return [['Explore','Rs0 forever','','Log daily. Learn the loop.','Active',0],['Core','Rs29/mo','Complimentary at go-live','Run your essentials.','Upgrade',1],['Pro','Rs59/mo','Founding Rs49/mo x 12 months','See the patterns.','Upgrade',2],['Elite','Rs99/mo','Founding Rs79/mo x 12 months','Interactive intelligence, two AI pools.','Switch',3]].map(t=>'<div class="tier-card'+(t[5]===2?' rec':'')+'"><div style="display:flex;justify-content:space-between"><b>'+t[0]+'</b>'+(t[5]===2?'<span class="b bo">Recommended</span>':'')+'</div><h3>'+t[1]+'</h3><p style="font-size:12px;color:var(--t3)">'+t[2]+'</p><p style="font-size:13px;color:var(--t2);margin:6px 0">'+t[3]+'</p><button class="btn'+(t[4]==='Active'?'':' primary')+' sm" onclick="toast(\''+t[0]+' plan\')">'+t[4]+'</button></div>').join('')}
function settingsRows(){return `
<div class="setgrp">Account</div>
<div class="c" style="margin-top:0">
<div class="setrow" onclick="goto('profile')"><div class="setico"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="setgrow"><div class="setlbl">Profile Information</div><div class="setval">Aaditya Upadhyay</div></div><svg width="16" height="16" stroke="var(--t3)" fill="none"><polyline points="9,18 15,12 9,6"/></svg></div>
<div class="setrow" onclick="toast('Account security')"><div class="setico"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div><div class="setgrow"><div class="setlbl">Account & Security</div></div><svg width="16" height="16" stroke="var(--t3)" fill="none"><polyline points="9,18 15,12 9,6"/></svg></div>
<div class="setrow" onclick="openSheet('<div class=\\'shtit\\'>Subscription</div>'+billingHTML())"><div class="setico"><svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div><div class="setgrow"><div class="setlbl">Subscription</div><div class="setval">Pro · till 10 Aug 2026</div></div><svg width="16" height="16" stroke="var(--t3)" fill="none"><polyline points="9,18 15,12 9,6"/></svg></div>
</div>
<div class="setgrp">Preferences</div>
<div class="c">
<div class="setrow"><div class="setico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></div><div class="setgrow"><div class="setlbl">Appearance</div><div class="setval" id="appval">Light</div></div><div class="tg" id="themeTg" onclick="toggleTheme()"><div class="tgk"></div></div></div>
<div class="setrow" onclick="goto('notifs')"><div class="setico"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg></div><div class="setgrow"><div class="setlbl">Notifications</div><div class="setval">On</div></div><svg width="16" height="16" stroke="var(--t3)" fill="none"><polyline points="9,18 15,12 9,6"/></svg></div>
<div class="setrow" onclick="toast('Language: English')"><div class="setico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg></div><div class="setgrow"><div class="setlbl">Language</div><div class="setval">English</div></div></div>
<div class="setrow"><div class="setico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg></div><div class="setgrow"><div class="setlbl">Focus Reminders</div><div class="setval">On</div></div><div class="tg on" onclick="toggleTg(this)"><div class="tgk"></div></div></div>
</div>
<div class="setgrp">Data & Sync</div>
<div class="c">
<div class="setrow" onclick="toast('Backup ready')"><div class="setico"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div><div class="setgrow"><div class="setlbl">Backup & Restore</div></div></div>
<div class="setrow"><div class="setgrow"><div class="setlbl">Data Sync</div><div class="setval">On</div></div><div class="tg on" onclick="toggleTg(this)"><div class="tgk"></div></div></div>
<div class="setrow" onclick="toast('Export started')"><div class="setgrow"><div class="setlbl">Export Data</div><div class="setval">CSV, PDF</div></div></div>
</div>
<div class="setgrp">Support</div>
<div class="c" style="margin-bottom:24px">
<div class="setrow" onclick="toast('Help opened')"><div class="setgrow"><div class="setlbl">Help & Support</div></div></div>
<div class="setrow" onclick="toast('Feedback sent')"><div class="setgrow"><div class="setlbl">Send Feedback</div></div></div>
<div class="setrow" onclick="toast('AIIMIN v2.4.1')"><div class="setgrow"><div class="setlbl">About AIIMIN</div><div class="setval">v2.4.1</div></div></div>
</div>`}
function toggleTheme(){const d=document.getElementById('pi')?.classList.contains('TD');setTheme(d?'light':'dark');const tg=document.getElementById('themeTg');if(tg)tg.classList.toggle('on',!d)}
function ringHTML(score){const c=2*Math.PI*38,off=c*(1-score/98);return '<div class="ring-wrap"><svg class="ring-svg" viewBox="0 0 88 88"><circle cx="44" cy="44" r="38" fill="none" stroke="var(--el)" stroke-width="7"/><circle cx="44" cy="44" r="38" fill="none" stroke="var(--brand)" stroke-width="7" stroke-dasharray="'+c+'" stroke-dashoffset="'+off+'" stroke-linecap="round"/></svg><div class="ring-num"><b>'+score+'</b><small>Life</small></div></div>'}
function pinKey(k){if(k==='del'){pinBuf=pinBuf.slice(0,-1)}else if(pinBuf.length<6)pinBuf+=k;renderPinDots();if(pinBuf.length>=4){toast('Device unlocked');setTimeout(enterApp,400)}}
function renderPinDots(){document.querySelectorAll('.pin-dots i').forEach((d,i)=>d.classList.toggle('f',i<pinBuf.length))}
function finishOb(){localStorage.setItem('aiimin-onboarding-complete','true');document.querySelectorAll('.ob-slide').forEach(s=>s.classList.remove('on'));document.getElementById('ob-auth')?.classList.add('on')}
function authGoogle(){toast('Signed in with Google');document.getElementById('ob-auth')?.classList.remove('on');document.getElementById('ob-pin')?.classList.add('on')}
function enterApp(){document.getElementById('ob-pin')?.classList.remove('on');document.getElementById('spl')?.classList.add('out');if(typeof bootHome==='function')bootHome()}
function obNext(step){document.querySelectorAll('.ob-slide').forEach(s=>s.classList.remove('on'));document.getElementById('ob-'+step)?.classList.add('on');if(step==='theme'){const t=document.querySelector('input[name=obtheme]:checked')?.value||'light';setTheme(t)}}
function routeLog(){const v=document.getElementById('logText')?.value?.toLowerCase()||'';let r='Today';if(v.includes('ran')||v.includes('gym'))r='Fitness';else if(v.includes('note'))r='Notes';else if(v.includes('rs'))r='Finance';toast('Filed to '+r);closeSheet()}
"""

SCREENS_HTML = r"""
<div class="sc" id="sc-habits"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Habits</div><div class="phs">Core · streak calendar</div></div>
<div class="chips"><div class="chip on" onclick="setChip(this)">Daily</div><div class="chip" onclick="setChip(this)">Matrix</div><div class="chip" onclick="toast('Add habit')">Add</div></div>
<div class="c"><div class="tr"><div class="ck on" onclick="toggleCk(this)"><svg viewBox="0 0 12 12"><polyline points="1,6 4.5,9.5 11,2.5"/></svg></div><div class="tri"><div class="trn">Morning review</div><div class="trm">Streak 14</div></div></div>
<div class="tr"><div class="ck on" onclick="toggleCk(this)"><svg viewBox="0 0 12 12"><polyline points="1,6 4.5,9.5 11,2.5"/></svg></div><div class="tri"><div class="trn">Water 3L</div><div class="trm">Streak 9</div></div></div>
<div class="tr"><div class="ck" onclick="toggleCk(this)"><svg viewBox="0 0 12 12"><polyline points="1,6 4.5,9.5 11,2.5"/></svg></div><div class="tri"><div class="trn">Evening run 5K</div><div class="trm">Streak 6</div></div></div>
<div class="tr"><div class="ck on" onclick="toggleCk(this)"><svg viewBox="0 0 12 12"><polyline points="1,6 4.5,9.5 11,2.5"/></svg></div><div class="tri"><div class="trn">Code 2h (DSA)</div><div class="trm">Streak 21</div></div></div></div></div>

<div class="sc" id="sc-journal"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Journal</div></div>
<div class="chips"><div class="chip on" onclick="setChip(this)">Today</div><div class="chip" onclick="setChip(this)">Free write</div><div class="chip" onclick="setChip(this)">CBT</div><div class="chip" onclick="setChip(this)">Weekly review</div></div>
<div class="c pad"><p style="font-size:13px;color:var(--t2);margin-bottom:10px">What moved you today? What slowed you down?</p>
<textarea style="width:100%;height:180px;background:var(--el);border:1px solid var(--br);border-radius:12px;padding:12px;color:var(--t1);resize:none" placeholder="MUJ semester wrap-up went well. DSA trees still fuzzy."></textarea>
<button class="btn primary" style="width:100%;margin-top:12px" onclick="toast('Journal saved')">Save entry</button></div></div>

<div class="sc" id="sc-notes"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Notes</div></div>
<div class="chips"><div class="chip on" onclick="setChip(this)">All</div><div class="chip" onclick="setChip(this)">Pinned</div><div class="chip" onclick="setChip(this)">Recent</div><div class="chip" onclick="setChip(this)">Categories</div></div>
<div class="c"><div class="tr" onclick="toast('AIIMIN Roadmap')"><div class="tri"><div class="trn">AIIMIN Product Roadmap</div><div class="trm">Pinned · 2h ago</div></div></div>
<div class="tr" onclick="toast('Cloud notes')"><div class="tri"><div class="trn">Cloud Computing Notes (MUJ)</div><div class="trm">Study · Yesterday</div></div></div>
<div class="tr" onclick="toast('IEEE note')"><div class="tri"><div class="trn">IEEE INCIP EEG paper notes</div><div class="trm">Lab · 3 days ago</div></div></div>
<div class="tr" onclick="toast('DSA note')"><div class="tri"><div class="trn">DSA Trees and Graphs</div><div class="trm">Placement · Today</div></div></div></div></div>

<div class="sc" id="sc-vault"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Vault</div></div>
<div class="chips"><div class="chip on" onclick="setChip(this)">All</div><div class="chip" onclick="setChip(this)">PDF</div><div class="chip" onclick="setChip(this)">Docs</div><div class="chip" onclick="setChip(this)">Sheets</div><div class="chip" onclick="setChip(this)">Images</div><div class="chip" onclick="setChip(this)">Others</div></div>
<div class="c" id="docList"></div></div>

<div class="sc" id="sc-focus"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Focus</div><div class="phs">Pomodoro · session stats</div></div>
<div class="c pad" style="text-align:center"><div class="sl">Intent</div><p style="margin:8px 0 16px;font-size:15px">DSA Trees and Graphs</p>
<div style="font-family:var(--FD);font-size:56px;font-weight:800" id="timer">25:00</div>
<button class="btn primary" style="width:100%;margin-top:16px" onclick="toast('Focus started')">Start session</button></div>
<div class="c pad"><div class="sl">This week</div><div style="display:flex;gap:4px;align-items:flex-end;height:48px;margin-top:10px" id="spark"></div></div></div>

<div class="sc" id="sc-discipline"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Discipline Engine</div></div>
<div class="c pad"><div style="display:flex;justify-content:space-between;align-items:center"><div><div class="sl">Pledge</div><div style="font-family:var(--FD);font-size:28px;font-weight:800">14 days</div></div><span class="b bo">Day 9</span></div>
<div class="pt" style="margin-top:12px"><div class="pf2" style="width:64%"></div></div>
<p style="font-size:13px;color:var(--t2);margin-top:12px">Next milestone: 14 days · 5 to go</p></div></div>

<div class="sc" id="sc-goals"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Goals</div></div>
<div class="c pad"><div class="trn">Launch AIIMIN v1.0</div><div class="pt" style="margin:8px 0"><div class="pf2" style="width:78%"></div></div><div class="trm">Aug 15, 2026</div></div>
<div class="c pad"><div class="trn">Placement at 10 LPA+</div><div class="pt" style="margin:8px 0"><div class="pf2" style="width:45%"></div></div></div>
<div class="c pad"><div class="trn">Solve 200 DSA Problems</div><div class="pt" style="margin:8px 0"><div class="pf2" style="width:34%"></div></div><div class="trm">67 of 200</div></div></div>

<div class="sc" id="sc-finance"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Finance</div></div>
<div class="c pad"><div class="sl">Net worth pulse</div><div style="font-family:var(--FD);font-size:32px;font-weight:800;color:var(--t1)">Rs 1.84L</div></div>
<div class="lock-box"><span class="b bo">Pro</span><p style="margin-top:8px;font-size:13px;color:var(--t2)">What-if scenarios and AI wealth summary</p><button class="btn primary sm" style="margin-top:10px" onclick="openUpgrade()">Upgrade</button></div></div>

<div class="sc" id="sc-family"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Family</div><div class="phs">Pro hub</div></div>
<div class="chips" style="padding-bottom:4px"><div style="text-align:center;flex-shrink:0"><div style="width:48px;height:48px;border-radius:50%;background:var(--el);border:2px solid var(--brand);display:grid;place-items:center;font-weight:800;margin:0 auto">M</div><div style="font-size:10px;margin-top:4px">Mom</div><div style="font-size:9px;color:var(--t3)">Admin</div></div>
<div style="text-align:center;flex-shrink:0"><div style="width:48px;height:48px;border-radius:50%;background:var(--el);display:grid;place-items:center;font-weight:800;margin:0 auto">D</div><div style="font-size:10px;margin-top:4px">Dad</div><div style="font-size:9px;color:var(--t3)">Member</div></div>
<div style="text-align:center;flex-shrink:0"><div style="width:48px;height:48px;border-radius:50%;background:var(--el);display:grid;place-items:center;font-weight:800;margin:0 auto">R</div><div style="font-size:10px;margin-top:4px">Riya</div><div style="font-size:9px;color:var(--t3)">Member</div></div></div>
<div class="c"><div class="tr"><div class="tri"><div class="trn">Grocery shopping - BigBazaar</div><div class="trm">Assigned to Mom</div></div></div>
<div class="tr"><div class="tri"><div class="trn">Book Riya flight tickets</div><div class="trm">Assigned to You</div></div></div></div></div>

<div class="sc" id="sc-reports"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Reports</div></div>
<div class="c pad"><span class="b bg">Core</span><h3 style="margin:8px 0">Ivory Snapshot 7-day</h3><p style="font-size:13px;color:var(--t2)">Habits, focus, finance moved together.</p></div>
<div class="lock-box"><span class="b bo">Pro locked</span><p style="margin-top:8px">14-day PDF + correlations</p></div></div>

<div class="sc" id="sc-settings"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Settings</div><div class="phs">Account, preferences, sync</div></div>
<div id="settingsMount"></div></div>

<div class="sc" id="sc-profile"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Profile</div></div>
<div class="c pad" style="display:flex;gap:14px;align-items:center"><div style="width:56px;height:56px;border-radius:14px;background:var(--brand);color:#fff;display:grid;place-items:center;font-family:var(--FD);font-size:22px;font-weight:800">AU</div><div><div style="font-weight:800;font-size:18px">Aaditya Upadhyay</div><div style="font-size:13px;color:var(--t3)">aaditya@aiimin.in</div><div style="font-family:var(--FM);font-size:12px;color:var(--brand);margin-top:4px">OS-ID: AADITYA8</div></div></div>
<div style="padding:0 16px" id="billingMount"></div></div>

<div class="sc" id="sc-notifs"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Notifications</div></div>
<div class="c"><div class="tr"><div class="setico"><svg viewBox="0 0 24 24" stroke="var(--brand)" fill="none"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/></svg></div><div class="tri"><div class="trn">14-day streak</div><div class="trm">Personal best approaching</div></div></div>
<div class="tr"><div class="setico"><svg viewBox="0 0 24 24" stroke="var(--brand)" fill="none"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg></div><div class="tri"><div class="trn">Sam call in 15 min</div><div class="trm">Reports prep</div></div></div></div></div>

<div class="sc" id="sc-log"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Daily Log</div></div>
<div class="c pad"><div class="setlbl">Sleep</div><input type="range" min="4" max="10" value="7" style="width:100%;accent-color:var(--brand)" onchange="toast('Sleep logged')"><div class="setlbl" style="margin-top:12px">Mood</div><div class="chips" style="padding:8px 0"><div class="chip on" onclick="setChip(this)">Calm</div><div class="chip" onclick="setChip(this)">Focused</div><div class="chip" onclick="setChip(this)">Tired</div></div>
<div class="setlbl">Water / Steps / Gym</div><button class="btn" style="width:100%;margin-top:8px" onclick="toast('Gym logged')">Log gym yes</button>
<button class="btn primary" style="width:100%;margin-top:12px" onclick="toast('Daily log saved')">Save log</button></div></div>

<div class="sc" id="sc-calendar"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Calendar</div></div>
<div class="chips"><div class="chip on" onclick="setChip(this)">Month</div><div class="chip" onclick="setChip(this)">Week</div><div class="chip" onclick="setChip(this)">Day</div><div class="chip" onclick="setChip(this)">Agenda</div></div>
<div class="c"><div class="tr"><span style="width:8px;height:8px;border-radius:50%;background:var(--work)"></span><div class="tri"><div class="trn">09:00 AIIMIN auth flow review</div></div></div>
<div class="tr"><span style="width:8px;height:8px;border-radius:50%;background:var(--social)"></span><div class="tri"><div class="trn">14:00 Call with Sam</div></div></div>
<div class="tr"><span style="width:8px;height:8px;border-radius:50%;background:var(--reflection)"></span><div class="tri"><div class="trn">16:00 DSA Trees and Graphs</div></div></div>
<div class="tr"><span style="width:8px;height:8px;border-radius:50%;background:var(--health)"></span><div class="tri"><div class="trn">18:00 Evening run 5K</div></div></div></div></div>

<div class="sc" id="sc-career"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Career</div><div class="phs">Placements kanban</div></div>
<div class="c pad"><div class="sl">Applied</div><div class="trn" style="margin-top:6px">Frontend Intern - Razorpay</div></div>
<div class="c pad"><div class="sl">Interview</div><div class="trn" style="margin-top:6px">AWS CLF-C02 prep</div></div>
<div class="c pad"><div class="sl">Resume vault</div><div class="trm">Frontend Dev Resume v2.1</div></div></div>

<div class="sc" id="sc-sports"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Sports</div></div>
<div class="c pad"><div class="trn">Cricket: India training block</div><button class="btn sm" style="margin-top:8px" onclick="toast('Saved')">Save</button></div>
<div class="c pad"><div class="trn">Football: PL opener watchlist</div></div>
<div class="c pad"><div class="trn">F1: Silverstone strategy read</div></div></div>

<div class="sc" id="sc-lab"><div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div><div class="ph"><div class="pht">Lab</div></div>
<div class="c"><div class="tr" onclick="toast('Typing started')"><div class="tri"><div class="trn">Typing drill</div></div></div>
<div class="tr" onclick="toast('Aptitude started')"><div class="tri"><div class="trn">Aptitude set</div></div></div>
<div class="tr" onclick="toast('STAR started')"><div class="tri"><div class="trn">STAR interview</div></div></div>
<div class="tr" onclick="toast('Flashcards')"><div class="tri"><div class="trn">Flashcards</div></div></div>
<div class="tr" onclick="toast('IEEE paper')"><div class="tri"><div class="trn">IEEE INCIP EEG paper</div></div></div>
<div class="tr" onclick="toast('AWS CLF-C02')"><div class="tri"><div class="trn">AWS CLF-C02</div></div></div></div></div>
"""

def shell(manifest, title, direction_css, home_html, nav_html, extra_js, ns):
    fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@600;700;800&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">'
    ob = f"""
<div class="ob-slide on" id="ob-splash"><div class="ob-word">AIIMIN</div><p class="ob-body">One screen. Every day.</p><button class="btn primary" style="width:100%" onclick="obNext('slide1')">Continue</button><button class="btn" style="width:100%;margin-top:8px" onclick="finishOb()">Skip</button></div>
<div class="ob-slide" id="ob-slide1"><div class="ob-word" style="font-size:28px">One screen.<br>Every day.</div><p class="ob-body">Your Life OS on Android — habits, journal, focus, vault.</p><button class="btn primary" style="width:100%" onclick="obNext('theme')">Next</button></div>
<div class="ob-slide" id="ob-theme"><div class="ob-word" style="font-size:24px">Pick appearance</div><label style="display:flex;gap:10px;margin:12px 0;align-items:center"><input type="radio" name="obtheme" value="light" checked> Light Clean</label><label style="display:flex;gap:10px;margin:12px 0;align-items:center"><input type="radio" name="obtheme" value="dark"> Dark Focus</label><button class="btn primary" style="width:100%" onclick="obNext('osid')">Next</button></div>
<div class="ob-slide" id="ob-osid"><div class="ob-word" style="font-size:24px">Reserve OS-ID</div><input class="ob-field" id="osidField" maxlength="8" placeholder="8 characters (optional)" oninput="checkOsid()"><p class="ob-body" id="osidStatus">Optional. Syncs with web account.</p><button class="btn primary" style="width:100%" onclick="obNext('auth')">Get started</button></div>
<div class="ob-slide" id="ob-auth"><div class="ob-word" style="font-size:24px">Sign in</div><p class="ob-body">Continue with your web account.</p><button class="btn primary" style="width:100%;margin-bottom:10px" onclick="authGoogle()">Continue with Google</button><input class="ob-field" placeholder="OS-ID or email"><button class="btn" style="width:100%;margin-top:8px" onclick="authGoogle()">Sign in</button></div>
<div class="ob-slide" id="ob-pin"><div class="ob-word" style="font-size:24px">Device PIN</div><p class="ob-body">Set a 4-digit unlock for this device.</p><div class="pin-dots"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="pin-pad"><button class="pin-key" onclick="pinKey('1')">1</button><button class="pin-key" onclick="pinKey('2')">2</button><button class="pin-key" onclick="pinKey('3')">3</button><button class="pin-key" onclick="pinKey('4')">4</button><button class="pin-key" onclick="pinKey('5')">5</button><button class="pin-key" onclick="pinKey('6')">6</button><button class="pin-key" onclick="pinKey('7')">7</button><button class="pin-key" onclick="pinKey('8')">8</button><button class="pin-key" onclick="pinKey('9')">9</button><button class="pin-key" onclick="pinKey('del')">Del</button><button class="pin-key" onclick="pinKey('0')">0</button><button class="pin-key" onclick="enterApp()">OK</button></div></div>
<div class="spl" id="spl"><div class="splo">AIIMIN</div><div class="splt">PERSONAL OS</div></div>"""
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
{fonts}
<style>
{BASE_CSS}
{direction_css}
</style>
</head>
<body>
<div class="vbar">
  <div class="vlogo">AIIMIN<small>{title}</small></div>
  <div class="tpill"><div class="topt on" onclick="setTheme('light')">Light</div><div class="topt" onclick="setTheme('dark')">Dark</div></div>
</div>
<div class="pf"><div class="pi TL" id="pi">
<div class="sb"><span>9:41</span><div class="sbi"><div class="bat"><div class="batf"></div></div></div></div>
<div class="sw">
{home_html}
{SCREENS_HTML}
{ob}
</div>
{nav_html}
<div class="ov" id="fabov" onclick="closeSheet(event)"><div class="sheet" onclick="event.stopPropagation()"><div class="shdl"></div><div id="sheetbody"></div></div></div>
<div class="toast" id="toast"></div>
</div></div>
<script>
/* COVERAGE MANIFEST
{manifest}
*/
const NS='{ns}';
{SHARED_JS}
{extra_js}
function checkOsid(){{const v=document.getElementById('osidField').value;document.getElementById('osidStatus').textContent=v.length===8?'AADITYA8 available (simulated)':v.length?'Need 8 chars':'Optional. Syncs with web account.'}}
function renderDocs(){{document.getElementById('docList').innerHTML=DOCS.map(d=>'<div class="tr"><div class="doc-ico '+d.t+'"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg></div><div class="tri"><div class="trn">'+d.n+'</div><div class="trm">'+d.s+' · '+d.u+'</div></div></div>').join('')}}
function bootShared(){{renderDocs();document.getElementById('settingsMount').innerHTML=settingsRows();document.getElementById('billingMount').innerHTML=billingHTML();setTheme(localStorage.getItem('aiimin-theme')||'light');const tg=document.getElementById('themeTg');if(tg)tg.classList.toggle('on',document.getElementById('pi').classList.contains('TD'));if(localStorage.getItem('aiimin-onboarding-complete')==='true'){{document.querySelectorAll('.ob-slide').forEach(s=>s.classList.remove('on'));document.getElementById('spl').classList.add('out')}}else document.getElementById('ob-splash')?.classList.add('on');setTimeout(()=>document.getElementById('spl')?.classList.add('out'),localStorage.getItem('aiimin-onboarding-complete')==='true'?0:1600)}}
window.addEventListener('load',()=>{{bootShared();if(typeof bootHome==='function')bootHome()}});
</script>
</body>
</html>"""
    return html

# Direction-specific builders follow in part 2
if __name__ == "__main__":
    print("Run generate_part2.py or full generate")
