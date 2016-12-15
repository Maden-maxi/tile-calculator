'use strict';

angular.module('myApp.view1', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {

  $stateProvider.state({
    name: 'step1',
    url: '/',
    templateUrl: 'views/step1.html',
    controller: 'View1Ctrl'
  });

}])

.controller('View1Ctrl', [ '$scope', '$rootScope', '$log', '$window', 'Series', function($scope, $rootScope, $log, $window, Series) {

  $scope.regex = '^\\d+$'; // Validate numbers
  $scope.rangeSizes = {min: 100, max: 1000};
  $scope.seriesData = {};

  if( !localStorage.getItem( 'series' ) && angular.isUndefined( $scope.seriesData.id_series ) ){
    $scope.seriesData = {
      "gutter": 3
    };
  } else {
    $scope.seriesData = JSON.parse( localStorage.getItem( 'series' ) );
  }

  $scope.$watch('seriesData.id_series', function (newValue, oldValue) {
    $log.log(newValue, oldValue);
    if( !angular.isUndefined(newValue) ){
      var initVal = Series.get();
      var series = JSON.parse( localStorage.getItem('series') );
      $log.log(initVal[newValue]);
      $log.log(series);
      $scope.seriesData.appointment =  (series && ( oldValue === 0 ) ) ? series.appointment : initVal[newValue].appointment;
      $scope.seriesData.tile_sizes = initVal[newValue].tile_sizes;
      $scope.seriesData.layout = initVal[newValue].layout;
      $scope.seriesData.colors = initVal[newValue].colors;
      switch (newValue) {
        case 0:
          //$log.log(initVal[newValue]);
          if( angular.isUndefined($scope.seriesData.tiles) ) {
            $scope.seriesData.tiles = {
              "wall": {"walls": [{}]}
            };
          }
          break;
        case 1:
          //$log.log(initVal[newValue]);
          $scope.seriesData.appointment = initVal[newValue].appointment;
          if( angular.isUndefined($scope.seriesData.tiles) ) {
            $scope.seriesData.tiles= {
              "wall": {"walls": [{}]}
            };
          }
          break;
        case 2:
          $scope.seriesData.appointment = initVal[newValue].appointment;
          //$log.log(initVal[newValue]);
          break;
      }
    }
  });

  $scope.$on('restart', function () {
    $scope.seriesData = {"gutter": 3};
  });

   //Adding walls fields
  $scope.popWall = function () {
    $scope.seriesData.tiles.wall.walls.pop();
  };
  $scope.pushWall = function () {
    $scope.seriesData.tiles.wall.walls.push({});
  };

  function saveData() {
    if( !angular.isUndefined( $scope.seriesData.id_series ) ){
      localStorage.setItem('series', JSON.stringify( $scope.seriesData ) );
    }
  }

  $scope.$on('$destroy', saveData);
  window.onunload = saveData;

}]);
