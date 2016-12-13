angular.module('myApp')
    .factory('Series', [function () {
        return {
            get: function () {
               return [
                    {
                        "id_series": 0,
                        "type_series": 0,
                        "tilesUse": {"walls": true, "flor": true},
                        "layout": {"walls": "rectangular", "flor": "rectangular"}
                    },
                    {
                        "id_series": 1,
                        "type_series": 1,
                        "tilesUse": {"walls": true, "flor": false},
                        "layout": {"walls": "rectangular"}
                    },
                    {
                        "id_series": 2,
                        "type_series": 2,
                        "tilesUse": {"walls": false, "flor": true},
                        "layout": {"flor": "rectangular"}
                    }
                ];
            }
        };
    }]);
