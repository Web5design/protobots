'use strict';

angular.module('ngProtobotsApp')
  .controller('PagesController', function ($scope, $http, $route, $routeParams, $compile) {
    $route.current.templateUrl = 'views/' + $routeParams.name + ".html";
    $http.get($route.current.templateUrl).then(function (msg) {
      $('.container').html($compile(msg.data)($scope));
    });
  });


//angular.PagesController.$inject = ['$scope', '$http', '$route', '$routeParams', '$compile'];
