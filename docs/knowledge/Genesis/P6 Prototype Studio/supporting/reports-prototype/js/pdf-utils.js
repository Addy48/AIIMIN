(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  window.pdf = {
    esc: esc,
    pct: function (n) {
      return Math.round(n * 100) + "%";
    },
    inr: function (n) {
      return "₹" + Number(n).toLocaleString("en-IN");
    },
    lockup: function (dark, size) {
      return window.AIIMIN_BRAND.lockup({ dark: !!dark, size: size || 28 });
    },
    header: function (opts) {
      opts = opts || {};
      return (
        '<header class="page-header">' +
        '<div class="ph-brand">' +
        this.lockup(opts.dark, 26) +
        "</div>" +
        '<div class="ph-title">' +
        esc(opts.title || "") +
        "</div>" +
        '<div class="ph-meta"><span>' +
        esc(opts.range || "") +
        "</span><span>p." +
        (opts.page || "") +
        "</span></div></header>"
      );
    },
    lineChart: function (values, w, h, label) {
      var pad = 30;
      var min = Math.min.apply(null, values) - 2;
      var max = Math.max.apply(null, values) + 2;
      var span = max - min || 1;
      var poly = values
        .map(function (v, i) {
          var x = pad + (i / (values.length - 1)) * (w - pad * 2);
          var y = h - pad - ((v - min) / span) * (h - pad * 2);
          return x.toFixed(1) + "," + y.toFixed(1);
        })
        .join(" ");
      return (
        '<figure class="fig"><svg class="chart" viewBox="0 0 ' +
        w +
        " " +
        h +
        '" role="img" aria-label="' +
        esc(label) +
        '"><polyline fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linejoin="round" points="' +
        poly +
        '"/></svg><figcaption class="figcap mono">Fig. ' +
        esc(label) +
        " · n=" +
        values.length +
        "</figcaption></figure>"
      );
    },
    barChart: function (values, w, h, label) {
      var pad = 24;
      var max = Math.max.apply(null, values.concat([1]));
      var slot = (w - pad * 2) / values.length;
      var bars = values
        .map(function (v, i) {
          var bh = (v / max) * (h - pad * 2);
          var x = pad + i * slot + 1;
          var y = h - pad - bh;
          return (
            '<rect x="' +
            x.toFixed(1) +
            '" y="' +
            y.toFixed(1) +
            '" width="' +
            Math.max(slot - 2, 4).toFixed(1) +
            '" height="' +
            bh.toFixed(1) +
            '" fill="var(--accent)" fill-opacity="0.8" rx="1"/>'
          );
        })
        .join("");
      return (
        '<figure class="fig"><svg class="chart" viewBox="0 0 ' +
        w +
        " " +
        h +
        '" role="img" aria-label="' +
        esc(label) +
        '">' +
        bars +
        '</svg><figcaption class="figcap mono">Fig. ' +
        esc(label) +
        "</figcaption></figure>"
      );
    },
    cover: function (persona, title, subtitle, dark) {
      var m = persona.meta;
      return (
        '<section class="page cover">' +
        this.lockup(dark, 56) +
        '<hr class="orange-rule"/>' +
        '<h1 class="cover-name">' +
        esc(m.fullName) +
        "</h1>" +
        '<p class="cover-title">' +
        esc(title) +
        "</p>" +
        (subtitle ? '<p class="cover-sub mono">' + esc(subtitle) + "</p>" : "") +
        '<div class="cover-meta-grid mono">' +
        "<div><span>OS ID</span><strong>" +
        esc(m.osId) +
        "</strong></div>" +
        "<div><span>Window</span><strong>" +
        esc(persona.ranges.deep.label) +
        "</strong></div>" +
        "<div><span>Generated</span><strong>" +
        esc(m.generatedOn) +
        "</strong></div>" +
        "<div><span>Ref</span><strong>" +
        esc(m.reportRef.deep) +
        "</strong></div></div>" +
        '<p class="muted tiny" style="margin-top:28px;max-width:48ch">Observational Life OS artifact · not a clinical assessment · synthetic QS composite for prototype QA</p>' +
        "</section>"
      );
    },
    back: function (persona, note) {
      var m = persona.meta;
      return (
        '<section class="page back">' +
        this.lockup(false, 44) +
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
        esc(m.reportRef.deep) +
        "</p>" +
        '<p class="prose" style="text-align:center;margin-top:20px">Deep Report monthly quota: <strong>3</strong> · separate from daily AI budget</p>' +
        (note ? '<p class="muted tiny">' + esc(note) + "</p>" : "") +
        "</section>"
      );
    },
    methodsBlock: function (sci) {
      var m = sci.methods;
      return (
        '<aside class="methods-box"><h3>Methods</h3><ul>' +
        "<li><strong>Window:</strong> " +
        m.windowDays +
        " days · observed " +
        m.nDaysObserved +
        " · missing " +
        m.missingDays +
        "</li>" +
        "<li><strong>Life Score:</strong> " +
        esc(m.lifeScoreDef) +
        "</li>" +
        "<li><strong>Association:</strong> " +
        esc(m.correlation) +
        "</li>" +
        "<li><strong>Weak signals:</strong> " +
        esc(m.weakRule) +
        "</li>" +
        "<li><strong>Effects:</strong> " +
        esc(m.effectSizes) +
        "</li>" +
        "<li><strong>Disclaimer:</strong> " +
        esc(m.disclaimer) +
        "</li></ul></aside>"
      );
    },
  };

  window.AIIMIN_PDF = pdf;
})();
