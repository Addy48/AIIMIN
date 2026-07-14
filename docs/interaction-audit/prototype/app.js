(function () {
  "use strict";

  var VIEWS = [
    { id: "paradigm", label: "Paradigm", rank: null, eyebrow: "Audit §16", title: "The paradigm shift" },
    { id: "finance", label: "Finance", rank: 2, eyebrow: "Rank #2 · P0", title: "NL capture only", compare: true },
    { id: "journal", label: "Journal", rank: 3, eyebrow: "Rank #3", title: "Ambient draft", compare: true },
    { id: "onboarding", label: "Onboarding", rank: 1, eyebrow: "Rank #1 · P0", title: "No wizard wall", compare: true },
    { id: "palette", label: "Cmd Palette", rank: 5, eyebrow: "Rank #5", title: "Predictive + GenUI" },
    { id: "lifescore", label: "Life Score", rank: 4, eyebrow: "Rank #4", title: "Bounded mirror", compare: true },
    { id: "timeline", label: "Timeline", rank: 8, eyebrow: "Rank #8", title: "AI action log" },
    { id: "swipe", label: "Swipe drafts", rank: 9, eyebrow: "Rank #9", title: "Binary decisions" },
    { id: "roadmap", label: "Roadmap", rank: null, eyebrow: "Build order", title: "What ships when" },
  ];

  var PREDICTIVE = [
    { label: "Log lunch expense", reason: "12:40 — you usually log food now", query: "spent 320 on lunch at campus" },
    { label: "Mark gym habit", reason: "Calendar block ended 30m ago", query: "gym done 45 min" },
    { label: "Journal — low energy", reason: "No capture in 6 hours", query: "feeling drained after three meetings" },
  ];

  var state = {
    view: "paradigm",
    showToday: true,
    theme: "aiimin-dark",
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function toast(msg, type) {
    var stack = $("#toast-stack");
    var el = document.createElement("div");
    el.className = "toast" + (type ? " " + type : "");
    el.textContent = msg;
    stack.appendChild(el);
    setTimeout(function () {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      setTimeout(function () { el.remove(); }, 200);
    }, 2800);
  }

  function compareSplit(todayBody, targetBody, noteHtml) {
    var todayClass = state.showToday ? "" : " is-hidden";
    return (
      '<div class="compare-split view-enter">' +
        '<div class="compare-col' + todayClass + '" id="col-today">' +
          '<div class="compare-col-header">' +
            '<span class="compare-badge today">Today</span>' +
            '<span style="font-size:12px;color:var(--text-3)">High friction</span>' +
          '</div>' +
          '<div class="device"><div class="device-chrome">' + todayBody.title + '</div><div class="device-body">' + todayBody.html + '</div></div>' +
        '</div>' +
        '<div class="compare-col" id="col-target">' +
          '<div class="compare-col-header">' +
            '<span class="compare-badge target">Target</span>' +
            '<span style="font-size:12px;color:var(--text-3)">Audit goal</span>' +
          '</div>' +
          '<div class="device"><div class="device-chrome">' + targetBody.title + '</div><div class="device-body">' + targetBody.html + '</div></div>' +
        '</div>' +
      '</div>' +
      (noteHtml ? '<div class="card" style="margin-top:20px"><div class="card-body">' + noteHtml + '</div></div>' : '')
    );
  }

  function viewParadigm() {
    return (
      '<div class="view-enter">' +
        '<section class="hero stagger">' +
          '<div class="hero-copy">' +
            '<h2>AI is the interface — not the form filler</h2>' +
            '<p>Every fix in the audit still assumed the destination is a form with fewer fields. The target: generated confirmation surfaces, ambient drafts, predictive capture — AI shapes the UI per utterance.</p>' +
            '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">' +
              '<button type="button" class="btn btn-primary" data-action="open-palette">Try ⌘K now</button>' +
              '<button type="button" class="btn btn-ghost" data-goto="onboarding">See onboarding kill (#1)</button>' +
            '</div>' +
          '</div>' +
          '<div class="stat-grid">' +
            '<div class="stat-card"><div class="n" style="color:var(--success)">7</div><div class="l">Keep</div></div>' +
            '<div class="stat-card"><div class="n" style="color:var(--warning)">5</div><div class="l">Modify</div></div>' +
            '<div class="stat-card"><div class="n" style="color:var(--danger)">1</div><div class="l">Remove</div></div>' +
          '</div>' +
        '</section>' +
        '<div class="grid-2" style="margin-top:8px">' +
          '<div class="card"><div class="card-head"><h3>What dies</h3></div><div class="card-body" style="font-size:14px;color:var(--text-2);display:grid;gap:8px">' +
            '<span>Journal mode picker (CBT / free / morning)</span>' +
            '<span>Expense category dropdown</span>' +
            '<span>Standalone mood 1–10 picker</span>' +
            '<span>9-step onboarding wall</span>' +
            '<span>Life Score daily delta + streak shame</span>' +
          '</div></div>' +
          '<div class="card"><div class="card-head"><h3>What ships</h3></div><div class="card-body" style="font-size:14px;color:var(--text-2);display:grid;gap:8px">' +
            '<span>NL capture → chip confirm (finance #2)</span>' +
            '<span>Ambient draft empty states (journal #3)</span>' +
            '<span>First capture = account (#1)</span>' +
            '<span>Command Timeline as AI log (#8)</span>' +
            '<span>Swipe AI drafts only (#9)</span>' +
          '</div></div>' +
        '</div>' +
      '</div>'
    );
  }

  function viewFinance() {
    return compareSplit(
      {
        title: "New transaction",
        html:
          '<div class="field"><label>Amount</label><input value="450" readonly /></div>' +
          '<div class="field"><label>Category</label><input value="Select…" readonly style="color:var(--text-3)" /></div>' +
          '<div class="field"><label>Date</label><input value="Jul 12" readonly /></div>' +
          '<div class="field"><label>Account</label><input value="HDFC" readonly /></div>' +
          '<div class="field"><label>Note</label><input readonly style="color:var(--text-3)" /></div>' +
          '<button type="button" class="btn btn-primary">Save</button>' +
          '<p style="font-size:12px;color:var(--text-3);margin-top:10px">6 fields · friction 5.8</p>',
      },
      {
        title: "Capture",
        html:
          '<input class="capture-input" value="spent 450 on groceries" />' +
          '<p style="font-size:13px;font-weight:600;margin:14px 0 8px">Confirm inferred</p>' +
          '<div class="chip-row"><span class="chip active">₹450</span><span class="chip active">Groceries</span><span class="chip active">Today</span></div>' +
          '<button type="button" class="btn btn-primary" id="finance-log">Log it</button>' +
          '<p style="font-size:12px;color:var(--text-3);margin-top:10px">1 utterance · amount never inferred</p>',
      },
      '<p style="color:var(--text-2);font-size:14px"><strong>Rank #2.</strong> NL becomes the only path. Form exists only for accessibility / error correction. Category chips until merchant memory hits 85%+.</p>'
    );
  }

  function viewJournal() {
    return compareSplit(
      {
        title: "Journal",
        html:
          '<p style="font-size:13px;font-weight:600;margin-bottom:8px">What mode?</p>' +
          '<div class="chip-row"><span class="chip active">Free write</span><span class="chip">CBT</span><span class="chip">Morning pages</span></div>' +
          '<textarea class="capture-input" style="min-height:90px;margin-top:10px" placeholder="Start writing…"></textarea>' +
          '<p style="font-size:12px;color:var(--text-3);margin-top:10px">Structure before content — kills vent (INT-166)</p>',
      },
      {
        title: "Journal",
        html:
          '<div class="draft-card"><div class="draft-label">Draft from today</div>' +
          '<p style="font-size:14px;color:var(--text-2)">Three meetings, gym skipped, rushed after lunch. Calendar + last capture → low energy afternoon.</p></div>' +
          '<input class="capture-input" placeholder="Or type / speak…" />' +
          '<div class="chip-row"><span class="chip stakes active">mood: low</span><span class="chip">reflection</span></div>' +
          '<p style="font-size:12px;color:var(--text-3)">Tags after save only</p>',
      },
      '<p style="color:var(--text-2);font-size:14px"><strong>Rank #3.</strong> Empty state = ambient draft. Mode picker killed. Post-save NLP tags.</p>'
    );
  }

  function viewOnboarding() {
    return compareSplit(
      {
        title: "Setup — 3 of 9",
        html:
          '<div style="height:6px;background:var(--elevated);border-radius:999px;margin-bottom:14px"><div style="width:33%;height:100%;background:var(--accent);border-radius:999px"></div></div>' +
          '<div class="field"><label>Wake time</label><input value="07:00" readonly /></div>' +
          '<div class="field"><label>Pillar</label><input value="Select…" readonly style="color:var(--text-3)" /></div>' +
          '<button type="button" class="btn btn-primary">Continue</button>' +
          '<p style="font-size:12px;color:var(--text-3);margin-top:10px">45+ fields · friction 6.8</p>',
      },
      {
        title: "AIIMIN",
        html:
          '<p style="font-weight:600;margin-bottom:12px">What happened today?</p>' +
          '<input class="capture-input" value="Spent 450 on groceries, skipped gym…" />' +
          '<button type="button" class="btn btn-primary" style="margin-top:14px;width:100%">Continue with Google</button>' +
          '<p style="font-size:12px;color:var(--text-3);margin-top:12px">4 fields total · first capture = account</p>',
      },
      '<p style="color:var(--text-2);font-size:14px"><strong>Rank #1.</strong> No onboarding phase. Family Vault: ask blood group only when user hits export wallet — not in a wizard.</p>'
    );
  }

  function viewPalette() {
    return (
      '<div class="view-enter">' +
        '<p style="color:var(--text-2);margin-bottom:20px;max-width:58ch">Press <button type="button" class="btn btn-primary" data-action="open-palette" style="padding:6px 12px;font-size:13px">⌘K</button> — predictive suggestions appear before typing. Typed utterance gets a <em>generated</em> confirm shape, not a fixed modal.</p>' +
        '<div class="compare-split">' +
          '<div class="compare-col"><div class="compare-col-header"><span class="compare-badge today">Today</span></div>' +
            '<div class="device"><div class="device-chrome">⌘K</div><div class="device-body">' +
              '<input class="capture-input" placeholder="Type anything…" readonly style="color:var(--text-3)" />' +
              '<p style="font-size:12px;color:var(--text-3);margin-top:12px">Route → static modal or silent write</p>' +
            '</div></div></div>' +
          '<div class="compare-col"><div class="compare-col-header"><span class="compare-badge target">Target</span></div>' +
            '<div class="device"><div class="device-chrome">⌘K — before type</div><div class="device-body">' +
              '<p class="section-label" style="padding:0;margin-bottom:8px">Likely next</p>' +
              PREDICTIVE.map(function (p) {
                return '<div class="palette-item" style="pointer-events:none;margin-bottom:4px"><strong>' + p.label + '</strong><small>' + p.reason + '</small></div>';
              }).join("") +
            '</div></div></div>' +
        '</div>' +
      '</div>'
    );
  }

  function viewLifescore() {
    return compareSplit(
      {
        title: "Life Score",
        html:
          '<div class="score-display">72</div>' +
          '<p class="score-bad">−8 from yesterday</p>' +
          '<p class="score-bad">Streak broken — 4 day gym gap</p>' +
          '<span class="pill pill-kill" style="margin-top:10px;display:inline-block">Share score</span>',
      },
      {
        title: "Life Score",
        html:
          '<p style="font-size:11px;font-family:var(--font-mono);color:var(--text-3);text-transform:uppercase">This week</p>' +
          '<div class="score-good">Steady</div>' +
          '<p style="font-size:14px;color:var(--text-2);margin-top:10px">Weekly trend only. Gap in gym — not "broken".</p>' +
          '<div class="trend-bars"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>',
      },
      '<p style="color:var(--text-2);font-size:14px"><strong>Rank #4.</strong> Wearable harm research: ~1 in 4 self-trackers report streak anxiety. Enforce anti-patterns — no daily delta, no shame framing, no share.</p>'
    );
  }

  function viewTimeline() {
    var events = [
      ["09:14", "inference", "Groceries inferred 87% — chip shown"],
      ["09:14", "capture", "Finance logged — user confirmed"],
      ["11:02", "draft", "Journal draft from calendar — pending"],
      ["14:30", "insight", "No finance 4d — recovery offer (not push)"],
      ["18:00", "inference", "Mood low — stakes band forced chip"],
    ];
    return (
      '<div class="view-enter">' +
        '<p style="color:var(--text-2);margin-bottom:18px">Workflow timeline — not a chat thread. Every AI action inspectable.</p>' +
        '<div class="timeline">' +
          events.map(function (e, i) {
            return (
              '<div class="timeline-row" style="animation-delay:' + (i * 60) + 'ms">' +
                '<span class="timeline-time">' + e[0] + '</span>' +
                '<span class="timeline-dot ' + e[1] + '"></span>' +
                '<div><span class="timeline-type">' + e[1] + '</span><p>' + e[2] + '</p></div>' +
              '</div>'
            );
          }).join("") +
        '</div>' +
      '</div>'
    );
  }

  function viewSwipe() {
    return (
      '<div class="view-enter">' +
        '<p style="color:var(--text-2);margin-bottom:20px;text-align:center">Drag the card — or use buttons. AI drafts only, not your habit list.</p>' +
        '<div class="swipe-stage" id="swipe-stage">' +
          '<div class="swipe-card" id="swipe-card">' +
            '<p style="font-size:11px;font-family:var(--font-mono);color:var(--text-3);text-transform:uppercase">Receipt OCR draft</p>' +
            '<p style="font-size:1.35rem;font-weight:700;margin:10px 0">₹1,240 — Amazon</p>' +
            '<p style="color:var(--text-2)">Electronics · Today</p>' +
            '<div class="swipe-actions">' +
              '<button type="button" class="btn btn-ghost" id="swipe-discard">Discard</button>' +
              '<button type="button" class="btn btn-success" id="swipe-accept">Accept</button>' +
            '</div>' +
          '</div>' +
          '<div class="swipe-hints"><span>← discard</span><span>accept →</span></div>' +
        '</div>' +
      '</div>'
    );
  }

  function viewRoadmap() {
    var items = [
      [1, "Kill onboarding gate", "High", "Med"],
      [2, "Finance NL only", "High", "Low"],
      [3, "Ambient draft", "High", "High"],
      [4, "Life Score guardrails", "Med", "Low"],
      [5, "GenUI confirms", "High", "High"],
      [6, "Stakes band", "Med", "Low"],
      [7, "Vault ask-on-demand", "Med", "Med"],
      [8, "Command Timeline", "Med", "Med"],
      [9, "Swipe AI drafts", "Med", "Low"],
    ];
    return (
      '<div class="view-enter">' +
        '<div class="card"><div class="card-head"><h3>Build order — audit §12</h3></div>' +
        '<div class="card-body" style="padding:0"><table class="data-table"><thead><tr><th>#</th><th>Item</th><th>Impact</th><th>Effort</th></tr></thead><tbody>' +
          items.map(function (r) {
            return '<tr><td class="rank">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>';
          }).join("") +
        '</tbody></table></div></div>' +
        '<p style="margin-top:16px;font-size:13px;color:var(--text-3)">Do not touch: habit toggle · mood-only capture · journal encryption</p>' +
      '</div>'
    );
  }

  var VIEW_RENDERERS = {
    paradigm: viewParadigm,
    finance: viewFinance,
    journal: viewJournal,
    onboarding: viewOnboarding,
    palette: viewPalette,
    lifescore: viewLifescore,
    timeline: viewTimeline,
    swipe: viewSwipe,
    roadmap: viewRoadmap,
  };

  function renderNav() {
    var nav = $("#sidebar-nav");
    nav.innerHTML = VIEWS.map(function (v) {
      return (
        '<button type="button" class="nav-item' + (v.id === state.view ? " active" : "") + '" data-view="' + v.id + '">' +
          '<span>' + v.label + '</span>' +
          (v.rank ? '<span class="nav-rank">#' + v.rank + '</span>' : "") +
        '</button>'
      );
    }).join("");

    $$("[data-view]", nav).forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.view = btn.getAttribute("data-view");
        state.showToday = true;
        render();
        $("#sidebar").classList.remove("open");
      });
    });
  }

  function bindViewEvents() {
    var logBtn = $("#finance-log");
    if (logBtn) logBtn.addEventListener("click", function () {
      toast("Logged · Command Timeline updated", "success");
    });

    $$("[data-goto]").forEach(function (el) {
      el.addEventListener("click", function () {
        state.view = el.getAttribute("data-goto");
        render();
      });
    });

    $$("[data-action=open-palette]").forEach(function (el) {
      el.addEventListener("click", openPalette);
    });

    initSwipe();
  }

  function initSwipe() {
    var card = $("#swipe-card");
    if (!card) return;

    var startX = 0;
    var currentX = 0;
    var dragging = false;

    function finishSwipe(cls, msg) {
      card.classList.add(cls);
      toast(msg, cls === "accepted" ? "success" : "");
      setTimeout(function () {
        card.classList.remove(cls);
        card.style.transform = "";
      }, 400);
    }

    card.addEventListener("mousedown", function (e) {
      dragging = true;
      startX = e.clientX;
      card.classList.add("dragging");
    });

    window.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      currentX = e.clientX - startX;
      card.style.transform = "translateX(" + currentX + "px) rotate(" + (currentX * 0.04) + "deg)";
    });

    window.addEventListener("mouseup", function () {
      if (!dragging) return;
      dragging = false;
      card.classList.remove("dragging");
      if (currentX > 90) finishSwipe("accepted", "Logged");
      else if (currentX < -90) finishSwipe("discarded", "Discarded");
      else card.style.transform = "";
      currentX = 0;
    });

    var accept = $("#swipe-accept");
    var discard = $("#swipe-discard");
    if (accept) accept.addEventListener("click", function () { finishSwipe("accepted", "Logged"); });
    if (discard) discard.addEventListener("click", function () { finishSwipe("discarded", "Discarded"); });
  }

  function renderPredictive() {
    var list = $("#predictive-list");
    list.innerHTML = PREDICTIVE.map(function (item, i) {
      return (
        '<button type="button" class="palette-item" data-query="' + item.query + '" style="animation-delay:' + (i * 40) + 'ms">' +
          '<strong>' + item.label + '</strong><small>' + item.reason + '</small>' +
        '</button>'
      );
    }).join("");

    $$("[data-query]", list).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var q = btn.getAttribute("data-query");
        $("#palette-input").value = q;
        handlePaletteInput(q);
      });
    });
  }

  function handlePaletteInput(value) {
    var trimmed = (value || "").trim();
    var predictive = $("#palette-predictive");
    var results = $("#palette-results");
    var confirm = $("#gen-confirm");

    if (!trimmed) {
      predictive.hidden = false;
      results.hidden = true;
      return;
    }

    predictive.hidden = true;
    results.hidden = false;

    var amount = (trimmed.match(/\d+/) || [])[0] || "—";

    if (/spent|grocer|lunch|expense|₹|rs/i.test(trimmed)) {
      confirm.innerHTML =
        '<p style="font-size:12px;color:var(--text-3);margin-bottom:10px">Finance · generated 1-chip confirm</p>' +
        '<div class="chip-row"><span class="chip active">₹' + amount + ' Groceries</span><span class="chip active">Today</span></div>' +
        '<button type="button" class="btn btn-primary" style="margin-top:12px" id="palette-confirm">Log it</button>';
    } else if (/gym|habit/i.test(trimmed)) {
      confirm.innerHTML =
        '<p style="font-size:12px;color:var(--text-3);margin-bottom:10px">Habit — act stays manual</p>' +
        '<p>Mark <strong>Gym</strong> complete?</p>' +
        '<button type="button" class="btn btn-primary" style="margin-top:12px" id="palette-confirm">Confirm</button>';
    } else {
      confirm.innerHTML =
        '<p style="font-size:12px;color:var(--text-3);margin-bottom:10px">Journal · stakes band</p>' +
        '<p style="color:var(--text-2);margin-bottom:10px">' + trimmed + '</p>' +
        '<div class="chip-row"><span class="chip stakes active">mood: low</span></div>' +
        '<button type="button" class="btn btn-primary" style="margin-top:12px" id="palette-confirm">Save</button>';
    }

    var confirmBtn = $("#palette-confirm");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        closePalette();
        toast("Captured · Timeline updated", "success");
      });
    }
  }

  function openPalette() {
    $("#palette-overlay").hidden = false;
    var input = $("#palette-input");
    input.value = "";
    $("#palette-predictive").hidden = false;
    $("#palette-results").hidden = true;
    renderPredictive();
    setTimeout(function () { input.focus(); }, 50);
  }

  function closePalette() {
    $("#palette-overlay").hidden = true;
  }

  function render() {
    var view = VIEWS.filter(function (v) { return v.id === state.view; })[0];
    $("#view-eyebrow").textContent = view.eyebrow;
    $("#view-title").textContent = view.title;

    var compareBtn = $("#compare-toggle");
    if (view.compare) {
      compareBtn.hidden = false;
      $("#compare-label").textContent = state.showToday ? "Hide today" : "Show today";
    } else {
      compareBtn.hidden = true;
    }

    $("#content").innerHTML = VIEW_RENDERERS[state.view]();
    renderNav();
    bindViewEvents();

    var colToday = $("#col-today");
    if (colToday) {
      colToday.classList.toggle("is-hidden", !state.showToday);
    }
  }

  function init() {
    if (localStorage.getItem("aiimin-proto-guide") === "1") {
      $("#guide-overlay").classList.add("is-dismissed");
    }

    $("#guide-dismiss").addEventListener("click", function () {
      $("#guide-overlay").classList.add("is-dismissed");
      localStorage.setItem("aiimin-proto-guide", "1");
    });

    renderNav();

    $("#compare-toggle").addEventListener("click", function () {
      state.showToday = !state.showToday;
      var col = $("#col-today");
      if (col) col.classList.toggle("is-hidden", !state.showToday);
      $("#compare-label").textContent = state.showToday ? "Hide today" : "Show today";
    });

    $("#open-palette-top").addEventListener("click", openPalette);
    $("#strip-open").addEventListener("click", openPalette);
    $("#strip-input").addEventListener("click", openPalette);

    $$("[data-close-palette]").forEach(function (el) {
      el.addEventListener("click", closePalette);
    });

    $("#palette-input").addEventListener("input", function (e) {
      handlePaletteInput(e.target.value);
    });

    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openPalette();
      }
      if (e.key === "Escape") closePalette();
      if (e.key === "Enter" && !$("#palette-overlay").hidden) {
        var btn = $("#palette-confirm");
        if (btn) btn.click();
      }
    });

    $("#theme-toggle").addEventListener("click", function () {
      state.theme = state.theme === "aiimin-dark" ? "aiimin-light" : "aiimin-dark";
      document.documentElement.setAttribute("data-theme", state.theme);
    });

    $("#menu-toggle").addEventListener("click", function () {
      $("#sidebar").classList.toggle("open");
    });

    render();
  }

  init();
})();
