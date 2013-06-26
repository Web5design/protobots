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
  .directive('ui', function($compile) {
    return {
      restrict: "E",
      scope: {repeating : "@"},
      templateUrl: function($element, $attrs) {
        var template ='views/ui/' + $attrs.file + '.html';
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
          if(_region.prop("tagName") == "REGION") {
            _regions[_region.attr("name")] = _region.html();
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
  .directive( 'phImg', function () {
    return {
      restrict: 'A',
      scope: { dimensions: '@phImg',
               bgColor: '@',
               txtColor: '@',
               text: '@' },
      link: function( scope, element, attr ) {
        // A reference to a canvas that we can reuse
        var canvas;
        var bgColor = (attr.bgColor) ? attr.bgColor : "#CCCCCC";
        var txtColor = (attr.txtColor) ? attr.txtColor : "#959595";
        var text = (attr.text) ? attr.text : attr.dimensions;
        console.log(text);


        var config = {
          text_size: 10,
          fill_color: bgColor,
          text_color: txtColor,
          text: text
        };

        /**
         * When the provided dimensions change, re-pull the width and height and
         * then redraw the image.
         */
        scope.$watch('dimensions', function () {
          if( ! angular.isDefined( scope.dimensions ) ) {
              return;
          }
          var matches = scope.dimensions.match( /^(\d+)x(\d+)$/ ),
              dataUrl;

          if(  ! matches ) {
            console.error("Expected '000x000'. Got " + scope.dimensions);
            return;
          }

          // Grab the provided dimensions.
          scope.size = { w: matches[1], h: matches[2] };

          // FIXME: only add these if not already present
          element.prop( "title", scope.dimensions );
          element.prop( "alt", scope.dimensions );

          // And draw the image, getting the returned data URL.
          dataUrl = drawImage();

          // If this is an `img` tag, set the src as the data URL. Else, we set
          // the CSS `background-image` property to same.
          if ( element.prop( "tagName" ) === "IMG" ) {
            element.prop( 'src', dataUrl );
          } else {
            element.css( 'background-image', 'url("' + dataUrl + '")' );
          }
        });

        /**
         * Calculate the maximum height of the text we can draw, based on the
         * requested dimensions of the image.
         */
        function getTextSize() {
          var dimension_arr = [scope.size.h, scope.size.w].sort(),
              maxFactor = Math.round(dimension_arr[1] / 16);

          return Math.max(config.text_size, maxFactor);
        }

        /**
         * Using the HTML5 canvas API, draw a placeholder image of the requested
         * size with text centered vertically and horizontally that specifies its
         * dimensions. Returns the data URL that can be used as an `img`'s `src`
         * attribute.
         */
        function drawImage() {
          // Create a new canvas if we don't already have one. We reuse the canvas
          // when if gets redrawn so as not to be wasteful.
          canvas = canvas || document.createElement( 'canvas' );

          // Obtain a 2d drawing context on which we can add the placeholder
          // image.
          var context = canvas.getContext( '2d' ),
              text_size,
              text;

          // Set the canvas to the appropriate size.
          canvas.width = scope.size.w;
          canvas.height = scope.size.h;

          // Draw the placeholder image square.
          // TODO: support other shapes
          // TODO: support configurable colors
          context.fillStyle = config.fill_color;
          context.fillRect( 0, 0, scope.size.w, scope.size.h );

          // Add the dimension text.
          // TODO: support configurable font
          // FIXME: ensure text will fit and resize if it doesn't
          text_size = getTextSize();
          text = config.text;
          context.fillStyle = config.text_color;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.font = 'bold '+text_size+'pt sans-serif';

          // If the text is too long to fit, reduce it until it will.
          if (context.measureText( text ).width / scope.size.w > 1) {
            text_size = config.text_size / (context.measureText( text ).width / scope.size.w);
            context.font = 'bold '+text_size+'pt sans-serif';
          }

          // Finally, draw the text in its calculated position.
          context.fillText( text, scope.size.w / 2, scope.size.h / 2 );

          // Get the data URL and return it.
          return canvas.toDataURL("image/png");
        }
      }
    };
  });


