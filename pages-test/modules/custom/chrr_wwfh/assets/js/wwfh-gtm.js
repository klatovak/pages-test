(function($){
  const listener = function (e) {
    const data = e.detail;

    // const data = e.data
    const category = data.category || 'WWFH';
    const label = data.label;
    const action = data.action;

    const gtmObj = {
      category: category,
      action: action,
      label: label,
    };

    // console.log('Pushing to GTM: ', gtmObj);

    if (window.dataLayer) {
      window.dataLayer.push(gtmObj);
    } else {
      console.warn('GTM not enabled!');
    }
  };
  Drupal.behaviors.chrr_wwfh_gtm = {
    attach: function (context) {
      document.body.removeEventListener('wwfh_gtm', listener);
      document.body.addEventListener('wwfh_gtm', listener);
    }
  };
})(jQuery);
