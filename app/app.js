'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ngAnimate',
  'ngMaterial',
  'ui.mask',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.version',
  'dnd',
  'angular-carousel-3d'
])
.config(['$urlRouterProvider', '$locationProvider', function ($urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

}])

.controller('appCtrl', ['$scope', '$rootScope', '$state', '$log', function ($scope, $rootScope, $state, $log) {
    $rootScope.DEBUG_MOD = localStorage.getItem('debug') ? true : false;
    $scope.checkMod = function (mod) {
        if(mod){
            localStorage.setItem('debug', true);
        } else {
            localStorage.removeItem('debug');
        }
    };

    $scope.restart = function () {
        if ($state.current.name !== 'step1') $state.go('step1');
        //localStorage.removeItem('series');
        //localStorage.removeItem('gridInfo');
        localStorage.clear();
        $rootScope.$broadcast('restart');
        if($rootScope.DEBUG_MOD) $log.log('restart');
    };

    $scope.links = [{"url": "step1", "name": "Назначение и размеры", "dependency": ""}, {"url": "step2", "name": "Разкладка плитки", "dependency": "series"}, {"url": "step3", "name": "Расчет стоимости", "dependency": "gridInfo"}];

}]);
