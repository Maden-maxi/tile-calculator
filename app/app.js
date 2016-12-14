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

}])

.controller('navCtrl', ['$scope', '$rootScope', '$state', '$log', function ($scope, $rootScope, $state, $log) {

    $scope.restart = function () {
        if ($state.current.name !== 'step1') $state.go('step1');
        localStorage.clear();
        $log.log('restart');
        $rootScope.$broadcast('restart');
    };

    $scope.links = [{'url': 'step1', 'name': 'Назначение и размеры'}, {'url': 'step2', 'name': 'Разкладка плитки'}, {'url': 'step3', 'name': 'Расчет стоимости'}];

}]);
