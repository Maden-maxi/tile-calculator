'use strict';

angular.module('myApp.view3', ['ui.router'])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state({
            name: 'step3',
            url: '/step3',
            templateUrl: 'views/step3.html',
            controller: 'View3Ctrl'
        });

    }])

    .controller('View3Ctrl', [ '$scope', function($scope) {
        $scope.stats = JSON.parse(localStorage.getItem('series'));
    }]);