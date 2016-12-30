angular.module('myApp')
    .factory('Series', [ '$log', function ( $log ) {
        return {
            get: function () {
               return [
                    {
                        "id_series": 0,
                        "type_series": 0,
                        "appointment": {"wall": true, "flor": true},
                        "layout": {"wall": "rectangular", "flor": "rectangular"},
                        "tile_sizes": {
                            "wall": {"width": 45, "height": 35},
                            "flor": {"width": 40, "height": 30}
                        },
                        "colors": {
                            "wall": [
                                {color: "#FF215E", price: 10},
                                {color: "#FFA5B8", price: 5},
                                {color: "#CD853F", price: 9},
                                {color: "#FFF655", price: 11},
                                {color: "#70FF61", price: 15},
                                {color: "#68FFEE", price: 13},
                                {color: "#0F5EFF", price: 11}
                            ],
                            "flor": [
                                {color: "#FF1215", price: 14},
                                {color: "#7505CD", price: 5},
                                {color: "#CD8606", price: 45},
                                {color: "#B6CD00", price: 12},
                                {color: "#00FFF3", price: 21}
                            ]
                        }
                    },
                    {
                        "id_series": 1,
                        "type_series": 1,
                        "appointment": {"wall": true },
                        "layout": {"wall": "rectangular"},
                        "tile_sizes": {
                            "wall": {"width": 30, "height": 30}
                        },
                        "colors": {
                            "wall": [
                                {color: "#FF00B3", price: 11},
                                {color: "#0900FF", price: 12},
                                {color: "#07FF00", price: 13},
                                {color: "#00CDC9", price: 14},
                                {color: "#9297CD", price: 15}
                            ]
                        }

                    },
                    {
                        "id_series": 2,
                        "type_series": 2,
                        "appointment": {"flor": true},
                        "layout": {"flor": "rectangular"},
                        "tile_sizes": {
                            "flor": {"width": 40, "height": 40}
                        },
                        "colors": {
                            "flor": [
                                {color: "#72FF8D", price: 21},
                                {color: "#89BACD", price: 20},
                                {color: "#5D0C0F", price: 19},
                                {color: "#161180", price: 18},
                                {color: "#009B9A", price: 15},
                                {color: "#f0f0f0", price: 12}
                            ]
                        }
                    }
                ];
            },
            save: function ( scope, object, condition, item) {

                function saveFunction() {
                    if ( condition ) localStorage.setItem( item, JSON.stringify(scope[object]) );
                }

                scope.$on('$destroy' , saveFunction);
                window.onunload = saveFunction;

                scope.$on('restart', function () { $scope[object] = {}; });
                $log.log(scope, object,condition,item);
            }
        };
    }]);
