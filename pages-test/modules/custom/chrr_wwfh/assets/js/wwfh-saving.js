(function ($) {
  Drupal.behaviors.chrr_wwfh_saving = {
    attach: function (context) {
      // remove forms from the DOM and stash away somewhere
      const saveButtons = document.querySelectorAll('.js-save-strategy');

      /**
       * Toggles the id in localstorage and returns current value
       * @param {string} id The UUID of the strategy
       * @returns {bool} Returns true or false depending if the strategry was
       * saved or removed form local storage
       */
      function toggleStrategyMarking(id, dataset) {
        const currentState = chrr_wwfh_getState(id);
        const toggledValue = !currentState;

        chrr_wwfh_setItem(id, toggledValue, dataset);

        return toggledValue;
      }

      /**
       * Sets the class of button depending on state. Also sends custom event
       * @param {HTMLButtonElement} button 
       * @param {boolean} saved 
       */
      function setStylesSendState(button, saved) {
        if (saved) {
          button.classList.add('js-save-strategy--saved');
        } else {
          button.classList.remove('js-save-strategy--saved');
        }
      }

      // Attach events to all buttons
      for (let i = 0; i < saveButtons.length; i++) {
        const button = saveButtons[i];
        const dataset = button.dataset;

        // keep copy of button reference in a closure
        (function(button, dataset) {
          const id  = dataset.wwfhProgramId;
          const state = chrr_wwfh_getState(id);
          setStylesSendState(button, state);

          $(button).off('click');
          $(button).click(function(e) {
            const id  = dataset.wwfhProgramId;
            const saved = toggleStrategyMarking(id, dataset);

            setStylesSendState(button, saved);

            const isListingPage = window.location.pathname.match(/\//g).length === 3;

            // send state events
            chrr_wwfh_sendEvent([saved ? 'wwfh_gtm' : null, 'wwfh_saved'], {
              action: isListingPage ? 'SaveStrategy_ListingPage' : 'SaveStrategy_DetailPage',
              state: saved,
              label: id,
            });
          });
        })(button, dataset);
      }
    }
  };
})(jQuery);
