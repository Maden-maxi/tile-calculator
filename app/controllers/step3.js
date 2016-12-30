'use strict';

angular.module('myApp.view3', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state({
        name: 'step3',
        url: '/step3',
        templateUrl: 'views/step3.html',
        controller: 'View3Ctrl'
    });

}])

.controller('View3Ctrl', [ '$scope', function($scope) {

    /**
     *
     * @param arr<Array>
     * @param obj<Object>
     * @param attr<String>
     * @param type<String>
     */
    function createObjectsArray(arr, obj, attr, type) {
        for(var i = 0; i < arr.length; i++){
            if(angular.isUndefined(obj[arr[i][attr]])){
                obj[arr[i][attr]] = {};
                obj[arr[i][attr]].prices = [];
                if(type === 'wall'){
                    obj[arr[i][attr]].sizes = $scope.series.tile_sizes.wall;
                    obj[arr[i][attr]].size = $scope.series.tile_sizes.wall.width + 'x' + $scope.series.tile_sizes.wall.height;
                    obj[arr[i][attr]].layout = $scope.series.layout.wall;
                } else if(type === 'flor'){
                    obj[arr[i][attr]].sizes = $scope.series.tile_sizes.flor;
                    obj[arr[i][attr]].size = $scope.series.tile_sizes.flor.width + 'x' + $scope.series.tile_sizes.flor.height;
                    obj[arr[i][attr]].layout = $scope.series.layout.flor;
                }
            }
        }
    }

    function getDataTable() {
        var arr = [];
        for (var i in $scope.tableState.dataTable)
            arr.push($scope.tableState.dataTable[i]);
        return arr;
    }

    function sum(obj, param) {
        var sum = 0;
        for(var k in obj)
            sum += obj[k][param];
        return sum;
    }

    $scope.gridData = JSON.parse(localStorage.getItem('gridInfo'));
    $scope.series = JSON.parse(localStorage.getItem('series'));
    $scope.tableState = {};
    if( !localStorage.getItem('score') ){
        $scope.tableState.tableHeaders = [
            {id: 0, title:'#', sortParam: 'id', arrowState: 'arrow_drop_down', isActive: false},
            {id: 1, title:'Цвет', sortParam: 'color', arrowState: 'arrow_drop_down', isActive: false},
            {id: 2, title: 'Цена за 1шт.', sortParam: 'price', arrowState: 'arrow_drop_down', isActive: false},
            {id: 3, title:'Розмеры', sortParam: 'size', arrowState: 'arrow_drop_down', isActive: false},
            {id: 4, title: 'Количество', sortParam: 'quantity', arrowState: 'arrow_drop_down', isActive: false},
            {id: 5, title:'Сумма', sortParam: 'sum', arrowState: 'arrow_drop_down', isActive: false}
        ];

        $scope.tableState.dataTable = {};

        if( $scope.gridData.wall )
            createObjectsArray($scope.series.colors.wall, $scope.tableState.dataTable, 'color', 'wall');

        if( $scope.gridData.flor )
            createObjectsArray($scope.series.colors.flor, $scope.tableState.dataTable, 'color', 'flor');

        if( $scope.gridData.wall ){
            angular.forEach($scope.series.colors.wall, function (obj,i) {
                angular.forEach( $scope.gridData.wall.grid, function (grid, k) {
                    angular.forEach( grid, function (row, index) {
                        angular.forEach( row, function (cell, id) {

                            cell.id = undefined;
                            if ( angular.equals( cell.color, obj.color ) )
                                $scope.tableState.dataTable[obj.color].prices.push(cell.price);

                        } );
                    });
                });
            });
        }
        if( $scope.gridData.flor ){

            angular.forEach($scope.series.colors.flor, function (obj,i) {
                angular.forEach( $scope.gridData.flor.grid, function (row, k) {
                    angular.forEach( row, function (cell, id) {

                        cell.id = undefined;
                        if ( angular.equals( cell.color, obj.color ) )
                            $scope.tableState.dataTable[obj.color].prices.push(cell.price);

                    });
                });
            });

        }
        var id = 0;
        angular.forEach($scope.tableState.dataTable, function (value, key, dt ) {

            if(dt[key].prices.length > 0){
                dt[key]['sum'] = value.prices[0] * value.prices.length;
                dt[key]['quantity'] = value.prices.length;
                dt[key]['price'] = value.prices[0];
                dt[key]['color'] = key;
                dt[key]['id'] = id++;
            } else {
                delete dt[key];
            }
        });

        $scope.tableState.sum = sum($scope.tableState.dataTable, 'sum');

        $scope.tableState.tableOfData = getDataTable();

        $scope.tableState.sortVar = 'id';
        localStorage.setItem( 'score', JSON.stringify($scope.tableState) );
    } else {
        $scope.tableState = JSON.parse( localStorage.getItem('score') );
    }

    $scope.sortColumnBy = function (sortParam, id) {

        for(var i = 0; i < $scope.tableState.tableHeaders.length; i++){
            $scope.tableState.tableHeaders[i].arrowState = 'arrow_drop_down';
            $scope.tableState.tableHeaders[i].isActive = false;
        }
        $scope.tableState.tableHeaders[id].isActive = true;

        if($scope.tableState.sortVar.indexOf('-') === -1){
            $scope.tableState.sortVar = '-' + sortParam;
            $scope.tableState.tableHeaders[id].arrowState = 'arrow_drop_up';
        } else {
            $scope.tableState.tableHeaders[id].arrowState = 'arrow_drop_down';
            $scope.tableState.sortVar = sortParam.replace('-', '');
        }
    };

    /**
     * Save State
     */
    function saveScore() {
        if ( localStorage.getItem('score') ) localStorage.setItem( 'score', JSON.stringify($scope.tableState) );
    }

    $scope.$on('$destroy' , saveScore);
    window.onunload = saveScore;

    $scope.$on('restart', function () { $scope.tableState = {}; });

}]);