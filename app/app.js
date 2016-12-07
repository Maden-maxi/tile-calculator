'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'ngMaterial',
  'ui.mask',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  // $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}])
    .controller('navCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
      $scope.currentLocation = $location.path();
      //$window.alert($scope.currentLocation);
      $scope.restart = function () {
        localStorage.clear();
        localStorage.setItem('saveStateEvent', 'restart');
        location.assign('/');
      };

        $scope.getClass = function (path) {
            return ($location.path().substr(0, path.length) === path) ? 'current-step' : '';
        }

      // $scope.links = ['/view1', '/view2', '/view3'];
    }]);
