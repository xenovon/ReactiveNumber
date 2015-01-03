'use strict';


var reactiveController = angular.module('reactiveController', []);
var modalInstance;
reactiveController.controller('GlobalCtrl', ['$scope', '$modal', function ($scope, $modal) {


}]);

reactiveController.controller('Game',['$scope', '$routeParams',
  function($scope, $routeParams) {
  	$scope.command=$routeParams.command;
}]);

reactiveController.controller('About',['$scope', function($scope){

}]);
reactiveController.controller('HighScore',['$scope', function($scope){

}]);
reactiveController.controller('Home',['$scope', function($scope){

}]);
reactiveController.controller('HowTo',['$scope','$http', function($scope, $http){

}]);