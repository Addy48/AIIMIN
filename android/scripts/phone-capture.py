#!/usr/bin/env python3
"""R6 screen capture on the owner's phone (PRD Part 9 B1, Part 18).

Opens each screen by its `aiimin_go` route extra (navigation only: no demo data, no saves),
takes `screencap` + `uiautomator dump`, and checks the grid from the dump:
  * margin: interactive or text nodes that start left of / end right of the 16 dp page margin
  * overlap: two text nodes whose boxes overlap (neither inside the other)
The phone's font scale is set for the run and always restored afterwards.
Never clears data or uninstalls; the app is only force-stopped to reset its back stack.

  python3 scripts/phone-capture.py --scale 1.15 --set all --out ../../04-docs/audits/b1-recapture/phone-1.15
  python3 scripts/phone-capture.py --scale 2.0 --set key --out ../../04-docs/audits/b1-recapture/phone-2.0
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

PKG = "in.aiimin.app.v4"
COMPONENT = f"{PKG}/aiimin.app.MainActivity"

# The R6 list (file names 00 to 54 match R6-DEFECTS evidence); the aiimin_go extra equals the name.
ALL = [(n, None if n == "today" else n) for n in """
today money inbox budget payments accounts splits recurring payees vault family backups kits emergency me notes note journal calendar focus minimums battery signals score why patterns body phoneday goals weekly debrief planday plantomorrow upcoming notifications activity search settings account sync plans subscription devices moneysettings appearance language help about running privacy trash conflicts captures moodyear assistant
""".split()]
KEY = {"today", "money", "inbox", "vault", "me", "note", "journal", "minimums", "phoneday", "debrief",
       "plantomorrow", "notifications", "settings", "plans"}

BOUNDS = re.compile(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]")


def adb(serial: str, *args: str, timeout: int = 40, check: bool = False) -> subprocess.CompletedProcess:
    return subprocess.run(["adb", "-s", serial, *args], capture_output=True, timeout=timeout, check=check)


def grid_check(xml: bytes, width: int, margin_px: float, status_h: int, nav_top: int) -> dict:
    """Nodes outside the margins and overlapping text boxes, ignoring system bars and full-bleed nodes."""
    try:
        root = ET.fromstring(xml)
    except ET.ParseError:
        return {"error": "unparseable dump"}
    texts, margin = [], []
    for n in root.iter("node"):
        if n.get("package") != PKG:
            continue
        m = BOUNDS.match(n.get("bounds", ""))
        if not m:
            continue
        l, t, r, b = map(int, m.groups())
        if b <= status_h or t >= nav_top or r - l <= 1 or b - t <= 1:
            continue
        label = n.get("text") or n.get("content-desc") or ""
        interactive = n.get("clickable") == "true" or n.get("focusable") == "true"
        full_bleed = l <= 2 and r >= width - 2
        # Touch targets may extend 16 dp past the margin (a 48 dp target around a 24 dp icon); content may not.
        slack = margin_px if interactive else 3
        if not full_bleed and (l < margin_px - slack or r > width - margin_px + slack):
            margin.append({"label": label[:40], "bounds": [l, t, r, b], "interactive": interactive})
        if n.get("text"):
            texts.append((l, t, r, b, n.get("text")[:40]))
    overlaps = []
    for i, a in enumerate(texts):
        for c in texts[i + 1:]:
            if a[0] < c[2] - 2 and c[0] < a[2] - 2 and a[1] < c[3] - 2 and c[1] < a[3] - 2:
                inside = (a[0] >= c[0] and a[2] <= c[2] and a[1] >= c[1] and a[3] <= c[3]) or \
                         (c[0] >= a[0] and c[2] <= a[2] and c[1] >= a[1] and c[3] <= a[3])
                if not inside:
                    overlaps.append([a[4], c[4]])
    return {"margin": margin, "overlap": overlaps}


def sheets(out: Path, per: int = 6, width: int = 420) -> None:
    """Labelled contact sheets (6 screens each) for reading the run by eye."""
    from PIL import Image, ImageDraw
    files = sorted(out.glob("[0-9][0-9]-*.png"))
    (out / "sheets").mkdir(exist_ok=True)
    for i in range(0, len(files), per):
        ims = []
        for f in files[i:i + per]:
            im = Image.open(f).convert("RGB")
            im = im.resize((width, int(im.height * width / im.width)))
            d = ImageDraw.Draw(im)
            d.rectangle([0, 0, 200, 26], fill="black")
            d.text((6, 6), f.stem, fill="yellow")
            ims.append(im)
        sheet = Image.new("RGB", (width * len(ims) + 6 * (len(ims) - 1), max(im.height for im in ims)), "white")
        for j, im in enumerate(ims):
            sheet.paste(im, (j * (width + 6), 0))
        sheet.save(out / "sheets" / f"s{i // per:02d}.png")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--serial", default="9597fdea")
    ap.add_argument("--scale", type=float, required=True)
    ap.add_argument("--set", choices=["all", "key"], default="all")
    ap.add_argument("--only", default="", help="comma-separated screen names")
    ap.add_argument("--out", required=True)
    ap.add_argument("--wait", type=float, default=2.2)
    a = ap.parse_args()

    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    original = adb(a.serial, "shell", "settings", "get", "system", "font_scale").stdout.decode().strip() or "1.0"
    size = adb(a.serial, "shell", "wm", "size").stdout.decode()
    density = int(re.findall(r"(\d+)", adb(a.serial, "shell", "wm", "density").stdout.decode())[-1])
    width = int(re.findall(r"(\d+)x(\d+)", size)[-1][0])
    height = int(re.findall(r"(\d+)x(\d+)", size)[-1][1])
    k = density / 160
    width_dp = width / k
    fit = min(max(width_dp / 390, 0.92), 1.1)  # AiiminTheme draws at 390 dp and scales
    margin_px = 16 * fit * k
    status_h, nav_top = int(30 * k), height - int(24 * k)

    only = {s for s in a.only.split(",") if s}
    screens = [(i, n, e) for i, (n, e) in enumerate(ALL) if (a.set == "all" or n in KEY) and (not only or n in only)]
    report = {"scale": a.scale, "width": width, "density": density, "margin_px": round(margin_px, 1), "screens": []}
    try:
        adb(a.serial, "shell", "settings", "put", "system", "font_scale", str(a.scale), check=True)
        time.sleep(1.0)
        for i, name, extra in screens:
            keyguard = adb(a.serial, "shell", "dumpsys", "window").stdout.decode()
            if "isKeyguardShowing=true" in keyguard or "mDreamingLockscreen=true" in keyguard:
                print(f"phone is locked at {name}: stopping (unlock it and rerun with --only)", flush=True)
                report["stopped_at"] = name
                break
            adb(a.serial, "shell", "am", "force-stop", PKG)
            cmd = ["shell", "am", "start", "-n", COMPONENT] + (["--es", "aiimin_go", extra] if extra else [])
            adb(a.serial, *cmd)
            time.sleep(a.wait)
            png = adb(a.serial, "exec-out", "screencap", "-p", timeout=60).stdout
            (out / f"{i:02d}-{name}.png").write_bytes(png)
            adb(a.serial, "shell", "uiautomator", "dump", "/sdcard/aiimin-b1.xml", timeout=60)
            xml = adb(a.serial, "exec-out", "cat", "/sdcard/aiimin-b1.xml").stdout
            (out / f"{i:02d}-{name}.xml").write_bytes(xml)
            g = grid_check(xml, width, margin_px, status_h, nav_top)
            report["screens"].append({"index": i, "name": name, **g})
            print(f"{i:02d} {name:14s} margin={len(g.get('margin', []))} overlap={len(g.get('overlap', []))}", flush=True)
        crash = adb(a.serial, "logcat", "-d", "-t", "2000", "AndroidRuntime:E", "*:S").stdout.decode()
        report["crash"] = "FATAL" in crash
    finally:
        adb(a.serial, "shell", "settings", "put", "system", "font_scale", original)
        adb(a.serial, "shell", "rm", "-f", "/sdcard/aiimin-b1.xml")
    (out / "report.json").write_text(json.dumps(report, indent=1, ensure_ascii=False))
    sheets(out)
    print(f"font scale restored to {original}; report: {out / 'report.json'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
