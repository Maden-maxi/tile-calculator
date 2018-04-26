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

.controller('View1Ctrl', [ '$scope', '$rootScope', '$state', 'Series', '$log', function($scope, $rootScope, $state, Series, $log ) {
    /**
     * if first step fill early go to step 2
     */
    if( localStorage.getItem('gridInfo') )
        $state.go('step2');

    $scope.regex = '^\\d+$'; // Validate numbers
    $scope.rangeSizes = {min: 100, max: 1000}; // Range
    $scope.gutterSizes = [ 1, 1.5, 2, 2.5, 3, 3.5, 4];
    $scope.seriesData = {};

    if( !localStorage.getItem( 'series' ) && angular.isUndefined( $scope.seriesData.id_series ) )
        $scope.seriesData = {"gutter": 3};
    else
        $scope.seriesData = JSON.parse( localStorage.getItem( 'series' ) );

    $scope.$watch('seriesData.id_series', function (newValue, oldValue) {
        if($rootScope.DEBUG_MOD) $log.log(newValue, oldValue);
        if( !angular.isUndefined(newValue) ){
            var initVal = Series.get();
            var series = JSON.parse( localStorage.getItem('series') );
            if($rootScope.DEBUG_MOD) $log.log(initVal[newValue]);
            if($rootScope.DEBUG_MOD) $log.log(series);
            $scope.seriesData.appointment =  (series && ( oldValue === 0 ) ) ? series.appointment : initVal[newValue].appointment;
            $scope.seriesData.tile_sizes = initVal[newValue].tile_sizes;
            $scope.seriesData.layout = initVal[newValue].layout;
            $scope.seriesData.colors = initVal[newValue].colors;
            switch (newValue) {
                case 0:
                    if( angular.isUndefined($scope.seriesData.tiles) )
                        $scope.seriesData.tiles = { "wall": {"walls": [{}]} };
                    break;
                case 1:
                    $scope.seriesData.appointment = initVal[newValue].appointment;
                    if( !localStorage.getItem('series') ) {
                        $scope.seriesData.tiles = { "wall": {"walls": [{}]} };
                        $scope.seriesData.tiles.flor = undefined;
                    }
                    break;
                case 2:
                    if( !localStorage.getItem('series') ) {
                        $scope.seriesData.appointment = initVal[newValue].appointment;
                        if ($scope.seriesData.tiles)
                            $scope.seriesData.tiles.wall = undefined;
                    }
                    break;
            }
        }
    });


    $scope.checkWallType = function (newVal) {
        if(newVal) $scope.seriesData.tiles = { "wall": {"walls": [{}]} };
        else $scope.seriesData.tiles.wall = undefined;
    };
    /**
     * Save State
     */
    function saveData() {
        if( !angular.isUndefined( $scope.seriesData.id_series ) )
            localStorage.setItem('series', JSON.stringify( $scope.seriesData ) );
    }

    $scope.$on('$destroy', saveData);
    window.onunload = saveData;

    $scope.$on('restart', function () {
        $scope.seriesData = {"gutter": 3};
    });

}]);
