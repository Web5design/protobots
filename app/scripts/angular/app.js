'use strict';

angular.module('ngProtobotsApp', [])
  .config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).
      when('/:name', {
        templateUrl: 'views/main.html',
        controller: 'PagesController'
      }).
      otherwise({
        redirectTo: '/'
      });
  });
