/**
 * @file
 * Provides the soft limit functionality.
 */

(function ($) {

  'use strict';

  Drupal.behaviors.facetConditionalLinksFacetWidget = {
    attach: function (context, settings) {
      if (settings.facets.hideUnselected !== 'undefined') {
        $.each(settings.facets.hideUnselected, function (facet, hide) {
          Drupal.facets.applyConditionalLinks(facet, 0, settings);
        });
      }
    }
  };

  Drupal.facets = Drupal.facets || {};

  /**
   * Applies the soft limit UI feature to a specific facets list.
   *
   * @param {string} facet
   *   The facet id.
   * @param {string} limit
   *   The maximum amount of items to show.
   * @param {object} settings
   *   Settings.
   */
  Drupal.facets.applyConditionalLinks = function (facet, limit, settings) {
    var facet_id = facet;
    var facetsList = $('ul[data-drupal-facet-id="' + facet_id + '"]');

    // Find out how many checkboxes are checked.
    var totalLinks = $(facetsList).find('li').length;
    var zero_based_limit = (totalLinks - 1);

    // In case of multiple instances of a facet, we need to key them.
    if (facetsList.length > 1) {
      facetsList.each(function (key, $value) {
        $(this).attr('data-drupal-facet-id', facet_id + '-' + key);
      });
    }

    var checked = $('li > input[checked="checked"]');
    var numChecked = $(facetsList).find(checked).length;
    var hideUnselected = settings.facets.hideUnselected[facet_id];

    if (settings.facets.hideUnselected[facet_id])
      if (numChecked >= 1) {
        zero_based_limit = numChecked;
      }
      else {
        zero_based_limit = totalLinks - 1;
    }

    // Hide facets over the limit.
    facetsList.each(function() {
      if (hideUnselected && numChecked >= 1) {
        $(this).children('li').has( "input:not([checked])" ).hide();
      }
      else {
        $(this).children('li:gt(' + zero_based_limit + ')').once('applysoftlimit').hide();
      }
    });

    // Add "Show more" / "Show less" links.
    facetsList.once().filter(function () {
      return $(this).find('li').length > numChecked && numChecked > 0;
    }).each(function () {
      var facet = $(this);

      var showLessLabel = settings.facets.softLimitSettings[facet_id].showLessLabel;
      var showMoreLabel = settings.facets.softLimitSettings[facet_id].showMoreLabel;

      $('<a href="#" class="facets-soft-limit-link"></a>')
        .text(showMoreLabel)
        .on('click', function () {
          var total = $(facet).find('li').length;
          var checked = $('li > input[checked="checked"]');
          var numChecked = $(facet).find(checked).length;

          // Total number has to be more than the number of selected facets, and the list has to be closed.
          // In which case we open it, show all items.
          if (total > numChecked && !$(this).hasClass('open')) {
            $(facet).find('li').slideDown();
            $(this).addClass('open').text(showLessLabel);
          }
          else if ($(this).hasClass('open')) {
            $(facet).children('li').has( "input:not([checked])" ).slideUp();
            $(this).removeClass('open').text(showMoreLabel);
          }
          return false;
        }).insertAfter($(this));
    });
  };

})(jQuery);
