angular.module('validateNotify',[])
.directive('validateNumber', [function () {
    return {
        templateUrl: 'components/validate-notify',
        scope: {
            val: '='
        }
    }
}]);