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

.controller('View2Ctrl', [ '$scope', '$rootScope', 'Grid', 'Rhombus', '$log', function($scope, $rootScope, Grid, Rhombus, $log) {

    $scope.stats = JSON.parse(localStorage.getItem('series'));

    $scope.gridInfo = {};

    // if grid we no have information about grid we build it
    if ( !localStorage.getItem('gridInfo') ) {

        $scope.gridInfo.activeTab = '0';
        $scope.gridInfo.zoom = 1;

        //build grid for flor

        if( $scope.stats.appointment.flor == true ) {
            $scope.gridInfo.flor = {
                rows: Math.ceil($scope.stats.tiles.flor.height / $scope.stats.tile_sizes.flor.height),
                columns: Math.ceil($scope.stats.tiles.flor.width / $scope.stats.tile_sizes.flor.width),
                cellsCount: Math.ceil($scope.stats.tiles.flor.height / $scope.stats.tile_sizes.flor.height) * Math.ceil($scope.stats.tiles.flor.width / $scope.stats.tile_sizes.flor.width),
                grid: [],
                isEmpty: true
            };

            //createTable($scope.gridInfo.flor.rows, $scope.gridInfo.flor.columns, $scope.gridInfo.flor.grid);
            Grid.build($scope.gridInfo.flor.rows, $scope.gridInfo.flor.columns, $scope.gridInfo.flor.grid);
            if( $scope.stats.layout.flor === 'diagonal' ) {
                Grid.build($scope.gridInfo.flor.rows, $scope.gridInfo.flor.columns, $scope.gridInfo.flor.grid, true);
                $scope.gridInfo.flor.rhombus = new Rhombus(
                    $scope.stats.tile_sizes.flor.width,
                    $scope.gridInfo.flor.rows,
                    $scope.gridInfo.flor.columns
                );
            } else {
                Grid.build($scope.gridInfo.flor.rows, $scope.gridInfo.flor.columns, $scope.gridInfo.flor.grid);
            }
            if ($rootScope.DEBUG_MOD) $log.log($scope.gridInfo.flor.grid);
        }

        //build grid for walls
        if ( $scope.stats.appointment.wall == true ) {

            $scope.gridInfo.wall = {
                rows: Math.ceil(  $scope.stats.tiles.wall.height / $scope.stats.tile_sizes.wall.height ),
                columns: [],
                cellsCount: [],
                grid: [],
                rhombus: [],
                isEmpty: []
            };

            $scope.stats.tiles.wall.walls.forEach(function (element, index) {
                $scope.gridInfo.wall.columns[index] = Math.ceil( element.width / $scope.stats.tile_sizes.wall.width );
            });

            $scope.gridInfo.wall.columns.forEach(function (element, index) {
                $scope.gridInfo.wall.cellsCount[index] = $scope.gridInfo.wall.rows * element;
            });
            if( $scope.stats.layout.wall === 'diagonal' ) {
                for( var i = 0; i < $scope.gridInfo.wall.columns.length; i++ ){
                    $scope.gridInfo.wall.grid[i] = [];
                    $scope.gridInfo.wall.rhombus[i] = [];
                    $scope.gridInfo.wall.isEmpty[i] = true;
                    Grid.build($scope.gridInfo.wall.rows, $scope.gridInfo.wall.columns[i], $scope.gridInfo.wall.grid[i], true);
                    $scope.gridInfo.wall.rhombus[i] = new Rhombus(
                        $scope.stats.tile_sizes.wall.width,
                        $scope.gridInfo.wall.rows,
                        $scope.gridInfo.wall.columns[i]
                    );
                }
            } else {
                for( var i = 0; i < $scope.gridInfo.wall.columns.length; i++ ){
                    $scope.gridInfo.wall.grid[i] = [];
                    Grid.build($scope.gridInfo.wall.rows,$scope.gridInfo.wall.columns[i], $scope.gridInfo.wall.grid[i]);
                }
            }

            if ($rootScope.DEBUG_MOD) $log.log( $scope.gridInfo.wall.grid );
        }

    } else {
        //else if we have grid we load from localStorage information about it
        $scope.gridInfo = JSON.parse( localStorage.getItem('gridInfo') );
        //if layout diagonal we create styles for Rhombus grid for walls
        if($scope.gridInfo.wall && $scope.stats.layout.wall === 'diagonal'){
            for( var i = 0; i < $scope.gridInfo.wall.columns.length; i++ ){
                $scope.gridInfo.wall.rhombus[i] = new Rhombus(
                    $scope.stats.tile_sizes.wall.width,
                    $scope.gridInfo.wall.rows,
                    $scope.gridInfo.wall.columns[i]
                );
            }
        }
        //if layout diagonal we create styles for Rhombus grid for flor
        if($scope.gridInfo.flor && $scope.stats.layout.flor === 'diagonal'){
            $scope.gridInfo.flor.rhombus = new Rhombus(
                $scope.stats.tile_sizes.flor.width,
                $scope.gridInfo.flor.rows,
                $scope.gridInfo.flor.columns
            );
        }


    }

    // switch between tabs
    $scope.showTab = function (tabId) {
        $scope.gridInfo.activeTab = tabId;
    };

    //common carousel settings
    var carouselSettings = {
        perspective: 35,
        startSlide: 0,
        border: 3,
        dir: 'ltr',
        space: 220,
        autoRotationSpeed: false,
        loop: true,
        controls: true
    };

    // carousel settings for wall
    if( $scope.stats.tile_sizes.wall ){
        carouselSettings.width = ( $scope.stats.tile_sizes.wall.width * $scope.gridInfo.zoom  ) || 360;
        carouselSettings.height = ( $scope.stats.tile_sizes.wall.height * $scope.gridInfo.zoom ) || 240;
        $scope.carouselColorsWall = carouselSettings;
    }

    // carousel settings for flor
    if( $scope.stats.tile_sizes.flor ) {
        carouselSettings.width = $scope.stats.tile_sizes.flor.width * $scope.gridInfo.zoom || 360;
        carouselSettings.height = $scope.stats.tile_sizes.flor.height * $scope.gridInfo.zoom || 240;
        $scope.carouselColorsFlor = carouselSettings;
    }

    //drag vars. They describe state rectangle with color
    $scope.dndVars = {
        isOver: false,
        isOverColumn: false,
        dragState: 'grab'
    };

    /**
     * Event handlers for rectangle with color
     * @type {{dragstart: $scope.rectColor.dragstart, drag: $scope.rectColor.drag, dragend: $scope.rectColor.dragend}}
     */
    $scope.rectColor = {
        dragstart: function () {
            if ($rootScope.DEBUG_MOD) $log.log('dragstart', arguments);
            $scope.dndVars.dragState = 'grabbing';

        },
        drag: function () {
            if ($rootScope.DEBUG_MOD) $log.log('drag', arguments);
        },
        dragend: function (dropmodel, dragmodel) {
            if ($rootScope.DEBUG_MOD) $log.log('dragend', arguments);
            $scope.dndVars.dragState = 'grab';

            if( !$scope.dndVars.isOver ) {
                $scope.dropColor = 'transparent';
            }
        }
    };

    /**
     * Event handlers for cells in grid
     * @type {{drop: $scope.rectDrop.drop, dragenter: $scope.rectDrop.dragenter, dragover: $scope.rectDrop.dragover, dragleave: $scope.rectDrop.dragleave}}
     */
    $scope.rectDrop = {
        drop: function (dropmodel, dragmodel) {
            if ($rootScope.DEBUG_MOD) console.log('drop', arguments);
            if( $scope.dndVars.isOver ){
                $scope.dropColor = dragmodel;
                $scope.dndVars.isOver = false;
                dropmodel.color = dragmodel;
                dropmodel.hover = undefined;
            }
        },
        dragenter: function ( dropmodel, dragmodel ) {
            if ($rootScope.DEBUG_MOD) $log.log('dragenter', arguments);
            $scope.dndVars.isOver = true;
            dropmodel.hover = 'dragover';
        },
        dragover: function ( dropmodel, dragmodel ) {
            if ($rootScope.DEBUG_MOD) $log.log('dragover', arguments);
        },
        dragleave: function (dropmodel, dragmodel) {
            if ($rootScope.DEBUG_MOD) $log.log('dragleave', arguments);
            $scope.dndVars.isOver = false;
            dropmodel.hover = undefined;

        }
    };

    /**
     * Event handlers for grid headers for cover cells on x and y
     * @type {{dragenter: $scope.gridCov.dragenter, dragleave: $scope.gridCov.dragleave, drop: $scope.gridCov.drop}}
     */
    $scope.gridCov = {
        dragenter: function (dropmodel, dragmodel, type, arr, typeIndex, rhombus) {
            if ($rootScope.DEBUG_MOD) $log.log(arguments);
            $scope.dndVars.isOverColumn = true;
            if(rhombus){
                Grid.changeAxisParamsRhombus(type, arr, typeIndex, {"hover": "dragover"}, rhombus)
            } else {
                Grid.changeAxisParams(type, arr, typeIndex, {"hover": "dragover"});
            }

        },
        dragleave: function (dropmodel, dragmodel, type, arr, typeIndex, rhombus) {
            if ($rootScope.DEBUG_MOD) $log.log(arguments);
            $scope.dndVars.isOverColumn = false;

            if(rhombus){
                Grid.changeAxisParamsRhombus(type, arr, typeIndex, {"hover": undefined}, rhombus)
            } else {
                Grid.changeAxisParams(type, arr, typeIndex, {"hover": undefined});
            }
        },
        drop: function (dropmodel, dragmodel, type, arr, typeIndex, rhombus) {
            if( $scope.dndVars.isOverColumn ) {
                if ($rootScope.DEBUG_MOD) $log.log(arguments);
                $scope.dndVars.isOverColumn = false;
                if(rhombus){
                    Grid.changeAxisParamsRhombus(type, arr, typeIndex, {"hover": undefined, "color": dragmodel}, rhombus)
                } else {
                    Grid.changeAxisParams(type, arr, typeIndex, {"hover": undefined, "color": dragmodel});
                }
            }
        }
    };

    /**
     * Clear cells
     * @param type string
     * @param arr array
     * @param typeIndex integer
     * @param rhombus integer
     */
    $scope.gridCls = function (type, arr, typeIndex, rhombus) {
        if(rhombus){
            Grid.changeAxisParamsRhombus( type, arr, typeIndex, {"color": undefined}, rhombus )
        } else {
            Grid.changeAxisParams( type, arr, typeIndex, {"color": undefined} );
        }
    };
    /**
     * Change all Cells Params
     * @param object array
     * @param params object
     */
    $scope.changeCellsGridParams = function (object, params) {
        Grid.changeAllCellsParams(object, params);
    };
    $scope.eraser = undefined;

    // Check grids if is Empty
    if( $scope.gridInfo.flor ) {
        $scope.florIsEmpty = function() {
            return Grid.cellsIsEmpty($scope.gridInfo.flor.grid, 'color');
        }
    }
    if($scope.gridInfo.wall) {
        $scope.wallIsEmpty = function () {
            for ( var i = 0, status; i < $scope.gridInfo.wall.grid.length; i++) {
                status = Grid.cellsIsEmpty($scope.gridInfo.wall.grid[i], 'color');
                if( status ) return status; // is Empty = true
            }
            return false;
        }
    }

    /**
     * Save grid state
     */
    function saveGridInfo() {
        if ( localStorage.getItem('series') ) localStorage.setItem( 'gridInfo', JSON.stringify($scope.gridInfo) );
    }

    $scope.$on('$destroy' , saveGridInfo);
    window.onunload = saveGridInfo;

    $scope.$on('restart', function () { $scope.gridInfo = {}; });

}]);