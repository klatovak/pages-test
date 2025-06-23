/**
 * @file
 * Add javascript to webforms used in the WWFH Aggregate Widget.
 */

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.wwfhSubmissionForm = {
    attach: function (context) {
      // Mimic 'back' button click when user clicks 'Return to my list'.
      var $returnToListLink = $(context).find('.js-return-to-list');

      if ($returnToListLink.length > 0) {
        $returnToListLink.click(function (event) {
          event.preventDefault();
          document
            .querySelector(
              '._chrrwwfh_aggregate-modal-widget__header-back-button'
            )
            .click();
        });
      }
    },
  };
})(jQuery, Drupal);
