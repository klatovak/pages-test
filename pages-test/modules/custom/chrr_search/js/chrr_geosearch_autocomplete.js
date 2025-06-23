/**
 * @file
 * Expands the behavior of the default autocompletion.
 */

(function ($, Drupal) {
  'use strict';

  // As a safety precaution, bail if the Drupal Core autocomplete framework is
  // not present.
  if (!Drupal.autocomplete) {
    return;
  }

  Drupal.behaviors.chrrGeoSearchAutocomplete = {
    attach: function () {
      $("[id^=chrr-geographic-location-search-form]").submit(function (event) {
        // Hijack the form submission.
        event.preventDefault();

        // Search term entered into form.
        var input = $(this).find("#edit-geographic-locations").val();

        // A location was entered, so we'll redirect in any case to the app state select page.
        if (input === "") {
          window.location.reload();
        } else {
          var url = $(this).find("#edit-geographic-locations").attr("data-autocomplete-path");

          $.getJSON(
            url,
            {q: input},
            function (data) {
              // If there's only one result, redirect to it.
              if (data.length === 1) {
                window.location.href = data[0].value;
              // If the input is a ZIP code, redirect to the first result.
              } else if (!isNaN(input) && (data.length === 1 || data.length === 2)) {
                window.location.href = data[0].value;
              } else if (data.length > 1 || data.length === 0){
                // There's more than one, look for an exact match. Redirect to the first exact match.
                $.each(data, function (key, val) {
                  if (val.exact_match === 1) {
                    window.location.href = val.value;
                  }
                });

                // Not sure what to do here besides run the item through /search with the query. The site search will
                // show the matches using search_api.
                window.location.href = "/search?keywords=" + window.encodeURIComponent(input) + "&f[0]=type:states&f[1]=type:counties";
              }
            }
          );
        }
      });

      // Attach autocomplete options.
      $("#edit-geographic-locations")
        .autocomplete({
          minLength: 1,

          // Navigate on select.
          select: function (_e, ui) {
            if (ui.item) {
              var itemLink = ui.item.value;
              // Avoid autocomplete flashing the URL in the form.
              ui.item.value = ui.item.label;

              // Redirect to the URL
              if (itemLink) {
                window.location.href = itemLink;
              }
            }
          },
        })

        // Make the label simpler, default behavior is empty anchors.
        .data("ui-autocomplete")._renderItem = (function (ul, item) {
          return $("<li>")
            .append($('<span>').html(item.label))
            .appendTo(ul);
        });
    }
  };

})(jQuery, Drupal);
