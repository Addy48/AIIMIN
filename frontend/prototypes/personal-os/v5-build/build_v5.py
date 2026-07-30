#!/usr/bin/env python3
"""v5 — opus-fork prototypes. Keeps device frame + flows; surgical direction swaps only."""
import re
from pathlib import Path

from direction_css import V5_CSS
from directions_v5 import DIRS
from shared_v5 import BILLING_SUB, CMD_PALETTE, EXTRA_SCREENS, SHARED_JS

SRC = Path("/Users/aaditya/Downloads/Prototyps-APP/index-opus.html")
OUT_DIRS = [
    Path("/Users/aaditya/Downloads/Prototyps-APP/v5-opus"),
    Path("/Users/aaditya/Desktop/DASHBOARD PROJECT/frontend/prototypes/personal-os/v5-opus"),
]

HOME_RE = re.compile(
    r'<section class="screen active" id="screen-today">.*?</section>',
    re.S,
)
NAV_RE = re.compile(r"<nav class=\"bottomnav\">.*?</nav>", re.S)
EXTRA_INJECT_RE = re.compile(r"(<section class=\"screen\" id=\"screen-search\">)", re.S)


def build_one(raw: str, cfg: dict) -> str:
    html = raw
    html = HOME_RE.sub(cfg["home"].strip(), html, count=1)
    html = NAV_RE.sub(cfg["nav"].strip(), html, count=1)
    html = EXTRA_INJECT_RE.sub(EXTRA_SCREENS + r"\1", html, count=1)
    html = html.replace("      <!-- SETTINGS -->", BILLING_SUB + "\n      <!-- SETTINGS -->", 1)
    html = re.sub(r"<title>[^<]+</title>", f"<title>{cfg['title']} · AIIMIN</title>", html, count=1)
    html = re.sub(
        r'<span class="viewer-hint">[^<]+</span>',
        f'<span class="viewer-hint">{cfg["hint"]}</span>',
        html,
        count=1,
    )
    html = html.replace("</style>", V5_CSS + "\n</style>", 1)

    if cfg.get("cmd"):
        html = html.replace("    <!-- toast -->", CMD_PALETTE + "\n    <!-- toast -->", 1)
    else:
        html = html.replace(
            'document.getElementById(\'cmdPalette\')?.classList.remove(\'show\');',
            "",
        )

    html = html.replace(
        '<div class="settings-row"><div class="ico ic-violet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l3 6 6 .5-4.5 4 1.5 6-6-3.5L6 18.5 7.5 12.5 3 8.5 9 8z"/></svg></div><div class="t">Subscription</div><span class="v">Pro</span></div>',
        '<div class="settings-row" onclick="openSub(\'sub-billing\')"><div class="ico ic-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2"/></svg></div><div class="t">Subscription</div><span class="v">Pro</span><svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></div>',
        1,
    )

    nav_match = re.search(r"const navScreens=\[[^\]]+\];", cfg["js"])
    nav_line = nav_match.group(0) if nav_match else "const navScreens=['today'];"
    dir_js = cfg["js"][nav_match.end() :].strip() if nav_match else cfg["js"].strip()

    html = re.sub(
        r"const navScreens=\[[^\]]+\];",
        nav_line,
        html,
        count=1,
    )

    html = html.replace(
        "function closeAll(){ ['drawer','sheet'].forEach(x=>document.getElementById(x).classList.remove('show')); document.getElementById('scrim').classList.remove('show'); }",
        "function closeAll(){ ['drawer','sheet'].forEach(x=>document.getElementById(x)?.classList.remove('show')); document.getElementById('scrim')?.classList.remove('show'); if(typeof closePalette==='function')closePalette(); document.getElementById('cmdPalette')?.classList.remove('show'); }",
        1,
    )

    html = html.replace(
        "/* ---------------- Builders ---------------- */",
        dir_js
        + "\n"
        + SHARED_JS.strip()
        + "\n/* ---------------- Builders ---------------- */",
        1,
    )

    return html


def build():
    raw = SRC.read_text(encoding="utf-8")
    for d in OUT_DIRS:
        d.mkdir(parents=True, exist_ok=True)
    for fname, cfg in DIRS.items():
        html = build_one(raw, cfg)
        for out in OUT_DIRS:
            (out / fname).write_text(html, encoding="utf-8")
        print(f"Wrote {fname} ({len(html)} bytes)")

    cards = "\n".join(
        f'<a class="card" href="{fn}"><b>{DIRS[fn]["title"]}</b><p>{DIRS[fn]["hint"]}</p></a>'
        for fn in DIRS
    )
    index = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AIIMIN · Opus-quality prototypes</title>
<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@700&family=Figtree:wght@400;600&display=swap" rel="stylesheet">
<style>body{{margin:0;font-family:Figtree,sans-serif;background:#141210;color:#f3f2ef;padding:24px 20px 48px}}.wrap{{max-width:520px;margin:0 auto}}h1{{font-family:'Familjen Grotesk',sans-serif;color:#ff6b35;font-size:28px}}p.lead{{color:#9ca3af;font-size:14px;line-height:1.55}}.card{{display:block;background:#2d2d2d;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin:12px 0;text-decoration:none;color:inherit}}.card b{{color:#ff6b35;font-family:'Familjen Grotesk',sans-serif;font-size:17px}}.card p{{margin:6px 0 0;font-size:13px;color:#b5b0aa}}</style></head><body><div class="wrap">
<h1>AIIMIN v5 · Opus fork</h1>
<p class="lead">Built from index-opus.html — iPhone frame, splash → onboarding → auth, all screens intact. Five distinct IA directions. Theme toggle works.</p>
{cards}
</div></body></html>"""
    for out in OUT_DIRS:
        (out / "index.html").write_text(index, encoding="utf-8")
    print(f"Wrote index.html → {', '.join(str(d) for d in OUT_DIRS)}")


if __name__ == "__main__":
    build()
