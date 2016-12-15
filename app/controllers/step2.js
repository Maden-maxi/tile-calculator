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

.controller('View2Ctrl', [ '$scope', '$log', function($scope, $log) {
  $scope.stats = JSON.parse(localStorage.getItem('series'));

  $scope.gridInfo = {};
  if ( !localStorage.getItem('gridInfo') ) {
    $scope.gridInfo.activeTab = '0';
    $scope.gridInfo.zoom = 2;
    if( $scope.stats.appointment.flor == true ) {
      $scope.gridInfo.flor = {
        rows: Math.round($scope.stats.tiles.flor.height / $scope.stats.tile_sizes.flor.height),
        columns: Math.round($scope.stats.tiles.flor.width/ $scope.stats.tile_sizes.flor.width),
        cellsCount: Math.round($scope.stats.tiles.flor.height / $scope.stats.tile_sizes.flor.height) * Math.round($scope.stats.tiles.flor.width/ $scope.stats.tile_sizes.flor.width),
        grid: []
      };
      /*
      var g = [
        ["11","12","13"],
        ["21","22","23"]
      ];
      var g2 = {
        0:['1','2','3'],
        1:['1','2','3']
      };
      */
      for ( var i = 0; i < $scope.gridInfo.flor.rows; i++ ){
        $scope.gridInfo.flor.grid[i] = [];
        for ( var j = 0; j < $scope.gridInfo.flor.columns; j++ ) {
          $scope.gridInfo.flor.grid[i].push({id: j});
        }
      }
      $log.log($scope.gridInfo.flor.grid);

    }
    if ( $scope.stats.appointment.wall == true ) {
      /*
      var gw = [
          [
              [
                {},{},{}
              ]
          ],
          [
              [
                {},{},{}
              ]
          ]
      ];
      var gridWalls = {
        0: {
          0: [{},{},{}],
          1: [{},{},{}]
        },
        1: {
          0: [{},{},{}],
          1: [{},{},{}]
        }
      };
      */
      $scope.gridInfo.wall = {
        rows: Math.round(  $scope.stats.tiles.wall.height / $scope.stats.tile_sizes.wall.height ),
        columns: [],
        cellsCount: [],
        grid: []
      };
      $scope.stats.tiles.wall.walls.forEach(function (element, index, array) {
        console.log(element.width, $scope.stats.tile_sizes.wall.width );
        $scope.gridInfo.wall.columns.push( Math.round( element.width / $scope.stats.tile_sizes.wall.width ) );
      });
      $scope.gridInfo.wall.columns.forEach(function (element, index, array) {
        $log.log( element );
        $scope.gridInfo.wall.cellsCount.push( $scope.gridInfo.wall.rows * element );
      });
      //wall
      for( var i = 0; i < $scope.gridInfo.wall.columns.length; i++ ){
        $scope.gridInfo.wall.grid[i] = [];
        //row
        for ( var j = 0; j < $scope.gridInfo.wall.rows; j++ ){
          $scope.gridInfo.wall.grid[i][j] = [];
          //col
          for ( var k = 0; k < $scope.gridInfo.wall.columns[i]; k++ ) {
            $scope.gridInfo.wall.grid[i][j][k] = {id: k};
          }
        }
      }
      $log.log( $scope.gridInfo.wall.grid );
    }
  } else {
    $scope.gridInfo = JSON.parse( localStorage.getItem('gridInfo') );
  }

  $scope.showTab = function (tabId) {
    $scope.gridInfo.activeTab = tabId;
  };

  function saveGridInfo() {
    localStorage.setItem( 'gridInfo', JSON.stringify($scope.gridInfo) );
  }

  $scope.$on('restart', function () {
    $scope.gridInfo = {};
    localStorage.clear();
  });

  $scope.$on('$destroy', saveGridInfo);
  window.onunload = saveGridInfo;

}]);