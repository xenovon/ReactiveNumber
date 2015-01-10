'use strict';

var reactiveNumber = angular.module('reactiveNumber', [
  'reactiveController','ngRoute','ngAnimate','ngDialog'
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
            redirectTo:'/game/continue'
        });
  }]);

reactiveNumber.directive('animateOnChange',['$animate',function($animate){
  return function(scope, elem, attr) {
    console.log(attr.animateOnChange);
      scope.$watch(attr.animateOnChange, function(nv,ov) {
        if (nv!=ov) {
          var c = 'change';
          $animate.addClass(elem,c).then(function() {
            $animate.removeClass(elem,c);
            console.log('fallback');
          });
        }
      });
   };
}]);

reactiveNumber.directive('animateBoard',['$animate','$timeout', function($animate,$timeout) {
  return function(scope, elem, attr) {
      scope.$watch(attr.animateBoard, function(nv,ov) {
        var classname='';
        if(nv!=ov){
          if(nv>ov){
            classname='changeup';
          }else{
            classname='changedown';
          }
          if(nv==0){
            classname='changezero';
          }
          if(ov==0 && nv!=0){
            classname='changeadd';
          }
          // console.log('From '+ov+' to '+nv+' '+classname+' '+attr.x+' '+attr.y+' '+scope.uiState.multipolar);
          // if(nv>999){
          //   elem.children().addClass('font-small');
          // }else{
          //   elem.children().removeClass('font-small');
          // }
          $animate.addClass(elem.children(),classname).then(function() {
            $animate.removeClass(elem.children(),classname);
          });
        }


      });
   };
}]);
/*
  ada dua, val dan pos
*/
reactiveNumber.directive('animateTurnValue',['$animate','$timeout', function($animate,$timeout) {
  return function(scope, elem, attr) {
      scope.$watch(attr.animateTurnValue.val, function(nv,ov) {
        var pos=attr.animateTurnValue.pos;
        if(pos==0){

        }else if(pos==1){

        }else{

        }
      });
   };
}]);

reactiveNumber.config(['$animateProvider', 
  function($animateProvider){
  // restrict animation to elements with the bi-animate css class with a regexp.
  $animateProvider.classNameFilter(/^((?!(bar-fill)).)*$/);

}]);

