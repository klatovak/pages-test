(function ($) {
  Drupal.behaviors.homepageFunctions = {
    attach: function(context, settings) {

      $(document).ready(function() {
        const map = $('#map');
        const wrapper = document.getElementById('normal-map');
        const baseUrl = wrapper.dataset.apiBaseUrl;
        const year = wrapper.dataset.defaultYear;
        const authUser = window.drupalSettings.authUser;
        const authPass = window.drupalSettings.authPass;

        if (map.length) {
          $.ajax({
            url: baseUrl + '/states/' + year,
            headers: { 'Authorization': 'Basic ' + btoa(authUser + ':' + authPass)},
          })
          .done(function (data, status) {
            const tempData = Object.keys(data).map(function (key) {
              return data[key];
            });
            const states = {};

            for (var stateKey in tempData) {
              if (tempData.hasOwnProperty(stateKey)) {
                const state = tempData[stateKey];
                states[state.short] = state;
              }
            }

            $('#map').usmap({
              'stateHoverAnimation': 100,
              'stateStyles': {
                fill: '#bfbfbf',
                "stroke-width": 1,
                "stroke": '#FFF',
                showLabels: true
              },

              'labelWidth': 25,
              'labelHeight': 20,
              'labelRadius': 0,

              'labelBackingStyles': {
                fill: "#f0f0f0",
                "stroke-width": 0
              },

              'labelBackingHoverStyles': {
                fill: "#bfbfbf"
              },

              'labelTextStyles': {
                fill: "#227bba",
                'font-size': '12px',
                'font-family': 'Georgia, "Times New Roman", Times, serif'
              },

              stateHoverStyles: {
                fill: '#227bba'
              },

              'mouseover' : function(event, data) {
                $('#alert').show().text(states[data.name].name);
              },

              'mouseout' : function(event, data) {
                $('#alert').hide();
              },

              'click' : function(event, data) {
                // Redirect to the state overview page for the state and the default year.
                window.location = '/health-data/' + states[data.name].path + '?year=' + year;
              }
            });

            $("#map").mouseenter(function() {
              $('#welcome').fadeOut();
            }).mouseleave(function() {
              $('#alert').fadeOut();
              $('#welcome').fadeIn();
            });
          });
        }
      });
    }
  };
})(jQuery);
