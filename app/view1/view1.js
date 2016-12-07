'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', 'uiMask.ConfigProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });

}])

.controller('View1Ctrl', [ '$scope', '$http', '$log', '$window', function($scope, $http, $log, $window) {

  $scope.maskIntNum = '99999';

  $scope.regex = '^\\d+$'; // Validate numbers

  $http.get('view1/series.json').then(function (res) {

    if( !localStorage.getItem( 'series' ) ){
      $scope.series = res.data;
      $scope.gutter = 3;
      //$scope.tiles.walls.fields = [{},{}];
      $scope.layout = {"walls": "rectangular", "flor": "rectangular"};

      $window.alert('if');
    } else {
      $scope.series = JSON.parse( localStorage.getItem( 'series' ) );
      $window.alert('else');
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



  $scope.$on('$destroy', function () {
    $window.alert('destroy');
    $scope.saveSeriesState('destroy');
  });

  // Когда текщяя вкладка перезагружаеться или переход на другую страницу или закритие вкладки
  /*window.onunload = function (e) {
      $scope.saveSeriesState('onunload');
  };*/

  //$scope.id_series = ( !localStorage.getItem('id_series') ) ? undefined : localStorage.getItem('id_series');


  $scope.$watch('id_series', function (newValue, oldValue, scope) {
    //$log.log(newValue, oldValue, scope);
    //$window.alert(newValue);
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
    /*$http.get('view1/series.json').then( function (res) {
      $scope.initProps = res.data[newValue];
      $log.log($scope.initProps);
      // $scope.tilesUse = $scope.initProps.tilesUse;
      //$scope.layout = $scope.initProps[newValue].layout;
    });*/


  });

  $scope.popWall = function () {
    $scope.tiles.walls.fields.pop();
  };
  $scope.pushWall = function () {
    $scope.tiles.walls.fields.push({});
  };

  /*
  window.onbeforeunload = function(e) {
    console.log(e);
    $scope.$apply(function (scope) {
      $log.log(scope);
    });
    return "Данные не сохранены. Точно перейти?";
  };
  */
  /**
   * События при которых текущее состояние формы
   */
  //Когда форма удаляеться с DOM дерема

  $scope.twoStep = function ($event) {
    $scope.saveSeriesState('nextStepEvent');

  };
  //очистить хранилище
  $scope.clearForm = function () {
    localStorage.clear();
    localStorage.setItem('resetForm', true);
    //location.assign('/');
    // stats.reset();
    // location.reload();
  };

  $log.log( localStorage.getItem('series') );

}]);
