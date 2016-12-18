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
        rows: Math.ceil($scope.stats.tiles.flor.height / $scope.stats.tile_sizes.flor.height),
        columns: Math.ceil($scope.stats.tiles.flor.width / $scope.stats.tile_sizes.flor.width),
        cellsCount: Math.ceil($scope.stats.tiles.flor.height / $scope.stats.tile_sizes.flor.height) * Math.ceil($scope.stats.tiles.flor.width / $scope.stats.tile_sizes.flor.width),
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
        rows: Math.ceil(  $scope.stats.tiles.wall.height / $scope.stats.tile_sizes.wall.height ),
        columns: [],
        cellsCount: [],
        grid: []
      };
      $scope.stats.tiles.wall.walls.forEach(function (element, index, array) {
        console.log(element.width, $scope.stats.tile_sizes.wall.width );
        $scope.gridInfo.wall.columns.push( Math.ceil( element.width / $scope.stats.tile_sizes.wall.width ) );
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

    $scope.carouselColors = {
        visible: 5,
        perspective: 35,
        startSlide: 0,
        border: 3,
        dir: 'ltr',
        width: 360,
        height: 270,
        space: 220,
        autoRotationSpeed: 2500,
        loop: true
    };


  //drag
    $scope.dndVars = {
        isDropend: false,
        isActive: false,
        isOver: false,
        isOverColumn: false,
        dragoverClass: ''
    };
    $scope.rectColor = {
        dragstart: function () {
            $log.log('dragstart', arguments);
        },
        drag: function () {
            $log.log('drag', arguments);
        },
        dragend: function (dropmodel, dragmodel) {
            $log.log('dragend', arguments);
            if(!arguments[0]) $scope.dropped = false;
            if( $scope.dndVars.isOver ){
                $scope.dropColor = arguments[1];
                $scope.dndVars.isOver = false;
                $scope.dndVars.dragoverClass = '';
                dropmodel.color = dragmodel;
                dropmodel.hover = undefined;
            } else {
                $scope.dropColor = 'transparent';
            }

        }
    };
    $scope.rectDrop = {
        drop: function (dragmodel, model) {
            console.log('drop', arguments);
            if(!arguments[0]) $scope.dropped = model;
        },
        dragenter: function ( dropmodel, dragmodel ) {
            $log.log('dragenter', arguments);
            $log.log(dropmodel);
            dropmodel.hover = 'dragover';
            $scope.dragActive = dropmodel;
            $scope.dndVars.isOver = true;
            $scope.dndVars.dragoverClass = 'dragover';
        },
        dragover: function () {
            $log.log('dragover', arguments);
        },
        dragleave: function (dropmodel, dragmodel) {
            dropmodel.hover = undefined;
            $log.log('dragleave', arguments);
            $scope.dndVars.isOver = false;
            $scope.dndVars.dragoverClass = '';
        }
    };

    //fill row & col
    $scope.gridColumn = {
        dragenter: function (dropmodel, dragmodel, wallIndex, columnIndex) {
            $scope.dndVars.isOverColumn = true;
            $log.log(dragmodel, dragmodel, wallIndex, columnIndex);
            for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex].length; i++ ) {
                $scope.gridInfo.wall.grid[wallIndex][i][columnIndex].hover = 'dragover';
            }
        },
        dragleave: function (dropmodel, dragmodel, wallIndex, columnIndex) {
            $log.log(dragmodel, dragmodel);
            $scope.dndVars.isOverColumn = false;
            for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex].length; i++ ) {
                $scope.gridInfo.wall.grid[wallIndex][i][columnIndex].hover = undefined;
            }
        },
        drop: function (dropmodel, dragmodel, wallIndex, columnIndex) {
            if( $scope.dndVars.isOverColumn ) {
                $scope.dndVars.isOverColumn = false;
                for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex].length; i++ ) {
                    $scope.gridInfo.wall.grid[wallIndex][i][columnIndex].hover = undefined;
                    $scope.gridInfo.wall.grid[wallIndex][i][columnIndex].color = dragmodel;
                }
            }
        },
        clear: function (wallIndex, columnIndex) {
            $log.log( $scope.gridInfo.wall.grid[wallIndex].length );
            for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex].length; i++ ) {
                $scope.gridInfo.wall.grid[wallIndex][i][columnIndex].color = undefined;
            }
        }
    };

    $scope.gridRow = {
        dragenter: function (dropmodel, dragmodel, wallIndex, columnIndex) {
            $scope.dndVars.isOverColumn = true;
            $log.log(dragmodel, dragmodel, wallIndex, columnIndex);
            for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex][columnIndex].length; i++ ) {
                $scope.gridInfo.wall.grid[wallIndex][columnIndex][i].color = undefined;
            }
        },
        dragleave: function (dropmodel, dragmodel, wallIndex, columnIndex) {
            $log.log(dragmodel, dragmodel);
            $scope.dndVars.isOverColumn = false;
            for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex].length; i++ ) {
                $scope.gridInfo.wall.grid[wallIndex][i][columnIndex].hover = undefined;
            }
        },
        drop: function (dropmodel, dragmodel, wallIndex, columnIndex) {
            if( $scope.dndVars.isOverColumn ) {
                $scope.dndVars.isOverColumn = false;
                for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex].length; i++ ) {
                    $scope.gridInfo.wall.grid[wallIndex][i][columnIndex].hover = undefined;
                    $scope.gridInfo.wall.grid[wallIndex][i][columnIndex].color = dragmodel;
                }
            }
        },
        clear: function (wallIndex, rowIndex) {
            $log.log( $scope.gridInfo.wall.grid[wallIndex][rowIndex].length );
            for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex][rowIndex].length; i++ ) {
                $log.log( $scope.gridInfo.wall.grid[wallIndex][rowIndex][i].color = undefined );
            }
        }
    };

    $scope.gridCover = {
        dragenter: function (dropmodel, dragmodel, type, wallIndex, typeIndex) {
            $scope.dndVars.isOverColumn = true;
            $log.log(dragmodel, dragmodel, wallIndex);
            if( type === 'row') {
                for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex][typeIndex].length; i++ ) {
                    $scope.gridInfo.wall.grid[wallIndex][typeIndex][i].hover = 'dragover';
                }
            } else if (type === 'column') {
                for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex].length; i++ ) {
                    $scope.gridInfo.wall.grid[wallIndex][i][typeIndex].hover = 'dragover';
                }
            }
        },
        dragleave: function (dropmodel, dragmodel, type, wallIndex, typeIndex) {
            $log.log(dragmodel, dragmodel);
            $scope.dndVars.isOverColumn = false;
            if( type === 'row') {
                for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex][typeIndex].length; i++ ) {
                    $scope.gridInfo.wall.grid[wallIndex][typeIndex][i].hover = undefined;
                }
            } else if (type === 'column') {
                for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex].length; i++ ) {
                    $scope.gridInfo.wall.grid[wallIndex][i][typeIndex].hover = undefined;
                }
            }
        },
        drop: function (dropmodel, dragmodel, type, wallIndex, typeIndex) {
            if( $scope.dndVars.isOverColumn ) {
                $scope.dndVars.isOverColumn = false;

                if( type === 'row') {
                    for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex][typeIndex].length; i++ ) {
                        $scope.gridInfo.wall.grid[wallIndex][typeIndex][i].hover = undefined;
                        $scope.gridInfo.wall.grid[wallIndex][typeIndex][i].color = dragmodel;
                    }
                } else if (type === 'column') {
                    for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex].length; i++ ) {
                        $scope.gridInfo.wall.grid[wallIndex][i][typeIndex].hover = undefined;
                        $scope.gridInfo.wall.grid[wallIndex][i][typeIndex].color = dragmodel;
                    }
                }

            }
        }
    };

    /**
     *
     * @param type
     * @param wallIndex
     * @param typeIndex
     */
    $scope.gridClean = function ( type, wallIndex, typeIndex ) {
        if( type === 'row') {
            for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex][typeIndex].length; i++ ) {
                $scope.gridInfo.wall.grid[wallIndex][typeIndex][i].color = undefined;
            }
        } else if (type === 'column') {
            for ( var i = 0; i < $scope.gridInfo.wall.grid[wallIndex].length; i++ ) {
                $scope.gridInfo.wall.grid[wallIndex][i][typeIndex].color = undefined;
            }
        }
    };

    $scope.eraser = undefined;

  function saveGridInfo() {
    if ( localStorage.getItem('series') ) {
      localStorage.setItem( 'gridInfo', JSON.stringify($scope.gridInfo) );
    }
  }

  $scope.$on('$destroy' , saveGridInfo);
  window.onunload = saveGridInfo;

  $scope.$on('restart', function () {
    $scope.gridInfo = {};
    localStorage.clear();
  });

}]);