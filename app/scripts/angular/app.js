'use strict';

angular.module('ngProtobotsApp', [])
  .config(function ($locationProvider, $routeProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider.
      when('/', {
        templateUrl: 'views/home.html'
      }).
       when('/blog-node', {
        templateUrl: 'views/blog-node.html'
      }).
      when('/:name', {
        templateUrl: 'views/home.html',
        controller: 'PagesController'
      }).
      otherwise({
        redirectTo: '/'
      });
  });
