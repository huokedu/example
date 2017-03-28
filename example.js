/**
 * @file example.js
 *
 * Handles AJAX facets reactions.
 * 
 * @see views/js/ajax_views.js
 */
(function ($) {

/**
 * Attaches the AJAX behavior to Views exposed filter forms and key View links.
 */
Drupal.behaviors.ExampleFacets = {};
Drupal.behaviors.ExampleFacets.attach = function() {
  if (Drupal.settings && Drupal.settings.views && Drupal.settings.views.ajaxViews) {
    // Retrieve the path to use for views' ajax.
    var ajax_path = Drupal.settings.views.ajax_path;

    $.each(Drupal.settings.views.ajaxViews, function(i, settings) {
      var view = '.search-api-facets';
      var element_settings = {
        url: ajax_path,
        submit: settings,
        setClick: true,
        event: 'click',
        selector: view,
        progress: {type: 'throbber'}
      };

      $(view).filter(':not(.views-processed)')
         .each(function() {
          // Set a reference that will work in subsequent calls.
          var target = this;
          $(this)
            .addClass('views-processed')
            // Process facet links.
            .find('li > a')
            .each(function () {
              var viewData = {};
              // Construct an object using the settings defaults and then overriding
              // with data specific to the link.
              $.extend(
                viewData,
                settings,
                Drupal.Views.parseQueryString($(this).attr('href')),
                // Extract argument data from the URL.
                Drupal.Views.parseViewArgs($(this).attr('href'), settings.view_base_path)
              );
              // For anchor tags, these will go to the target of the anchor rather
              // than the usual location.
              $.extend(viewData, Drupal.Views.parseViewArgs($(this).attr('href'), settings.view_base_path));

              element_settings.submit = viewData;
              var ajax = new Drupal.ajax(false, this, element_settings);
            }); // .each function () {
      }); // $view.filter().each
    }); // .each Drupal.settings.views.ajaxViews
  } // if
};

})(jQuery);
