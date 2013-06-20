'use strict';

/* Directives */

angular.module('ngProtobotsApp')
  .directive('partial', function($compile) {
    return {
      restrict: "E",
      scope: {repeating : "@"},
      templateUrl: function($element, $attrs) {
        var template ='views/partials/' + $attrs.file + '.html';
        return template;
      },
      replace: true,
    }
  })
  .directive('layout', function($http, $compile) {
    return {
      restrict: "E",
      compile: function(tEl, tAttr) {
        // GET template at this point, since we cannot pre-load as before.
        var getTemplate = $http.get('/views/layouts/' + tAttr.file + '.html');

        // This will contain all the HTML regions from the "transcluded" section.
        var _regions = {};

        angular.forEach(tEl.children(), function(region) {
          // wrap tEl.children() elements in jqLite
          var _region = angular.element(region);

          // if it's a region element, save the HTML and remove the node.
          if(_region.attr("region")) {
            _regions[_region.attr("region")] = _region.html();
            _region.remove();
          }
        });


        return function(scope, el, attr) {

          var newTemplate;

          // Interact with the $http promise above.
          // This needs to happen in the linking function, since we
          // don't want to start _ANYTHING_ until we get the template back.
          getTemplate.then(function(template) {
            // Wrap template in jqLite...
            newTemplate = angular.element(template.data);

            angular.forEach(newTemplate.find('*'), function(region) {
              // wrap newTemplate.children() in jqLite.
              var _region = angular.element(region);

              // if it's a region element AND we have a "transcluded" HTML fragment,
              // replace HTML.
              if(_region.attr("region") && angular.isDefined(_regions[_region.attr("region")])) {
                _region.html(_regions[_region.attr("region")]);
              }
            });

            // $compile and append.
            el.append($compile(newTemplate)(scope));
          });
        };
      }
    }
  })
  .directive('repeat', function() {
    return {
    restrict: "A",
    compile: function(tElement, attrs) {
      var content = tElement.children();
      attrs.$observe('repeat', function(newVal) {
        for (var i=1; i<attrs.repeat; i++) {
          tElement.append(content.clone());
        }
      })
    },
  }
})


