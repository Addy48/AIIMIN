#!/usr/bin/env python3
"""Transform full source prototype into 5 native direction builds."""
import re
from pathlib import Path

SRC = Path("/Users/aaditya/Downloads/Prototyps-APP/aiimin-prototype copy.html")
OUT = Path("/Users/aaditya/Downloads/Prototyps-APP/v2-directions")

# --- Global fixes applied to all builds ---
def fix_tokens(css: str) -> str:
    css = css.replace("--bg:#EDE8DF", "--bg:#f9f9f9")
    css = css.replace("--sf:#FFFFFF", "--sf:#ffffff")
    css = css.replace("--bg:#131110", "--bg:#1a1a1a")
    css = css.replace("--sf:#1E1C1A", "--sf:#2d2d2d")
    css = css.replace("--el:#F3EDE4", "--el:#f0f0f0")
    css = css.replace("--el:#262422", "--el:#262626")
    css = css.replace("--t1:#0F0C08", "--t1:#1a1a1a")
    css = css.replace("--t1:#F0EAE0", "--t1:#f3f2ef")
    css = css.replace("--brand:#FF6B35", "--brand:#ff6b35")
    # Solid metric text (no gradient clip)
    css = re.sub(
        r"\.srnum\{[^}]+\}",
        ".srnum{font-family:var(--FD);font-size:26px;font-weight:800;color:var(--t1);letter-spacing:-.02em;line-height:1}",
        css,
    )
    css = re.sub(
        r"\.gob\{[^}]+\}",
        ".gob{font-family:var(--FD);font-size:44px;font-weight:800;color:var(--t1);letter-spacing:-.03em;line-height:1}",
        css,
    )
    css = re.sub(
        r"\.splo\{[^}]+\}",
        ".splo{font-family:var(--FD);font-size:50px;font-weight:800;letter-spacing:-.04em;color:var(--brand);animation:pi2 .5s .15s both}",
        css,
    )
    css = css.replace("#sc-ai{flex-direction:column;}", "")
    css = css.replace(
        ".bp{background:rgba(139,92,246,.1);color:#8B5CF6;border:1px solid rgba(139,92,246,.2);}",
        ".bp{background:rgba(255,107,53,.1);color:var(--brand);border:1px solid rgba(255,107,53,.2);}",
    )
    return css

def fix_slop(html: str) -> str:
    # Metric gradient text -> solid (inline overrides)
    html = re.sub(
        r"\.srnum\{[^}]+\}",
        ".srnum{font-family:var(--FD);font-size:26px;font-weight:800;color:var(--t1);letter-spacing:-.02em;line-height:1}",
        html,
    )
    html = re.sub(
        r"\.gob\{[^}]+\}",
        ".gob{font-family:var(--FD);font-size:44px;font-weight:800;color:var(--t1);letter-spacing:-.03em;line-height:1}",
        html,
    )
    # Splash wordmark solid orange (safer)
    html = re.sub(
        r"\.splo\{[^}]+\}",
        ".splo{font-family:var(--FD);font-size:50px;font-weight:800;letter-spacing:-.04em;color:var(--brand);animation:pi2 .5s .15s both}",
        html,
    )
    # Remove footer slop
    html = html.replace(
        "AIIMIN Personal OS &middot; Built with love in India &middot; MUJ Batch 2026",
        "AIIMIN Personal OS &middot; v2.4.1",
    )
    # Greeting without emoji
    html = re.sub(
        r"if\(h<12\)gl\.textContent='Good morning[^']*'",
        "if(h<12)gl.textContent='Good morning'",
        html,
    )
    html = re.sub(
        r"else if\(h<17\)gl\.textContent='Good afternoon[^']*'",
        "else if(h<17)gl.textContent='Good afternoon'",
        html,
    )
    html = re.sub(
        r"else gl\.textContent='Good evening[^']*'",
        "else gl.textContent='Good evening'",
        html,
    )
    html = html.replace('<div class="gline" id="gline">Good morning &#x1F44B;</div>', '<div class="gline" id="gline">Good morning</div>')
    # Settings icon chips -> orange/neutral only
    html = re.sub(r'style="background:#8B5CF6;"', 'style="background:var(--el);"', html)
    html = re.sub(r'style="background:#3B82F6;"', 'style="background:var(--el);"', html)
    html = re.sub(r'style="background:#EF4444;"', 'style="background:var(--el);"', html)
    html = re.sub(r'style="background:#F59E0B;"', 'style="background:var(--el);"', html)
    html = re.sub(r'style="background:#10B981;"', 'style="background:var(--el);"', html)
    # Zip purple -> neutral
    html = html.replace('background:#8B5CF6;', 'background:#6b7280;')
    # Remove entire AI chat screen (not native scope)
    html = re.sub(r'<div class="sc" id="sc-ai">.*?</div>\s*(?=<div class="sc" id="sc-calendar">)', '', html, flags=re.S)
    # Remove AI quick action
    html = html.replace(
        '<div class="qi" onclick="goto(\'ai\')"><div class="qib"><svg stroke="var(--brand)" viewBox="0 0 24 24"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg></div><div class="ql">AI Chat</div></div>\n    ',
        "",
    )
    # Habit emoji -> initials in stroke circles
    habit_map = [
        ("&#9728;&#65039;", "AM"), ("&#x1F4A7;", "H2O"), ("&#x1F3C3;", "Run"), ("&#x1F4AA;", "Gym"),
        ("&#x1F4DA;", "Read"), ("&#x1F4BB;", "Code"), ("&#x1F9D8;", "Med"), ("&#x270D;&#65039;", "Jrnl"),
    ]
    for em, txt in habit_map:
        html = html.replace(f'<div class="hr on">{em}</div>', f'<div class="hr on"><span class="hinit">{txt}</span></div>')
        html = html.replace(f'<div class="hr">{em}</div>', f'<div class="hr"><span class="hinit">{txt}</span></div>')
    if ".hinit{" not in html:
        html = html.replace(
            ".hn{font-size:9.5px;",
            ".hinit{font-size:10px;font-weight:800;color:var(--t2)}.hn{font-size:9.5px;",
        )
    # Note card emoji -> icon chip
    note_fixes = [
        ("&#x1F4CB;", "RM"), ("&#x2601;&#65039;", "CLD"), ("&#x1F4D6;", "BK"),
        ("&#x1F3D7;&#65039;", "AWS"), ("&#x1F4AD;", "REF"), ("&#x1F52C;", "EEG"),
    ]
    for em, txt in note_fixes:
        html = html.replace(f'<div class="nem">{em}</div>', f'<div class="nem"><span class="hinit">{txt}</span></div>')
    # Goal emoji
    for em, txt in [("&#x1F680;", "P"), ("&#x1F4BC;", "C"), ("&#x1F4DA;", "L"), ("&#x1F4BB;", "D")]:
        html = html.replace(f'<div class="goem">{em}</div>', f'<div class="goem"><span class="hinit">{txt}</span></div>')
    # Family avatars -> initials
    html = re.sub(
        r'<div class="fmav" style="background:[^"]+;">[^<]+<div class="fmrd">',
        lambda m: m.group(0).split(">")[0] + ">M<div class=\"fmrd\">" if "Mom" in m.group(0) else m.group(0),
        html,
    )
    # Simpler family fix
    html = html.replace('<div class="fmav" style="background:#FEE2E2;">&#x1F60A;', '<div class="fmav" style="background:var(--soft);"><span class="hinit">M</span>')
    html = html.replace('<div class="fmav" style="background:#DBEAFE;">&#x1F468;', '<div class="fmav" style="background:var(--el);"><span class="hinit">D</span>')
    html = html.replace('<div class="fmav" style="background:#F3E8FF;">&#x1F467;', '<div class="fmav" style="background:var(--el);"><span class="hinit">R</span>')
    html = html.replace('<div class="fmav" style="background:rgba(255,107,53,.12);">&#x1F466;', '<div class="fmav" style="background:var(--soft);"><span class="hinit">Y</span>')
    # Notification icons -> stroke chips
    for em in ["&#x1F525;", "&#x1F4CB;", "&#x2705;", "&#x1F4D6;", "&#x1F3AF;", "&#x1F4B0;"]:
        html = html.replace(f'<div class="nfic" style="background:rgba(255,107,53,.12);">{em}</div>', '<div class="nfic" style="background:var(--soft);"><svg width="18" height="18" stroke="var(--brand)" fill="none" stroke-width="2"><path d="M12 2v4M12 18v4"/></svg></div>')
        html = html.replace(f'<div class="nfic" style="background:rgba(139,92,246,.12);">{em}</div>', '<div class="nfic" style="background:var(--el);"><svg width="18" height="18" stroke="var(--brand)" fill="none" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></div>')
        html = html.replace(f'<div class="nfic" style="background:rgba(16,185,129,.12);">{em}</div>', '<div class="nfic" style="background:var(--el);"><svg width="18" height="18" stroke="var(--done)" fill="none" stroke-width="2"><polyline points="4,12 9,17 20,6"/></svg></div>')
        html = html.replace(f'<div class="nfic" style="background:rgba(245,158,11,.12);">{em}</div>', '<div class="nfic" style="background:var(--el);"><svg width="18" height="18" stroke="var(--brand)" fill="none" stroke-width="2"><path d="M12 20h9"/></svg></div>')
        html = html.replace(f'<div class="nfic" style="background:rgba(59,130,246,.12);">{em}</div>', '<div class="nfic" style="background:var(--el);"><svg width="18" height="18" stroke="var(--brand)" fill="none" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/></svg></div>')
    # Finance category emoji -> letters
    fin_map = [("&#x1F354;", "FD"), ("&#x1F697;", "TR"), ("&#x1F3AE;", "EN"), ("&#x1F4D7;", "ED"), ("&#x1F48A;", "HL"), ("&#x1F6D2;", "OT")]
    for em, t in fin_map:
        html = html.replace(f'<div class="cic" style="background:rgba(239,68,68,.12);">{em}</div>', f'<div class="cic" style="background:var(--el);"><span class="hinit">{t}</span></div>')
        html = html.replace(f'<div class="cic" style="background:rgba(59,130,246,.12);">{em}</div>', f'<div class="cic" style="background:var(--el);"><span class="hinit">{t}</span></div>')
        html = html.replace(f'<div class="cic" style="background:rgba(139,92,246,.12);">{em}</div>', f'<div class="cic" style="background:var(--el);"><span class="hinit">{t}</span></div>')
        html = html.replace(f'<div class="cic" style="background:rgba(245,158,11,.12);">{em}</div>', f'<div class="cic" style="background:var(--el);"><span class="hinit">{t}</span></div>')
        html = html.replace(f'<div class="cic" style="background:rgba(16,185,129,.12);">{em}</div>', f'<div class="cic" style="background:var(--el);"><span class="hinit">{t}</span></div>')
        html = html.replace(f'<div class="cic" style="background:rgba(107,99,88,.12);">{em}</div>', f'<div class="cic" style="background:var(--el);"><span class="hinit">{t}</span></div>')
    # Streak emoji in metrics
    html = html.replace("14 &#x1F525;", '14 <span class="hinit" style="color:var(--brand)">ST</span>')
    html = html.replace('<div class="stmv">14 &#x1F525;</div>', '<div class="stmv">14</div>')
    # Calendar event purple -> reflection brown
    html = html.replace('background:#8B5CF6;', 'background:#8a6b4f;')
    # Activity feed purple journal
    html = html.replace('stroke="#8B5CF6"', 'stroke="var(--brand)"')
    html = html.replace('stroke="#8B5CF6"', 'stroke="var(--brand)"')
    html = html.replace('background:rgba(139,92,246,.15)', 'background:var(--soft)')
    # Note dot purple
    html = html.replace('background:#8B5CF6;', 'background:var(--brand);')
    html = html.replace('style="background:#EF4444;"', 'style="background:var(--brand);"')
    # Goal cards (gem2) still using emoji in source
    for em, txt in [("&#x1F680;", "P"), ("&#x1F4BC;", "C"), ("&#x1F4DA;", "L"), ("&#x1F4BB;", "D")]:
        html = html.replace(f'<div class="gem2">{em}</div>', f'<div class="gem2"><span class="hinit">{txt}</span></div>')
    html = html.replace('<div class="cic" style="background:rgba(255,107,53,.12);">&#x1F355;</div>', '<div class="cic" style="background:var(--el);"><span class="hinit">FD</span></div>')
    html = html.replace('<div class="cic" style="background:rgba(59,130,246,.12);">&#x1F695;</div>', '<div class="cic" style="background:var(--el);"><span class="hinit">TR</span></div>')
    html = re.sub(r"<script>.*?</script>\s*", "", html, flags=re.S)
    return html

def android_frame(html: str) -> str:
    html = html.replace(
        '.pf{width:390px;height:844px;border-radius:52px;background:#0A0908;padding:14px;',
        '.pf{width:390px;height:844px;border-radius:28px;background:#121212;padding:10px;',
    )
    html = html.replace('.pi{width:100%;height:100%;border-radius:40px;', '.pi{width:100%;height:100%;border-radius:22px;')
    html = re.sub(
        r'<div class="island"><div class="is-bar"></div><div class="is-cam"></div></div>',
        '',
        html,
    )
    if ".pf::before" not in html:
        html = html.replace(
            ".pf{width:390px;height:844px;border-radius:28px;",
            ".pf::before{content:'';position:absolute;top:16px;left:50%;transform:translateX(-50%);width:8px;height:8px;border-radius:50%;background:#1a1a1a;border:1px solid #333;z-index:300}"
            ".pf{width:390px;height:844px;border-radius:28px;",
        )
    return html

EXTRA_CSS = """
.ob{position:absolute;inset:0;z-index:600;background:var(--bg);display:none;flex-direction:column}
.ob.on{display:flex}
.ob-splash,.ob-step{flex:1;display:none;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;text-align:center}
.ob-splash.on,.ob-step.on{display:flex}
.ob-word{font-family:var(--FD);font-size:44px;font-weight:800;color:var(--brand)}
.ob-h{font-family:var(--FD);font-size:26px;font-weight:800;margin:16px 0 8px}
.ob-p{color:var(--t2);font-size:14px;line-height:1.5;margin-bottom:20px}
.ob-inp{width:100%;height:44px;border:1px solid var(--br);border-radius:12px;background:var(--sf);padding:0 14px;color:var(--t1);margin:8px 0}
.pin-dots{display:flex;gap:12px;justify-content:center;margin:20px 0}
.pin-dots i{width:12px;height:12px;border-radius:50%;border:2px solid var(--br)}
.pin-dots i.f{background:var(--brand);border-color:var(--brand)}
.pin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:280px}
.pin-k{height:52px;border-radius:14px;background:var(--el);border:1px solid var(--br);font-size:20px;font-weight:700}
.stack-zone{position:relative;flex:1;margin:8px 16px 0;display:flex;flex-direction:column}
.stack-card{flex:1;background:var(--sf);border:1px solid var(--br);border-radius:20px;padding:20px;box-shadow:var(--cs);touch-action:pan-y}
.stack-pips{display:flex;gap:6px;justify-content:center;padding:10px 0}
.stack-pips span{width:8px;height:8px;border-radius:50%;background:var(--br);display:inline-block}
.stack-pips span.on{background:var(--brand);width:20px;border-radius:4px}
.strip-row{border-top:1px solid var(--brs);padding:12px 16px}
.strip-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;min-height:44px;cursor:pointer}
.hpill{display:inline-flex;align-items:center;height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--br);background:var(--el);font-size:12px;font-weight:700;margin-right:6px}
.hpill.on{background:var(--brand);border-color:var(--brand);color:#fff}
.rail{position:absolute;left:0;top:48px;bottom:68px;width:28px;background:var(--sf);border-right:1px solid var(--br);z-index:40;display:flex;flex-direction:column;align-items:center;padding:10px 0;gap:12px;transition:width .26s cubic-bezier(.22,1,.36,1)}
.rail.open{width:190px;align-items:flex-start;padding:10px 12px}
.r-dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--brand);margin-left:6px;cursor:pointer}
.r-dot.on{background:var(--brand)}
.rail.open .r-dot{margin-left:0}
.r-lbl{display:none;font-size:12px;font-weight:700;margin-left:10px;color:var(--t2)}
.rail.open .r-lbl{display:inline}
.r-item{display:flex;align-items:center;width:100%;min-height:44px;cursor:pointer}
.rail-main{margin-left:28px}
.rail-actions{position:absolute;left:28px;right:0;bottom:0;height:64px;display:flex;gap:10px;padding:10px 16px;background:color-mix(in srgb,var(--sf) 92%,transparent);border-top:1px solid var(--brs);z-index:35}
.rail-actions .svb{flex:1;height:44px;border-radius:12px}
.pulse-tabs{display:flex;background:var(--el);border-radius:999px;padding:3px;margin:8px 16px 12px;border:1px solid var(--br)}
.pulse-tabs button{flex:1;height:40px;border-radius:999px;font-size:13px;font-weight:800;color:var(--t3)}
.pulse-tabs button.on{background:var(--brand);color:#fff}
.pulse-row{transition:opacity .16s ease,max-height .16s ease}
.pulse-row.out{opacity:0;max-height:0;overflow:hidden;padding:0}
.loop-only .bn{display:none!important}
.loop-done .bn{display:flex!important}
.tier-grid{padding:0 16px 24px}
.tier-card{border:1px solid var(--br);border-radius:14px;padding:14px;margin-bottom:10px;background:var(--el)}
.tier-card.rec{border-color:var(--brand);box-shadow:inset 0 0 0 1px var(--brand)}
.toast{position:absolute;left:50%;bottom:100px;transform:translate(-50%,8px);background:var(--sf);border:1px solid var(--br);border-radius:999px;padding:10px 16px;font-size:12px;font-weight:700;opacity:0;pointer-events:none;transition:.25s;z-index:700;white-space:nowrap}
.toast.on{opacity:1;transform:translate(-50%,0)}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:1ms!important;transition-duration:1ms!important;backdrop-filter:none!important}}
"""

EXTRA_SCREENS = """
<div class="sc" id="sc-habits">
<div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div>
<div class="ph"><div class="pht">Habits</div><div class="phs">Core · streak matrix</div></div>
<div class="chips"><div class="chip on" onclick="setChip(this)">Daily</div><div class="chip" onclick="setChip(this)">Matrix</div><div class="chip" onclick="toast('Habit added')">Add</div></div>
<div class="c" style="margin:0 16px 12px;padding:12px"><div class="sl">YEAR MATRIX</div><div id="habMatrix" style="display:grid;grid-template-columns:repeat(26,1fr);gap:3px;margin-top:8px"></div></div>
<div class="c" style="margin:0 16px 80px">
<div class="tr"><div class="ck on" onclick="toggleCk(this)"><svg viewBox="0 0 12 12"><polyline points="1,6 4.5,9.5 11,2.5"/></svg></div><div class="tri"><div class="trn">Morning review</div><div class="trm">Streak 14</div></div></div>
<div class="tr"><div class="ck on" onclick="toggleCk(this)"><svg viewBox="0 0 12 12"><polyline points="1,6 4.5,9.5 11,2.5"/></svg></div><div class="tri"><div class="trn">Water 3L</div><div class="trm">Streak 9</div></div></div>
<div class="tr"><div class="ck" onclick="toggleCk(this)"><svg viewBox="0 0 12 12"><polyline points="1,6 4.5,9.5 11,2.5"/></svg></div><div class="tri"><div class="trn">Evening run 5K</div><div class="trm">Streak 6</div></div></div>
<div class="tr"><div class="ck on" onclick="toggleCk(this)"><svg viewBox="0 0 12 12"><polyline points="1,6 4.5,9.5 11,2.5"/></svg></div><div class="tri"><div class="trn">Code 2h · DSA</div><div class="trm">Streak 21</div></div></div>
</div></div>

<div class="sc" id="sc-focus">
<div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div>
<div class="ph"><div class="pht">Focus</div><div class="phs">Pomodoro · session stats</div></div>
<div class="c pad" style="text-align:center;margin:0 16px"><div class="sl">Intent</div><p style="margin:8px 0 16px">DSA Trees and Graphs</p>
<div id="timerDisp" style="font-family:var(--FD);font-size:56px;font-weight:800">25:00</div>
<button class="svb" style="width:100%;margin-top:16px" onclick="startFocus()">Start session</button></div>
<div class="c" style="margin:0 16px 80px;padding:14px 16px"><div class="sl">This week</div><div id="focusSpark" style="display:flex;gap:3px;align-items:flex-end;height:40px;margin-top:8px"></div></div>
</div>

<div class="sc" id="sc-discipline">
<div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div>
<div class="ph"><div class="pht">Discipline Engine</div><div class="phs">Core · pledge and milestones</div></div>
<div class="c" style="margin:0 16px 80px;padding:16px"><div style="display:flex;justify-content:space-between"><div><div class="sl">14-day pledge</div><div style="font-family:var(--FD);font-size:32px;font-weight:800">Day 9</div></div><span class="b bo">Active</span></div>
<div class="pt" style="margin-top:12px"><div class="pf2" data-w="64"></div></div>
<p style="font-size:13px;color:var(--t2);margin-top:12px">Milestones at 7 · 14 · 21 · 30 days. Next: 14-day badge in 5 days.</p></div>
</div>

<div class="sc" id="sc-career">
<div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div>
<div class="ph"><div class="pht">Career</div><div class="phs">Placements kanban</div></div>
<div class="sh"><div class="sl">APPLIED</div></div><div class="c" style="margin:0 16px 10px;padding:12px 14px"><div class="trn">Frontend Intern · Razorpay</div><div class="trm">Applied Jul 10</div></div>
<div class="sh"><div class="sl">INTERVIEW</div></div><div class="c" style="margin:0 16px 10px;padding:12px 14px"><div class="trn">AWS CLF-C02 prep</div><div class="trm">Lab module · due Aug 1</div></div>
<div class="sh"><div class="sl">RESUME VAULT</div></div><div class="c" style="margin:0 16px 80px;padding:12px 14px"><div class="trn">Frontend Dev Resume v2.1</div><div class="trm">Updated Jul 15</div></div>
</div>

<div class="sc" id="sc-sports">
<div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div>
<div class="ph"><div class="pht">Sports briefing</div></div>
<div class="c" style="margin:0 16px 10px;padding:14px"><div class="trn">Cricket: India training block</div><div class="trm">Asia Cup prep notes</div><button class="chip" style="margin-top:10px" onclick="toast('Saved')">Save</button></div>
<div class="c" style="margin:0 16px 10px;padding:14px"><div class="trn">Football: PL opener watchlist</div><div class="trm">Arsenal vs Liverpool</div></div>
<div class="c" style="margin:0 16px 80px;padding:14px"><div class="trn">F1: Silverstone strategy read</div><div class="trm">Qualifying undercut angles</div></div>
</div>

<div class="sc" id="sc-lab">
<div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div>
<div class="ph"><div class="pht">Lab</div><div class="phs">Typing · aptitude · STAR · flashcards</div></div>
<div class="c" style="margin:0 16px 80px">
<div class="tr" onclick="toast('Typing drill started')"><div class="tri"><div class="trn">Typing drill</div></div></div>
<div class="tr" onclick="toast('Aptitude set 4')"><div class="tri"><div class="trn">Aptitude set</div></div></div>
<div class="tr" onclick="toast('STAR practice')"><div class="tri"><div class="trn">STAR interview</div></div></div>
<div class="tr" onclick="toast('Flashcards')"><div class="tri"><div class="trn">Flashcards</div></div></div>
<div class="tr" onclick="toast('IEEE INCIP EEG paper')"><div class="tri"><div class="trn">IEEE INCIP EEG paper</div></div></div>
<div class="tr" onclick="toast('AWS CLF-C02')"><div class="tri"><div class="trn">AWS CLF-C02 module</div></div></div>
</div></div>

<div class="sc" id="sc-reports">
<div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div>
<div class="ph"><div class="pht">Reports</div></div>
<div class="c" style="margin:0 16px 10px;padding:14px"><span class="b bg">Core</span><h3 style="margin:8px 0;font-family:var(--FD)">Ivory Snapshot · 7-day</h3><p style="font-size:13px;color:var(--t2)">Habits, focus, and spend moved together this week.</p></div>
<div class="c" style="margin:0 16px 10px;padding:14px;border-style:dashed"><span class="b bo">Pro locked</span><h3 style="margin:8px 0">14-day PDF + correlations</h3><button class="svb" onclick="openBilling()">Upgrade</button></div>
<div class="c" style="margin:0 16px 80px;padding:14px;border-style:dashed"><span class="b bn2">Elite locked</span><h3 style="margin:8px 0">30-60-90 interactive intelligence</h3></div>
</div>

<div class="sc" id="sc-log">
<div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div>
<div class="ph"><div class="pht">Daily Log</div><div class="phs">Sleep · mood · gym · water · steps</div></div>
<div class="c" style="margin:0 16px 80px;padding:16px">
<div class="sl">Sleep hours</div><input type="range" min="4" max="10" value="7" style="width:100%;accent-color:var(--brand);margin:8px 0" onchange="toast('Sleep logged')">
<div class="sl" style="margin-top:12px">Mood</div><div class="chips" style="padding:8px 0"><div class="chip on" onclick="setChip(this)">Calm</div><div class="chip" onclick="setChip(this)">Focused</div><div class="chip" onclick="setChip(this)">Tired</div></div>
<div class="sl">Gym today</div><button class="chip on" style="margin-top:8px" onclick="this.classList.toggle('on')">Yes · 45 min</button>
<button class="svb" style="width:100%;margin-top:16px" onclick="toast('Daily log saved')">Save log</button>
</div></div>

<div class="sc" id="sc-billing">
<div class="bk" onclick="goBack()"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>Back</div>
<div class="ph"><div class="pht">Subscription</div><div class="phs">Four tiers · founding rates</div></div>
<div class="tier-grid" id="tierGrid"></div>
</div>

<div class="sc" id="sc-more">
<div class="ph"><div class="pht">More</div><div class="phs">All domains · OS-ID AADITYA8</div></div>
<div class="c" style="margin:0 16px 80px" id="moreList"></div>
</div>
"""

ONBOARDING = """
<div class="ob on" id="obRoot">
<div class="ob-splash on" id="obSplash"><div class="ob-word">AIIMIN</div><p class="ob-p">One screen. Every day.</p><button class="svb" style="width:100%" onclick="obShow('s1')">Continue</button><button class="chip" style="margin-top:10px;width:100%" onclick="obSkip()">Skip</button></div>
<div class="ob-step" id="obS1"><div class="ob-h">One screen.<br>Every day.</div><p class="ob-p">Native companion for habits, journal, focus, vault — synced with your web Life OS.</p><button class="svb" style="width:100%" onclick="obShow('theme')">Next</button></div>
<div class="ob-step" id="obTheme"><div class="ob-h">Appearance</div><label style="display:flex;gap:10px;margin:12px 0"><input type="radio" name="obt" value="light" checked> Light Clean</label><label style="display:flex;gap:10px;margin:12px 0"><input type="radio" name="obt" value="dark"> Dark Focus</label><button class="svb" style="width:100%" onclick="obThemePick()">Next</button></div>
<div class="ob-step" id="obOsid"><div class="ob-h">Reserve OS-ID</div><input class="ob-inp" id="osidInp" maxlength="8" placeholder="8 characters (optional)" oninput="checkOsid()"><p class="ob-p" id="osidMsg">Optional. Syncs with web account.</p><button class="svb" style="width:100%" onclick="obShow('auth')">Next</button></div>
<div class="ob-step" id="obAuth"><div class="ob-h">Sign in</div><p class="ob-p">Continue with your existing web account.</p><button class="svb" style="width:100%;margin-bottom:10px" onclick="obShow('pin')">Continue with Google</button><input class="ob-inp" placeholder="OS-ID or email"><button class="chip" style="width:100%;margin-top:8px" onclick="obShow('pin')">Sign in</button></div>
<div class="ob-step" id="obPin"><div class="ob-h">Device PIN</div><p class="ob-p">Set a 4-digit unlock for this device.</p><div class="pin-dots" id="pinDots"><i></i><i></i><i></i><i></i></div><div class="pin-grid"><button class="pin-k" onclick="pinPress('1')">1</button><button class="pin-k" onclick="pinPress('2')">2</button><button class="pin-k" onclick="pinPress('3')">3</button><button class="pin-k" onclick="pinPress('4')">4</button><button class="pin-k" onclick="pinPress('5')">5</button><button class="pin-k" onclick="pinPress('6')">6</button><button class="pin-k" onclick="pinPress('7')">7</button><button class="pin-k" onclick="pinPress('8')">8</button><button class="pin-k" onclick="pinPress('9')">9</button><button class="pin-k" onclick="pinPress('del')">Del</button><button class="pin-k" onclick="pinPress('0')">0</button><button class="pin-k" onclick="obEnter()">OK</button></div></div>
</div>
<div class="toast" id="toast"></div>
"""

CORE_JS = """
let pinVal='',lifeScore=62,focusSecs=25*60,focusTimer=null;
const MORE_LINKS=[['habits','Habits'],['journal','Journal'],['notes','Notes'],['vault','Vault'],['focus','Focus'],['discipline','Discipline'],['goals','Goals'],['finance','Finance'],['family','Family'],['calendar','Calendar'],['career','Career'],['sports','Sports'],['lab','Lab'],['reports','Reports'],['log','Daily Log'],['settings','Settings'],['billing','Subscription'],['me','Account']];
function toast(m){const t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove('on'),2000)}
function obShow(id){document.querySelectorAll('.ob-splash,.ob-step').forEach(e=>e.classList.remove('on'));const m={'s1':'obS1','theme':'obTheme','osid':'obOsid','auth':'obAuth','pin':'obPin','splash':'obSplash'};document.getElementById(m[id]||id)?.classList.add('on')}
function obThemePick(){const v=document.querySelector('input[name=obt]:checked')?.value||'light';setTheme(v);localStorage.setItem('aiimin-theme',v);obShow('osid')}
function obSkip(){localStorage.setItem('aiimin-onboarding-complete','true');document.getElementById('obRoot')?.classList.remove('on');document.getElementById('spl')?.classList.add('out');bootDir()}
function obEnter(){localStorage.setItem('aiimin-onboarding-complete','true');document.getElementById('obRoot')?.classList.remove('on');toast('Welcome back');bootDir()}
function checkOsid(){const v=document.getElementById('osidInp')?.value||'';document.getElementById('osidMsg').textContent=v.length===8?'AADITYA8 available (simulated)':v.length?'Need 8 characters':'Optional. Syncs with web account.'}
function pinPress(k){if(k==='del')pinVal=pinVal.slice(0,-1);else if(pinVal.length<4)pinVal+=k;document.querySelectorAll('#pinDots i').forEach((d,i)=>d.classList.toggle('f',i<pinVal.length));if(pinVal.length===4)setTimeout(obEnter,300)}
function renderMore(){const el=document.getElementById('moreList');if(!el)return;el.innerHTML=MORE_LINKS.map(([id,l])=>'<div class="tr" onclick="goto(\\''+id+'\\')"><div class="tri"><div class="trn">'+l+'</div></div><svg class="chv" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg></div>').join('')}
function renderTiers(){const el=document.getElementById('tierGrid');if(!el)return;const t=[['Explore','Rs0 forever','','Log daily. Learn the loop.','Active',0],['Core','Rs29/mo','Complimentary at go-live','Run your essentials.','Upgrade',1],['Pro','Rs59/mo','Founding Rs49/mo x 12 months','See the patterns.','Upgrade',2],['Elite','Rs99/mo','Founding Rs79/mo x 12 months','Interactive intelligence, two AI pools.','Switch',3]];el.innerHTML=t.map(x=>'<div class="tier-card'+(x[5]===2?' rec':'')+'"><div style="display:flex;justify-content:space-between"><b>'+x[0]+'</b>'+(x[5]===2?'<span class="b bo">Recommended</span>':'')+'</div><h3 style="font-family:var(--FD);margin:6px 0">'+x[1]+'</h3><p style="font-size:12px;color:var(--t3)">'+x[2]+'</p><p style="font-size:13px;color:var(--t2);margin:8px 0">'+x[3]+'</p><button class="chip'+(x[4]==='Active'?'':' on')+'" onclick="toast(\\''+x[0]+' plan\\')">'+x[4]+'</button></div>').join('')}
function renderHabMatrix(){const el=document.getElementById('habMatrix');if(!el)return;el.innerHTML=Array.from({length:156},(_,i)=>'<div style="aspect-ratio:1;border-radius:3px;background:'+(i%3?'var(--done)':'var(--el)')+';border:1px solid var(--br)" onclick="this.style.background=this.style.background.includes(\\'done\\')?\\'var(--el)\\':\\'var(--done)\\'"></div>').join('')}
function renderSpark(){const el=document.getElementById('focusSpark');if(!el)return;[40,65,50,80,55,70,45].forEach(h=>{const s=document.createElement('i');s.style.cssText='flex:1;height:'+h+'%;background:var(--brand);border-radius:2px';el.appendChild(s)})}
function startFocus(){if(focusTimer)return;focusTimer=setInterval(()=>{focusSecs--;const m=Math.floor(focusSecs/60),s=focusSecs%60;document.getElementById('timerDisp').textContent=m+':'+String(s).padStart(2,'0');if(focusSecs<=0){clearInterval(focusTimer);focusTimer=null;toast('Focus block complete')}},1000);toast('Focus started')}
function openBilling(){goto('billing')}
function setTheme(t){localStorage.setItem('aiimin-theme',t);const pi=document.getElementById('pi');pi?.classList.remove('TL','TD');pi?.classList.add(t==='dark'?'TD':'TL');document.querySelectorAll('.topt').forEach((o,i)=>o.classList.toggle('on',(t==='dark'&&i===1)||(t==='light'&&i===0)));const av=document.getElementById('appval');if(av)av.textContent=t==='dark'?'Dark':'Light'}
function bootCommon(){renderMore();renderTiers();renderHabMatrix();renderSpark();setTheme(localStorage.getItem('aiimin-theme')||'light');if(localStorage.getItem('aiimin-onboarding-complete')==='true'){document.getElementById('obRoot')?.classList.remove('on');document.getElementById('spl')?.classList.add('out')}else{document.getElementById('obRoot')?.classList.add('on');document.getElementById('obSplash')?.classList.add('on')}}
"""

# Direction-specific content
DIRS = {
    "aiimin-a-mission-control.html": {
        "title": "A · Stack",
        "ns": "stack",
        "tabs": "['home','vault','more']",
        "nm": "{home:'ni-home',vault:'ni-vault',more:'ni-more'}",
        "nav": """
<div class="bn">
<div class="ni on" id="ni-home" onclick="goto('home')"><div class="niw"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg></div><span>Stack</span></div>
<div class="ni" id="ni-vault" onclick="goto('vault')"><div class="niw"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div><span>Vault</span></div>
<div class="ni" id="ni-more" onclick="goto('more')"><div class="niw"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></div><span>More</span></div>
</div>""",
        "home": """
<div class="sc" id="sc-home" style="display:block;">
<div class="ph" style="padding-top:4px"><div class="pht">Stack</div><div class="phs">Pro · till 10 Aug 2026</div></div>
<div class="stack-zone">
<div class="stack-pips" id="stackPips"></div>
<div class="stack-card" id="stackCard"></div>
<div style="display:flex;gap:10px;margin-top:12px"><button class="chip" style="flex:1;height:44px" onclick="stackLater()">Later</button><button class="svb" style="flex:1" onclick="stackDone()">Done</button></div>
</div></div>""",
        "js": """
let stackItems=[{t:'Life Score',b:'62 today, up from 58',type:'score'},{t:'Morning review',b:'Habit · streak 14',type:'habit'},{t:'DSA Trees and Graphs',b:'Focus 16:00 · 45 min',type:'focus'},{t:'Journal prompt',b:'What moved you today?',type:'journal'},{t:'Discipline check',b:'Day 9 of pledge',type:'discipline',locked:true}],si=0;
function bootDir(){bootCommon();renderStack();const c=document.getElementById('stackCard');if(c){let sy=0;c.addEventListener('touchstart',e=>{sy=e.touches[0].clientY});c.addEventListener('touchend',e=>{const dy=e.changedTouches[0].clientY-sy;if(dy<-40)stackDone();if(dy>40)stackLater()})}}
function renderStack(){const left=stackItems.filter(x=>!x.done);const card=document.getElementById('stackCard'),pips=document.getElementById('stackPips');if(!left.length){card.innerHTML='<div style="text-align:center;padding:24px"><div class="sl">All done</div><h2 style="font-family:var(--FD);margin:12px 0">Stack cleared</h2><p style="color:var(--t2);font-size:13px">Discipline tracking needs Core.</p><button class="svb" style="margin-top:16px" onclick="openBilling()">Unlock Core</button></div>';pips.innerHTML='';return}
const c=left[0];pips.innerHTML=left.map((_,i)=>'<span class="'+(i===0?'on':'')+'"></span>').join('');
card.innerHTML='<div class="sl">'+c.t+'</div><h2 style="font-family:var(--FD);font-size:22px;margin:10px 0">'+c.b+'</h2>'+(c.locked?'<div style="margin-top:auto;padding:12px;border:1px dashed var(--br);border-radius:12px;text-align:center"><span class="b bo">Core</span><button class="svb" style="margin-top:10px;width:100%" onclick="openBilling()">Unlock in Core</button></div>':'<p style="color:var(--t2);font-size:13px;margin-top:auto">Swipe up done · down later</p>')}
function stackDone(){const l=stackItems.filter(x=>!x.done);if(!l.length)return;if(l[0].locked){openBilling();return}l[0].done=true;lifeScore=Math.min(98,lifeScore+2);toast('Done');renderStack()}
function stackLater(){const i=stackItems.findIndex(x=>!x.done);if(i<0)return;const[it]=stackItems.splice(i,1);stackItems.push(it);toast('Snoozed');renderStack()}
""",
    },
    "aiimin-b-companion.html": {
        "title": "B · Strip",
        "ns": "strip",
        "tabs": "['home','journal','notes','vault','more']",
        "nm": "{home:'ni-home',journal:'ni-journal',notes:'ni-notes',vault:'ni-vault',more:'ni-more'}",
        "nav": """
<div class="bn">
<div class="ni on" id="ni-home" onclick="goto('home')"><div class="niw"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div><span>Today</span></div>
<div class="ni" id="ni-journal" onclick="goto('journal')"><div class="niw"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></svg></div><span>Journal</span></div>
<div class="ni" id="ni-notes" onclick="goto('notes')"><div class="niw"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg></div><span>Notes</span></div>
<div class="ni" id="ni-vault" onclick="goto('vault')"><div class="niw"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div><span>Vault</span></div>
<div class="ni" id="ni-more" onclick="goto('more')"><div class="niw"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></div><span>More</span></div>
</div>""",
        "home": """
<div class="sc" id="sc-home" style="display:block;">
<div class="c scard" style="margin:8px 16px 0" onclick="toast('Life Score history')"><div class="sbody"><div class="srw" style="width:74px;height:74px"><svg width="74" height="74" viewBox="0 0 90 90"><circle cx="45" cy="45" r="36" fill="none" stroke="var(--br)" stroke-width="7"/><circle cx="45" cy="45" r="36" fill="none" stroke="var(--brand)" stroke-width="7" stroke-linecap="round" stroke-dasharray="226" stroke-dashoffset="58" transform="rotate(-90 45 45)"/></svg><div class="srt"><div class="srnum" style="font-size:21px;color:var(--t1)">62</div></div></div><div><div class="sl">Life Score</div><div style="font-family:var(--FD);font-size:18px;font-weight:800">Up from 58</div><div style="font-size:12px;color:var(--t3)">Streak 14 days</div></div></div></div>
<div class="c" style="margin-top:0">
<div class="strip-row"><div class="strip-h" onclick="goto('habits')"><span class="sl">Habits</span><svg class="chv" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg></div><div><span class="hpill on" onclick="toggleHp(this)">Review</span><span class="hpill on" onclick="toggleHp(this)">Water</span><span class="hpill" onclick="toggleHp(this)">Run</span><span class="hpill on" onclick="toggleHp(this)">Code</span></div></div>
<div class="strip-row"><div class="strip-h" onclick="goto('focus')"><span class="sl">Focus</span><svg class="chv" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg></div><div style="font-weight:700">3h 45m today</div><div id="stripSpark" style="display:flex;gap:3px;align-items:flex-end;height:28px;margin-top:6px"></div></div>
<div class="strip-row" onclick="openBilling()" style="opacity:.7"><div class="strip-h"><span class="sl">Discipline · Core</span><span class="b bo">Locked</span></div><div style="filter:blur(3px)">████████ streak</div></div>
<div class="strip-row"><div class="strip-h" onclick="goto('journal')"><span class="sl">Journal</span><svg class="chv" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg></div><div style="color:var(--t2);font-size:13px">What moved you today?</div></div>
</div>
<button class="svb" style="margin:12px 16px;width:calc(100% - 32px)" onclick="openSheet()">Quick capture</button>
</div>""",
        "js": """
function bootDir(){bootCommon();[40,65,50,80,55,70,45].forEach(h=>{const s=document.createElement('i');s.style.cssText='flex:1;height:'+h+'%;background:var(--brand);border-radius:2px';document.getElementById('stripSpark')?.appendChild(s)})}
function toggleHp(el){el.classList.toggle('on');toast(el.classList.contains('on')?'Habit done':'Undone')}
""",
    },
    "aiimin-c-workspace.html": {
        "title": "C · Loop",
        "ns": "loop",
        "tabs": "['home','journal','vault','more']",
        "nm": "{home:'ni-home',journal:'ni-journal',vault:'ni-vault',more:'ni-more'}",
        "nav": """
<div class="bn loop-nav" id="loopNav" style="display:none">
<div class="ni on" id="ni-home" onclick="goto('home')"><div class="niw"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div><span>Today</span></div>
<div class="ni" id="ni-journal" onclick="goto('journal')"><div class="niw"><svg viewBox="0 0 24 24"><path d="M12 20h9"/></svg></div><span>Journal</span></div>
<div class="ni" id="ni-vault" onclick="goto('vault')"><div class="niw"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/></svg></div><span>Vault</span></div>
<div class="ni" id="ni-more" onclick="goto('more')"><div class="niw"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/></svg></div><span>More</span></div>
</div>""",
        "home": '<div class="sc" id="sc-home" style="display:block"><div id="loopHost" style="padding:16px"></div></div>',
        "js": """
const loopSteps=['score','habits','focus','journal'];let loopStep=0,loopDone=false,loopStart=58;
function bootDir(){bootCommon();loopStep=parseInt(localStorage.getItem('aiimin-loop-step')||'0',10);loopDone=localStorage.getItem('aiimin-loop-done')==='true';renderLoop()}
function renderLoop(){const h=document.getElementById('loopHost'),nav=document.getElementById('loopNav');if(loopDone){nav.style.display='flex';h.innerHTML='<div class="c pad"><div class="sl">Loop complete</div><div style="font-family:var(--FD);font-size:28px;font-weight:800;margin:8px 0">'+lifeScore+'</div><p style="font-size:13px;color:var(--t2)">Started at '+loopStart+' · habits, focus, journal logged.</p><p style="font-size:12px;color:var(--t3);margin-top:8px">Discipline tracking needs Core — skipped.</p></div><div class="c"><div class="tr"><div class="tri"><div class="trn">Notes shortcut</div></div></div><div class="tr" onclick="goto(\\'vault\\')"><div class="tri"><div class="trn">Vault</div></div></div></div>';return}
nav.style.display='none';const step=loopSteps[loopStep]||'score';let body='';
if(step==='score')body='<div style="text-align:center"><div class="srnum" style="font-family:var(--FD);font-size:48px;color:var(--t1)">'+loopStart+'</div><p style="color:var(--t2);margin-top:8px">Life Score before check-in</p></div>';
if(step==='habits')body='<h2 style="font-family:var(--FD)">Habits due</h2><div style="margin-top:12px"><span class="hpill on" onclick="toggleHp(this)">Review</span><span class="hpill" onclick="toggleHp(this)">Run</span><span class="hpill on" onclick="toggleHp(this)">Water</span></div>';
if(step==='focus')body='<h2 style="font-family:var(--FD)">Focus block</h2><p style="color:var(--t2);margin:12px 0">DSA at 16:00</p><button class="svb" onclick="toast(\\'Scheduled\\')">Start</button>';
if(step==='journal')body='<h2 style="font-family:var(--FD)">Journal</h2><input class="ob-inp" placeholder="One line for today" style="margin-top:12px">';
h.innerHTML='<div style="min-height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px">'+body+'<div style="display:flex;gap:10px;margin-top:24px;width:100%"><button class="chip" style="flex:1;height:44px" onclick="loopBack()">Back</button><button class="svb" style="flex:1" onclick="loopNext()">'+(loopStep===loopSteps.length-1?'Finish':'Next')+'</button></div><button class="chip" style="margin-top:8px;width:100%" onclick="loopSkip()">Skip</button></div>'}
function loopNext(){lifeScore=Math.min(98,lifeScore+3);loopStep++;localStorage.setItem('aiimin-loop-step',loopStep);if(loopStep>=loopSteps.length){loopDone=true;localStorage.setItem('aiimin-loop-done','true');toast('Loop complete')}renderLoop()}
function loopSkip(){loopStep++;localStorage.setItem('aiimin-loop-step',loopStep);if(loopStep>=loopSteps.length){loopDone=true;localStorage.setItem('aiimin-loop-done','true')}renderLoop()}
function loopBack(){if(loopStep>0){loopStep--;localStorage.setItem('aiimin-loop-step',loopStep);renderLoop()}}
function toggleHp(el){el.classList.toggle('on')}
""",
    },
    "aiimin-d-timeline.html": {
        "title": "D · Rail",
        "ns": "rail",
        "tabs": "['home']",
        "nm": "{home:'ni-home'}",
        "nav": """
<div class="rail" id="rail"></div>
<div class="rail-actions"><button class="svb" onclick="goto('log')">Log</button><button class="chip" style="flex:1;height:44px" onclick="goto('focus')">Focus</button></div>""",
        "home": """
<div class="sc" id="sc-home" style="display:block;margin-left:28px">
<div class="ph"><div class="pht">Today</div><div class="phs">Compact dashboard</div></div>
<div class="c scard" style="margin-top:0"><div class="sbody"><div class="srw" style="width:74px;height:74px"><svg width="74" height="74" viewBox="0 0 90 90"><circle cx="45" cy="45" r="36" fill="none" stroke="var(--br)" stroke-width="7"/><circle cx="45" cy="45" r="36" fill="none" stroke="var(--brand)" stroke-width="7" stroke-dasharray="226" stroke-dashoffset="58" transform="rotate(-90 45 45)"/></svg><div class="srt"><div class="srnum" style="font-size:21px;color:var(--t1)">62</div></div></div><div><div class="sl">7-day trend</div><div style="display:flex;gap:3px;align-items:flex-end;height:24px;margin-top:6px"><i style="flex:1;height:40%;background:var(--brand);border-radius:2px"></i><i style="flex:1;height:55%;background:var(--brand);border-radius:2px"></i><i style="flex:1;height:70%;background:var(--brand);border-radius:2px"></i></div></div></div></div>
<div class="c"><div class="tr" onclick="goto('habits')"><div class="tri"><div class="trn">Habits</div><div class="trm">5/8 done</div></div></div>
<div class="tr" onclick="goto('journal')"><div class="tri"><div class="trn">Journal</div><div class="trm">Prompt ready</div></div></div>
<div class="tr" onclick="openBilling()"><div class="tri"><div class="trn">Discipline</div><div class="trm">Core locked</div></div></div>
<div class="tr" onclick="goto('focus')"><div class="tri"><div class="trn">Focus</div><div class="trm">3h 45m</div></div></div></div>
</div>""",
        "js": """
const railItems=[['home','Today'],['habits','Habits'],['journal','Journal'],['discipline','Discipline',true],['focus','Focus'],['vault','Vault'],['more','More']];
function bootDir(){bootCommon();const r=document.getElementById('rail');r.innerHTML=railItems.map(x=>'<div class="r-item" onclick="railGo(\\''+x[0]+'\\','+(x[2]?'true':'false')+')"><div class="r-dot'+(x[0]==='home'?' on':'')+'"></div><span class="r-lbl">'+x[1]+'</span></div>').join('');r.addEventListener('click',e=>{if(e.target.closest('.r-item'))return});let sx=0;document.querySelector('.sw').addEventListener('touchstart',e=>{if(e.touches[0].clientX<24)sx=e.touches[0].clientX});document.querySelector('.sw').addEventListener('touchend',e=>{if(sx&&e.changedTouches[0].clientX-sx>30)r.classList.add('open')})}
function railGo(id,lock){if(lock){openBilling();return}if(id==='more'){goto('more');return}goto(id==='home'?'home':id);document.getElementById('rail').classList.add('open')}
""",
    },
    "aiimin-e-spatial.html": {
        "title": "E · Pulse",
        "ns": "pulse",
        "tabs": "['home','more']",
        "nm": "{home:'ni-home',more:'ni-more'}",
        "nav": """
<div class="pulse-tabs"><button class="on" id="ptToday" onclick="goto('home')">Today</button><button id="ptMore" onclick="goto('more')">More</button></div>""",
        "home": """
<div class="sc" id="sc-home" style="display:block;">
<div class="c" style="margin:8px 16px 0;padding:12px 16px;display:flex;align-items:center;gap:12px" onclick="toast('Life Score '+lifeScore)"><div class="srnum" id="pulseScore" style="font-family:var(--FD);font-size:28px;color:var(--t1)">62</div><div style="font-size:12px;color:var(--t3)">Life Score · updates as you clear</div></div>
<div class="c" style="margin-top:0" id="pulseList"></div>
</div>""",
        "js": """
// urgency: habits midnight > focus schedule > journal > discipline
let pulseItems=[{id:'h1',t:'Morning review',s:'Resets midnight · streak 14',u:1},{id:'f1',t:'DSA Trees and Graphs',s:'Scheduled 16:00',u:2},{id:'j1',t:'Journal prompt',s:'What moved you today?',u:3}];
function bootDir(){bootCommon();renderPulse()}
function renderPulse(){const p=pulseItems.filter(x=>!x.done).sort((a,b)=>a.u-b.u);document.getElementById('pulseScore').textContent=lifeScore;const el=document.getElementById('pulseList');if(!p.length){el.innerHTML='<div style="padding:32px 20px;text-align:center"><h2 style="font-family:var(--FD)">All clear</h2><p style="color:var(--t2);font-size:13px;margin-top:8px">Nothing urgent left. Discipline tracking is on Core.</p></div>';return}
el.innerHTML=p.map(x=>'<div class="tr pulse-row" id="pr-'+x.id+'"><div class="ck" onclick="event.stopPropagation();pulseDone(\\''+x.id+'\\')"><svg viewBox="0 0 12 12"><polyline points="1,6 4.5,9.5 11,2.5"/></svg></div><div class="tri" onclick="pulseOpen(\\''+x.id+'\\')"><div class="trn">'+x.t+'</div><div class="trm">'+x.s+'</div></div></div>').join('')}
function pulseDone(id){const row=document.getElementById('pr-'+id);row?.classList.add('out');setTimeout(()=>{pulseItems.find(x=>x.id===id).done=true;lifeScore=Math.min(98,lifeScore+2);renderPulse();toast('Cleared')},160)}
function pulseOpen(id){const it=pulseItems.find(x=>x.id===id);if(it.t.includes('DSA'))goto('focus');else if(it.t.includes('Journal'))goto('journal');else toast('Logged inline')}
""",
    },
}

HOME_RE = re.compile(r'<div class="sc" id="sc-home"[^>]*>.*?</div>\s*(?=<div class="sc" id="sc-tasks">)', re.S)
EXTRA_INJECT_RE = re.compile(
    r'(id="sc-notifs">.*?</div>\s*\n)(\s*</div>)',
    re.S,
)
FAB_NAV_RE = re.compile(
    r'<div class="bn">.*?</div>\s*<div class="ov" id="fabov"',
    re.S,
)


def build():
    raw = SRC.read_text(encoding="utf-8")
    style_m = re.search(r"<style>(.*?)</style>", raw, re.S)
    css = fix_tokens(style_m.group(1) if style_m else "")
    body_m = re.search(r"<body>(.*)</body>", raw, re.S)
    body = fix_slop(body_m.group(1) if body_m else raw)
    body = android_frame(body)

    head = raw[: raw.find("<style>")] + "<style>\n" + css + EXTRA_CSS + "\n</style>\n"
    fonts = re.search(r'<link[^>]+fonts[^>]+>', raw)
    if fonts and fonts.group(0) not in head:
        head = head.replace("</head>", fonts.group(0) + "\n</head>")

    for fname, cfg in DIRS.items():
        html = body
        html = HOME_RE.sub(cfg["home"] + "\n", html, count=1)
        html = EXTRA_INJECT_RE.sub(r"\1" + EXTRA_SCREENS + ONBOARDING + r"\n\2", html, count=1)
        html = FAB_NAV_RE.sub(cfg["nav"] + '\n    <div class="ov" id="fabov"', html, count=1)
        # Profile / settings patches
        html = html.replace(
            '<div class="phe2">aaditya@aiimin.in</div>',
            '<div class="phe2">aaditya@aiimin.in</div><div style="font-family:var(--FM);font-size:11px;color:var(--brand);margin-top:4px">OS-ID: AADITYA8</div>',
        )
        html = html.replace('<div class="seue">aaditya@aiimin.in</div>', '<div class="seue">aaditya@aiimin.in · OS-ID AADITYA8</div>')
        html = html.replace("Pro Founding", "Pro · till 10 Aug 2026")
        html = html.replace('<div class="shtit">Create new</div>', '<div class="shtit">Quick capture</div>')
        html = html.replace(
            '<div class="si"><div class="sii" style="background:var(--el);"><svg viewBox="0 0 24 24"><rect x="1" y="4"',
            '<div class="si" onclick="goto(\'billing\')"><div class="sii" style="background:var(--el);"><svg viewBox="0 0 24 24"><rect x="1" y="4"',
            1,
        )
        html = html.replace(
            '<div class="si"><div class="sii" style="background:var(--el);"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"',
            '<div class="si" onclick="setTheme(document.getElementById(\'pi\').classList.contains(\'TD\')?\'light\':\'dark\')"><div class="sii" style="background:var(--el);"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"',
            1,
        )
        script_tail = """
function showScreen(id){
 document.querySelectorAll('.sc').forEach(s=>{ s.style.display='none'; s.classList.remove('anim'); });
 const sc=document.getElementById('sc-'+id);
 if(!sc)return;
 sc.style.display='block';
 sc.classList.add('anim');
 sc.scrollTop=0;
 setTimeout(()=>sc.classList.remove('anim'),300);
 sc.querySelectorAll('.pf2[data-w]').forEach(el=>{ el.style.width='0%'; setTimeout(()=>{ el.style.width=el.dataset.w+'%'; },80); });
 document.querySelectorAll('.ni').forEach(n=>n.classList.remove('on'));
 if(NM[id]) document.getElementById(NM[id])?.classList.add('on');
 if(id==='home')document.getElementById('ptToday')?.classList.add('on');
 if(id==='more')document.getElementById('ptMore')?.classList.add('on');
}
function goto(id){if(TABS.includes(id))stack=[id];else{const i=stack.indexOf(id);if(i>-1)stack.splice(i,1);stack.push(id)}showScreen(id);closeSheetQ()}
function goBack(){if(stack.length>1){stack.pop();showScreen(stack[stack.length-1])}}
function toggleHabit(el){ el.querySelector('.hr').classList.toggle('on'); toast('Habit updated') }
function toggleCk(el){el.classList.toggle('on');const row=el.closest('.tr,.ti,.fti');if(row){const n=row.querySelector('.trn,.titn,.ftin');if(n){n.classList.toggle('on',el.classList.contains('on'));if(el.classList.contains('on')){n.style.textDecoration='line-through';n.style.color='var(--t3)'}else{n.style.textDecoration='none';n.style.color='var(--t1)'}}}}}
function setChip(el){ el.closest('.chips')?.querySelectorAll('.chip').forEach(c=>c.classList.remove('on')); el.classList.add('on'); }
function setJMode(el,p){ el.closest('.jmodes').querySelectorAll('.jmb').forEach(b=>b.classList.remove('on')); el.classList.add('on'); const pt=document.getElementById('jprompttext'); if(pt&&p)pt.textContent=p; }
function setVTab(el,id){ el.closest('.vtr').querySelectorAll('.vt').forEach(t=>t.classList.remove('on')); el.classList.add('on'); ['vt-my','vt-fam','vt-res'].forEach(v=>{ const e=document.getElementById(v); if(e)e.style.display=v===id?'block':'none'; }); }
function doSave(btn){ const sp=btn.querySelector('span'); const orig=sp.textContent; sp.textContent='Saving...'; setTimeout(()=>{ sp.textContent='Saved'; btn.style.background='var(--done)'; setTimeout(()=>{ sp.textContent=orig; btn.style.background=''; },1500); },700); toast('Journal saved') }
function routeLog(){ toast('Filed to Today'); closeSheetQ() }
function openSheet(){ document.getElementById('fabov').classList.add('on'); }
function closeSheet(e){ if(!e||e.target===document.getElementById('fabov'))closeSheetQ(); }
function closeSheetQ(){ document.getElementById('fabov')?.classList.remove('on'); }
window.addEventListener('load',()=>{
 bootCommon();
 if(typeof bootDir==='function')bootDir();
 setTimeout(()=>{
  const cr=document.getElementById('scr'),rn=document.getElementById('srnum');
  if(cr)cr.style.strokeDashoffset='58.8';
  if(rn){ let n=0; const iv=setInterval(()=>{ n+=3; if(n>=62){rn.textContent=62;clearInterval(iv);}else rn.textContent=n; },16); }
 },200);
 setTimeout(()=>{ document.querySelectorAll('.pf2[data-w]').forEach(el=>{ el.style.width=el.dataset.w+'%'; }); },300);
 const h=new Date().getHours();
 const gl=document.getElementById('gline');
 if(gl){ if(h<12)gl.textContent='Good morning'; else if(h<17)gl.textContent='Good afternoon'; else gl.textContent='Good evening'; }
 if(localStorage.getItem('aiimin-onboarding-complete')!=='true'){} else setTimeout(()=>document.getElementById('spl')?.classList.add('out'),800);
});
</script>
</body></html>"""
        script = (
            "<script>\n"
            f"/* COVERAGE: {cfg['title']} · {cfg['ns']} */\n"
            f"const TABS={cfg['tabs']};\n"
            f"const NM={cfg['nm']};\n"
            "let stack=['home'];\n"
            + CORE_JS
            + "\n"
            + cfg["js"]
            + "\n"
            + script_tail
        )
        out_html = head + "<body>\n" + html.split("<body>", 1)[-1].split("</body>")[0] + script
        out_html = re.sub(r"<title>[^<]+</title>", f"<title>{cfg['title']}</title>", out_html)
        (OUT / fname).write_text(out_html, encoding="utf-8")
        lines = out_html.count("\n") + 1
        print(f"Wrote {fname} ({len(out_html)} bytes, {lines} lines)")

    index = """<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AIIMIN Native Directions</title>
<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@700;800&family=Figtree:wght@400;600&display=swap" rel="stylesheet">
<style>body{font-family:Figtree,sans-serif;background:#1a1a1a;color:#f3f2ef;padding:40px 24px;max-width:720px;margin:0 auto}
h1{font-family:'Familjen Grotesk',sans-serif;color:#ff6b35;font-size:32px}
.card{display:block;background:#2d2d2d;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:18px 20px;margin:12px 0;text-decoration:none;color:inherit}
.card:hover{border-color:#ff6b35}
.card b{color:#ff6b35;font-family:'Familjen Grotesk',sans-serif;font-size:18px}
.card p{margin:6px 0 0;font-size:14px;color:#b5b0aa}</style></head><body>
<h1>AIIMIN Native · Full Prototypes</h1>
<p style="color:#6b7280;margin-bottom:24px">Five directions · full screens · onboarding · billing · no FAB nav</p>
<a class="card" href="aiimin-a-mission-control.html"><b>A · Stack</b><p>Swipe-through daily deck · Stack / Vault / More</p></a>
<a class="card" href="aiimin-b-companion.html"><b>B · Strip</b><p>Widget strips · 5-tab bottom bar · inline habits</p></a>
<a class="card" href="aiimin-c-workspace.html"><b>C · Loop</b><p>Morning check-in → dashboard · resumable</p></a>
<a class="card" href="aiimin-d-timeline.html"><b>D · Rail</b><p>Edge rail · Log + Focus bar · no bottom tabs</p></a>
<a class="card" href="aiimin-e-spatial.html"><b>E · Pulse</b><p>Urgency list shrinks to zero · Today/More pill</p></a>
<p style="margin-top:28px;font-size:12px;color:#6b7280">Built from full source prototype. CSS motion only (no Framer). Android frame.</p>
</body></html>"""
    (OUT / "index.html").write_text(index, encoding="utf-8")
    print("Wrote index.html")


if __name__ == "__main__":
    build()
