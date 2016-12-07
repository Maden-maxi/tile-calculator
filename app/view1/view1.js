'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', 'uiMask.ConfigProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });

}])

.controller('View1Ctrl', [ '$scope', '$http', '$log', '$window', function($scope, $http, $log, $window) {

  $scope.regex = '^\\d+$'; // Validate numbers

  $http.get('view1/series.json').then(function (res) {
    /**
     * First init app
     */
    if( !localStorage.getItem( 'series' ) ){
      $scope.series = res.data;
      $scope.gutter = 3;

      $scope.layout = {"walls": "rectangular", "flor": "rectangular"};

    } else {
      /**
       * if field touched and localStorage have series object
       */
      $scope.series = JSON.parse( localStorage.getItem( 'series' ) );

      $log.log($scope.series, 25);
      $scope.id_series = $scope.series.id_series;
      $scope.tilesUse = {
        "walls": $scope.series.tilesUse.walls,
        "flor": $scope.series.tilesUse.flor
      };
      $scope.gutter = $scope.series.gutter;
      $scope.layout = {
        "walls": $scope.series.layout.walls || "rectangular",
        "flor": $scope.series.layout.flor || "rectangular"
      };
      $scope.tiles = {
        "walls": $scope.series.tiles.walls || {"height": "", "fields": [{},{}]},
        "flor": $scope.series.tiles.flor
      };
    }

  });
  /**
   * Save State Form function. Trigger on some events
   * @param event (string) event name what trigger this function
   */
  $scope.saveSeriesState = function (event) {

    var series = {
      "id_series": $scope.id_series,
      "tilesUse": $scope.tilesUse,
      "gutter": $scope.gutter,
      "layout": $scope.layout
    };
    series.tiles = {};
    switch (series.id_series) {
      case 0:

        if(series.tilesUse.walls) {
          series.tiles.walls = {
            "height": $scope.tiles.walls.height,
            "fields": $scope.tiles.walls.fields
          }
        }
        if(series.tilesUse.flor) {
          series.tiles.flor = $scope.tiles.flor;
        }
        break;
      case 1:
        series.tiles.walls = {
          "height": $scope.tiles.walls.height,
          "fields": $scope.tiles.walls.fields
        };
        break;
      case 2:
        series.tiles = {
          "flor": $scope.tiles.flor
        };
    }

    localStorage.setItem( 'saveStateEvent', event );
    localStorage.setItem( 'series', JSON.stringify( series ) );
  };


  /**
   * When click on next step button or some step button link on nav
   */
  $scope.$on('$destroy', function () {
    $scope.saveSeriesState('destroy');
  });

  /**
   * This event trigger saveSeriesState when page: [reload, close,]
   * @param e (object) optional
   */
  window.onunload = function (e) {
      if( localStorage.getItem('saveStateEvent') != 'restart' ) {
          $scope.saveSeriesState('onunload');
      } else {
        localStorage.clear();
      }

  };

  /**
   * Watch on id_series changes
   */
  $scope.$watch('id_series', function (newValue, oldValue, scope) {

    var series = JSON.parse(localStorage.getItem('series')) || false;
    switch (newValue) {
      case 0:
        $scope.tilesUse = {"walls": true, "flor": true};
        $log.log(series);
        if(series) {
          if(series.tiles.walls.fields) {
            $scope.tiles.walls.fields = series.tiles.walls.fields;
          }
        } else {
          $scope.tiles = {};
          $scope.tiles.walls = {};
          $scope.tiles.walls.fields = [{},{}];
        }
        break;
      case 1:
        $scope.tilesUse = {"walls": true, "flor": false};
        $log.log(series);
        if (series) {
          if( series.tiles.walls.fields ) {
            $scope.tiles.walls.fields = series.tiles.walls.fields;
          }
        } else {
          $scope.tiles = {};
          $scope.tiles.walls = {};
          $scope.tiles.walls.fields = [{},{}];
        }
        break;
      case 2:
        $scope.tilesUse = {"walls": false, "flor": true};
        break;
    }

  });
  /**
   * Adding walls fields
   */
  $scope.popWall = function () {
    $scope.tiles.walls.fields.pop();
  };
  $scope.pushWall = function () {
    $scope.tiles.walls.fields.push({});
  };

}]);
