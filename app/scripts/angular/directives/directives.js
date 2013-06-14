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

        // This will contain all the HTML blocks from the "transcluded" section.
        var _blocks = {};

        angular.forEach(tEl.children(), function(block) {
          // wrap tEl.children() elements in jqLite
          var _block = angular.element(block);

          // if it's a block element, save the HTML and remove the node.
          if(_block.attr("block")) {
            _blocks[_block.attr("block")] = _block.html();
            _block.remove();
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

            angular.forEach(newTemplate.children(), function(block) {
              // wrap newTemplate.children() in jqLite.
              var _block = angular.element(block);

              // if it's a block element AND we have a "transcluded" HTML fragment,
              // replace HTML.
              if(_block.attr("block") && angular.isDefined(_blocks[_block.attr("block")])) {
                _block.html(_blocks[_block.attr("block")]);
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
});
