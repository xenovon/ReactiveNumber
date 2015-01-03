'use strict';

var reactiveNumber = angular.module('reactiveNumber', [
  'reactiveController','ngRoute'
]);

reactiveNumber.directive('backButton', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('click', goBack);
        function goBack() {
          history.back();
          scope.$apply();
        }
      }
    }
});

reactiveNumber.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/high-score',{
            templateUrl:'html/_high-score.html',
            controller:'HighScore'
        }).
         when('/',{
            templateUrl:'html/_home.html',
            controller:'Home'
        }).    
         when('/how-to',{
            templateUrl:'html/_how-to.html',
            controller:'HowTo'
        }).
        when('/game/:command',{
            templateUrl:'html/_game.html',
            controller:'Game'
        }).
        when('/about',{
            templateUrl:'html/_about.html',
            controller:'About'
        }).                                                 
        otherwise({
            redirectTo:'/'
        });
  }]);


