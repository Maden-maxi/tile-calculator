'use strict';

angular.module('myApp.view2', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state({
    name: 'step2',
    url: '/step2',
    templateUrl: 'views/step2.html',
    controller: 'View2Ctrl'
  });

}])

.controller('View2Ctrl', [ '$scope', function($scope) {
  $scope.stats = JSON.parse(localStorage.getItem('series'));

  $scope.gridInfo = {};
  if (!localStorage.getItem('gridInfo')) {
    if( $scope.stats.appointment.wall ) {
      $scope.gridInfo.activeTab = 'wall0';
    } else {
      $scope.gridInfo.activeTab = 'flor';
    }
  } else {
    $scope.gridInfo = JSON.parse( localStorage.getItem('gridInfo') )
  }

  $scope.showTab = function (tabId) {
    $scope.gridInfo.activeTab = tabId;
  };

  function saveGridInfo() {
    localStorage.setItem( 'gridInfo', JSON.stringify($scope.gridInfo) );
  }

  $scope.$on('restart', function () {
    $scope.gridInfo = {};
  });

  $scope.$on('$destroy', saveGridInfo);
  window.onunload = saveGridInfo;

}]);