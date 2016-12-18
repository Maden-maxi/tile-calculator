angular.module('myApp')
    .factory('Series', [ function () {
        return {
            get: function () {
               return [
                    {
                        "id_series": 0,
                        "type_series": 0,
                        "appointment": {"wall": true, "flor": true},
                        "layout": {"wall": "rectangular", "flor": "rectangular"},
                        "tile_sizes": {
                            "wall": {"width": 30, "height": 20},
                            "flor": {"width": 40, "height": 30}
                        },
                        "colors": {
                            "wall": ["#FF215E", "#FFA5B8", "#CD853F", "#FFF655", "#70FF61", "#68FFEE", "#0F5EFF"],
                            "flor": ["#FF1215", "#7505CD", "#CD8606", "#B6CD00", "#00FFF3"]
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
                            "wall": ["#FF00B3", "#0900FF", "#07FF00", "#00CDC9", "#9297CD"]
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
                            "flor": ["#72FF8D", "#89BACD", "#5D0C0F", "#161180", "#009B9A", "#000000"]
                        }
                    }
                ];
            },
            save: function ( $scope, condition, item, object ) {
                //if( condition ) localStorage.setItem( item, JSON.stringify( object ) );
                function saveGridInfo() {
                    if ( condition ) {
                        localStorage.setItem( item, JSON.stringify(object) );
                    }
                }
                $scope.$on('$destroy' , saveGridInfo);
                window.onunload = saveGridInfo;
            }
        };
    }]);
