#!/usr/bin/env python3
"""Build full-viewport mobile HTML prototypes from index-opus.html."""
import re
from pathlib import Path

from directions_v3 import (
    BILLING_SUB,
    CMD_PALETTE,
    DIRS,
    EXTRA_SCREENS,
)

SRC = Path("/Users/aaditya/Downloads/Prototyps-APP/index-opus.html")
OUT_DIRS = [
    Path("/Users/aaditya/Downloads/Prototyps-APP/v3-full"),
    Path("/Users/aaditya/Desktop/DASHBOARD PROJECT/frontend/prototypes/personal-os/v3-full"),
]

MOBILE_CSS = """
/* === V3 FULL MOBILE VIEWPORT === */
html,body{height:100%;overflow:hidden;margin:0;padding:0;}
body{font-family:var(--font-body);background:var(--bg);color:var(--text-1);
  display:block;padding:0;min-height:100dvh;}
.viewer-bar,.device::before,.island{display:none!important;}
.app-shell{
  width:100%;max-width:430px;margin:0 auto;height:100dvh;min-height:100dvh;
  display:flex;flex-direction:column;overflow:hidden;position:relative;
  background:var(--bg);background-image:var(--bg-grad);
  color:var(--text-1);transition:background var(--t3) var(--ease),color var(--t3) var(--ease);
}
@supports(padding:max(0px)){
  .statusbar{padding-top:max(6px,env(safe-area-inset-top));}
  .bottomnav,.hub-bar,.rail-actions-v3,.pulse-tabs-v3{padding-bottom:max(8px,env(safe-area-inset-bottom));}
}
@media(min-width:520px){
  body{background:#141414;}
  .app-shell{height:min(100dvh,920px);box-shadow:0 32px 80px -24px rgba(0,0,0,.75);}
}
[data-theme="light"]{--bg:#f9f9f9;--bg-grad:linear-gradient(180deg,#fafafa 0%,#f4f4f4 100%);}
[data-theme="light"] .app-shell{background:var(--bg);background-image:var(--bg-grad);}
.flame-stat{width:52px;height:52px;border-radius:14px;display:grid;place-items:center;
  background:var(--accent-soft);font-family:var(--font-display);font-weight:700;font-size:22px;color:var(--accent);}
.bottomnav-4 .navitem{flex:1;}
.hub-bar{display:flex;gap:6px;padding:10px 16px 12px;background:var(--nav-blur);
  backdrop-filter:blur(20px);border-top:1px solid var(--border);flex:0 0 auto;}
.hub-btn{flex:1;height:44px;border-radius:var(--r-full);font-size:12px;font-weight:700;
  color:var(--text-3);background:var(--surface-2);border:1px solid var(--border);}
.hub-btn.on{background:var(--accent);color:#fff;border-color:var(--accent);}
.layout-switch{display:flex;gap:8px;padding:0 0 14px;}
.board-cols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;min-height:360px;}
.board-col{background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-md);padding:10px;min-height:200px;}
.board-col-h{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px;display:flex;justify-content:space-between;}
.board-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:8px;cursor:grab;box-shadow:var(--shadow-card);}
.board-card b{display:block;font-size:13px;margin-bottom:4px;}
.board-card p{font-size:11px;color:var(--text-3);margin:0;}
.board-card.pinned{border-color:var(--accent-line);}
.timeline-nav{display:flex;gap:8px;padding:0 0 16px;}
.timeline-spine{position:relative;padding-left:28px;}
.timeline-spine::before{content:'';position:absolute;left:8px;top:0;bottom:0;width:2px;background:var(--border);}
.tl-now{font-size:12px;font-weight:700;color:var(--accent);margin-bottom:16px;display:flex;align-items:center;gap:8px;}
.pulse-dot{width:10px;height:10px;border-radius:50%;background:var(--accent);animation:pulseDot 1.4s ease infinite;}
@keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
.tl-block{position:relative;margin-bottom:18px;padding-left:8px;}
.tl-block time{font-size:11px;color:var(--text-3);font-weight:600;}
.tl-card{margin-top:6px;padding:12px 14px;border-radius:14px;background:var(--surface);border:1px solid var(--border);}
.tl-card.accent{border-color:var(--accent-line);box-shadow:0 0 0 1px var(--accent-soft);}
.tl-block.locked .tl-card{opacity:.65;border-style:dashed;}
.rail-actions-v3{position:absolute;left:0;right:0;bottom:0;display:flex;gap:10px;padding:12px 16px;
  background:var(--nav-blur);backdrop-filter:blur(20px);border-top:1px solid var(--border);z-index:55;}
.pulse-tabs-v3{display:flex;margin:0 16px 12px;background:var(--surface-2);border-radius:var(--r-full);padding:3px;border:1px solid var(--border);}
.pulse-tabs-v3 button{flex:1;height:44px;border-radius:var(--r-full);font-size:13px;font-weight:700;color:var(--text-3);}
.pulse-tabs-v3 button.on{background:var(--accent);color:#fff;}
.spatial-toolbar{display:flex;align-items:center;gap:8px;padding:12px 16px 8px;}
.spatial-wrap{flex:1;overflow:hidden;touch-action:none;position:relative;background:var(--sunken);}
.spatial-canvas{position:absolute;inset:0;width:100%;height:100%;transition:transform .2s var(--ease);}
.s-node{position:absolute;width:88px;padding:12px 10px;border-radius:16px;background:var(--surface);
  border:1px solid var(--border);box-shadow:var(--shadow-card);text-align:center;cursor:pointer;}
.s-node span{display:block;font-size:12px;font-weight:700;}
.s-node small{font-size:10px;color:var(--text-3);}
.s-node.core{border-color:var(--accent);background:var(--accent-soft);}
.s-edges{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}
.spatial-minimap{position:absolute;right:16px;bottom:80px;width:56px;height:80px;border-radius:10px;
  background:var(--surface);border:1px solid var(--border);opacity:.8;}
.cmd-palette{position:absolute;left:16px;right:16px;top:20%;z-index:200;background:var(--elevated);
  border:1px solid var(--border);border-radius:var(--r-lg);padding:12px;box-shadow:var(--shadow-pop);
  opacity:0;visibility:hidden;transform:translateY(-8px);transition:all var(--t2) var(--ease);}
.cmd-palette.show{opacity:1;visibility:visible;transform:none;}
.cmd-palette input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);
  background:var(--surface-2);color:var(--text-1);margin-bottom:8px;}
.cmd-item{padding:12px 10px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;}
.cmd-item:hover,.cmd-item:active{background:var(--accent-soft);color:var(--accent);}
.tier-card{border:1px solid var(--border);border-radius:var(--r-md);padding:14px;margin-bottom:10px;background:var(--surface);}
.tier-card.rec{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent-line);}
.osid{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;color:var(--accent);margin-top:4px;}
"""

SHARED_JS = """
function drawerGo(name){
  if(['habits','journal','focus','log'].includes(name)){go(name);return;}
  go(name);
}
let focusIv=null,focusSec=25*60;
function startFocusV3(){
  if(focusIv)return;
  focusIv=setInterval(()=>{
    focusSec--;
    const el=document.getElementById('focusTimer');
    if(el)el.textContent=Math.floor(focusSec/60)+':'+String(focusSec%60).padStart(2,'0');
    if(focusSec<=0){clearInterval(focusIv);focusIv=null;toast('Focus block complete');}
  },1000);
  toast('Focus started');
}
function renderTiers(){
  const el=document.getElementById('tierGrid');if(!el)return;
  const t=[
    ['Explore','Rs 0 forever','Log daily. Learn the loop.','Active',0],
    ['Core','Rs 29/mo','Complimentary at go-live','Upgrade',1],
    ['Pro','Rs 59/mo','Founding Rs 49/mo x 12','Upgrade',2],
    ['Elite','Rs 99/mo','Founding Rs 79/mo x 12','Switch',3],
  ];
  el.innerHTML=t.map(x=>'<div class="tier-card'+(x[4]===2?' rec':'')+'"><div style="display:flex;justify-content:space-between;align-items:center"><b>'+x[0]+'</b>'+(x[4]===2?'<span style="font-size:10px;color:var(--accent);font-weight:700">Recommended</span>':'')+'</div><div style="font-family:var(--font-display);font-size:20px;font-weight:700;margin:8px 0">'+x[1]+'</div><p style="font-size:12px;color:var(--text-3)">'+x[2]+'</p><button class="btn btn-soft" style="margin-top:10px;width:100%" onclick="toast(\\''+x[0]+' plan\\')">'+x[3]+'</button></div>').join('');
}
const CMD_ITEMS=[['today','Mission / Today'],['tasks','Tasks'],['notes','Notes'],['journal','Journal'],['habits','Habits'],['focus','Focus'],['calendar','Calendar'],['family','Family'],['billing','Subscription']];
function filterCmd(q){
  const el=document.getElementById('cmdList');if(!el)return;
  q=(q||'').toLowerCase();
  el.innerHTML=CMD_ITEMS.filter(x=>x[1].toLowerCase().includes(q)).map(x=>'<div class="cmd-item" onclick="cmdGo(\\''+x[0]+'\\')">'+x[1]+'</div>').join('');
}
function cmdGo(id){closePalette();closeAll();if(id==='billing')openSub('sub-billing');else if(['journal','habits','focus'].includes(id))drawerGo(id);else go(id);}
function initCmd(){filterCmd('');}
window.addEventListener('load',()=>{renderTiers();initCmd();});
"""

HOME_RE = re.compile(
    r'<section class="screen active" id="screen-today">.*?</section>',
    re.S,
)
NAV_RE = re.compile(r"<nav class=\"bottomnav\">.*?</nav>", re.S)
INJECT_SCREEN_RE = re.compile(
    r"(<section class=\"screen\" id=\"screen-search\">)",
    re.S,
)


def fix_brand(html: str) -> str:
    html = html.replace(
        "<title>AIIMIN — Personal OS</title>",
        "<title>AIIMIN — Personal OS</title>\n<link href=\"https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap\" rel=\"stylesheet\" />",
    )
    html = re.sub(r"<span class=\"wave\">[^<]*</span>", "", html)
    html = html.replace('<div class="flame">🔥</div>', '<div class="flame-stat">14</div>')
    html = html.replace("Task completed ✓", "Task completed")
    html = html.replace("Here's your plan. Deep Work is done ✅.", "Here's your plan. Deep Work is done.")
    html = html.replace(
        'style="width:66px;height:66px;border-radius:20px;margin:0 auto 18px;display:grid;place-items:center;background:var(--accent-soft);color:var(--accent)"',
        'style="width:66px;height:66px;border-radius:20px;margin:0 auto 18px;display:grid;place-items:center;background:var(--accent-soft);color:var(--accent)"',
    )
    html = html.replace(
        "background:linear-gradient(140deg,var(--violet),var(--blue))",
        "background:linear-gradient(140deg,#ff8c5f,#ff6b35)",
    )
    html = html.replace("· Pro member", "· Pro · till 10 Aug 2026")
    html = html.replace(
        '<div class="em">aaditya@aiimin.in · Pro · till 10 Aug 2026</div>',
        '<div class="em">aaditya@aiimin.in · Pro · till 10 Aug 2026</div><div class="osid">OS-ID: AADITYA8</div>',
    )
    html = html.replace(
        '<div class="settings-row"><div class="ico ic-violet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l3 6 6 .5-4.5 4 1.5 6-6-3.5L6 18.5 7.5 12.5 3 8.5 9 8z"/></svg></div><div class="t">Subscription</div><span class="v">Pro</span></div>',
        '<div class="settings-row" onclick="openSub(\'sub-billing\')"><div class="ico ic-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2"/></svg></div><div class="t">Subscription</div><span class="v">Pro</span><svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></div>',
    )
    html = html.replace('<button class="key" style="background:none;border:none">🙂</button>', '<button class="key" style="background:none;border:none"></button>')
    html = html.replace('<span class="ico ic-orange">🔥</span>', '<span class="ico ic-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18"><path d="M12 2c1 3 3 4 3 7a3 3 0 1 1-6 0c0-2 2-4 3-7z"/></svg></span>')
    html = html.replace("You hit a 12-day streak 🔥", "You hit a 12-day streak")
    html = html.replace("Interactive prototype · iPhone 16 Pro", "Native companion · full mobile")
    html = html.replace("Your personal OS copilot", "Assistant thread · no character chrome")
    html = html.replace("Good morning,<br>Aaditya", "Good afternoon,<br>Aaditya")
    # Drawer links for new screens
    html = html.replace(
        '<a class="ditem" onclick="drawerGo(\'notes\')">',
        '<a class="ditem" onclick="drawerGo(\'habits\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12h16M12 4v16"/></svg>Habits</a>\n        <a class="ditem" onclick="drawerGo(\'journal\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/></svg>Journal</a>\n        <a class="ditem" onclick="drawerGo(\'focus\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/></svg>Focus</a>\n        <a class="ditem" onclick="drawerGo(\'log\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h10"/></svg>Daily Log</a>\n        <a class="ditem" onclick="openSub(\'sub-billing\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2"/></svg>Subscription</a>\n        <a class="ditem" onclick="drawerGo(\'notes\')">',
    )
    return html


def mobile_shell(html: str) -> str:
    html = re.sub(
        r"<!-- Viewer chrome -->.*?</div>\s*<!-- Device -->\s*<div class=\"device\">\s*<div class=\"screen-frame\" id=\"frame\">\s*<div class=\"island\"></div>",
        '<div class="app-shell" id="frame">',
        html,
        count=1,
        flags=re.S,
    )
    html = html.replace("  </div><!-- /screen-frame -->\n</div><!-- /device -->", "  </div><!-- /app-shell -->")
    html = html.replace("</style>", MOBILE_CSS + "\n</style>", 1)
    # body background override
    html = re.sub(
        r"body\{[^}]+\}",
        "body{margin:0;padding:0;min-height:100dvh;background:var(--bg);}",
        html,
        count=1,
    )
    return html


def patch_go_function(html: str, nav_screens: str) -> str:
    return html.replace(
        "const navScreens=['today','tasks','notes','family'];",
        f"const navScreens={nav_screens};",
        1,
    )


def patch_close_all(html: str) -> str:
    old = "function closeAll(){ ['drawer','sheet'].forEach(x=>document.getElementById(x).classList.remove('show')); document.getElementById('scrim').classList.remove('show'); }"
    new = "function closeAll(){ ['drawer','sheet'].forEach(x=>document.getElementById(x)?.classList.remove('show')); document.getElementById('scrim')?.classList.remove('show'); closePalette(); }"
    return html.replace(old, new)


def build_one(raw: str, fname: str, cfg: dict) -> str:
    html = mobile_shell(raw)
    html = fix_brand(html)
    html = HOME_RE.sub(cfg["home"].strip(), html, count=1)
    html = NAV_RE.sub(cfg["nav"].strip(), html, count=1)
    html = INJECT_SCREEN_RE.sub(EXTRA_SCREENS + r"\1", html, count=1)
    html = html.replace("      <!-- SETTINGS -->", BILLING_SUB + "\n      <!-- SETTINGS -->", 1)
    html = html.replace(
        '    <div id="toast"',
        CMD_PALETTE + '\n    <div id="toast"',
        1,
    )
    html = re.sub(r"<title>[^<]+</title>", f"<title>{cfg['title']} · AIIMIN</title>", html, count=1)

    # Direction JS + shared helpers before closing script
    html = html.replace(
        "function buildCalendar(){",
        cfg["js"].strip() + "\n" + SHARED_JS.strip() + "\nfunction buildCalendar(){",
        1,
    )
    nav_match = re.search(r"const navScreens=\[[^\]]+\];", html)
    if nav_match and "const navScreens=" in cfg["js"]:
        ns = re.search(r"const navScreens=(\[[^\]]+\]);", cfg["js"])
        if ns:
            html = html.replace(nav_match.group(0), f"const navScreens={ns.group(1)};", 1)
    html = patch_close_all(html)
    return html


def build():
    raw = SRC.read_text(encoding="utf-8")
    for out_dir in OUT_DIRS:
        out_dir.mkdir(parents=True, exist_ok=True)
    for fname, cfg in DIRS.items():
        html = build_one(raw, fname, cfg)
        for out_dir in OUT_DIRS:
            (out_dir / fname).write_text(html, encoding="utf-8")
        lines = html.count("\n") + 1
        print(f"Wrote {fname} ({len(html)} bytes, {lines} lines)")

    index = """<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>AIIMIN Native · Full Mobile Prototypes</title>
<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@700;800&family=Figtree:wght@400;600&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}body{margin:0;font-family:Figtree,sans-serif;background:#1a1a1a;color:#f3f2ef;min-height:100vh;padding:24px 20px 48px}
.wrap{max-width:480px;margin:0 auto}
h1{font-family:'Familjen Grotesk',sans-serif;color:#ff6b35;font-size:28px;margin:0 0 8px}
.lead{color:#9ca3af;font-size:14px;line-height:1.5;margin-bottom:24px}
.card{display:block;background:#2d2d2d;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px;text-decoration:none;color:inherit;transition:border-color .2s}
.card:hover,.card:active{border-color:#ff6b35}
.card b{color:#ff6b35;font-family:'Familjen Grotesk',sans-serif;font-size:17px;display:block;margin-bottom:6px}
.card p{margin:0;font-size:13px;color:#b5b0aa;line-height:1.45}
.note{margin-top:28px;font-size:12px;color:#6b7280;line-height:1.5}
</style></head><body><div class="wrap">
<h1>AIIMIN Native</h1>
<p class="lead">Full-viewport mobile prototypes. Open on phone or narrow browser — app fills the screen. Onboarding, billing, all domains.</p>
<a class="card" href="aiimin-a-mission-control.html"><b>A · Mission Control</b><p>Dense metrics dashboard · command palette · 4-tab nav</p></a>
<a class="card" href="aiimin-b-companion.html"><b>B · Companion</b><p>Conversation home · hub chips · docked composer</p></a>
<a class="card" href="aiimin-c-workspace.html"><b>C · Workspace</b><p>Drag board Now/Next/Pin · layout switcher</p></a>
<a class="card" href="aiimin-d-timeline.html"><b>D · Timeline</b><p>Vertical day spine · Now pulse · Log+Focus bar</p></a>
<a class="card" href="aiimin-e-spatial.html"><b>E · Spatial</b><p>Pan/zoom domain canvas · node sheets</p></a>
<p class="note">Built from index-opus craft layer. Palette locked. No device frame — real mobile layout. Clear site data to replay onboarding.</p>
</div></body></html>"""
    for out_dir in OUT_DIRS:
        (out_dir / "index.html").write_text(index, encoding="utf-8")
    print("Wrote index.html to", ", ".join(str(d) for d in OUT_DIRS))


if __name__ == "__main__":
    build()
