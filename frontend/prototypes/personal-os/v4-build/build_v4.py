#!/usr/bin/env python3
"""v4 — full mobile prototypes with production onboarding, tour, sync, real logs."""
import re
import sys
from pathlib import Path

# reuse direction homes/nav from v3
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "v3-build"))
from directions_v3 import (  # noqa: E402
    BILLING_SUB,
    CMD_PALETTE,
    DIRS,
    EXTRA_SCREENS,
)
from polish import POLISH_CSS, POLISH_JS  # noqa: E402
from production_fidelity import (  # noqa: E402
    LOGO_MARK,
    PROD_CSS,
    PRODUCTION_FLOWS,
    PRODUCTION_JS,
    PRODUCT_TOUR_HTML,
    REAL_ACTIVITY_ROWS,
    REAL_FINANCE_TXNS,
    SYNC_BANNER,
    SYNC_SETTINGS_BLOCK,
)

SRC = Path("/Users/aaditya/Downloads/Prototyps-APP/index-opus.html")
OUT_DIRS = [
    Path("/Users/aaditya/Downloads/Prototyps-APP/v4-full"),
    Path("/Users/aaditya/Desktop/DASHBOARD PROJECT/frontend/prototypes/personal-os/v4-full"),
]

# v3 mobile shell CSS (trimmed import — same as build_v3)
MOBILE_CSS = Path(__file__).resolve().parent.parent.joinpath("v3-build/build_v3.py").read_text()
_m = re.search(r'MOBILE_CSS = """(.*?)"""', MOBILE_CSS, re.S)
MOBILE_CSS = (_m.group(1) if _m else "") + PROD_CSS + POLISH_CSS

FLOWS_RE = re.compile(
    r"<!-- =============== FLOWS =============== -->.*?<!-- =============== MAIN APP =============== -->",
    re.S,
)
HOME_RE = re.compile(
    r'<section class="screen active" id="screen-today">.*?</section>',
    re.S,
)
NAV_RE = re.compile(r"<nav class=\"bottomnav\">.*?</nav>", re.S)
EXTRA_INJECT_RE = re.compile(
    r"(<section class=\"screen\" id=\"screen-search\">)",
    re.S,
)
LEGACY_FLOW_RE = re.compile(
    r"/\* ---------------- Flow control ---------------- \*/.*?function signOut\(\)\{[^}]+\}\s*\n",
    re.S,
)
BRAND_MARK_RE = re.compile(
    r'<div class="mark">A</div>',
)


def mobile_shell(html: str) -> str:
    html = re.sub(
        r"<!-- Viewer chrome -->.*?</div>\s*<!-- Device -->\s*<div class=\"device\">\s*<div class=\"screen-frame\" id=\"frame\">\s*<div class=\"island\"></div>",
        '<div class="app-shell" id="frame">',
        html,
        count=1,
        flags=re.S,
    )
    html = html.replace(
        "  </div><!-- /screen-frame -->\n</div><!-- /device -->",
        "  </div><!-- /app-shell -->",
    )
    html = html.replace("</style>", MOBILE_CSS + "\n</style>", 1)
    html = re.sub(
        r"body\{[^}]+\}",
        "body{margin:0;padding:0;min-height:100dvh;background:var(--bg);}",
        html,
        count=1,
    )
    return html


def fix_brand(html: str) -> str:
    html = html.replace(
        "<title>AIIMIN — Personal OS</title>",
        "<title>AIIMIN — Personal OS</title>\n"
        '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />',
    )
    html = re.sub(r"<span class=\"wave\">[^<]*</span>", "", html)
    html = html.replace('<div class="flame">🔥</div>', '<div class="flame-stat">14</div>')
    html = html.replace("Task completed ✓", "Task completed")
    html = html.replace(
        "background:linear-gradient(140deg,var(--violet),var(--blue))",
        "background:linear-gradient(140deg,#ff8c5f,#ff6b35)",
    )
    html = html.replace("· Pro member", "· Pro · till 10 Aug 2026")
    html = html.replace(
        '<div class="em">aaditya@aiimin.in · Pro · till 10 Aug 2026</div>',
        '<div class="em">aaditya@aiimin.in · Pro · till 10 Aug 2026</div>'
        '<div class="osid">OS-ID AADITYA@</div>',
    )
    html = html.replace(
        '<div class="settings-row"><div class="ico ic-violet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l3 6 6 .5-4.5 4 1.5 6-6-3.5L6 18.5 7.5 12.5 3 8.5 9 8z"/></svg></div><div class="t">Subscription</div><span class="v">Pro</span></div>',
        '<div class="settings-row" onclick="openSub(\'sub-billing\')"><div class="ico ic-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2"/></svg></div><div class="t">Subscription</div><span class="v">Pro</span><svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></div>',
    )
    html = html.replace('<button class="key" style="background:none;border:none">🙂</button>', "")
    html = BRAND_MARK_RE.sub(LOGO_MARK.replace('class="logo-mark"', 'class="logo-mark" style="width:38px;height:38px"'), html)
    html = html.replace('<div class="splash-mark">A</div>', LOGO_MARK.replace('class="logo-mark"', 'class="logo-mark splash-logo"'))
    html = html.replace(
        '<div class="dgroup" style="padding-left:2px">Data & Sync</div>',
        SYNC_SETTINGS_BLOCK + '\n        <div class="dgroup" style="padding-left:2px">Data & Sync</div>',
        1,
    )
    html = html.replace(
        '<a class="ditem" onclick="drawerGo(\'notes\')">',
        '<a class="ditem" onclick="drawerGo(\'habits\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12h16"/></svg>Habits</a>\n'
        '<a class="ditem" onclick="drawerGo(\'journal\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/></svg>Journal</a>\n'
        '<a class="ditem" onclick="drawerGo(\'focus\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/></svg>Focus</a>\n'
        '<a class="ditem" onclick="drawerGo(\'log\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16"/></svg>Daily Log</a>\n'
        '<a class="ditem" onclick="openSub(\'sub-billing\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2"/></svg>Subscription</a>\n'
        '<a class="ditem" onclick="startProductTour()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/></svg>Product tour</a>\n'
        '<a class="ditem" onclick="drawerGo(\'notes\')">',
    )
    html = html.replace(
        '<div class="qa"><span class="ico ic-orange">🔥</span><span>Streak 12</span></div>',
        '<div class="qa"><span class="ico ic-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18"><path d="M12 2c1 3 3 4 3 7a3 3 0 1 1-6 0c0-2 2-4 3-7z"/></svg></span><span>Streak 14</span></div>',
    )
    html = html.replace("You hit a 12-day streak 🔥", "You hit a 14-day streak")
    html = html.replace(
        '<div class="settings-row"><div class="ico ic-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg></div><div class="t">Appearance</div>',
        '<div class="settings-row" onclick="startProductTour()"><div class="ico ic-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2 2"/></svg></div><div class="t">Product tour</div><svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></div>\n'
        '          <div class="settings-row"><div class="ico ic-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg></div><div class="t">Appearance</div>',
    )
    return html


def enrich_home(home: str) -> str:
    block = """
          <div class="sec-head"><span class="sec-title">Recent · web sync</span><span class="sec-link" onclick="simulateSync(true)">Sync now</span></div>
          <div class="card list">""" + REAL_ACTIVITY_ROWS + """
          </div>
          <div class="sec-head"><span class="sec-title">Finance · INR</span><span class="sec-link" onclick="toast('Opens web Finance')">73.6% budget</span></div>
          <div class="card list">""" + REAL_FINANCE_TXNS + """
          </div>"""
    if "</section>" in home:
        return home.replace("</section>", block + "\n        </section>", 1)
    return home


def build_one(raw: str, cfg: dict) -> str:
    html = mobile_shell(raw)
    html = fix_brand(html)
    html = FLOWS_RE.sub(
        "<!-- =============== FLOWS =============== -->\n" + PRODUCTION_FLOWS + "\n    <!-- =============== MAIN APP =============== -->",
        html,
        count=1,
    )
    html = HOME_RE.sub(enrich_home(cfg["home"].strip()), html, count=1)
    html = EXTRA_INJECT_RE.sub(EXTRA_SCREENS + r"\1", html, count=1)
    html = NAV_RE.sub(cfg["nav"].strip(), html, count=1)
    html = html.replace("      <!-- SETTINGS -->", BILLING_SUB + "\n      <!-- SETTINGS -->", 1)
    html = html.replace(
        '<div class="topbar">',
        SYNC_BANNER + '\n      <div class="topbar">',
        1,
    )
    html = html.replace(
        '    <div id="toast"',
        CMD_PALETTE + "\n" + PRODUCT_TOUR_HTML + '\n    <div id="toast"',
        1,
    )
    html = re.sub(r"<title>[^<]+</title>", f"<title>{cfg['title']} · AIIMIN</title>", html, count=1)

    html = html.replace(
        "window.addEventListener('load',()=>{\n  buildSpark(); buildCalendar();\n  document.getElementById('apToggle').classList.add('on');\n  setTimeout(()=>{ transitionFlow('splash','onboarding'); },2100);\n});",
        "/* v4: production boot in PRODUCTION_JS */",
        1,
    )
    html = LEGACY_FLOW_RE.sub("/* v4: legacy flow stripped */\n", html, count=1)
    dir_js = re.sub(r"const navScreens=\[[^\]]+\];\s*", "", cfg["js"].strip(), count=1)
    html = html.replace(
        "function buildCalendar(){",
        dir_js
        + "\n"
        + PRODUCTION_JS.strip()
        + "\n"
        + POLISH_JS.strip()
        + "\nfunction buildCalendar(){",
        1,
    )
    nav_match = re.search(r"const navScreens=\[[^\]]+\];", html)
    if nav_match and "const navScreens=" in cfg["js"]:
        ns = re.search(r"const navScreens=(\[[^\]]+\]);", cfg["js"])
        if ns:
            html = html.replace(nav_match.group(0), f"const navScreens={ns.group(1)};", 1)

    old_close = "function closeAll(){ ['drawer','sheet'].forEach(x=>document.getElementById(x).classList.remove('show')); document.getElementById('scrim').classList.remove('show'); }"
    new_close = "function closeAll(){ ['drawer','sheet'].forEach(x=>document.getElementById(x)?.classList.remove('show')); document.getElementById('scrim')?.classList.remove('show'); if(typeof closePalette==='function')closePalette(); }"
    html = html.replace(old_close, new_close)
    return html


def build():
    raw = SRC.read_text(encoding="utf-8")
    for d in OUT_DIRS:
        d.mkdir(parents=True, exist_ok=True)
    for fname, cfg in DIRS.items():
        html = build_one(raw, cfg)
        for out in OUT_DIRS:
            (out / fname).write_text(html, encoding="utf-8")
        print(f"Wrote {fname} ({len(html)} bytes, {html.count(chr(10))+1} lines)")

    index = """<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>AIIMIN Native · Production Fidelity</title>
<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@700;800&family=Figtree:wght@400;600&display=swap" rel="stylesheet">
<style>body{margin:0;font-family:Figtree,sans-serif;background:#1a1a1a;color:#f3f2ef;padding:24px 20px 48px}.wrap{max-width:480px;margin:0 auto}h1{font-family:'Familjen Grotesk',sans-serif;color:#ff6b35;font-size:28px}p.lead{color:#9ca3af;font-size:14px;line-height:1.55}.card{display:block;background:#2d2d2d;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin:12px 0;text-decoration:none;color:inherit}.card b{color:#ff6b35;font-family:'Familjen Grotesk',sans-serif;font-size:17px}.card p{margin:6px 0 0;font-size:13px;color:#b5b0aa;line-height:1.45}.note{font-size:12px;color:#6b7280;margin-top:24px;line-height:1.5}</style></head><body><div class="wrap">
<h1>AIIMIN v4 · Production fidelity</h1>
<p class="lead">Full-screen mobile with motion polish. 10-step onboarding · bootstrap sync · 8-stop tour · real logs. v4.1 — responsive, transitions, touch feedback.</p>
<a class="card" href="aiimin-a-mission-control.html"><b>A · Mission Control</b><p>Dense dashboard · ⌘K · sync banner</p></a>
<a class="card" href="aiimin-b-companion.html"><b>B · Companion</b><p>Chat home · hub bar · composer logs to sync batch</p></a>
<a class="card" href="aiimin-c-workspace.html"><b>C · Workspace</b><p>Kanban board · drag cards</p></a>
<a class="card" href="aiimin-d-timeline.html"><b>D · Timeline</b><p>Day spine · Now pulse</p></a>
<a class="card" href="aiimin-e-spatial.html"><b>E · Spatial</b><p>Domain canvas</p></a>
<p class="note">Clear localStorage + sessionStorage to replay onboarding. Settings → Data &amp; Sync shows bootstrap cursor. Drawer → Product tour.</p>
</div></body></html>"""
    for out in OUT_DIRS:
        (out / "index.html").write_text(index, encoding="utf-8")
    print("Wrote index.html →", ", ".join(str(d) for d in OUT_DIRS))


if __name__ == "__main__":
    build()
