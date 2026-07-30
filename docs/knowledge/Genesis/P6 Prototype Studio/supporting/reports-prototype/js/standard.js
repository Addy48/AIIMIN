(function () {
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function pct(n) {
    return Math.round(n * 100) + "%";
  }
  function inr(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }
  function themeMeta(id) {
    var list = (window.AIIMIN_THEMES && window.AIIMIN_THEMES.standard) || [];
    return list.find(function (t) { return t.id === id; }) || { layout: "classic" };
  }
  function lineChart(values, w, h, label) {
    var pad = 32;
    var min = Math.min.apply(null, values) - 2;
    var max = Math.max.apply(null, values) + 2;
    var span = max - min || 1;
    var coords = values.map(function (v, i) {
      var x = pad + (i / (values.length - 1)) * (w - pad * 2);
      var y = h - pad - ((v - min) / span) * (h - pad * 2);
      return [x, y];
    });
    var poly = coords.map(function (c) { return c[0].toFixed(1) + "," + c[1].toFixed(1); }).join(" ");
    var yTicks = [min, (min + max) / 2, max]
      .map(function (v) {
        var y = h - pad - ((v - min) / span) * (h - pad * 2);
        return (
          '<line x1="' + pad + '" y1="' + y.toFixed(1) + '" x2="' + (w - pad) + '" y2="' + y.toFixed(1) +
          '" stroke="currentColor" stroke-opacity="0.12"/>' +
          '<text x="' + (pad - 6) + '" y="' + (y + 3).toFixed(1) + '" text-anchor="end" class="chart-label" fill="currentColor">' +
          Math.round(v) + "</text>"
        );
      })
      .join("");
    return (
      '<figure class="fig">' +
      '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(label || "chart") + '">' +
      yTicks +
      '<polyline fill="none" stroke="var(--accent)" stroke-width="2.25" stroke-linejoin="round" points="' + poly + '"/>' +
      "</svg>" +
      '<figcaption class="figcap mono">Fig. — ' + esc(label || "Trend") + " · n=" + values.length + " days · synthetic QS composite</figcaption>" +
      "</figure>"
    );
  }
  function barChart(values, w, h, label) {
    var pad = 28;
    var max = Math.max.apply(null, values.concat([10]));
    var slot = (w - pad * 2) / values.length;
    var bars = values
      .map(function (v, i) {
        var bh = (v / max) * (h - pad * 2);
        var x = pad + i * slot + 2;
        var y = h - pad - bh;
        return (
          '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + Math.max(slot - 4, 5).toFixed(1) +
          '" height="' + bh.toFixed(1) + '" fill="var(--accent)" fill-opacity="0.75" rx="1.5"/>'
        );
      })
      .join("");
    return (
      '<figure class="fig">' +
      '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(label) + '">' + bars + "</svg>" +
      '<figcaption class="figcap mono">Fig. — ' + esc(label) + " · daily mean mood (1–10)</figcaption></figure>"
    );
  }
  function header(persona, title, pageNo) {
    return (
      '<header class="page-header">' +
      '<div class="ph-brand">' +
      window.AIIMIN_BRAND.lockup({ dark: false, size: 28 }) +
      "</div>" +
      '<div class="ph-title">' + esc(title) + "</div>" +
      '<div class="ph-meta"><span>' + esc(persona.ranges.standard.label) + "</span><span>p." + pageNo + "</span></div>" +
      "</header>"
    );
  }
  function methodsBox(persona) {
    return (
      '<aside class="methods-box">' +
      "<h3>Methods (window)</h3>" +
      "<ul>" +
      "<li><strong>Window:</strong> " + esc(persona.ranges.standard.days) + " days inclusive · " + esc(persona.ranges.standard.label) + "</li>" +
      "<li><strong>Life Score:</strong> composite of mood, habits, focus, finance flags (0–100)</li>" +
      "<li><strong>Correlations:</strong> Spearman ρ · Benjamini–Hochberg FDR control</li>" +
      "<li><strong>Weak signals:</strong> |ρ| &lt; 0.30 labeled exploratory only</li>" +
      "<li><strong>n:</strong> " + persona.habits.totalLogged14 + " habit events · " + persona.journal.daysWithEntry14 + " journal days</li>" +
      "<li><strong>Data:</strong> synthetic QS composite (prototype) — not clinical inference</li>" +
      "</ul></aside>"
    );
  }

  window.renderStandard = function (rootEl, persona, themeId) {
    var layout = themeMeta(themeId).layout || "classic";
    var m = persona.meta;
    var marginClass = "";
    var twocol = "";
    var imrad = false;

    var habits = persona.habits.items
      .map(function (h) {
        return (
          '<tr><td>' + esc(h.name) + "</td><td class='mono'>" + pct(h.rate) +
          "</td><td class='mono'>" + h.streak + "</td><td class='mono'>" + h.missed + "</td></tr>"
        );
      })
      .join("");

    var dailyTable = persona.lifeScore.daily14
      .map(function (v, i) {
        return (
          "<tr><td class='mono'>D" + (i + 1) + "</td><td class='mono'>" + v +
          "</td><td class='mono'>" + persona.mood.bars14[i].toFixed(1) + "</td></tr>"
        );
      })
      .join("");

    var tones = Object.keys(persona.mood.toneDistribution)
      .map(function (k) {
        return (
          "<tr><td>" + esc(k) + "</td><td class='mono'>" + persona.mood.toneDistribution[k] + "%</td>" +
          '<td><div class="mini-bar"><i style="width:' + persona.mood.toneDistribution[k] + '%"></i></div></td></tr>'
        );
      })
      .join("");

    var insights = persona.journal.insights
      .map(function (t, i) {
        return "<li><span class='mono'>" + (i + 1) + "</span><span>" + esc(t) + "</span></li>";
      })
      .join("");

    var cats = persona.finance.topCategories
      .map(function (c, i) {
        return (
          "<tr><td class='mono'>" + (i + 1) + "</td><td>" + esc(c.name) +
          "</td><td class='mono'>" + inr(c.amount) + "</td></tr>"
        );
      })
      .join("");

    var corrs = persona.correlations
      .map(function (c) {
        var weak = c.label.indexOf("Weak") >= 0;
        return (
          '<article class="corr-block' + (weak ? " weak" : "") + '">' +
          '<div class="corr-pair">' + esc(c.a) + " × " + esc(c.b) + "</div>" +
          '<div class="corr-stats mono">ρ = ' + c.r.toFixed(2) + " · p = " + c.p.toFixed(3) +
          " · " + esc(c.label) + "</div>" +
          "<p>" + esc(c.plain) + "</p></article>"
        );
      })
      .join("");

    var recs = persona.ai.recommendations14
      .map(function (r, i) {
        return (
          '<article class="rec-block">' +
          '<div class="rec-num">' + (i + 1) + "</div>" +
          "<div><h3>" + esc(r.action) + "</h3><p>" + esc(r.why) +
          '</p><p class="mono rec-tag">data-backed · window-local</p></div></article>'
        );
      })
      .join("");

    var sci = window.AIIMIN_SCIENCE;
    var osBanner =
      layout === "os"
        ? '<div class="os-banner mono"><span>LIFE OS · PRO REPORT</span><span>' +
          esc(m.osId) +
          "</span><span>MODULES OK</span><span>WINDOW 14D</span></div>"
        : "";

    var labExtra =
      layout === "lab" && sci
        ? '<h3 class="sub">Table · BH-FDR association screen (14d proxy)</h3>' +
          '<table class="data-table"><thead><tr><th>A</th><th>B</th><th>ρ</th><th>p</th><th>q</th><th>Sig</th></tr></thead><tbody>' +
          sci.matrix
            .slice(0, 6)
            .map(function (r) {
              return (
                "<tr><td>" +
                esc(r.a) +
                "</td><td>" +
                esc(r.b) +
                "</td><td class='mono'>" +
                r.r.toFixed(2) +
                "</td><td class='mono'>" +
                r.p.toFixed(3) +
                "</td><td class='mono'>" +
                r.q.toFixed(2) +
                "</td><td class='mono'>" +
                (r.sig ? "yes" : "no") +
                "</td></tr>"
              );
            })
            .join("") +
          "</tbody></table>" +
          '<h3 class="sub">Effect sizes</h3>' +
          '<table class="data-table"><thead><tr><th>Contrast</th><th>Δ</th><th>Cliff δ</th><th>Label</th></tr></thead><tbody>' +
          sci.effects
            .map(function (e) {
              return (
                "<tr><td>" +
                esc(e.contrast) +
                "</td><td class='mono'>" +
                esc(e.delta) +
                "</td><td class='mono'>" +
                e.cliffs +
                "</td><td class='mono'>" +
                e.label +
                "</td></tr>"
              );
            })
            .join("") +
          "</tbody></table>"
        : "";

    var sec = function (label, title) {
      return "<h2 class='sec'>" + esc(title) + "</h2>";
    };

    var figH = layout === "lab" ? 200 : 220;
    var figH2 = 170;

    rootEl.innerHTML =
      '<div class="pdf-root folio-root theme-' +
      themeId +
      " layout-" +
      layout +
      '" data-theme="' +
      themeId +
      '">' +

      /* COVER */
      '<section class="page cover">' +
      window.AIIMIN_BRAND.lockup({ dark: false, size: 64 }) +
      '<hr class="orange-rule"/>' +
      '<h1 class="cover-name">' +
      esc(m.fullName) +
      "</h1>" +
      '<p class="cover-title">14-Day Life Pattern Report</p>' +
      '<p class="cover-sub mono">Observational self-tracking summary · not a clinical assessment</p>' +
      '<div class="cover-meta-grid mono">' +
      "<div><span>OS ID</span><strong>" +
      esc(m.osId) +
      "</strong></div>" +
      "<div><span>Window</span><strong>" +
      esc(persona.ranges.standard.label) +
      "</strong></div>" +
      "<div><span>Generated</span><strong>" +
      esc(m.generatedOn) +
      "</strong></div>" +
      "<div><span>Ref</span><strong>" +
      esc(m.reportRef.standard) +
      "</strong></div>" +
      "</div></section>" +

      /* PAGE 1 — Abstract + Methods + Highlights (FULL) */
      '<section class="page' +
      marginClass +
      '">' +
      header(persona, "Abstract & Methods", 1) +
      osBanner +
      '<div class="page-body">' +
      sec("Abstract", "Executive abstract") +
      '<p class="prose lead">' +
      esc(persona.ai.execSummary14) +
      "</p>" +
      '<div class="metric-trio">' +
      '<div><span class="lbl">Mean Life Score</span><strong>' +
      persona.lifeScore.avg14 +
      '</strong><span class="mono sublbl">σ band visual only</span></div>' +
      '<div><span class="lbl">Habit events</span><strong>' +
      persona.habits.totalLogged14 +
      '</strong><span class="mono sublbl">completion ' +
      pct(persona.habits.completionRate14) +
      "</span></div>" +
      '<div><span class="lbl">Mood consistency</span><strong>' +
      pct(persona.mood.consistency14) +
      '</strong><span class="mono sublbl">mean ' +
      persona.mood.avg14.toFixed(1) +
      "/10</span></div>" +
      "</div>" +
      methodsBox(persona) +
      "</div></section>" +

      /* PAGE 2 — Life Score results FULL with table */
      '<section class="page">' +
      header(persona, "Results · Life Score", 2) +
      '<div class="page-body">' +
      sec("Results", "Life Score trajectory") +
      lineChart(persona.lifeScore.daily14, 700, figH, "Daily Life Score across 14-day window") +
      '<p class="prose">' +
      esc(persona.ai.lifeScoreNarrative14) +
      "</p>" +
      '<h3 class="sub">Table 1 · Daily Life Score & mood</h3>' +
      '<table class="data-table"><thead><tr><th>Day</th><th>Life Score</th><th>Mood</th></tr></thead><tbody>' +
      dailyTable +
      "</tbody></table>" +
      "</div></section>" +

      /* PAGE 3 — Habits + Mood FULL */
      '<section class="page">' +
      header(persona, "Results · Habits & Affect", 3) +
      '<div class="page-body">' +
      sec("Results", "Habits and affective tone") +
      '<div class="split-2">' +
      "<div>" +
      '<h3 class="sub">Table 2 · Habit completion</h3>' +
      '<table class="data-table"><thead><tr><th>Habit</th><th>Rate</th><th>Streak</th><th>Missed</th></tr></thead><tbody>' +
      habits +
      "</tbody></table>" +
      '<p class="prose tight">Top: <strong>' +
      esc(persona.habits.topHabit) +
      "</strong>. Most missed: <strong>" +
      esc(persona.habits.mostMissed) +
      "</strong>.</p>" +
      "</div><div>" +
      barChart(persona.mood.bars14, 340, figH2, "Daily mean mood") +
      '<h3 class="sub">Table 3 · Tone distribution</h3>' +
      '<table class="data-table"><thead><tr><th>Tone</th><th>%</th><th></th></tr></thead><tbody>' +
      tones +
      "</tbody></table>" +
      "</div></div>" +
      '<h3 class="sub">Journal-derived observations</h3>' +
      '<ol class="insight-list">' +
      insights +
      "</ol>" +
      '<div class="callout-sci"><span class="mono">CBT pattern</span><p>' +
      esc(persona.journal.cbtPattern) +
      "</p></div>" +
      "</div></section>" +

      /* PAGE 4 — Finance + Correlations FULL */
      '<section class="page">' +
      header(persona, "Results · Finance & Lab", 4) +
      '<div class="page-body">' +
      sec("Results", "Finance snapshot & correlations") +
      '<div class="metric-trio dense">' +
      '<div><span class="lbl">Income</span><strong class="accent">' +
      inr(persona.finance.income14) +
      "</strong></div>" +
      '<div><span class="lbl">Expenses</span><strong>' +
      inr(persona.finance.expenses14) +
      "</strong></div>" +
      '<div><span class="lbl">Surplus</span><strong class="accent">' +
      inr(persona.finance.budgetDelta14) +
      "</strong></div>" +
      "</div>" +
      '<div class="split-2">' +
      "<div>" +
      '<h3 class="sub">Table 4 · Top categories</h3>' +
      '<table class="data-table"><thead><tr><th>#</th><th>Category</th><th>Amount</th></tr></thead><tbody>' +
      cats +
      "</tbody></table>" +
      '<p class="prose tight">' +
      esc(persona.finance.aiSentence) +
      "</p>" +
      '<p class="mono sip">' +
      esc(persona.finance.sipStatus) +
      "</p>" +
      "</div><div>" +
      '<h3 class="sub">Lab · Spearman highlights</h3>' +
      corrs +
      "</div></div>" +
      labExtra +
      "</div></section>" +

      /* PAGE 5 — Discussion / Recommendations FULL */
      '<section class="page">' +
      header(persona, "Discussion · Actions", 5) +
      '<div class="page-body">' +
      sec("Discussion", "Recommendations") +
      '<p class="prose">Each item references a window-local metric. These are behavioral hypotheses for the next fortnight — not prescriptions.</p>' +
      '<div class="rec-list">' +
      recs +
      "</div>" +
      '<div class="limitations">' +
      "<h3 class='sub'>Limitations</h3>" +
      "<ul class='lim-list'>" +
      "<li>Self-report mood and journal text introduce bias and missingness.</li>" +
      "<li>n=14 days is underpowered for stable causal claims; treat ρ as directional.</li>" +
      "<li>Prototype uses synthetic composite data for visual QA.</li>" +
      "<li>No clinical diagnosis; coaching language only.</li>" +
      "</ul></div>" +
      "</div></section>" +

      /* BACK */
      '<section class="page back">' +
      window.AIIMIN_BRAND.lockup({ dark: false, size: 48 }) +
      '<p class="back-line">' +
      esc(m.supportEmail) +
      "</p>" +
      '<p class="back-line">Generated ' +
      esc(m.generatedOn) +
      " for " +
      esc(m.fullName) +
      " · " +
      esc(m.osId) +
      "</p>" +
      '<p class="mono back-ref">' +
      esc(m.reportRef.standard) +
      "</p>" +
      '<p class="muted tiny">Academic Folio · Pro · AIIMIN</p>' +
      "</section></div>";
  };
})();
