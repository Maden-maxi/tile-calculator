angular.module('myApp')
    .factory('Series', [function () {
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
                        }
                    },
                    {
                        "id_series": 1,
                        "type_series": 1,
                        "appointment": {"wall": true },
                        "layout": {"wall": "rectangular"},
                        "tile_sizes": {
                            "wall": {"width": 30, "height": 30}
                        }

                    },
                    {
                        "id_series": 2,
                        "type_series": 2,
                        "appointment": {"flor": true},
                        "layout": {"flor": "rectangular"},
                        "tile_sizes": {
                            "flor": {"width": 40, "height": 40}
                        }
                    }
                ];
            }
        };
    }]);
