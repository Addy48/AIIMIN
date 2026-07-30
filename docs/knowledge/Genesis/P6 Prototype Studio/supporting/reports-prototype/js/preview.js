(function () {
  var params = new URLSearchParams(location.search);
  var type = params.get("type") || "snapshot";
  var id = params.get("v") || (window.AIIMIN_THEMES[type] || [])[0]?.id;
  var device = params.get("device") || "phone";
  var themes = window.AIIMIN_THEMES[type] || [];
  var theme =
    themes.find(function (t) {
      return t.id === id;
    }) || themes[0];
  var persona = window.AIIMIN_PERSONA;

  var stage = document.getElementById("stage");
  var titleEl = document.getElementById("pv-title");
  var subEl = document.getElementById("pv-sub");
  var navEl = document.getElementById("pv-nav");
  var deviceEl = document.getElementById("pv-device");

  var resizeHandler = null;

  function loadFonts(googleFonts) {
    if (!googleFonts) return;
    var href = "https://fonts.googleapis.com/css2?family=" + googleFonts + "&display=swap";
    var link = document.getElementById("dynamic-fonts");
    if (!link) {
      link = document.createElement("link");
      link.id = "dynamic-fonts";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = href;
  }

  /** Scale bezel into spacer box — no negative-margin overlap with meta/chrome */
  function fitScale(wrap, bezel) {
    if (!wrap || !bezel) return;
    var padX = 32;
    var padY = 72; /* chrome + meta */
    var availW = Math.max(stage.clientWidth - padX, 160);
    var availH = Math.max(window.innerHeight - 56 - padY, 160);

    /* measure unscaled */
    bezel.style.transform = "none";
    var bw = bezel.offsetWidth;
    var bh = bezel.offsetHeight;
    if (!bw || !bh) return;

    var s = Math.min(availW / bw, availH / bh, 1);
    wrap.style.width = Math.round(bw * s) + "px";
    wrap.style.height = Math.round(bh * s) + "px";
    wrap.style.overflow = "hidden";
    bezel.style.transform = "scale(" + s.toFixed(4) + ")";
    bezel.style.transformOrigin = "top left";
  }

  function clearResize() {
    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
      resizeHandler = null;
    }
  }

  function mountDeviceFrame(devKey) {
    var spec = window.AIIMIN_DEVICES[devKey] || window.AIIMIN_DEVICES.phone;
    var bezelClass = "device-bezel is-" + spec.bezel;
    var extras = "";
    if (spec.bezel === "phone") {
      extras = '<div class="device-notch" aria-hidden="true"></div><div class="device-home" aria-hidden="true"></div>';
    } else if (spec.bezel === "tablet") {
      extras = '<div class="device-cam" aria-hidden="true"></div>';
    } else {
      extras =
        '<div class="device-titlebar"><span class="tb-dot r"></span><span class="tb-dot y"></span><span class="tb-dot g"></span>' +
        '<span class="tb-label">aiimin.in — Reports</span></div>';
    }
    var chin = spec.bezel === "laptop" ? '<div class="device-chin" aria-hidden="true"></div>' : "";

    stage.innerHTML =
      '<div class="device-lab">' +
      '<div class="device-lab-meta">Viewport <strong>' +
      spec.label +
      "</strong> · scaled to fit · no layout bleed</div>" +
      '<div class="device-scale-wrap" id="device-scale">' +
      '<div class="' +
      bezelClass +
      '" id="device-bezel">' +
      extras +
      '<div class="device-screen"><div class="device-screen-inner" id="device-mount"></div></div>' +
      chin +
      "</div></div></div>";

    return {
      mount: document.getElementById("device-mount"),
      wrap: document.getElementById("device-scale"),
      bezel: document.getElementById("device-bezel"),
      spec: spec,
    };
  }

  function render() {
    clearResize();

    if (!theme) {
      stage.innerHTML = "<p style='padding:24px;color:#aaa'>Unknown theme</p>";
      return;
    }
    if (theme.paused) {
      document.title = "Elite paused · AIIMIN";
      titleEl.textContent = "Elite · paused";
      subEl.textContent = "Not locked. Resume later.";
      stage.dataset.type = "deep";
      stage.innerHTML =
        '<div style="max-width:520px;margin:64px auto;padding:32px;color:#ddd;font-family:Figtree,sans-serif;line-height:1.5">' +
        "<h1 style='margin:0 0 12px;font-size:1.5rem'>Elite Deep Report — paused</h1>" +
        "<p style='color:#9ca3af'>Core + Pro locked. Elite craft not found yet. No raw Appendix dumps.</p></div>";
      if (deviceEl) deviceEl.hidden = true;
      return;
    }

    document.title = theme.name + " · " + type + " · AIIMIN";
    titleEl.textContent = theme.name + (theme.locked ? " · LOCKED" : "");
    loadFonts(theme.googleFonts);

    if (deviceEl) {
      deviceEl.hidden = type !== "snapshot";
      if (type === "snapshot") {
        deviceEl.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-current", b.dataset.device === device ? "true" : "false");
        });
      }
    }

    if (type === "snapshot") {
      stage.dataset.type = "snapshot";
      var frame = mountDeviceFrame(device);
      subEl.textContent =
        "CORE · " +
        frame.spec.label +
        " · Ivory " +
        (theme.mode === "dark" ? "Dark" : "Light");
      window.renderSnapshot(frame.mount, persona, theme.id, device);

      var applyFit = function () {
        fitScale(frame.wrap, frame.bezel);
      };
      requestAnimationFrame(function () {
        requestAnimationFrame(applyFit);
      });
      resizeHandler = applyFit;
      window.addEventListener("resize", resizeHandler, { passive: true });
    } else if (type === "standard") {
      stage.dataset.type = "standard";
      subEl.textContent = "PRO · " + theme.fonts;
      window.renderStandard(stage, persona, theme.id);
    } else {
      stage.dataset.type = "deep";
      window.renderDeep(stage, persona, theme.id);
    }
  }

  navEl.innerHTML = themes
    .map(function (t) {
      return (
        '<button type="button" data-id="' +
        t.id +
        '"' +
        (t.id === theme.id ? ' aria-current="true"' : "") +
        ">" +
        t.name +
        "</button>"
      );
    })
    .join("");

  navEl.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-id]");
    if (!btn) return;
    var q = "?type=" + encodeURIComponent(type) + "&v=" + encodeURIComponent(btn.dataset.id);
    if (type === "snapshot") q += "&device=" + encodeURIComponent(device);
    location.search = q;
  });

  if (deviceEl) {
    deviceEl.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-device]");
      if (!btn) return;
      location.search =
        "?type=snapshot&v=" +
        encodeURIComponent(theme.id) +
        "&device=" +
        encodeURIComponent(btn.dataset.device);
    });
  }

  render();
})();
