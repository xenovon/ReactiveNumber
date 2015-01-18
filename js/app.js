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

reactiveNumber.directive('animateOnIncrease',['$animate',function($animate){
  return function(scope, elem, attr) {
    console.log(attr.animateOnChange);
      scope.$watch(attr.animateOnChange, function(nv,ov) {
        if (nv>ov) {
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
          $animate.addClass(elem.children(),classname).then(function() {
            $animate.removeClass(elem.children(),classname);
          });
        }


      });
   };
}]);

/*Format Score 
  var score={score:
             name : opsional/ngga ada dilokal
             date :
             level:
             max_combo:
             turn :
             scores : 
             }
*/  
reactiveNumber.service('scoreService',function(){
  var key="hs";
  var itemPerPage=20;
  this.saveHighScore=function(score){
    var scoreData=getArray();
    if(scoreData==undefined){
      scoreData=[];
    }
    score['scores']=generateScores(score)
    scoreData.push(score);
    scoreData.sort(dynamicSort('-score'));

    if(scoreData.length>100){
      scoreData.pop();
    }
    localStorage.setItem(enc(key),enc(JSON.stringify(scoreData)));

  }
  function generateScores(scores){
    var score=scores.score;
    var level=scores.level;
    var date=scores.date;
    var max_combo=scores.max_combo;
    var turn=scores.turn;
    return Math.ceil(score*level/date.getHours()+date.getMilliseconds()/4+max_combo/turn);
  }
  this.getPageCount=function(){
    var scoreData=getArray();
    if(scoreData==undefined){
      return 0;
    }
    return  Math.ceil(scoreData.length/itemPerPage);

  }
  /* Sort by date / high */
  this.getList=function(sortBy,page){
    var scoreData=getArray();
    if(scoreData==undefined){
      return undefined;
    }
    scoreData.sort(dynamicSort(sortBy));
    scoreData=scoreData.slice((page-1)*itemPerPage,(page-1)*itemPerPage+20);
    console.log('Length ' +scoreData.length);
    return scoreData;
  }
  function getArray(){
    var temp=localStorage.getItem(enc(key));
    if(temp!=undefined){
      return JSON.parse(enc(temp));
    }else{
      return undefined;
    }

  }
  function dynamicSort(property) {
      var sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
      }
  }
  this.getHighestScore=function(){
    var scoreData=getArray();
    if(scoreData==undefined){
      return scoreData;
    }
    scoreData.sort(dynamicSort('-score'));  
    return scoreData.shift();  
  }

  function enc(uncoded) {
     var result = "";
     var key=c.match;
     console.log(key +' Key');
     for(i=0; i<uncoded.length;i++)
     {
         result += String.fromCharCode(key^uncoded.charCodeAt(i));
     }
    return result;  
  }  

  
});
reactiveNumber.config(['$animateProvider', 
  function($animateProvider){
  // restrict animation to elements with the bi-animate css class with a regexp.
  $animateProvider.classNameFilter(/^((?!(bar-fill)).)*$/);

}]);

