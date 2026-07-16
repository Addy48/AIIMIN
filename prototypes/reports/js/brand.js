(function () {
  window.AIIMIN_BRAND = {
    logoLight: "assets/AIIMIN_logo.svg",
    logoDark: "assets/AIIMIN_logo_dark.svg",
    lockup: function (opts) {
      opts = opts || {};
      var dark = !!opts.dark;
      var size = opts.size || 36;
      var src = dark ? this.logoDark : this.logoLight;
      var word = opts.word !== false;
      return (
        '<div class="brand-lockup' +
        (dark ? " is-dark" : " is-light") +
        '">' +
        '<img class="brand-mark" src="' +
        src +
        '" width="' +
        size +
        '" height="' +
        size +
        '" alt="" />' +
        (word ? '<span class="brand-word">AIIMIN</span>' : "") +
        "</div>"
      );
    },
  };
})();
