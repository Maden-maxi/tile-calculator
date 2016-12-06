'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', 'uiMask.ConfigProvider', function($routeProvider, uiMaskConfigProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });

}])

.controller('View1Ctrl', [ '$scope', '$http', '$log', '$window' ,function($scope, $http, $log, $window) {
  /*
  * f - flor
  * w - wall
  * fw - flor&wall
  * */
  $scope.maskIntNum = '99999';

  $http.get('view1/series.json',{}).then(function (res) {

    $scope.initialStateSeries = res.data;
  });

  $scope.$watch('id_series', function (newValue, oldValue, scope) {
    $log.log(newValue, oldValue, scope);
    switch (newValue) {
      case 0:
        $scope.flor = true;
        $scope.wall = false;
        break;
      case 1:
        $scope.flor = false;
        $scope.wall = true;
        break;
      case 2:
        $scope.flor = $scope.wall = true;
    }
  });

  $scope.walls = [{},{},{},{}];
  $scope.popWall = function () {
    $scope.walls.pop();
  };
  $scope.pushWall = function () {
    $scope.walls.push({});
  };

  $scope.$watch('walls', function (newVal, oldVal, scope) {
    $log.log();
  });

  $scope.wallHeight = '';



  $scope.gutter = 3;
  $scope.florLayout = {name:'Прямоугольная', icon: 'grid_on'};
  $scope.wallLayout = {name:'Прямоугольная', icon: 'grid_on'};

  var myWindow = angular.element($window); // Name the variable whatever makes sense
  $log.log(myWindow);

  myWindow.onload = function (e) {
    console.log(e);
  };

  myWindow.on("load", function(e) {
    // Do something
    $log.log(e);
  });
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
  $scope.$on('$destroy', function () {
    $window.alert('destroy');

    var obj = {
      "id_series": $scope.id_series,
      "gutter": $scope.gutter,
      "tiles": {
        "Walls": $scope.walls,
        "Flor": $scope.Flor
      }
    };
    var toStore = JSON.stringify(obj);
    localStorage.setItem('someKey', toStore);
  });
  $log.log(localStorage.getItem('someKey'));
  var i = 0;
  // Когда текщяя вкладка перезагружаеться или переход на другую страницу или закритие вкладки
  window.onunload = function (e) {
    var obj = {
      "id_series": $scope.id_series
    };
    if($scope.wall) obj.wall = {};
    if($scope.flor) obj.flor = {};
    var toStore = JSON.stringify(obj);
    localStorage.setItem('someKey', toStore);
  }

}]);
