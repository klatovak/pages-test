(function ($) {
  Drupal.behaviors.chrr_wwfh_evidence = {
    attach: function (context) {
      var window_width = $(window).width();

      const hideOnPopperBlur = {
        name: 'hideOnPopperBlur',
        defaultValue: true,
        fn(instance) {
          return {
            onCreate() {
              instance.popper.addEventListener('focusout', (event) => {
                if (
                  instance.props.hideOnPopperBlur &&
                  event.relatedTarget &&
                  !instance.popper.contains(event.relatedTarget)
                ) {
                  instance.hide();
                }
              });
            },
          };
        },
      };

      const hideOnEsc = {
        name: 'hideOnEsc',
        defaultValue: true,
        fn({ hide }) {
          function onKeyDown(event) {
            if (event.keyCode === 27) {
              hide();
            }
          }

          return {
            onShow() {
              document.addEventListener('keydown', onKeyDown);
            },
            onHide() {
              document.removeEventListener('keydown', onKeyDown);
            },
          };
        },
      };

      $(
        once(
          'evidence-rating-widget',
          '._chrrwwfh_evidence-rating-widget',
          context
        )
      ).each(function (index) {
        if (typeof tippy === 'function') {
          const button = this.querySelector(
            '.evidence-rating-summary-text-link'
          );
          const text = $(button).prev('.evidence-rating-summary-text').html();

          const instance = tippy(button, {
            plugins: [hideOnPopperBlur, hideOnEsc],
            hideOnPopperBlur: true,
            hideonEsc: true,
            content: text,
            theme: 'light-border',
            trigger: 'manual',
            placement: 'right-start',
            allowHTML: true,
            interactive: true,
            maxWidth: 400,
            zIndex: 2000001,
          });

          // Show on click
          button.addEventListener('click', function () {
            instance.show();
          });

          // Show on keydown
          button.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
              instance.show();
            }
          });

          document.addEventListener('keydown', function (event) {
            if (
              event.key === 'Enter' &&
              !button.contains(document.activeElement)
            ) {
              instance.hide();
            }
          });
        }
      });
    },
  };
})(jQuery);
