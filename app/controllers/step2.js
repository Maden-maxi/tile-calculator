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

.controller('View2Ctrl', [ '$scope', '$rootScope', 'Grid', '$log', function($scope, $rootScope, Grid, $log) {

    $scope.rombusStyles = function (side, rowIndex, columnIndex, color) {
        return {
            'width': side + 'px',
            'height': side + 'px',
            'background-color': color || '#fefefe',
            'margin-left': (side) / -2 + 'px',
            'margin-top': (side) / -2 + 'px',
            'top': ( (side) * Math.SQRT2 ) / (-rowIndex) + side + 'px',
            'left':  ( (side) * Math.SQRT2 ) / (-columnIndex) + side + 'px'
        };
    };

    $scope.stats = JSON.parse(localStorage.getItem('series'));
    $scope.gridInfo = {};

    if ( !localStorage.getItem('gridInfo') ) {

        $scope.gridInfo.activeTab = '0';
        $scope.gridInfo.zoom = 1;

        if( $scope.stats.appointment.flor == true ) {
            $scope.gridInfo.flor = {
                rows: Math.ceil($scope.stats.tiles.flor.height / $scope.stats.tile_sizes.flor.height),
                columns: Math.ceil($scope.stats.tiles.flor.width / $scope.stats.tile_sizes.flor.width),
                cellsCount: Math.ceil($scope.stats.tiles.flor.height / $scope.stats.tile_sizes.flor.height) * Math.ceil($scope.stats.tiles.flor.width / $scope.stats.tile_sizes.flor.width),
                grid: []
            };

            //createTable($scope.gridInfo.flor.rows, $scope.gridInfo.flor.columns, $scope.gridInfo.flor.grid);
            Grid.build($scope.gridInfo.flor.rows, $scope.gridInfo.flor.columns, $scope.gridInfo.flor.grid);
            if ($rootScope.DEBUG_MOD) $log.log($scope.gridInfo.flor.grid);
        }
        if ( $scope.stats.appointment.wall == true ) {

            $scope.gridInfo.wall = {
                rows: Math.ceil(  $scope.stats.tiles.wall.height / $scope.stats.tile_sizes.wall.height ),
                columns: [],
                cellsCount: [],
                grid: []
            };

            $scope.stats.tiles.wall.walls.forEach(function (element, index) {
                $scope.gridInfo.wall.columns[index] = Math.ceil( element.width / $scope.stats.tile_sizes.wall.width );
            });

            $scope.gridInfo.wall.columns.forEach(function (element, index) {
                $scope.gridInfo.wall.cellsCount[index] = $scope.gridInfo.wall.rows * element;
            });

            for( var i = 0; i < $scope.gridInfo.wall.columns.length; i++ ){
                $scope.gridInfo.wall.grid[i] = [];
                //createTable($scope.gridInfo.wall.rows,$scope.gridInfo.wall.columns[i], $scope.gridInfo.wall.grid[i]);
                Grid.build($scope.gridInfo.wall.rows,$scope.gridInfo.wall.columns[i], $scope.gridInfo.wall.grid[i]);
            }

            if ($rootScope.DEBUG_MOD) $log.log( $scope.gridInfo.wall.grid );
        }
    } else {
        $scope.gridInfo = JSON.parse( localStorage.getItem('gridInfo') );
    }

    $scope.showTab = function (tabId) {
        $scope.gridInfo.activeTab = tabId;
    };

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

    if( $scope.stats.tile_sizes.wall ){
        carouselSettings.width = ( $scope.stats.tile_sizes.wall.width * $scope.gridInfo.zoom  ) || 360;
        carouselSettings.height = ( $scope.stats.tile_sizes.wall.height * $scope.gridInfo.zoom ) || 240;
        $scope.carouselColorsWall = carouselSettings;
    }

    if( $scope.stats.tile_sizes.flor ) {
        carouselSettings.width = $scope.stats.tile_sizes.flor.width * $scope.gridInfo.zoom || 360;
        carouselSettings.height = $scope.stats.tile_sizes.flor.height * $scope.gridInfo.zoom || 240;
        $scope.carouselColorsFlor = carouselSettings;
    }

    //drag
    $scope.dndVars = {
        isOver: false,
        isOverColumn: false,
        dragState: 'grab'
    };

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

            if( $scope.dndVars.isOver ){
                $scope.dropColor = dragmodel;
                $scope.dndVars.isOver = false;
                dropmodel.color = dragmodel;
                dropmodel.hover = undefined;
            } else {
                $scope.dropColor = 'transparent';
            }
        }
    };

    $scope.rectDrop = {
        drop: function (dragmodel, model) {
            if ($rootScope.DEBUG_MOD) console.log('drop', arguments);
        },
        dragenter: function ( dropmodel, dragmodel ) {
            if ($rootScope.DEBUG_MOD) $log.log('dragenter', arguments);
            dropmodel.hover = 'dragover';
            $scope.dragActive = dropmodel;
            $scope.dndVars.isOver = true;
        },
        dragover: function () {
            if ($rootScope.DEBUG_MOD) $log.log('dragover', arguments);
        },
        dragleave: function (dropmodel, dragmodel) {
            if ($rootScope.DEBUG_MOD) $log.log('dragleave', arguments);
            dropmodel.hover = undefined;
            $scope.dndVars.isOver = false;
        }
    };

    $scope.gridCov = {
        dragenter: function (dropmodel, dragmodel, type, arr, typeIndex) {
            if ($rootScope.DEBUG_MOD) $log.log(arguments);
            $scope.dndVars.isOverColumn = true;
            Grid.changeAxisParams(type, arr, typeIndex, {"hover": "dragover"});
        },
        dragleave: function (dropmodel, dragmodel, type, arr, typeIndex) {
            if ($rootScope.DEBUG_MOD) $log.log(arguments);
            $scope.dndVars.isOverColumn = false;
            Grid.changeAxisParams(type, arr, typeIndex, {"hover": undefined});
        },
        drop: function (dropmodel, dragmodel, type, arr, typeIndex) {
            if( $scope.dndVars.isOverColumn ) {
                if ($rootScope.DEBUG_MOD) $log.log(arguments);
                $scope.dndVars.isOverColumn = false;
                Grid.changeAxisParams(type, arr, typeIndex, {"hover": undefined, "color": dragmodel});
            }
        }
    };

    /**
     * Clear cells
     * @param type string
     * @param arr array
     * @param typeIndex integer
     */
    $scope.gridCls = function (type, arr, typeIndex) {
        Grid.changeAxisParams(type, arr, typeIndex, {"color": undefined});
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
    
    //TODO: Checking grids on empty
    function gridIsEmpty() {
        
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