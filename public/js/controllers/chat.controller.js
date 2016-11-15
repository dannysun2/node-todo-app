(function(window, angular, undefined){
  angular.module('chatApp')
    .controller("mainCtrl", ['$rootScope','$scope', function($rootScope, $scope){
      var vm = this;
      vm.greeting = "Hello, World"

    }])
})(window, window.angular);
