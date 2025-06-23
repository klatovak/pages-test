(function ($) {
  function getModalHTML(modelOpened) {
    if (!modelOpened) {
      return '';
    }

    const header = [
      '<div class="_chrrwwfh_aggregate-modal-widget__header">',
      '<button class="_chrrwwfh_aggregate-modal-widget__header-close-button">Close</button>',
      '<h1 class="_chrrwwfh_aggregate-modal-widget__content-header">My Bookmarked Strategies</h1>',
      '</div>',
    ].join('\n');

    const items = chrr_wwfh_getItems();
    let listOfSavedStrats = [];

    for (let x in items) {
      if (items.hasOwnProperty(x)) {
        const obj = items[x];
        obj.id = x;

        listOfSavedStrats.push(obj);
      }
    }

    listOfSavedStrats = listOfSavedStrats
      .map(function (i) {
        const checked = i.checked ? 'checked="checked"' : '';

        return [
          '<div data-strat-id="' +
            i.id +
            '" class="_chrrwwfh_saved-strategy c-form-item c-form-item--checkbox has-visible-label-after">',
          '<input class="_chrrwwfh_saved-strategy__checkbox c-form-item__checkbox" id="_chrrwwfh_saved-strategy__checkbox-' +
            i.id +
            '" data-strat-id="' +
            i.id +
            '" type="checkbox"' +
            checked +
            '>',
          '<label class="_chrrwwfh_saved-strategy__title c-form-item__label" for="_chrrwwfh_saved-strategy__checkbox-' +
            i.id +
            '">' +
            i.title +
            ' (<a class="_chrrwwfh_saved-strategy__url" href="' +
            i.url +
            '">view strategy</a>)</label>',
          '</div>',
        ].join('\n');
      })
      .join('\n');

    const content = [
      '<div class="_chrrwwfh_aggregate-modal-widget__content-subheader">',
      'Your bookmarked strategies will stay in the browser until you clear the cookies in your browser.',
      '</div>',
      '<h2 class="_chrrwwfh_aggregate-modal-widget__content-selection-count">',
      'Select strategies to export (' +
        chrr_wwfh_getCheckedCount() +
        ' selected)',
      '</h2>',
      '<div class="_chrrwwfh_aggregate-modal-widget__summary-wrapper">',
      '<div class="_chrrwwfh_aggregate-modal-widget__summary">',
      'Export file will include titles, summaries, and the website location for each strategy.',
      '</div>',
      '<div class="_chrrwwfh_action-widgets">',
      '<button class="_chrrwwfh_action-widgets__email">Email</button>',
      '<button class="_chrrwwfh_action-widgets__download">Download</button>',
      '</div>',
      '</div>',
      '<div class="_chrrwwfh_aggregate-modal-widget__content-list-of-saved-strategies">' +
        listOfSavedStrats +
        '</div>',
      '<div class="_chrrwwfh_selection-widgets">',
      '<button class="_chrrwwfh_selection-widgets__select">Select All</button>',
      '<button class="_chrrwwfh_selection-widgets__unselect">Unselect All</button>',
      '</div>',
    ].join('\n');

    const template = [
      '<div class="modal modal--opened">',
      '<div class="modal-underlay"></div>',
      '<div class="_chrrwwfh_aggregate-modal-widget">',
      header,
      '<div class="_chrrwwfh_aggregate-modal-widget__content">',
      content,
      '</div>',
      '</div>',
      '</div>',
    ].join('\n');

    return template;
  }

  let ran = false;
  Drupal.behaviors.chrr_wwfh_aggregate = {
    attach: function (context) {
      const rebuildWidget = function () {
        const widget = document.querySelector('._chrrwwfh_aggregate-widget');
        widget.innerHTML = getHTML(chrr_wwfh_getCount());

        const filled = '_chrrwwfh_aggregate-widget--filled';
        if (chrr_wwfh_getCount()) {
          widget.classList.add(filled);
          widget.removeAttribute('disabled');
        } else {
          widget.classList.remove(filled);
          widget.setAttribute('disabled', 'true');
        }
      };

      // run once
      if (!ran) {
        run();
        ran = true;
      }

      function getHTML(items) {
        return ['Bookmarked Strategies (' + items + ')'].join('\n');
      }

      function validState(state) {
        return ['modal', 'modal--email', 'modal--download'].indexOf(state) >= 0
          ? true
          : false;
      }

      function run() {
        const state = chrr_wwfh_getRouterState();
        const widget = document.querySelector('._chrrwwfh_aggregate-widget');

        if (widget) {
          widget.innerHTML = getHTML(chrr_wwfh_getCount());
          widget.classList.add('no-print');

          window.addEventListener('popstate', function () {
            const path = chrr_wwfh_getRouterState();

            redrawModal(path);
          });

          document.body.addEventListener(
            'wwfh_saved',
            rebuildWidget.bind(this)
          );
          rebuildWidget();

          const addBackButtonToHeader = function () {
            const header = document.querySelector(
              '._chrrwwfh_aggregate-modal-widget__header'
            );
            const backButton = document.createElement('button');
            backButton.addEventListener('click', function () {
              chrr_wwfh_stashForms();
              history.back();
              redrawModal('modal');
            });
            backButton.innerHTML = 'Back';
            backButton.className =
              '_chrrwwfh_aggregate-modal-widget__header-back-button';

            header.appendChild(backButton);
          };

          const insertSelectedCountIntoFormHeader = function (form) {
            const countWidget = form.querySelector('.js-count-selected');
            countWidget.innerHTML =
              '(' + chrr_wwfh_getCheckedCount() + ' selected)';
          };

          function trapFocus(element) {
            const focusableElements = element.querySelectorAll(
              'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement =
              focusableElements[focusableElements.length - 1];

                element.addEventListener('keydown', function (e) {
              if (e.key === 'Tab' || e.keyCode === 9) {
                if (e.shiftKey) {
                  if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                  }
                } else {
                  if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                  }
                }
              }
            });

            firstFocusableElement.focus();
          }

          function redrawModal(state) {
            const modal = document.querySelector(
              '._chrrwwfh_aggregate-modal-widget'
            );

            if (!state || !validState(state) || !chrr_wwfh_getCount()) {
              modal.innerHTML = getModalHTML(false);

              return;
            }

            modal.innerHTML = getModalHTML(true);

            // attach behaviors
            function closeModal() {
              chrr_wwfh_stashForms();
              chrr_wwfh_setRouterState(false);
              modal.innerHTML = getModalHTML(false);

              chrr_wwfh_sendEvent(['wwfh_gtm'], {
                action: 'ClosedSavedStrategies',
                label: null,
              });
            }

            modal
              .querySelector(
                '._chrrwwfh_aggregate-modal-widget__header-close-button'
              )
              .addEventListener('click', closeModal);

            modal
              .querySelector('.modal--opened .modal-underlay')
              .addEventListener('click', closeModal);

            modal
              .querySelector('._chrrwwfh_selection-widgets__select')
              .addEventListener('click', function () {
                chrr_wwfh_setAllChecked();
                redrawModal('modal');
              });

            const content = modal.querySelector(
              '._chrrwwfh_aggregate-modal-widget__content'
            );
            // content.innerHTML = '';

            // email button
            modal
              .querySelector('._chrrwwfh_action-widgets__email')
              .addEventListener('click', function () {
                if (!chrr_wwfh_getCheckedCount()) {
                  return;
                }

                const newState = 'modal--email';
                chrr_wwfh_setRouterState(newState);
                redrawModal(newState);
                chrr_wwfh_sendEvent(['wwfh_gtm'], {
                  action: 'EmailStrategies',
                  label: 'Select',
                });
              });

            // download button
            modal
              .querySelector('._chrrwwfh_action-widgets__download')
              .addEventListener('click', function () {
                if (!chrr_wwfh_getCheckedCount()) {
                  return;
                }

                const newState = 'modal--download';
                chrr_wwfh_setRouterState(newState);
                redrawModal(newState);

                chrr_wwfh_sendEvent(['wwfh_gtm'], {
                  action: 'DownloadStrategies',
                  label: 'Select',
                });
              });

            modal
              .querySelector('._chrrwwfh_selection-widgets__unselect')
              .addEventListener('click', function () {
                chrr_wwfh_setAllUnchecked();
                redrawModal('modal');
              });

            const checkboxes = modal.querySelectorAll(
              '._chrrwwfh_saved-strategy__checkbox'
            );
            for (let i = 0; i < checkboxes.length; i++) {
              const checkbox = checkboxes[i];

              (function (checkbox) {
                const id = checkbox.dataset.stratId;

                checkbox.addEventListener('click', function (e) {
                  const target = e.target;
                  const checked = target.checked;

                  chrr_wwfh_setCheckItem(id, checked);
                  redrawModal('modal');
                });

                checkbox.addEventListener('click', function (e) {
                  const target = e.target;
                  const checked = target.checked;

                  chrr_wwfh_setCheckItem(id, checked);
                  redrawModal('modal');
                });
              })(checkbox);
            }

            switch (state) {
              // render list
              case 'modal': {
                // really lets do nothing as this is the default view;
                break;
              }
              // render email modal
              case 'modal--email': {
                content.innerHTML = '';
                const newContent = chrr_wwfh_getEmailForm();
                content.append(newContent);
                addBackButtonToHeader();
                insertSelectedCountIntoFormHeader(newContent);
                break;
              }
              // render download modal
              case 'modal--download': {
                content.innerHTML = '';
                const newContent = chrr_wwfh_getDownloadsForm();
                content.append(newContent);
                addBackButtonToHeader();
                insertSelectedCountIntoFormHeader(newContent);
                break;
              }
              // error state
              default:
                throw 'Unknown modal type:' + state;
            }

            trapFocus(modal);
          }

          // intialRender
          redrawModal(state);

          widget.addEventListener('click', function () {
            // only open modal if >0 items in storage
            if (chrr_wwfh_getCount()) {
              chrr_wwfh_sendEvent(['wwfh_gtm'], {
                action: 'ViewSavedStrategies',
                label: null,
              });

              chrr_wwfh_setRouterState('modal');
              redrawModal('modal');
            }
          });
        } else {
          console.warn(
            '._chrrwwfh_aggregate-widget not found in the DOM... not loading'
          );
        }
      }
    },
  };
})(jQuery);
