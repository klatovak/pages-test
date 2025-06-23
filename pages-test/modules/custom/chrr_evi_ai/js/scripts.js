var eviConfig = {
  key: 'ef08c5aa-989e-4acf-aee7-64a1cba1f32e',
  options: {
    targetElementId: 'evi--frame',
  },
};
!(function (e, o, n) {
  async function a() {
    try {
      await t.load(n.key, n.options), t.start();
    } catch (e) {
      console.error('Failed to load Dewey script:', e);
    }
  }
  var t = (window.dewey = window.dewey || {});
  t.invoked
    ? console.error('Dewey snippet included twice.')
    : ((t.invoked = !0),
      (t.load = function (e, n) {
        return new Promise((e, a) => {
          var d = o.createElement('script');
          (d.type = 'text/javascript'),
            (d.async = !0),
            (d.onload = e),
            (d.onerror = a),
            (d.src =
              'https://app.askdewey.co/dewey.js/v1/ef08c5aa-989e-4acf-aee7-64a1cba1f32e/dewey.min.js'),
            (t._loadOptions = n),
            o.head.appendChild(d);
        });
      }),
      (t.SNIPPET_VERSION = '0.0.3'),
      a());
})(window, document, eviConfig);
