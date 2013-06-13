'use strict';

angular.module('ngProtobotsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })
  .controller('PagesController', function ($scope, $http, $route, $routeParams, $compile) {
    $route.current.templateUrl = 'views/' + $routeParams.name + ".html";
    $http.get($route.current.templateUrl).then(function (msg) {
      $('.container').html($compile(msg.data)($scope));
    });
  });


//angular.PagesController.$inject = ['$scope', '$http', '$route', '$routeParams', '$compile'];
