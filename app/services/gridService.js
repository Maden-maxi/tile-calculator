angular.module('myApp')
    .factory('Grid', [ '$log', function ($log) {
        return {
            /**
             * Version
             * @property string
             */
            version: '1.0.0',
            /**
             * Build grid
             * @param rows int
             * @param columns int
             * @param object array
             */
            build: function (rows, columns, object) {
                for (var row = 0; row < rows; row++ ) {
                    object[row] = [];
                    for ( var column = 0; column < columns; column++ ) object[row][column] = {id: column};
                }
            },
            /**
             * Change params in all cells
             * @param object array
             * @param params object
             */
            changeAllCellsParams: function (object, params) {
                console.trace();
                var key, row, column;
                for ( row = 0; row < object.length; row++ )
                    for (  column = 0; column < object[row].length; column++ )
                        for( key in params ){
                            $log.log(key, params[key]);
                            object[row][column][key] = params[key];
                        }
            },
            /**
             * Iterate over rows and cols params and change params value
             * @param axis string 'row' || 'column'
             * @param arr array. Multiarray
             * @param index int
             * @param params object {paramName: paramValue}
             */
            changeAxisParams: function ( axis, arr, index, params) {
                var key, row, column;

                if(axis === 'row')
                    for ( column = 0; column < arr[index].length; column++ )
                        for( key in params )
                            arr[index][column][key] = params[key];
                else if(axis === 'column')
                    for ( row = 0; row < arr.length; row++ )
                        for( key in params )
                            arr[row][index][key] = params[key];
            }
        };
    }]);
