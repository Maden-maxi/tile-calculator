'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ngAnimate',
  'ngMaterial',
  'ui.mask',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
])
.config(['$urlRouterProvider', '$locationProvider', function ($urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');
    /*
    $locationProvider.html5Mode({
        enabled:true,
        requireBase: true
    });
    $locationProvider.hashPrefix('!');*/

}])
    /*
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  // $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}])*/
.controller('navCtrl', ['$scope', '$rootScope', '$state', '$log', function ($scope, $rootScope, $state, $log) {
    $scope.restart = function () {

        if( $state.$current.name === 'step1' ){
            localStorage.clear();
            localStorage.setItem('saveStateEvent', 'restart');
            location.reload();
        } else {
            localStorage.clear();
            localStorage.setItem('saveStateEvent', 'restart');
            $state.go('step1');
        }

        // localStorage.setItem('saveStateEvent', 'restart');
        // location.assign('/');
        //location.reload();

    };
    $scope.links = [{'url': 'step1', 'name': 'Назначение и размеры'}, {'url': 'step2', 'name': 'Разкладка плитки'}, {'url': 'step3', 'name': 'Расчет стоимости'}];
}]);
