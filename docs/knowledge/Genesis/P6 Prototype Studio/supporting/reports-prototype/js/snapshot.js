(function () {
  function pct(n) {
    return Math.round(n * 100) + "%";
  }
  function sparkSVG(values, w, h) {
    w = w || 280;
    h = h || 48;
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    var span = Math.max(max - min, 0.1);
    var pts = values
      .map(function (v, i) {
        var x = (i / (values.length - 1)) * w;
        var y = h - ((v - min) / span) * (h - 10) - 5;
        return x.toFixed(1) + "," + y.toFixed(1);
      })
      .join(" ");
    return (
      '<svg class="snap-spark" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" width="100%" height="' +
      h +
      '" aria-hidden="true"><polyline fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" points="' +
      pts +
      '"/></svg>'
    );
  }
  function themeMeta(themeId) {
    var list = (window.AIIMIN_THEMES && window.AIIMIN_THEMES.snapshot) || [];
    return list.find(function (t) { return t.id === themeId; }) || { mode: "light" };
  }
  function weekStrip(scores, moods) {
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return (
      '<div class="lap-week">' +
      days
        .map(function (d, i) {
          return (
            '<div class="lap-day"><span class="mono d">' +
            d +
            '</span><strong class="sc">' +
            (scores[i] != null ? scores[i] : "—") +
            '</strong><span class="mono mo">m ' +
            (moods[i] != null ? moods[i].toFixed(1) : "—") +
            "</span></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }
  function habitMini(items) {
    return (
      '<div class="lap-habits"><div class="lap-sec-label mono">Habits · week</div>' +
      items
        .slice(0, 5)
        .map(function (h) {
          return (
            '<div class="lap-hab"><span>' +
            h.name +
            '</span><div class="lap-bar"><i style="width:' +
            pct(h.rate) +
            '"></i></div><span class="mono">' +
            pct(h.rate) +
            "</span></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function osChrome(device, dark) {
    if (device === "phone") {
      return (
        '<div class="snap-os-chrome" aria-hidden="true">' +
        '<div class="phone-status"><span>9:41</span><span>AIIMIN</span><span>100%</span></div>' +
        '<div class="phone-card mono">/m capture · Overview locked on phone</div></div>'
      );
    }
    if (device === "tablet") {
      return (
        '<div class="snap-os-chrome" aria-hidden="true">' +
        '<div class="tab-mast">' +
        '<span style="color:var(--accent)">AIIMIN</span>' +
        '<span class="mono">Full Life OS</span>' +
        '<div class="nav"><span>Overview</span><span class="cur">Reports</span><span>Journal</span><span>Focus</span></div></div>' +
        '<div class="tab-canvas"><div class="tab-tile"></div><div class="tab-tile"></div><div class="tab-tile"></div>' +
        '<div class="tab-tile"></div><div class="tab-tile"></div><div class="tab-tile"></div></div></div>'
      );
    }
    return (
      '<div class="snap-os-chrome" aria-hidden="true">' +
      '<aside class="desk-rail">' +
      '<div class="brand">AIIMIN</div>' +
      "<a>Overview</a><a class='cur'>Reports</a><a>Journal</a><a>Habits</a><a>Finance</a><a>Focus</a><a>Lab</a>" +
      "</aside>" +
      '<div class="desk-main">' +
      '<div class="desk-tile wide mono">Overview · desktop canvas</div>' +
      '<div class="desk-tile"></div><div class="desk-tile"></div>' +
      '<div class="desk-tile"></div><div class="desk-tile"></div></div></div>'
    );
  }

  window.AIIMIN_DEVICES = {
    phone: { w: 390, h: 844, label: 'iPhone 14 logical · 390×844', bezel: 'phone' },
    tablet: { w: 1024, h: 768, label: 'iPad landscape · 1024×768', bezel: 'tablet' },
    laptop: { w: 1440, h: 900, label: 'MacBook-class · 1440×900', bezel: 'laptop' },
  };

  window.renderSnapshot = function (rootEl, persona, themeId, device) {
    device = device || "phone";
    var meta = themeMeta(themeId);
    var dark = meta.mode === "dark";
    var m = persona.meta;
    var r = persona.ranges.snapshot;
    var ls = persona.lifeScore;
    var deltaSign = ls.weekDelta >= 0 ? "up" : "down";
    var deltaAbs = Math.abs(ls.weekDelta);
    var fin =
      persona.finance.status7 === "under"
        ? "Under budget"
        : persona.finance.status7 === "over"
          ? "Over budget"
          : "On budget";
    var weekScores = ls.daily14.slice(-7);

    var metrics = [
      { k: "Mood average", v: persona.mood.avg7.toFixed(1) + " / 10", note: "7d mean" },
      { k: "Habit completion", v: pct(persona.habits.completionRate7), note: "5 tracked" },
      { k: "Focus hours", v: persona.focus.hours7.toFixed(1) + " h", note: "logged" },
      { k: "Finance", v: fin, note: "vs weekly budget" },
      { k: "Journal", v: pct(persona.journal.consistency7), note: "days with entry" },
    ];
    var metricsHTML = metrics
      .map(function (row) {
        return (
          "<li><div><span class='mk'>" +
          row.k +
          "</span><span class='mn mono'>" +
          row.note +
          "</span></div><strong class='mono'>" +
          row.v +
          "</strong></li>"
        );
      })
      .join("");

    var laptopExtra = "";
    if (device === "laptop") {
      laptopExtra =
        '<section class="lap-only">' +
        '<div class="lap-sec-label mono">Week at a glance · desktop only</div>' +
        weekStrip(weekScores, persona.mood.sparkline7) +
        '<div class="lap-grid-2"><div class="lap-panel">' +
        '<div class="lap-sec-label mono">Life Score · 7d</div>' +
        sparkSVG(weekScores, 400, 64) +
        '<div class="lap-compare">' +
        '<div><span class="mono">This week</span><strong>' +
        ls.week +
        "</strong></div>" +
        '<div><span class="mono">Last week</span><strong>' +
        ls.priorWeek +
        "</strong></div>" +
        '<div><span class="mono">Δ</span><strong class="accent">' +
        (ls.weekDelta >= 0 ? "+" : "") +
        ls.weekDelta +
        "</strong></div>" +
        '<div><span class="mono">14d avg</span><strong>' +
        ls.avg14 +
        "</strong></div></div></div>" +
        '<div class="lap-panel">' +
        habitMini(persona.habits.items) +
        "</div></div>" +
        '<div class="lap-grid-3">' +
        '<div class="lap-stat"><span class="mono">Focus</span><strong>' +
        persona.focus.hours7.toFixed(1) +
        'h</strong><em class="mono">avg ' +
        persona.focus.avgSessionMin +
        "m</em></div>" +
        '<div class="lap-stat"><span class="mono">Urge resist</span><strong>' +
        pct(persona.focus.disciplineUrgeResist) +
        '</strong><em class="mono">discipline</em></div>' +
        '<div class="lap-stat"><span class="mono">Top habit</span><strong>' +
        persona.habits.topHabit.split(" ")[0] +
        '</strong><em class="mono">' +
        persona.habits.topHabit +
        "</em></div>" +
        '<div class="lap-stat"><span class="mono">Finance</span><strong>' +
        fin +
        '</strong><em class="mono">7d flag</em></div>' +
        '<div class="lap-stat"><span class="mono">Journal</span><strong>' +
        pct(persona.journal.consistency7) +
        '</strong><em class="mono">consistency</em></div>' +
        '<div class="lap-stat watch"><span class="mono">Watch</span><strong>Caffeine</strong><em class="mono">late rule leak</em></div>' +
        "</div>" +
        '<div class="lap-actions">' +
        '<button type="button" class="snap-btn">Generate Insight</button>' +
        '<button type="button" class="snap-btn ghost">Open Standard Report</button>' +
        '<button type="button" class="snap-btn ghost">Copy week summary</button>' +
        '<span class="snap-quota mono">Desktop modules · AI 1/day</span></div></section>';
    }

    rootEl.innerHTML =
      '<div class="snap-root theme-' +
      themeId +
      (dark ? " is-dark" : " is-light") +
      " device-" +
      device +
      '" data-device="' +
      device +
      '">' +
      osChrome(device, dark) +
      '<div class="snap-backdrop"></div>' +
      '<aside class="snap-drawer" role="dialog" aria-label="Weekly snapshot">' +
      '<header class="snap-head">' +
      '<div class="snap-brand">' +
      window.AIIMIN_BRAND.lockup({ dark: dark, size: device === "phone" ? 32 : 40 }) +
      '<div class="snap-range mono">' +
      r.label +
      (device === "laptop" ? " · desktop pulse" : " · 7-day pulse") +
      "</div></div>" +
      '<div class="snap-who"><div class="snap-name">' +
      m.firstName +
      '</div><div class="snap-os mono">' +
      m.osId +
      "</div></div></header>" +
      '<div class="snap-body">' +
      '<div class="snap-col-primary">' +
      '<div class="snap-score-block">' +
      '<div class="snap-score-label">Life Score · this week</div>' +
      '<div class="snap-score">' +
      ls.week +
      "</div>" +
      '<div class="snap-delta ' +
      deltaSign +
      '">' +
      deltaSign +
      " " +
      deltaAbs +
      " vs prior · was " +
      ls.priorWeek +
      "</div></div>" +
      '<div class="snap-spark-wrap">' +
      '<div class="snap-spark-head"><span class="snap-spark-label">Mood · 7d</span>' +
      '<span class="mono">' +
      persona.mood.sparkline7.join(" · ") +
      "</span></div>" +
      sparkSVG(persona.mood.sparkline7) +
      "</div></div>" +
      '<div class="snap-col-secondary">' +
      '<ul class="snap-metrics">' +
      metricsHTML +
      "</ul>" +
      '<section class="snap-insight">' +
      '<div class="snap-insight-label">Pattern insight</div><p>' +
      persona.ai.snapshotPattern +
      "</p>" +
      (device !== "laptop"
        ? '<div class="snap-insight-actions"><button type="button" class="snap-btn">Generate Insight</button>' +
          '<span class="snap-quota mono">1 AI / day · not auto</span></div>'
        : "") +
      "</section>" +
      '<div class="snap-callouts">' +
      '<div class="snap-callout"><span>Top streak</span><strong>' +
      persona.callouts.topStreak +
      "</strong></div>" +
      '<div class="snap-callout"><span>Biggest win</span><strong>' +
      persona.callouts.biggestWin +
      "</strong></div>" +
      '<div class="snap-callout watch"><span>Watch item</span><strong>' +
      persona.callouts.watchItem +
      "</strong></div></div></div>" +
      laptopExtra +
      "</div>" +
      '<footer class="snap-foot mono">Snapshot · Core+ · ' +
      device +
      " @ fixed viewport · " +
      m.reportRef.snapshot +
      "</footer></aside></div>";
  };
})();
