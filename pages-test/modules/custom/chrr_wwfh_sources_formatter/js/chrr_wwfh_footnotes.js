/**
 * @file
 * Expands the behavior of the default autocompletion.
 */

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.chrrWwfhFootnotes = {
    attach: function () {
      $('.footnote-link').on('click', function (e) {
        // Only perform if the footnotes are collapsed.
        if (!$('details.c-details--footnote').attr('open')) {
          e.preventDefault();

          // Open the footnotes.
          $('details.c-details--footnote').attr('open', true);

          // Update the url with the anchor.
          const anchor = $(e.currentTarget).attr('href');
          window.location.hash = anchor;

          // Scroll to anchor.
          $('html,body').scrollTop($(anchor).offset().top);
        }
      });
    },
  };
})(jQuery, Drupal);
