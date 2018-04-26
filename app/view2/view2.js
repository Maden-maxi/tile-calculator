'use strict';

angular.module('myApp.view2', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state({
    name: 'step2',
    url: '/step2',
    templateUrl: 'views/step2.html',
    controller: 'View2Ctrl'
  });
  /*
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
  */
}])

.controller('View2Ctrl', [ '$scope', function($scope) {
  $scope.stats = JSON.parse(localStorage.getItem('series'));
}]);