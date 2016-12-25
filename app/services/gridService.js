angular.module('myApp')
    .factory('Grid', [ '$log', function ($log) {
        return {
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
                var key, row, column;
                for ( row = 0; row < object.length; row++ )
                    for (  column = 0; column < object[row].length; column++ )
                        for( key in params )
                            object[row][column][key] = params[key];
            },
            cellsIsEmpty: function (object, param) {
                //console.trace();
                var row, column;
                for ( row = 0; row < object.length; row++ ){
                    for (  column = 0; column < object[row].length; column++ ){
                        if( angular.isDefined(object[row][column][param]) ) {
                            //$log.log('not empty');
                            return false;
                        }
                    }
                }
                //$log.log('empty');
                return true;

            },
            /**
             * Iterate over rows and cols params and change params value
             * @param axis string 'row' || 'column'
             * @param arr array. Matrix
             * @param index int
             * @param params object {paramName: paramValue}
             */
            changeAxisParams: function ( axis, arr, index, params, increment) {
                var key, i, increment = increment || 1;

                if(axis === 'row')
                    for ( i = 0; i < arr[index].length; i+=increment )
                        for( key in params )
                            arr[index][i][key] = params[key];
                else if(axis === 'column')
                    for ( i = 0; i < arr.length; i+=increment )
                        for( key in params )
                            arr[i][index][key] = params[key];
            },
            changeAxisParamsRhombus: function (axis, arr, index, params, increment) {

                var key, i = 0;
                if(axis === 'row')
                    for ( i; i < arr[index].length; i++ )
                        for( key in params )
                            arr[index][i][key] = params[key];
                else if(axis === 'column') {
                    i = index % 2;
                    if( index > 1 ){
                       index = index - Math.ceil( index / 2 );
                    } else if(index == 1) {
                        --index;
                    }
                    for ( i; i < arr.length; i+=2 ) {
                       // console.log(i,index);
                        for (key in params) {
                            arr[i][index][key] = params[key];
                        }
                    }
                }

            }
        };
    }]);
