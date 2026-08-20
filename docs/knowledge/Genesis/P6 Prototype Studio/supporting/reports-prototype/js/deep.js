/**
 * Elite Deep Report — Round 3
 * ALL architectures are multi-page dense PDF-style documents.
 * No single-page gimmicks.
 */
(function () {
  var P = function () {
    return window.AIIMIN_PDF;
  };
  var S = function () {
    return window.AIIMIN_SCIENCE;
  };

  function themeMeta(id) {
    var list = (window.AIIMIN_THEMES && window.AIIMIN_THEMES.deep) || [];
    return list.find(function (t) {
      return t.id === id;
    }) || { architecture: "atlas" };
  }

  function weeklyTable(sci) {
    return (
      '<table class="data-table"><thead><tr><th>W</th><th>Score</th><th>Mood</th><th>Focus h</th><th>Habits</th><th>Spend ₹</th></tr></thead><tbody>' +
      sci.weekly
        .map(function (w) {
          return (
            "<tr><td class='mono'>" +
            w.w +
            "</td><td class='mono'>" +
            w.score +
            "</td><td class='mono'>" +
            w.mood +
            "</td><td class='mono'>" +
            w.focusH +
            "</td><td class='mono'>" +
            Math.round(w.habits * 100) +
            "%</td><td class='mono'>" +
            w.spend.toLocaleString("en-IN") +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table>"
    );
  }

  function matrixTable(sci) {
    return (
      '<table class="data-table"><thead><tr><th>A</th><th>B</th><th>ρ</th><th>p</th><th>q (BH)</th><th>Sig</th></tr></thead><tbody>' +
      sci.matrix
        .map(function (r) {
          return (
            "<tr><td>" +
            P().esc(r.a) +
            "</td><td>" +
            P().esc(r.b) +
            "</td><td class='mono'>" +
            r.r.toFixed(2) +
            "</td><td class='mono'>" +
            r.p.toFixed(3) +
            "</td><td class='mono'>" +
            r.q.toFixed(2) +
            "</td><td class='mono'>" +
            (r.sig ? "yes" : "no*") +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table><p class='mono tiny'>* exploratory / fails FDR</p>"
    );
  }

  function effectsTable(sci) {
    return (
      '<table class="data-table"><thead><tr><th>Contrast</th><th>Outcome</th><th>Δ</th><th>Cliff δ</th><th>Label</th><th>n</th></tr></thead><tbody>' +
      sci.effects
        .map(function (e) {
          return (
            "<tr><td>" +
            P().esc(e.contrast) +
            "</td><td>" +
            P().esc(e.outcome) +
            "</td><td class='mono'>" +
            P().esc(e.delta) +
            "</td><td class='mono'>" +
            e.cliffs +
            "</td><td class='mono'>" +
            e.label +
            "</td><td class='mono'>" +
            P().esc(e.n) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table>"
    );
  }

  function profilePages(persona, range, startPage) {
    var html = "";
    var chunks = [
      persona.behavioralProfile90.slice(0, 3),
      persona.behavioralProfile90.slice(3),
    ];
    chunks.forEach(function (paras, i) {
      if (!paras.length) return;
      html +=
        '<section class="page">' +
        P().header({ title: "Behavioral profile", range: range, page: startPage + i }) +
        '<h2 class="sec">90-day behavioral profile' +
        (i ? " (cont.)" : "") +
        "</h2>" +
        paras
          .map(function (p) {
            return '<p class="prose lead">' + P().esc(p) + "</p>";
          })
          .join("") +
        "</section>";
    });
    return html;
  }

  function appendixRaw(persona, range, page) {
    var rows = persona.lifeScore.daily90Sample
      .map(function (v, i) {
        return (
          "<tr><td class='mono'>" +
          (i + 1) +
          "</td><td class='mono'>" +
          v +
          "</td><td class='mono'>" +
          persona.mood.bars14[i % 14].toFixed(1) +
          "</td></tr>"
        );
      })
      .join("");
    return (
      '<section class="page">' +
      P().header({ title: "Appendix · raw", range: range, page: page }) +
      '<h2 class="sec">Appendix A · daily Life Score (90)</h2>' +
      '<table class="data-table dense"><thead><tr><th>Day</th><th>Score</th><th>Mood sample</th></tr></thead><tbody>' +
      rows +
      "</tbody></table></section>"
    );
  }

  /* ========== 1 SYSTEMS ATLAS ========== */
  function renderAtlas(root, persona) {
    var sci = S();
    var range = persona.ranges.deep.label;
    var domains = sci.atlasDomains;
    var mapPage =
      '<section class="page atlas-map-page">' +
      P().header({ title: "Master systems map", range: range, page: 2 }) +
      '<h2 class="sec">Life OS · domain graph</h2>' +
      '<p class="prose">Six coupled systems. Edges are hypothesized pathways from the association matrix (not proven causation). Use domain chapters for depth.</p>' +
      '<div class="atlas-map-large">' +
      '<svg viewBox="0 0 800 520" class="atlas-svg" role="img" aria-label="Systems map">' +
      '<line x1="400" y1="90" x2="160" y2="200" class="alink"/><line x1="400" y1="90" x2="640" y2="200" class="alink"/>' +
      '<line x1="160" y1="200" x2="120" y2="360" class="alink"/><line x1="640" y1="200" x2="680" y2="360" class="alink"/>' +
      '<line x1="120" y1="360" x2="400" y2="450" class="alink"/><line x1="680" y1="360" x2="400" y2="450" class="alink"/>' +
      '<line x1="160" y1="200" x2="640" y2="200" class="alink"/><line x1="400" y1="90" x2="400" y2="450" class="alink"/>' +
      domains
        .map(function (d, i) {
          var pos = [
            [400, 90],
            [160, 200],
            [640, 200],
            [120, 360],
            [680, 360],
            [400, 450],
          ][i];
          return (
            '<g transform="translate(' +
            pos[0] +
            "," +
            pos[1] +
            ')">' +
            '<rect x="-70" y="-36" width="140" height="72" rx="10" fill="#fff" stroke="' +
            d.color +
            '" stroke-width="3"/>' +
            '<text text-anchor="middle" y="-8" font-size="12" font-family="Figtree,sans-serif" fill="#14171a">' +
            P().esc(d.name) +
            "</text>" +
            '<text text-anchor="middle" y="14" font-size="16" font-weight="700" font-family="Bricolage Grotesque,sans-serif" fill="' +
            d.color +
            '">' +
            P().esc(d.metrics[0].v) +
            "</text></g>"
          );
        })
        .join("") +
      "</svg>" +
      '<p class="figcap mono">Fig. Master map · node value = primary KPI · stroke = domain color</p></div>' +
      '<div class="atlas-legend">' +
      domains
        .map(function (d) {
          return (
            '<div><i style="background:' +
            d.color +
            '"></i><span>' +
            P().esc(d.name) +
            "</span></div>"
          );
        })
        .join("") +
      "</div></section>";

    var chapters = domains
      .map(function (d, i) {
        return (
          '<section class="page">' +
          P().header({ title: "Domain · " + d.name, range: range, page: 3 + i }) +
          '<div class="domain-band" style="border-color:' +
          d.color +
          '"></div>' +
          '<h2 class="sec" style="color:' +
          d.color +
          '">' +
          P().esc(d.name) +
          " system</h2>" +
          '<p class="prose lead">' +
          d.summary +
          "</p>" +
          '<div class="metric-trio dense">' +
          d.metrics
            .map(function (m) {
              return (
                "<div><span class='lbl'>" +
                P().esc(m.k) +
                "</span><strong style='color:" +
                d.color +
                "'>" +
                P().esc(m.v) +
                "</strong></div>"
              );
            })
            .join("") +
          "</div>" +
          "<h3 class='sub'>Findings</h3><ul class='lim-list'>" +
          d.findings
            .map(function (f) {
              return "<li>" + f + "</li>";
            })
            .join("") +
          "</ul>" +
          (i === 0
            ? P().lineChart(
                persona.lifeScore.daily90Sample.filter(function (_, j) {
                  return j % 2 === 0;
                }),
                700,
                220,
                "Life Score (even days, 90d)"
              )
            : "") +
          (i === 2
            ? '<p class="prose">' +
              P().esc(
                "Focus hours 90d=" +
                  persona.focus.hours90 +
                  "h · pomodoro " +
                  P().pct(persona.focus.pomodoroCompletion) +
                  " · urge resist " +
                  P().pct(persona.focus.disciplineUrgeResist)
              ) +
              "</p>"
            : "") +
          "</section>"
        );
      })
      .join("");

    root.innerHTML =
      '<div class="pdf-root elite-pdf arch-atlas">' +
      P().cover(persona, "90-Day Systems Atlas", "Elite Deep Report · spatial Life OS", false) +
      mapPage +
      chapters +
      '<section class="page">' +
      P().header({ title: "Coupling matrix", range: range, page: 9 }) +
      '<h2 class="sec">Cross-domain associations</h2>' +
      P().methodsBlock(sci) +
      matrixTable(sci) +
      effectsTable(sci) +
      "</section>" +
      profilePages(persona, range, 10) +
      appendixRaw(persona, range, 12) +
      P().back(persona, "Systems Atlas · Elite") +
      "</div>";
  }

  /* ========== 2 MONOGRAPH ========== */
  function renderMonograph(root, persona) {
    var sci = S();
    var range = persona.ranges.deep.label;
    root.innerHTML =
      '<div class="pdf-root elite-pdf arch-monograph">' +
      P().cover(persona, "90-Day Self-Tracking Monograph", "IMRaD · Elite scientific report", false) +
      '<section class="page">' +
      P().header({ title: "Abstract", range: range, page: 1 }) +
      '<div class="imrad-label mono">Abstract</div>' +
      '<h2 class="sec">Abstract</h2>' +
      '<p class="prose lead">' +
      P().esc(persona.ai.execSummary14) +
      " Extended to ninety days, the same hinges replicate: mobility and AM deep work lift the Life Score floor; late caffeine and delivery-as-mood-regulation remain the primary leaks. Change-points on 12 May and 20 Jun mark regime shifts in score level and spend.</p>" +
      '<div class="metric-trio">' +
      "<div><span class='lbl'>90d mean score</span><strong>" +
      persona.lifeScore.avg90 +
      "</strong></div>" +
      "<div><span class='lbl'>Sig. associations</span><strong>" +
      sci.matrix.filter(function (r) {
        return r.sig;
      }).length +
      "</strong></div>" +
      "<div><span class='lbl'>Interventions</span><strong>3</strong></div></div>" +
      P().methodsBlock(sci) +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Methods", range: range, page: 2 }) +
      '<div class="imrad-label mono">Methods</div><h2 class="sec">Methods</h2>' +
      '<p class="prose">Participant: single-subject observational design (N=1 time series). Device: AIIMIN Life OS logs. Missingness: ' +
      sci.methods.missingDays +
      " days dropped pairwise for correlations. Pre-registration: none (exploratory prototype). Multiple comparisons: BH-FDR q=0.10.</p>" +
      '<h3 class="sub">Constructs</h3><ul class="lim-list">' +
      sci.subscales
        .map(function (s) {
          return (
            "<li><strong>" +
            P().esc(s.name) +
            "</strong> (α≈" +
            s.alpha +
            ") — " +
            P().esc(s.items) +
            "</li>"
          );
        })
        .join("") +
      "</ul>" +
      '<h3 class="sub">Analysis plan</h3><p class="prose">Descriptives by week; Spearman associations; binary contrasts with Cliff\'s δ; narrative change-point detection on weekly means. Recommendations restricted to grade ≥B− evidence.</p></section>' +
      '<section class="page">' +
      P().header({ title: "Results · trajectory", range: range, page: 3 }) +
      '<div class="imrad-label mono">Results</div><h2 class="sec">Results — trajectory</h2>' +
      P().lineChart(
        sci.weekly.map(function (w) {
          return w.score;
        }),
        700,
        240,
        "Weekly mean Life Score (13 waves)"
      ) +
      weeklyTable(sci) +
      '<h3 class="sub">Change-points</h3>' +
      sci.changePoints
        .map(function (c) {
          return (
            '<article class="corr-block"><div class="corr-pair">' +
            P().esc(c.date) +
            " — " +
            P().esc(c.signal) +
            '</div><div class="corr-stats mono">' +
            P().esc(c.method) +
            "</div><p>" +
            P().esc(c.drivers) +
            "</p></article>"
          );
        })
        .join("") +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Results · associations", range: range, page: 4 }) +
      '<div class="imrad-label mono">Results</div><h2 class="sec">Results — associations & effects</h2>' +
      matrixTable(sci) +
      '<h3 class="sub">Effect sizes</h3>' +
      effectsTable(sci) +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Discussion", range: range, page: 5 }) +
      '<div class="imrad-label mono">Discussion</div><h2 class="sec">Discussion</h2>' +
      persona.behavioralProfile90
        .map(function (p) {
          return '<p class="prose">' + P().esc(p) + "</p>";
        })
        .join("") +
      '<h3 class="sub">Recommendations (data-bound)</h3>' +
      persona.ai.recommendations14
        .map(function (r, i) {
          return (
            '<article class="rec-block"><div class="rec-num">' +
            (i + 1) +
            "</div><div><h3>" +
            P().esc(r.action) +
            "</h3><p>" +
            P().esc(r.why) +
            "</p></div></article>"
          );
        })
        .join("") +
      '<div class="limitations"><h3 class="sub">Limitations</h3><ul class="lim-list">' +
      "<li>N=1 — no population inference.</li>" +
      "<li>Self-report mood/journal bias.</li>" +
      "<li>No pre-registration; exploratory FDR.</li>" +
      "<li>Prototype uses synthetic composite series.</li></ul></div></section>" +
      appendixRaw(persona, range, 6) +
      P().back(persona, "Scientific Monograph · Elite") +
      "</div>";
  }

  /* ========== 3 LONGITUDINAL ========== */
  function renderLongitudinal(root, persona) {
    var sci = S();
    var range = persona.ranges.deep.label;
    var wavePages = "";
    for (var i = 0; i < sci.weekly.length; i += 4) {
      var slice = sci.weekly.slice(i, i + 4);
      wavePages +=
        '<section class="page">' +
        P().header({ title: "Waves " + slice[0].w + "–" + slice[slice.length - 1].w, range: range, page: 3 + Math.floor(i / 4) }) +
        '<h2 class="sec">Weekly waves</h2>' +
        slice
          .map(function (w) {
            return (
              '<article class="wave-card">' +
              '<div class="wave-head"><strong>Week ' +
              w.w +
              '</strong><span class="mono">score ' +
              w.score +
              "</span></div>" +
              '<div class="metric-trio dense">' +
              "<div><span class='lbl'>Mood</span><strong>" +
              w.mood +
              "</strong></div>" +
              "<div><span class='lbl'>Focus h</span><strong>" +
              w.focusH +
              "</strong></div>" +
              "<div><span class='lbl'>Habits</span><strong>" +
              Math.round(w.habits * 100) +
              "%</strong></div>" +
              "<div><span class='lbl'>Spend</span><strong>₹" +
              w.spend.toLocaleString("en-IN") +
              "</strong></div></div>" +
              '<p class="prose tight">Interpretation: ' +
              (w.score >= 70
                ? "High band — protect AM deep work and mobility."
                : w.score >= 65
                  ? "Stable mid band — watch caffeine and delivery."
                  : "Lower band — prioritize sleep + mobility recovery.") +
              "</p></article>"
            );
          })
          .join("") +
        "</section>";
    }

    root.innerHTML =
      '<div class="pdf-root elite-pdf arch-longitudinal">' +
      P().cover(persona, "90-Day Longitudinal Study", "13 weekly waves · Elite", false) +
      '<section class="page">' +
      P().header({ title: "Design", range: range, page: 1 }) +
      '<h2 class="sec">Study design</h2>' +
      P().methodsBlock(sci) +
      '<p class="prose lead">Repeated weekly measures across 13 waves. Primary endpoint: weekly mean Life Score. Secondary: mood, focus hours, habit rate, discretionary spend.</p>' +
      P().lineChart(
        sci.weekly.map(function (w) {
          return w.score;
        }),
        700,
        260,
        "Primary endpoint across waves"
      ) +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Change-points", range: range, page: 2 }) +
      '<h2 class="sec">Detected regime shifts</h2>' +
      sci.changePoints
        .map(function (c) {
          return (
            '<article class="corr-block"><div class="corr-pair">' +
            P().esc(c.date) +
            "</div><p class='prose'>" +
            P().esc(c.signal) +
            " · " +
            P().esc(c.method) +
            "</p><p class='prose'>" +
            P().esc(c.drivers) +
            "</p></article>"
          );
        })
        .join("") +
      weeklyTable(sci) +
      "</section>" +
      wavePages +
      '<section class="page">' +
      P().header({ title: "Synthesis", range: range, page: 7 }) +
      '<h2 class="sec">Time-based synthesis</h2>' +
      persona.behavioralProfile90
        .slice(0, 3)
        .map(function (p) {
          return '<p class="prose lead">' + P().esc(p) + "</p>";
        })
        .join("") +
      effectsTable(sci) +
      "</section>" +
      appendixRaw(persona, range, 8) +
      P().back(persona, "Longitudinal Study · Elite") +
      "</div>";
  }

  /* ========== 4 CAUSAL ========== */
  function renderCausal(root, persona) {
    var sci = S();
    var range = persona.ranges.deep.label;
    var positions = {
      sleep: [80, 80],
      caffeine: [250, 60],
      mobility: [420, 80],
      deep: [580, 80],
      walk: [80, 220],
      mood: [250, 220],
      focus: [420, 220],
      spend: [580, 220],
      score: [340, 360],
    };
    var nodes = sci.dagNodes
      .map(function (n) {
        var p = positions[n.id];
        return (
          '<g transform="translate(' +
          p[0] +
          "," +
          p[1] +
          ')"><rect x="-54" y="-18" width="108" height="36" rx="6" fill="#fff" stroke="#1c1916" stroke-width="1.5"/><text text-anchor="middle" y="5" font-size="11" font-family="IBM Plex Sans,sans-serif">' +
          P().esc(n.label) +
          "</text></g>"
        );
      })
      .join("");
    var edges = sci.dagEdges
      .map(function (e) {
        var a = positions[e[0]];
        var b = positions[e[1]];
        return (
          '<line x1="' +
          a[0] +
          '" y1="' +
          a[1] +
          '" x2="' +
          b[0] +
          '" y2="' +
          b[1] +
          '" stroke="#ff6b35" stroke-width="1.5" stroke-opacity="0.55"/>'
        );
      })
      .join("");

    root.innerHTML =
      '<div class="pdf-root elite-pdf arch-causal">' +
      P().cover(persona, "Causal Protocol Pack", "DAG · interventions · epistemic limits", false) +
      '<section class="page">' +
      P().header({ title: "Epistemics", range: range, page: 1 }) +
      '<h2 class="sec">What this report will and will not claim</h2>' +
      '<div class="split-2"><div><h3 class="sub">Will claim</h3><ul class="lim-list">' +
      "<li>Associations with FDR control</li><li>Temporal precedence where logs allow</li><li>Intervention protocols as tests</li><li>Effect-size magnitudes on contrasts</li>" +
      '</ul></div><div><h3 class="sub">Will not claim</h3><ul class="lim-list">' +
      "<li>Population causality</li><li>Clinical diagnosis</li><li>Guaranteed outcomes</li><li>Identification without assumptions</li>" +
      "</ul></div></div>" +
      P().methodsBlock(sci) +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "DAG", range: range, page: 2 }) +
      '<h2 class="sec">Working causal diagram</h2>' +
      '<p class="prose">Nodes = logged constructs. Edges = hypothesized directed influence from domain knowledge + temporal order. Orange edges = retained after association screen.</p>' +
      '<svg viewBox="0 0 700 420" class="chart dag-svg">' +
      edges +
      nodes +
      "</svg>" +
      '<p class="figcap mono">Fig. Working DAG · single-subject · assumption-laden</p></section>' +
      '<section class="page">' +
      P().header({ title: "Confounding", range: range, page: 3 }) +
      '<h2 class="sec">Confounders & alternative stories</h2>' +
      '<article class="corr-block"><div class="corr-pair">Sleep ↔ caffeine ↔ focus</div><p class="prose">Late caffeine may harm focus directly and via sleep. Blocking caffeine is a joint intervention on two paths.</p></article>' +
      '<article class="corr-block"><div class="corr-pair">Mood ↔ delivery</div><p class="prose">ρ=0.41 may be mood→spend, spend→guilt→mood, or third variable (time scarcity). Walk protocol tests the behavioral link without needing full identification.</p></article>' +
      '<article class="corr-block"><div class="corr-pair">Mobility ↔ score</div><p class="prose">Common cause possible (conscientiousness day). Still highest-leverage habit by effect size; keep as structural constraint.</p></article>' +
      matrixTable(sci) +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Interventions", range: range, page: 4 }) +
      '<h2 class="sec">Intervention protocols</h2>' +
      sci.interventions
        .map(function (iv) {
          return (
            '<article class="iv-card">' +
            "<h3>" +
            P().esc(iv.name) +
            "</h3>" +
            '<p class="mono">Target path: ' +
            P().esc(iv.target) +
            "</p>" +
            "<p class='prose'><strong>Protocol:</strong> " +
            P().esc(iv.protocol) +
            "</p>" +
            "<p class='prose'><strong>Expected:</strong> " +
            P().esc(iv.expected) +
            "</p>" +
            "<p class='prose'><strong>Measure (" +
            iv.weeks +
            "w):</strong> " +
            P().esc(iv.measure) +
            "</p></article>"
          );
        })
        .join("") +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Effects", range: range, page: 5 }) +
      '<h2 class="sec">Contrast effects (observational)</h2>' +
      effectsTable(sci) +
      '<h3 class="sub">Decision rule</h3><p class="prose">Ship interventions only when grade ≥B− in Evidence Synthesis and path appears in DAG. Re-estimate after 4 weeks.</p></section>' +
      profilePages(persona, range, 6) +
      P().back(persona, "Causal Protocol · Elite") +
      "</div>";
  }

  /* ========== 5 PSYCHOMETRIC ========== */
  function renderPsycho(root, persona) {
    var sci = S();
    var range = persona.ranges.deep.label;
    root.innerHTML =
      '<div class="pdf-root elite-pdf arch-psycho">' +
      P().cover(persona, "Psychometric Dossier", "Constructs · reliability · interpretation", false) +
      '<section class="page">' +
      P().header({ title: "Measurement model", range: range, page: 1 }) +
      '<h2 class="sec">Measurement model</h2>' +
      '<p class="prose lead">Life Score is a formative composite. Subscales below are reflective bundles for interpretation — Cronbach α are prototype heuristics from item covariation in the synthetic series.</p>' +
      P().methodsBlock(sci) +
      '<table class="data-table"><thead><tr><th>Subscale</th><th>Score</th><th>α</th><th>Items / signals</th></tr></thead><tbody>' +
      sci.subscales
        .map(function (s) {
          return (
            "<tr><td><strong>" +
            P().esc(s.name) +
            "</strong></td><td class='mono'>" +
            s.score +
            "</td><td class='mono'>" +
            s.alpha +
            "</td><td>" +
            P().esc(s.items) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table></section>" +
      '<section class="page">' +
      P().header({ title: "Profiles", range: range, page: 2 }) +
      '<h2 class="sec">Subscale profile</h2>' +
      P().barChart(
        sci.subscales.map(function (s) {
          return s.score;
        }),
        700,
        260,
        "Subscale scores (0–100)"
      ) +
      '<p class="figcap mono">Order: ' +
      sci.subscales
        .map(function (s) {
          return s.name;
        })
        .join(" · ") +
      "</p>" +
      '<h3 class="sub">Interpretation</h3>' +
      '<p class="prose">Execution (74) and Solvency (77) lead; Regulation (66) is the constraint system — caffeine + urges + delivery. Coaching should target Regulation without sacrificing Execution mornings.</p>' +
      '<div class="metric-trio">' +
      "<div><span class='lbl'>Life Score week</span><strong>" +
      persona.lifeScore.week +
      "</strong></div>" +
      "<div><span class='lbl'>Mood consistency</span><strong>" +
      P().pct(persona.mood.consistency14) +
      "</strong></div>" +
      "<div><span class='lbl'>Journal α proxy</span><strong>0.76</strong></div></div></section>" +
      '<section class="page">' +
      P().header({ title: "Validity", range: range, page: 3 }) +
      '<h2 class="sec">Validity notes</h2>' +
      '<article class="corr-block"><div class="corr-pair">Convergent</div><p class="prose">Execution subscale tracks focus hours and habit completion (expected).</p></article>' +
      '<article class="corr-block"><div class="corr-pair">Divergent</div><p class="prose">Solvency only weakly tied to mood mean — money stress is episodic, not trait mood.</p></article>' +
      '<article class="corr-block"><div class="corr-pair">Known-groups</div><p class="prose">Mobility-done days score higher on Energy + Execution (medium effects).</p></article>' +
      matrixTable(sci) +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Narrative", range: range, page: 4 }) +
      '<h2 class="sec">Score narrative</h2>' +
      persona.behavioralProfile90
        .map(function (p) {
          return '<p class="prose lead">' + P().esc(p) + "</p>";
        })
        .join("") +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Actions", range: range, page: 5 }) +
      '<h2 class="sec">Construct-targeted actions</h2>' +
      persona.ai.recommendations14
        .map(function (r, i) {
          return (
            '<article class="rec-block"><div class="rec-num">' +
            (i + 1) +
            "</div><div><h3>" +
            P().esc(r.action) +
            "</h3><p>" +
            P().esc(r.why) +
            '</p><p class="mono rec-tag">maps → Regulation / Execution</p></div></article>'
          );
        })
        .join("") +
      "</section>" +
      appendixRaw(persona, range, 6) +
      P().back(persona, "Psychometric Dossier · Elite") +
      "</div>";
  }

  /* ========== 6 RUNBOOK ========== */
  function renderRunbook(root, persona) {
    var sci = S();
    var range = persona.ranges.deep.label;
    root.innerHTML =
      '<div class="pdf-root elite-pdf arch-runbook">' +
      P().cover(persona, "Life OS Runbook", "KPI tree · control · SOPs · real OS feel", false) +
      '<section class="page">' +
      P().header({ title: "System status", range: range, page: 1 }) +
      '<h2 class="sec">Operating status</h2>' +
      '<div class="os-status">' +
      "<div><span class='mono'>HOST</span><strong>" +
      P().esc(persona.meta.fullName) +
      "</strong></div>" +
      "<div><span class='mono'>OS ID</span><strong>" +
      P().esc(persona.meta.osId) +
      "</strong></div>" +
      "<div><span class='mono'>TIER</span><strong>ELITE</strong></div>" +
      "<div><span class='mono'>SCORE</span><strong class='accent'>" +
      persona.lifeScore.week +
      "</strong></div>" +
      "<div><span class='mono'>STATE</span><strong class='accent'>NOMINAL ↑</strong></div>" +
      "<div><span class='mono'>UPTIME SIGNAL</span><strong>mobility 12d</strong></div></div>" +
      P().lineChart(
        sci.weekly.map(function (w) {
          return w.score;
        }),
        700,
        200,
        "Control chart · weekly Life Score"
      ) +
      '<p class="prose">Control limits (prototype): center=' +
      persona.lifeScore.avg90 +
      " · alert if weekly mean &lt; 62 for 2 consecutive waves.</p></section>" +
      '<section class="page">' +
      P().header({ title: "KPI tree", range: range, page: 2 }) +
      '<h2 class="sec">KPI tree</h2>' +
      sci.kpiTree
        .map(function (k) {
          return (
            '<article class="kpi-block"><h3>' +
            P().esc(k.kpi) +
            "</h3><ul class='lim-list'>" +
            k.children
              .map(function (c) {
                return "<li>" + P().esc(c) + "</li>";
              })
              .join("") +
            "</ul></article>"
          );
        })
        .join("") +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "SOPs", range: range, page: 3 }) +
      '<h2 class="sec">Standard operating procedures</h2>' +
      sci.sops
        .map(function (s) {
          return (
            '<article class="sop-card"><h3 class="mono">' +
            P().esc(s.name) +
            "</h3><ol>" +
            s.steps
              .map(function (st) {
                return "<li>" + st + "</li>";
              })
              .join("") +
            "</ol></article>"
          );
        })
        .join("") +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Module health", range: range, page: 4 }) +
      '<h2 class="sec">Module health</h2>' +
      sci.atlasDomains
        .map(function (d) {
          return (
            '<div class="mod-row"><span class="swatch" style="background:' +
            d.color +
            '"></span><strong>' +
            P().esc(d.name) +
            '</strong><span class="mono">' +
            P().esc(d.metrics[0].k + " " + d.metrics[0].v) +
            "</span><span>" +
            d.summary +
            "</span></div>"
          );
        })
        .join("") +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Incident playbooks", range: range, page: 5 }) +
      '<h2 class="sec">Incident playbooks</h2>' +
      '<article class="iv-card"><h3>INC-01 Score &lt; 62 two weeks</h3><p class="prose">Trigger mobility + sleep audit. Freeze new goals. Run I1 caffeine cutoff for 14 days.</p></article>' +
      '<article class="iv-card"><h3>INC-02 Delivery spike</h3><p class="prose">Enforce walk-before-dinner Wed–Fri. Cap delivery nights at 2/week.</p></article>' +
      '<article class="iv-card"><h3>INC-03 Focus collapse</h3><p class="prose">Protect AM deep work; cut evening caffeine; journal 3 lines pre-shutdown.</p></article>' +
      effectsTable(sci) +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Run narrative", range: range, page: 6 }) +
      '<h2 class="sec">Operator narrative</h2>' +
      persona.behavioralProfile90
        .map(function (p) {
          return '<p class="prose">' + P().esc(p) + "</p>";
        })
        .join("") +
      "</section>" +
      appendixRaw(persona, range, 7) +
      P().back(persona, "Life OS Runbook · Elite") +
      "</div>";
  }

  /* ========== 7 EVIDENCE ========== */
  function renderEvidence(root, persona) {
    var sci = S();
    var range = persona.ranges.deep.label;
    root.innerHTML =
      '<div class="pdf-root elite-pdf arch-evidence">' +
      P().cover(persona, "Evidence Synthesis Report", "Graded claims · effect sizes · Elite", false) +
      '<section class="page">' +
      P().header({ title: "Evidence board", range: range, page: 1 }) +
      '<h2 class="sec">Graded evidence board</h2>' +
      '<p class="prose">Grades: A strong multi-method · B solid association + effect · C weak/single · D exploratory only. Recommendations require ≥B−.</p>' +
      sci.evidenceGrades
        .map(function (e) {
          return (
            '<article class="ev-grade grade-' +
            e.grade.replace("+", "p").replace("−", "m").replace("-", "m") +
            '">' +
            '<div class="ev-grade-top"><span class="mono">' +
            e.id +
            '</span><strong class="grade">' +
            e.grade +
            "</strong></div>" +
            "<h3>" +
            P().esc(e.claim) +
            "</h3><p class='prose'>" +
            e.basis +
            "</p></article>"
          );
        })
        .join("") +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Forest of effects", range: range, page: 2 }) +
      '<h2 class="sec">Effect-size panel</h2>' +
      effectsTable(sci) +
      '<div class="forest">' +
      sci.effects
        .map(function (e) {
          var width = Math.min(Math.abs(e.cliffs) * 100, 90);
          return (
            '<div class="forest-row"><span>' +
            P().esc(e.contrast) +
            '</span><div class="forest-bar"><i style="width:' +
            width +
            '%"></i></div><span class="mono">' +
            e.cliffs +
            "</span></div>"
          );
        })
        .join("") +
      "</div></section>" +
      '<section class="page">' +
      P().header({ title: "Matrix", range: range, page: 3 }) +
      '<h2 class="sec">Full association matrix</h2>' +
      P().methodsBlock(sci) +
      matrixTable(sci) +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Actions from evidence", range: range, page: 4 }) +
      '<h2 class="sec">Actions mapped to grades</h2>' +
      sci.interventions
        .map(function (iv) {
          return (
            '<article class="iv-card"><h3>' +
            P().esc(iv.name) +
            "</h3><p class='prose'>" +
            P().esc(iv.protocol) +
            "</p><p class='mono'>Expected: " +
            P().esc(iv.expected) +
            "</p></article>"
          );
        })
        .join("") +
      persona.ai.recommendations14
        .slice(0, 3)
        .map(function (r, i) {
          return (
            '<article class="rec-block"><div class="rec-num">' +
            (i + 1) +
            "</div><div><h3>" +
            P().esc(r.action) +
            "</h3><p>" +
            P().esc(r.why) +
            "</p></div></article>"
          );
        })
        .join("") +
      "</section>" +
      profilePages(persona, range, 5) +
      appendixRaw(persona, range, 7) +
      P().back(persona, "Evidence Synthesis · Elite") +
      "</div>";
  }

  /* ========== 8 BOARD PACK ========== */
  function renderBoard(root, persona) {
    var sci = S();
    var range = persona.ranges.deep.label;
    root.innerHTML =
      '<div class="pdf-root elite-pdf arch-board">' +
      P().cover(persona, "Quarterly Life OS Board Pack", "Elite performance review · 90 days", false) +
      '<section class="page">' +
      P().header({ title: "Executive brief", range: range, page: 1 }) +
      '<h2 class="sec">Executive brief</h2>' +
      '<p class="prose lead">' +
      P().esc(persona.behavioralProfile90[4]) +
      "</p>" +
      '<div class="metric-trio">' +
      "<div><span class='lbl'>Score now</span><strong>" +
      persona.lifeScore.week +
      "</strong></div>" +
      "<div><span class='lbl'>90d mean</span><strong>" +
      persona.lifeScore.avg90 +
      "</strong></div>" +
      "<div><span class='lbl'>Half-over-half</span><strong class='accent'>+≈6</strong></div></div>" +
      '<h3 class="sub">Three board decisions</h3>' +
      sci.interventions
        .map(function (iv, i) {
          return (
            '<p class="prose"><strong>' +
            (i + 1) +
            ". " +
            P().esc(iv.name) +
            ":</strong> " +
            P().esc(iv.protocol) +
            "</p>"
          );
        })
        .join("") +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Performance", range: range, page: 2 }) +
      '<h2 class="sec">Performance trajectory</h2>' +
      P().lineChart(
        sci.weekly.map(function (w) {
          return w.score;
        }),
        700,
        240,
        "Weekly Life Score"
      ) +
      weeklyTable(sci) +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Modules", range: range, page: 3 }) +
      '<h2 class="sec">Module scorecards</h2>' +
      sci.atlasDomains
        .map(function (d) {
          return (
            '<article class="corr-block"><div class="corr-pair">' +
            P().esc(d.name) +
            '</div><div class="metric-trio dense">' +
            d.metrics
              .map(function (m) {
                return (
                  "<div><span class='lbl'>" +
                  P().esc(m.k) +
                  "</span><strong>" +
                  P().esc(m.v) +
                  "</strong></div>"
                );
              })
              .join("") +
            "</div><p class='prose'>" +
            d.summary +
            "</p></article>"
          );
        })
        .join("") +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Lab", range: range, page: 4 }) +
      '<h2 class="sec">Lab & evidence</h2>' +
      matrixTable(sci) +
      effectsTable(sci) +
      "</section>" +
      '<section class="page">' +
      P().header({ title: "Goals", range: range, page: 5 }) +
      '<h2 class="sec">Goals & career</h2>' +
      persona.goals
        .map(function (g) {
          return (
            '<article class="goal-card"><h3>' +
            P().esc(g.name) +
            '</h3><div class="habit-bar"><i style="width:' +
            P().pct(g.progress) +
            '"></i></div><p class="mono">' +
            P().pct(g.progress) +
            " · " +
            P().esc(g.projected) +
            "</p><p class='prose'>" +
            P().esc(g.observation) +
            "</p></article>"
          );
        })
        .join("") +
      '<p class="prose">' +
      P().esc(persona.career.note) +
      "</p></section>" +
      '<section class="page">' +
      P().header({ title: "Narrative", range: range, page: 6 }) +
      '<h2 class="sec">Board narrative</h2>' +
      persona.behavioralProfile90
        .map(function (p) {
          return '<p class="prose lead">' + P().esc(p) + "</p>";
        })
        .join("") +
      "</section>" +
      appendixRaw(persona, range, 7) +
      P().back(persona, "Quarterly Board Pack · Elite") +
      "</div>";
  }

  window.renderDeep = function (rootEl, persona, themeId) {
    var arch = themeMeta(themeId).architecture || "atlas";
    if (arch === "monograph") return renderMonograph(rootEl, persona);
    if (arch === "longitudinal") return renderLongitudinal(rootEl, persona);
    if (arch === "causal") return renderCausal(rootEl, persona);
    if (arch === "psycho") return renderPsycho(rootEl, persona);
    if (arch === "runbook") return renderRunbook(rootEl, persona);
    if (arch === "evidence") return renderEvidence(rootEl, persona);
    if (arch === "board") return renderBoard(rootEl, persona);
    return renderAtlas(rootEl, persona);
  };
})();
