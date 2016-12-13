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

.controller('View1Ctrl', [ '$scope', 'Series', '$log', '$window', function($scope, Series, $log, $window) {

  $scope.regex = '^\\d+$'; // Validate numbers
  /**
   *
   * @param obj
   */
  $scope.formData = function (obj) {
    $scope.id_series = obj.id_series;
    $scope.tilesUse = {
      "walls": obj.tilesUse.walls,
      "flor": obj.tilesUse.flor
    };
    $scope.gutter = obj.gutter;
    $scope.layout = {
      "walls": obj.layout.walls || "rectangular",
      "flor": obj.layout.flor || "rectangular"
    };
    $scope.tiles = {
      "walls": obj.tiles.walls || {"height": "", "fields": [{},{}]},
      "flor": obj.tiles.flor || {}
    };
  };
  /**
   * Save State Form function. Trigger on some events
   * @param event (string) event name what trigger this function
   */
  $scope.saveSeriesState = function (event) {

    var series = {
      "id_series": $scope.id_series,
      "tilesUse": $scope.tilesUse,
      "gutter": $scope.gutter,
      "layout": $scope.layout,
      "tiles": {}
    };
    //series.tiles = {};
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
          "flor": $scope.tiles.flor,
          "walls": ""
        };
    }

    localStorage.setItem( 'saveStateEvent', event );
    localStorage.setItem( 'series', JSON.stringify( series ) );
  };

    /**
     * First init app
     */
    if( !localStorage.getItem( 'series' ) && angular.isUndefined( $scope.id_series ) ){
      $scope.series = Series.get();
      $scope.gutter = 3;
      $scope.layout = {"walls": "rectangular", "flor": "rectangular"};
    } else {
      /**
       * if field touched and localStorage have series object
       */
      $scope.series = JSON.parse( localStorage.getItem( 'series' ) );
      $scope.formData($scope.series);

    }


  /**
   * When click on next step button or some step button link on nav
   */
  $scope.$on('$destroy', function () {
    if( !angular.isUndefined( $scope.id_series ) )
      $scope.saveSeriesState('destroy');
  });

  /**
   * This event trigger saveSeriesState when page: [reload, close,]
   * @param e (object) optional
   */
  window.onunload = function ( e ) {
    if( !angular.isUndefined( $scope.id_series ) && localStorage.getItem('saveStateEvent') != 'restart' ){
      $scope.saveSeriesState('unload');
    } else {
      $scope.id_series = undefined;
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

        $scope.tilesUse = series.tilesUse || {"walls": true, "flor": true};
        $log.log(series);
        if(series) {
          if(series.tiles.walls.fields) {
            $scope.tiles.walls.fields = series.tiles.walls.fields || [{},{}];
          } else {
            $scope.tiles = {};
            $scope.tiles.walls = {};
            $scope.tiles.walls.fields = [{},{}];
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
          } else {
            $scope.tiles = {};
            $scope.tiles.walls = {};
            $scope.tiles.walls.fields = [{},{}];
          }
        } else {
          $scope.tiles = {};
          $scope.tiles.walls = {};
          $scope.tiles.walls.fields = [{},{}];
        }
        break;
      case 2:
        $log.log(series);
          if(series){
            if( series.tiles.flor ) {
              $scope.tiles.flor = series.tiles.flor;
            }
          } else {
            $scope.tiles = {};
            $scope.tiles.flor = {};
          }
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
